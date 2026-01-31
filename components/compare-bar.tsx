'use client';

import { useRouter } from 'next/navigation';
import { X, GitCompare, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedFund {
  id: string;
  schemeCode: string;
  name: string;
  fundHouse?: string;
}

interface CompareBarProps {
  selectedFunds: SelectedFund[];
  onRemove: (id: string) => void;
  onClear: () => void;
  minFunds?: number;
  maxFunds?: number;
  className?: string;
}

export function CompareBar({
  selectedFunds,
  onRemove,
  onClear,
  minFunds = 2,
  maxFunds = 4,
  className,
}: CompareBarProps) {
  const router = useRouter();
  const count = selectedFunds.length;
  const canCompare = count >= minFunds && count <= maxFunds;
  const needsMore = count < minFunds;
  const isFull = count >= maxFunds;

  const handleCompare = () => {
    if (!canCompare) return;

    const schemeCodes = selectedFunds.map((f) => f.schemeCode).join(',');
    router.push(`/compare?funds=${schemeCodes}`);
  };

  // Don't show if no funds selected
  if (count === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white dark:bg-gray-900',
        'border-t border-gray-200 dark:border-gray-700',
        'shadow-[0_-4px_20px_rgba(0,0,0,0.1)]',
        'transform transition-transform duration-300',
        'animate-in slide-in-from-bottom',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Selected funds info */}
          <div className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0">
            {/* Fund count */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  canCompare
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                )}
              >
                {count}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                fund{count !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Selected fund pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {selectedFunds.map((fund) => (
                <div
                  key={fund.id}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0',
                    'bg-gray-100 dark:bg-gray-800',
                    'border border-gray-200 dark:border-gray-700'
                  )}
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                    {fund.name}
                  </span>
                  <button
                    onClick={() => onRemove(fund.id)}
                    className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status message */}
            {needsMore && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Select {minFunds - count} more</span>
              </div>
            )}
            {isFull && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span>Max {maxFunds} funds</span>
              </div>
            )}

            {/* Clear button */}
            <button
              onClick={onClear}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                'text-gray-600 dark:text-gray-400',
                'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              Clear
            </button>

            {/* Compare button */}
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                canCompare
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              )}
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Now</span>
            </button>
          </div>
        </div>

        {/* Mobile: Compact view */}
        <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {needsMore
              ? `Select ${minFunds - count} more to compare`
              : `${count} funds ready to compare`}
          </span>
        </div>
      </div>
    </div>
  );
}
