/**
 * Fund Type Definitions
 *
 * TypeScript types matching backend API contract exactly.
 * Backend guaranteed to have 4,459 active funds as of December 28, 2025.
 */

// Category types (lowercase as per backend)
export type Category =
  | 'equity'
  | 'debt'
  | 'hybrid'
  | 'commodity'
  | 'etf'
  | 'index'
  | 'elss'
  | 'solution_oriented'
  | 'international';

// SubCategory types (Title Case with spaces as per backend)
export type EquitySubCategory =
  | 'Large Cap'
  | 'Mid Cap'
  | 'Small Cap'
  | 'Flexi Cap'
  | 'Multi Cap'
  | 'Large & Mid Cap'
  | 'Sectoral/Thematic'
  | 'Focused'
  | 'Value'
  | 'Contra'
  | 'Dividend Yield';

export type DebtSubCategory =
  | 'Liquid'
  | 'Overnight'
  | 'Ultra Short Duration'
  | 'Low Duration'
  | 'Money Market'
  | 'Short Duration'
  | 'Medium Duration'
  | 'Medium to Long Duration'
  | 'Long Duration'
  | 'Dynamic Bond'
  | 'Corporate Bond'
  | 'Credit Risk'
  | 'Banking & PSU'
  | 'Gilt'
  | 'Floater';

export type HybridSubCategory =
  | 'Conservative Hybrid'
  | 'Balanced Hybrid'
  | 'Aggressive Hybrid'
  | 'Dynamic Asset Allocation'
  | 'Multi Asset Allocation'
  | 'Arbitrage'
  | 'Equity Savings';

export type CommoditySubCategory = 'Gold' | 'Silver';

export type OtherSubCategory =
  | 'Fund of Funds - Domestic'
  | 'Fund of Funds - Overseas'
  | 'Index'
  | 'Tax Saving'
  | 'Retirement';

export type SubCategory =
  | EquitySubCategory
  | DebtSubCategory
  | HybridSubCategory
  | CommoditySubCategory
  | OtherSubCategory;

export type FundType = 'mutual_fund' | 'etf';

// Returns structure
export interface FundReturns {
  day?: number;
  week?: number;
  month?: number;
  threeMonth?: number;
  sixMonth?: number;
  oneYear: number; // Required
  threeYear?: number;
  fiveYear?: number;
  sinceInception?: number;
}

// Risk metrics structure
export interface RiskMetrics {
  sharpeRatio?: number;
  standardDeviation?: number;
  beta?: number;
  alpha?: number;
  rSquared?: number;
  sortino?: number;
}

// Ratings structure
export interface FundRatings {
  morningstar?: number; // 1-5 stars
  crisil?: number; // 1-5 stars
  valueResearch?: number; // 1-5 stars
}

// Main Fund interface
export interface Fund {
  fundId: string; // Unique identifier
  name: string; // Fund name
  category: Category; // lowercase category
  subCategory: SubCategory; // Title Case subcategory
  fundHouse: string; // AMC name
  fundType: FundType; // mutual_fund or etf
  currentNav: number; // Current NAV
  previousNav?: number; // Previous day NAV
  navDate?: string; // ISO date string
  returns: FundReturns; // Returns data
  riskMetrics?: RiskMetrics; // Risk metrics (optional)
  aum?: number; // Assets Under Management (in crores)
  expenseRatio?: number; // Expense ratio percentage
  exitLoad?: number; // Exit load percentage
  minInvestment?: number; // Minimum investment amount
  sipMinAmount?: number; // Minimum SIP amount
  ratings?: FundRatings; // Various ratings
  tags?: string[]; // Tags/labels
  popularity?: number; // Popularity score
  isActive: boolean; // Whether fund is active
}

// API Response structures
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  error?: string;
  message?: string;
}

export interface FundsResponse extends ApiResponse<Fund[]> {
  pagination: Pagination;
}

export interface SingleFundResponse extends ApiResponse<Fund> {
  data: Fund;
}

// Filter options
export interface FundFilters {
  category?: Category | string; // Will be normalized to lowercase
  subCategory?: SubCategory | string; // Will be normalized to Title Case
  fundHouse?: string;
  minAum?: number;
  maxAum?: number;
  minExpenseRatio?: number;
  maxExpenseRatio?: number;
  minReturnsOneYear?: number;
  maxReturnsOneYear?: number;
  sortBy?:
    | 'aum'
    | 'returns.oneYear'
    | 'returns.threeYear'
    | 'returns.fiveYear'
    | 'name'
    | 'currentNav';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// UI-specific types
export interface FundCardProps {
  fund: Fund;
  onSelect?: (fund: Fund) => void;
  selected?: boolean;
  language?: 'en' | 'hi';
}

export interface FundListProps {
  filters?: FundFilters;
  onFundSelect?: (fund: Fund) => void;
  selectedFunds?: string[]; // fundIds
  language?: 'en' | 'hi';
}

// Comparison types
export interface FundComparison {
  funds: Fund[];
  comparisonMetrics: {
    returns: {
      oneYear: number[];
      threeYear: number[];
      fiveYear: number[];
    };
    risk: {
      sharpeRatio: number[];
      standardDeviation: number[];
    };
    costs: {
      expenseRatio: number[];
    };
  };
}

// Portfolio overlap types
export interface PortfolioOverlap {
  fundIds: string[];
  overlapPercentage: number;
  commonHoldings: {
    stockName: string;
    percentage: number;
  }[];
}

// Search result type
export interface SearchResult {
  fund: Fund;
  score: number;
  highlights?: {
    field: string;
    matches: string[];
  }[];
}

// Stats/summary types
export interface FundStats {
  totalFunds: number;
  byCategory: Record<Category, number>;
  byFundHouse: Record<string, number>;
  totalAum: number;
  averageReturns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
}

// Error types
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// Utility type guards
export const isFund = (obj: any): obj is Fund => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.fundId === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.currentNav === 'number'
  );
};

export const isFundsResponse = (obj: any): obj is FundsResponse => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.success === true &&
    Array.isArray(obj.data) &&
    obj.data.every(isFund) &&
    typeof obj.pagination === 'object'
  );
};

export const isApiError = (obj: any): obj is ApiError => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.success === false &&
    typeof obj.error === 'string'
  );
};

// Constants
export const VALID_CATEGORIES: Category[] = [
  'equity',
  'debt',
  'hybrid',
  'commodity',
  'etf',
  'index',
  'elss',
  'solution_oriented',
  'international',
];

export const VALID_EQUITY_SUBCATEGORIES: EquitySubCategory[] = [
  'Large Cap',
  'Mid Cap',
  'Small Cap',
  'Flexi Cap',
  'Multi Cap',
  'Large & Mid Cap',
  'Sectoral/Thematic',
  'Focused',
  'Value',
  'Contra',
  'Dividend Yield',
];

export const VALID_DEBT_SUBCATEGORIES: DebtSubCategory[] = [
  'Liquid',
  'Overnight',
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
];

export const VALID_HYBRID_SUBCATEGORIES: HybridSubCategory[] = [
  'Conservative Hybrid',
  'Balanced Hybrid',
  'Aggressive Hybrid',
  'Dynamic Asset Allocation',
  'Multi Asset Allocation',
  'Arbitrage',
  'Equity Savings',
];

// Sort options for UI
export const SORT_OPTIONS = [
  { value: 'aum', label: 'AUM (High to Low)' },
  { value: 'returns.oneYear', label: '1Y Returns (High to Low)' },
  { value: 'returns.threeYear', label: '3Y Returns (High to Low)' },
  { value: 'returns.fiveYear', label: '5Y Returns (High to Low)' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'currentNav', label: 'NAV (High to Low)' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'equity', label: 'Equity' },
  { value: 'debt', label: 'Debt' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'commodity', label: 'Commodity' },
  { value: 'etf', label: 'ETF' },
  { value: 'index', label: 'Index' },
  { value: 'elss', label: 'ELSS' },
  { value: 'solution_oriented', label: 'Solution Oriented' },
  { value: 'international', label: 'International' },
] as const;
