import { Request, Response } from 'express';
import { z } from 'zod';
import { mongodb } from '../db/mongodb';
import {
  formatResponse,
  formatPaginatedResponse,
  pagination,
  buildSortOrder,
} from '../utils/response';
import { ObjectId } from 'mongodb';
import { enrichFundData } from '../utils/fundMetrics';
// import { cacheService, CacheService } from '../services/cacheService';

interface Fund {
  _id?: ObjectId;
  amfiCode: string;
  name: string;
  type?: string;
  category: string;
  subCategory?: string;
  benchmark?: string;
  expenseRatio?: number;
  inceptionDate?: Date;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const getFundsSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  q: z.string().optional(), // search query
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(), // field:direction (e.g., name:asc, createdAt:desc)
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
    const { type, category, subCategory, q, page, limit, sort } =
      getFundsSchema.parse(req.query);
    console.log('✅ Request params validated:', {
      type,
      category,
      subCategory,
      q,
      page,
      limit,
      sort,
    });

    const { skip, take } = pagination(page, limit);

    // Build MongoDB query
    const query: any = {
      isActive: { $ne: false }, // Include funds where isActive is true or undefined
    };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') }; // Case-insensitive exact match
    }

    if (subCategory) {
      query.subCategory = { $regex: new RegExp(`^${subCategory}$`, 'i') }; // Case-insensitive exact match
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { amfiCode: { $regex: q, $options: 'i' } },
      ];
    }

    console.log('🔍 MongoDB query:', JSON.stringify(query, null, 2));

    // Get collection
    const fundsCollection = mongodb.getCollection<Fund>('funds');

    // Get total count
    const total = await fundsCollection.countDocuments(query);
    console.log('📊 Total funds matching query:', total);

    // Build sort
    const sortObj: any = { createdAt: -1 }; // Default sort
    if (sort) {
      const [field, direction] = sort.split(':');
      sortObj[field] = direction === 'asc' ? 1 : -1;
    }

    // Get funds with all necessary fields for comparison and display
    const funds = await fundsCollection
      .find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .project({
        _id: 1,
        amfiCode: 1,
        fundId: 1,
        name: 1,
        type: 1,
        category: 1,
        subCategory: 1,
        fundType: 1,
        fundHouse: 1,
        benchmark: 1,
        expenseRatio: 1,
        inceptionDate: 1,
        launchDate: 1,
        description: 1,
        aum: 1,
        currentNav: 1,
        previousNav: 1,
        navDate: 1,
        returns: 1,
        riskMetrics: 1,
        ratings: 1,
        popularity: 1,
        minInvestment: 1,
        sipMinAmount: 1,
        exitLoad: 1,
        tags: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .toArray();

    console.log('✅ Funds retrieved:', funds.length);

    // Get performance data for each fund to calculate metrics
    const performancesCollection = mongodb.getCollection('fund_performances');

    // Transform and enrich funds with calculated metrics
    const transformedFunds = await Promise.all(
      funds.map(async (fund) => {
        const baseFundData = {
          id: fund._id?.toString(),
          ...fund,
          _id: undefined,
        };

        // If fund already has returns and risk metrics in DB, use them
        if (fund.returns && fund.riskMetrics) {
          return baseFundData;
        }

        // Otherwise, calculate them (only for first page to avoid performance issues)
        if (page === 1) {
          try {
            const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            const performances = await performancesCollection
              .find({
                fundId: fund._id,
                date: { $gte: oneYearAgo },
              })
              .sort({ date: -1 })
              .limit(365)
              .toArray();

            if (performances.length > 30) {
              return enrichFundData(baseFundData, performances);
            }
          } catch (error) {
            console.error(`Error enriching fund ${fund._id}:`, error);
          }
        }

        return baseFundData;
      })
    );

    console.log('✅ Funds enriched with metrics');

    const response = formatPaginatedResponse(
      transformedFunds,
      total,
      page,
      limit,
      'Funds retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get funds error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFundById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    console.log(`📥 GET /funds/${id} request received`);

    // Get MongoDB collections
    const fundsCollection = mongodb.getCollection<Fund>('funds');
    const holdingsCollection = mongodb.getCollection('holdings');
    const managersCollection = mongodb.getCollection('fund_managers');
    const performancesCollection = mongodb.getCollection('fund_performances');

    // Find the fund
    const fund = await fundsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!fund) {
      console.log(`❌ Fund with ID ${id} not found`);
      return res.status(404).json({ error: 'Fund not found' });
    }

    // Get top 10 holdings
    const holdings = await holdingsCollection
      .find({ fundId: new ObjectId(id) })
      .sort({ percent: -1 })
      .limit(10)
      .toArray();

    // Get fund managers
    const managedBy = await managersCollection
      .find({ fundId: new ObjectId(id) })
      .project({
        _id: 1,
        name: 1,
        experience: 1,
        qualification: 1,
      })
      .toArray();

    // Get performance data for calculation (last 10 years for better metrics)
    const tenYearsAgo = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000);
    const performances = await performancesCollection
      .find({
        fundId: new ObjectId(id),
        date: { $gte: tenYearsAgo },
      })
      .sort({ date: -1 })
      .toArray();

    // Prepare base fund data
    const baseFundData = {
      id: fund._id.toString(),
      ...fund,
      _id: undefined,
    };

    // Enrich fund data with calculated metrics (returns, risk metrics, rating)
    const enrichedFund = enrichFundData(baseFundData, performances);

    // Combine all data with limited performance history for frontend
    const fundWithDetails = {
      ...enrichedFund,
      holdings: holdings.map((h: any) => ({
        id: h._id.toString(),
        ...h,
        _id: undefined,
        fundId: undefined,
      })),
      managedBy: managedBy.map((m: any) => ({
        id: m._id.toString(),
        ...m,
        _id: undefined,
        fundId: undefined,
      })),
      // Only send last 1 year of performance data to frontend
      performances: performances
        .filter((p: any) => {
          const perfDate = new Date(p.date);
          const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          return perfDate >= oneYearAgo;
        })
        .slice(0, 365)
        .map((p: any) => ({
          date: p.date,
          nav: p.nav,
        })),
      performanceHistory: performances
        .filter((p: any) => {
          const perfDate = new Date(p.date);
          const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          return perfDate >= oneYearAgo;
        })
        .slice(0, 365)
        .map((p: any) => ({
          date: p.date,
          nav: p.nav,
        })),
    };

    console.log(`✅ Fund ${fund.name} retrieved successfully with metrics:`, {
      returns: fundWithDetails.returns,
      riskMetrics: fundWithDetails.riskMetrics,
      riskLevel: fundWithDetails.riskLevel,
      rating: fundWithDetails.rating,
    });

    const response = formatResponse(
      fundWithDetails,
      'Fund details retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    console.error('❌ Get fund by ID error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFundNavs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { from, to } = getFundNavsSchema.parse(req.query);

    // Build MongoDB query for date filter
    const query: any = {
      fundId: new ObjectId(id),
    };

    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = new Date(from);
      }
      if (to) {
        query.date.$lte = new Date(to);
      }
    }

    const performancesCollection = mongodb.getCollection('fund_performances');

    const navs = await performancesCollection
      .find(query)
      .sort({ date: 1 })
      .project({
        _id: 0,
        date: 1,
        nav: 1,
      })
      .toArray();

    const response = formatResponse(navs, 'Fund NAVs retrieved successfully');

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get fund NAVs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchFunds = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query.query as string;
    const limit = Math.min(
      Number.parseInt(req.query.limit as string) || 15,
      50
    );
    const useExternal = req.query.external !== 'false'; // Default: true

    console.log(`📥 GET /funds/search request received with query: ${query}`);

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        message: 'Please enter at least 2 characters to search',
        data: [],
      });
    }

    // Use enhanced search service if external APIs enabled
    if (useExternal) {
      try {
        const { enhancedSearchService } =
          await import('../services/enhancedSearchService');
        const results = await enhancedSearchService.searchFunds(query, limit);

        console.log(
          `✅ Enhanced search found ${results.length} funds matching "${query}"`
        );

        return res.json({
          success: true,
          message: `Found ${results.length} funds`,
          data: results,
          enhancedSearch: true,
          note: results.some((r) => r.isNew)
            ? 'Some results were fetched from external APIs and saved to database'
            : 'All results from database',
        });
      } catch (error) {
        console.error(
          '❌ Enhanced search failed, falling back to database only:',
          error
        );
        // Fall through to database-only search
      }
    }

    // Fallback: Database-only search
    const fundsCollection = mongodb.getCollection<Fund>('funds');

    // Build search query - case insensitive search across name, fundHouse, and amfiCode
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { fundHouse: { $regex: query, $options: 'i' } },
        { amfiCode: { $regex: query, $options: 'i' } },
      ],
      isActive: { $ne: false },
    };

    const funds = await fundsCollection
      .find(searchQuery)
      .limit(limit)
      .project({
        _id: 1,
        fundId: 1,
        name: 1,
        fundHouse: 1,
        category: 1,
        subCategory: 1,
        fundManager: 1,
        fundManagerId: 1,
        aum: 1,
        returns: 1,
        currentNav: 1,
        expenseRatio: 1,
      })
      .toArray();

    const transformedFunds = funds.map((fund) => ({
      id: fund._id.toString(),
      fundId: fund.fundId || fund._id.toString(),
      ...fund,
      _id: undefined,
      source: 'database',
    }));

    console.log(
      `✅ Found ${transformedFunds.length} funds matching "${query}"`
    );

    return res.json({
      success: true,
      message: `Found ${transformedFunds.length} funds`,
      data: transformedFunds,
      enhancedSearch: false,
    });
  } catch (error) {
    console.error('❌ Search funds error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFundManager = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    console.log(`📥 GET /funds/${id}/manager request received`);

    // Get MongoDB collections
    const fundsCollection = mongodb.getCollection<Fund>('funds');
    const managersCollection = mongodb.getCollection('fund_managers');

    // Find the fund
    const fund = await fundsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!fund) {
      console.log(`❌ Fund with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    // Get fund manager details
    const managers = await managersCollection
      .find({ fundId: new ObjectId(id) })
      .toArray();

    if (!managers || managers.length === 0) {
      console.log(`⚠️ No manager found for fund ${fund.name}`);
      return res.status(404).json({
        success: false,
        error: 'Manager not found',
        message: `The fund manager for "${fund.name}" is not in our database yet.`,
        data: {
          fund: {
            fundId: fund._id.toString(),
            name: fund.name,
            category: fund.category,
            fundHouse: fund.fundHouse,
          },
          manager: null,
        },
      });
    }

    // Get the primary manager (first one)
    const primaryManager = managers[0];

    // Get all funds managed by this manager
    const managerFunds = await fundsCollection
      .find({
        _id: { $in: managers.map((m) => m.fundId) },
      })
      .project({
        _id: 1,
        name: 1,
        category: 1,
        aum: 1,
        returns: 1,
      })
      .toArray();

    // Calculate total AUM and average returns
    const totalAum = managerFunds.reduce((sum, f) => sum + (f.aum || 0), 0);
    const avgReturns = {
      oneYear:
        managerFunds.reduce((sum, f) => sum + (f.returns?.oneYear || 0), 0) /
        managerFunds.length,
      threeYear:
        managerFunds.reduce((sum, f) => sum + (f.returns?.threeYear || 0), 0) /
        managerFunds.length,
      fiveYear:
        managerFunds.reduce((sum, f) => sum + (f.returns?.fiveYear || 0), 0) /
        managerFunds.length,
    };

    // Format the manager data
    const managerDetails = {
      id: primaryManager._id.toString(),
      managerId: primaryManager._id.toString(),
      name: primaryManager.name,
      bio:
        primaryManager.bio || `Experienced fund manager at ${fund.fundHouse}`,
      experience: primaryManager.experience || 0,
      qualification: primaryManager.qualification || [],
      currentFundHouse: fund.fundHouse,
      designation: primaryManager.designation || 'Fund Manager',
      joinedDate: primaryManager.joinedDate || fund.inceptionDate,
      fundsManaged: managerFunds.length,
      fundsList: managerFunds.map((f: any) => ({
        fundId: f._id.toString(),
        fundName: f.name,
        aum: f.aum || 0,
        returns: {
          oneYear: f.returns?.oneYear || 0,
          threeYear: f.returns?.threeYear || 0,
          fiveYear: f.returns?.fiveYear || 0,
        },
      })),
      totalAumManaged: totalAum,
      averageReturns: avgReturns,
      awards: primaryManager.awards || [],
      email: primaryManager.email,
      linkedin: primaryManager.linkedin,
      twitter: primaryManager.twitter,
      isActive: primaryManager.isActive !== false,
      lastUpdated: primaryManager.updatedAt || new Date().toISOString(),
    };

    const responseData = {
      fund: {
        fundId: fund._id.toString(),
        name: fund.name,
        category: fund.category,
        fundHouse: fund.fundHouse,
      },
      manager: managerDetails,
    };

    console.log(
      `✅ Manager ${managerDetails.name} found for fund ${fund.name}`
    );

    return res.json({
      success: true,
      message: 'Fund manager retrieved successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('❌ Get fund manager error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
