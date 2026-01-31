/**
 * Constants for Mutual Fund Portal
 * Updated for 4,459 funds backend integration
 */

// ===============================================
// FUND CATEGORIES (8 CATEGORIES - UPDATED)
// ===============================================

export interface Category {
  id: string;
  name: string;
  count: number;
  description?: string;
}

export const FUND_CATEGORIES: Category[] = [
  {
    id: 'equity',
    name: 'Equity',
    count: 1059,
    description: 'Invest primarily in stocks for long-term growth',
  },
  {
    id: 'debt',
    name: 'Debt',
    count: 1972,
    description: 'Fixed income securities for stable returns',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    count: 753,
    description: 'Mix of equity and debt for balanced returns',
  },
  {
    id: 'index',
    name: 'Index Funds',
    count: 441,
    description: 'Passive funds tracking market indices',
  },
  {
    id: 'elss',
    name: 'ELSS (Tax Saving)',
    count: 75,
    description: 'Tax-saving equity funds under Section 80C',
  },
  {
    id: 'international',
    name: 'International',
    count: 75,
    description: 'Invest in global markets',
  },
  {
    id: 'commodity',
    name: 'Commodity',
    count: 50,
    description: 'Gold, silver and other commodities',
  },
  {
    id: 'solution_oriented',
    name: 'Solution Oriented',
    count: 34,
    description: 'Goal-based funds like retirement',
  },
];

// ===============================================
// SUB-CATEGORY MAPPINGS (NEW)
// ===============================================

export const SUB_CATEGORY_MAPPING: Record<string, string[]> = {
  equity: [
    'Large Cap',
    'Mid Cap',
    'Small Cap',
    'Large & Mid Cap',
    'Flexi Cap',
    'Multi Cap',
    'Focused',
    'Sectoral/Thematic',
    'Dividend Yield',
    'Value',
    'Contra',
  ],
  debt: [
    'Liquid',
    'Ultra Short Duration',
    'Low Duration',
    'Money Market',
    'Short Duration',
    'Medium Duration',
    'Medium to Long Duration',
    'Long Duration',
    'Dynamic Bond',
    'Corporate Bond',
    'Credit Risk',
    'Banking & PSU',
    'Gilt',
    'Floater',
    'Overnight',
  ],
  hybrid: [
    'Conservative Hybrid',
    'Balanced Hybrid',
    'Aggressive Hybrid',
    'Dynamic Asset Allocation',
    'Multi Asset Allocation',
    'Arbitrage',
    'Equity Savings',
    'Fund of Funds - Domestic',
  ],
  index: ['Index'],
  elss: ['Tax Saving'],
  international: ['Fund of Funds - Overseas'],
  commodity: ['Gold', 'Silver'],
  solution_oriented: ['Retirement'],
};

// ===============================================
// CATEGORY COLORS & BADGES
// ===============================================

export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  equity: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
  },
  debt: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  hybrid: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
  },
  index: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
  },
  elss: {
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-300 dark:border-teal-700',
  },
  international: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-700',
  },
  commodity: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  solution_oriented: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-300 dark:border-pink-700',
  },
};

// ===============================================
// API CONFIGURATION
// ===============================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  DEFAULT_PAGE_SIZE: 500,
  MAX_PAGE_SIZE: 15000, // Backend supports up to 15000 per request
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// ===============================================
// API ENDPOINTS
// ===============================================

export const API_ENDPOINTS = {
  // Funds
  FUNDS: '/api/funds',
  FUND_DETAIL: (id: string) => `/api/funds/${id}`,
  FUND_NAV_HISTORY: (id: string) => `/api/funds/${id}/navs`,

  // Market
  MARKET_INDICES: '/api/market/indices',
  MARKET_SUMMARY: '/api/market/summary',
  MARKET_STATUS: '/api/market/status',

  // Search
  SEARCH_FUNDS: '/api/funds/search',

  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
};

// ===============================================
// PAGINATION DEFAULTS
// ===============================================

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  PAGE_SIZE_OPTIONS: [20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
};

// ===============================================
// SORT OPTIONS
// ===============================================

export const SORT_OPTIONS = [
  { value: 'returns.oneYear:desc', label: '1Y Returns (High to Low)' },
  { value: 'returns.oneYear:asc', label: '1Y Returns (Low to High)' },
  { value: 'returns.threeYear:desc', label: '3Y Returns (High to Low)' },
  { value: 'returns.fiveYear:desc', label: '5Y Returns (High to Low)' },
  { value: 'aum:desc', label: 'AUM (High to Low)' },
  { value: 'expenseRatio:asc', label: 'Expense Ratio (Low to High)' },
  { value: 'nav.value:desc', label: 'NAV (High to Low)' },
  { value: 'schemeName:asc', label: 'Name (A to Z)' },
];

// ===============================================
// RISK LEVELS
// ===============================================

export const RISK_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  MODERATELY_HIGH: 'Moderately High',
  HIGH: 'High',
  VERY_HIGH: 'Very High',
};

export const RISK_LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Low: { bg: 'bg-green-100', text: 'text-green-700' },
  Moderate: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Moderately High': { bg: 'bg-orange-100', text: 'text-orange-700' },
  High: { bg: 'bg-red-100', text: 'text-red-700' },
  'Very High': { bg: 'bg-red-200', text: 'text-red-800' },
};

// ===============================================
// TIME PERIODS
// ===============================================

export const TIME_PERIODS = [
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '1Y', label: '1 Year' },
  { value: '3Y', label: '3 Years' },
  { value: '5Y', label: '5 Years' },
  { value: 'ALL', label: 'All Time' },
];

// ===============================================
// SEARCH CONFIGURATION
// ===============================================

export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 3,
  DEBOUNCE_DELAY: 500, // milliseconds
  MAX_RESULTS: 50,
};

// ===============================================
// HELPER FUNCTIONS
// ===============================================

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return FUND_CATEGORIES.find((cat) => cat.id === id);
};

/**
 * Get category color classes
 */
export const getCategoryColors = (categoryId: string) => {
  return CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.equity;
};

/**
 * Get sub-categories for a category
 */
export const getSubCategories = (categoryId: string): string[] => {
  return SUB_CATEGORY_MAPPING[categoryId] || [];
};

/**
 * Format currency in Indian format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format AUM in crores
 */
export const formatAUM = (aum: number): string => {
  if (aum >= 10000) {
    return `₹${(aum / 10000).toFixed(2)} Lakh Cr`;
  }
  return `₹${aum.toFixed(0)} Cr`;
};
