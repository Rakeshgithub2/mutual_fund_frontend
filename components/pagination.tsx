/**
 * Pagination Component
 * Reusable pagination for navigating through fund lists
 */

'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  showFirstLast = true,
  className = '',
}: PaginationProps) {
  /**
   * Calculate visible page numbers
   */
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Adjust if we're at the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Page */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-9 w-9"
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Previous Page */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page 1 (always show) */}
      {showStartEllipsis && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            onClick={() => onPageChange(1)}
            className="h-9 w-9"
          >
            1
          </Button>
          <span className="px-2 text-muted-foreground">...</span>
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}
          className="h-9 w-9"
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </Button>
      ))}

      {/* Last Page (always show) */}
      {showEndEllipsis && (
        <>
          <span className="px-2 text-muted-foreground">...</span>
          <Button
            variant={currentPage === totalPages ? 'default' : 'outline'}
            onClick={() => onPageChange(totalPages)}
            className="h-9 w-9"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Page */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-9 w-9"
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * Pagination Info Component
 * Shows "Showing X-Y of Z results"
 */
interface PaginationInfoProps {
  currentPage: number;
  limit: number;
  total: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  limit,
  total,
  className = '',
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      Showing <span className="font-medium">{startItem}</span> to{' '}
      <span className="font-medium">{endItem}</span> of{' '}
      <span className="font-medium">{total.toLocaleString()}</span> funds
    </p>
  );
}
