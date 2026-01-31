'use server';

import { getDb } from '@/lib/mongodb';
import { normalizeCategory } from '@/lib/category-mapping';

// Transform MongoDB fund document to frontend format
function transformFund(fund: any) {
  const transformed = {
    id: fund.schemeCode?.toString() || fund._id?.toString(),
    schemeCode: fund.schemeCode?.toString() || '',
    name: fund.schemeName || fund.name || '',
    fundHouse: fund.amc?.name || fund.amcName || fund.fundHouse || '',
    category: fund.category || '',
    subCategory: fund.subCategory || '',
    schemeType: fund.schemeType || fund.fundType || '',
    nav: fund.nav?.value || fund.nav || fund.currentNav || 0,
    returns1Y:
      fund.returns?.['1Y'] || fund.returns?.oneYear || fund.returns1Y || 0,
    returns3Y:
      fund.returns?.['3Y'] || fund.returns?.threeYear || fund.returns3Y || 0,
    returns5Y:
      fund.returns?.['5Y'] || fund.returns?.fiveYear || fund.returns5Y || 0,
    aum: fund.aum?.value || fund.aum || 0,
    expenseRatio: fund.expenseRatio?.value || fund.expenseRatio || 0,
    rating: fund.rating || fund.ratings?.overall || 0,
    riskLevel: fund.riskLevel || fund.risk || '',
  };

  // Add normalized category for filtering
  return {
    ...transformed,
    normalizedCategory: normalizeCategory(transformed),
  };
}

/**
 * Fetch funds in batches for background loading
 */
export async function fetchFundsBatch(offset: number = 0, limit: number = 500) {
  try {
    const db = await getDb();
    const fundsCollection = db.collection('funds');

    console.log(`📦 [Server] Fetching batch: offset=${offset}, limit=${limit}`);

    const funds = await fundsCollection
      .find({})
      .skip(offset)
      .limit(limit)
      .toArray();

    const transformedFunds = funds.map(transformFund);

    // Get total count for first batch only
    let total = 0;
    if (offset === 0) {
      total = await fundsCollection.countDocuments({});
    }

    console.log(
      `✅ [Server] Batch: ${transformedFunds.length} funds (offset: ${offset})`
    );

    return {
      success: true,
      data: transformedFunds,
      offset,
      limit,
      count: transformedFunds.length,
      total: total || undefined,
      hasMore: transformedFunds.length === limit,
    };
  } catch (error) {
    console.error('❌ [Server] Batch error:', error);
    return {
      success: false,
      data: [],
      offset,
      limit,
      count: 0,
      hasMore: false,
    };
  }
}

/**
 * Get total fund count
 */
export async function getTotalFundCount() {
  try {
    const db = await getDb();
    const count = await db.collection('funds').countDocuments({});
    return { success: true, count };
  } catch {
    return { success: false, count: 0 };
  }
}

// Server action to get initial funds (500) - INSTANT LOAD
export async function fetchInitialFunds() {
  return fetchFundsBatch(0, 500);
}

// Server action to get ALL funds from database
export async function fetchAllFundsFromDB() {
  try {
    console.log('🔍 [Server Action] Fetching ALL funds...');
    const db = await getDb();
    const fundsCollection = db.collection('funds');

    const funds = await fundsCollection.find({}).limit(20000).toArray();
    const transformedFunds = funds.map(transformFund);

    console.log(
      `✅ [Server Action] Fetched ALL ${transformedFunds.length} funds`
    );

    return {
      success: true,
      data: transformedFunds,
      total: transformedFunds.length,
    };
  } catch (error) {
    console.error('❌ [Server Action] Error:', error);
    return {
      success: false,
      data: [],
      total: 0,
    };
  }
}

// Get total funds count
export async function getTotalFundsCount() {
  try {
    const rawFunds = await getAllFundsFromDB(15000);
    return rawFunds.length;
  } catch {
    return 0;
  }
}
