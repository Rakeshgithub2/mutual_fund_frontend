/**
 * Example Funds Page
 * Demonstrates integration with 4,459 funds backend
 */

'use client';

import { EnhancedFundList } from '@/components/enhanced-fund-list';
import { ErrorBoundary } from '@/components/error-boundary';
import { TrendingUp, BarChart3, Shield } from 'lucide-react';

export default function FundsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore 4,459 Mutual Funds
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover the best mutual funds across 8 categories with real-time
              NAV updates
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4,459</div>
                    <div className="text-sm text-blue-100">Total Funds</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">60</div>
                    <div className="text-sm text-blue-100">AMCs</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-blue-100">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <EnhancedFundList
            language="en"
            showFilters={true}
            showSearch={true}
            showPagination={true}
            pageSize={50}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
