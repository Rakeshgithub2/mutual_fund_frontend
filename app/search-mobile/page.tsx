'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, X, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';

// Native debounce implementation to avoid lodash dependency
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

interface SearchResult {
  _id: string;
  schemeCode: string;
  schemeName: string;
  category: string;
  subcategory?: string;
  amc?: string;
  nav?: number;
  returns?: {
    '1Y'?: number;
    '3Y'?: number;
    '5Y'?: number;
  };
  riskLevel?: string;
}

export default function MobileSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const searchFunds = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/search/funds?q=${encodeURIComponent(
          searchQuery
        )}&limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.data || []);
        console.log(`✅ Search: ${data.count} results from ${data.source}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((q: string) => searchFunds(q), 300),
    []
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSelectFund = (fund: SearchResult) => {
    const updated = [
      fund.schemeName,
      ...recentSearches.filter((s) => s !== fund.schemeName),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    router.push(`/equity/${fund.schemeCode || fund._id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Mobile Header with Back Button */}
        <div className="md:hidden sticky top-0 z-50 bg-gray-50 dark:bg-gray-950 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBack}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Search Funds</h1>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search mutual funds..."
              className="w-full min-h-[48px] pl-12 pr-12 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:block py-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search mutual funds..."
              className="w-full min-h-[52px] pl-12 pr-12 py-3 text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Searching funds...
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {results.length} funds found
            </p>
            {results.map((fund) => (
              <Card
                key={fund._id}
                onClick={() => handleSelectFund(fund)}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98] min-h-[80px]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2">
                      {fund.schemeName}
                    </h3>
                    {fund.amc && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {fund.amc}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {fund.category}
                      </span>
                      {fund.subcategory && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {fund.subcategory}
                        </span>
                      )}
                      {fund.riskLevel && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {fund.riskLevel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {fund.nav && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          NAV: ₹{fund.nav.toFixed(2)}
                        </span>
                      )}
                      {fund.returns?.['1Y'] && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          1Y: +{fund.returns['1Y'].toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              No funds found for "{query}"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Try different keywords or check spelling
            </p>
          </div>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recent Searches
              </h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline min-h-[44px] px-2"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange(search)}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg cursor-pointer hover:shadow-md transition-shadow min-h-[44px] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                    {search}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!query && recentSearches.length === 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'SBI',
                'HDFC',
                'ICICI',
                'Axis',
                'Nifty 50',
                'Index Fund',
                'Gold ETF',
                'Liquid Fund',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handleInputChange(term)}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors min-h-[44px] active:scale-95"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
