'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lightbulb,
  Search,
  BarChart3,
  Calculator,
  RefreshCw,
  Check,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                How It Works
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Your complete guide to using MF Analyzer effectively
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Browse Funds
                  </h3>
                  <p>
                    Navigate to Equity, Debt, or Commodity sections from the
                    main menu. Use filters to narrow down by fund type, AMC, or
                    category.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Analyze Performance
                  </h3>
                  <p>
                    Click on any fund to view detailed performance metrics,
                    holdings, risk ratios, and historical returns.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Compare & Decide
                  </h3>
                  <p>
                    Add funds to comparison (up to 5) to see side-by-side
                    analysis. Check portfolio overlap to ensure diversification.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Plan Your Investment
                  </h3>
                  <p>
                    Use calculators to estimate returns, set goals, and plan
                    your SIP amount. Save funds to watchlist for tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Finding the Right Fund
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold mb-2">🔍 Smart Search</h4>
                  <p className="text-sm">
                    Type fund name, AMC, or category in the search bar. Results
                    update instantly as you type.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎯 Filter Options</h4>
                  <p className="text-sm">
                    Use fund type, AMC, and category filters to narrow down your
                    choices to exactly what you need.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Sort by Performance</h4>
                  <p className="text-sm">
                    Sort by returns (1Y, 3Y, 5Y), expense ratio, or AUM to find
                    top performers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Understanding Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold mb-2">📈 Returns</h4>
                  <p className="text-sm">
                    View absolute and annualized returns over 1Y, 3Y, and 5Y
                    periods.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⚠️ Risk Metrics</h4>
                  <p className="text-sm">
                    Check standard deviation, Sharpe ratio, and beta to
                    understand volatility.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">💰 Costs</h4>
                  <p className="text-sm">
                    Compare expense ratios and exit loads to minimize investment
                    costs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Comparison & Overlap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Fund Comparison
                </h3>
                <p className="mb-3">
                  Compare up to 5 funds side-by-side to evaluate:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Performance across different time periods</li>
                  <li>Risk-adjusted returns (Sharpe ratio, Sortino ratio)</li>
                  <li>Expense ratios and fee structures</li>
                  <li>Top holdings and sector allocations</li>
                  <li>Fund manager details and experience</li>
                </ul>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Portfolio Overlap
                </h3>
                <p className="mb-3">
                  Check how much your selected funds overlap to ensure true
                  diversification:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>
                    <strong>Common Holdings:</strong> See which stocks appear in
                    multiple funds
                  </li>
                  <li>
                    <strong>Overlap Percentage:</strong> Quantify portfolio
                    duplication
                  </li>
                  <li>
                    <strong>Sector Exposure:</strong> Identify sector
                    concentration risks
                  </li>
                  <li>
                    <strong>Diversification Score:</strong> Get a quick
                    assessment of portfolio diversity
                  </li>
                </ul>
                <p className="mt-3 text-sm italic">
                  💡 Tip: Keep overlap below 30% for good diversification
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Investment Calculators
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">🧮 SIP Calculator</h4>
                <p className="text-sm">
                  Calculate potential returns from Systematic Investment Plans.
                  Input monthly amount, duration, and expected returns to see
                  projected wealth.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💵 Lumpsum Calculator</h4>
                <p className="text-sm">
                  Estimate returns on one-time investments. Compare lumpsum vs
                  SIP to choose the best strategy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Goal Planning</h4>
                <p className="text-sm">
                  Set financial goals (house, education, retirement) and
                  calculate required monthly investment.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📈 Step-up SIP</h4>
                <p className="text-sm">
                  See how increasing your SIP annually (e.g., by 10%) can
                  significantly boost long-term wealth.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🏖️ Retirement Planning</h4>
                <p className="text-sm">
                  Calculate how much you need to save for a comfortable
                  retirement based on current age, retirement age, and lifestyle
                  needs.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30">
              <CardTitle>Fund Manager Research</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>Understand who's managing your money:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Select fund type (Equity or Debt)</li>
                <li>Search and choose the fund you're interested in</li>
                <li>
                  View comprehensive manager details:
                  <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                    <li>Education and qualifications (MBA, CFA, etc.)</li>
                    <li>Years of experience and track record</li>
                    <li>Investment philosophy and approach</li>
                    <li>Previous roles and achievements</li>
                    <li>All other funds managed by the same person</li>
                  </ul>
                </li>
              </ol>
              <p className="text-sm italic mt-4">
                ⚠️ Always verify manager details from official AMC websites as
                this information may change.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-1">✅ Do Your Research</h4>
                <p className="text-sm">
                  Don't rely solely on past returns. Check expense ratios,
                  portfolio quality, and fund manager consistency.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">✅ Diversify Smartly</h4>
                <p className="text-sm">
                  Use overlap analysis to ensure you're not inadvertently
                  concentrating in similar stocks or sectors.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">✅ Consider Risk</h4>
                <p className="text-sm">
                  Higher returns often come with higher risk. Match fund risk
                  profiles to your risk tolerance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">✅ Think Long-Term</h4>
                <p className="text-sm">
                  Mutual funds work best with investment horizons of 3-5 years
                  minimum. Don't chase short-term performance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">✅ Verify Information</h4>
                <p className="text-sm">
                  Cross-check critical details (NAV, manager names, holdings)
                  with official AMC websites and AMFI.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">✅ Consult Advisors</h4>
                <p className="text-sm">
                  Use this platform for research, but consider professional
                  advice for personalized recommendations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-blue-400 dark:border-blue-600">
            <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Need Help?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If you have questions about how to use any feature or need
                assistance navigating the platform, we're here to help!
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Contact us:</strong>{' '}
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  rakeshd01042024@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
