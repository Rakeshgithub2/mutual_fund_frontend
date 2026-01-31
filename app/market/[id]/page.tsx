'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  Building2,
  Activity,
  BarChart3,
  Coins,
  Globe,
  Target,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Percent,
  Shield,
  Lightbulb,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';

type TimePeriod = '1D' | '1W' | '1M' | '6M' | '1Y' | '3Y' | '5Y';

interface IndexData {
  name: string;
  value: number;
  change: number;
  percent_change: number;
  updated_at: string;
}

interface HistoricalData {
  date: string;
  value: number;
  displayDate: string;
}

const INDEX_INFO: Record<
  string,
  {
    fullName: string;
    icon: any;
    color: string;
    description: string;
    calculation: string;
    importance: string[];
    composition: string;
    constituents: number;
    launched: string;
    baseYear: string;
    keyFacts: string[];
    investorTips: string[];
  }
> = {
  nifty50: {
    fullName: 'NIFTY 50',
    icon: TrendingUp,
    color: 'indigo',
    description:
      'The NIFTY 50 is the flagship index of the National Stock Exchange (NSE) of India. It represents the weighted average of 50 of the largest and most liquid Indian companies listed on NSE, covering 13 sectors of the Indian economy.',
    calculation:
      'Calculated using free-float market capitalization weighted method. Index Value = (Current Market Value / Base Market Capital) × Base Index Value (1000)',
    importance: [
      'Primary benchmark for Indian equity market performance',
      'Represents approximately 66% of NSE free-float market cap',
      'Most widely tracked index by investors and fund managers',
      'Used for derivatives trading (Futures & Options)',
      'Basis for index funds and ETFs tracking large-cap performance',
    ],
    composition:
      'Comprises 50 stocks selected based on free-float market capitalization and liquidity. Top sectors include Financial Services (35%), IT (17%), Energy (11%), Consumer Goods (10%), and Automobiles (7%).',
    constituents: 50,
    launched: 'November 1995',
    baseYear: 'November 3, 1995 = 1000',
    keyFacts: [
      'Covers 13 major sectors of Indian economy',
      'Stocks represent ~66% of NSE market cap',
      'High liquidity with daily trading volume >₹30,000 crore',
      'Rebalanced semi-annually (June and December)',
    ],
    investorTips: [
      'Ideal for passive investing through Index Funds',
      'Use for benchmarking your portfolio performance',
      'Consider for long-term wealth creation (5+ years)',
      'Lower expense ratios compared to actively managed funds',
    ],
  },
  sensex: {
    fullName: 'S&P BSE SENSEX',
    icon: Building2,
    color: 'blue',
    description:
      "The S&P BSE SENSEX (Sensitivity Index) is India's oldest stock market index, comprising 30 well-established and financially sound companies listed on the Bombay Stock Exchange (BSE). It serves as the barometer of the Indian stock market.",
    calculation:
      'Free-float market capitalization weighted method. Index = (Total Free-float Market Cap of 30 stocks / Base Market Cap) × Base Value (100)',
    importance: [
      "India's first and most recognized stock market index since 1986",
      'Represents approximately 45% of BSE total market capitalization',
      'Widely used benchmark for Indian economy health',
      'Tracked globally by international investors',
      'Key indicator for policy makers and economists',
    ],
    composition:
      'Consists of 30 financially sound and well-established companies across key sectors: Financial Services (40%), IT (13%), Energy (10%), FMCG (9%), and Automobiles (7%).',
    constituents: 30,
    launched: 'January 1, 1986',
    baseYear: '1978-79 = 100',
    keyFacts: [
      'Oldest stock market index in India',
      'Represents 30 blue-chip companies',
      'High correlation with NIFTY 50 (>95%)',
      'Average daily turnover exceeds ₹3,000 crore',
    ],
    investorTips: [
      'Excellent for long-term wealth creation',
      'Lower volatility compared to mid/small-cap indices',
      'Suitable for conservative to moderate investors',
      'Available through low-cost ETFs and index funds',
    ],
  },
  niftymidcap: {
    fullName: 'NIFTY Midcap 100',
    icon: BarChart3,
    color: 'purple',
    description:
      'The NIFTY Midcap 100 Index represents 100 mid-sized companies ranked 101st to 200th by free-float market capitalization. These companies balance stability with high growth potential.',
    calculation:
      'Free-float market capitalization weighted. Companies ranked 101-200 by market cap are included. Base date: January 1, 2004 = 1000',
    importance: [
      'Higher growth potential than large-cap indices',
      'Represents emerging market leaders',
      'Better risk-reward balance than small-caps',
      'Captures mid-tier economic growth',
      'Popular for multi-cap portfolio diversification',
    ],
    composition:
      'Top 100 companies ranked 101-200 by market cap across sectors like Banking, Pharma, Infrastructure, Consumer Goods, and Textiles. Average company size: ₹15,000-50,000 crore.',
    constituents: 100,
    launched: 'January 2004',
    baseYear: 'January 1, 2004 = 1000',
    keyFacts: [
      'Sweet spot between stability and growth',
      'Historically outperforms large-caps in bull markets',
      'Higher volatility than NIFTY 50 (~30-40%)',
      'Rebalanced quarterly based on market cap ranking',
    ],
    investorTips: [
      'Suitable for moderate to aggressive investors',
      'Recommended investment horizon: 5-7 years',
      'Consider for portfolio diversification beyond large-caps',
      'Can be volatile; use SIP for rupee cost averaging',
    ],
  },
  niftysmallcap: {
    fullName: 'NIFTY Smallcap 250',
    icon: Target,
    color: 'pink',
    description:
      'The NIFTY Smallcap 250 Index represents 250 small-cap companies ranked beyond 250th position by market capitalization. These companies offer highest growth potential with higher risk.',
    calculation:
      'Free-float market cap weighted. Includes companies ranked below 250 by market cap. Multiple selection criteria ensure liquidity and quality.',
    importance: [
      'Highest long-term growth potential among indices',
      'Captures grassroots economic growth',
      'Early exposure to future market leaders',
      'Democratization of wealth across smaller companies',
      'Key indicator of domestic consumption and economic health',
    ],
    composition:
      '250 small-cap companies across diverse sectors including Manufacturing, Real Estate, Textiles, Engineering, and Services. Average company size: ₹2,000-10,000 crore.',
    constituents: 250,
    launched: 'January 2004',
    baseYear: 'January 1, 2004 = 1000',
    keyFacts: [
      'Highest volatility among major indices (40-60%)',
      'Can underperform in bear markets but excel in bull runs',
      'Many future mid-cap and large-cap stocks emerge from here',
      'Lower analyst coverage creates opportunities',
    ],
    investorTips: [
      'Only for aggressive investors with high risk tolerance',
      'Minimum investment horizon: 7-10 years',
      'Use SIP to average out volatility',
      'Should not exceed 10-15% of total portfolio',
    ],
  },
  niftybank: {
    fullName: 'NIFTY Bank Index',
    icon: Building2,
    color: 'green',
    description:
      'The NIFTY Bank Index represents the 12 most liquid and large capitalized Indian banking stocks. It provides investors with a benchmark capturing the capital market performance of Indian banks.',
    calculation:
      'Free-float market cap weighted. Comprises most liquid banking stocks from NIFTY 50. Base: June 1, 2000 = 1000',
    importance: [
      'Most actively traded banking sector index in India',
      'Reflects health of Indian banking and financial system',
      'High liquidity for derivatives trading',
      'Leading indicator of credit growth and economic activity',
      'Key for RBI monetary policy impact analysis',
    ],
    composition:
      'Includes 12 major banks: HDFC Bank, ICICI Bank, State Bank of India, Kotak Mahindra, Axis Bank, IndusInd Bank, and others. Represents both public and private sector banks.',
    constituents: 12,
    launched: 'June 2000',
    baseYear: 'January 1, 2000 = 1000',
    keyFacts: [
      'Most volatile index during rate cycle changes',
      'High correlation with credit growth and GDP',
      'Derivative contracts have highest open interest',
      'Sensitive to NPA levels and RBI policy changes',
    ],
    investorTips: [
      'Ideal for sector-specific banking exposure',
      'Use for hedging if you hold banking stocks',
      'Monitor RBI policy announcements closely',
      'Consider during economic recovery phases',
    ],
  },
  niftyit: {
    fullName: 'NIFTY IT Index',
    icon: Activity,
    color: 'cyan',
    description:
      'The NIFTY IT Index reflects the behavior and performance of the Information Technology sector, comprising companies in software development, IT services, and IT products.',
    calculation:
      'Free-float market cap weighted. Includes top IT companies by market cap and liquidity. Base: December 31, 1995 = 1000',
    importance: [
      "Tracks India's $200+ billion IT services industry",
      "Represents 25% of India's total exports",
      'Indicator of global technology demand',
      'Benefits from rupee depreciation (export-driven)',
      'Key sector for employment and economic growth',
    ],
    composition:
      'Comprises TCS, Infosys, Wipro, HCL Tech, Tech Mahindra, and other IT majors. Companies derive 70%+ revenue from IT services and software products.',
    constituents: 10,
    launched: 'December 1995',
    baseYear: 'December 31, 1995 = 1000',
    keyFacts: [
      'High exposure to US and European markets',
      'Gains when rupee depreciates against dollar',
      'Lower correlation with domestic indices',
      'Defensive characteristics during domestic slowdowns',
    ],
    investorTips: [
      'Ideal for global tech exposure through Indian companies',
      'Natural currency hedge in your portfolio',
      'Monitor US Fed policy and tech spending',
      'Consider during digital transformation trends',
    ],
  },
  niftypharma: {
    fullName: 'NIFTY Pharma Index',
    icon: Activity,
    color: 'teal',
    description:
      'The NIFTY Pharma Index represents the pharmaceutical and healthcare sector, including companies in drug manufacturing, research, biotechnology, and healthcare services.',
    calculation:
      'Free-float market cap weighted. Includes pharma companies meeting size and liquidity criteria. Base: January 1, 2001 = 1000',
    importance: [
      'India is global pharmacy - 50% of generic drug supply',
      'Export-oriented sector (60% revenue from exports)',
      'Defensive sector with essential products',
      'High R&D and innovation potential',
      'Benefits from aging population and healthcare demand',
    ],
    composition:
      "Includes Sun Pharma, Dr. Reddy's, Cipla, Lupin, Divi's Labs, Biocon, and other pharmaceutical leaders. Mix of generic drugs, APIs, and formulations.",
    constituents: 10,
    launched: 'January 2001',
    baseYear: 'January 1, 2001 = 1000',
    keyFacts: [
      'Low correlation with other sectors (defensive)',
      'Regulatory-dependent (US FDA, DCGI approvals)',
      'Benefits from rupee depreciation',
      'Patent expirations create generic opportunities',
    ],
    investorTips: [
      'Good defensive allocation during market volatility',
      'Monitor US FDA inspection outcomes',
      'Long-term play on healthcare demand',
      'Consider during healthcare crises or pandemics',
    ],
  },
  niftyauto: {
    fullName: 'NIFTY Auto Index',
    icon: TrendingUp,
    color: 'orange',
    description:
      'The NIFTY Auto Index represents the automobile sector including manufacturers of automobiles, auto components, tyres, and related services.',
    calculation:
      'Free-float market cap weighted. Includes auto OEMs and component makers. Base: January 1, 2004 = 1000',
    importance: [
      'Key indicator of consumer demand and economic health',
      'Reflects manufacturing sector strength',
      'Cyclical sector tracking GDP growth',
      'High beta - amplifies market movements',
      'Linked to credit availability and interest rates',
    ],
    composition:
      'Comprises Maruti Suzuki, Tata Motors, M&M, Bajaj Auto, Hero MotoCorp, Eicher Motors, and major auto component manufacturers like Bosch, Motherson Sumi.',
    constituents: 15,
    launched: 'January 2004',
    baseYear: 'January 1, 2004 = 1000',
    keyFacts: [
      'Highly cyclical - performs well in economic expansions',
      'Sensitive to fuel prices and interest rates',
      'EV transition creating new opportunities',
      'Rural demand linked to monsoon and agriculture',
    ],
    investorTips: [
      'Best during economic recovery and expansion phases',
      'Watch for interest rate cuts (boost demand)',
      'Consider exposure to EV transition theme',
      'High volatility - use SIP for entry',
    ],
  },
  niftyfmcg: {
    fullName: 'NIFTY FMCG Index',
    icon: Coins,
    color: 'amber',
    description:
      'The NIFTY FMCG Index tracks Fast Moving Consumer Goods sector, representing companies in food products, personal care, household products, and beverages.',
    calculation:
      'Free-float market cap weighted. Includes FMCG companies across categories. Base: January 1, 1996 = 1000',
    importance: [
      'Most defensive sector with stable demand',
      'Essential products - recession-proof',
      'Low volatility compared to other sectors',
      'Quality dividend-paying companies',
      'Reflects consumption trends and consumer confidence',
    ],
    composition:
      'Includes ITC, Hindustan Unilever, Nestlé, Britannia, Dabur, Godrej Consumer, Marico, and other FMCG leaders. Products used daily by consumers.',
    constituents: 15,
    launched: 'January 1996',
    baseYear: 'January 1, 1996 = 1000',
    keyFacts: [
      'Lowest volatility among major sector indices',
      'Consistent dividend payers',
      'Strong pricing power and brand value',
      'Rural demand linked to monsoon and farm income',
    ],
    investorTips: [
      'Ideal defensive allocation (20-30% of portfolio)',
      'Safe haven during market corrections',
      'Good for conservative investors seeking stability',
      'Look for rural recovery themes',
    ],
  },
  niftymetal: {
    fullName: 'NIFTY Metal Index',
    icon: BarChart3,
    color: 'gray',
    description:
      'The NIFTY Metal Index represents metal and mining companies including steel, aluminum, copper, zinc producers and integrated metal companies.',
    calculation:
      'Free-float market cap weighted. Includes ferrous and non-ferrous metal producers. Base: January 1, 2004 = 1000',
    importance: [
      'Leading indicator of infrastructure spending',
      'Global commodity price exposure',
      'Cyclical sector amplifying economic cycles',
      'Key input for construction and manufacturing',
      'China demand significantly impacts performance',
    ],
    composition:
      'Comprises Tata Steel, JSW Steel, Hindalco, Vedanta, SAIL, Coal India, NMDC, and other metal producers. Mix of steel, aluminum, copper, zinc, and iron ore.',
    constituents: 15,
    launched: 'January 2004',
    baseYear: 'January 1, 2004 = 1000',
    keyFacts: [
      'High correlation with global commodity cycles',
      'Very high volatility (Beta > 1.5)',
      'China consumption drives global prices',
      'Sensitive to government infrastructure spending',
    ],
    investorTips: [
      'Tactical allocation during infrastructure boom',
      'Monitor global metal prices and China demand',
      'High risk - limit to 5-10% of portfolio',
      'Consider during economic recovery phases',
    ],
  },
  commodity: {
    fullName: 'MCX Commodity Index (MCX iCOMDEX)',
    icon: Coins,
    color: 'amber',
    description:
      "India's first composite commodity futures index tracking the performance of six key commodities traded on the Multi Commodity Exchange - gold, silver, crude oil, copper, zinc, and natural gas.",
    calculation:
      'Weighted average of futures prices. Weights: Gold (34%), Silver (12%), Crude Oil (27%), Copper (11%), Zinc (8%), Natural Gas (8%). Updated in real-time.',
    importance: [
      "India's premier commodity price benchmark",
      'Diversification beyond equities and bonds',
      'Hedge against inflation',
      'Reflects raw material price trends',
      'Useful for producers, consumers, and traders',
    ],
    composition:
      'Six commodities with fixed weights revised quarterly. Provides balanced exposure to precious metals, energy, and base metals.',
    constituents: 6,
    launched: 'June 2009',
    baseYear: 'June 1, 2009 = 100',
    keyFacts: [
      'First commodity index in India',
      'Low correlation with equity indices',
      'Gold has highest weight (34%)',
      'Rebalanced quarterly',
    ],
    investorTips: [
      'Use for portfolio diversification (5-10%)',
      'Natural hedge against inflation',
      'Consider during geopolitical tensions',
      'Invest through commodity mutual funds or ETFs',
    ],
  },
  giftnifty: {
    fullName: 'GIFT Nifty',
    icon: Globe,
    color: 'green',
    description:
      'GIFT Nifty is the offshore derivative of NIFTY 50, traded on NSE International Exchange (NSE IX) at GIFT City, Gujarat. Provides 21-hour trading access to global investors.',
    calculation:
      'Derivative contract based on NIFTY 50. Settled in USD. Trading hours: 6:30 AM to 3:40 AM IST (next day). Contract value = NIFTY 50 level × USD/INR rate.',
    importance: [
      'First offshore derivative of Indian indices',
      'Price discovery beyond regular trading hours',
      'Indicator for next day market opening',
      'Global investor access without FPI registration',
      'Reduces dependency on Singapore SGX Nifty',
    ],
    composition:
      'Derivative based on NIFTY 50. Follows same composition as NIFTY 50 but traded in USD at GIFT City.',
    constituents: 50,
    launched: 'July 2023',
    baseYear: 'Based on NIFTY 50',
    keyFacts: [
      'Trades 21 hours a day (except 3:40-6:30 AM)',
      'Settled in US Dollars',
      'Replaced Singapore SGX Nifty',
      'Indicates market sentiment before opening',
    ],
    investorTips: [
      'Watch GIFT Nifty levels before market opens',
      'Useful for pre-market sentiment analysis',
      'Helps in planning intraday strategies',
      'Gap up/down indicated by GIFT vs closing price',
    ],
  },
};

export default function MarketIndexDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1Y');
  const [loading, setLoading] = useState(true);

  const info = INDEX_INFO[id] || null;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
          }/api/market/indices/${id}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          setIndexData(data.data);
          generateHistoricalData(data.data.value, selectedPeriod);
        }
      } catch (error) {
        console.error('Error fetching index data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, selectedPeriod]);

  const generateHistoricalData = (currentValue: number, period: TimePeriod) => {
    const dataPoints: HistoricalData[] = [];
    let days = 0;

    switch (period) {
      case '1D':
        days = 1;
        break;
      case '1W':
        days = 7;
        break;
      case '1M':
        days = 30;
        break;
      case '6M':
        days = 180;
        break;
      case '1Y':
        days = 365;
        break;
      case '3Y':
        days = 1095;
        break;
      case '5Y':
        days = 1825;
        break;
    }

    // Generate mock historical data (replace with real API call)
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomChange = (Math.random() - 0.5) * 0.02; // ±1% daily volatility
      const value = currentValue * (1 - (days - i) * 0.0001 + randomChange * i);

      dataPoints.push({
        date: date.toISOString(),
        value: Math.max(value, currentValue * 0.8), // Floor at 80%
        displayDate: date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          ...(period === '3Y' || period === '5Y' ? { year: '2-digit' } : {}),
        }),
      });
    }

    setHistoricalData(dataPoints);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading index data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!info || !indexData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 mt-2 hidden md:block">
            <BackButton />
          </div>
          <div className="text-center mt-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Index Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The requested market index could not be found.
            </p>
            <Button onClick={() => router.push('/market')}>
              Back to Market Indices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = info.icon;
  const isPositive = indexData.change >= 0;
  const calculateReturn = (period: TimePeriod) => {
    if (historicalData.length < 2) return 0;
    const start = historicalData[0].value;
    const end = historicalData[historicalData.length - 1].value;
    return ((end - start) / start) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 mt-2 hidden md:block">
          <BackButton href="/market" />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${info.color}-500 to-${info.color}-600 flex items-center justify-center shadow-lg`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {info.fullName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {info.launched} • {info.constituents} Constituents
              </p>
            </div>
          </div>

          {/* Current Value Card */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Current Value
                  </p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {indexData.value.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {indexData.change.toFixed(2)} (
                      {indexData.percent_change.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Base Year
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {info.baseYear}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Last Updated
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(indexData.updated_at).toLocaleTimeString(
                        'en-IN'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance Chart
              </CardTitle>
              <CardDescription>
                Historical performance across different time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Period Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(
                  ['1D', '1W', '1M', '6M', '1Y', '3Y', '5Y'] as TimePeriod[]
                ).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPeriod(period);
                      if (indexData) {
                        generateHistoricalData(indexData.value, period);
                      }
                    }}
                    className="min-w-[60px]"
                  >
                    {period}
                  </Button>
                ))}
              </div>

              {/* Returns Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    1 Day Return
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      indexData.percent_change >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {indexData.percent_change >= 0 ? '+' : ''}
                    {indexData.percent_change.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    6 Month Return
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    +{(Math.random() * 10 + 5).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    1 Year Return
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    +{(Math.random() * 20 + 10).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    5 Year Return
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    +{(Math.random() * 50 + 50).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                      domain={['dataMin - 100', 'dataMax + 100']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg shadow-xl p-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {payload[0].payload.displayDate}
                              </p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {(payload[0].value as number).toLocaleString(
                                  'en-IN',
                                  { maximumFractionDigits: 2 }
                                )}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* What is this Index */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  What is {info.fullName}?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {info.description}
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Composition
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {info.composition}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How is it Calculated */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-purple-600" />
                  How is it Calculated?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {info.calculation}
                </p>
                <div className="space-y-2">
                  {info.keyFacts.map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {fact}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Why it's Important */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Why is {info.fullName} Important?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {info.importance.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investor Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                Investor Tips for {info.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {info.investorTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500"
                  >
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
