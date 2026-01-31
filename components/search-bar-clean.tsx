'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SearchSuggestion {
  id: string;
  schemeCode: string;
  name: string;
  fundHouse: string;
  category: string;
  returns1Y?: number;
}

interface SearchBarCleanProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBarClean({
  value,
  onChange,
  onSearch,
  suggestions = [],
  isLoading = false,
  placeholder = 'Search mutual funds by name, AMC, or scheme code',
  className,
}: SearchBarCleanProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      if (value.length >= 2) {
        onSearch?.(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length >= 2);
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full h-12 pl-12 pr-12 rounded-xl',
            'bg-white dark:bg-gray-900',
            'border border-gray-200 dark:border-gray-700',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all duration-200'
          )}
        />
        {/* Loading or Clear button */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isLoading && value.length >= 2 ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : value ? (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && value.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((fund) => (
                <Link
                  key={fund.schemeCode || fund.id}
                  href={`/${fund.category.toLowerCase().replace(/\s+/g, '-')}/${fund.schemeCode || fund.id}`}
                  onClick={handleSuggestionClick}
                  className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fund.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {fund.fundHouse} • {fund.category}
                      </p>
                    </div>
                    {fund.returns1Y !== undefined && (
                      <div
                        className={cn(
                          'flex items-center text-xs font-medium shrink-0',
                          fund.returns1Y >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {fund.returns1Y >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                        )}
                        {fund.returns1Y >= 0 ? '+' : ''}
                        {fund.returns1Y.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No funds found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
