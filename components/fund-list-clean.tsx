'use client';

import { FundCardClean } from './fund-card-clean';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Fund {
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
}

interface FundListCleanProps {
  funds: Fund[];
  isLoading?: boolean;
  selectedFunds?: string[];
  onSelectFund?: (id: string, selected: boolean) => void;
  sortBy?: 'returns1Y' | 'returns3Y' | 'returns5Y' | 'expenseRatio' | 'name';
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  className?: string;
}

export function FundListClean({
  funds,
  isLoading = false,
  selectedFunds = [],
  onSelectFund,
  sortBy = 'returns5Y',
  sortOrder = 'desc',
  onSortChange,
  className,
}: FundListCleanProps) {
  // Sort options
  const sortOptions = [
    { value: 'returns5Y', label: '5Y Returns' },
    { value: 'returns3Y', label: '3Y Returns' },
    { value: 'returns1Y', label: '1Y Returns' },
    { value: 'expenseRatio', label: 'Expense Ratio' },
    { value: 'name', label: 'Fund Name' },
  ];

  // Sorted funds
  const sortedFunds = [...funds].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'returns5Y':
        comparison = (b.returns5Y || 0) - (a.returns5Y || 0);
        break;
      case 'returns3Y':
        comparison = (b.returns3Y || 0) - (a.returns3Y || 0);
        break;
      case 'returns1Y':
        comparison = (b.returns1Y || 0) - (a.returns1Y || 0);
        break;
      case 'expenseRatio':
        comparison = (a.expenseRatio || 0) - (b.expenseRatio || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Loading funds...
        </p>
      </div>
    );
  }

  if (funds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No funds found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {funds.length.toLocaleString()} fund{funds.length !== 1 ? 's' : ''}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value, sortOrder)}
            className={cn(
              'text-sm font-medium rounded-lg px-3 py-1.5',
              'bg-white dark:bg-gray-900',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              onSortChange?.(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className={cn(
              'p-1.5 rounded-lg',
              'bg-white dark:bg-gray-900',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              'transition-colors'
            )}
            title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            {sortOrder === 'asc' ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Fund Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sortedFunds.map((fund) => (
          <FundCardClean
            key={fund.schemeCode || fund.id}
            id={fund.id}
            schemeCode={fund.schemeCode}
            name={fund.name}
            fundHouse={fund.fundHouse}
            category={fund.category}
            subCategory={fund.subCategory}
            nav={fund.nav}
            navChange={fund.navChange}
            returns1Y={fund.returns1Y}
            returns3Y={fund.returns3Y}
            returns5Y={fund.returns5Y}
            expenseRatio={fund.expenseRatio}
            riskLevel={fund.riskLevel}
            planType={fund.planType}
            optionType={fund.optionType}
            isSelected={selectedFunds.includes(fund.schemeCode || fund.id)}
            onSelect={onSelectFund}
            showCheckbox={selectedFunds.length > 0}
          />
        ))}
      </div>
    </div>
  );
}
