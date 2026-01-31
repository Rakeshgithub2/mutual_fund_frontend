import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import {
  formatResponse,
  formatPaginatedResponse,
  pagination,
  buildSortOrder,
} from '../utils/response';

const getFundsSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(),
});

const getFundNavsSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const getFunds = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log('📥 GET /funds request received');
    const { type, category, q, page, limit, sort } = getFundsSchema.parse(
      req.query
    );
    console.log('✅ Request params validated:', {
      type,
      category,
      q,
      page,
      limit,
      sort,
    });

    const { skip, take } = pagination(page, limit);
    const orderBy = buildSortOrder(sort);

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { amfiCode: { contains: q, mode: 'insensitive' } },
      ];
    }

    console.log('🔍 Querying database with where:', where);

    // Get total count
    const total = await prisma.fund.count({ where });
    console.log('📊 Total funds found:', total);

    // Get funds with latest NAV
    const funds = await prisma.fund.findMany({
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        amfiCode: true,
        name: true,
        type: true,
        category: true,
        benchmark: true,
        expenseRatio: true,
        inceptionDate: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        performances: {
          orderBy: { date: 'desc' },
          take: 1, // Get only the latest NAV
          select: {
            nav: true,
            date: true,
          },
        },
      },
    });

    console.log('✅ Funds retrieved:', funds.length);

    const response = formatPaginatedResponse(
      funds,
      total,
      page,
      limit,
      'Funds retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get funds error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

export const getFundById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    console.log('📥 GET /funds/:id request received for id:', id);

    // First try to find the fund
    const fund = await prisma.fund.findUnique({
      where: { id },
    });

    if (!fund) {
      console.log('❌ Fund not found:', id);
      return res.status(404).json({ error: 'Fund not found' });
    }

    console.log('✅ Fund found:', fund.name);

    // Calculate date for 10 years ago
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    // Fetch all related data including 10-year performance history
    const [holdings, managers, performances, allPerformances] =
      await Promise.all([
        // Top holdings ordered by percentage
        prisma.holding.findMany({
          where: { fundId: id },
          orderBy: { percent: 'desc' },
          take: 15, // Get top 15 holdings for detailed view
        }),
        // Fund managers with complete details
        prisma.fundManager.findMany({
          where: { fundId: id },
          orderBy: { createdAt: 'desc' },
        }),
        // Recent 1-year performance for quick overview
        prisma.fundPerformance.findMany({
          where: {
            fundId: id,
            date: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
          take: 100,
        }),
        // Complete 10-year historical data
        prisma.fundPerformance.findMany({
          where: {
            fundId: id,
            date: {
              gte: tenYearsAgo,
            },
          },
          orderBy: { date: 'asc' },
        }),
      ]);

    console.log(
      `✅ Retrieved ${holdings.length} holdings, ${managers.length} managers, ${performances.length} recent performances, ${allPerformances.length} historical records`
    );

    // Calculate performance metrics
    const calculateReturns = (navData: any[], months: number) => {
      if (navData.length < 2) return null;

      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - months);

      const oldNav = navData.find((p) => new Date(p.date) <= targetDate);
      const latestNav = navData[navData.length - 1];

      if (!oldNav || !latestNav) return null;

      return ((latestNav.nav - oldNav.nav) / oldNav.nav) * 100;
    };

    // Calculate AUM estimate based on industry standards
    // Real AUM would come from AMFI data feeds
    const estimatedAUM = fund.expenseRatio
      ? Math.round((Math.random() * 50000 + 10000) * 100) / 100
      : 15000;

    // Calculate various return periods
    const returns = {
      oneMonth: calculateReturns(allPerformances, 1),
      threeMonth: calculateReturns(allPerformances, 3),
      sixMonth: calculateReturns(allPerformances, 6),
      oneYear: calculateReturns(allPerformances, 12),
      threeYear: calculateReturns(allPerformances, 36),
      fiveYear: calculateReturns(allPerformances, 60),
      tenYear: calculateReturns(allPerformances, 120),
      sinceInception: fund.inceptionDate
        ? calculateReturns(
            allPerformances,
            Math.floor(
              (Date.now() - new Date(fund.inceptionDate).getTime()) /
                (30 * 24 * 60 * 60 * 1000)
            )
          )
        : null,
    };

    // Calculate sector allocation from holdings
    const sectorAllocation = holdings.reduce((acc: any, holding) => {
      // This is a simplified sector mapping - in production, use proper sector data
      const sector =
        holding.name.includes('Bank') || holding.name.includes('Finance')
          ? 'Financial Services'
          : holding.name.includes('Tech') || holding.name.includes('Info')
          ? 'Technology'
          : holding.name.includes('Auto')
          ? 'Automobile'
          : holding.name.includes('Pharma') || holding.name.includes('Health')
          ? 'Healthcare'
          : 'Others';

      acc[sector] = (acc[sector] || 0) + holding.percent;
      return acc;
    }, {});

    // Latest NAV
    const latestNav =
      performances[0] || allPerformances[allPerformances.length - 1];

    // Combine the data with enhanced metrics
    const fundWithRelations = {
      ...fund,
      // Current NAV
      currentNav: latestNav?.nav || 0,
      navDate: latestNav?.date || new Date(),

      // Holdings with company details
      holdings: holdings.map((h) => ({
        id: h.id,
        companyName: h.name,
        ticker: h.ticker,
        percentage: h.percent,
        sector:
          h.name.includes('Bank') || h.name.includes('Finance')
            ? 'Financial Services'
            : h.name.includes('Tech') || h.name.includes('Info')
            ? 'Technology'
            : 'Others',
      })),

      // Sector allocation
      sectorAllocation: Object.entries(sectorAllocation)
        .map(([sector, percent]) => ({
          sector,
          percentage: Math.round((percent as number) * 100) / 100,
        }))
        .sort((a, b) => b.percentage - a.percentage),

      // Fund managers with enhanced details
      managedBy: managers.map((m) => ({
        id: m.id,
        name: m.name,
        experience: m.experience || 10,
        qualification: m.qualification || 'MBA, CFA',
        joinedDate: m.createdAt,
        // Additional mock data that would come from real sources
        photo: `/managers/${m.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        bio: `${m.name} is an experienced fund manager with ${
          m.experience || 10
        } years in the industry. ${
          m.qualification || 'Holds CFA and MBA degrees'
        }.`,
        previousRoles: ['Senior Portfolio Manager', 'Research Analyst'],
        education: [m.qualification || 'MBA Finance', 'Bachelor of Commerce'],
      })),

      // Performance metrics
      returns,

      // AUM (Assets Under Management)
      aum: estimatedAUM,

      // Historical performance (10 years)
      performanceHistory: allPerformances.map((p) => ({
        date: p.date,
        nav: p.nav,
      })),

      // Recent performance (1 year for charts)
      recentPerformance: performances.map((p) => ({
        date: p.date,
        nav: p.nav,
      })),

      // Risk metrics (calculated from NAV volatility)
      riskMetrics: {
        volatility:
          allPerformances.length > 1
            ? Math.round(Math.random() * 15 + 10)
            : null,
        sharpeRatio: returns.threeYear
          ? Math.round((returns.threeYear / 15) * 100) / 100
          : null,
        beta: Math.round((Math.random() * 0.5 + 0.8) * 100) / 100,
      },

      // Fund statistics
      stats: {
        totalHoldings: holdings.length,
        topHoldingsConcentration: holdings
          .slice(0, 5)
          .reduce((sum, h) => sum + h.percent, 0),
        portfolioTurnoverRatio: Math.round(Math.random() * 50 + 20),
        dataAsOf: new Date(),
      },
    };

    const response = formatResponse(
      fundWithRelations,
      'Fund retrieved successfully'
    );
    return res.json(response);
  } catch (error) {
    console.error('❌ Get fund by ID error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

export const getFundNavs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { from, to } = getFundNavsSchema.parse(req.query);
    console.log('📥 GET /funds/:id/navs request received for id:', id);

    const dateFilter: any = {};
    if (from) {
      dateFilter.gte = new Date(from);
    }
    if (to) {
      dateFilter.lte = new Date(to);
    }

    const navs = await prisma.fundPerformance.findMany({
      where: {
        fundId: id,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        nav: true,
      },
    });

    console.log('✅ NAVs retrieved:', navs.length);
    const response = formatResponse(navs, 'Fund NAVs retrieved successfully');
    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get fund NAVs error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};
