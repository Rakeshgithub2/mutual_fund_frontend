'use client';

export const dynamic = 'force-dynamic';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  author?: string;
  source: string;
  source_name?: string;
  category?: string;
  published_at: string;
  url: string;
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : `${BASE_URL}/api`
  ).replace(/\/+$/, '');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/news/${id}`);
        const data = await response.json();

        if (data.success) {
          setArticle(data.data);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Unable to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading article...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/news')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <Card className="p-8 text-center">
            <p className="text-lg text-red-600 mb-4">
              {error || 'Article not found'}
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/news')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              {/* Article Image */}
              {article.image_url && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Headline */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {article.author && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">By:</span> {article.author}
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Source:</span>{' '}
                  {article.source_name || article.source}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
              </div>

              {/* Full Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                  {/* Description */}
                  <p className="text-lg font-medium">{article.description}</p>

                  {/* Full Content */}
                  {article.content &&
                    article.content !== article.description &&
                    !article.content.includes(
                      'Full article content not available'
                    ) && (
                      <div className="mt-6 whitespace-pre-wrap">
                        {article.content}
                      </div>
                    )}
                </div>
              </div>

              {/* External Link */}
              {article.url && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Read the full article at the source:
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {article.source_name || article.source}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
