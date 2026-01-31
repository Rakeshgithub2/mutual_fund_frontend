'use client';

import { useState } from 'react';
import { FundCard } from './fund-card';
import { getTranslation } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

interface Fund {
  id: string;
  schemeCode?: string;
  name: string;
  fundHouse: string;
  category: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
}

interface FundListProps {
  funds: Fund[];
  language: Language;
}

export function FundList({ funds, language }: FundListProps) {
  const [sortBy, setSortBy] = useState<'returns5Y' | 'expenseRatio' | 'rating'>(
    'returns5Y'
  );
  const [filterCategory, setFilterCategory] = useState<string>('');
  const t = (key: string) => getTranslation(language, key);

  // If you want to fetch more funds at once, set limit=2500 in your API call: /api/funds?limit=2500
  const categories = [...new Set(funds.map((f) => f.category))];

  const filtered = funds.filter(
    (f) => !filterCategory || f.category === filterCategory
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'returns5Y') return b.returns5Y - a.returns5Y;
    if (sortBy === 'expenseRatio') return a.expenseRatio - b.expenseRatio;
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !filterCategory
                ? 'bg-primary text-white'
                : 'border border-border hover:bg-card'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-card'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium focus:border-primary focus:outline-none"
        >
          <option value="returns5Y">Sort by 5Y Returns</option>
          <option value="expenseRatio">Sort by Expense Ratio</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Fund Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((fund, index) => (
          <FundCard
            // Use index to guarantee unique key (database may have duplicates)
            key={`fund-${fund.fundId || fund._id || fund.schemeCode || ''}-${index}`}
            {...fund}
            language={language}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted">{t('common.noResults')}</p>
        </div>
      )}
    </div>
  );
}
