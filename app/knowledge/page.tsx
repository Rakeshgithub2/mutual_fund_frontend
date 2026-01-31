'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  TrendingUp,
  Shield,
  Target,
  PieChart,
  BarChart3,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Building2,
  Coins,
  LineChart,
} from 'lucide-react';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('mutual-funds');

  const mutualFundsContent = [
    {
      title: 'What are Mutual Funds?',
      icon: BookOpen,
      content:
        'A mutual fund is an investment vehicle that pools money from multiple investors to invest in diversified portfolios of stocks, bonds, or other securities. Managed by professional fund managers, they offer investors a way to access a diversified portfolio without needing to pick individual stocks.',
      highlights: [
        'Professional management by certified fund managers with years of experience',
        'Diversification across multiple securities reducing individual stock risk',
        'Regulated by SEBI (Securities and Exchange Board of India) ensuring transparency',
        'Low minimum investment starting from ₹500 making it accessible to all',
        'Liquidity: Can be redeemed any business day (except ELSS with 3-year lock-in)',
        'Transparency: Daily NAV disclosure and regular portfolio updates',
        'Convenience: No need to track individual stocks or manage portfolio',
        'Tax efficiency: Better tax treatment compared to other investments',
      ],
      category: 'Basics',
    },
    {
      title: 'Why Invest in Mutual Funds?',
      icon: Target,
      content:
        'Mutual funds offer unique advantages that make them ideal for wealth creation across different financial goals and risk profiles.',
      highlights: [
        'Beat Inflation: Historical returns of 12-15% p.a. outpace inflation (6-7%)',
        'Wealth Creation: Compound growth turns small regular investments into large corpus',
        'Professional Expertise: Fund managers analyze 1000s of stocks to pick winners',
        'Time-Saving: No need to research individual companies or track markets daily',
        'Flexibility: Change fund categories as your goals and risk appetite evolve',
        'Goal-Based Planning: Specific funds for retirement, education, house purchase',
        'Emergency Access: Most funds can be redeemed within 1-3 business days',
        'Systematic Investing: SIP automates investing and builds discipline',
      ],
      category: 'Benefits',
    },
    {
      title: 'Advantages of Mutual Funds (Pros)',
      icon: CheckCircle,
      content:
        'Multiple benefits make mutual funds one of the most popular investment options in India with over ₹50 lakh crore AUM.',
      highlights: [
        '✅ Professional Management: Experienced fund managers make buy/sell decisions',
        '✅ Diversification: Single fund holds 50-100 stocks reducing concentration risk',
        '✅ Low Cost: Start with ₹500, expense ratios as low as 0.1% in index funds',
        '✅ Liquidity: Quick redemption process unlike real estate or fixed deposits',
        '✅ Variety: 2000+ funds across equity, debt, hybrid, gold, international',
        '✅ Regulation: SEBI oversight ensures investor protection and transparency',
        '✅ Tax Benefits: ELSS funds offer deduction under Section 80C up to ₹1.5L',
        '✅ Flexibility: Switch between funds, change SIP amounts, pause anytime',
        "✅ No Demat: Most mutual funds don't require demat account",
        '✅ Partial Withdrawal: Redeem only the amount you need anytime',
      ],
      category: 'Pros',
    },
    {
      title: 'Disadvantages of Mutual Funds (Cons)',
      icon: AlertCircle,
      content:
        'While mutual funds offer many benefits, being aware of potential drawbacks helps in making informed investment decisions.',
      highlights: [
        '❌ Market Risk: Equity funds can lose value during market downturns',
        "❌ No Guaranteed Returns: Past performance doesn't guarantee future results",
        '❌ Expense Ratio: Annual fees of 0.5-2.5% can impact long-term returns',
        '❌ Exit Load: 1% charge if redeemed before 1 year in many funds',
        '❌ Lock-in Period: ELSS funds have mandatory 3-year lock-in',
        '❌ Over-Diversification: Too many similar funds dilute returns',
        "❌ Fund Manager Risk: Performance depends on manager's skill and decisions",
        '❌ Hidden Costs: Transaction charges, GST on expense ratio add up',
        '❌ No Control: Cannot choose individual stocks in the portfolio',
        '❌ Tax on Gains: LTCG >₹1.25L taxed at 12.5%, STCG at 20%',
      ],
      category: 'Cons',
    },
    {
      title: 'Types of Mutual Funds',
      icon: PieChart,
      content:
        'Mutual funds in India are categorized based on asset class, investment objective, and structure:',
      highlights: [
        'Equity Funds: Invest primarily in stocks (Large Cap, Mid Cap, Small Cap, Multi Cap)',
        'Debt Funds: Invest in fixed-income securities like bonds (Liquid, Short Duration, Corporate Bond)',
        'Hybrid Funds: Mix of equity and debt (Balanced, Aggressive, Conservative)',
        "Solution-Oriented: Retirement, Children's Education funds",
      ],
      category: 'Types',
    },
    {
      title: 'SIP vs Lumpsum Investment',
      icon: TrendingUp,
      content:
        'Two primary ways to invest in mutual funds with different advantages:',
      highlights: [
        'SIP (Systematic Investment Plan): Regular monthly investments, ideal for salaried individuals, benefits from rupee cost averaging',
        'Lumpsum: One-time large investment, suitable when you have a windfall, potentially higher returns in bullish markets',
        'SIP reduces market timing risk through periodic investments',
        'Lumpsum works well when markets are undervalued',
      ],
      category: 'Investment Strategies',
    },
    {
      title: 'Understanding Returns & Risk',
      icon: BarChart3,
      content:
        'Returns and risks are inversely related in mutual fund investments:',
      highlights: [
        'Equity Funds: 12-15% average returns, high volatility, best for 5+ years',
        'Debt Funds: 6-8% average returns, low volatility, suitable for 1-3 years',
        'Risk measures: Standard Deviation, Beta, Sharpe Ratio, Sortino Ratio',
        "Past performance doesn't guarantee future returns",
      ],
      category: 'Risk & Returns',
    },
    {
      title: 'Taxation on Mutual Funds',
      icon: DollarSign,
      content: 'Tax treatment varies based on fund type and holding period:',
      highlights: [
        'Equity Funds LTCG: >1 year holding, gains >₹1.25L taxed at 12.5%',
        'Equity Funds STCG: <1 year holding, taxed at 20%',
        'Debt Funds: Taxed as per income tax slab regardless of holding period',
        'ELSS funds offer Section 80C deduction up to ₹1.5L with 3-year lock-in',
      ],
      category: 'Taxation',
    },
    {
      title: 'How to Choose the Right Fund',
      icon: Target,
      content:
        'Selecting the right mutual fund requires evaluating multiple factors:',
      highlights: [
        'Define your investment goal and time horizon',
        'Assess your risk tolerance (aggressive/moderate/conservative)',
        'Compare expense ratios (lower is generally better)',
        'Check fund manager experience and track record',
        'Analyze 3-year and 5-year rolling returns',
        'Review portfolio holdings and diversification',
      ],
      category: 'Selection Guide',
    },
    {
      title: 'How Mutual Funds Work',
      icon: Info,
      content:
        'Understanding the mechanics of mutual funds helps you make better investment decisions.',
      highlights: [
        'Step 1: Fund house (AMC) launches fund with specific investment objective',
        'Step 2: Investors buy units at NAV (Net Asset Value) calculated daily',
        'Step 3: Fund manager invests pooled money in stocks/bonds per fund objective',
        'Step 4: Daily NAV reflects portfolio value after deducting expenses',
        'Step 5: Investors earn through NAV appreciation and dividends',
        'Step 6: Units can be redeemed at current NAV (minus exit load if applicable)',
        'NAV Formula: (Total Assets - Expenses - Liabilities) / Total Units',
        'Dividends reduce NAV as cash is paid out from fund corpus',
      ],
      category: 'Mechanism',
    },
    {
      title: 'Equity vs Debt vs Hybrid Funds',
      icon: BarChart3,
      content:
        'Different fund categories serve different investment goals and risk tolerances.',
      highlights: [
        'EQUITY: 80%+ in stocks | High risk-high return | 12-15% returns | 5+ years',
        'DEBT: Bonds & fixed income | Low risk-stable return | 6-8% returns | 1-3 years',
        'HYBRID: Mix of equity & debt | Moderate risk | 9-11% returns | 3-5 years',
        'Equity: Market volatility, wealth creation, tax efficient after 1 year',
        'Debt: Capital preservation, regular income, less volatile than equity',
        'Hybrid: Balanced approach, automatic rebalancing, good for first-time investors',
        'Choose equity for long-term goals like retirement (10+ years)',
        'Choose debt for short-term goals like vacation or car purchase (1-3 years)',
      ],
      category: 'Comparison',
    },
    {
      title: 'Mutual Funds vs Fixed Deposits',
      icon: Shield,
      content:
        'Comparing two popular investment options helps understand trade-offs.',
      highlights: [
        'Returns: MF equity 12-15% vs FD 6-7% (MF beats FD in long run)',
        'Risk: MF volatile vs FD guaranteed (FD safer but inflation erodes value)',
        'Liquidity: MF T+2 days vs FD penalty on early withdrawal',
        'Taxation: MF LTCG 12.5% vs FD taxed as income (up to 30%+)',
        'Inflation Protection: MF returns beat inflation vs FD real returns negative',
        'Lock-in: MF flexible (except ELSS) vs FD fixed tenure',
        'Investment Amount: MF ₹500 minimum vs FD ₹1000-5000 minimum',
        'Best Strategy: Use FD for emergency fund, MF for wealth creation',
      ],
      category: 'Comparison',
    },
    {
      title: 'When to Invest & When to Exit',
      icon: TrendingUp,
      content:
        "Timing isn't everything, but knowing when to enter and exit improves outcomes.",
      highlights: [
        'WHEN TO INVEST: Start immediately, don\'t wait for "right time"',
        'Market Crash: Best time to invest aggressively via SIP',
        'Regular Income: Start SIP as soon as salary is credited',
        'Windfall Gains: Invest lumpsum during market corrections (>10% fall)',
        'WHEN TO EXIT: Goal achieved and need money for planned expense',
        'Rebalancing: Book profits when allocation exceeds target by 5-10%',
        'Fund Underperformance: Consistent underperformance for 2-3 years',
        "DON'T EXIT: During market volatility or panic, stay invested",
      ],
      category: 'Timing',
    },
    {
      title: 'Common Mistakes to Avoid',
      icon: AlertCircle,
      content: 'Avoid these common pitfalls when investing in mutual funds:',
      highlights: [
        "Don't chase past performance - yesterday's winners aren't tomorrow's",
        'Avoid investing without understanding your risk profile',
        "Don't panic sell during market downturns - stay calm and invested",
        'Avoid over-diversification (8-10 funds maximum) - focus on quality',
        "Don't ignore expense ratios and exit loads - they compound over time",
        'Avoid investing emergency funds in equity - keep 6 months expenses liquid',
        "Don't stop SIP during market fall - that's when you get more units",
        'Avoid comparing with stock returns - mutual funds offer diversification',
        "Don't forget annual portfolio review and rebalancing",
      ],
      category: 'Best Practices',
    },
    {
      title: 'Direct vs Regular Plans',
      icon: CheckCircle,
      content:
        'Understanding the difference can significantly impact your returns:',
      highlights: [
        'Direct Plans: Buy directly from AMC, lower expense ratio (0.5-1% less)',
        'Regular Plans: Through distributors, higher expense ratio due to commission',
        'Direct Plans offer 1-2% higher returns over long term (₹5L becomes ₹7L extra in 20 years)',
        'Regular Plans provide advisory services from distributors',
        'You can switch from Regular to Direct anytime without tax impact',
        'Example: 1% expense difference = ₹3.2L extra on ₹10L in 20 years',
        'Direct recommended for DIY investors comfortable with research',
        'Regular suitable for beginners needing hand-holding and advice',
      ],
      category: 'Plans',
    },
    {
      title: 'Building Your Mutual Fund Portfolio',
      icon: PieChart,
      content:
        'A well-constructed portfolio balances growth, stability, and liquidity.',
      highlights: [
        'AGGRESSIVE (Age 20-35): 70% Equity + 20% Hybrid + 10% Debt',
        'MODERATE (Age 35-50): 50% Equity + 30% Hybrid + 20% Debt',
        'CONSERVATIVE (Age 50+): 30% Equity + 30% Hybrid + 40% Debt',
        'Core Portfolio: 60-70% in large cap and index funds (stability)',
        'Satellite Portfolio: 20-30% in mid/small cap funds (growth)',
        'Debt Component: 10-20% in liquid/short duration (emergency + rebalancing)',
        'Maximum 8-10 funds total: 3-4 equity + 2-3 hybrid + 1-2 debt',
        'Review quarterly, rebalance annually or when deviation >5%',
      ],
      category: 'Portfolio',
    },
  ];

  const commoditiesContent = [
    {
      title: 'What are Commodity Investments?',
      icon: Coins,
      content:
        'Commodities are raw materials or primary agricultural products that can be bought and sold. They provide portfolio diversification and hedge against inflation.',
      highlights: [
        'PRECIOUS METALS: Gold, Silver, Platinum - store of value, inflation hedge',
        'ENERGY: Crude Oil, Natural Gas - economic growth indicator, geopolitical impact',
        'AGRICULTURAL: Wheat, Sugar, Cotton, Coffee - weather and demand driven',
        'BASE METALS: Copper, Aluminum, Zinc - industrial demand indicator',
        'Commodities have low/negative correlation with equity making them diversifiers',
        'Tangible assets with intrinsic value unlike stocks which are paper assets',
        'Global pricing: Most commodities traded internationally in USD',
        'Limited supply: Cannot be produced at will unlike fiat currency',
      ],
      category: 'Basics',
    },
    {
      title: 'Why Invest in Commodities?',
      icon: Target,
      content:
        'Commodities serve unique purposes in investment portfolios beyond just returns.',
      highlights: [
        'INFLATION PROTECTION: Commodity prices rise with inflation protecting purchasing power',
        'DIVERSIFICATION: Low correlation with stocks and bonds reduces overall portfolio risk',
        'SAFE HAVEN: Gold and silver perform well during market crashes and uncertainty',
        'CURRENCY HEDGE: Protects against rupee depreciation (commodities priced in USD)',
        'PORTFOLIO STABILITY: Adds non-correlated asset class smoothing overall returns',
        'CRISIS INSURANCE: Gold appreciates during geopolitical tensions and war',
        'WEALTH PRESERVATION: Physical gold has maintained value for thousands of years',
        'LIQUIDITY: Can be easily converted to cash through various investment modes',
      ],
      category: 'Benefits',
    },
    {
      title: 'Advantages of Commodities (Pros)',
      icon: CheckCircle,
      content:
        'Commodities offer distinct benefits that make them essential portfolio components.',
      highlights: [
        '✅ INFLATION HEDGE: Prices rise with inflation unlike bonds whose real value falls',
        '✅ PORTFOLIO DIVERSIFICATION: -0.1 to 0.2 correlation with equity reduces risk',
        '✅ TANGIBLE ASSETS: Physical ownership provides psychological comfort',
        '✅ CRISIS PROTECTION: Gold up 25%+ during 2008, 2020 market crashes',
        '✅ UNIVERSAL VALUE: Globally accepted and traded 24/7',
        '✅ RUPEE DEPRECIATION HEDGE: INR falls, commodity rupee value rises',
        '✅ NO COUNTERPARTY RISK: Physical gold has no default risk unlike bonds',
        '✅ SEASONAL PATTERNS: Predictable demand cycles in agricultural commodities',
        '✅ CULTURAL VALUE: Gold/Silver hold special significance in Indian weddings',
        '✅ EASY ACCESS: Multiple investment options from physical to digital',
      ],
      category: 'Pros',
    },
    {
      title: 'Disadvantages of Commodities (Cons)',
      icon: AlertCircle,
      content:
        'Understanding limitations helps set realistic expectations for commodity investments.',
      highlights: [
        "❌ NO REGULAR INCOME: Gold/commodities don't pay dividends or interest (except SGBs)",
        '❌ STORAGE COSTS: Physical commodities need secure storage and insurance',
        '❌ HIGH VOLATILITY: Prices swing wildly based on supply/demand and USD movements',
        '❌ CURRENCY RISK: Rupee appreciation reduces returns on USD-denominated commodities',
        '❌ MAKING CHARGES: Physical gold jewelry has 8-25% making charges',
        '❌ PRICE TRANSPARENCY: Physical purchases may not reflect actual market rates',
        '❌ LOWER RETURNS: Gold 10% CAGR vs equity 12-15% over long periods',
        '❌ GEOPOLITICAL IMPACT: Wars, sanctions, OPEC decisions cause price volatility',
        '❌ TRACKING ERROR: Commodity funds may not perfectly track underlying asset',
        '❌ TAX INEFFICIENCY: Short-term gains taxed as income (vs 20% for equity)',
      ],
      category: 'Cons',
    },
    {
      title: 'Gold Investment Options',
      icon: Building2,
      content: 'Multiple ways to invest in gold in India:',
      highlights: [
        'Gold ETFs: Trade on stock exchanges, low expense ratio (0.5-1%), demat account needed',
        'Sovereign Gold Bonds: Government-backed, 2.5% annual interest, 8-year maturity',
        'Digital Gold: Buy from apps, stored in secure vaults, flexible amounts',
        'Physical Gold: Jewelry/coins, making charges apply, storage concerns',
        'Gold Mutual Funds: Fund of gold ETFs, no demat needed',
      ],
      category: 'Gold',
    },
    {
      title: 'Gold vs Equity Returns',
      icon: LineChart,
      content: 'Historical comparison helps understand allocation decisions:',
      highlights: [
        'Gold: 10-year average return ~10%, lower volatility',
        'Equity: 10-year average return ~12-15%, higher volatility',
        'Gold performs well during economic uncertainty and high inflation',
        'Equity outperforms during economic growth phases',
        'Recommended allocation: 10-15% in gold for diversification',
      ],
      category: 'Returns',
    },
    {
      title: 'Commodity ETFs Explained',
      icon: BarChart3,
      content:
        'ETFs provide an easy way to invest in commodities without physical storage:',
      highlights: [
        'Track commodity prices with minimal tracking error',
        'Trade like stocks on NSE/BSE during market hours',
        'Lower costs compared to physical commodity purchases',
        'No storage or insurance concerns',
        'Popular ETFs: Gold, Silver, Crude Oil, Commodity baskets',
      ],
      category: 'ETFs',
    },
    {
      title: 'Taxation on Commodity Investments',
      icon: DollarSign,
      content: 'Tax treatment varies by commodity type and investment mode:',
      highlights: [
        'Gold ETFs/Funds LTCG: >3 years, 20% with indexation benefit (debt taxation)',
        'Gold ETFs/Funds STCG: <3 years, taxed as per income tax slab',
        'Sovereign Gold Bonds: Tax-free if held till maturity, interest taxable',
        'Physical Gold: LTCG 20% with indexation after 3 years',
        'Digital Gold: Similar to physical gold taxation',
      ],
      category: 'Taxation',
    },
    {
      title: 'When to Invest in Commodities',
      icon: Target,
      content: 'Timing and scenarios that favor commodity investments:',
      highlights: [
        'Rising inflation environment favors gold and commodities',
        'Portfolio diversification during equity market volatility',
        'Economic uncertainty and geopolitical tensions',
        'Weakening currency benefits gold returns',
        'Wedding season in India typically sees gold price rise',
        "Don't time the market; maintain 10-15% allocation",
      ],
      category: 'Strategy',
    },
    {
      title: 'Risks in Commodity Investing',
      icon: AlertCircle,
      content:
        'Understanding risks helps in making informed investment decisions:',
      highlights: [
        'Price volatility due to global supply-demand dynamics',
        'Currency fluctuations (commodities priced in USD)',
        'No dividend or interest income (except SGBs)',
        'Storage and insurance costs for physical commodities',
        'Regulatory changes can impact trading and taxation',
        'Liquidity risk in some commodity investments',
      ],
      category: 'Risks',
    },
    {
      title: 'Commodity vs Equity: Key Differences',
      icon: BarChart3,
      content:
        'Understanding fundamental differences helps allocate appropriately between asset classes.',
      highlights: [
        'NATURE: Equity=ownership in business | Commodity=physical tangible asset',
        'INCOME: Equity pays dividends | Commodity generates no income (except SGBs)',
        'RETURNS: Equity 12-15% long-term | Commodity 8-10% long-term',
        'VOLATILITY: Equity high volatility | Commodity moderate volatility',
        'CORRELATION: Equity depends on company performance | Commodity on supply-demand',
        'INFLATION: Equity mixed response | Commodity direct positive correlation',
        'CRISIS BEHAVIOR: Equity falls | Commodity (gold) rises during uncertainty',
        'BEST FOR: Equity=wealth creation | Commodity=wealth preservation',
        'TAXATION: Equity LTCG 12.5% after 1 year | Commodity LTCG 20% after 3 years',
        'RECOMMENDATION: 70-80% equity + 10-15% commodity + 10% debt',
      ],
      category: 'Comparison',
    },
    {
      title: 'Commodity vs Mutual Funds',
      icon: PieChart,
      content:
        'Both have unique characteristics making them suitable for different purposes.',
      highlights: [
        'DIVERSIFICATION: MF holds 50-100 stocks | Single commodity concentrated bet',
        'MANAGEMENT: MF professionally managed | Commodity self-directed',
        'RETURNS: MF equity higher potential | Commodity steady but lower',
        'PURPOSE: MF for growth | Commodity for preservation and hedging',
        'LIQUIDITY: Both highly liquid, T+1 to T+2 days redemption',
        'COSTS: MF 0.5-2% expense ratio | Commodity 0.5-1% ETF expense or storage cost',
        'INCOME: MF can pay dividends | Commodity no income (except SGB 2.5%)',
        'COMPLEXITY: MF simple to understand | Commodity needs market knowledge',
        'IDEAL PORTFOLIO: 70% Equity MF + 15% Commodity + 15% Debt MF',
      ],
      category: 'Comparison',
    },
    {
      title: 'How Commodities Perform in Different Scenarios',
      icon: LineChart,
      content:
        'Commodity performance varies significantly based on economic conditions.',
      highlights: [
        'HIGH INFLATION (>6%): Commodities outperform, gold/silver shine',
        'LOW INFLATION (<4%): Equities outperform, commodities underperform',
        'MARKET CRASH: Gold up 15-30%, equity down 20-40%',
        'BULL MARKET: Equity up 20%+, gold flat to down',
        'RUPEE DEPRECIATION: Commodities benefit (USD priced)',
        'RUPEE APPRECIATION: Commodities underperform in INR terms',
        'ECONOMIC GROWTH: Industrial commodities (copper, oil) perform well',
        'RECESSION: Gold outperforms as safe haven',
        'STRATEGY: Maintain 10-15% allocation for all-weather portfolio',
      ],
      category: 'Performance',
    },
    {
      title: 'Physical vs Paper Commodity Investments',
      icon: Building2,
      content:
        'Multiple ways to invest in commodities, each with unique advantages.',
      highlights: [
        'PHYSICAL: Actual gold/silver coins, bars, jewelry - tangible, cultural value',
        'GOLD ETF: Trade on exchanges like stocks - convenient, low cost 0.5%',
        'SOVEREIGN GOLD BONDS: 2.5% interest + price appreciation - tax-free at maturity',
        'DIGITAL GOLD: Buy from apps starting ₹1 - flexible, vault storage',
        'COMMODITY MUTUAL FUNDS: Fund of gold ETFs - no demat needed',
        'Physical: Making charges 8-25%, storage concerns, price opacity',
        'Paper: No making charges, transparent pricing, easy to trade',
        'RECOMMENDATION: SGB for long-term, Gold ETF for trading, Physical for personal use',
      ],
      category: 'Investment Modes',
    },
    {
      title: 'Commodity Investment Strategies',
      icon: TrendingUp,
      content: 'Proven strategies for successful commodity investing:',
      highlights: [
        'STRATEGIC ALLOCATION: Maintain 10-15% portfolio weight always',
        'TACTICAL ALLOCATION: Increase to 20% during high inflation (>7%)',
        'RUPEE COST AVERAGING: Monthly SIP in Gold/Silver ETF or SGB',
        'REBALANCING: Book profits when commodity exceeds 20% of portfolio',
        'DOLLAR COST AVERAGING: Benefits from price volatility over time',
        'SEASONAL BUYING: Buy gold in July-August (pre-festive season lows)',
        'CRISIS HEDGE: Maintain minimum 5-10% even in bull markets',
        "AVOID SPECULATION: Don't trade commodities based on short-term predictions",
        'COMBINE MODES: 5% physical gold + 5% SGB + 5% Gold ETF = 15% total',
      ],
      category: 'Strategy',
    },
    {
      title: 'Best Practices for Commodity Investing',
      icon: Shield,
      content:
        'Follow these guidelines to maximize benefits and minimize risks.',
      highlights: [
        'START SMALL: Begin with 5% allocation, gradually increase to 10-15%',
        'BUY PURITY: 24K gold for investment, verify hallmark certification',
        'USE MULTIPLE MODES: Combine SGB (long-term) + ETF (liquidity) + physical (emergency)',
        'REVIEW ANNUALLY: Rebalance if commodity allocation drifts >5% from target',
        'AVOID JEWELRY: Invest in coins/bars to avoid making charges',
        'DOLLAR COST AVERAGE: Invest monthly to average out price volatility',
        'HOLD LONG-TERM: Minimum 5+ years to benefit from appreciation',
        "DON'T PANIC SELL: Gold falls during equity bull runs, hold steady",
        'KEEP RECEIPTS: Essential for selling and tax calculation',
        'INSURE PHYSICAL: Cover against theft for holdings >₹5 lakhs',
      ],
      category: 'Best Practices',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Learn & Grow Your Wealth</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Knowledge Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Master the fundamentals of investing with comprehensive guides on
            Mutual Funds and Commodity investments
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs
            defaultValue="mutual-funds"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 h-14 mb-12">
              <TabsTrigger
                value="mutual-funds"
                className="text-base font-semibold"
              >
                📊 Mutual Funds
              </TabsTrigger>
              <TabsTrigger
                value="commodities"
                className="text-base font-semibold"
              >
                🪙 Commodities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mutual-funds" className="space-y-6">
              {/* Quick Facts Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-8"
              >
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Mutual Funds at a Glance
                </h2>
                <div className="grid md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">₹50L Cr+</div>
                    <div className="text-sm opacity-90">Total AUM in India</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">12-15%</div>
                    <div className="text-sm opacity-90">Avg Equity Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">2000+</div>
                    <div className="text-sm opacity-90">Schemes Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">₹500</div>
                    <div className="text-sm opacity-90">Minimum SIP</div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {mutualFundsContent.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all hover:scale-105 transform border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                            {item.category}
                          </span>
                        </div>
                        <CardTitle className="text-2xl">{item.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {item.content}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {item.highlights.map((highlight, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="commodities" className="space-y-6">
              {/* Quick Facts Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl mb-8"
              >
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Commodities at a Glance
                </h2>
                <div className="grid md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">₹10L Cr+</div>
                    <div className="text-sm opacity-90">
                      Gold Holdings in India
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">8-10%</div>
                    <div className="text-sm opacity-90">Avg Gold Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">2.5%</div>
                    <div className="text-sm opacity-90">SGB Interest p.a.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">10-15%</div>
                    <div className="text-sm opacity-90">Ideal Allocation</div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {commoditiesContent.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all hover:scale-105 transform border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                            {item.category}
                          </span>
                        </div>
                        <CardTitle className="text-2xl">{item.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {item.content}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {item.highlights.map((highlight, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Comprehensive Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 text-white">
              <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                <BarChart3 className="w-8 h-8" />
                Mutual Funds vs Commodities: Complete Comparison
              </CardTitle>
              <CardDescription className="text-center text-white/90 text-base mt-2">
                Side-by-side comparison to help you make informed investment
                decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white border-b-2">
                        Parameter
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-blue-600 dark:text-blue-400 border-b-2">
                        Mutual Funds (Equity)
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-amber-600 dark:text-amber-400 border-b-2">
                        Commodities (Gold)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">Asset Type</td>
                      <td className="px-6 py-4">
                        Paper asset (equity ownership)
                      </td>
                      <td className="px-6 py-4">Physical tangible asset</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Average Returns
                      </td>
                      <td className="px-6 py-4 text-green-600 font-bold">
                        12-15% p.a. (long-term)
                      </td>
                      <td className="px-6 py-4 text-green-600 font-bold">
                        8-10% p.a. (long-term)
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Income Generation
                      </td>
                      <td className="px-6 py-4">✅ Yes - Dividends possible</td>
                      <td className="px-6 py-4">❌ No (SGB: 2.5% interest)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">Risk Level</td>
                      <td className="px-6 py-4">High (market volatility)</td>
                      <td className="px-6 py-4">Moderate (price stable)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Inflation Protection
                      </td>
                      <td className="px-6 py-4">
                        Mixed (depends on companies)
                      </td>
                      <td className="px-6 py-4">
                        ✅ Excellent (direct correlation)
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">Best For</td>
                      <td className="px-6 py-4">Wealth creation & growth</td>
                      <td className="px-6 py-4">Wealth preservation & hedge</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Investment Horizon
                      </td>
                      <td className="px-6 py-4">5+ years ideal</td>
                      <td className="px-6 py-4">3+ years minimum</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Minimum Investment
                      </td>
                      <td className="px-6 py-4">₹500 (SIP)</td>
                      <td className="px-6 py-4">₹1 (Digital) / ₹1000 (SGB)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">Liquidity</td>
                      <td className="px-6 py-4">T+2 days (except ELSS)</td>
                      <td className="px-6 py-4">
                        T+1 days (ETF), Immediate (Digital)
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">LTCG Tax</td>
                      <td className="px-6 py-4">
                        12.5% ({'>'}1 year, {'>'}₹1.25L)
                      </td>
                      <td className="px-6 py-4">
                        20% with indexation ({'>'}3 years)
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">STCG Tax</td>
                      <td className="px-6 py-4">20% ({'<'}1 year)</td>
                      <td className="px-6 py-4">As per slab ({'<'}3 years)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">Volatility</td>
                      <td className="px-6 py-4">High (20-30% annual swings)</td>
                      <td className="px-6 py-4">Moderate (10-15% swings)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Crisis Performance
                      </td>
                      <td className="px-6 py-4">❌ Falls 20-40%</td>
                      <td className="px-6 py-4">✅ Rises 15-30%</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">Management</td>
                      <td className="px-6 py-4">Professional fund managers</td>
                      <td className="px-6 py-4">Self-directed (passive)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Expense Ratio / Costs
                      </td>
                      <td className="px-6 py-4">0.5-2.5% annual</td>
                      <td className="px-6 py-4">
                        0.5-1% (ETF) or storage costs
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Diversification
                      </td>
                      <td className="px-6 py-4">✅ High (50-100 stocks)</td>
                      <td className="px-6 py-4">❌ Low (single commodity)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Correlation with Equity
                      </td>
                      <td className="px-6 py-4">1.0 (same asset class)</td>
                      <td className="px-6 py-4">-0.1 to 0.2 (low/negative)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Currency Impact
                      </td>
                      <td className="px-6 py-4">Rupee appreciation helps</td>
                      <td className="px-6 py-4">
                        Rupee depreciation helps (USD priced)
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        Ideal Allocation
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        60-70% of portfolio
                      </td>
                      <td className="px-6 py-4 font-bold text-amber-600">
                        10-15% of portfolio
                      </td>
                    </tr>
                    <tr className="bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-900/20 dark:to-amber-900/20">
                      <td className="px-6 py-4 font-bold text-lg">
                        Recommended Strategy
                      </td>
                      <td
                        className="px-6 py-4 font-semibold text-blue-600"
                        colSpan={2}
                      >
                        🎯 Balanced Portfolio: 70% Equity Mutual Funds + 15%
                        Commodities (Gold) + 15% Debt
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Takeaways */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-green-600" />
                Key Takeaways for Smart Investing
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-blue-600 dark:text-blue-400">
                    ✨ Mutual Funds
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • Primary wealth creation vehicle with 12-15% returns
                    </li>
                    <li>
                      • Invest 70-80% of investment portfolio in equity MFs
                    </li>
                    <li>
                      • Start SIP immediately, increase with income growth
                    </li>
                    <li>
                      • Stay invested through market volatility for 5+ years
                    </li>
                    <li>• Review annually, rebalance when needed</li>
                    <li>• Choose Direct plans for 1-2% extra returns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-amber-600 dark:text-amber-400">
                    🪙 Commodities
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Portfolio stabilizer and inflation hedge</li>
                    <li>• Allocate 10-15% for diversification benefits</li>
                    <li>• Best during high inflation and market uncertainty</li>
                    <li>• Prefer SGB (long-term) and Gold ETF (liquidity)</li>
                    <li>• Don't chase gold returns, focus on preservation</li>
                    <li>• Rebalance when allocation exceeds 20%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-8 text-center">
              <Info className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Need Personalized Guidance?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                While we provide educational content, for personalized
                investment advice tailored to your financial goals, please
                consult a SEBI-registered financial advisor.
              </p>
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('toggleChatbot'))
                }
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                💬 Chat with AI Assistant
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
