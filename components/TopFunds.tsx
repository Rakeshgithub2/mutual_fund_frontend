'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import analytics from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

/**
 * Top Funds Component
 * ===================
 * Displays top performing mutual funds with filter buttons
 * - Top 20/50/100 toggle
 * - Responsive grid layout
 * - Production-safe API calls
 */

interface Fund {
  id: string;
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  currentNav: number;
  returns?: {
    oneMonth?: number;
    threeMonth?: number;
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  aum?: number;
  expenseRatio?: number;
  riskLevel?: string;
}

type TopFilter = 20 | 50 | 100;

export function TopFunds() {
  const router = useRouter();
  const [topFilter, setTopFilter] = useState<TopFilter>(20);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopFunds();
  }, [topFilter]);

  const fetchTopFunds = async () => {
    setLoading(true);
    setError('');

    try {
      console.log(`📊 Fetching top ${topFilter} funds...`);

      // Track filter usage
      analytics.trackFilter('Top Funds', topFilter);

      const response = await api.get(
        `/funds?top=${topFilter}&sortBy=returns.oneYear&order=desc`
      );

      const data = response.data || [];
      setFunds(data);

      console.log(`✅ Loaded ${data.length} funds`);
    } catch (err: any) {
      console.error('❌ Error fetching top funds:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to load top funds. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (fund: Fund) => {
    // Track analytics
    analytics.trackFundView(fund.fundId, fund.name);
    analytics.trackButtonClick('View Details', `Top ${topFilter} Funds`);

    // Use schemeCode if available, fallback to fundId
    const identifier = (fund as any).schemeCode || fund.fundId || fund.id;
    router.push(`/equity/${identifier}`);
  };

  const getRiskBadgeColor = (riskLevel?: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'LOW':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Top Performing Funds
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sorted by 1-year returns
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={topFilter === 20 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTopFilter(20)}
            disabled={loading}
          >
            Top 20
          </Button>
          <Button
            variant={topFilter === 50 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTopFilter(50)}
            disabled={loading}
          >
            Top 50
          </Button>
          <Button
            variant={topFilter === 100 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTopFilter(100)}
            disabled={loading}
          >
            Top 100
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTopFunds}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading top {topFilter} funds...
          </p>
        </div>
      )}

      {/* Funds Grid */}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {funds.map((fund, index) => (
            <Card
              key={fund.fundId}
              className="group transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    #{index + 1}
                  </div>
                  {fund.riskLevel && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${getRiskBadgeColor(
                        fund.riskLevel
                      )}`}
                    >
                      {fund.riskLevel}
                    </span>
                  )}
                </div>

                <CardTitle className="mt-2 line-clamp-2 text-base">
                  {fund.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {fund.fundHouse}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* NAV and Returns */}
                <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">NAV</span>
                    <span className="font-semibold">
                      ₹{fund.currentNav?.toFixed(2)}
                    </span>
                  </div>

                  {fund.returns?.oneYear !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">1Y Return</span>
                      <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        {fund.returns.oneYear.toFixed(2)}%
                      </span>
                    </div>
                  )}

                  {fund.returns?.threeYear !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">3Y Return</span>
                      <span className="font-semibold text-green-600 dark:text-green-500">
                        {fund.returns.threeYear.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                {(fund.aum || fund.expenseRatio) && (
                  <div className="space-y-1 text-xs">
                    {fund.aum && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AUM</span>
                        <span>₹{(fund.aum / 1000).toFixed(1)}K Cr</span>
                      </div>
                    )}
                    {fund.expenseRatio && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Expense Ratio
                        </span>
                        <span>{fund.expenseRatio.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                )}

                {/* View Details Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  onClick={() => handleViewDetails(fund)}
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && funds.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-muted/50 py-16 text-center">
          <p className="text-muted-foreground">
            No funds available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}

export default TopFunds;
