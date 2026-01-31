'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Database,
  CheckCircle,
  RefreshCw,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default function DataSourcePage() {
  const dataSources = [
    {
      name: 'AMFI (Association of Mutual Funds in India)',
      description:
        'Primary source for mutual fund scheme details, NAV data, and fund classifications',
      url: 'https://www.amfiindia.com',
      dataProvided: [
        'NAV (Net Asset Value)',
        'Scheme Codes',
        'Fund Categories',
        'AUM Data',
      ],
      updateFrequency: 'Daily',
    },
    {
      name: 'BSE (Bombay Stock Exchange)',
      description: 'Market indices, trading data, and fund performance metrics',
      url: 'https://www.bseindia.com',
      dataProvided: [
        'Market Indices',
        'Fund Performance',
        'Trading Volumes',
        'Historical Data',
      ],
      updateFrequency: 'Real-time',
    },
    {
      name: 'NSE (National Stock Exchange)',
      description: 'Additional market data and benchmark indices',
      url: 'https://www.nseindia.com',
      dataProvided: [
        'NIFTY Indices',
        'Market Data',
        'Derivatives',
        'Fund Statistics',
      ],
      updateFrequency: 'Real-time',
    },
    {
      name: 'SEBI (Securities and Exchange Board of India)',
      description: 'Regulatory information and compliance data',
      url: 'https://www.sebi.gov.in',
      dataProvided: [
        'Regulatory Updates',
        'Compliance Data',
        'Industry Guidelines',
        'Disclosures',
      ],
      updateFrequency: 'As Released',
    },
    {
      name: 'AMC Websites',
      description: 'Direct data from Asset Management Companies',
      url: null,
      dataProvided: [
        'Fund Documents',
        'Scheme Information',
        'Portfolio Holdings',
        'Fund Manager Details',
      ],
      updateFrequency: 'Daily/Monthly',
    },
    {
      name: 'NewsAPI & Financial News Providers',
      description: 'Latest financial news and market updates',
      url: null,
      dataProvided: [
        'Market News',
        'Economic Updates',
        'Fund-specific News',
        'Industry Trends',
      ],
      updateFrequency: 'Real-time',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Data Sources
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Transparency in our data collection and processing
              </p>
            </div>
          </div>

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle>Our Data Commitment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                At MF Analyser, we believe in complete transparency. All data
                displayed on our platform is sourced from official, reliable,
                and publicly available sources. We do not modify or manipulate
                any data - what you see is exactly what we receive from these
                authoritative sources.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Accurate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Direct from official sources
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Up-to-date</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Regular automated updates
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Reliable</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Verified and trusted sources
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources List */}
          <div className="space-y-6 mb-8">
            {dataSources.map((source, index) => (
              <Card key={index}>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex-1">{source.name}</CardTitle>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit
                      </a>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {source.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Data Provided:
                      </h4>
                      <ul className="space-y-1">
                        {source.dataProvided.map((data, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            {data}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Update Frequency:
                      </h4>
                      <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        {source.updateFrequency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Processing */}
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle>How We Process Data</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Data Collection</h4>
                  <p className="text-sm">
                    Our automated systems fetch data from official sources at
                    scheduled intervals. For real-time data like market indices,
                    we maintain live connections.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Validation</h4>
                  <p className="text-sm">
                    All incoming data is validated for format consistency and
                    completeness. Any anomalies are flagged for manual review.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Storage</h4>
                  <p className="text-sm">
                    Data is stored securely in our databases with proper
                    indexing for fast retrieval. Historical data is preserved
                    for trend analysis.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. Delivery</h4>
                  <p className="text-sm">
                    When you request information, our APIs fetch the latest data
                    from our databases and present it through our user-friendly
                    interface.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Disclaimer */}
          <Card className="border-2 border-yellow-400 dark:border-yellow-600">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2"></span>
                  <span>
                    While we strive for accuracy, data delays or errors may
                    occasionally occur at the source level.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2"></span>
                  <span>
                    We recommend cross-verifying critical information with
                    official AMC websites before making investment decisions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2"></span>
                  <span>
                    MF Analyser is an information platform and does not provide
                    investment advice. Always consult a certified financial
                    advisor.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2"></span>
                  <span>
                    If you notice any data discrepancies, please contact us
                    immediately at{' '}
                    <a
                      href="mailto:rakeshd01042024@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      rakeshd01042024@gmail.com
                    </a>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact for Data Issues */}
          <Card className="mt-6">
            <CardContent className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Report Data Issues
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                If you notice any incorrect or outdated data, please help us
                improve by reporting it:
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  📧 Email:{' '}
                  <a
                    href="mailto:rakeshd01042024@gmail.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    rakeshd01042024@gmail.com
                  </a>
                </p>
                <p className="text-sm">
                  📱 Phone:{' '}
                  <a
                    href="tel:+919740104978"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    +91 9740104978
                  </a>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Please include: Fund name, ISIN code, data field with issue,
                  and correct value with source.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
