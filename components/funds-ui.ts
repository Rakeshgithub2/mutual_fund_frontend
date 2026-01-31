/**
 * Clean UI Components for Mutual Fund Listing
 *
 * This module exports all the redesigned components for the fund listing page.
 * Design inspiration: Groww, Zerodha Coin, Morningstar
 */

// Core Components
export { FundCardClean } from './fund-card-clean';
export { FundListClean } from './fund-list-clean';
export { FilterSidebar } from './filter-sidebar';
export { SearchBarClean } from './search-bar-clean';
export { FundsPagination, FundsPaginationMobile } from './funds-pagination';
export { CompareBar } from './compare-bar';

// Data/Config
export {
  FUND_CATEGORIES,
  RISK_LEVELS,
  PLAN_TYPES,
  OPTION_TYPES,
  getCategoryByValue,
  getSubCategories,
  matchesCategory,
  matchesSubCategory,
} from '@/lib/data/fund-categories';
