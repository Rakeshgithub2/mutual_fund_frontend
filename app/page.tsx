'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { MarketIndices } from '@/components/market-indices';

const FUND_CATEGORIES = [
  {
    name: 'Equity Funds',
    description: 'High growth potential with market-linked returns',
    count: '2000+ funds',
    color: 'from-blue-500 to-blue-600',
    category: 'equity',
    icon: '📈',
  },
  {
    name: 'Commodity Funds',
    description: 'Invest in gold, silver & commodities',
    count: '200+ funds',
    color: 'from-yellow-500 to-orange-600',
    category: 'commodity',
    icon: '🪙',
  },
  {
    name: 'Debt Funds',
    description: 'Stable returns with lower risk',
    count: '1500+ funds',
    color: 'from-green-500 to-green-600',
    category: 'debt',
    icon: '💰',
  },
];

// Quick Actions organized in 3-3 rule (2 rows × 3 columns)
// Row 1: Fund Analysis Tools | Row 2: Investment Planning Tools
const QUICK_ACTIONS = [
  // Row 1 - Fund Analysis Tools
  {
    name: 'Fund Compare',
    icon: '⚖️',
    href: '/compare',
    description: 'Compare up to 4 mutual funds side by side',
  },
  {
    name: 'Fund Overlap',
    icon: '🔄',
    href: '/overlap',
    description: 'Identify common holdings between multiple funds',
  },
  {
    name: 'AI Assistant',
    icon: '🤖',
    href: '/chat',
    description:
      'Ask questions related to mutual funds, stocks, NAV, returns, risk',
  },
  // Row 2 - Investment Planning Tools
  {
    name: 'Investment Calculator',
    icon: '🧮',
    href: '/calculators',
    description: 'SIP, Lumpsum, CAGR, SWP, and return calculators',
  },
  {
    name: 'Goal Planner',
    icon: '🎯',
    href: '/goal-planning',
    description:
      'Plan goals like retirement, child education, house, or travel',
  },
  {
    name: 'Reminder',
    icon: '🔔',
    href: '/reminders',
    description: 'NAV update reminders, SIP dates, portfolio review alerts',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
      <Header />

      {/* Market Indices - Real-time data from backend */}
      <MarketIndices />

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Fund Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Explore Fund Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {FUND_CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={
                  category.category === 'commodity'
                    ? '/commodity'
                    : category.category === 'equity'
                      ? '/equity'
                      : category.category === 'debt'
                        ? '/debt'
                        : `/equity?category=${category.category}`
                }
              >
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-800 hover:scale-[1.02] active:scale-95">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${category.color} mb-3 sm:mb-4 flex items-center justify-center text-2xl sm:text-3xl shadow-lg`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-base sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {category.count}
                    </p>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid - 3-3 Rule (2 rows × 3 columns) */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              Analysis • Planning
            </span>
          </div>
          {/* Desktop & Tablet: 3 columns | Mobile: 1 column stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.name} href={action.href}>
                <Card className="p-4 sm:p-5 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-800 h-full hover:scale-[1.02] active:scale-95 group">
                  <div className="flex flex-col h-full">
                    <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-2">
                      {action.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                      {action.description}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
