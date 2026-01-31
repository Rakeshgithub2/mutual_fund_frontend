/**
 * Index Priority Configuration
 * Defines the display order for market indices, matching Groww's layout
 */

export const INDEX_PRIORITY = [
  'NIFTY 50',
  'SENSEX',
  'BANK NIFTY',
  'NIFTY MIDCAP 100',
  'NIFTY SMALLCAP 100',
  'NIFTY IT',
  'NIFTY FMCG',
  'NIFTY PHARMA',
  'NIFTY AUTO',
  'NIFTY METAL',
] as const;

export type IndexName = (typeof INDEX_PRIORITY)[number];

/**
 * Sort market indices by priority order
 */
export function sortIndicesByPriority<T extends { name: string }>(
  indices: T[]
): T[] {
  return indices.sort((a, b) => {
    const indexA = INDEX_PRIORITY.indexOf(a.name as IndexName);
    const indexB = INDEX_PRIORITY.indexOf(b.name as IndexName);

    // If index not in priority list, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

/**
 * Get display order for an index
 */
export function getIndexPriority(indexName: string): number {
  const priority = INDEX_PRIORITY.indexOf(indexName as IndexName);
  return priority === -1 ? 999 : priority;
}
