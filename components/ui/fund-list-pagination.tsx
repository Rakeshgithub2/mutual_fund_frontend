/**
 * Pagination Component
 *
 * A comprehensive pagination component for large datasets (e.g., 600+ funds).
 * Displays:
 *  - Page info (showing X to Y of Z items)
 *  - Previous/Next buttons
 *  - Smart page number display with ellipses
 *  - Jump-to-page input
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function FundListPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Page Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing{' '}
        <span className="font-medium text-gray-900 dark:text-white">
          {startItem}
        </span>{' '}
        to{' '}
        <span className="font-medium text-gray-900 dark:text-white">
          {endItem}
        </span>{' '}
        of{' '}
        <span className="font-medium text-gray-900 dark:text-white">
          {totalItems}
        </span>{' '}
        funds
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-gray-400 dark:text-gray-500"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                onClick={() => onPageChange(page as number)}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            )
          )}
        </div>

        {/* Mobile: Show only current page */}
        <div className="sm:hidden">
          <Button variant="outline" size="sm" disabled>
            {currentPage} / {totalPages}
          </Button>
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Jump to Page */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          Go to:
        </label>
        <Input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="w-16 h-9 text-center"
        />
      </div>
    </div>
  );
}
