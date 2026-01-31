'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface Holding {
  name: string;
  ticker: string;
  sector: string;
  percentage: number;
  value: number;
  quantity?: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
  holdingsCount?: number;
}

export function HoldingsTable({ holdings, holdingsCount }: HoldingsTableProps) {
  // Handle empty state
  if (!holdings || holdings.length === 0) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
                Top 15 Holdings
              </CardTitle>
              <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
                Real companies in this fund
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No holdings data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
              Top {holdings.length} Holdings
            </CardTitle>
            <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
              {holdingsCount
                ? `Out of ${holdingsCount} total holdings`
                : 'Real companies in this fund'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-b-2 border-purple-200 dark:border-purple-800">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">
                  Ticker
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100">
                  Sector
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                  % of Portfolio
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                  Value (₹ Cr)
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {holding.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-3 py-1.5 text-xs font-mono font-bold bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 text-purple-900 dark:text-purple-100 rounded-md border border-purple-300 dark:border-purple-700">
                      {holding.ticker}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {holding.sector}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
                      {(holding.percentage || 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ₹
                    {(holding.value || 0).toLocaleString('en-IN', {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {holdings.map((holding, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {holding.name}
                    </h4>
                    <code className="px-2 py-1 text-xs font-mono font-bold bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 text-purple-900 dark:text-purple-100 rounded-md border border-purple-300 dark:border-purple-700">
                      {holding.ticker}
                    </code>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Sector:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {holding.sector}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    % of Portfolio:
                  </span>
                  <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
                    {(holding.percentage || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Value:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ₹
                    {(holding.value || 0).toLocaleString('en-IN', {
                      maximumFractionDigits: 0,
                    })}{' '}
                    Cr
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Info */}
        <div className="mt-6 p-4 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-purple-200 dark:border-purple-800/50">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              💡 Note:
            </span>{' '}
            These are real companies with actual ticker symbols. Top{' '}
            {holdings.length} holdings represent{' '}
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {holdings
                .reduce((sum, h) => sum + (h.percentage || 0), 0)
                .toFixed(2)}
              %
            </span>{' '}
            of the total portfolio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
