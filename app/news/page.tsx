'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ArrowLeft, Calendar, Grid, List } from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  category: string;
  published_at: string;
  url?: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mixed' | 'separated'>('mixed');

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : `${BASE_URL}/api`
  ).replace(/\/+$/, '');

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/news`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data?.articles || data.data || []);
      } else {
        setError('Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Group news by category for separated view
  const groupedNews = news.reduce(
    (acc, article) => {
      const category = article.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(article);
      return acc;
    },
    {} as { [key: string]: NewsArticle[] }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Financial News
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Latest market news and updates
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border-2 border-gray-200 dark:border-gray-700">
              <Button
                variant={viewMode === 'mixed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mixed')}
                className="gap-2"
              >
                <Grid className="w-4 h-4" />
                Mixed
              </Button>
              <Button
                variant={viewMode === 'separated' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('separated')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                Separated
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading latest news...
              </p>
            </div>
          </div>
        ) : viewMode === 'mixed' ? (
          /* Mixed View - All news in one list */
          <div className="grid gap-6">
            {news.map((article, index) => (
              <motion.div
                key={article.id || `news-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-all hover:border-blue-400 dark:hover:border-blue-600">
                  <CardContent className="p-6">
                    {/* Headline */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {article.title}
                    </h3>

                    {/* Key Points - Bullet Points */}
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4 space-y-1">
                      {article.description
                        ?.split(/[.!?]+/)
                        .filter((s) => s.trim().length > 20)
                        .slice(0, 5)
                        .map((point, i) => (
                          <li key={i} className="text-base">
                            {point.trim()}
                          </li>
                        ))}
                    </ul>

                    {/* Full Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                      {article.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <Badge variant="outline" className="capitalize">
                        {article.category}
                      </Badge>
                      <span className="font-medium">{article.source}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Separated View - Grouped by category */
          <div className="space-y-8">
            {Object.entries(groupedNews).map(([category, articles]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {category}
                  </h2>
                  <Badge variant="secondary">{articles.length}</Badge>
                </div>

                {/* Category News Grid */}
                <div className="grid gap-4">
                  {articles.map((article, idx) => (
                    <Card
                      key={article.id || `${category}-${idx}`}
                      className="hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-600"
                    >
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                          {article.title}
                        </h3>
                        {/* Key Points */}
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-3 space-y-1">
                          {article.description
                            ?.split(/[.!?]+/)
                            .filter((s) => s.trim().length > 20)
                            .slice(0, 4)
                            .map((point, i) => (
                              <li key={i}>{point.trim()}</li>
                            ))}
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-3">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <Badge variant="outline" className="capitalize">
                            {article.category}
                          </Badge>
                          <span className="font-medium">{article.source}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && !error && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No news available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for the latest financial news updates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
