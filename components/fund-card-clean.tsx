'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FundCardCleanProps {
  id: string;
  schemeCode?: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  nav: number;
  navChange?: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  expenseRatio: number;
  riskLevel?: string;
  planType?: 'Direct' | 'Regular';
  optionType?: 'Growth' | 'IDCW';
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showCheckbox?: boolean;
}

export function FundCardClean({
  id,
  schemeCode,
  name,
  fundHouse,
  category,
  subCategory,
  nav,
  navChange = 0,
  returns1Y,
  returns3Y,
  returns5Y,
  expenseRatio,
  riskLevel = 'Moderately High',
  planType = 'Direct',
  optionType = 'Growth',
  isSelected = false,
  onSelect,
  showCheckbox = false,
}: FundCardCleanProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Safe number handling
  const safeNav = typeof nav === 'number' && !isNaN(nav) ? nav : 0;
  const safeNavChange =
    typeof navChange === 'number' && !isNaN(navChange) ? navChange : 0;
  const safeExpenseRatio =
    typeof expenseRatio === 'number' && !isNaN(expenseRatio) ? expenseRatio : 0;
  const safeReturns1Y =
    typeof returns1Y === 'number' && !isNaN(returns1Y) ? returns1Y : 0;
  const safeReturns3Y =
    typeof returns3Y === 'number' && !isNaN(returns3Y) ? returns3Y : 0;
  const safeReturns5Y =
    typeof returns5Y === 'number' && !isNaN(returns5Y) ? returns5Y : 0;

  const isNavPositive = safeNavChange >= 0;
  const fundLink = `/${category.toLowerCase().replace(/\s+/g, '-')}/${schemeCode || id}`;

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(schemeCode || id, !isSelected);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(schemeCode || id, !isSelected);
  };

  const handleOverlap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/overlap?fund=${schemeCode || id}`);
  };

  // Risk level color
  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes('low') && !riskLower.includes('moderately'))
      return 'text-green-600 dark:text-green-400';
    if (riskLower.includes('moderately low'))
      return 'text-green-500 dark:text-green-400';
    if (riskLower === 'moderate') return 'text-yellow-600 dark:text-yellow-400';
    if (riskLower.includes('moderately high'))
      return 'text-orange-500 dark:text-orange-400';
    if (riskLower.includes('high') || riskLower.includes('very high'))
      return 'text-red-500 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Format return value with color
  const formatReturn = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span
        className={
          isPositive
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }
      >
        {isPositive ? '+' : ''}
        {value.toFixed(1)}%
      </span>
    );
  };

  return (
    <div
      className={cn(
        'relative bg-white dark:bg-gray-900 rounded-xl border transition-all duration-200',
        'hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800',
        isSelected
          ? 'border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/20'
          : 'border-gray-200 dark:border-gray-800'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection checkbox - appears on hover */}
      {(showCheckbox || isHovered) && (
        <div
          className={cn(
            'absolute top-3 left-3 z-10 transition-opacity duration-200',
            isHovered || isSelected ? 'opacity-100' : 'opacity-0'
          )}
        >
          <button
            onClick={handleCheckboxChange}
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400'
            )}
          >
            {isSelected && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      <Link href={fundLink} className="block p-4">
        {/* Header: Fund Name & AMC */}
        <div className="mb-3 pr-6">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{fundHouse}</span>
            <span>•</span>
            <span>{subCategory || category}</span>
            <span>•</span>
            <span>{planType}</span>
            <span>•</span>
            <span>{optionType}</span>
          </div>
        </div>

        {/* NAV Section */}
        <div className="flex items-baseline gap-3 mb-4">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              NAV
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{safeNav.toFixed(2)}
            </span>
          </div>
          <div
            className={cn(
              'flex items-center text-sm font-medium',
              isNavPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {isNavPositive ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            )}
            {isNavPositive ? '+' : ''}
            {safeNavChange.toFixed(2)}%
          </div>
        </div>

        {/* Returns Table */}
        <div className="flex justify-between mb-4 py-2 border-t border-b border-gray-100 dark:border-gray-800">
          <div className="text-center flex-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              1Y
            </span>
            <span className="text-sm font-semibold">
              {formatReturn(safeReturns1Y)}
            </span>
          </div>
          <div className="text-center flex-1 border-l border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              3Y
            </span>
            <span className="text-sm font-semibold">
              {formatReturn(safeReturns3Y)}
            </span>
          </div>
          <div className="text-center flex-1 border-l border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              5Y
            </span>
            <span className="text-sm font-semibold">
              {formatReturn(safeReturns5Y)}
            </span>
          </div>
        </div>

        {/* Risk & Expense */}
        <div className="flex justify-between text-xs mb-4">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Risk: </span>
            <span className={cn('font-medium', getRiskColor(riskLevel))}>
              {riskLevel}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Expense: </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {safeExpenseRatio.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 px-3 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center justify-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              router.push(fundLink);
            }}
          >
            View Details
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleCompare}
            className={cn(
              'py-2 px-3 text-xs font-medium rounded-lg transition-colors',
              isSelected
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            Compare
          </button>
          <button
            onClick={handleOverlap}
            className="py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Overlap
          </button>
        </div>
      </Link>
    </div>
  );
}
