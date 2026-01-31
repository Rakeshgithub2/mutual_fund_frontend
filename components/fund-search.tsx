/**
 * Fund Search Component
 * Debounced search with autocomplete suggestions
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fundService, type Fund, handleApiError } from '@/lib/fundService';
import {
  SEARCH_CONFIG,
  getCategoryColors,
  formatPercentage,
} from '@/lib/constants';
import Link from 'next/link';

interface FundSearchProps {
  onSearch?: (query: string) => void;
  onFundSelect?: (fund: Fund) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  className?: string;
}

export function FundSearch({
  onSearch,
  onFundSelect,
  placeholder = 'Search 4,459 mutual funds by name, AMC, or category...',
  showSuggestions = true,
  className = '',
}: FundSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fund[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  /**
   * Debounced search handler
   */
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search if query is too short
    if (query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Start searching indicator
    setIsSearching(true);
    setError(null);

    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fundService.search(
          query,
          SEARCH_CONFIG.MAX_RESULTS
        );

        if (response.success) {
          setResults(response.data);
          setShowResults(true);
        } else {
          setError('Search failed. Please try again.');
        }
      } catch (err) {
        setError(handleApiError(err));
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_CONFIG.DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  /**
   * Handle click outside to close results
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle search input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  /**
   * Handle clear search
   */
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);

    if (onSearch) {
      onSearch('');
    }
  };

  /**
   * Handle fund selection
   */
  const handleFundClick = (fund: Fund) => {
    setShowResults(false);
    setQuery('');

    if (onFundSelect) {
      onFundSelect(fund);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}

          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showSuggestions && showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {/* Error State */}
          {error && (
            <div className="p-4 text-center text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* No Results */}
          {!error && results.length === 0 && !isSearching && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                No funds found for "{query}"
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching by fund name, AMC, or category
              </p>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-muted-foreground">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((fund) => (
                  <Link
                    key={fund._id}
                    href={`/${fund.category}/${fund._id}`}
                    onClick={() => handleFundClick(fund)}
                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1 mb-1">
                          {fund.schemeName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{fund.amc.name}</span>
                          <span>•</span>
                          <Badge
                            variant="outline"
                            className={`${getCategoryColors(fund.category).bg} ${getCategoryColors(fund.category).text} text-xs`}
                          >
                            {fund.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            ₹{fund.nav.value.toFixed(2)}
                          </span>
                        </div>
                        {fund.returns?.oneYear !== undefined && (
                          <div
                            className={`text-xs flex items-center gap-1 ${
                              fund.returns.oneYear >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {formatPercentage(fund.returns.oneYear)} (1Y)
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simple Search Bar (without suggestions)
 */
interface SimpleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleSearchBar({
  value,
  onChange,
  placeholder = 'Search funds...',
  className = '',
}: SimpleSearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />

      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
