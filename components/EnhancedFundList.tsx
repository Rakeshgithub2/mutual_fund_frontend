/**
 * Enhanced Fund List Component
 *
 * Displays mutual funds with proper backend integration, error handling,
 * filtering, sorting, and pagination.
 *
 * Backend Status: ✅ 4,459 active funds available
 */

'use client';

import React, { useState, useEffect } from 'react';
import { fetchFunds, type Fund, type FundFilters } from '@/lib/api/funds';
import {
  getAllCategories,
  getSubCategoriesForCategory,
  normalizeCategory,
  normalizeSubCategory,
} from '@/lib/utils/categoryNormalizer';
import { FundCard } from './fund-card';

interface EnhancedFundListProps {
  initialFilters?: FundFilters;
  onFundSelect?: (fund: Fund) => void;
  showFilters?: boolean;
  language?: 'en' | 'hi';
}

export const EnhancedFundList: React.FC<EnhancedFundListProps> = ({
  initialFilters = {},
  onFundSelect,
  showFilters = true,
  language = 'en',
}) => {
  // State management
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<FundFilters>({
    page: 1,
    limit: 100, // Increased from 20 to show more funds
    sortBy: 'aum',
    sortOrder: 'desc',
    ...initialFilters,
  });

  // Load funds whenever filters change
  useEffect(() => {
    loadFunds();
  }, [filters]);

  const loadFunds = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Loading funds with filters:', filters);

      const response = await fetchFunds(filters);

      console.log(
        '✅ Funds loaded:',
        response.data.length,
        'of',
        response.pagination.total
      );

      setFunds(response.data);
      setTotalCount(response.pagination.total);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);

      // Log if no funds found
      if (response.data.length === 0) {
        console.warn('⚠️ No funds found with current filters:', filters);
      }
    } catch (err) {
      console.error('❌ Failed to load funds:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load funds';
      setError(errorMessage);
      setFunds([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category ? normalizeCategory(category) : undefined,
      subCategory: undefined, // Reset subcategory when category changes
      page: 1,
    }));
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setFilters((prev) => ({
      ...prev,
      subCategory: subCategory ? normalizeSubCategory(subCategory) : undefined,
      page: 1,
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as any,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 100, // Increased from 20 to match initial state
      sortBy: 'aum',
      sortOrder: 'desc',
    });
  };

  // Get available subcategories based on selected category
  const availableSubCategories = filters.category
    ? getSubCategoriesForCategory(filters.category)
    : [];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading funds...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl w-full">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">
                Error Loading Funds
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={loadFunds}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Retry
              </button>

              <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800 text-sm">
                <p className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  Troubleshooting:
                </p>
                <ul className="list-disc ml-5 space-y-1 text-red-700 dark:text-red-400">
                  <li>Check if backend is running on port 3002</li>
                  <li>Verify NEXT_PUBLIC_API_URL in .env.local</li>
                  <li>Check browser console for errors</li>
                  <li>Check Network tab in DevTools</li>
                  <li>Try opening http://localhost:3002/health in a new tab</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state (but NOT error)
  if (funds.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
            No Funds Found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more results
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Clear All Filters
          </button>
          {Object.keys(filters).length > 0 && (
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-1">Current filters:</p>
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-left overflow-auto">
                {JSON.stringify(filters, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Success state - Display funds
  return (
    <div className="space-y-6">
      {/* Header with count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mutual Funds
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {funds.length} of {totalCount.toLocaleString()} funds
            {filters.category && ` in ${filters.category}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {getAllCategories().map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SubCategory Filter (conditional) */}
            {filters.category && availableSubCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sub Category
                </label>
                <select
                  value={filters.subCategory || ''}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Sub Categories</option>
                  {availableSubCategories.map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'aum'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="aum">AUM (High to Low)</option>
                <option value="returns.oneYear">
                  1Y Returns (High to Low)
                </option>
                <option value="returns.threeYear">
                  3Y Returns (High to Low)
                </option>
                <option value="returns.fiveYear">
                  5Y Returns (High to Low)
                </option>
                <option value="name">Name (A-Z)</option>
                <option value="currentNav">NAV (High to Low)</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fund Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {funds.map((fund) => (
          <div
            key={fund.fundId}
            onClick={() => onFundSelect?.(fund)}
            className="cursor-pointer"
          >
            <FundCard
              id={fund.fundId}
              name={fund.name}
              fundHouse={fund.fundHouse}
              category={fund.category}
              nav={fund.currentNav}
              returns1Y={fund.returns.oneYear}
              returns3Y={fund.returns.threeYear || 0}
              returns5Y={fund.returns.fiveYear || 0}
              aum={fund.aum || 0}
              expenseRatio={fund.expenseRatio || 0}
              rating={fund.ratings?.morningstar || 0}
              language={language}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              First
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Next
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFundList;
