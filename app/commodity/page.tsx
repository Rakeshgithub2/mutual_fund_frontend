'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Search, X, ArrowLeft } from 'lucide-react';
import { useFundStore } from '@/stores/fund-store';
import { useFundDataContext } from '@/components/fund-data-provider';

function CommodityPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get type from URL
  const urlType = searchParams.get('type') || '';

  // Get data from global store
  const { funds } = useFundStore();
  const { isLoading, isLoadingMore, loadedCount, totalFunds } = useFundDataContext();

  // Commodity type filter buttons
  const commodityTypes = [
    { label: 'All Commodity', value: '' },
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
    { label: 'Multi Commodity', value: 'multi' },
  ];

  // Filter for commodity funds
  const filteredFunds = useMemo(() => {
    // First filter for commodity funds only
    let result = funds.filter(fund => {
      const cat = (fund.normalizedCategory || fund.category || '').toLowerCase();
      const subCat = (fund.subCategory || '').toLowerCase();
      const name = (fund.name || '').toLowerCase();
      
      return cat.includes('commodity') || 
             cat.includes('gold') || 
             cat.includes('silver') ||
             subCat.includes('commodity') ||
             subCat.includes('gold') ||
             subCat.includes('silver') ||
             subCat.includes('precious') ||
             name.includes('gold') ||
             name.includes('silver') ||
             name.includes('commodity');
    });

    // Type filter
    if (urlType) {
      result = result.filter(fund => {
        const cat = (fund.normalizedCategory || '').toLowerCase();
        const subCat = (fund.subCategory || '').toLowerCase();
        const name = (fund.name || '').toLowerCase();
        
        if (urlType === 'gold') {
          return cat.includes('gold') || subCat.includes('gold') || name.includes('gold');
        }
        if (urlType === 'silver') {
          return cat.includes('silver') || subCat.includes('silver') || name.includes('silver');
        }
        if (urlType === 'multi') {
          return subCat.includes('multi') || name.includes('multi');
        }
        return true;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(fund =>
        fund.name?.toLowerCase().includes(query) ||
        fund.fundHouse?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [funds, urlType, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Commodity Funds
          </h1>

          {/* Clean Search Box */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search funds by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Type</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {commodityTypes.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => {
                    if (type.value) {
                      router.push(`/commodity?type=${type.value}`);
                    } else {
                      router.push('/commodity');
                    }
                  }}
                  variant={urlType === type.value || (!urlType && !type.value) ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Displaying {filteredFunds.length.toLocaleString()} commodity funds
              {isLoadingMore && ` (loading more...)`}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && funds.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading funds...</p>
          </div>
        )}

        {/* Funds List */}
        {funds.length > 0 && (
          <>
            <FundList funds={filteredFunds} language="en" />

            {filteredFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No commodity funds found matching your criteria.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CommodityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CommodityPageContent />
    </Suspense>
  );
}
