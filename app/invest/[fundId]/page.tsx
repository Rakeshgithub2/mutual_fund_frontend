'use client';

export const dynamic = 'force-dynamic';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Repeat,
  CreditCard,
  Check,
} from 'lucide-react';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/hooks/use-language';
import { useFund } from '@/lib/hooks/use-funds';
import { getTranslation } from '@/lib/i18n';

export default function InvestPage({
  params,
}: {
  params: Promise<{ fundId: string }>;
}) {
  const { fundId } = use(params);
  const { language, mounted: langMounted } = useLanguage();
  const { fund, loading } = useFund(fundId);
  const [activeTab, setActiveTab] = useState('lumpsum');
  const [amount, setAmount] = useState('');
  const [sipAmount, setSipAmount] = useState('');
  const [sipDate, setSipDate] = useState('');
  const [sipFrequency, setSipFrequency] = useState('MONTHLY');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : `${BASE_URL}/api`
  ).replace(/\/+$/, '');

  const t = (key: string) => getTranslation(language, key);

  const handleInvest = async () => {
    try {
      setInvesting(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('Please login to invest');
        return;
      }

      const investmentData: any = {
        fundId: fundId,
        type: activeTab === 'lumpsum' ? 'LUMPSUM' : 'SIP',
        amount: parseFloat(activeTab === 'lumpsum' ? amount : sipAmount),
        paymentMethod: paymentMethod.toUpperCase(),
      };

      // Add SIP specific data
      if (activeTab === 'sip') {
        investmentData.sipDate = parseInt(sipDate);
        investmentData.sipFrequency = sipFrequency;
      }

      const response = await fetch(`${API_URL}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(investmentData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('accessToken');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create investment');
      }

      const data = await response.json();
      console.log('✅ Investment created:', data);

      // Show success modal
      setShowSuccess(true);

      // Reset form
      setAmount('');
      setSipAmount('');
      setSipDate('');
      setPaymentMethod('');
    } catch (err) {
      console.error('Investment error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to create investment'
      );
    } finally {
      setInvesting(false);
    }
  };

  if (!langMounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fund) return null;

  const calculateReturns = (investAmount: number, months: number = 12) => {
    const expectedReturn = fund.returns1Y / 100;
    return (investAmount * expectedReturn).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSuccess(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Investment Successful!
              </h2>
              <p className="text-muted mb-4">
                Your {activeTab === 'sip' ? 'SIP' : 'investment'} of ₹
                {amount || sipAmount} in {fund.name} has been processed
                successfully! Check your email for confirmation.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => setShowSuccess(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Done
                </Button>
                <Link href="/portfolio" className="flex-1">
                  <Button className="w-full">View Portfolio</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6 mt-2 hidden md:block">
          <BackButton />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Fund Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">{fund.name}</CardTitle>
                <CardDescription>{fund.fundHouse}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Current NAV</p>
                    <p className="text-xl font-bold text-foreground">
                      ₹{fund.nav.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">1Y Returns</p>
                    <p
                      className={`text-xl font-bold ${
                        fund.returns1Y >= 0 ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {fund.returns1Y >= 0 ? '+' : ''}
                      {fund.returns1Y.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Risk Level</p>
                    <p className="font-medium text-foreground">
                      {fund.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Rating</p>
                    <p className="font-medium text-foreground">
                      ⭐ {fund.rating}/5
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-2">
                    Why invest in this fund?
                  </h4>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Consistent {fund.returns3Y.toFixed(1)}% returns over 3
                        years
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Low expense ratio of {fund.expenseRatio.toFixed(2)}%
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        High AUM of ₹{(fund.aum / 1000).toFixed(1)}K Cr
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Start Your Investment
                </CardTitle>
                <CardDescription>
                  Choose your investment type and enter details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="lumpsum"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      One-Time (Lumpsum)
                    </TabsTrigger>
                    <TabsTrigger
                      value="sip"
                      className="flex items-center gap-2"
                    >
                      <Repeat className="w-4 h-4" />
                      SIP (Systematic)
                    </TabsTrigger>
                  </TabsList>

                  {/* Lumpsum Investment */}
                  <TabsContent value="lumpsum" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Investment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            ₹
                          </span>
                          <Input
                            type="number"
                            placeholder="5000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-8 text-lg h-12"
                            min="500"
                          />
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Minimum investment: ₹500
                        </p>
                      </div>

                      {amount && parseFloat(amount) >= 500 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                        >
                          <p className="text-sm font-medium text-foreground mb-2">
                            Estimated Returns (1 Year)
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted">Investment</p>
                              <p className="text-lg font-bold text-foreground">
                                ₹{parseFloat(amount).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted">Est. Returns</p>
                              <p className="text-lg font-bold text-success">
                                +₹
                                {parseFloat(
                                  calculateReturns(parseFloat(amount))
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted mt-2">
                            *Based on historical 1Y returns of{' '}
                            {fund.returns1Y.toFixed(2)}%. Past performance
                            doesn't guarantee future results.
                          </p>
                        </motion.div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Payment Method
                        </label>
                        <Select
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upi">
                              UPI (GPay, PhonePe, Paytm)
                            </SelectItem>
                            <SelectItem value="netbanking">
                              Net Banking
                            </SelectItem>
                            <SelectItem value="debit">Debit Card</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <Button
                        onClick={handleInvest}
                        disabled={
                          !amount ||
                          parseFloat(amount) < 500 ||
                          !paymentMethod ||
                          investing
                        }
                        className="w-full h-12 text-base"
                        size="lg"
                      >
                        {investing
                          ? 'Processing...'
                          : `Proceed to Pay ₹${amount || '0'}`}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* SIP Investment */}
                  <TabsContent value="sip" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Monthly SIP Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            ₹
                          </span>
                          <Input
                            type="number"
                            placeholder="1000"
                            value={sipAmount}
                            onChange={(e) => setSipAmount(e.target.value)}
                            className="pl-8 text-lg h-12"
                            min="500"
                          />
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Minimum SIP: ₹500/month
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            SIP Date
                          </label>
                          <Select value={sipDate} onValueChange={setSipDate}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 5, 10, 15, 20, 25].map((date) => (
                                <SelectItem key={date} value={date.toString()}>
                                  {date}th of every month
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            <Repeat className="w-4 h-4 inline mr-1" />
                            Frequency
                          </label>
                          <Select
                            value={sipFrequency}
                            onValueChange={setSipFrequency}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                              <SelectItem value="QUARTERLY">
                                Quarterly
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {sipAmount && parseFloat(sipAmount) >= 500 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-accent/10 border border-accent/20 rounded-lg p-4"
                        >
                          <p className="text-sm font-medium text-foreground mb-2">
                            SIP Projection (12 Months)
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted">Total Investment</p>
                              <p className="text-lg font-bold text-foreground">
                                ₹{(parseFloat(sipAmount) * 12).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted">Est. Returns</p>
                              <p className="text-lg font-bold text-success">
                                +₹
                                {parseFloat(
                                  calculateReturns(parseFloat(sipAmount) * 12)
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted">Est. Value</p>
                              <p className="text-lg font-bold text-primary">
                                ₹
                                {(
                                  parseFloat(sipAmount) * 12 +
                                  parseFloat(
                                    calculateReturns(parseFloat(sipAmount) * 12)
                                  )
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Payment Method
                        </label>
                        <Select
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="autopay">
                              Auto-Pay (Mandate)
                            </SelectItem>
                            <SelectItem value="upi">UPI Auto-Debit</SelectItem>
                            <SelectItem value="netbanking">
                              Net Banking
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted mt-1">
                          Auto-pay setup required for recurring SIP
                        </p>
                      </div>

                      {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <Button
                        onClick={handleInvest}
                        disabled={
                          !sipAmount ||
                          parseFloat(sipAmount) < 500 ||
                          !sipDate ||
                          !paymentMethod ||
                          investing
                        }
                        className="w-full h-12 text-base"
                        size="lg"
                      >
                        {investing
                          ? 'Processing...'
                          : `Start SIP of ₹${sipAmount || '0'}/month`}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted text-center">
                    🔒 Secure payment powered by Razorpay • All transactions are
                    encrypted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
