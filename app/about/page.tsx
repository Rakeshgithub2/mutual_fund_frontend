'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users, TrendingUp, Shield, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                About MF Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Empowering Indian investors with data-driven insights
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>MF Analyzer</strong> was born from a simple observation:
                while India has over 1,500 mutual fund schemes, most investors
                struggle to make informed decisions due to scattered information
                and complex financial jargon.
              </p>
              <p>
                We created this platform to democratize mutual fund analysis,
                making professional-grade research tools accessible to every
                Indian investor—from beginners taking their first steps in
                mutual funds to experienced investors managing diverse
                portfolios.
              </p>
              <p>
                Our mission is to transform how Indians invest by providing
                comprehensive, unbiased, and easy-to-understand mutual fund data
                all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                To empower every Indian investor with the tools and knowledge to
                make confident, informed investment decisions.
              </p>
              <p>
                We believe that financial literacy and access to quality data
                should not be privileges—they should be rights. Our platform
                removes barriers between investors and information, enabling
                smarter wealth creation.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold mb-1">🎯 Transparency</h4>
                  <p className="text-sm">
                    No hidden agendas—we present unbiased data and clear
                    disclaimers
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">📊 Data-Driven</h4>
                  <p className="text-sm">
                    Every insight backed by real numbers and verified sources
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">🧠 Education-First</h4>
                  <p className="text-sm">
                    We teach, not just show—helping you understand the "why"
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">🤝 User-Centric</h4>
                  <p className="text-sm">
                    Built for investors, by investors who understand your needs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  What Sets Us Apart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold mb-1">
                    ✅ Comprehensive Coverage
                  </h4>
                  <p className="text-sm">
                    All equity, debt, and commodity funds in one place
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">✅ Advanced Tools</h4>
                  <p className="text-sm">
                    Portfolio overlap, fund comparison, SIP calculators
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">✅ Real-Time Data</h4>
                  <p className="text-sm">
                    Updated NAVs, returns, and performance metrics
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    ✅ No Registration Hassles
                  </h4>
                  <p className="text-sm">
                    Access most features without signing up
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    📈 Fund Analysis
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Detailed performance metrics</li>
                    <li>Risk-adjusted returns</li>
                    <li>Expense ratio analysis</li>
                    <li>Portfolio composition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    🔍 Comparison Tools
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Compare up to 5 funds side-by-side</li>
                    <li>Portfolio overlap analysis</li>
                    <li>Sector allocation comparison</li>
                    <li>Performance benchmarking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    🧮 Calculators
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>SIP & Lumpsum calculators</li>
                    <li>Goal planning tools</li>
                    <li>Step-up SIP projections</li>
                    <li>Retirement planning</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    👤 Fund Manager Insights
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Manager track records</li>
                    <li>Investment philosophies</li>
                    <li>Managed funds portfolio</li>
                    <li>Qualifications & experience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Who We Serve
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">🌱 First-Time Investors</h4>
                <p className="text-sm">
                  Get started with easy-to-understand guides, glossary terms,
                  and beginner-friendly filters
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Active Investors</h4>
                <p className="text-sm">
                  Track portfolios, compare funds, and optimize your investment
                  strategy with advanced tools
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💼 Financial Advisors</h4>
                <p className="text-sm">
                  Research tools and comprehensive data to support client
                  recommendations
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  🎓 Students & Researchers
                </h4>
                <p className="text-sm">
                  Access historical data, performance trends, and market
                  analysis for academic purposes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle>Our Commitment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We are committed to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Accuracy:</strong> Regular data updates from verified
                  sources
                </li>
                <li>
                  <strong>Privacy:</strong> Your data security is our top
                  priority
                </li>
                <li>
                  <strong>Innovation:</strong> Continuously adding features
                  based on user feedback
                </li>
                <li>
                  <strong>Support:</strong> Responsive customer service to
                  address your concerns
                </li>
                <li>
                  <strong>Education:</strong> Free resources to improve
                  financial literacy
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-green-400 dark:border-green-600">
            <CardContent className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Join Our Community
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We're building a community of informed investors who support
                each other's financial journeys. Whether you have questions,
                suggestions, or just want to share your investment story, we'd
                love to hear from you!
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Get in touch:</strong>{' '}
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  rakeshd01042024@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          <div className="text-center py-8">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Made with ❤️ for Indian Investors
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Helping you build wealth, one informed decision at a time.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
