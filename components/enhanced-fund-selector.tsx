'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  TrendingUp,
  Loader2,
  Info,
  Building2,
  Star,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

interface FundOption {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
  riskLevel?: string;
}

interface EnhancedFundSelectorProps {
  onSelectionChange: (selectedFunds: FundOption[]) => void;
  minSelection: number;
  maxSelection: number;
  placeholder?: string;
  mode: 'compare' | 'overlap';
  initialSelection?: FundOption[];
}

export function EnhancedFundSelector({
  onSelectionChange,
  minSelection,
  maxSelection,
  placeholder = 'Search funds by name, AMC, category...',
  mode,
  initialSelection = [],
}: EnhancedFundSelectorProps) {
  const [selectedFunds, setSelectedFunds] =
    useState<FundOption[]>(initialSelection);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'equity' | 'debt'>(
    'all'
  );
  const [filterRisk, setFilterRisk] = useState<
    'all' | 'low' | 'moderate' | 'high'
  >('all');
  const [filterAMC, setFilterAMC] = useState<string>('all');

  const searchRef = useRef<HTMLDivElement>(null);

  // 🌐 Use unified fund universe API (single source of truth)
  const [allFunds, setAllFunds] = useState<FundOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fund universe on mount
  useEffect(() => {
    async function fetchFundUniverse() {
      setLoading(true);
      setError(null);
      try {
        console.log('🌐 [EnhancedFundSelector] Fetching fund universe...');
        const response = await apiClient.getFundUniverse({ limit: 5000 });

        if (response.success && response.data) {
          setAllFunds(response.data);
          console.log(
            `✅ [EnhancedFundSelector] Loaded ${response.data.length} funds from universe`
          );
        } else {
          throw new Error(response.error || 'Failed to load fund universe');
        }
      } catch (err) {
        console.error(
          '❌ [EnhancedFundSelector] Error fetching fund universe:',
          err
        );
        setError(err instanceof Error ? err.message : 'Failed to load funds');
      } finally {
        setLoading(false);
      }
    }

    fetchFundUniverse();
  }, []);

  // Transform funds to the required format (already formatted from API)
  const transformedFunds = useMemo(() => {
    return allFunds.map((fund, index) => ({
      id: fund.id || fund.schemeCode || `fund-${index}`,
      _id: fund.id,
      scheme_code: fund.schemeCode,
      name: fund.name || 'Unnamed Fund',
      fundHouse: fund.fundHouse || 'Unknown AMC',
      category: fund.category || 'Other',
      subCategory: fund.subCategory,
      nav: Number(fund.nav || 0),
      returns1Y: Number(fund.returns1Y || 0),
      returns3Y: Number(fund.returns3Y || 0),
      returns5Y: Number(fund.returns5Y || 0),
      aum: Number(fund.aum || 0),
      expenseRatio: Number(fund.expenseRatio || 0),
      rating: Number(fund.rating || 0),
      riskLevel: fund.riskLevel || 'Moderate',
    }));
  }, [allFunds]);

  // Get unique AMCs filtered by fund type
  const amcs = useMemo(() => {
    let fundsToCount = transformedFunds;

    // Filter by type if selected
    if (filterType !== 'all') {
      fundsToCount = transformedFunds.filter((fund) => {
        const category = fund.category?.toLowerCase() || '';
        if (filterType === 'equity') {
          return category.includes('equity') || category === 'equity';
        } else if (filterType === 'debt') {
          return !category.includes('equity');
        }
        return true;
      });
    }

    // Count funds per AMC
    const amcCounts = new Map<string, number>();
    fundsToCount.forEach((fund) => {
      const count = amcCounts.get(fund.fundHouse) || 0;
      amcCounts.set(fund.fundHouse, count + 1);
    });

    // Sort by count (descending) then alphabetically
    const sortedAmcs = Array.from(amcCounts.entries())
      .sort((a, b) => {
        // Sort by count first (descending)
        if (b[1] !== a[1]) return b[1] - a[1];
        // Then alphabetically
        return a[0].localeCompare(b[0]);
      })
      .map(([amc, count]) => ({ name: amc, count }));

    return sortedAmcs;
  }, [transformedFunds, filterType]);

  // Fuzzy search function (null-safe)
  const fuzzyMatch = (text?: string, query?: string): boolean => {
    if (!text || !query) return false;

    const cleanText = text
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const cleanQuery = query
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    if (!cleanText || !cleanQuery) return false;

    if (cleanText.includes(cleanQuery)) return true;

    let ti = 0;
    for (let qi = 0; qi < cleanQuery.length; qi++) {
      ti = cleanText.indexOf(cleanQuery[qi], ti);
      if (ti === -1) return false;
      ti++;
    }
    return true;
  };

  // Filter and search funds
  const filteredFunds = useMemo(() => {
    let filtered = transformedFunds;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((fund) => {
        const category = fund.category?.toLowerCase() || '';

        if (filterType === 'equity') {
          return category.includes('equity') || category === 'equity';
        } else if (filterType === 'debt') {
          return !category.includes('equity');
        }
        return true;
      });
    }

    // Filter by risk
    if (filterRisk !== 'all') {
      filtered = filtered.filter((fund) => {
        const risk = fund.riskLevel?.toLowerCase() || 'moderate';
        return risk.includes(filterRisk);
      });
    }

    // Filter by AMC
    if (filterAMC !== 'all') {
      filtered = filtered.filter((fund) => fund.fundHouse === filterAMC);
    }

    // Search filter with fuzzy matching
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.trim();
      filtered = filtered.filter((fund) => {
        return (
          fuzzyMatch(fund.name, query) ||
          fuzzyMatch(fund.fundHouse, query) ||
          fuzzyMatch(fund.category, query) ||
          fuzzyMatch(fund.subCategory, query)
        );
      });
    }

    // Exclude already selected funds
    filtered = filtered.filter(
      (fund) => !selectedFunds.some((sf) => sf.id === fund.id)
    );

    // Sort by relevance and performance
    filtered.sort((a, b) => {
      // Prioritize direct name matches
      if (searchQuery.trim()) {
        const aMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const bMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
      }

      // Then by 3Y returns
      return b.returns3Y - a.returns3Y;
    });

    return filtered.slice(0, 50); // Limit to 50 for performance
  }, [
    transformedFunds,
    filterType,
    filterRisk,
    filterAMC,
    searchQuery,
    selectedFunds,
  ]);

  // Handle fund selection
  const handleSelectFund = (fund: FundOption) => {
    if (selectedFunds.length >= maxSelection) return;

    const newSelection = [...selectedFunds, fund];
    setSelectedFunds(newSelection);
    onSelectionChange(newSelection);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Handle fund removal
  const handleRemoveFund = (fundId: string) => {
    const newSelection = selectedFunds.filter((f) => f.id !== fundId);
    setSelectedFunds(newSelection);
    onSelectionChange(newSelection);
  };

  // Handle clear all
  const handleClearAll = () => {
    setSelectedFunds([]);
    onSelectionChange([]);
    setSearchQuery('');
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatNumber = (value: any): string => {
    const num = Number(value);

    if (isNaN(num)) return '₹0 Cr';

    if (num >= 10000) return `₹${(num / 1000).toFixed(1)}k Cr`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(2)}k Cr`;
    return `₹${num.toFixed(0)} Cr`;
  };

  const canAnalyze =
    selectedFunds.length >= minSelection &&
    selectedFunds.length <= maxSelection;

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              {mode === 'compare'
                ? 'Fund Comparison'
                : 'Portfolio Overlap Analysis'}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Select {minSelection}-{maxSelection} funds to{' '}
              {mode === 'compare'
                ? 'compare their performance, expenses, and features'
                : 'analyze portfolio overlap and diversification'}
              .
              {selectedFunds.length > 0 &&
                ` (${selectedFunds.length}/${maxSelection} selected)`}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            Fund Type
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as any);
              setFilterAMC('all'); // Reset AMC when type changes
            }}
            suppressHydrationWarning
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
          >
            <option value="all">All Types (Equity + Debt)</option>
            <option value="equity">Equity Funds Only</option>
            <option value="debt">Debt Funds Only</option>
          </select>
        </div>

        {/* AMC Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            Fund House (AMC) {amcs.length > 0 && `- ${amcs.length} available`}
          </label>
          <select
            value={filterAMC}
            onChange={(e) => setFilterAMC(e.target.value)}
            suppressHydrationWarning
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
          >
            <option value="all">All Fund Houses</option>
            {amcs.map((amc, index) => (
              <option key={`${amc.name}-${index}`} value={amc.name}>
                {amc.name} ({amc.count} funds)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input with Autocomplete */}
      <div ref={searchRef} className="relative">
        {/* Max selection warning */}
        {selectedFunds.length >= maxSelection && (
          <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You can compare a maximum of {maxSelection} funds for clarity.
              Remove a fund to add another.
            </p>
          </div>
        )}

        {/* Min selection hint */}
        {selectedFunds.length > 0 && selectedFunds.length < minSelection && (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Please select at least {minSelection} funds to{' '}
              {mode === 'compare' ? 'compare' : 'analyze overlap'}.
            </p>
          </div>
        )}

        <div className="relative">
          <Input
            type="text"
            placeholder="Search funds by name, AMC, or category..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            disabled={selectedFunds.length >= maxSelection}
            className="px-5 pr-12 h-16 text-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions */}
        <AnimatePresence>
          {showSuggestions && searchQuery.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto"
            >
              {loading && (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading funds...
                  </p>
                </div>
              )}

              {!loading && filteredFunds.length === 0 && (
                <div className="p-8 text-center">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No funds found
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}

              {!loading &&
                filteredFunds.map((fund, index) => (
                  <button
                    key={
                      fund._id ||
                      fund.scheme_code ||
                      fund.id ||
                      `fund-${fund.name}-${index}`
                    }
                    onClick={() => handleSelectFund(fund)}
                    disabled={selectedFunds.length >= maxSelection}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {fund.name}
                          </p>
                          {fund.rating > 0 && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {fund.rating}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Building2 className="w-3 h-3" />
                          <span>{fund.fundHouse}</span>
                          <span>•</span>
                          <span>{fund.category}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-0.5">
                              NAV
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ₹{fund.nav.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-0.5">
                              1Y Return
                            </p>
                            <p
                              className={`font-semibold ${
                                fund.returns1Y >= 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {fund.returns1Y >= 0 ? '+' : ''}
                              {fund.returns1Y.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-0.5">
                              AUM
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatNumber(fund.aum)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Funds Chips */}
      {selectedFunds.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Selected Funds ({selectedFunds.length}/{maxSelection})
            </p>
            {selectedFunds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedFunds.map((fund, index) => (
              <motion.div
                key={
                  fund._id ||
                  fund.scheme_code ||
                  fund.id ||
                  `selected-${fund.name}-${index}`
                }
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="p-4 border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {fund.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {fund.fundHouse}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {fund.category}
                        </Badge>
                        <span
                          className={`font-semibold ${
                            fund.returns1Y >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {fund.returns1Y >= 0 ? '+' : ''}
                          {fund.returns1Y.toFixed(1)}% (1Y)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFund(fund.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-full p-1 transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Status */}
      {!canAnalyze && selectedFunds.length > 0 && (
        <Card className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {selectedFunds.length < minSelection
                ? `Select at least ${
                    minSelection - selectedFunds.length
                  } more ${
                    minSelection - selectedFunds.length === 1 ? 'fund' : 'funds'
                  } to continue`
                : `Maximum ${maxSelection} funds allowed. Remove one to add another.`}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
