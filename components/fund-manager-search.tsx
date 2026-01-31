'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Building2, X, Loader2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useFundSearch,
  useFundManagerByFund,
  FundSearchResult,
} from '@/lib/hooks/use-fund-search';
import Link from 'next/link';

interface FundManagerSearchProps {
  onManagerSelect?: (managerId: string) => void;
  placeholder?: string;
  showInstructions?: boolean;
}

export function FundManagerSearch({
  onManagerSelect,
  placeholder = 'Search by fund name (e.g., Nippon, HDFC Top 100, SBI Blue Chip)...',
  showInstructions = true,
}: FundManagerSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedFund, setSelectedFund] = useState<FundSearchResult | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const {
    results,
    loading: searchLoading,
    error: searchError,
    search,
    clear,
  } = useFundSearch(300, 15);
  const {
    manager,
    fund,
    loading: managerLoading,
    error: managerError,
  } = useFundManagerByFund(selectedFund?.fundId || selectedFund?.id || null);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    search(value);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  // Handle fund selection
  const handleFundSelect = useCallback((fund: FundSearchResult) => {
    setSelectedFund(fund);
    setQuery(fund.name);
    setShowResults(false);
    setSelectedIndex(-1);
  }, []);

  // Handle manager card click
  const handleManagerClick = useCallback(() => {
    if (manager?.managerId && onManagerSelect) {
      onManagerSelect(manager.managerId);
    }
  }, [manager, onManagerSelect]);

  // Handle clear
  const handleClear = useCallback(() => {
    setQuery('');
    setSelectedFund(null);
    clear();
    setShowResults(false);
    inputRef.current?.focus();
  }, [clear]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleFundSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return `₹${(amount / 10000).toFixed(1)}K Cr`;
    }
    return `₹${amount.toFixed(0)} Cr`;
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      {showInstructions && !selectedFund && (
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Find Fund Managers by Fund Name
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Search for funds to discover their fund managers with
                    complete profiles including experience, performance, and
                    credentials.
                  </p>
                </div>
              </div>

              {/* Quick Search Suggestions */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-green-300 dark:border-green-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🎯 Quick Searches (with complete manager profiles):
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'nippon small', color: 'blue' },
                    { label: 'hdfc balanced', color: 'purple' },
                    { label: 'sbi blue chip', color: 'green' },
                    { label: 'icici bond', color: 'amber' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setQuery(item.label);
                        search(item.label);
                        setShowResults(true);
                        inputRef.current?.focus();
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-${item.color}-100 dark:bg-${item.color}-900/50 text-${item.color}-700 dark:text-${item.color}-300 hover:bg-${item.color}-200 dark:hover:bg-${item.color}-800/50 transition-colors cursor-pointer`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowResults(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-12 pr-12 h-14 text-base border-2 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-500 rounded-xl shadow-lg"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Loading indicator in input */}
        {searchLoading && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
          </div>
        )}

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && query && (results.length > 0 || searchError) && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
            >
              {searchError && (
                <div className="p-4 text-center text-red-600 dark:text-red-400">
                  <p className="text-sm font-medium">Search Error</p>
                  <p className="text-xs mt-1">{searchError}</p>
                </div>
              )}

              {!searchError && results.length === 0 && !searchLoading && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No funds found for "{query}"</p>
                </div>
              )}

              {results.map((fund, idx) => (
                <div
                  key={`${fund.fundId}-${idx}`}
                  onClick={() => handleFundSelect(fund)}
                  className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    idx === selectedIndex
                      ? 'bg-green-50 dark:bg-green-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {fund.name}
                        </p>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 whitespace-nowrap">
                          {fund.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{fund.fundHouse}</span>
                        <span>•</span>
                        <span>Manager: {fund.fundManager || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">AUM:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(fund.aum)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">1Y:</span>
                          <span
                            className={`font-semibold ${
                              fund.returns.oneYear > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {fund.returns.oneYear > 0 ? '+' : ''}
                            {fund.returns.oneYear.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">NAV:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ₹{fund.currentNav.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Fund & Manager Details */}
      {selectedFund && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Selected Fund Info */}
            <Card className="border-2 border-green-200 dark:border-green-700 shadow-xl mb-4">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-1">
                        {selectedFund.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {selectedFund.fundHouse} • {selectedFund.category}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      AUM
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedFund.aum)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      1Y Return
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        selectedFund.returns.oneYear > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {selectedFund.returns.oneYear > 0 ? '+' : ''}
                      {selectedFund.returns.oneYear.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Current NAV
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      ₹{selectedFund.currentNav.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Expense Ratio
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedFund.expenseRatio.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fund Manager Details */}
            {managerLoading && (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading fund manager details...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {managerError && (
              <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 mb-2">
                      <Info className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-amber-800 dark:text-amber-200 font-bold text-lg mb-2">
                        Fund Manager Profile Not Available
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        The fund manager for "{selectedFund?.name}" is not in
                        our database yet.
                      </p>
                    </div>

                    <div className="max-w-xl mx-auto">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-amber-300 dark:border-amber-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          🎯 Try searching for these funds with complete manager
                          profiles:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left text-xs">
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Nippon Funds:
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              "nippon small cap"
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              HDFC Funds:
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              "hdfc balanced"
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              SBI Funds:
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              "sbi blue chip"
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ICICI Funds:
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              "icici bond"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="mt-4"
                    >
                      Try Another Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {manager && fund && !managerLoading && !managerError && (
              <Card className="border-2 border-green-300 dark:border-green-700 shadow-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        Fund Manager Profile
                      </CardTitle>
                      <CardDescription>
                        Detailed information about the fund manager
                      </CardDescription>
                    </div>
                    <Link href={`/fund-manager/${manager.managerId}`}>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Manager Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {manager.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {manager.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {manager.designation}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {manager.currentFundHouse}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Experience
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {manager.experience} years
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Total AUM
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(manager.totalAumManaged)}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Funds Managed
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {manager.fundsManaged}
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Avg 5Y Return
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        +{manager.averageReturns.fiveYear.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                      Qualifications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {manager.qualification.map((qual, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white border border-indigo-300 dark:border-indigo-700"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                      About
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {manager.bio}
                    </p>
                  </div>

                  {/* Performance */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-semibold">
                      Average Returns Across All Funds
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">1 Year</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{manager.averageReturns.oneYear.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">3 Years</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{manager.averageReturns.threeYear.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">5 Years</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{manager.averageReturns.fiveYear.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Awards */}
                  {manager.awards && manager.awards.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-semibold">
                        Awards & Recognition
                      </p>
                      <div className="space-y-2">
                        {manager.awards.slice(0, 3).map((award, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></span>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {award.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {award.organization} • {award.year}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
