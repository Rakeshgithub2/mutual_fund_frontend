/**
 * Normalization utilities for frontend data handling
 * Ensures consistent string matching across API responses
 */

/**
 * Normalize category strings for consistent matching
 * Examples:
 * - "LargeCap" → "large cap"
 * - "Large Cap" → "large cap"
 * - "large-cap" → "large cap"
 * - "LARGE_CAP" → "large cap"
 */
export function normalizeCategory(category: string | undefined | null): string {
  if (!category) return '';

  return category
    .toLowerCase()
    .replace(/[-_]/g, ' ') // Convert hyphens/underscores to spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
}

/**
 * Check if a fund belongs to equity category
 * Handles various backend formats:
 * - "Equity"
 * - "equity"
 * - "Equity - Large Cap"
 * - "Large Cap Equity"
 */
export function isEquityFund(category: string | undefined | null): boolean {
  if (!category) return false;

  const normalized = normalizeCategory(category);
  return (
    normalized === 'equity' ||
    normalized.startsWith('equity') ||
    normalized.endsWith('equity') ||
    normalized.includes('equity ')
  );
}

/**
 * Check if a fund belongs to debt category
 */
export function isDebtFund(category: string | undefined | null): boolean {
  if (!category) return false;

  const normalized = normalizeCategory(category);
  return (
    normalized === 'debt' ||
    normalized.startsWith('debt') ||
    normalized.endsWith('debt') ||
    normalized.includes('debt ')
  );
}

/**
 * Check if a fund belongs to commodity category
 */
export function isCommodityFund(category: string | undefined | null): boolean {
  if (!category) return false;

  const normalized = normalizeCategory(category);
  return (
    normalized === 'commodity' ||
    normalized.startsWith('commodity') ||
    normalized.endsWith('commodity') ||
    normalized.includes('commodity ') ||
    normalized.includes('gold') ||
    normalized.includes('silver')
  );
}

/**
 * Check if fund name/category matches a subcategory
 * Examples:
 * - matchesSubcategory("HDFC Large Cap Fund", "large cap") → true
 * - matchesSubcategory("SBI Mid-Cap Fund", "mid cap") → true
 */
export function matchesSubcategory(
  fundName: string,
  fundCategory: string | undefined,
  targetSubcategory: string
): boolean {
  const normalized = normalizeCategory(targetSubcategory);
  const nameNormalized = normalizeCategory(fundName);
  const categoryNormalized = normalizeCategory(fundCategory);

  const searchText = `${nameNormalized} ${categoryNormalized}`;

  // Support different formats
  const patterns = [
    normalized, // "large cap"
    normalized.replace(/\s+/g, ''), // "largecap"
    normalized.replace(/\s+/g, '-'), // "large-cap"
  ];

  return patterns.some((pattern) => searchText.includes(pattern));
}

/**
 * Extract quality score from fund data
 * Used for deduplication - keeps the fund with highest quality
 */
export function calculateFundQuality(fund: {
  nav?: number;
  returns1Y?: number;
  aum?: number;
  rating?: number;
  expenseRatio?: number;
}): number {
  let score = 0;

  // Has valid NAV
  if (fund.nav && fund.nav > 0) score += 10;

  // Has returns data
  if (fund.returns1Y && fund.returns1Y !== 0) score += 5;

  // Has AUM data
  if (fund.aum && fund.aum > 0) score += 5;

  // Has rating
  if (fund.rating && fund.rating > 0) score += 3;

  // Has expense ratio
  if (fund.expenseRatio && fund.expenseRatio > 0) score += 2;

  return score;
}

/**
 * Deduplicate funds by name
 * Keeps the fund with best data quality
 */
export function deduplicateFunds<T extends { name: string }>(
  funds: T[],
  qualityFn: (fund: T) => number
): T[] {
  const uniqueFundsMap = new Map<string, T>();

  funds.forEach((fund) => {
    // Skip if fund or name is undefined
    if (!fund || !fund.name || typeof fund.name !== 'string') {
      return;
    }

    // Create a normalized name (remove plan details)
    const normalizedName = fund.name
      .toLowerCase()
      .replace(
        /\s*-\s*(direct|regular|growth|dividend|idcw|weekly|daily|monthly|quarterly|annual).*$/i,
        ''
      )
      .replace(
        /\s*\((direct|regular|growth|dividend|idcw|weekly|daily|monthly|quarterly|annual).*\)$/i,
        ''
      )
      .trim();

    const existing = uniqueFundsMap.get(normalizedName);

    if (!existing) {
      uniqueFundsMap.set(normalizedName, fund);
    } else {
      // Keep the one with better quality
      if (qualityFn(fund) > qualityFn(existing)) {
        uniqueFundsMap.set(normalizedName, fund);
      }
    }
  });

  return Array.from(uniqueFundsMap.values());
}

/**
 * Format category for display
 * Examples:
 * - "equity" → "Equity"
 * - "large cap" → "Large Cap"
 * - "DEBT" → "Debt"
 */
export function formatCategoryDisplay(
  category: string | undefined | null
): string {
  if (!category) return 'Other';

  return category
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
