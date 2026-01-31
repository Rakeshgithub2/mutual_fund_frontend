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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Receipt,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';

export default function ReportsPage() {
  const { language, mounted } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedQuarter, setSelectedQuarter] = useState('all');

  const t = (key: string) => getTranslation(language, key);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDownloadPDF = (reportType: string) => {
    // Mock download functionality
    console.log(
      `Downloading ${reportType} as PDF for ${selectedYear}-${selectedQuarter}`
    );
  };

  const handleDownloadExcel = (reportType: string) => {
    // Mock download functionality
    console.log(
      `Downloading ${reportType} as Excel for ${selectedYear}-${selectedQuarter}`
    );
  };

  const reportTypes = [
    {
      id: 'investment-summary',
      title: 'Investment Summary',
      description: 'Comprehensive overview of all investments',
      icon: PieChart,
      color: 'text-primary',
    },
    {
      id: 'capital-gains',
      title: 'Capital Gains Report',
      description: 'Realized and unrealized gains/losses',
      icon: TrendingUp,
      color: 'text-success',
    },
    {
      id: 'tax-report',
      title: 'Tax Computation Report',
      description: 'Calculate taxable income and deductions',
      icon: Receipt,
      color: 'text-accent',
    },
    {
      id: 'transaction-history',
      title: 'Transaction History',
      description: 'Detailed record of all transactions',
      icon: FileText,
      color: 'text-foreground',
    },
    {
      id: 'portfolio-performance',
      title: 'Portfolio Performance',
      description: 'Historical performance analysis',
      icon: BarChart3,
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8" />
            Reports & Documents
          </h1>
          <p className="text-muted">
            Download detailed reports for your investments and tax filing
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <DollarSign className="w-4 h-4" />
                  Total Invested
                </div>
                <p className="text-2xl font-bold text-foreground">₹12,45,000</p>
                <p className="text-xs text-success">+8.2% this year</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Capital Gains
                </div>
                <p className="text-2xl font-bold text-success">₹1,85,420</p>
                <p className="text-xs text-muted">14.9% returns</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <Receipt className="w-4 h-4" />
                  Taxable Amount
                </div>
                <p className="text-2xl font-bold text-accent">₹92,710</p>
                <p className="text-xs text-muted">After LTCG exemption</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <FileText className="w-4 h-4" />
                  Total Transactions
                </div>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted">This financial year</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="year">Financial Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">FY 2025-26</SelectItem>
                    <SelectItem value="2024">FY 2024-25</SelectItem>
                    <SelectItem value="2023">FY 2023-24</SelectItem>
                    <SelectItem value="2022">FY 2022-23</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="quarter">Quarter</Label>
                <Select
                  value={selectedQuarter}
                  onValueChange={setSelectedQuarter}
                >
                  <SelectTrigger id="quarter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quarters</SelectItem>
                    <SelectItem value="q1">Q1 (Apr-Jun)</SelectItem>
                    <SelectItem value="q2">Q2 (Jul-Sep)</SelectItem>
                    <SelectItem value="q3">Q3 (Oct-Dec)</SelectItem>
                    <SelectItem value="q4">Q4 (Jan-Mar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Custom Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-foreground">
            Available Reports
          </h2>

          <div className="grid gap-4">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`p-3 rounded-lg bg-primary/10 ${report.color}`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg mb-1">
                              {report.title}
                            </h3>
                            <p className="text-sm text-muted mb-4">
                              {report.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Period: {selectedYear}{' '}
                                {selectedQuarter !== 'all'
                                  ? `- ${selectedQuarter.toUpperCase()}`
                                  : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleDownloadPDF(report.id)}
                          >
                            <FileText className="w-4 h-4 text-danger" />
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleDownloadExcel(report.id)}
                          >
                            <FileSpreadsheet className="w-4 h-4 text-success" />
                            Excel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tax Summary Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Tax Summary FY 2025-26
            </CardTitle>
            <CardDescription>
              Overview of your tax liability for this financial year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted mb-1">
                    Short Term Capital Gains (STCG)
                  </p>
                  <p className="text-2xl font-bold text-foreground">₹45,230</p>
                  <p className="text-xs text-muted mt-1">Taxable at 15%</p>
                </div>

                <div>
                  <p className="text-sm text-muted mb-1">
                    Long Term Capital Gains (LTCG)
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹1,40,190
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Taxable at 10% (above ₹1 lakh exemption)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted mb-1">
                    Estimated Tax Liability
                  </p>
                  <p className="text-2xl font-bold text-accent">₹10,803</p>
                  <p className="text-xs text-muted mt-1">
                    ₹6,785 (STCG) + ₹4,019 (LTCG)
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted mb-1">
                    Section 80C Eligible
                  </p>
                  <p className="text-2xl font-bold text-success">₹95,000</p>
                  <p className="text-xs text-muted mt-1">
                    ELSS investments for deduction
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">
                    Download complete tax computation worksheet
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Includes all calculations and Form 16 ready format
                  </p>
                </div>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Tax Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Downloads */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Downloads</CardTitle>
            <CardDescription>Your recently generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  name: 'Capital Gains Report - Q2 2025',
                  date: '2025-11-02',
                  type: 'PDF',
                  size: '245 KB',
                },
                {
                  name: 'Transaction History - Oct 2025',
                  date: '2025-11-01',
                  type: 'Excel',
                  size: '156 KB',
                },
                {
                  name: 'Portfolio Performance - FY 2024-25',
                  date: '2025-10-28',
                  type: 'PDF',
                  size: '532 KB',
                },
              ].map((download, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {download.type === 'PDF' ? (
                      <FileText className="w-5 h-5 text-danger" />
                    ) : (
                      <FileSpreadsheet className="w-5 h-5 text-success" />
                    )}
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {download.name}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(download.date).toLocaleDateString()} •{' '}
                        {download.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
