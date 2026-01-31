'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Newspaper, Clock } from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: 'stock' | 'mutualfund' | 'gold' | 'finance';
  published_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const categoryColors = {
  stock: 'bg-blue-500',
  mutualfund: 'bg-green-500',
  gold: 'bg-yellow-500',
  finance: 'bg-purple-500',
};

const categoryEmojis = {
  stock: '📈',
  mutualfund: '💼',
  gold: '🪙',
  finance: '💰',
};

export function FinanceNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/news?limit=20`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data);
      } else {
        setError('Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Finance News
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="p-4 border border-gray-200 dark:border-gray-800 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Finance News
            </h2>
          </div>
        </div>
        <Card className="p-6 border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <Button onClick={fetchNews} variant="outline" className="mt-4">
            Retry
          </Button>
        </Card>
      </section>
    );
  }

  const displayedNews = showAll ? news : news.slice(0, 6);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Finance News
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            • Updated daily at 6 AM
          </span>
        </div>
        {news.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 dark:text-blue-400"
          >
            {showAll ? 'Show Less' : `View All (${news.length})`}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedNews.map((article) => (
          <Card
            key={article._id}
            className="p-4 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-800 group"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryColors[article.category]}`}
                >
                  {categoryEmojis[article.category]} {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(article.published_at)}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-base text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 leading-relaxed">
                {article.description}
              </p>

              {/* Source and Link */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {article.source}
                </span>
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </Card>
        ))}
      </div>

      {!showAll && news.length > 6 && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Show More News
          </Button>
        </div>
      )}
    </section>
  );
}
