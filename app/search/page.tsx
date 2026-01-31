'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';
import { useFunds } from '@/hooks/use-funds';

function SearchPageContent() {
  const { language, mounted: langMounted } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [page, setPage] = useState(1);

  // Read category and subCategory from URL on mount
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSubCategory = searchParams.get('subCategory');
    if (urlCategory) {
      setCategory(urlCategory);
    }
    if (urlSubCategory) {
      setSubCategory(urlSubCategory);
    }
  }, [searchParams]);

  // Update URL when category changes
  const updateCategory = (newCategory: string) => {
    setCategory(newCategory);
    setSubCategory(''); // Reset subcategory when main category changes
    setPage(1);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    params.delete('subCategory'); // Clear subcategory from URL
    router.push(`/search?${params.toString()}`);
  };

  // Update URL when subcategory changes
  const updateSubCategory = (newSubCategory: string) => {
    setSubCategory(newSubCategory);
    setPage(1);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newSubCategory) {
      params.set('subCategory', newSubCategory);
    } else {
      params.delete('subCategory');
    }
    router.push(`/search?${params.toString()}`);
  };

  const {
    funds: rawFunds,
    pagination,
    loading,
    error,
  } = useFunds({
    query: searchQuery,
    category: category || undefined,
    subCategory: subCategory || undefined,
    page,
    limit: 5000, // Increased to show all search results
  });

  const t = (key: string) => getTranslation(language, key);

  // Transform API Fund type to FundList's expected type
  const funds = rawFunds.map((fund) => ({
    id: fund.id || fund.fundId,
    name: fund.name,
    fundHouse: fund.fundHouse,
    category: fund.category,
    nav: fund.currentNav,
    returns1Y: fund.returns?.oneYear || 0,
    returns3Y: fund.returns?.threeYear || 0,
    returns5Y: fund.returns?.fiveYear || 0,
    aum: fund.aum || 0,
    expenseRatio: fund.expenseRatio || 0,
    rating:
      fund.ratings?.morningstar ||
      fund.ratings?.crisil ||
      fund.ratings?.valueResearch ||
      0,
  }));

  // Get unique categories from loaded funds
  const categories = Array.from(new Set(funds.map((f) => f.category)));

  // Client-side filters for additional filtering
  const [clientFilters, setClientFilters] = useState({
    minExpenseRatio: 0,
    maxExpenseRatio: 5,
    minRating: 0,
    minAUM: 0,
  });

  const filteredResults = funds.filter((fund) => {
    const matchesExpenseRatio =
      !fund.expenseRatio ||
      (fund.expenseRatio >= clientFilters.minExpenseRatio &&
        fund.expenseRatio <= clientFilters.maxExpenseRatio);
    const matchesRating =
      !fund.rating || fund.rating >= clientFilters.minRating;
    const matchesAUM = !fund.aum || fund.aum >= clientFilters.minAUM * 10000000; // Convert crores to actual value

    return matchesExpenseRatio && matchesRating && matchesAUM;
  });

  if (!langMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Search & Filter Funds
          </h1>
          <p className="mt-2 text-muted">
            Find the perfect fund for your investment goals
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 sticky top-24">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Fund name, house..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => updateCategory(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Categories</option>
                  <option value="equity">Equity Funds</option>
                  <option value="commodity">Commodity Funds</option>
                </select>
              </div>

              {/* Expense Ratio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Expense Ratio: {clientFilters.maxExpenseRatio.toFixed(2)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={clientFilters.maxExpenseRatio}
                  onChange={(e) =>
                    setClientFilters({
                      ...clientFilters,
                      maxExpenseRatio: Number.parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minimum Rating
                </label>
                <select
                  value={clientFilters.minRating}
                  onChange={(e) =>
                    setClientFilters({
                      ...clientFilters,
                      minRating: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="0">All Ratings</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* AUM */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minimum AUM (₹ Crore)
                </label>
                <input
                  type="number"
                  value={clientFilters.minAUM}
                  onChange={(e) =>
                    setClientFilters({
                      ...clientFilters,
                      minAUM: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategory('');
                  setSubCategory('');
                  setPage(1);
                  setClientFilters({
                    minExpenseRatio: 0,
                    maxExpenseRatio: 5,
                    minRating: 0,
                    minAUM: 0,
                  });
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Main Category Buttons */}
            <div className="mb-4 p-4 bg-card rounded-lg border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Select Category
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateCategory('')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    category === ''
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                      : 'bg-background border-2 border-border hover:bg-card hover:border-blue-300'
                  }`}
                >
                  All Funds
                </button>
                <button
                  onClick={() => updateCategory('equity')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    category === 'equity'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
                      : 'bg-background border-2 border-border hover:bg-card hover:border-green-300'
                  }`}
                >
                  Equity Funds
                </button>
                <button
                  onClick={() => updateCategory('commodity')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    category === 'commodity'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg scale-105'
                      : 'bg-background border-2 border-border hover:bg-card hover:border-orange-300'
                  }`}
                >
                  Commodity Funds
                </button>
              </div>
            </div>

            {/* Subcategory Buttons - Show based on selected category */}
            {category === 'equity' && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-green-600">📊</span>
                  Equity Subcategories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateSubCategory('')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === ''
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'
                    }`}
                  >
                    All Equity
                  </button>
                  <button
                    onClick={() => updateSubCategory('largecap')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === 'largecap'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'
                    }`}
                  >
                    Large Cap
                  </button>
                  <button
                    onClick={() => updateSubCategory('midcap')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === 'midcap'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'
                    }`}
                  >
                    Mid Cap
                  </button>
                  <button
                    onClick={() => updateSubCategory('smallcap')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === 'smallcap'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'
                    }`}
                  >
                    Small Cap
                  </button>
                  <button
                    onClick={() => updateSubCategory('multicap')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === 'multicap'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'
                    }`}
                  >
                    Multi Cap
                  </button>
                </div>
              </div>
            )}

            {category === 'commodity' && (
              <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-orange-600">💎</span>
                  Commodity Subcategories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateSubCategory('')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === ''
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                    }`}
                  >
                    All Commodity
                  </button>
                  <button
                    onClick={() => updateSubCategory('Gold')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === 'Gold'
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                    }`}
                  >
                    Gold
                  </button>
                  <button
                    onClick={() => updateSubCategory('Silver')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      subCategory === 'Silver'
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                    }`}
                  >
                    Silver
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {loading
                  ? 'Loading...'
                  : `Results: ${filteredResults.length} fund${
                      filteredResults.length !== 1 ? 's' : ''
                    } found`}
              </h2>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Error loading funds
                </p>
                <p className="text-sm text-red-700">
                  {error.message || 'Please try again.'}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Backend URL:{' '}
                  {process.env.NEXT_PUBLIC_API_URL ||
                    (() => {
                      const BASE_URL =
                        process.env.NEXT_PUBLIC_API_URL ||
                        'http://localhost:3002';
                      return `${BASE_URL}/api`;
                    })()}
                </p>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-card p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              <>
                <FundList funds={filteredResults} language={language} />

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasMore}
                      className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <p className="text-lg text-muted">{t('common.noResults')}</p>
                <p className="mt-2 text-sm text-muted">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted">
            <p>&copy; 2025 MutualFunds.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
