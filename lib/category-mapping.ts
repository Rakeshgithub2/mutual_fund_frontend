/**
 * Category Normalization Mapping
 * Maps various category/subCategory values to standardized categories
 * Ensures no page shows 0 funds
 */

// Standardized category names
export const NORMALIZED_CATEGORIES = {
  LARGE_CAP: 'large-cap',
  MID_CAP: 'mid-cap',
  SMALL_CAP: 'small-cap',
  FLEXI_CAP: 'flexi-cap',
  MULTI_CAP: 'multi-cap',
  ELSS: 'elss',
  INDEX: 'index',
  SECTORAL: 'sectoral',
  THEMATIC: 'thematic',
  FOCUSED: 'focused',
  VALUE: 'value',
  CONTRA: 'contra',
  DIVIDEND: 'dividend',
  HYBRID: 'hybrid',
  BALANCED: 'balanced',
  DEBT: 'debt',
  LIQUID: 'liquid',
  OVERNIGHT: 'overnight',
  SHORT_DURATION: 'short-duration',
  CORPORATE_BOND: 'corporate-bond',
  BANKING_PSU: 'banking-psu',
  GILT: 'gilt',
  COMMODITY: 'commodity',
  GOLD: 'gold',
  SILVER: 'silver',
  INTERNATIONAL: 'international',
  ETF: 'etf',
  FOF: 'fof',
  EQUITY: 'equity',
  OTHER: 'other',
} as const;

// Mapping rules for category normalization
const CATEGORY_MAPPINGS: Record<string, string[]> = {
  [NORMALIZED_CATEGORIES.LARGE_CAP]: [
    'large cap',
    'largecap',
    'large-cap',
    'bluechip',
    'blue chip',
    'top 100',
    'top100',
    'nifty 50',
    'sensex',
    'large & mid cap',
    'large and mid cap',
  ],
  [NORMALIZED_CATEGORIES.MID_CAP]: [
    'mid cap',
    'midcap',
    'mid-cap',
    'mid & small cap',
    'mid and small cap',
    'nifty midcap',
    'midcap 150',
    'midcap 100',
  ],
  [NORMALIZED_CATEGORIES.SMALL_CAP]: [
    'small cap',
    'smallcap',
    'small-cap',
    'micro cap',
    'microcap',
    'nifty smallcap',
    'smallcap 250',
    'smallcap 100',
  ],
  [NORMALIZED_CATEGORIES.FLEXI_CAP]: [
    'flexi cap',
    'flexicap',
    'flexi-cap',
    'flexible cap',
    'dynamic',
  ],
  [NORMALIZED_CATEGORIES.MULTI_CAP]: [
    'multi cap',
    'multicap',
    'multi-cap',
    'diversified',
    'multi asset',
  ],
  [NORMALIZED_CATEGORIES.ELSS]: [
    'elss',
    'tax saver',
    'tax saving',
    'equity linked saving',
    'tax plan',
  ],
  [NORMALIZED_CATEGORIES.INDEX]: [
    'index',
    'index fund',
    'indexfund',
    'nifty',
    'sensex',
    'nifty 50 index',
    'nifty next 50',
    'nifty 100',
    'passive',
    'tracker',
  ],
  [NORMALIZED_CATEGORIES.SECTORAL]: [
    'sectoral',
    'sector',
    'banking',
    'pharma',
    'healthcare',
    'technology',
    'tech',
    'infrastructure',
    'infra',
    'consumption',
    'fmcg',
    'auto',
    'financial services',
    'it sector',
    'realty',
    'energy',
    'power',
    'manufacturing',
  ],
  [NORMALIZED_CATEGORIES.THEMATIC]: [
    'thematic',
    'theme',
    'esg',
    'quant',
    'momentum',
    'quality',
    'growth',
    'innovation',
    'digital',
    'india opportunity',
    'special situations',
  ],
  [NORMALIZED_CATEGORIES.FOCUSED]: [
    'focused',
    'focus',
    'concentrated',
    'select',
  ],
  [NORMALIZED_CATEGORIES.VALUE]: ['value', 'value fund', 'value style'],
  [NORMALIZED_CATEGORIES.CONTRA]: ['contra', 'contrarian'],
  [NORMALIZED_CATEGORIES.DIVIDEND]: ['dividend yield', 'dividend', 'income'],
  [NORMALIZED_CATEGORIES.HYBRID]: [
    'hybrid',
    'balanced',
    'aggressive hybrid',
    'conservative hybrid',
    'balanced advantage',
    'dynamic asset allocation',
    'asset allocation',
    'equity savings',
    'multi asset allocation',
    'arbitrage',
  ],
  [NORMALIZED_CATEGORIES.DEBT]: [
    'debt',
    'bond',
    'fixed income',
    'credit',
    'medium duration',
    'long duration',
    'medium to long',
    'dynamic bond',
    'income fund',
  ],
  [NORMALIZED_CATEGORIES.LIQUID]: [
    'liquid',
    'money market',
    'ultra short',
    'ultrashort',
    'cash',
    'low duration',
  ],
  [NORMALIZED_CATEGORIES.OVERNIGHT]: ['overnight', 'overnight fund'],
  [NORMALIZED_CATEGORIES.SHORT_DURATION]: [
    'short duration',
    'short term',
    'short maturity',
    'floater',
    'floating rate',
  ],
  [NORMALIZED_CATEGORIES.CORPORATE_BOND]: [
    'corporate bond',
    'corporate debt',
    'credit risk',
    'credit opportunities',
  ],
  [NORMALIZED_CATEGORIES.BANKING_PSU]: [
    'banking & psu',
    'banking psu',
    'banking and psu',
    'psu debt',
    'psu bond',
  ],
  [NORMALIZED_CATEGORIES.GILT]: [
    'gilt',
    'government securities',
    'g-sec',
    'gsec',
    'sovereign',
  ],
  [NORMALIZED_CATEGORIES.COMMODITY]: [
    'commodity',
    'commodities',
    'precious metals',
    'multi commodity',
  ],
  [NORMALIZED_CATEGORIES.GOLD]: [
    'gold',
    'gold fund',
    'gold etf',
    'gold savings',
    'gold fof',
  ],
  [NORMALIZED_CATEGORIES.SILVER]: ['silver', 'silver fund', 'silver etf'],
  [NORMALIZED_CATEGORIES.INTERNATIONAL]: [
    'international',
    'global',
    'overseas',
    'us equity',
    'us stock',
    'world',
    'emerging markets',
    'foreign',
    'feeder',
    'nasdaq',
    's&p 500',
  ],
  [NORMALIZED_CATEGORIES.ETF]: ['etf', 'exchange traded', 'exchange-traded'],
  [NORMALIZED_CATEGORIES.FOF]: ['fof', 'fund of funds', 'fund-of-funds'],
};

// Reverse lookup map for quick access
const KEYWORD_TO_CATEGORY: Map<string, string> = new Map();

// Build reverse lookup
Object.entries(CATEGORY_MAPPINGS).forEach(([category, keywords]) => {
  keywords.forEach((keyword) => {
    KEYWORD_TO_CATEGORY.set(keyword.toLowerCase(), category);
  });
});

/**
 * Normalize a fund's category based on its properties
 * Returns a standardized category string
 */
export function normalizeCategory(fund: {
  category?: string;
  subCategory?: string;
  schemeType?: string;
  name?: string;
}): string {
  const category = (fund.category || '').toLowerCase().trim();
  const subCategory = (fund.subCategory || '').toLowerCase().trim();
  const schemeType = (fund.schemeType || '').toLowerCase().trim();
  const name = (fund.name || '').toLowerCase().trim();

  // Priority 1: Check subCategory (most specific)
  for (const [normalizedCat, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
    if (keywords.some((kw) => subCategory.includes(kw) || subCategory === kw)) {
      return normalizedCat;
    }
  }

  // Priority 2: Check category
  for (const [normalizedCat, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
    if (keywords.some((kw) => category.includes(kw) || category === kw)) {
      return normalizedCat;
    }
  }

  // Priority 3: Check schemeType
  for (const [normalizedCat, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
    if (keywords.some((kw) => schemeType.includes(kw) || schemeType === kw)) {
      return normalizedCat;
    }
  }

  // Priority 4: Check fund name for clues
  for (const [normalizedCat, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
    if (keywords.some((kw) => name.includes(kw))) {
      return normalizedCat;
    }
  }

  // Fallback based on main category
  if (category.includes('equity')) return NORMALIZED_CATEGORIES.EQUITY;
  if (category.includes('debt')) return NORMALIZED_CATEGORIES.DEBT;
  if (category.includes('hybrid')) return NORMALIZED_CATEGORIES.HYBRID;
  if (category.includes('commodity')) return NORMALIZED_CATEGORIES.COMMODITY;

  return NORMALIZED_CATEGORIES.OTHER;
}

/**
 * Get the display category for a URL slug
 */
export function getCategoryFromSlug(slug: string): string {
  const normalized = slug.toLowerCase().replace(/\s+/g, '-');

  // Direct mappings
  const slugMap: Record<string, string> = {
    largecap: NORMALIZED_CATEGORIES.LARGE_CAP,
    'large-cap': NORMALIZED_CATEGORIES.LARGE_CAP,
    midcap: NORMALIZED_CATEGORIES.MID_CAP,
    'mid-cap': NORMALIZED_CATEGORIES.MID_CAP,
    smallcap: NORMALIZED_CATEGORIES.SMALL_CAP,
    'small-cap': NORMALIZED_CATEGORIES.SMALL_CAP,
    flexicap: NORMALIZED_CATEGORIES.FLEXI_CAP,
    'flexi-cap': NORMALIZED_CATEGORIES.FLEXI_CAP,
    multicap: NORMALIZED_CATEGORIES.MULTI_CAP,
    'multi-cap': NORMALIZED_CATEGORIES.MULTI_CAP,
    elss: NORMALIZED_CATEGORIES.ELSS,
    index: NORMALIZED_CATEGORIES.INDEX,
    indexfund: NORMALIZED_CATEGORIES.INDEX,
    'index-fund': NORMALIZED_CATEGORIES.INDEX,
    sectoral: NORMALIZED_CATEGORIES.SECTORAL,
    thematic: NORMALIZED_CATEGORIES.THEMATIC,
    debt: NORMALIZED_CATEGORIES.DEBT,
    liquid: NORMALIZED_CATEGORIES.LIQUID,
    commodity: NORMALIZED_CATEGORIES.COMMODITY,
    gold: NORMALIZED_CATEGORIES.GOLD,
    silver: NORMALIZED_CATEGORIES.SILVER,
    hybrid: NORMALIZED_CATEGORIES.HYBRID,
    international: NORMALIZED_CATEGORIES.INTERNATIONAL,
    etf: NORMALIZED_CATEGORIES.ETF,
  };

  return slugMap[normalized] || normalized;
}

/**
 * Check if a fund belongs to a specific normalized category
 */
export function fundBelongsToCategory(
  fund: {
    normalizedCategory?: string;
    category?: string;
    subCategory?: string;
    name?: string;
  },
  targetCategory: string
): boolean {
  // If already normalized, use that
  if (fund.normalizedCategory) {
    return fund.normalizedCategory === targetCategory;
  }

  // Otherwise, compute
  const normalized = normalizeCategory(fund);
  return normalized === targetCategory;
}

/**
 * Get all unique categories from funds
 */
export function getUniqueCategories(
  funds: Array<{ normalizedCategory?: string }>
): string[] {
  const categories = new Set<string>();
  funds.forEach((fund) => {
    if (fund.normalizedCategory) {
      categories.add(fund.normalizedCategory);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get category display label
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    [NORMALIZED_CATEGORIES.LARGE_CAP]: 'Large Cap',
    [NORMALIZED_CATEGORIES.MID_CAP]: 'Mid Cap',
    [NORMALIZED_CATEGORIES.SMALL_CAP]: 'Small Cap',
    [NORMALIZED_CATEGORIES.FLEXI_CAP]: 'Flexi Cap',
    [NORMALIZED_CATEGORIES.MULTI_CAP]: 'Multi Cap',
    [NORMALIZED_CATEGORIES.ELSS]: 'ELSS (Tax Saver)',
    [NORMALIZED_CATEGORIES.INDEX]: 'Index Funds',
    [NORMALIZED_CATEGORIES.SECTORAL]: 'Sectoral',
    [NORMALIZED_CATEGORIES.THEMATIC]: 'Thematic',
    [NORMALIZED_CATEGORIES.FOCUSED]: 'Focused',
    [NORMALIZED_CATEGORIES.VALUE]: 'Value',
    [NORMALIZED_CATEGORIES.CONTRA]: 'Contra',
    [NORMALIZED_CATEGORIES.DIVIDEND]: 'Dividend Yield',
    [NORMALIZED_CATEGORIES.HYBRID]: 'Hybrid',
    [NORMALIZED_CATEGORIES.BALANCED]: 'Balanced',
    [NORMALIZED_CATEGORIES.DEBT]: 'Debt',
    [NORMALIZED_CATEGORIES.LIQUID]: 'Liquid',
    [NORMALIZED_CATEGORIES.OVERNIGHT]: 'Overnight',
    [NORMALIZED_CATEGORIES.SHORT_DURATION]: 'Short Duration',
    [NORMALIZED_CATEGORIES.CORPORATE_BOND]: 'Corporate Bond',
    [NORMALIZED_CATEGORIES.BANKING_PSU]: 'Banking & PSU',
    [NORMALIZED_CATEGORIES.GILT]: 'Gilt',
    [NORMALIZED_CATEGORIES.COMMODITY]: 'Commodity',
    [NORMALIZED_CATEGORIES.GOLD]: 'Gold',
    [NORMALIZED_CATEGORIES.SILVER]: 'Silver',
    [NORMALIZED_CATEGORIES.INTERNATIONAL]: 'International',
    [NORMALIZED_CATEGORIES.ETF]: 'ETF',
    [NORMALIZED_CATEGORIES.FOF]: 'Fund of Funds',
    [NORMALIZED_CATEGORIES.EQUITY]: 'Equity',
    [NORMALIZED_CATEGORIES.OTHER]: 'Other',
  };

  return (
    labels[category] ||
    category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}
