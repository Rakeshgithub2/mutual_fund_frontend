"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TopHoldingsProps {
  holdings: Array<{
    name: string;
    percentage: number;
  }>;
}

export function TopHoldings({ holdings }: TopHoldingsProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
            Top Holdings
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Largest portfolio positions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {holdings.map((holding, idx) => (
          <div key={idx} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {idx + 1}
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {holding.name}
                </span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
                {holding.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out group-hover:shadow-lg"
                style={{ width: `${holding.percentage * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-purple-200 dark:border-purple-800/50">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            💡 Note:
          </span>{" "}
          Top holdings represent{" "}
          {holdings.reduce((sum, h) => sum + h.percentage, 0).toFixed(1)}% of
          the total portfolio. Diversification helps reduce concentration risk.
        </p>
      </div>
    </Card>
  );
}
