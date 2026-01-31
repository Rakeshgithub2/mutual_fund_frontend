'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import analytics from '@/lib/analytics';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { debounce } from '@/lib/utils';

/**
 * Production-Ready Search Component with Autocomplete
 * ===================================================
 * Features:
 * - Debounced API calls (300ms)
 * - Live suggestions from 1 character
 * - Click outside to close
 * - Keyboard navigation (future enhancement)
 * - Mobile-friendly
 * - Loading states
 */

interface FundSuggestion {
  id: string;
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  currentNav: number;
  returns?: {
    oneYear?: number;
    threeYear?: number;
  };
  aum?: number;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSelect?: (fundId: string) => void;
}

export function SearchBar({
  placeholder = 'Search funds (e.g., nippon, sbi, axis...)',
  className = '',
  autoFocus = false,
  onSelect,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FundSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);

    try {
      console.log('🔍 Searching for:', searchQuery);

      const response = await api.get(
        `/api/suggest?q=${encodeURIComponent(searchQuery)}`
      );

      const data = response.data || {};
      const fundSuggestions = data.suggestions || data.data || [];

      console.log('✅ Found suggestions:', fundSuggestions.length);

      setSuggestions(fundSuggestions);
      setShowSuggestions(true);
      // Track search analytics
      analytics.trackSearch(searchQuery, fundSuggestions.length);
    } catch (error: any) {
      console.error('❌ Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      fetchSuggestions(searchQuery);
    }, 300),
    [fetchSuggestions]
  );

  // Handle input change
  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    // Cleanup
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [query, debouncedSearch]);

  // Handle suggestion click
  const handleSuggestionClick = (fundId: string, fundName: string) => {
    setShowSuggestions(false);
    setQuery('');

    // Track fund view analytics
    analytics.trackFundView(fundId, fundName);

    if (onSelect) {
      onSelect(fundId);
    } else {
      router.push(`/funds/${fundId}`);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K Cr`;
    }
    return `₹${value.toFixed(0)} Cr`;
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all selection:bg-blue-100 selection:text-blue-900 shadow-sm hover:border-gray-300"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
            <Loader2
              className="h-5 w-5 animate-spin text-blue-500"
              strokeWidth={2.5}
            />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-2xl ring-1 ring-black/5">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {suggestions.map((fund) => (
              <button
                key={fund.fundId}
                className="w-full border-b border-gray-100 px-4 py-3.5 text-left transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent focus:bg-gradient-to-r focus:from-blue-50 focus:to-transparent focus:outline-none last:border-b-0 active:scale-[0.99]"
                onClick={() => handleSuggestionClick(fund.fundId, fund.name)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h6 className="truncate text-sm font-semibold text-gray-900 leading-snug">
                      {fund.name}
                    </h6>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{fund.fundHouse}</span>
                      <span>•</span>
                      <span>{fund.category}</span>
                      {fund.subCategory && (
                        <>
                          <span>•</span>
                          <span>{fund.subCategory}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {fund.returns?.oneYear !== undefined && (
                      <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        <TrendingUp className="h-3 w-3" />
                        {fund.returns.oneYear.toFixed(2)}% (1Y)
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      ₹{fund.currentNav?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && query && suggestions.length === 0 && !loading && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-2xl ring-1 ring-black/5">
          <div className="px-4 py-8 text-center">
            <div className="text-sm font-medium text-gray-900">
              No funds found
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Try searching with a different term
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
