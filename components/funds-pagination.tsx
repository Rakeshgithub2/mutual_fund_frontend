'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FundsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
  showLoadMore?: boolean;
  className?: string;
}

export function FundsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLoadMore,
  showLoadMore = true,
  className,
}: FundsPaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = Math.min(maxVisiblePages, totalPages - 1);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisiblePages + 1);
      }

      // Add ellipsis before visible range
      if (start > 2) {
        pages.push('ellipsis');
      }

      // Add visible range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after visible range
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const remainingItems = totalItems - endItem;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing{' '}
          <span className="font-medium text-gray-900 dark:text-white">
            {startItem.toLocaleString()}
          </span>
          {' - '}
          <span className="font-medium text-gray-900 dark:text-white">
            {endItem.toLocaleString()}
          </span>
          {' of '}
          <span className="font-medium text-gray-900 dark:text-white">
            {totalItems.toLocaleString()}
          </span>
          {' funds'}
        </div>

        {/* Page Navigation */}
        <nav className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-gray-400 dark:text-gray-600"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'min-w-[40px] h-10 text-sm font-medium rounded-lg transition-colors',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              currentPage === totalPages
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Load Next 500 Button */}
      {showLoadMore && remainingItems > 0 && currentPage < totalPages && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore || (() => onPageChange(currentPage + 1))}
            className={cn(
              'flex items-center gap-2 px-6 py-3',
              'bg-gradient-to-r from-blue-600 to-blue-700',
              'hover:from-blue-700 hover:to-blue-800',
              'text-white font-semibold rounded-xl',
              'shadow-md hover:shadow-lg',
              'transition-all duration-200'
            )}
          >
            Load Next {Math.min(itemsPerPage, remainingItems).toLocaleString()}{' '}
            Funds
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Jump (for large datasets) */}
      {totalPages > 10 && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Jump to page:</span>
          <select
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className={cn(
              'px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <span>of {totalPages}</span>
        </div>
      )}
    </div>
  );
}

// Simple variant for mobile
export function FundsPaginationMobile({
  currentPage,
  totalPages,
  onPageChange,
}: Pick<FundsPaginationProps, 'currentPage' | 'totalPages' | 'onPageChange'>) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-full transition-colors',
          currentPage === 1
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-full transition-colors',
          currentPage === totalPages
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
