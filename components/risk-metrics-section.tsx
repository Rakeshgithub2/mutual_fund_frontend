'use client';

import { motion } from 'framer-motion';
import { Shield, Activity, TrendingUpDown, AlertCircle } from 'lucide-react';
import type { RiskMetrics } from '@/lib/api-client';

interface RiskMetricsSectionProps {
  riskMetrics?: RiskMetrics;
  riskLevel?: string;
  rating?: number;
}

export function RiskMetricsSection({
  riskMetrics,
  riskLevel,
  rating,
}: RiskMetricsSectionProps) {
  if (!riskMetrics) {
    return (
      <div className="risk-metrics-section-empty">
        <p className="text-gray-600 dark:text-gray-400">
          📉 No risk data available yet
        </p>
        <small className="text-gray-500 dark:text-gray-500">
          Risk analysis requires sufficient historical performance data
        </small>
      </div>
    );
  }

  const getRiskColor = (level?: string) => {
    if (!level) return 'gray';
    const normalized = level.toLowerCase().replace(/\s+/g, '-');
    switch (normalized) {
      case 'low':
        return 'green';
      case 'moderately-low':
        return 'blue';
      case 'moderate':
        return 'yellow';
      case 'moderately-high':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };

  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="risk-metrics-section">
      <h3 className="section-title">📉 Risk Analysis</h3>

      {/* Rating Stars */}
      {rating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rating-container"
        >
          <span className="rating-label">Fund Rating:</span>
          <div className="rating-stars">
            <span className="stars">
              {'★'.repeat(Math.floor(rating))}
              {rating % 1 >= 0.5 ? '½' : ''}
              {'☆'.repeat(5 - Math.ceil(rating))}
            </span>
            <span className="rating-value">{rating.toFixed(1)}/5.0</span>
          </div>
        </motion.div>
      )}

      {/* Risk Level Badge */}
      {riskLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`risk-level risk-${riskColor}`}
        >
          <Shield className="w-5 h-5" />
          <span className="risk-label">Risk Level:</span>
          <span className="risk-badge">{riskLevel}</span>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="metric-item"
        >
          <div className="metric-icon">
            <TrendingUpDown className="w-5 h-5" />
          </div>
          <span className="metric-label">Sharpe Ratio</span>
          <span className="metric-value">
            {riskMetrics.sharpeRatio.toFixed(2)}
          </span>
          <span className="metric-info">Risk-adjusted return</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="metric-item"
        >
          <div className="metric-icon">
            <Activity className="w-5 h-5" />
          </div>
          <span className="metric-label">Beta</span>
          <span className="metric-value">{riskMetrics.beta.toFixed(2)}</span>
          <span className="metric-info">Market sensitivity</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="metric-item"
        >
          <div className="metric-icon">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="metric-label">Alpha</span>
          <span className="metric-value">{riskMetrics.alpha.toFixed(2)}%</span>
          <span className="metric-info">Excess return</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="metric-item"
        >
          <div className="metric-icon">
            <Shield className="w-5 h-5" />
          </div>
          <span className="metric-label">Volatility</span>
          <span className="metric-value">
            {riskMetrics.volatility.toFixed(2)}%
          </span>
          <span className="metric-info">Price fluctuation</span>
        </motion.div>
      </div>

      <style jsx>{`
        .risk-metrics-section {
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

        .risk-metrics-section-empty {
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

        .rating-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .rating-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
        }

        .rating-stars {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          font-size: 1.5rem;
          color: #f59e0b;
          letter-spacing: 2px;
        }

        .rating-value {
          font-weight: 700;
          color: #1f2937;
          font-size: 1rem;
        }

        .risk-level {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .risk-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
        }

        .risk-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.875rem;
          margin-left: auto;
        }

        .risk-green .risk-badge {
          background: #10b981;
          color: white;
        }
        .risk-blue .risk-badge {
          background: #3b82f6;
          color: white;
        }
        .risk-yellow .risk-badge {
          background: #f59e0b;
          color: white;
        }
        .risk-orange .risk-badge {
          background: #f97316;
          color: white;
        }
        .risk-red .risk-badge {
          background: #ef4444;
          color: white;
        }
        .risk-gray .risk-badge {
          background: #6b7280;
          color: white;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .metric-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .metric-icon {
          margin-bottom: 12px;
          color: #8b5cf6;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 6px;
          line-height: 1;
        }

        .metric-info {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
        }

        @media (prefers-color-scheme: dark) {
          .risk-metrics-section {
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

          .rating-container,
          .risk-level,
          .metric-item {
            background: rgba(31, 41, 55, 0.8);
            border-color: rgba(75, 85, 99, 0.3);
          }

          .rating-label,
          .risk-label,
          .metric-label {
            color: #9ca3af;
          }

          .rating-value,
          .metric-value {
            color: #f3f4f6;
          }

          .metric-info {
            color: #6b7280;
          }
        }
      `}</style>
    </div>
  );
}
