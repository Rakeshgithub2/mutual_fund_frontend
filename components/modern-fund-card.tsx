/**
 * Modern Fund Card Component
 * Updated for 4,459 funds backend with new data structure
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { useCompare } from '@/lib/hooks/use-compare';
import { useOverlap } from '@/lib/hooks/use-overlap';
import { getTranslation } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import type { Fund } from '@/lib/fundService';
import {
  getCategoryColors,
  formatPercentage,
  formatAUM,
  RISK_LEVEL_COLORS,
} from '@/lib/constants';
import { KnowledgeButton } from './knowledge-button';
import {
  Bookmark,
  TrendingUp,
  TrendingDown,
  GitCompare,
  Building2,
  Calendar,
  Shield,
  DollarSign,
} from 'lucide-react';
import { Badge } from './ui/badge';

interface ModernFundCardProps {
  fund: Fund;
  language?: Language;
}

export function ModernFundCard({ fund, language = 'en' }: ModernFundCardProps) {
  const router = useRouter();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, mounted } =
    useWatchlist();
  const { addToCompare, isInCompare } = useCompare();
  const { addToOverlap, isInOverlap } = useOverlap();
  const t = (key: string) => getTranslation(language, key);

  if (!mounted) return null;

  const inWatchlist = isInWatchlist(fund._id);
  const inOverlap = isInOverlap(fund._id);
  const inCompare = isInCompare(fund._id);

  const categoryColors = getCategoryColors(fund.category);
  const riskColors =
    RISK_LEVEL_COLORS[fund.riskLevel] || RISK_LEVEL_COLORS['Low'];

  const oneYearReturn = fund.returns?.oneYear ?? 0;
  const isPositiveReturn = oneYearReturn >= 0;

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(fund._id);
    router.push('/compare');
  };

  const handleOverlap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToOverlap(fund._id);
    router.push('/overlap');
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inWatchlist ? removeFromWatchlist(fund._id) : addToWatchlist(fund._id);
  };

  return (
    <div className="group relative rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
              {fund.schemeName}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{fund.amc.name}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium`}
              >
                {fund.category}
              </Badge>
              <Badge
                className={`${riskColors.bg} ${riskColors.text} text-xs font-medium`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {fund.riskLevel}
              </Badge>
            </div>
          </div>

          <button
            onClick={handleWatchlist}
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

        {/* NAV and Change */}
        <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1 text-xs font-semibold">
                Current NAV
                <KnowledgeButton term="nav" />
              </div>
              <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                ₹{fund.nav.value.toFixed(4)}
              </p>
            </div>

            <div className="text-right">
              <div
                className={`flex items-center justify-end gap-1 text-sm font-bold ${
                  fund.nav.changePercent >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {fund.nav.changePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {formatPercentage(fund.nav.changePercent)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {fund.nav.change >= 0 ? '+' : ''}₹{fund.nav.change.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1 text-xs font-semibold">
              AUM
              <KnowledgeButton term="aum" />
            </div>
            <p className="font-bold text-base text-gray-900 dark:text-gray-100">
              {formatAUM(fund.aum)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1 text-xs font-semibold">
              Expense Ratio
              <KnowledgeButton term="expense-ratio" />
            </div>
            <p className="font-bold text-base text-gray-900 dark:text-gray-100">
              {fund.expenseRatio.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1 text-xs font-semibold">
              <DollarSign className="h-3 w-3" />
              Min Investment
            </div>
            <p className="font-bold text-base text-gray-900 dark:text-gray-100">
              ₹{fund.minInvestment.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-1 text-xs font-semibold">
              Exit Load
            </div>
            <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
              {fund.exitLoad}
            </p>
          </div>
        </div>

        {/* Returns */}
        {fund.returns && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Returns Performance
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {fund.returns.oneYear !== undefined && (
                <div className="text-center bg-white dark:bg-gray-900/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
                    1Y
                  </p>
                  <p
                    className={`font-bold text-sm ${
                      fund.returns.oneYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercentage(fund.returns.oneYear)}
                  </p>
                </div>
              )}

              {fund.returns.threeYear !== undefined && (
                <div className="text-center bg-white dark:bg-gray-900/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
                    3Y
                  </p>
                  <p
                    className={`font-bold text-sm ${
                      fund.returns.threeYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercentage(fund.returns.threeYear)}
                  </p>
                </div>
              )}

              {fund.returns.fiveYear !== undefined && (
                <div className="text-center bg-white dark:bg-gray-900/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
                    5Y
                  </p>
                  <p
                    className={`font-bold text-sm ${
                      fund.returns.fiveYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercentage(fund.returns.fiveYear)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Link
            href={`/equity/${fund.schemeCode || fund._id}`}
            className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 text-center text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            View Details
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCompare}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] shadow-md ${
                inCompare
                  ? 'border-primary bg-primary text-white hover:bg-primary/90'
                  : 'border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
              title={
                inCompare
                  ? 'Added to Compare - View Comparison'
                  : 'Add to Compare'
              }
            >
              {inCompare ? '✓ Compare' : 'Compare'}
            </button>

            <button
              type="button"
              onClick={handleOverlap}
              className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] shadow-md flex items-center justify-center gap-1 ${
                inOverlap
                  ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600'
                  : 'border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:border-orange-300 dark:hover:border-orange-600'
              }`}
              title={
                inOverlap
                  ? 'Added to Overlap - View Analysis'
                  : 'Add to Overlap Analysis'
              }
            >
              <GitCompare className="w-3.5 h-3.5" />
              {inOverlap ? '✓ Overlap' : 'Overlap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
