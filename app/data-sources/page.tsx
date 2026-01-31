'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Database,
  Server,
  Shield,
  TrendingUp,
  Building,
  CheckCircle,
} from 'lucide-react';

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Data Sources
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Where we get our information and how we ensure accuracy
              </p>
            </div>
          </div>

          <Card className="mb-6 border-l-4 border-l-yellow-500">
            <CardContent className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Transparency Commitment
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                We believe in complete transparency about our data sources. This
                page outlines where our information comes from and how we
                maintain data quality.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Primary Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  AMFI (Association of Mutual Funds in India)
                </h3>
                <p className="mb-2">
                  <strong>What we get:</strong> NAV data, scheme codes, fund
                  categories, AUM figures
                </p>
                <p className="mb-2">
                  <strong>Update frequency:</strong> Daily (NAVs updated by 9 PM
                  IST)
                </p>
                <p className="text-sm">
                  <strong>Website:</strong>{' '}
                  <a
                    href="https://www.amfiindia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    www.amfiindia.com
                  </a>
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Asset Management Companies (AMCs)
                </h3>
                <p className="mb-2">
                  <strong>What we get:</strong> Fund fact sheets, portfolio
                  holdings, manager details, scheme information documents
                </p>
                <p className="mb-2">
                  <strong>Update frequency:</strong> Monthly (fact sheets) or as
                  published by AMCs
                </p>
                <p className="text-sm">
                  We source data directly from official AMC websites including:
                </p>
                <ul className="list-disc pl-6 text-sm mt-2 space-y-1">
                  <li>SBI Mutual Fund</li>
                  <li>HDFC Mutual Fund</li>
                  <li>ICICI Prudential Mutual Fund</li>
                  <li>Axis Mutual Fund</li>
                  <li>Aditya Birla Sun Life Mutual Fund</li>
                  <li>And 40+ other registered AMCs</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  SEBI (Securities and Exchange Board of India)
                </h3>
                <p className="mb-2">
                  <strong>What we get:</strong> Regulatory filings, scheme
                  announcements, compliance data
                </p>
                <p className="mb-2">
                  <strong>Update frequency:</strong> As published by SEBI
                </p>
                <p className="text-sm">
                  <strong>Website:</strong>{' '}
                  <a
                    href="https://www.sebi.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    www.sebi.gov.in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance & Analytics Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">Historical NAV Data</h4>
                <p className="text-sm">
                  Sourced from AMFI's historical NAV database and cross-verified
                  with AMC fact sheets. Used to calculate returns, volatility,
                  and other performance metrics.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Benchmark Indices</h4>
                <p className="text-sm">
                  Index data from NSE and BSE for comparing fund performance
                  against benchmarks like Nifty 50, Sensex, Nifty Midcap, etc.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Risk Metrics</h4>
                <p className="text-sm">
                  Calculated internally using standard financial formulas
                  (Standard Deviation, Sharpe Ratio, Sortino Ratio, Beta, Alpha)
                  based on historical NAV data.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Data Processing & Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">🔄 Automated Updates</h4>
                <p className="text-sm">
                  Our systems automatically fetch and update data from official
                  sources daily. NAVs are refreshed every evening after market
                  close.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✅ Validation Checks</h4>
                <p className="text-sm">
                  All incoming data passes through validation rules to detect
                  anomalies, missing values, or inconsistencies before being
                  stored.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔍 Quality Assurance</h4>
                <p className="text-sm">
                  Regular audits compare our data against multiple sources to
                  ensure accuracy. Discrepancies trigger manual review.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Calculated Metrics</h4>
                <p className="text-sm">
                  Returns, risk ratios, and rankings are computed using
                  industry-standard formulas and methodologies recognized by
                  financial professionals.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardTitle>Data We Calculate Internally</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-3">
                Based on source data, we compute the following metrics:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">📈 Performance Metrics</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Absolute returns (1Y, 3Y, 5Y)</li>
                    <li>Annualized returns (CAGR)</li>
                    <li>Rolling returns</li>
                    <li>Benchmark comparison</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⚠️ Risk Metrics</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Standard deviation</li>
                    <li>Sharpe ratio</li>
                    <li>Sortino ratio</li>
                    <li>Beta & Alpha</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🔄 Comparison Analysis</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Portfolio overlap percentage</li>
                    <li>Common holdings identification</li>
                    <li>Sector concentration</li>
                    <li>Diversification scores</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏆 Rankings & Ratings</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Category rankings</li>
                    <li>Performance percentiles</li>
                    <li>Consistency scores</li>
                    <li>Risk-adjusted rankings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We take data security seriously:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Encryption:</strong> All data in transit and at rest
                  is encrypted using industry-standard protocols
                </li>
                <li>
                  <strong>Access Control:</strong> Strict access permissions
                  limit who can view or modify source data
                </li>
                <li>
                  <strong>Backup Systems:</strong> Regular automated backups
                  ensure data availability
                </li>
                <li>
                  <strong>No PII in Public Data:</strong> We don't store
                  personally identifiable information in fund data
                </li>
                <li>
                  <strong>Compliance:</strong> Adherence to Indian data
                  protection regulations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle>Data Limitations & Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-red-600 dark:text-red-400">
                Important Considerations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  NAVs may have a 1-day delay in rare cases due to source
                  availability
                </li>
                <li>
                  Fund manager details may not always be current; verify with
                  AMC websites
                </li>
                <li>
                  Historical data older than 10 years may have gaps for some
                  schemes
                </li>
                <li>
                  Holdings data is typically 1-2 months old (as per AMC
                  disclosure timelines)
                </li>
                <li>
                  Third-party ratings (CRISIL, Morningstar) are not displayed;
                  we provide calculated metrics only
                </li>
              </ul>
              <p className="mt-4 font-semibold">
                ⚠️ Always cross-verify critical information (NAV, manager names,
                holdings) with official AMC websites before making investment
                decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-indigo-400 dark:border-indigo-600">
            <CardContent className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Feedback on Data Quality
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If you notice any data discrepancies, outdated information, or
                have questions about our data sources, please let us know. We
                continuously work to improve data accuracy.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Report issues:</strong>{' '}
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  rakeshd01042024@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: December 21, 2025
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
