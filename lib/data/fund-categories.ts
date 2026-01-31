/**
 * Fund Categories and Subcategories Mapping
 * Used for filter sidebar and category-based pagination
 */

export interface SubCategory {
  label: string;
  value: string;
  keywords: string[];
}

export interface Category {
  label: string;
  value: string;
  icon: string;
  keywords: string[];
  subCategories?: SubCategory[];
}

export const FUND_CATEGORIES: Category[] = [
  {
    label: 'Large Cap',
    value: 'largecap',
    icon: '📊',
    keywords: ['large cap', 'largecap', 'large-cap', 'bluechip', 'blue chip'],
    subCategories: [
      { label: 'Large Cap', value: 'large-cap', keywords: ['large cap'] },
      {
        label: 'Large & Mid Cap',
        value: 'large-mid-cap',
        keywords: ['large & mid', 'large and mid'],
      },
    ],
  },
  {
    label: 'Mid Cap',
    value: 'midcap',
    icon: '📈',
    keywords: ['mid cap', 'midcap', 'mid-cap'],
  },
  {
    label: 'Small Cap',
    value: 'smallcap',
    icon: '🚀',
    keywords: ['small cap', 'smallcap', 'small-cap'],
  },
  {
    label: 'Flexi Cap',
    value: 'flexicap',
    icon: '🔄',
    keywords: ['flexi cap', 'flexicap', 'flexi-cap', 'flexible cap'],
  },
  {
    label: 'Multi Cap',
    value: 'multicap',
    icon: '📑',
    keywords: ['multi cap', 'multicap', 'multi-cap'],
  },
  {
    label: 'Index Funds',
    value: 'index',
    icon: '📉',
    keywords: ['index', 'index fund', 'nifty', 'sensex', 'passive'],
    subCategories: [
      {
        label: 'Nifty 50',
        value: 'nifty50',
        keywords: ['nifty 50', 'nifty50'],
      },
      {
        label: 'Nifty Next 50',
        value: 'niftynext50',
        keywords: ['nifty next 50', 'nifty next'],
      },
      { label: 'Sensex', value: 'sensex', keywords: ['sensex', 'bse 30'] },
      {
        label: 'Nifty 100',
        value: 'nifty100',
        keywords: ['nifty 100', 'nifty100'],
      },
    ],
  },
  {
    label: 'ETF',
    value: 'etf',
    icon: '💹',
    keywords: ['etf', 'exchange traded'],
    subCategories: [
      { label: 'Gold ETF', value: 'gold-etf', keywords: ['gold etf'] },
      {
        label: 'Equity ETF',
        value: 'equity-etf',
        keywords: ['equity etf', 'nifty etf'],
      },
      {
        label: 'Debt ETF',
        value: 'debt-etf',
        keywords: ['debt etf', 'bond etf'],
      },
    ],
  },
  {
    label: 'Debt',
    value: 'debt',
    icon: '🏦',
    keywords: ['debt', 'bond', 'fixed income'],
    subCategories: [
      {
        label: 'Short Term',
        value: 'short-term',
        keywords: ['short term', 'short duration'],
      },
      {
        label: 'Corporate Bond',
        value: 'corporate-bond',
        keywords: ['corporate bond', 'corporate'],
      },
      {
        label: 'Gilt',
        value: 'gilt',
        keywords: ['gilt', 'government securities', 'g-sec'],
      },
      {
        label: 'Dynamic Bond',
        value: 'dynamic-bond',
        keywords: ['dynamic bond', 'dynamic'],
      },
      {
        label: 'Banking & PSU',
        value: 'banking-psu',
        keywords: ['banking', 'psu', 'banking & psu'],
      },
      { label: 'Credit Risk', value: 'credit-risk', keywords: ['credit risk'] },
    ],
  },
  {
    label: 'Liquid',
    value: 'liquid',
    icon: '💧',
    keywords: ['liquid', 'money market', 'overnight'],
    subCategories: [
      { label: 'Liquid Fund', value: 'liquid-fund', keywords: ['liquid'] },
      { label: 'Overnight', value: 'overnight', keywords: ['overnight'] },
      {
        label: 'Ultra Short',
        value: 'ultra-short',
        keywords: ['ultra short', 'ultra-short'],
      },
    ],
  },
  {
    label: 'Commodity',
    value: 'commodity',
    icon: '🥇',
    keywords: ['commodity', 'gold', 'silver'],
    subCategories: [
      { label: 'Gold Fund', value: 'gold', keywords: ['gold'] },
      { label: 'Silver Fund', value: 'silver', keywords: ['silver'] },
    ],
  },
  {
    label: 'International',
    value: 'international',
    icon: '🌍',
    keywords: [
      'international',
      'global',
      'foreign',
      'overseas',
      'us',
      'nasdaq',
    ],
    subCategories: [
      {
        label: 'US Equity',
        value: 'us-equity',
        keywords: ['us', 'usa', 'nasdaq', 's&p'],
      },
      { label: 'Global', value: 'global', keywords: ['global', 'world'] },
      {
        label: 'Emerging Markets',
        value: 'emerging',
        keywords: ['emerging', 'em'],
      },
    ],
  },
  {
    label: 'ELSS',
    value: 'elss',
    icon: '💰',
    keywords: ['elss', 'tax saving', 'tax saver', '80c'],
  },
  {
    label: 'Sectoral',
    value: 'sectoral',
    icon: '🏭',
    keywords: ['sectoral', 'thematic', 'sector', 'theme'],
    subCategories: [
      {
        label: 'Banking',
        value: 'banking',
        keywords: ['banking', 'bank', 'financial'],
      },
      {
        label: 'Technology',
        value: 'technology',
        keywords: ['technology', 'tech', 'it'],
      },
      {
        label: 'Healthcare',
        value: 'healthcare',
        keywords: ['healthcare', 'pharma', 'health'],
      },
      {
        label: 'Infrastructure',
        value: 'infrastructure',
        keywords: ['infrastructure', 'infra'],
      },
      {
        label: 'Consumption',
        value: 'consumption',
        keywords: ['consumption', 'fmcg', 'consumer'],
      },
      { label: 'ESG', value: 'esg', keywords: ['esg', 'sustainable', 'green'] },
    ],
  },
];

/**
 * Get category by slug value
 */
export function getCategoryByValue(value: string): Category | undefined {
  return FUND_CATEGORIES.find((cat) => cat.value === value.toLowerCase());
}

/**
 * Get all subcategories for a category
 */
export function getSubCategories(categoryValue: string): SubCategory[] {
  const category = getCategoryByValue(categoryValue);
  return category?.subCategories || [];
}

/**
 * Check if a fund matches a category based on keywords
 */
export function matchesCategory(
  fund: { category?: string; subCategory?: string; name?: string },
  categoryValue: string
): boolean {
  const category = getCategoryByValue(categoryValue);
  if (!category) return false;

  const fundCategory = (fund.category || '').toLowerCase();
  const fundSubCategory = (fund.subCategory || '').toLowerCase();
  const fundName = (fund.name || '').toLowerCase();

  return category.keywords.some(
    (keyword) =>
      fundCategory.includes(keyword) ||
      fundSubCategory.includes(keyword) ||
      fundName.includes(keyword)
  );
}

/**
 * Check if a fund matches a subcategory
 */
export function matchesSubCategory(
  fund: { category?: string; subCategory?: string; name?: string },
  subCategoryValue: string,
  parentCategoryValue: string
): boolean {
  const category = getCategoryByValue(parentCategoryValue);
  if (!category?.subCategories) return false;

  const subCategory = category.subCategories.find(
    (sc) => sc.value === subCategoryValue
  );
  if (!subCategory) return false;

  const fundSubCategory = (fund.subCategory || '').toLowerCase();
  const fundName = (fund.name || '').toLowerCase();

  return subCategory.keywords.some(
    (keyword) => fundSubCategory.includes(keyword) || fundName.includes(keyword)
  );
}

export const RISK_LEVELS = [
  { label: 'Low', value: 'low', color: 'text-green-600' },
  { label: 'Moderately Low', value: 'moderately-low', color: 'text-green-500' },
  { label: 'Moderate', value: 'moderate', color: 'text-yellow-600' },
  {
    label: 'Moderately High',
    value: 'moderately-high',
    color: 'text-orange-500',
  },
  { label: 'High', value: 'high', color: 'text-red-500' },
  { label: 'Very High', value: 'very-high', color: 'text-red-600' },
];

export const PLAN_TYPES = [
  { label: 'Direct', value: 'direct' },
  { label: 'Regular', value: 'regular' },
];

export const OPTION_TYPES = [
  { label: 'Growth', value: 'growth' },
  { label: 'IDCW', value: 'idcw' },
];
