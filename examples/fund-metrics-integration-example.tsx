// 🎯 QUICK INTEGRATION EXAMPLE
// How to use the new ReturnsSection and RiskMetricsSection components

import { ReturnsSection } from '@/components/returns-section';
import { RiskMetricsSection } from '@/components/risk-metrics-section';
import type { Fund } from '@/lib/api-client';

export default function FundDetailExample() {
  const [fund, setFund] = useState<Fund | null>(null);

  // Fetch fund data from your API
  useEffect(() => {
    async function fetchFund() {
      const response = await fetch(`${API_URL}/funds/${fundId}`);
      const data = await response.json();
      setFund(data.data);
    }
    fetchFund();
  }, [fundId]);

  if (!fund) return <div>Loading...</div>;

  return (
    <div className="fund-detail-page">
      {/* Fund Header */}
      <h1>{fund.name}</h1>
      <p>
        {fund.category} • {fund.type}
      </p>

      {/* ✨ NEW: Returns Section */}
      <ReturnsSection returns={fund.returns} />
      {/* 
        Shows:
        - 1 Month, 3 Months, 6 Months returns
        - YTD, 1 Year, 3 Years, 5 Years, 10 Years
        - Color-coded positive/negative values
        - Trend indicators
        - Empty state if no data
      */}

      {/* ✨ NEW: Risk Metrics Section */}
      <RiskMetricsSection
        riskMetrics={fund.riskMetrics}
        riskLevel={fund.riskLevel}
        rating={fund.rating}
      />
      {/* 
        Shows:
        - Star rating (e.g., ★★★★½ 4.5/5.0)
        - Risk level badge (color-coded: Low=Green, High=Red)
        - Sharpe Ratio, Beta, Alpha, Volatility
        - Helpful descriptions for each metric
        - Empty state if no data
      */}

      {/* Other existing sections */}
      <HoldingsSection holdings={fund.holdings} />
      <ManagersSection managers={fund.managedBy} />
    </div>
  );
}

// 📊 Example Backend Response Format
/*
{
  "statusCode": 200,
  "message": "Fund retrieved successfully",
  "data": {
    "id": "65f8b4e8e8c9b5c8e8c9b5c8",
    "name": "ICICI Prudential Bluechip Fund",
    "category": "Equity",
    "type": "Large Cap",
    
    // ✅ NEW: Returns data (calculated by backend)
    "returns": {
      "oneMonth": 2.45,
      "threeMonth": 5.67,
      "sixMonth": 10.23,
      "ytd": 12.34,
      "oneYear": 15.67,
      "threeYear": 45.23,
      "fiveYear": 78.45,
      "tenYear": 125.67
    },
    
    // ✅ NEW: Risk metrics (calculated by backend)
    "riskMetrics": {
      "sharpeRatio": 1.45,
      "beta": 0.95,
      "alpha": 2.34,
      "volatility": 15.67,
      "standardDeviation": 14.23
    },
    
    // ✅ NEW: Risk classification (calculated by backend)
    "riskLevel": "Moderate",
    
    // ✅ NEW: Overall rating (calculated by backend)
    "rating": 4.5,
    
    // Existing fields
    "currentNav": 234.56,
    "aum": 15000,
    "expenseRatio": 1.05,
    "holdings": [...],
    "managedBy": [...]
  }
}
*/

// 🎨 Component Features

// ReturnsSection:
// - Auto-adjusts for available data (hides 10Y if not enough data)
// - Shows trending icons automatically based on positive/negative
// - Responsive grid layout (auto-fit columns)
// - Smooth animations on mount
// - Dark mode support

// RiskMetricsSection:
// - Auto-hides rating/risk level if not provided
// - Color-codes risk level based on value:
//   * "Low" → Green badge
//   * "Moderately Low" → Blue badge
//   * "Moderate" → Yellow badge
//   * "Moderately High" → Orange badge
//   * "High" → Red badge
// - Shows half-stars for decimal ratings (e.g., 4.5 → ★★★★½)
// - Metric icons change based on value
// - Responsive 2-4 column grid

// 🚀 Ready to Use!
// Just import and add to your fund detail pages.
// The components handle all edge cases, loading states, and styling automatically.
