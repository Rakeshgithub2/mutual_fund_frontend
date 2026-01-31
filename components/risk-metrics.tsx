"use client";

import { Card } from "@/components/ui/card";
import { Activity, TrendingUp, Target, BarChart3 } from "lucide-react";
import { KnowledgeButton } from "./knowledge-button";

interface RiskMetricsProps {
  metrics: {
    sharpeRatio: number;
    beta: number;
    alpha: number;
    standardDeviation: number;
  };
}

export function RiskMetrics({ metrics }: RiskMetricsProps) {
  const getMetricColor = (value: number, type: string) => {
    if (type === "sharpe") {
      if (value > 1.5) return "text-emerald-600 dark:text-emerald-400";
      if (value > 1) return "text-blue-600 dark:text-blue-400";
      return "text-amber-600 dark:text-amber-400";
    }
    if (type === "alpha") {
      if (value > 3) return "text-emerald-600 dark:text-emerald-400";
      if (value > 0) return "text-blue-600 dark:text-blue-400";
      return "text-red-600 dark:text-red-400";
    }
    return "text-gray-900 dark:text-gray-100";
  };

  const metrics_data = [
    {
      icon: TrendingUp,
      name: "Sharpe Ratio",
      value: metrics.sharpeRatio.toFixed(2),
      description: "Risk-adjusted returns",
      color: "from-blue-500 to-cyan-600",
      term: "sharpe-ratio",
      interpretation:
        metrics.sharpeRatio > 1.5
          ? "Excellent"
          : metrics.sharpeRatio > 1
          ? "Good"
          : "Moderate",
    },
    {
      icon: Activity,
      name: "Beta",
      value: metrics.beta.toFixed(2),
      description: "Market sensitivity",
      color: "from-purple-500 to-pink-600",
      term: "beta",
      interpretation:
        metrics.beta < 0.9
          ? "Low volatility"
          : metrics.beta > 1.1
          ? "High volatility"
          : "Market aligned",
    },
    {
      icon: Target,
      name: "Alpha",
      value: `${metrics.alpha > 0 ? "+" : ""}${metrics.alpha.toFixed(2)}%`,
      description: "Excess returns",
      color: "from-emerald-500 to-green-600",
      term: "alpha",
      interpretation:
        metrics.alpha > 3
          ? "Outstanding"
          : metrics.alpha > 0
          ? "Positive"
          : "Underperforming",
    },
    {
      icon: BarChart3,
      name: "Standard Deviation",
      value: `${metrics.standardDeviation.toFixed(1)}%`,
      description: "Volatility measure",
      color: "from-orange-500 to-red-600",
      term: "standard-deviation",
      interpretation:
        metrics.standardDeviation < 15
          ? "Low risk"
          : metrics.standardDeviation < 25
          ? "Moderate risk"
          : "High risk",
    },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950/50 dark:to-gray-900/50 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-gray-900 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">📈</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-900 dark:from-slate-300 dark:to-gray-100 text-transparent bg-clip-text">
            Risk Metrics
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Statistical performance indicators
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics_data.map((metric, idx) => (
          <Card
            key={idx}
            className="p-5 bg-white dark:bg-gray-900/60 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}
              >
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <KnowledgeButton term={metric.term} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.name}
                </h4>
              </div>

              <p
                className={`text-3xl font-bold ${getMetricColor(
                  parseFloat(metric.value),
                  metric.term === "sharpe-ratio"
                    ? "sharpe"
                    : metric.term === "alpha"
                    ? "alpha"
                    : "default"
                )}`}
              >
                {metric.value}
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                {metric.description}
              </p>

              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${metric.color} text-white shadow-md`}
              >
                {metric.interpretation}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <span>📚</span> Understanding Risk Metrics
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800 dark:text-gray-200">
          <div>
            <span className="font-semibold">• Sharpe Ratio:</span> Higher is
            better ({">"}1.5 excellent)
          </div>
          <div>
            <span className="font-semibold">• Beta:</span> 1.0 = market
            volatility, {"<"}1 less volatile
          </div>
          <div>
            <span className="font-semibold">• Alpha:</span> Positive means
            outperformance
          </div>
          <div>
            <span className="font-semibold">• Std Deviation:</span> Lower means
            less price fluctuation
          </div>
        </div>
      </div>
    </Card>
  );
}
