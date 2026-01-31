'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, TrendingUp, Loader2, Plus } from 'lucide-react';

interface Fund {
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

interface FundSelectorProps {
  selectedFunds: string[];
  onAddFund: (fundId: string) => void;
  onRemoveFund: (fundId: string) => void;
  maxFunds?: number;
  categoryFilter?: 'all' | 'equity' | 'debt' | 'commodity';
  title?: string;
}

export function FundSelector({
  selectedFunds,
  onAddFund,
  onRemoveFund,
  maxFunds = 5,
  categoryFilter = 'all',
  title = 'Select Funds',
}: FundSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Fund[]>([]);
  const [fundDetails, setFundDetails] = useState<Map<string, Fund>>(new Map());
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 1) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(
          `/suggest?q=${encodeURIComponent(searchQuery)}`
        );
        const data = response.data || [];
        let fundSuggestions = data.suggestions || [];

        // Apply category filter
        if (categoryFilter === 'equity') {
          fundSuggestions = fundSuggestions.filter((fund: Fund) =>
            fund.category?.toLowerCase().includes('equity')
          );
        } else if (categoryFilter === 'debt') {
          fundSuggestions = fundSuggestions.filter((fund: Fund) =>
            fund.category?.toLowerCase().includes('debt')
          );
        } else if (categoryFilter === 'commodity') {
          fundSuggestions = fundSuggestions.filter(
            (fund: Fund) =>
              fund.category?.toLowerCase().includes('commodity') ||
              fund.category?.toLowerCase().includes('gold')
          );
        }

        // Filter out already selected funds
        fundSuggestions = fundSuggestions.filter(
          (fund: Fund) => !selectedFunds.includes(fund.fundId)
        );

        setSuggestions(fundSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, categoryFilter, selectedFunds]);

  // Fetch details for selected funds
  useEffect(() => {
    const fetchFundDetails = async () => {
      if (selectedFunds.length === 0) {
        setFundDetails(new Map());
        return;
      }

      setFetchingDetails(true);
      const newDetails = new Map<string, Fund>();

      try {
        const fetchPromises = selectedFunds.map(async (fundId) => {
          // Skip if already have details
          if (fundDetails.has(fundId)) {
            newDetails.set(fundId, fundDetails.get(fundId)!);
            return;
          }

          try {
            const response = await api.get(`/funds/${fundId}`);
            const fundData = response.data;
            if (fundData) {
              newDetails.set(fundId, fundData);
            }
          } catch (error) {
            console.error(`Error fetching fund ${fundId}:`, error);
          }
        });

        await Promise.all(fetchPromises);
        setFundDetails(newDetails);
      } catch (error) {
        console.error('Error fetching fund details:', error);
      } finally {
        setFetchingDetails(false);
      }
    };

    fetchFundDetails();
  }, [selectedFunds]);

  const handleAddFund = (fundId: string) => {
    if (selectedFunds.length >= maxFunds) {
      alert(`You can select up to ${maxFunds} funds only`);
      return;
    }

    onAddFund(fundId);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary">
            {selectedFunds.length}/{maxFunds} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search funds to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              disabled={selectedFunds.length >= maxFunds}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-50 mt-2 max-h-[300px] w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {suggestions.map((fund) => (
                <button
                  key={fund.fundId}
                  className="w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent last:border-b-0"
                  onClick={() => handleAddFund(fund.fundId)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h6 className="truncate text-sm font-medium">
                        {fund.name}
                      </h6>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{fund.fundHouse}</span>
                        <span>•</span>
                        <span>{fund.category}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {fund.returns?.oneYear && (
                        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <TrendingUp className="h-3 w-3" />
                          {fund.returns.oneYear.toFixed(2)}%
                        </div>
                      )}
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {searchQuery && !loading && suggestions.length === 0 && (
            <div className="mt-2 rounded-lg border border-border bg-muted p-3 text-center text-sm text-muted-foreground">
              No funds found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Selected Funds */}
        {selectedFunds.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Selected Funds:
            </p>
            {fetchingDetails ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {selectedFunds.map((fundId) => {
                  const fund = fundDetails.get(fundId);
                  return (
                    <div
                      key={fundId}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                    >
                      {fund ? (
                        <>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {fund.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fund.fundHouse}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveFund(fundId)}
                            className="ml-2 h-8 w-8 shrink-0 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Loading...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No funds selected. Search and add funds to compare.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FundSelector;
