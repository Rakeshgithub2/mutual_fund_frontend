/**
 * Category Normalizer
 *
 * Backend uses:
 * - Categories: lowercase (equity, debt, hybrid, etc.)
 * - SubCategories: lowercase without spaces (largecap, midcap, smallcap, etc.)
 *
 * This utility ensures frontend sends data in the correct format.
 */

/**
 * Normalize category to backend format (lowercase)
 *
 * @param category - Category string in any case
 * @returns Lowercase category string
 *
 * @example
 * normalizeCategory('EQUITY') // 'equity'
 * normalizeCategory('Equity') // 'equity'
 * normalizeCategory('equity') // 'equity'
 */
export const normalizeCategory = (category: string): string => {
  if (!category) return '';
  return category.toLowerCase().trim();
};

/**
 * Normalize subcategory to backend format (lowercase without spaces)
 *
 * @param subCategory - SubCategory string in any format
 * @returns Lowercase subcategory without spaces
 *
 * @example
 * normalizeSubCategory('LARGE_CAP') // 'largecap'
 * normalizeSubCategory('LargeCap') // 'largecap'
 * normalizeSubCategory('large cap') // 'largecap'
 * normalizeSubCategory('Large Cap') // 'largecap'
 */
export const normalizeSubCategory = (subCategory: string): string => {
  if (!subCategory) return '';

  // Backend expected subcategories - convert to lowercase no spaces
  const validSubCategories = [
    'largecap',
    'midcap',
    'smallcap',
    'flexicap',
    'multicap',
    'largeandmidcap',
    'sectoralthematic',
    'focused',
    'value',
    'contra',
    'dividendyield',
    'liquid',
    'overnight',
    'ultrashortduration',
    'lowduration',
    'moneymarket',
    'shortduration',
    'mediumduration',
    'mediumtolongduration',
    'longduration',
    'dynamicbond',
    'corporatebond',
    'creditrisk',
    'bankingandpsu',
    'gilt',
    'floater',
    'conservativehybrid',
    'balancedhybrid',
    'aggressivehybrid',
    'dynamicassetallocation',
    'multiassetallocation',
    'arbitrage',
    'equitysavings',
    'gold',
    'silver',
    'fundoffundsdomestic',
    'fundoffundsoverseas',
    'index',
    'taxsaving',
    'retirement',
  ];

  // Normalize: lowercase and remove all spaces/underscores
  const normalized = subCategory
    .toLowerCase()
    .replace(/[\s_\-&\/]/g, '')
    .trim();

  // Check if it matches a valid subcategory
  if (validSubCategories.includes(normalized)) {
    return normalized;
  }

  // Return normalized version anyway
  return normalized;
};

/**
 * Get display name for category (for UI)
 *
 * @param category - Category string
 * @returns Capitalized display name
 *
 * @example
 * getCategoryDisplayName('equity') // 'Equity'
 * getCategoryDisplayName('solution_oriented') // 'Solution Oriented'
 */
export const getCategoryDisplayName = (category: string): string => {
  if (!category) return '';

  const displayNames: Record<string, string> = {
    equity: 'Equity',
    debt: 'Debt',
    hybrid: 'Hybrid',
    commodity: 'Commodity',
    etf: 'ETF',
    index: 'Index',
    elss: 'ELSS',
    solution_oriented: 'Solution Oriented',
    international: 'International',
  };

  return (
    displayNames[category.toLowerCase()] ||
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  );
};

/**
 * Validate if category is valid backend category
 *
 * @param category - Category to validate
 * @returns true if valid backend category
 */
export const isValidCategory = (category: string): boolean => {
  const validCategories = [
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

  return validCategories.includes(category.toLowerCase());
};

/**
 * Get all valid categories
 *
 * @returns Array of valid category objects with value and display name
 */
export const getAllCategories = () => {
  return [
    { value: 'equity', label: 'Equity' },
    { value: 'debt', label: 'Debt' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'commodity', label: 'Commodity' },
    { value: 'etf', label: 'ETF' },
    { value: 'index', label: 'Index' },
    { value: 'elss', label: 'ELSS' },
    { value: 'solution_oriented', label: 'Solution Oriented' },
    { value: 'international', label: 'International' },
  ];
};

/**
 * Get subcategories for a specific category
 *
 * @param category - Category to get subcategories for
 * @returns Array of valid subcategories in lowercase format
 */
export const getSubCategoriesForCategory = (category: string): string[] => {
  const subCategoriesByCategory: Record<string, string[]> = {
    equity: [
      'largecap',
      'midcap',
      'smallcap',
      'flexicap',
      'multicap',
      'largeandmidcap',
      'sectoralthematic',
      'focused',
      'value',
      'contra',
      'dividendyield',
    ],
    debt: [
      'liquid',
      'overnight',
      'ultrashortduration',
      'lowduration',
      'moneymarket',
      'shortduration',
      'mediumduration',
      'mediumtolongduration',
      'longduration',
      'dynamicbond',
      'corporatebond',
      'creditrisk',
      'bankingandpsu',
      'gilt',
      'floater',
    ],
    hybrid: [
      'conservativehybrid',
      'balancedhybrid',
      'aggressivehybrid',
      'dynamicassetallocation',
      'multiassetallocation',
      'arbitrage',
      'equitysavings',
    ],
    commodity: ['gold', 'silver'],
    etf: ['index'],
    index: ['index'],
    elss: ['taxsaving'],
    solution_oriented: ['retirement'],
    international: ['fundoffundsoverseas'],
  };

  return subCategoriesByCategory[category.toLowerCase()] || [];
};

/**
 * Get display name for subcategory (for UI display)
 *
 * @param subCategory - Subcategory string
 * @returns Display name with proper formatting
 *
 * @example
 * getSubCategoryDisplayName('largecap') // 'Large Cap'
 * getSubCategoryDisplayName('midcap') // 'Mid Cap'
 */
export const getSubCategoryDisplayName = (subCategory: string): string => {
  if (!subCategory) return '';

  const displayNames: Record<string, string> = {
    largecap: 'Large Cap',
    midcap: 'Mid Cap',
    smallcap: 'Small Cap',
    flexicap: 'Flexi Cap',
    multicap: 'Multi Cap',
    largeandmidcap: 'Large & Mid Cap',
    sectoralthematic: 'Sectoral/Thematic',
    focused: 'Focused',
    value: 'Value',
    contra: 'Contra',
    dividendyield: 'Dividend Yield',
    liquid: 'Liquid',
    overnight: 'Overnight',
    ultrashortduration: 'Ultra Short Duration',
    lowduration: 'Low Duration',
    moneymarket: 'Money Market',
    shortduration: 'Short Duration',
    mediumduration: 'Medium Duration',
    mediumtolongduration: 'Medium to Long Duration',
    longduration: 'Long Duration',
    dynamicbond: 'Dynamic Bond',
    corporatebond: 'Corporate Bond',
    creditrisk: 'Credit Risk',
    bankingandpsu: 'Banking & PSU',
    gilt: 'Gilt',
    floater: 'Floater',
    conservativehybrid: 'Conservative Hybrid',
    balancedhybrid: 'Balanced Hybrid',
    aggressivehybrid: 'Aggressive Hybrid',
    dynamicassetallocation: 'Dynamic Asset Allocation',
    multiassetallocation: 'Multi Asset Allocation',
    arbitrage: 'Arbitrage',
    equitysavings: 'Equity Savings',
    gold: 'Gold',
    silver: 'Silver',
    index: 'Index',
    taxsaving: 'Tax Saving',
    retirement: 'Retirement',
    fundoffundsoverseas: 'Fund of Funds - Overseas',
    fundoffundsdomestic: 'Fund of Funds - Domestic',
  };

  const normalized = subCategory.toLowerCase().replace(/[\s_\-&\/]/g, '');
  return displayNames[normalized] || subCategory;
};
