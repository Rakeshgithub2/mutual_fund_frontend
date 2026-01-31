import { Router } from 'express';
import {
  getFunds,
  getFundById,
  getFundNavs,
  getFundManager,
  searchFunds,
} from '../controllers/funds';

const router = Router();

router.get('/search', searchFunds);
router.get('/', getFunds);
router.get('/:id', getFundById);
router.get('/:id/navs', getFundNavs);
router.get('/:id/manager', getFundManager);
router.get('/:id/holdings', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 15;
    const { mongodb } = await import('../db/mongodb');
    const { ObjectId } = await import('mongodb');

    const holdingsCollection = mongodb.getCollection('holdings');
    const holdings = await holdingsCollection
      .find({ fundId: new ObjectId(id) })
      .sort({ percent: -1 })
      .limit(limit)
      .toArray();

    return res.json({
      success: true,
      data: {
        holdings: holdings.map((h) => ({
          ...h,
          _id: h._id.toString(),
          fundId: undefined,
        })),
      },
      message: 'Holdings retrieved successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch holdings' });
  }
});

router.get('/:id/sectors', async (req, res) => {
  try {
    const { id } = req.params;
    const { mongodb } = await import('../db/mongodb');
    const { ObjectId } = await import('mongodb');

    // Get holdings and aggregate by sector
    const holdingsCollection = mongodb.getCollection('holdings');
    const holdings: any[] = await holdingsCollection
      .find({ fundId: new ObjectId(id) })
      .toArray();

    // Aggregate by sector
    const sectorMap = new Map<string, { sector: string; percentage: number }>();

    holdings.forEach((holding: any) => {
      const sector = holding.sector || 'Others';
      if (sectorMap.has(sector)) {
        const existing = sectorMap.get(sector)!;
        existing.percentage += holding.percent || 0;
      } else {
        sectorMap.set(sector, { sector, percentage: holding.percent || 0 });
      }
    });

    const sectors = Array.from(sectorMap.values()).sort(
      (a, b) => b.percentage - a.percentage
    );

    return res.json({
      success: true,
      data: { sectors },
      message: 'Sector allocation retrieved successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch sectors' });
  }
});

router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    const { mongodb } = await import('../db/mongodb');
    const { ObjectId } = await import('mongodb');

    // Get fund
    const fundsCollection = mongodb.getCollection('funds');
    const fund = await fundsCollection.findOne({ _id: new ObjectId(id) });

    if (!fund) {
      return res.status(404).json({ success: false, error: 'Fund not found' });
    }

    // Get holdings (top 15)
    const holdingsCollection = mongodb.getCollection('holdings');
    const holdings: any[] = await holdingsCollection
      .find({ fundId: new ObjectId(id) })
      .sort({ percent: -1 })
      .limit(15)
      .toArray();

    // Calculate sector allocation
    const sectorMap = new Map<string, { sector: string; percentage: number }>();
    holdings.forEach((holding: any) => {
      const sector = holding.sector || 'Others';
      if (sectorMap.has(sector)) {
        const existing = sectorMap.get(sector)!;
        existing.percentage += holding.percent || 0;
      } else {
        sectorMap.set(sector, { sector, percentage: holding.percent || 0 });
      }
    });
    const sectorAllocation = Array.from(sectorMap.values()).sort(
      (a, b) => b.percentage - a.percentage
    );

    // Get fund manager
    const managersCollection = mongodb.getCollection('fund_managers');
    const managers = await managersCollection
      .find({ fundId: new ObjectId(id) })
      .toArray();

    const details = {
      ...fund,
      id: fund._id.toString(),
      _id: undefined,
      fundManager:
        managers.length > 0
          ? {
              name: managers[0].name,
              experience: managers[0].experience || 0,
              since: managers[0].joinedDate,
            }
          : { name: 'Not Available', experience: 0 },
      holdings: holdings.map((h: any) => ({
        companyName: h.name,
        sector: h.sector || 'Others',
        percentage: h.percent || 0,
      })),
      sectorAllocation,
      assetAllocation: {
        equity: fund.category === 'equity' ? 95 : 65,
        debt:
          fund.category === 'debt' ? 95 : fund.category === 'equity' ? 2 : 30,
        cash: 3,
        others: 0,
      },
    };

    return res.json({
      success: true,
      data: details,
      message: 'Complete fund details retrieved successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Failed to fetch fund details' });
  }
});

export default router;
