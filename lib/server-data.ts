// Server-side data fetching for funds
// This file should only be used in Server Components or API routes

import { getAllFundsFromDB } from './mongodb';

// Transform MongoDB fund document to frontend format
function transformFund(fund: any) {
  return {
    id: fund.schemeCode || fund._id?.toString(),
    schemeCode: fund.schemeCode,
    name: fund.schemeName || fund.name,
    fundHouse: fund.amc?.name || fund.amcName || fund.fundHouse,
    category: fund.category,
    subCategory: fund.subCategory,
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
  };
}

// Get all funds from database (server-side only)
export async function getFundsServerSide(limit: number = 15000) {
  'use server';

  try {
    const rawFunds = await getAllFundsFromDB(limit);
    const transformedFunds = rawFunds.map(transformFund);

    console.log(`✅ [Server] Transformed ${transformedFunds.length} funds`);

    return {
      success: true,
      data: transformedFunds,
      total: transformedFunds.length,
    };
  } catch (error) {
    console.error('❌ [Server] Error fetching funds:', error);
    return {
      success: false,
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get initial 500 funds for quick load
export async function getInitialFundsServerSide() {
  'use server';
  return getFundsServerSide(500);
}

// Get all funds
export async function getAllFundsServerSide() {
  'use server';
  return getFundsServerSide(15000);
}
