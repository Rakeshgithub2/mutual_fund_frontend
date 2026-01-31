'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Header } from '@/components/header';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';
import glossaryData from '@/data/glossary.json';
import {
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

export default function GlossaryPage() {
  const { language, mounted: langMounted } = useLanguage();
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  if (!langMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  const filtered = glossaryData.terms.filter(
    (term) =>
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTermData = glossaryData.terms.find(
    (t) => t.id === selectedTerm
  );

  const handleQuizSubmit = () => {
    if (selectedAnswer !== null) {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowQuizResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Mutual Funds Glossary
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Master the language of investing. Learn key terms and concepts to
            make informed investment decisions.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {glossaryData.terms.length}+ Terms
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Real Examples
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Interactive Quizzes
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar - Terms List */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 sticky top-24 shadow-xl">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedTerm(null);
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Terms ({filtered.length})
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filtered.map((term) => (
                  <button
                    key={term.id}
                    onClick={() => {
                      setSelectedTerm(term.id);
                      resetQuiz();
                    }}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                      selectedTerm === term.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    {term.term}
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    No terms found
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Try a different search
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedTermData ? (
              <div className="space-y-6">
                {/* Term Header */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-xl">
                  <div className="inline-block mb-3 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Financial Term
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    {selectedTermData.term}
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6"></div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                    {selectedTermData.definition}
                  </p>
                </div>

                {/* Examples */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Real-World Examples
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {selectedTermData.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">
                            {i + 1}
                          </span>
                        </div>
                        <span className="text-base leading-relaxed text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {example}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Investor Impact */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Impact on Your Investments
                    </h2>
                  </div>
                  <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                    {selectedTermData.investorImpact}
                  </p>
                </div>

                {/* Quiz */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Test Your Knowledge
                    </h2>
                  </div>
                  <p className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                    {selectedTermData.quiz.question}
                  </p>

                  <div className="space-y-3">
                    {selectedTermData.quiz.options.map((option, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedAnswer === i
                            ? showQuizResult
                              ? i === selectedTermData.quiz.correctAnswer
                                ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                                : 'border-red-500 bg-red-50 dark:bg-red-950/30'
                              : 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="quiz"
                          value={i}
                          checked={selectedAnswer === i}
                          onChange={() => {
                            setSelectedAnswer(i);
                            setShowQuizResult(false);
                          }}
                          disabled={showQuizResult}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="flex-1 text-base font-medium text-gray-900 dark:text-gray-100">
                          {option}
                        </span>
                        {showQuizResult &&
                          i === selectedTermData.quiz.correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                        {showQuizResult &&
                          selectedAnswer === i &&
                          i !== selectedTermData.quiz.correctAnswer && (
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          )}
                      </label>
                    ))}
                  </div>

                  {!showQuizResult ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={selectedAnswer === null}
                      className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="mt-6 space-y-3">
                      <div
                        className={`p-4 rounded-xl ${
                          selectedAnswer === selectedTermData.quiz.correctAnswer
                            ? 'bg-green-100 dark:bg-green-950/30 border-2 border-green-500'
                            : 'bg-red-100 dark:bg-red-950/30 border-2 border-red-500'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {selectedAnswer ===
                          selectedTermData.quiz.correctAnswer
                            ? '✓ Correct!'
                            : '✗ Incorrect'}
                        </p>
                        {selectedTermData.quiz.explanation && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedTermData.quiz.explanation}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={resetQuiz}
                        className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-16 text-center shadow-xl">
                <BookOpen className="h-20 w-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Ready to Learn?
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Select any term from the list to explore its definition,
                  examples, and test your understanding.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              &copy; 2025 MutualFunds.in. Empowering smart investors.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              All financial terms and examples are for educational purposes
              only.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
}
