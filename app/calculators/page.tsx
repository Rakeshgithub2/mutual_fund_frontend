'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  TrendingUp,
  Target,
  StepForward,
  Briefcase,
  DollarSign,
  PiggyBank,
  Zap,
  ArrowUpCircle,
} from 'lucide-react';
import { InfoButton } from '@/components/info-button';

// Financial terms definitions
const financialTerms = {
  sip: {
    term: 'SIP (Systematic Investment Plan)',
    definition:
      'SIP is a method of investing a fixed amount regularly (monthly, quarterly) in mutual funds. Instead of investing a large amount at once, you invest small amounts consistently over time, similar to a recurring deposit but in mutual funds.',
    importance:
      'SIP helps build wealth through disciplined investing and rupee cost averaging. It removes the need to time the market perfectly and makes investing accessible to everyone, starting from as low as ₹500 per month. It leverages the power of compounding to generate long-term wealth.',
    futureUsage:
      "SIPs are ideal for long-term financial goals like retirement planning (20-30 years), children's education (10-15 years), buying a house (7-10 years), or building an emergency corpus. The longer you stay invested, the more powerful compounding becomes.",
    pros: [
      'Rupee cost averaging reduces impact of market volatility',
      'Disciplined investing builds consistent saving habit',
    ],
    cons: [
      'Returns not guaranteed and subject to market risk',
      'Requires patience - works best for 5+ year horizons',
    ],
  },
  lumpsum: {
    term: 'Lumpsum Investment',
    definition:
      'Lumpsum investment means investing a large amount of money in one go into mutual funds or other investment vehicles. This is typically done when you have a significant amount like bonus, inheritance, or sale proceeds available for investment.',
    importance:
      "Lumpsum investing allows your entire capital to start working immediately, potentially generating returns from day one. It's particularly effective during market corrections or when you have high conviction about market direction. Can generate higher returns than SIP if market timing is favorable.",
    futureUsage:
      'Best suited when you receive windfall gains (inheritance, bonus, property sale) or during market crashes when valuations are attractive. Also ideal if you have accumulated cash and want to deploy it strategically rather than keeping it idle.',
    pros: [
      'Entire amount starts compounding immediately',
      'Lower transaction costs compared to multiple SIP installments',
    ],
    cons: [
      'Requires large capital upfront',
      'Higher risk if market corrects immediately after investment',
    ],
  },
  expectedReturn: {
    term: 'Expected Return',
    definition:
      'Expected return is the anticipated annual percentage growth on your investment, based on historical fund performance, market conditions, and asset class. For equity funds, typical range is 10-15% p.a., debt funds 6-8% p.a., and hybrid funds 8-12% p.a.',
    importance:
      "Setting realistic return expectations is crucial for financial planning. Overestimating returns can lead to inadequate savings, while underestimating may result in excessive contributions. Expected return directly impacts how much wealth you'll accumulate over time.",
    futureUsage:
      'Use expected returns to calculate future value of investments, determine required monthly SIP amounts for goals, and compare different investment options. Adjust expectations based on your risk profile - conservative (7-9%), moderate (9-12%), aggressive (12-15%).',
    pros: [
      'Helps in realistic financial goal planning',
      'Enables comparison between investment options',
    ],
    cons: [
      "Past returns don't guarantee future performance",
      'Actual returns may vary significantly from expectations',
    ],
  },
  timePeriod: {
    term: 'Investment Time Period',
    definition:
      'Time period refers to the duration for which you plan to stay invested, typically measured in years. This is the period between starting your investment and when you need to withdraw the money for your goal.',
    importance:
      'Time is the most powerful factor in wealth creation due to compounding. Longer investment horizons allow you to take more equity exposure (higher risk, higher returns), ride out market volatility, and benefit from multiple market cycles. Even small monthly investments can grow substantially over 20-30 years.',
    futureUsage:
      'Match your investment time period with your financial goals: Short-term goals (<3 years) - debt funds, Medium-term (3-7 years) - hybrid funds, Long-term (>7 years) - equity funds. Longer time periods justify higher equity allocation and SIP investments.',
    pros: [
      'Longer periods reduce per-year volatility impact',
      'Compounding effect multiplies wealth exponentially',
    ],
    cons: [
      'Money remains locked for extended duration',
      'Early withdrawal may incur exit loads and tax implications',
    ],
  },
  goalPlanning: {
    term: 'Goal-Based Planning',
    definition:
      "Goal-based planning involves identifying specific financial objectives (buying home, child's education, retirement) and creating a targeted investment strategy for each goal with defined timeline and required corpus.",
    importance:
      "Having clear goals provides direction and motivation for consistent investing. It helps determine how much to invest, where to invest, and for how long. Goal-based approach ensures you're not investing blindly but working towards concrete life milestones.",
    futureUsage:
      "Create separate investment portfolios for each major life goal. For example: Retirement corpus goal - 30 year SIP in equity funds, Child's education - 15 year SIP in balanced funds, Emergency fund - 1 year expenses in liquid funds. Review goals annually and adjust investments.",
    pros: [
      'Provides clarity and purpose to investments',
      'Helps prioritize multiple financial needs',
    ],
    cons: [
      'Requires disciplined tracking and periodic reviews',
      'May need to adjust plans if circumstances change',
    ],
  },
  stepUpSIP: {
    term: 'Step-Up SIP',
    definition:
      'Step-Up SIP allows you to increase your SIP amount periodically (annually or semi-annually) by a fixed percentage (typically 5-15%). For example, if you start with ₹5,000/month and increase by 10% annually, it becomes ₹5,500 in year 2, ₹6,050 in year 3, and so on.',
    importance:
      'As your income grows with promotions and increments, your investments should also increase proportionally. Step-Up SIP ensures your investment pace matches your income growth, helping you build significantly larger corpus without feeling the pinch of higher contributions.',
    futureUsage:
      'Ideal for salaried professionals expecting regular salary hikes. Start with a comfortable amount and set 10% annual step-up. This strategy can increase your final corpus by 30-50% compared to regular SIP over 20-25 years, making it highly effective for retirement planning.',
    pros: [
      'Significantly boosts wealth accumulation over time',
      'Aligns investments with income growth automatically',
    ],
    cons: [
      'Higher future commitments may strain cash flow during job loss',
      'Not suitable if income growth is uncertain',
    ],
  },
  retirement: {
    term: 'Retirement Planning',
    definition:
      "Retirement planning is the process of determining retirement income goals and creating an investment strategy to achieve them. It involves calculating how much corpus you'll need to maintain your lifestyle post-retirement (typically 60-65 years) when regular income stops.",
    importance:
      'With increasing life expectancy (75-80 years), you may live 20-25 years post-retirement. Without adequate planning, you risk outliving your savings or compromising lifestyle. Starting early gives you the advantage of longer compounding and smaller monthly commitments.',
    futureUsage:
      'Calculate required retirement corpus using rule of thumb: 25-30 times your annual expenses. For ₹50,000/month expenses (₹6L/year), you need ₹1.5-1.8 Cr corpus. Start SIP early (age 25-30) to build this corpus comfortably with equity funds. Post-retirement, shift to debt funds for stable income.',
    pros: [
      'Ensures financial independence in old age',
      'Early planning reduces monthly investment burden',
    ],
    cons: [
      'Requires very long investment horizon (30-40 years)',
      'Inflation can erode purchasing power of corpus',
    ],
  },
};

export default function CalculatorsPage() {
  const [sipResult, setSipResult] = useState<any>(null);
  const [lumpsumResult, setLumpsumResult] = useState<any>(null);
  const [goalResult, setGoalResult] = useState<any>(null);
  const [stepUpResult, setStepUpResult] = useState<any>(null);
  const [retirementResult, setRetirementResult] = useState<any>(null);

  // Suppress hydration warnings caused by browser extensions
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Extra attributes from the server')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const calculateSIP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${BASE_URL}/api/calculator/sip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monthlyInvestment: formData.get('monthlyInvestment'),
        expectedReturn: formData.get('expectedReturn'),
        timePeriod: formData.get('timePeriod'),
      }),
    });

    const data = await response.json();
    if (data.data) setSipResult(data.data);
  };

  const calculateLumpsum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${BASE_URL}/api/calculator/lumpsum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        investment: formData.get('investment'),
        expectedReturn: formData.get('expectedReturn'),
        timePeriod: formData.get('timePeriod'),
      }),
    });

    const data = await response.json();
    if (data.data) setLumpsumResult(data.data);
  };

  const calculateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${BASE_URL}/api/calculator/goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetAmount: formData.get('targetAmount'),
        timePeriod: formData.get('timePeriod'),
        expectedReturn: formData.get('expectedReturn'),
        currentSavings: formData.get('currentSavings') || 0,
        goalName: formData.get('goalName'),
      }),
    });

    const data = await response.json();
    if (data.data) setGoalResult(data.data);
  };

  const calculateStepUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${BASE_URL}/api/calculator/step-up-sip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initialSIP: formData.get('initialSIP'),
        stepUpPercentage: formData.get('stepUpPercentage'),
        expectedReturn: formData.get('expectedReturn'),
        timePeriod: formData.get('timePeriod'),
      }),
    });

    const data = await response.json();
    if (data.data) setStepUpResult(data.data);
  };

  const calculateRetirement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${BASE_URL}/api/calculator/retirement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentAge: formData.get('currentAge'),
        retirementAge: formData.get('retirementAge'),
        currentSavings: formData.get('currentSavings') || 0,
        monthlyExpense: formData.get('monthlyExpense'),
        expectedReturn: formData.get('expectedReturn') || 12,
        inflationRate: formData.get('inflationRate') || 6,
      }),
    });

    const data = await response.json();
    if (data.data) setRetirementResult(data.data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Enhanced Header with Calculator Cards */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Investment Calculators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Plan your financial future with our advanced calculators.
              Calculate returns, plan goals, and build wealth systematically.
            </p>
          </div>

          {/* Quick Calculator Cards - Groww Style */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              {
                icon: TrendingUp,
                label: 'SIP Calculator',
                value: 'sip',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: PiggyBank,
                label: 'Lumpsum',
                value: 'lumpsum',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Target,
                label: 'Goal Planning',
                value: 'goal',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Zap,
                label: 'Step-up SIP',
                value: 'stepup',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Briefcase,
                label: 'Retirement',
                value: 'retirement',
                color: 'from-indigo-500 to-purple-500',
              },
            ].map((calc, index) => (
              <button
                key={calc.value}
                onClick={() => {
                  const element = document.querySelector(
                    `[value="${calc.value}"]`
                  ) as HTMLElement;
                  element?.click();
                }}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}
                >
                  <calc.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {calc.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="sip" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <TabsTrigger
              value="sip"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-bold"
            >
              SIP
            </TabsTrigger>
            <TabsTrigger
              value="lumpsum"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-bold"
            >
              Lumpsum
            </TabsTrigger>
            <TabsTrigger
              value="goal"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-bold"
            >
              Goal Planning
            </TabsTrigger>
            <TabsTrigger
              value="stepup"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-bold"
            >
              Step-up SIP
            </TabsTrigger>
            <TabsTrigger
              value="retirement"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-bold"
            >
              Retirement
            </TabsTrigger>
          </TabsList>

          {/* SIP Calculator */}
          <TabsContent value="sip">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-b-2 border-blue-100 dark:border-blue-900">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    SIP Calculator
                    <InfoButton {...financialTerms.sip} />
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    Calculate returns on your Systematic Investment Plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={calculateSIP} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="monthlyInvestment"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Monthly Investment (₹)
                      </Label>
                      <Input
                        id="monthlyInvestment"
                        name="monthlyInvestment"
                        type="number"
                        placeholder="5000"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="expectedReturn"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                      >
                        Expected Return (% p.a.)
                        <InfoButton {...financialTerms.expectedReturn} />
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="timePeriod"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center"
                      >
                        Time Period (years)
                        <InfoButton {...financialTerms.timePeriod} />
                      </Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="10"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all"
                    >
                      Calculate SIP Returns
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {sipResult && (
                <div className="space-y-6">
                  <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                    <CardHeader className="border-b-2 border-green-200 dark:border-green-800">
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        SIP Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Monthly Investment:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {formatCurrency(sipResult.monthlyInvestment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Time Period:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {sipResult.timePeriod} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Expected Return:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {sipResult.expectedReturn}% p.a.
                        </span>
                      </div>
                      <hr className="my-4 border-2 border-green-200 dark:border-green-800" />
                      <div className="flex justify-between items-center p-4 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Total Investment:
                        </span>
                        <span className="font-extrabold text-2xl text-blue-700 dark:text-blue-400">
                          {formatCurrency(sipResult.totalInvestment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-green-100 dark:bg-green-900/40 rounded-xl">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Estimated Returns:
                        </span>
                        <span className="font-extrabold text-2xl text-green-700 dark:text-green-400">
                          {formatCurrency(sipResult.estimatedReturns)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl border-2 border-purple-300 dark:border-purple-700 shadow-lg">
                        <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
                          Future Value:
                        </span>
                        <span className="font-extrabold text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatCurrency(sipResult.futureValue)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pros and Cons Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Pros */}
                    <Card className="shadow-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <span className="text-2xl">✅</span> SIP Advantages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Rupee Cost Averaging:</strong> Buy more
                              units when prices are low, fewer when high
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Disciplined Investing:</strong> Automates
                              savings and builds wealth habit
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Power of Compounding:</strong> Returns
                              generate returns over long term
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Flexible Amounts:</strong> Start with as
                              low as ₹500/month
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Tax Benefits:</strong> ELSS SIPs offer
                              deduction under Section 80C
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Cons */}
                    <Card className="shadow-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                          <span className="text-2xl">⚠️</span> Considerations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Market Risk:</strong> Returns not
                              guaranteed, subject to market volatility
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Long-term Commitment:</strong> Requires
                              patience, minimum 5-7 years recommended
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Exit Load:</strong> Early withdrawal may
                              incur charges (1-2%)
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Fund Selection:</strong> Wrong fund choice
                              can underperform expectations
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Missed Opportunities:</strong> May miss
                              lump sum gains in bull markets
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expert Advice */}
                  <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Expert Tips for SIP
                        Success
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                        <p className="leading-relaxed">
                          <strong>1. Start Early:</strong> Time is your biggest
                          ally. Starting at 25 vs 35 can double your wealth.
                        </p>
                        <p className="leading-relaxed">
                          <strong>2. Increase Annually:</strong> Step-up your
                          SIP by 10-15% yearly as income grows.
                        </p>
                        <p className="leading-relaxed">
                          <strong>3. Stay Invested:</strong> Don't stop SIP
                          during market downturns - that's when you buy more
                          units cheap.
                        </p>
                        <p className="leading-relaxed">
                          <strong>4. Diversify:</strong> Spread SIPs across
                          large-cap, mid-cap, and flexi-cap funds.
                        </p>
                        <p className="leading-relaxed">
                          <strong>5. Review Quarterly:</strong> Check fund
                          performance every 3 months, but don't exit based on
                          short-term dips.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Lumpsum Calculator */}
          <TabsContent value="lumpsum">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-b-2 border-green-100 dark:border-green-900">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Lumpsum Calculator
                    <InfoButton {...financialTerms.lumpsum} />
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    Calculate returns on one-time investment
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={calculateLumpsum} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="investment"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Investment Amount (₹)
                      </Label>
                      <Input
                        id="investment"
                        name="investment"
                        type="number"
                        placeholder="100000"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="expectedReturn"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Expected Return (% p.a.)
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="timePeriod"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Time Period (years)
                      </Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="5"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all"
                    >
                      Calculate Lumpsum Returns
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {lumpsumResult && (
                <Card className="shadow-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
                  <CardHeader className="border-b-2 border-emerald-200 dark:border-emerald-800">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      Lumpsum Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Investment:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {formatCurrency(lumpsumResult.investment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Time Period:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {lumpsumResult.timePeriod} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Expected Return:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {lumpsumResult.expectedReturn}% p.a.
                      </span>
                    </div>
                    <hr className="my-4 border-2 border-emerald-200 dark:border-emerald-800" />
                    <div className="flex justify-between items-center p-4 bg-green-100 dark:bg-green-900/40 rounded-xl">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        Estimated Returns:
                      </span>
                      <span className="font-extrabold text-2xl text-green-700 dark:text-green-400">
                        {formatCurrency(lumpsumResult.estimatedReturns)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
                      <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
                        Future Value:
                      </span>
                      <span className="font-extrabold text-4xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(lumpsumResult.futureValue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Goal Planning Calculator */}
          <TabsContent value="goal">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Planning Calculator</CardTitle>
                  <CardDescription>
                    Calculate monthly SIP needed for your financial goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateGoal} className="space-y-4">
                    <div>
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        name="goalName"
                        placeholder="House Down Payment"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                      <Input
                        id="targetAmount"
                        name="targetAmount"
                        type="number"
                        placeholder="2000000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentSavings">
                        Current Savings (₹)
                      </Label>
                      <Input
                        id="currentSavings"
                        name="currentSavings"
                        type="number"
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timePeriod">Time Period (years)</Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedReturn">
                        Expected Return (% p.a.)
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Calculate Goal SIP
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {goalResult && (
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardHeader>
                    <CardTitle>Goal Planning Results</CardTitle>
                    {goalResult.goalName && (
                      <CardDescription>{goalResult.goalName}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Target Amount:</span>
                      <span className="font-bold">
                        {formatCurrency(goalResult.targetAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Current Savings:</span>
                      <span className="font-bold">
                        {formatCurrency(goalResult.currentSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Time Period:</span>
                      <span className="font-bold">
                        {goalResult.timePeriod} years
                      </span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between border-2 border-primary rounded-lg p-3 bg-white dark:bg-gray-900">
                      <span className="font-bold text-lg">
                        Required Monthly SIP:
                      </span>
                      <span className="font-bold text-2xl text-primary">
                        {formatCurrency(goalResult.requiredMonthlySIP)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                      <p>
                        💡 Current savings will grow to{' '}
                        {formatCurrency(
                          goalResult.breakdown?.currentSavingsGrowth
                        )}
                      </p>
                      <p>
                        💡 Your SIP contribution:{' '}
                        {formatCurrency(goalResult.breakdown?.sipContribution)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Step-up SIP Calculator */}
          <TabsContent value="stepup">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step-up SIP Calculator</CardTitle>
                  <CardDescription>
                    Calculate SIP with annual increment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateStepUp} className="space-y-4">
                    <div>
                      <Label htmlFor="initialSIP">
                        Initial Monthly SIP (₹)
                      </Label>
                      <Input
                        id="initialSIP"
                        name="initialSIP"
                        type="number"
                        placeholder="5000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stepUpPercentage">
                        Annual Step-up (%)
                      </Label>
                      <Input
                        id="stepUpPercentage"
                        name="stepUpPercentage"
                        type="number"
                        step="0.1"
                        placeholder="10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedReturn">
                        Expected Return (% p.a.)
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="timePeriod">Time Period (years)</Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="10"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Calculate Step-up SIP
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {stepUpResult && (
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                  <CardHeader>
                    <CardTitle>Step-up SIP Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Initial SIP:</span>
                      <span className="font-bold">
                        {formatCurrency(stepUpResult.initialSIP)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Final SIP:</span>
                      <span className="font-bold">
                        {formatCurrency(stepUpResult.finalMonthlySIP)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Step-up Rate:</span>
                      <span className="font-bold">
                        {stepUpResult.stepUpPercentage}% p.a.
                      </span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <span className="font-medium">Total Investment:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(stepUpResult.totalInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated Returns:</span>
                      <span className="font-bold text-lg text-green-600">
                        {formatCurrency(stepUpResult.estimatedReturns)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="font-bold text-lg">Future Value:</span>
                      <span className="font-bold text-2xl text-primary">
                        {formatCurrency(stepUpResult.futureValue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Retirement Calculator */}
          <TabsContent value="retirement">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Calculator</CardTitle>
                  <CardDescription>Plan your retirement corpus</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateRetirement} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentAge">Current Age</Label>
                        <Input
                          id="currentAge"
                          name="currentAge"
                          type="number"
                          placeholder="30"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="retirementAge">Retirement Age</Label>
                        <Input
                          id="retirementAge"
                          name="retirementAge"
                          type="number"
                          placeholder="60"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="monthlyExpense">
                        Current Monthly Expense (₹)
                      </Label>
                      <Input
                        id="monthlyExpense"
                        name="monthlyExpense"
                        type="number"
                        placeholder="40000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentSavings">
                        Current Retirement Savings (₹)
                      </Label>
                      <Input
                        id="currentSavings"
                        name="currentSavings"
                        type="number"
                        placeholder="500000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expectedReturn">
                          Expected Return (%)
                        </Label>
                        <Input
                          id="expectedReturn"
                          name="expectedReturn"
                          type="number"
                          step="0.1"
                          placeholder="12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inflationRate">
                          Inflation Rate (%)
                        </Label>
                        <Input
                          id="inflationRate"
                          name="inflationRate"
                          type="number"
                          step="0.1"
                          placeholder="6"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Calculate Retirement Plan
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {retirementResult && (
                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
                  <CardHeader>
                    <CardTitle>Retirement Plan Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Years to Retirement:</span>
                      <span className="font-bold">
                        {retirementResult.yearsToRetirement} years
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        Current Monthly Expense:
                      </span>
                      <span className="font-bold">
                        {formatCurrency(retirementResult.currentMonthlyExpense)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        Future Monthly Expense:
                      </span>
                      <span className="font-bold text-orange-600">
                        {formatCurrency(retirementResult.futureMonthlyExpense)}
                      </span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <span className="font-medium">Corpus Needed:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(retirementResult.corpusNeeded)}
                      </span>
                    </div>
                    <div className="flex justify-between border-2 border-primary rounded-lg p-3 bg-white dark:bg-gray-900">
                      <span className="font-bold text-lg">
                        Required Monthly SIP:
                      </span>
                      <span className="font-bold text-2xl text-primary">
                        {formatCurrency(retirementResult.requiredMonthlySIP)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                      <p>
                        💡 Current savings will grow to{' '}
                        {formatCurrency(
                          retirementResult.breakdown?.currentSavingsGrowth
                        )}
                      </p>
                      <p>💡 Assumes 6% withdrawal rate in retirement</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
