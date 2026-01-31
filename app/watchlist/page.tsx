'use client';

export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { useFunds } from '@/hooks/use-funds';
import { Card } from '@/components/ui/card';
import { Loader2, Star, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function WatchlistPage() {
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const { funds, loading, error } = useFunds({ limit: 1000 }); // High limit for watchlist
  const language = 'en'; // Default language

  const watchlistFunds = useMemo(() => {
    return funds.filter((f) => watchlist.includes(f.id));
  }, [funds, watchlist]);

  if (!watchlistMounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Watchlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {watchlistFunds.length > 0
              ? `Tracking ${watchlistFunds.length} fund${
                  watchlistFunds.length > 1 ? 's' : ''
                }`
              : 'No funds in your watchlist yet'}
          </p>
        </div>

        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <p className="text-red-600 dark:text-red-400">
              Failed to load funds: {error.message}
            </p>
          </Card>
        )}

        {watchlistFunds.length > 0 ? (
          <FundList funds={watchlistFunds} language={language} />
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-4 inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Bookmark className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your watchlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start adding funds to your watchlist to track their performance
                and get personalized insights.
              </p>
              <Link href="/funds">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Browse Funds
                </button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
