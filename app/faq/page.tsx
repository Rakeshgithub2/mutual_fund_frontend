'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

interface KnowledgeEntry {
  id: number;
  question: string;
  definition: string;
  points: string[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  formula?: string;
  relatedQuestions?: number[];
}

const categoryIcons: Record<string, any> = {
  Basics: BookOpen,
  Returns: TrendingUp,
  Taxation: DollarSign,
  Selection: Target,
  Advanced: Zap,
};

const levelColors: Record<string, string> = {
  beginner:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function FAQPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [knowledge, setKnowledge] = useState<Record<string, KnowledgeEntry[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKnowledge() {
      try {
        setLoading(true);
        const response = await api.get('/chat/knowledge');
        console.log('Knowledge API response:', response);

        if (response.success && response.data) {
          // Handle both grouped and flat array responses
          if (Array.isArray(response.data)) {
            // Group by category
            const grouped: Record<string, KnowledgeEntry[]> = {};
            response.data.forEach((entry: KnowledgeEntry) => {
              if (!grouped[entry.category]) {
                grouped[entry.category] = [];
              }
              grouped[entry.category].push(entry);
            });
            setKnowledge(grouped);
          } else {
            setKnowledge(response.data);
          }
        } else {
          setError('Failed to load knowledge base');
        }
      } catch (err) {
        console.error('Error fetching knowledge:', err);
        setError('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    }
    fetchKnowledge();
  }, []);

  // Filter entries based on search and category
  const filteredKnowledge = Object.entries(knowledge).reduce(
    (acc, [category, entries]) => {
      if (selectedCategory && category !== selectedCategory) return acc;

      const filtered = entries.filter((entry) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          entry.question.toLowerCase().includes(query) ||
          entry.definition.toLowerCase().includes(query) ||
          entry.points.some((p) => p.toLowerCase().includes(query))
        );
      });

      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, KnowledgeEntry[]>
  );

  const totalQuestions = Object.values(knowledge).flat().length;
  const filteredCount = Object.values(filteredKnowledge).flat().length;

  const handleAskAI = (question: string) => {
    // Store question and open chatbot
    sessionStorage.setItem('chatbot_question', question);
    window.dispatchEvent(new CustomEvent('toggleChatbot'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📚 Top 100 Mutual Fund Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Everything beginners need to know — answered in simple bullet points
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Easy English • No jargon • India-specific (2026 tax rules)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 sticky top-20 bg-gray-50 dark:bg-gray-950 py-4 z-40">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions... (e.g., SIP, NAV, tax)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All ({totalQuestions})
              </Button>
              {Object.keys(knowledge).map((category) => {
                const Icon = categoryIcons[category] || BookOpen;
                return (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    {category} ({knowledge[category]?.length || 0})
                  </Button>
                );
              })}
            </div>
          </div>

          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Found {filteredCount} questions matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading knowledge base...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Knowledge Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {Object.entries(filteredKnowledge).map(([category, entries]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  {(() => {
                    const Icon = categoryIcons[category] || BookOpen;
                    return (
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    );
                  })()}
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {category}
                  </h2>
                  <Badge variant="secondary" className="ml-2">
                    {entries.length} questions
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {entries.map((entry) => (
                    <Card
                      key={entry.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                        expandedId === entry.id
                          ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-white dark:bg-gray-900'
                          : 'bg-white dark:bg-gray-900'
                      }`}
                      onClick={() =>
                        setExpandedId(expandedId === entry.id ? null : entry.id)
                      }
                    >
                      <CardHeader className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {expandedId === entry.id ? (
                              <ChevronDown className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                            )}
                            <div>
                              <CardTitle className="text-base font-medium text-gray-900 dark:text-white">
                                <span className="text-blue-600 dark:text-blue-400 mr-2">
                                  Q{entry.id}.
                                </span>
                                {entry.question}
                              </CardTitle>
                              {expandedId !== entry.id && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 ml-7">
                                  {entry.definition}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge
                              className={`text-xs ${levelColors[entry.level]}`}
                            >
                              {entry.level}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedId === entry.id && (
                        <CardContent className="pt-0 pb-4">
                          <div className="ml-8 space-y-4">
                            {/* Definition */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-gray-700 dark:text-gray-300 font-medium">
                                📖 {entry.definition}
                              </p>
                            </div>

                            {/* Bullet Points */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                                Key Points:
                              </p>
                              <ul className="space-y-2">
                                {entry.points.map((point, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                                  >
                                    <span className="text-green-500 mt-0.5">
                                      •
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Formula */}
                            {entry.formula && (
                              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start gap-3">
                                <Calculator className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                                    Formula
                                  </p>
                                  <code className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">
                                    {entry.formula}
                                  </code>
                                </div>
                              </div>
                            )}

                            {/* Ask AI Button */}
                            <div className="flex items-center gap-3 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAskAI(entry.question);
                                }}
                              >
                                <MessageCircle className="w-4 h-4" />
                                Ask AI for more details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && Object.keys(filteredKnowledge).length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No questions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Try a different search term or category
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="py-6">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Can't find your question?
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our AI chatbot can answer any mutual fund question instantly!
              </p>
              <Button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('toggleChatbot'))
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Chatbot
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
