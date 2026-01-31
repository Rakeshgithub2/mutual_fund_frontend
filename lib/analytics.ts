/**
 * Google Analytics 4 Integration
 * ===============================
 * Production-ready analytics tracking
 */

// Declare gtag on window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Initialize GA
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return !!GA_MEASUREMENT_ID && typeof window !== 'undefined';
};

/**
 * Track page views
 */
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });

  console.log('📊 GA Pageview:', url);
};

/**
 * Track custom events
 */
export const event = (
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
): void => {
  if (!isGAEnabled()) return;

  window.gtag?.('event', action, params);

  console.log('📊 GA Event:', action, params);
};

// ==========================================
// PREDEFINED EVENT TRACKING FUNCTIONS
// ==========================================

/**
 * Track search queries
 */
export const trackSearch = (query: string, resultsCount: number = 0): void => {
  event('search', {
    search_term: query,
    results_count: resultsCount,
    category: 'Search',
  });
};

/**
 * Track fund views
 */
export const trackFundView = (fundId: string, fundName: string): void => {
  event('view_item', {
    item_id: fundId,
    item_name: fundName,
    category: 'Fund Details',
  });
};

/**
 * Track fund comparison
 */
export const trackFundComparison = (fundIds: string[]): void => {
  event('compare_funds', {
    fund_count: fundIds.length,
    fund_ids: fundIds.join(','),
    category: 'Comparison',
  });
};

/**
 * Track authentication events
 */
export const trackAuth = (
  action: 'login' | 'signup' | 'logout',
  method: 'email' | 'google' = 'email'
): void => {
  event(action, {
    method,
    category: 'Authentication',
  });
};

/**
 * Track watchlist actions
 */
export const trackWatchlistAction = (
  action: 'add' | 'remove',
  fundId: string
): void => {
  event(`watchlist_${action}`, {
    fund_id: fundId,
    category: 'Watchlist',
  });
};

/**
 * Track sorting actions
 */
export const trackSort = (sortBy: string, sortOrder: 'asc' | 'desc'): void => {
  event('sort_applied', {
    sort_by: sortBy,
    sort_order: sortOrder,
    category: 'Sort',
  });
};

/**
 * Track export actions
 */
export const trackExport = (
  exportType: 'pdf' | 'excel' | 'csv',
  contentType: string
): void => {
  event('export', {
    export_type: exportType,
    content_type: contentType,
    category: 'Export',
  });
};

/**
 * Track filter usage (Top 20/50/100)
 */
export const trackFilter = (
  filterType: string,
  filterValue: string | number
): void => {
  event('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue.toString(),
    category: 'Filters',
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  location: string
): void => {
  event('button_click', {
    button_name: buttonName,
    location,
    category: 'Engagement',
  });
};

/**
 * Track portfolio actions
 */
export const trackPortfolio = (
  action: 'add_fund' | 'remove_fund' | 'view_portfolio',
  fundId?: string
): void => {
  event(action, {
    fund_id: fundId,
    category: 'Portfolio',
  });
};

/**
 * Track errors
 */
export const trackError = (
  errorMessage: string,
  errorLocation: string
): void => {
  event('error', {
    error_message: errorMessage,
    error_location: errorLocation,
    category: 'Errors',
  });
};

/**
 * Track overlap analysis
 */
export const trackOverlap = (
  fundCount: number,
  overlapPercentage: number
): void => {
  event('overlap_analysis', {
    fund_count: fundCount,
    overlap_percentage: overlapPercentage,
    category: 'Analysis',
  });
};

/**
 * Track calculator usage
 */
export const trackCalculator = (calculatorType: string, inputs: any): void => {
  event('calculator_used', {
    calculator_type: calculatorType,
    category: 'Tools',
    ...inputs,
  });
};

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

const analytics = {
  pageview,
  event,
  trackSearch,
  trackFundView,
  trackFundComparison,
  trackAuth,
  trackWatchlistAction,
  trackSort,
  trackExport,
  trackFilter,
  trackButtonClick,
  trackPortfolio,
  trackError,
  trackOverlap,
  trackCalculator,
};

export default analytics;
