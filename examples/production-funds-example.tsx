/**
 * 🎯 PRODUCTION EXAMPLE: Funds Display Component
 * Demonstrates complete data pipeline usage for 4000+ funds
 *
 * Features:
 * - Multi-mode: Single page OR all funds
 * - Real-time progress tracking
 * - Filters and sorting
 * - Error handling
 * - Loading states
 * - Responsive design
 */

'use client';

import { useState } from 'react';
import { useFunds, useAllEquityFunds } from '@/hooks/use-funds-enhanced';

export default function ProductionFundsExample() {
  const [mode, setMode] = useState<'paginated' | 'all'>('paginated');
  const [category, setCategory] = useState<string>('equity');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        🚀 Mutual Funds Data Pipeline Demo
      </h1>

      {/* Mode Selector */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setMode('paginated')}
          className={`px-6 py-3 rounded-lg font-bold ${
            mode === 'paginated'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          📄 Paginated (50 per page)
        </button>
        <button
          onClick={() => setMode('all')}
          className={`px-6 py-3 rounded-lg font-bold ${
            mode === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          📚 Load All Funds (4000+)
        </button>
      </div>

      {/* Render based on mode */}
      {mode === 'paginated' ? (
        <PaginatedView category={category} />
      ) : (
        <AllFundsView category={category} />
      )}
    </div>
  );
}

/**
 * Component 1: Paginated View (50 funds per page)
 */
function PaginatedView({ category }: { category: string }) {
  const {
    funds,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  } = useFunds({
    filters: { category, limit: 50 },
    fetchAll: false,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading funds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-bold text-lg mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8 shadow-xl">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm opacity-90">Current Page</p>
            <p className="text-3xl font-bold">{pagination?.page || 1}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Per Page</p>
            <p className="text-3xl font-bold">{funds.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Funds</p>
            <p className="text-3xl font-bold">
              {pagination?.total.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Pages</p>
            <p className="text-3xl font-bold">{pagination?.totalPages || 0}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filters.category || ''}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="equity">Equity</option>
          <option value="debt">Debt</option>
          <option value="hybrid">Hybrid</option>
          <option value="commodity">Commodity</option>
        </select>

        <select
          value={filters.sortBy || ''}
          onChange={(e) => setFilters({ sortBy: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Default Sort</option>
          <option value="name">Name</option>
          <option value="returns.oneYear">1Y Returns</option>
          <option value="returns.threeYear">3Y Returns</option>
          <option value="aum">AUM</option>
        </select>

        <select
          value={filters.sortOrder || 'asc'}
          onChange={(e) =>
            setFilters({ sortOrder: e.target.value as 'asc' | 'desc' })
          }
          className="px-4 py-2 border rounded-lg"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {funds.map((fund, index) => (
          <FundCard key={fund.fundId || index} fund={fund} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevPage}
            disabled={!pagination.hasPrev}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 font-bold"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNum = pagination.page - 2 + i;
                if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </div>

          <button
            onClick={nextPage}
            disabled={!pagination.hasNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 font-bold"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Component 2: All Funds View (4000+)
 */
function AllFundsView({ category }: { category: string }) {
  const { funds, loading, error, progress, metadata, refetch } = useFunds({
    filters: { category },
    fetchAll: true,
    onProgress: (loaded, total) => {
      console.log(`📊 Progress: ${loaded}/${total}`);
    },
  });

  if (loading && !progress) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Initializing multi-page fetch...
          </p>
        </div>
      </div>
    );
  }

  if (loading && progress) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Loading All Funds
          </h2>
          <p className="text-gray-600">
            Fetching {progress.total.toLocaleString()} funds from backend...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {progress.loaded.toLocaleString()} /{' '}
              {progress.total.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progress.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Loaded</p>
            <p className="text-2xl font-bold text-blue-600">
              {progress.loaded.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-purple-600">
              {progress.total.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Progress</p>
            <p className="text-2xl font-bold text-green-600">
              {progress.percentage}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-bold text-lg mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Success Stats */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 mb-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          ✅ Successfully Loaded All Funds!
        </h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm opacity-90">Total Funds</p>
            <p className="text-3xl font-bold">
              {funds.length.toLocaleString()}
            </p>
          </div>
          {metadata && (
            <>
              <div>
                <p className="text-sm opacity-90">Available</p>
                <p className="text-3xl font-bold">
                  {metadata.totalAvailable.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Pages Fetched</p>
                <p className="text-3xl font-bold">{metadata.fetchedPages}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Duplicates Removed</p>
                <p className="text-3xl font-bold">
                  {metadata.duplicatesRemoved}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Funds Grid (Show first 100 only for performance) */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">
          Showing first 100 of {funds.length.toLocaleString()} funds
        </h3>
        <p className="text-gray-600 mb-4">
          All {funds.length.toLocaleString()} funds are loaded in memory and
          available for filtering/searching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.slice(0, 100).map((fund, index) => (
          <FundCard key={fund.fundId || index} fund={fund} />
        ))}
      </div>

      {funds.length > 100 && (
        <div className="text-center mt-8 p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            + {(funds.length - 100).toLocaleString()} more funds loaded
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Fund Card Component
 */
function FundCard({ fund }: { fund: any }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all p-6 cursor-pointer border-2 border-transparent hover:border-blue-500">
      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
        {fund.name}
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">NAV:</span>
          <span className="font-bold text-gray-900">
            ₹{fund.currentNav?.toFixed(2) || 'N/A'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium text-gray-900 capitalize">
            {fund.category}
          </span>
        </div>

        {fund.returns?.oneYear !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">1Y Return:</span>
            <span
              className={`font-bold ${
                fund.returns.oneYear >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {fund.returns.oneYear >= 0 ? '+' : ''}
              {fund.returns.oneYear.toFixed(2)}%
            </span>
          </div>
        )}

        {fund.aum && (
          <div className="flex justify-between">
            <span className="text-gray-600">AUM:</span>
            <span className="font-medium text-gray-900">
              ₹{fund.aum.toLocaleString()} Cr
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
}
