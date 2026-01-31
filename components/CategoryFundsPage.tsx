/**
 * Reusable Category Funds Page Component
 * Displays funds by category with:
 * - 100 funds initial load
 * - Load More pagination
 * - Character-wise search
 * - Filter by subcategory
 * - Sort options
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { getSubCategoryDisplayName } from '@/lib/utils/categoryNormalizer';

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
    sixMonth?: number;
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  aum?: number;
  expenseRatio?: number;
  riskLevel?: string;
}

interface CategoryFundsPageProps {
  category: 'equity' | 'debt' | 'commodity';
  title: string;
  description: string;
  subcategories?: string[];
}

export function CategoryFundsPage({
  category,
  title,
  description,
  subcategories = [],
}: CategoryFundsPageProps) {
  const router = useRouter();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Load funds
  const loadFunds = async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      const params: any = {
        category,
        page: pageNum,
        limit: 1000, // Increased to show more funds per page
      };

      if (searchQuery) {
        params.query = searchQuery;
      }

      if (selectedSubcategory && selectedSubcategory !== 'all') {
        params.subCategory = selectedSubcategory;
      }

      if (sortBy && sortBy !== 'popularity') {
        params.sort = sortBy;
      }

      console.log('🔍 Loading funds:', params);

      const response = await api.get('/api/funds', { params });
      const data = response.data;

      if (data.success) {
        const newFunds = data.data || [];
        const pagination = data.pagination || {};

        if (isLoadMore) {
          setFunds((prev) => [...prev, ...newFunds]);
        } else {
          setFunds(newFunds);
        }

        setTotal(pagination.total || newFunds.length);
        setHasMore(
          newFunds.length === 100 &&
            funds.length + newFunds.length < pagination.total
        );

        console.log(
          '✅ Loaded funds:',
          newFunds.length,
          '/ Total:',
          pagination.total
        );
      } else {
        toast.error('Failed to load funds');
      }
    } catch (error: any) {
      console.error('❌ Error loading funds:', error);
      toast.error(error.response?.data?.message || 'Failed to load funds');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    setPage(1);
    loadFunds(1, false);
  }, [category, searchQuery, selectedSubcategory, sortBy]);

  // Load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadFunds(nextPage, true);
  };

  // Handle fund click
  const handleFundClick = (fundId: string) => {
    router.push(`/funds/${fundId}`);
  };

  // Format currency
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    if (value >= 10000) return `₹${(value / 10000).toFixed(2)}L Cr`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K Cr`;
    return `₹${value.toFixed(2)} Cr`;
  };

  // Format returns
  const formatReturns = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    const formatted = value.toFixed(2);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  // Get return color
  const getReturnColor = (value?: number) => {
    if (value === undefined || value === null) return 'text-gray-500';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold">{total.toLocaleString()}</span>
            <span>funds available</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search ${category} funds...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Subcategory Filter */}
          {subcategories.length > 0 && (
            <Select
              value={selectedSubcategory}
              onValueChange={setSelectedSubcategory}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {subcategories.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {getSubCategoryDisplayName(sub)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="-returns.oneYear">
                1Y Returns (High to Low)
              </SelectItem>
              <SelectItem value="returns.oneYear">
                1Y Returns (Low to High)
              </SelectItem>
              <SelectItem value="-aum">AUM (High to Low)</SelectItem>
              <SelectItem value="expenseRatio">
                Expense Ratio (Low to High)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Funds Grid */}
        {!loading && funds.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {funds.map((fund) => (
                <Card
                  key={fund.fundId}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleFundClick(fund.fundId)}
                >
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {fund.name}
                    </h3>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {fund.fundHouse}
                    </div>

                    {fund.subCategory && (
                      <div className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-md mb-3">
                        {getSubCategoryDisplayName(fund.subCategory)}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          NAV
                        </div>
                        <div className="font-semibold">
                          ₹{fund.currentNav?.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          1Y Return
                        </div>
                        <div
                          className={`font-semibold ${getReturnColor(fund.returns?.oneYear)}`}
                        >
                          {formatReturns(fund.returns?.oneYear)}
                        </div>
                      </div>

                      {fund.aum && (
                        <div>
                          <div className="text-gray-500 dark:text-gray-400">
                            AUM
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(fund.aum)}
                          </div>
                        </div>
                      )}

                      {fund.expenseRatio && (
                        <div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Expense
                          </div>
                          <div className="font-semibold">
                            {fund.expenseRatio.toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  size="lg"
                  className="px-8"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Showing count */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Showing {funds.length} of {total.toLocaleString()} funds
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && funds.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No funds found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryFundsPage;
