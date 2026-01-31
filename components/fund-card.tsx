'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import {
  useFundSelectionStore,
  MAX_FUNDS,
  type SelectedFund,
} from '@/stores/fund-selection-store';
import { getTranslation } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { Tooltip } from './tooltip';
import { KnowledgeButton } from './knowledge-button';
import {
  Bookmark,
  TrendingUp,
  TrendingDown,
  GitCompare,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

interface FundCardProps {
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
  language: Language;
}

export function FundCard({
  id,
  schemeCode,
  name,
  fundHouse,
  category,
  nav,
  returns1Y,
  returns3Y,
  returns5Y,
  aum,
  expenseRatio,
  rating,
  language,
}: FundCardProps) {
  const router = useRouter();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, mounted } =
    useWatchlist();

  // Use global Zustand store for Compare/Overlap (persists across navigation)
  const store = useFundSelectionStore();
  const inCompare = store.isInCompare(schemeCode || id);
  const inOverlap = store.isInOverlap(schemeCode || id);

  const t = (key: string) => getTranslation(language, key);

  if (!mounted) return null;

  // Ensure all numeric values are valid numbers with defaults
  const safeNav = typeof nav === 'number' && !isNaN(nav) ? nav : 0;
  const safeExpenseRatio =
    typeof expenseRatio === 'number' && !isNaN(expenseRatio)
      ? expenseRatio
      : 1.0;
  const safeAum = typeof aum === 'number' && !isNaN(aum) ? aum : 10000;
  const safeRating =
    typeof rating === 'number' && !isNaN(rating) ? rating : 4.0;
  const safeReturns1Y =
    typeof returns1Y === 'number' && !isNaN(returns1Y) ? returns1Y : 0;
  const safeReturns3Y =
    typeof returns3Y === 'number' && !isNaN(returns3Y) ? returns3Y : 0;
  const safeReturns5Y =
    typeof returns5Y === 'number' && !isNaN(returns5Y) ? returns5Y : 0;

  const inWatchlist = isInWatchlist(id);
  const isPositive = safeReturns5Y >= 0;

  // Build fund object for store
  const fundForStore: SelectedFund = {
    id: schemeCode || id,
    schemeCode: schemeCode || id,
    name,
    fundHouse,
    category,
    nav: safeNav,
    returns1Y: safeReturns1Y,
    returns3Y: safeReturns3Y,
    returns5Y: safeReturns5Y,
    aum: safeAum,
    expenseRatio: safeExpenseRatio,
    rating: safeRating,
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      // Remove from compare
      store.removeFromCompare(schemeCode || id);
      toast.success('Removed from comparison', { description: name });
    } else {
      // Add to compare
      if (!store.canAddToCompare()) {
        toast.error(`Maximum ${MAX_FUNDS} funds allowed`, {
          description: 'Remove a fund to add another',
        });
        return;
      }

      const added = store.addToCompare(fundForStore);
      if (added) {
        toast.success('Added to comparison', {
          description: `${name} (${store.compareFunds.length}/${MAX_FUNDS})`,
          action: {
            label: 'Go to Compare',
            onClick: () => router.push('/compare'),
          },
        });
        router.push('/compare');
      }
    }
  };

  const handleOverlap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inOverlap) {
      // Remove from overlap
      store.removeFromOverlap(schemeCode || id);
      toast.success('Removed from overlap analysis', { description: name });
    } else {
      // Add to overlap
      if (!store.canAddToOverlap()) {
        toast.error(`Maximum ${MAX_FUNDS} funds allowed`, {
          description: 'Remove a fund to add another',
        });
        return;
      }

      const added = store.addToOverlap(fundForStore);
      if (added) {
        toast.success('Added to overlap analysis', {
          description: `${name} (${store.overlapFunds.length}/${MAX_FUNDS})`,
          action: {
            label: 'Go to Overlap',
            onClick: () => router.push('/overlap'),
          },
        });
        router.push('/overlap');
      }
    }
  };

  return (
    <div className="group relative rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">
              {fundHouse}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                {category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                ⭐ {safeRating.toFixed(1)}/5
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              inWatchlist ? removeFromWatchlist(id) : addToWatchlist(id);
            }}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all hover:scale-110 shadow-md ${
              inWatchlist
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200 dark:shadow-blue-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark
              className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`}
            />
          </button>
        </div>

        {/* Key Metrics Grid - Enhanced */}
        <div className="mb-5 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl p-3 border border-blue-100 dark:border-blue-900">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
              {t('fund.nav')}
              <KnowledgeButton term="nav" />
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
              ₹{safeNav.toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-xl p-3 border border-purple-100 dark:border-purple-900">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
              {t('fund.expenseRatio')}
              <KnowledgeButton term="expense-ratio" />
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
              {safeExpenseRatio.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 rounded-xl p-3 border border-orange-100 dark:border-orange-900">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
              {t('fund.aum')}
              <KnowledgeButton term="aum" />
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
              ₹{(safeAum / 1000).toFixed(1)}K Cr
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-xl p-3 border border-green-100 dark:border-green-900">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
              {t('fund.rating')}
              <KnowledgeButton term="rating" />
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
              {safeRating.toFixed(1)}/5
            </p>
          </div>
        </div>

        {/* Returns - Enhanced with Icons */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="text-center bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2">
              {t('fund.returns1Y')}
            </p>
            <div className="flex items-center justify-center gap-1">
              {safeReturns1Y >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <p
                className={`font-bold text-lg ${
                  safeReturns1Y >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {safeReturns1Y >= 0 ? '+' : ''}
                {safeReturns1Y.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="text-center bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2">
              {t('fund.returns3Y')}
            </p>
            <div className="flex items-center justify-center gap-1">
              {safeReturns3Y >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <p
                className={`font-bold text-lg ${
                  safeReturns3Y >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {safeReturns3Y >= 0 ? '+' : ''}
                {safeReturns3Y.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="text-center bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2">
              {t('fund.returns5Y')}
            </p>
            <div className="flex items-center justify-center gap-1">
              {safeReturns5Y >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <p
                className={`font-bold text-lg ${
                  isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {safeReturns5Y >= 0 ? '+' : ''}
                {safeReturns5Y.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Actions - Enhanced */}
        <div className="space-y-2">
          <Link
            href={`/${category.toLowerCase()}/${schemeCode || id}`}
            className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 text-center text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {t('fund.viewDetails')}
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCompare}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] shadow-md flex items-center justify-center gap-1 ${
                inCompare
                  ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                  : 'border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            >
              <GitCompare className="w-3.5 h-3.5" />
              {inCompare ? '✓ Compare' : t('fund.compare')}
            </button>
            <button
              type="button"
              onClick={handleOverlap}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] shadow-md flex items-center justify-center gap-1 ${
                inOverlap
                  ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                  : 'border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 hover:border-green-300 dark:hover:border-green-600'
              }`}
              title={
                inOverlap ? 'Remove from Overlap' : 'Add to Overlap Analysis'
              }
            >
              <Layers className="w-3.5 h-3.5" />
              {inOverlap ? '✓ Overlap' : 'Overlap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
