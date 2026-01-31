/**
 * Enhanced Fund List Component
 * Integrated with 4,459 funds backend, pagination, filters, and search
 */

'use client';

import { useState, useEffect } from 'react';
import { ModernFundCard } from './modern-fund-card';
import { Pagination, PaginationInfo } from './pagination';
import { CategoryFilter } from './category-filter';
import { FundSearch } from './fund-search';
import { Button } from './ui/button';
import {
  fundService,
  type Fund,
  type FundsQueryParams,
  handleApiError,
} from '@/lib/fundService';
import { SORT_OPTIONS, API_CONFIG } from '@/lib/constants';
import {
  Loader2,
  AlertCircle,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Language } from '@/lib/i18n';

interface EnhancedFundListProps {
  language?: Language;
  initialCategory?: string | null;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
}

export function EnhancedFundList({
  language = 'en',
  initialCategory = null,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  pageSize = 50,
}: EnhancedFundListProps) {
  // State
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFunds, setTotalFunds] = useState(0);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('returns.oneYear:desc');

  /**
   * Fetch funds from API
   */
  const fetchFunds = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params: FundsQueryParams = {
        page,
        limit: pageSize,
        sort: sortBy,
      };

      // Add category filter if selected
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      // Add search query if present
      if (searchQuery && searchQuery.length >= 3) {
        params.search = searchQuery;
      }

      const response = await fundService.getAll(params);

      if (response.success && response.data) {
        setFunds(response.data);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalFunds(response.pagination.total);
          setCurrentPage(response.pagination.page);
        }
      } else {
        setError('Failed to load funds. Please try again.');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect: Fetch funds when filters change
   */
  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    fetchFunds(1);
  }, [selectedCategory, sortBy, searchQuery]);

  /**
   * Effect: Fetch funds when page changes
   */
  useEffect(() => {
    if (currentPage !== 1) {
      fetchFunds(currentPage);
    }
  }, [currentPage]);

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  /**
   * Handle search
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  /**
   * Handle retry after error
   */
  const handleRetry = () => {
    fetchFunds(currentPage);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {showSearch && (
        <div className="max-w-2xl mx-auto">
          <FundSearch onSearch={handleSearch} />
        </div>
      )}

      {/* Category Filter */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium">Filter by Category</span>
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            variant="buttons"
            showCounts={true}
          />
        </div>
      )}

      {/* Toolbar: Sort and Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <PaginationInfo
          currentPage={currentPage}
          limit={pageSize}
          total={totalFunds}
        />

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading funds...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-red-200 dark:border-red-900">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            {error}
          </p>
          <Button onClick={handleRetry} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && funds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium">No funds found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Fund Grid */}
      {!loading && !error && funds.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {funds.map((fund) => (
              <ModernFundCard key={fund._id} fund={fund} language={language} />
            ))}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
