'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Disclaimer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Important information about using this platform
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle>General Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                This website and its content are provided for{' '}
                <strong>educational and informational purposes only</strong>.
                The information, tools, calculators, and analysis provided on
                this platform should not be considered as investment advice,
                financial advice, trading advice, or any other sort of advice.
              </p>
              <p>
                <strong>MF Analyzer</strong> does not recommend that any
                particular mutual fund, security, portfolio of securities,
                transaction, or investment strategy is suitable for any specific
                person.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30">
              <CardTitle>Investment Risks</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-red-600 dark:text-red-400">
                MUTUAL FUND INVESTMENTS ARE SUBJECT TO MARKET RISKS. READ ALL
                SCHEME RELATED DOCUMENTS CAREFULLY BEFORE INVESTING.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Past performance is not indicative of future results</li>
                <li>
                  Returns are not guaranteed and may vary based on market
                  conditions
                </li>
                <li>Investment values can go down as well as up</li>
                <li>You may receive back less than your original investment</li>
                <li>
                  Tax treatment depends on individual circumstances and may
                  change
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle>Data Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                While we strive to provide accurate and up-to-date information,
                we make no representations or warranties of any kind, express or
                implied, about:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The completeness, accuracy, reliability, or suitability of the
                  information
                </li>
                <li>
                  The availability of the website or the information, products,
                  services, or related graphics contained on the website
                </li>
                <li>
                  Real-time accuracy of NAV values, returns, or performance
                  metrics
                </li>
                <li>
                  Fund manager details, which should be verified from official
                  AMC sources
                </li>
              </ul>
              <p className="font-semibold mt-4">
                Users are advised to verify all information from official
                sources such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Official Asset Management Company (AMC) websites</li>
                <li>
                  AMFI (Association of Mutual Funds in India) -
                  www.amfiindia.com
                </li>
                <li>SEBI (Securities and Exchange Board of India)</li>
                <li>Fund fact sheets and offer documents</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardTitle>Professional Advice</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>Before making any investment decisions, you should:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consult with a qualified and registered financial advisor
                </li>
                <li>
                  Assess your financial situation, investment objectives, and
                  risk tolerance
                </li>
                <li>
                  Read the scheme information document and statement of
                  additional information
                </li>
                <li>Understand all the risks involved in the investment</li>
                <li>
                  Consider your tax implications based on your individual
                  circumstances
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle>No Liability</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                In no event will MF Analyzer, its operators, or data providers
                be liable for any:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Direct, indirect, incidental, special, or consequential
                  damages
                </li>
                <li>
                  Loss of profits or investment losses arising from use of this
                  platform
                </li>
                <li>Errors or omissions in the content provided</li>
                <li>
                  Actions taken based on information obtained from this website
                </li>
                <li>
                  Technical issues, service interruptions, or data inaccuracies
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle>Third-Party Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                This website may contain links to third-party websites or
                content. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The content, accuracy, or opinions expressed in third-party
                  websites
                </li>
                <li>Privacy practices of third-party websites</li>
                <li>Any transactions conducted with third parties</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-yellow-400 dark:border-yellow-600">
            <CardContent className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <p className="font-bold text-center text-gray-900 dark:text-white text-lg">
                By using this website, you acknowledge that you have read and
                understood this disclaimer and agree to its terms.
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
