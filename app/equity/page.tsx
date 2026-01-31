'use client';
export const dynamic = 'force-dynamic';
import {
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useFunds } from '@/hooks/use-funds';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, X, ArrowLeft, ChevronDown } from 'lucide-react';
import {
  isEquityFund,
  matchesSubcategory,
  deduplicateFunds,
  calculateFundQuality,
  normalizeCategory,
} from '@/lib/utils/normalize';
import { getCategoryFromSlug } from '@/lib/category-mapping';
import { fetchFundsBatch, getTotalFundCount } from '@/app/actions/funds';

function FundsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(2000); // Start with 2000 funds for better user experience
  const language = 'en';

  useEffect(() => {
    const urlCategory = searchParams.get('category');

    // Redirect commodity to its own page
    if (urlCategory && urlCategory.toLowerCase() === 'commodity') {
      router.push('/commodity');
      return;
    }

    // Redirect debt to its own page
    if (urlCategory && urlCategory.toLowerCase() === 'debt') {
      router.push('/debt');
      return;
    }

    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory('');
    }
  }, [searchParams, router]);

  // Define categories before using them - Essential equity categories only
  const categories = [
    { label: 'All Funds', value: '', keywords: [] },
    {
      label: 'Large Cap',
      value: 'large-cap',
      keywords: ['large cap', 'largecap', 'large-cap'],
    },
    {
      label: 'Mid Cap',
      value: 'mid-cap',
      keywords: ['mid cap', 'midcap', 'mid-cap'],
    },
    {
      label: 'Small Cap',
      value: 'small-cap',
      keywords: ['small cap', 'smallcap', 'small-cap'],
    },
    {
      label: 'Multi Cap',
      value: 'multi-cap',
      keywords: ['multi cap', 'multicap', 'multi-cap'],
    },
    {
      label: 'Flexi Cap',
      value: 'flexi-cap',
      keywords: ['flexi cap', 'flexicap', 'flexi-cap', 'flexible cap'],
    },
    {
      label: 'Index Funds',
      value: 'index',
      keywords: [
        'index fund',
        'index',
        'nifty',
        'sensex',
        'bse',
        'nse',
        'indexfund',
      ],
    },
    {
      label: 'ELSS',
      value: 'elss',
      keywords: ['elss', 'tax saver', 'tax saving'],
    },
    {
      label: 'Sectoral',
      value: 'sectoral',
      keywords: ['sectoral', 'sector', 'banking', 'pharma', 'it', 'auto'],
    },
    {
      label: 'Thematic',
      value: 'thematic',
      keywords: ['thematic', 'theme', 'infrastructure', 'consumption'],
    },
  ];

  // ✅ STREAMING ARCHITECTURE: First 500 funds in < 2 seconds, rest loads in background
  const [allFunds, setAllFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [totalFundsCount, setTotalFundsCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const backgroundLoadingRef = useRef(false);

  useEffect(() => {
    async function loadFundsStreaming() {
      setLoading(true);
      setError(null);

      try {
        // STEP 1: Load first 2000 funds INSTANTLY (within 2-3 seconds)
        console.log('🚀 [Streaming] Loading first 2000 funds...');
        const startTime = performance.now();

        const firstBatch = await fetchFundsBatch(0, 2000);

        if (firstBatch.success && firstBatch.data) {
          const equityFunds = firstBatch.data.filter((fund: any) =>
            isEquityFund(fund.category)
          );

          const elapsed = performance.now() - startTime;
          console.log(
            `✅ [Streaming] First batch loaded in ${elapsed.toFixed(0)}ms (${equityFunds.length} equity funds)`
          );

          // Show first batch immediately
          setAllFunds(equityFunds);
          setTotalFundsCount(firstBatch.total || 0);
          setLoading(false); // UI is now interactive!

          // STEP 2: Load remaining funds in background (silently)
          if (firstBatch.hasMore && !backgroundLoadingRef.current) {
            backgroundLoadingRef.current = true;
            setIsBackgroundLoading(true);

            let offset = 2000;
            let allEquityFunds = [...equityFunds];

            console.log('🔄 [Streaming] Starting background loading...');

            while (true) {
              const batch = await fetchFundsBatch(offset, 1000); // Larger batches for faster loading

              if (!batch.success || !batch.data || batch.data.length === 0) {
                break;
              }

              const batchEquity = batch.data.filter((fund: any) =>
                isEquityFund(fund.category)
              );

              allEquityFunds = [...allEquityFunds, ...batchEquity];

              // Update state silently (user can keep browsing)
              setAllFunds([...allEquityFunds]);

              console.log(
                `📦 [Streaming] Background: ${allEquityFunds.length} equity funds loaded`
              );

              if (!batch.hasMore) break;
              offset += 1000; // Increment by batch size

              // Very small delay to not overwhelm the server
              await new Promise((resolve) => setTimeout(resolve, 25));
            }

            console.log(
              `✅ [Streaming] All ${allEquityFunds.length} equity funds loaded!`
            );
            setIsBackgroundLoading(false);
            backgroundLoadingRef.current = false;
          }
        } else {
          setError(new Error('Failed to fetch funds'));
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ [Streaming] Error:', err);
        setError(err as Error);
        setLoading(false);
      }
    }

    loadFundsStreaming();
  }, []); // Fetch once on mount
  // Debug logging
  useEffect(() => {
    console.log('🔍 [Equity Page] Raw funds fetched:', allFunds.length);
    if (allFunds.length > 0) {
      console.log('📦 [Equity Page] First 3 funds:', allFunds.slice(0, 3));
      console.log(
        '📊 [Equity Page] Categories distribution:',
        allFunds.reduce((acc: any, fund) => {
          const cat = fund.category || 'Unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {})
      );

      // Count equity funds using normalization
      const equityCount = allFunds.filter((f) =>
        isEquityFund(f.category)
      ).length;
      console.log('💼 [Equity Page] Equity funds detected:', equityCount);
    }
  }, [allFunds]);

  // Transform funds to match FundList expected format
  const transformedFunds = useMemo(() => {
    console.log('🔄 [Equity Page] Transforming funds...', allFunds.length);

    const mapped = allFunds.map((fund) => ({
      id: fund.schemeCode || fund.id || fund.fundId,
      schemeCode: fund.schemeCode,
      name: fund.schemeName || fund.name,
      fundHouse: fund.amc?.name || fund.amcName || fund.fundHouse,
      category: fund.category,
      subCategory: fund.subCategory,
      normalizedCategory: fund.normalizedCategory, // Include normalized category from server
      nav: fund.nav?.value || fund.nav || 0,
      returns1Y: fund.returns?.['1Y'] || fund.returns1Y || 0,
      returns3Y: fund.returns?.['3Y'] || fund.returns3Y || 0,
      returns5Y: fund.returns?.['5Y'] || fund.returns5Y || 0,
      aum: fund.aum?.value || fund.aum || 0,
      expenseRatio: fund.expenseRatio?.value || fund.expenseRatio || 0,
      rating: fund.rating || 0,
    }));

    console.log('📦 [Equity Page] Mapped funds:', mapped.length);
    if (mapped.length > 0) {
      console.log('📋 [Equity Page] Sample mapped fund:', {
        name: mapped[0].name,
        fundHouse: mapped[0].fundHouse,
        category: mapped[0].category,
        nav: mapped[0].nav,
        returns1Y: mapped[0].returns1Y,
      });
    }

    // ✅ NO DEDUPLICATION: Show all plans to users
    // Users can choose between Direct/Regular, Growth/Dividend plans
    console.log('📦 [Equity Page] Total funds (all plans):', mapped.length);

    return mapped;
  }, [allFunds]);

  // Calculate fund counts for each category (must be after transformedFunds)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    transformedFunds.forEach((fund) => {
      const normalized = fund.normalizedCategory || '';
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    // Add total count
    counts[''] = transformedFunds.length;

    return counts;
  }, [transformedFunds]);

  // Filter and limit funds based on user selection - Returns ALL filtered funds
  const allFilteredFunds = useMemo(() => {
    console.log('🎯 [Equity Page] Starting filter...', {
      totalFunds: transformedFunds.length,
      hasSearchQuery: !!searchQuery.trim(),
      selectedCategory: category,
    });

    // Quality check - RELAXED to show more funds
    let filtered = transformedFunds.filter((fund) => {
      const hasName = fund.name && fund.name.trim().length > 0;
      // Only require name, not fundHouse, to show more funds
      return hasName;
    });

    console.log(
      '✅ [Equity Page] Valid funds after quality check:',
      filtered.length
    );

    // If user is searching, show ALL matching funds regardless of subcategory
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      const searchTerms = query.split(' ');

      filtered = filtered.filter((fund) => {
        const fundName = fund.name.toLowerCase();
        return searchTerms.every((term) => fundName.includes(term));
      });

      console.log(
        `🔍 [Equity Page] Search results for "${searchQuery}": ${filtered.length} funds`
      );
    } else if (category) {
      // Convert URL category slug to normalized category format
      const normalizedTarget = getCategoryFromSlug(category);
      console.log(
        `🔎 [Equity Page] Filtering for category: ${category} -> normalized: ${normalizedTarget}`
      );
      const beforeFilter = filtered.length;

      filtered = filtered.filter((fund) => {
        // Use normalizedCategory from server which handles all mapping
        const fundNormalized = fund.normalizedCategory || '';
        const matches = fundNormalized === normalizedTarget;

        if (matches) {
          console.log(
            `✓ Match: ${fund.name} (normalizedCategory: ${fundNormalized})`
          );
        }
        return matches;
      });

      console.log(
        `🎯 [Equity Page] Found ${filtered.length} funds with normalizedCategory=${normalizedTarget} (from ${beforeFilter} total)`
      );
    } else {
      console.log('📊 [Equity Page] Showing all equity funds');
    }

    console.log('📊 [Equity Page] Final filtered funds:', filtered.length);
    return filtered;
  }, [transformedFunds, searchQuery, category]);

  // Paginated funds to display
  const displayedFunds = useMemo(() => {
    return allFilteredFunds.slice(0, displayLimit);
  }, [allFilteredFunds, displayLimit]);

  const hasMoreFunds = displayLimit < allFilteredFunds.length;
  const remainingFunds = allFilteredFunds.length - displayLimit;

  // Search suggestions - use original allFunds for raw data
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    return transformedFunds
      .filter((fund) => fund.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [transformedFunds, searchQuery]);

  const getCategoryTitle = () => {
    if (!category) return 'All Equity Funds';
    return (
      category
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Funds'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button - Always Visible - Positioned Lower */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getCategoryTitle()}
            </h1>
          </div>

          {/* Search Box with Autocomplete - Enhanced Visibility */}
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Search Equity Funds
              </h3>
            </div>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-600 dark:text-blue-400" />
                <Input
                  type="text"
                  placeholder="Search equity funds by name, scheme... (e.g., HDFC Top 100, ICICI Bluechip)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-14 pr-12 h-14 text-lg font-medium border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSuggestions(false)}
                  ></div>
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                    {searchSuggestions.map((fund) => (
                      <button
                        key={fund.id}
                        onClick={() => {
                          setSearchQuery(fund.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {fund.name}
                        </div>
                        {fund.category && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {fund.category}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Category Filter with Counts */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Filter by Category
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => {
                const count = categoryCounts[cat.value] || 0;
                return (
                  <Button
                    key={cat.value}
                    onClick={() => {
                      if (cat.value) {
                        router.push(`/equity?category=${cat.value}`);
                      } else {
                        router.push('/equity');
                      }
                      setPage(1);
                      setDisplayLimit(2000); // Reset display limit on category change
                    }}
                    variant={category === cat.value ? 'default' : 'outline'}
                    size="sm"
                    className="whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>{cat.label}</span>
                    {count > 0 && (
                      <span className="text-xs opacity-75 font-normal">
                        ({count.toLocaleString()})
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Results Count with Pagination Info */}
          {!loading && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap gap-2">
              <span className="font-medium">
                Displaying {displayedFunds.length} of {allFilteredFunds.length}{' '}
                funds
                {allFilteredFunds.length < transformedFunds.length &&
                  ` (filtered from ${transformedFunds.length} total equity funds)`}
              </span>
              {hasMoreFunds && (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  +{remainingFunds} more available
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              Failed to load funds: {error.message}
            </p>
          </Card>
        )}

        {/* Funds List */}
        {!loading && !error && (
          <>
            <FundList funds={displayedFunds} language={language} />

            {allFilteredFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No funds found matching your criteria.
                </p>
              </Card>
            )}

            {/* Load More Button */}
            {hasMoreFunds && (
              <div className="mt-8 text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    onClick={() =>
                      setDisplayLimit((prev) =>
                        Math.min(prev + 500, allFilteredFunds.length)
                      )
                    }
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Load Next 500 Funds
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setDisplayLimit(allFilteredFunds.length)}
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold px-8 py-6 text-lg"
                  >
                    Load All {remainingFunds.toLocaleString()} Funds
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {displayedFunds.length.toLocaleString()} of{' '}
                  {allFilteredFunds.length.toLocaleString()} funds •{' '}
                  {remainingFunds.toLocaleString()} more available
                </p>
              </div>
            )}

            {/* All Funds Loaded Message */}
            {!hasMoreFunds && allFilteredFunds.length > 0 && (
              <div className="mt-8 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ✓ All {allFilteredFunds.length} funds loaded
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FundsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <FundsPageContent />
    </Suspense>
  );
}
