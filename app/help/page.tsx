'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HelpCircle,
  Search,
  BarChart3,
  Calculator,
  Shield,
  TrendingUp,
  AlertCircle,
  Mail,
} from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Getting Started',
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          q: 'Do I need to create an account to use MF Analyzer?',
          a: 'No! Most features are accessible without registration. You only need to create an account if you want to save watchlists, portfolios, or track your preferences across devices.',
        },
        {
          q: 'Is MF Analyzer free to use?',
          a: 'Yes, MF Analyzer is completely free. We provide all features—fund analysis, comparison, calculators, and research tools—at no cost.',
        },
        {
          q: 'How do I search for a specific mutual fund?',
          a: "Use the search bar at the top of any page. You can search by fund name, AMC name, or category. For example, type 'HDFC Top 100' or 'SBI Bluechip' to find specific funds.",
        },
        {
          q: "What's the difference between Equity, Debt, and Commodity funds?",
          a: 'Equity funds invest primarily in stocks (higher risk, higher potential returns). Debt funds invest in bonds and fixed-income securities (lower risk, stable returns). Commodity funds invest in commodities like gold and silver.',
        },
      ],
    },
    {
      category: 'Fund Analysis',
      icon: <BarChart3 className="w-5 h-5" />,
      questions: [
        {
          q: 'What do the return percentages mean (1Y, 3Y, 5Y)?',
          a: 'These show annualized returns over different time periods. 1Y = last 1 year, 3Y = average annual return over 3 years, 5Y = average annual return over 5 years. Longer periods provide better insight into consistent performance.',
        },
        {
          q: 'What is expense ratio and why does it matter?',
          a: 'Expense ratio is the annual fee charged by the fund (as a percentage of your investment). Lower is better. For example, a 1% expense ratio means ₹1,000 is deducted annually from every ₹1,00,000 invested.',
        },
        {
          q: 'How do I know if a fund is risky?',
          a: "Check the 'Risk Metrics' section. Standard deviation shows volatility (higher = more volatile). Beta compares risk to the market. Sharpe ratio shows risk-adjusted returns (higher is better). Also check the fund's holdings and sector concentration.",
        },
        {
          q: 'What is AUM (Assets Under Management)?',
          a: 'AUM is the total market value of all investments managed by the fund. Larger AUM generally indicates investor confidence but very large funds may face flexibility challenges.',
        },
        {
          q: 'Should I only look at past returns?',
          a: "No! Past returns don't guarantee future performance. Also consider expense ratio, fund manager track record, portfolio quality, risk metrics, and consistency of returns.",
        },
      ],
    },
    {
      category: 'Comparison & Overlap',
      icon: <Search className="w-5 h-5" />,
      questions: [
        {
          q: 'How do I compare multiple funds?',
          a: "Go to the 'Compare' page. Select fund type (Equity/Debt), choose AMC if desired, then select 2-5 funds from the dropdown. Click 'Compare Funds' to see side-by-side analysis.",
        },
        {
          q: 'What is portfolio overlap and why should I check it?',
          a: "Portfolio overlap shows how many common stocks are held by different funds. High overlap (>30%) means you're not truly diversified—you're essentially investing in the same stocks multiple times.",
        },
        {
          q: "What's a good overlap percentage?",
          a: 'Under 30% is generally good, indicating proper diversification. 30-50% is moderate overlap. Above 50% suggests high concentration and limited diversification benefits.',
        },
        {
          q: 'Can I compare equity and debt funds together?',
          a: 'No, the comparison tool requires funds of the same type (all equity or all debt) for meaningful comparison, as they have different risk-return profiles and metrics.',
        },
      ],
    },
    {
      category: 'Calculators',
      icon: <Calculator className="w-5 h-5" />,
      questions: [
        {
          q: "What's the difference between SIP and Lumpsum?",
          a: 'SIP (Systematic Investment Plan) invests a fixed amount regularly (monthly). Lumpsum invests a large amount once. SIP averages out market fluctuations and is better for regular income earners. Lumpsum works when you have surplus funds.',
        },
        {
          q: 'How accurate are calculator projections?',
          a: "Calculators use mathematical formulas based on your inputs (amount, duration, expected returns). They're estimates, not guarantees. Actual returns will vary based on market performance.",
        },
        {
          q: 'What return rate should I assume for equity/debt funds?',
          a: 'Historically, equity funds have delivered 10-15% annually over long periods. Debt funds typically give 6-9%. However, these are not guaranteed—use conservative estimates (10-12% for equity, 6-7% for debt) for realistic planning.',
        },
        {
          q: 'What is Step-up SIP?',
          a: 'Step-up SIP increases your monthly investment by a fixed percentage each year (e.g., 10%). This helps counter inflation and can significantly boost long-term wealth as your income grows.',
        },
      ],
    },
    {
      category: 'Fund Manager Details',
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          q: 'How do I find information about a fund manager?',
          a: "Go to 'Fund Manager' page, select fund type, choose the specific fund, and click 'View Manager Details' to see comprehensive information about the manager's experience, education, and track record.",
        },
        {
          q: 'Why does the manager name sometimes differ from official AMC sites?',
          a: 'Fund manager changes are common. Our data may have a delay, or the fund may have co-managers. Always verify current manager details from the official AMC website.',
        },
        {
          q: 'Does the fund manager really matter?',
          a: 'Yes! The fund manager makes all investment decisions. Check their experience, consistency, and track record across different market cycles. A skilled manager can significantly impact returns.',
        },
      ],
    },
    {
      category: 'Data & Updates',
      icon: <TrendingUp className="w-5 h-5" />,
      questions: [
        {
          q: 'How often is data updated?',
          a: 'NAV data is updated daily after market close (usually by 9 PM IST). Portfolio holdings and fact sheet data are updated monthly or as published by AMCs.',
        },
        {
          q: 'Where does MF Analyzer get its data?',
          a: "We source data from AMFI (official mutual fund association), individual AMC websites, and SEBI filings. See our 'Data Sources' page for complete details.",
        },
        {
          q: 'Can I trust the accuracy of the data?',
          a: 'We strive for accuracy, but always verify critical information (NAV, holdings, manager names) from official AMC websites before investing. Data may have minor delays or discrepancies.',
        },
        {
          q: 'Do you provide investment recommendations?',
          a: "No. We provide data, tools, and analysis for research purposes only. We don't recommend specific funds or provide personalized investment advice. Consult a SEBI-registered financial advisor for recommendations.",
        },
      ],
    },
    {
      category: 'Account & Privacy',
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          q: 'Is my data safe?',
          a: 'Yes. We use industry-standard encryption, secure authentication, and follow best practices for data protection. See our Privacy Policy for detailed information.',
        },
        {
          q: 'Can I delete my account?',
          a: "Yes. Go to Settings > Account and choose 'Delete Account'. Your data will be permanently removed within 30 days.",
        },
        {
          q: 'Do you share my data with third parties?',
          a: 'No, we do not sell your personal data. We may share limited data with service providers (hosting, analytics) under strict confidentiality. See Privacy Policy for details.',
        },
      ],
    },
    {
      category: 'Technical Issues',
      icon: <AlertCircle className="w-5 h-5" />,
      questions: [
        {
          q: 'The website is loading slowly. What should I do?',
          a: 'Try clearing your browser cache, disabling browser extensions, or switching to a different browser. Large datasets (like fund lists) may take a few seconds to load.',
        },
        {
          q: 'I found incorrect data. How do I report it?',
          a: "Please email us at rakeshd01042024@gmail.com with details (fund name, what's incorrect, source of correct data). We'll investigate and update promptly.",
        },
        {
          q: 'Can I use MF Analyzer on mobile?',
          a: "Yes! Our website is fully responsive and works on smartphones and tablets. We're also working on dedicated mobile apps.",
        },
        {
          q: 'Which browsers are supported?',
          a: 'We support all modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). Internet Explorer is not supported.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Help & FAQs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Find answers to commonly asked questions
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Need immediate assistance?</strong> Browse our FAQs
                below or contact us directly:
              </p>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  rakeshd01042024@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>

          {faqs.map((section, sectionIdx) => (
            <Card key={sectionIdx} className="mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {section.questions.map((faq, faqIdx) => {
                    const faqId = sectionIdx * 100 + faqIdx;
                    const isOpen = openFaq === faqId;

                    return (
                      <div
                        key={faqIdx}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqId)}
                          className="w-full text-left flex items-start gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span className="text-2xl mt-1 flex-shrink-0">
                            {isOpen ? '−' : '+'}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {faq.q}
                            </h3>
                            {isOpen && (
                              <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {faq.a}
                              </p>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle>Glossary of Terms</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-3">
                Confused by financial jargon? Check our comprehensive glossary:
              </p>
              <a
                href="/glossary"
                className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                View Glossary →
              </a>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardTitle>Video Tutorials (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-3">
                We're creating step-by-step video guides to help you:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Navigate the platform efficiently</li>
                <li>Interpret fund metrics correctly</li>
                <li>Use comparison and overlap tools</li>
                <li>Plan your investments with calculators</li>
              </ul>
              <p className="mt-4 text-sm italic">Stay tuned for updates!</p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-blue-400 dark:border-blue-600">
            <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Still Need Help?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Can't find the answer you're looking for? Our support team is
                here to help. Send us a detailed message and we'll get back to
                you within 24-48 hours.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:rakeshd01042024@gmail.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    rakeshd01042024@gmail.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please include: your question, relevant fund names (if
                  applicable), and any error messages or screenshots.
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
