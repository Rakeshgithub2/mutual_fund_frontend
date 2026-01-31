'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Returns } from '@/lib/api-client';

interface ReturnsSectionProps {
  returns?: Returns;
}

export function ReturnsSection({ returns }: ReturnsSectionProps) {
  if (!returns) {
    return (
      <div className="returns-section-empty">
        <p className="text-gray-600 dark:text-gray-400">
          📊 No performance data available yet
        </p>
        <small className="text-gray-500 dark:text-gray-500">
          Metrics require at least 30 days of historical data
        </small>
      </div>
    );
  }

  const returnsData = [
    { label: '1 Month', value: returns.oneMonth, period: '1M' },
    { label: '3 Months', value: returns.threeMonth, period: '3M' },
    { label: '6 Months', value: returns.sixMonth, period: '6M' },
    { label: 'YTD', value: returns.ytd, period: 'YTD', highlight: true },
    { label: '1 Year', value: returns.oneYear, period: '1Y', highlight: true },
    { label: '3 Years', value: returns.threeYear, period: '3Y' },
    { label: '5 Years', value: returns.fiveYear, period: '5Y' },
    ...(returns.tenYear > 0
      ? [{ label: '10 Years', value: returns.tenYear, period: '10Y' }]
      : []),
  ];

  return (
    <div className="returns-section">
      <h3 className="section-title">📊 Returns</h3>

      <div className="returns-grid">
        {returnsData.map((ret, i) => (
          <motion.div
            key={ret.period}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`return-item ${ret.highlight ? 'highlight' : ''}`}
          >
            <div className="return-header">
              <span className="label">{ret.label}</span>
              {ret.value >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <span
              className={`value ${ret.value >= 0 ? 'positive' : 'negative'}`}
            >
              {ret.value >= 0 ? '+' : ''}
              {ret.value.toFixed(2)}%
            </span>
            <span className="period">{ret.period} performance</span>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .returns-section {
          margin: 20px 0;
          padding: 24px;
          background: linear-gradient(
            135deg,
            rgba(248, 249, 250, 0.95) 0%,
            rgba(243, 244, 246, 0.95) 100%
          );
          border-radius: 16px;
          border: 1px solid rgba(229, 231, 235, 0.8);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .returns-section-empty {
          margin: 20px 0;
          padding: 40px;
          text-align: center;
          background: rgba(248, 249, 250, 0.5);
          border-radius: 12px;
          border: 2px dashed rgba(209, 213, 219, 0.5);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .returns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
        }

        .return-item {
          display: flex;
          flex-direction: column;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .return-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .return-item.highlight {
          border-color: rgba(59, 130, 246, 0.4);
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.05) 0%,
            rgba(139, 92, 246, 0.05) 100%
          );
        }

        .return-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 600;
        }

        .value {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .value.positive {
          color: #10b981;
        }

        .value.negative {
          color: #ef4444;
        }

        .period {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
        }

        @media (prefers-color-scheme: dark) {
          .returns-section {
            background: linear-gradient(
              135deg,
              rgba(31, 41, 55, 0.95) 0%,
              rgba(17, 24, 39, 0.95) 100%
            );
            border-color: rgba(75, 85, 99, 0.5);
          }

          .section-title {
            color: #f3f4f6;
          }

          .return-item {
            background: rgba(31, 41, 55, 0.8);
            border-color: rgba(75, 85, 99, 0.3);
          }

          .return-item:hover {
            border-color: rgba(59, 130, 246, 0.5);
          }

          .return-item.highlight {
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.1) 0%,
              rgba(139, 92, 246, 0.1) 100%
            );
          }

          .label {
            color: #9ca3af;
          }

          .value.positive {
            color: #34d399;
          }

          .value.negative {
            color: #f87171;
          }

          .period {
            color: #6b7280;
          }
        }
      `}</style>
    </div>
  );
}
