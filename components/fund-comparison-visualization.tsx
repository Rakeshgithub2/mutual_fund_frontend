'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Layers,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface CommonHolding {
  ticker: string;
  name: string;
  weightA: number;
  weightB: number;
  minWeight: number;
}

interface HoldingsOverlap {
  jaccard: number;
  weightedOverlap: number;
  commonHoldings: CommonHolding[];
  uniqueToFundA: number;
  uniqueToFundB: number;
  totalHoldingsA: number;
  totalHoldingsB: number;
}

interface CommonSector {
  sector: string;
  weightA: number;
  weightB: number;
  difference: number;
}

interface SectorOverlap {
  cosineSimilarity: number;
  percentOverlap: number;
  commonSectors: CommonSector[];
}

interface ReturnsCorrelation {
  period: string;
  correlation: number | null;
  dataPoints: number;
  startDate: Date | null;
  endDate: Date | null;
  error?: string;
}

interface Fund {
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  currentNav: number;
  aum: number;
  expenseRatio: number;
}

interface ComparisonData {
  funds: Fund[];
  holdingsOverlap: HoldingsOverlap | null;
  sectorOverlap: SectorOverlap | null;
  returnsCorrelation: ReturnsCorrelation | null;
}

interface FundComparisonVisualizationProps {
  data: ComparisonData;
}

export function FundComparisonVisualization({
  data,
}: FundComparisonVisualizationProps) {
  const { funds, holdingsOverlap, sectorOverlap, returnsCorrelation } = data;

  if (funds.length < 2) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            Please select at least 2 funds to compare
          </p>
        </CardContent>
      </Card>
    );
  }

  const fundA = funds[0];
  const fundB = funds[1];

  // Calculate overlap severity
  const getOverlapSeverity = (jaccard: number) => {
    if (jaccard > 0.7) return { level: 'high', color: 'destructive' };
    if (jaccard > 0.4) return { level: 'medium', color: 'warning' };
    return { level: 'low', color: 'success' };
  };

  const getCorrelationLabel = (correlation: number | null) => {
    if (correlation === null) return 'N/A';
    if (correlation > 0.8) return 'Very High';
    if (correlation > 0.6) return 'High';
    if (correlation > 0.4) return 'Moderate';
    if (correlation > 0.2) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="space-y-6">
      {/* Fund Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {funds.slice(0, 2).map((fund, idx) => (
          <Card key={fund.fundId}>
            <CardHeader>
              <CardTitle className="text-lg">{fund.name}</CardTitle>
              <CardDescription>{fund.fundHouse}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="outline">{fund.category}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current NAV:</span>
                <span className="font-medium">
                  ₹{fund.currentNav.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AUM:</span>
                <span className="font-medium">
                  ₹{(fund.aum / 100).toFixed(0)} Cr
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expense Ratio:</span>
                <span className="font-medium">
                  {fund.expenseRatio?.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Holdings Overlap - Venn Diagram Representation */}
      {holdingsOverlap && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Holdings Overlap Analysis
                </CardTitle>
                <CardDescription>
                  Jaccard Index & Weighted Overlap of top{' '}
                  {holdingsOverlap.totalHoldingsA} holdings
                </CardDescription>
              </div>
              <Badge
                variant={
                  getOverlapSeverity(holdingsOverlap.jaccard).level === 'high'
                    ? 'destructive'
                    : getOverlapSeverity(holdingsOverlap.jaccard).level ===
                      'medium'
                    ? 'default'
                    : 'secondary'
                }
              >
                {(holdingsOverlap.jaccard * 100).toFixed(1)}% Jaccard
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Venn Diagram Counts */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {holdingsOverlap.uniqueToFundA}
                </div>
                <div className="text-sm text-muted-foreground">
                  Unique to {fundA.name.split(' ')[0]}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">
                  {holdingsOverlap.commonHoldings.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Common Holdings
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {holdingsOverlap.uniqueToFundB}
                </div>
                <div className="text-sm text-muted-foreground">
                  Unique to {fundB.name.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Overlap Metrics */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">
                    Jaccard Index (Similarity):
                  </span>
                  <span className="font-medium">
                    {(holdingsOverlap.jaccard * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={holdingsOverlap.jaccard * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">
                    Weighted Overlap:
                  </span>
                  <span className="font-medium">
                    {holdingsOverlap.weightedOverlap.toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={holdingsOverlap.weightedOverlap}
                  className="h-2"
                />
              </div>
            </div>

            {/* Top 10 Common Holdings */}
            {holdingsOverlap.commonHoldings.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Top {Math.min(10, holdingsOverlap.commonHoldings.length)}{' '}
                  Common Holdings
                </h4>
                <div className="space-y-2">
                  {holdingsOverlap.commonHoldings
                    .slice(0, 10)
                    .map((holding, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {holding.name}
                          </div>
                          {holding.ticker && (
                            <div className="text-xs text-muted-foreground">
                              {holding.ticker}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-right">
                            <div className="text-blue-600 font-medium">
                              {holding.weightA.toFixed(2)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Fund A
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-600 font-medium">
                              {holding.weightB.toFixed(2)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Fund B
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Overlap Warning */}
            {holdingsOverlap.jaccard > 0.5 && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    High Portfolio Overlap Detected
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    These funds have{' '}
                    {(holdingsOverlap.jaccard * 100).toFixed(0)}% similar
                    holdings. Consider diversifying to reduce concentration
                    risk.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sector Overlap */}
      {sectorOverlap && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sector Allocation Overlap
                </CardTitle>
                <CardDescription>
                  Cosine similarity of sector weights
                </CardDescription>
              </div>
              <Badge variant="outline">
                {(sectorOverlap.cosineSimilarity * 100).toFixed(1)}% Similar
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">
                    Cosine Similarity:
                  </span>
                  <span className="font-medium">
                    {(sectorOverlap.cosineSimilarity * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={sectorOverlap.cosineSimilarity * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">
                    Percent Overlap:
                  </span>
                  <span className="font-medium">
                    {sectorOverlap.percentOverlap.toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={sectorOverlap.percentOverlap}
                  className="h-2"
                />
              </div>
            </div>

            {/* Common Sectors */}
            {sectorOverlap.commonSectors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Common Sectors</h4>
                <div className="space-y-2">
                  {sectorOverlap.commonSectors
                    .slice(0, 8)
                    .map((sector, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="font-medium text-sm capitalize">
                          {sector.sector}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-right">
                            <div className="text-blue-600 font-medium">
                              {sector.weightA.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Fund A
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-600 font-medium">
                              {sector.weightB.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Fund B
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-orange-600 font-medium">
                              {sector.difference.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Diff
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Returns Correlation */}
      {returnsCorrelation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Returns Correlation
            </CardTitle>
            <CardDescription>
              Pearson correlation of daily returns over{' '}
              {returnsCorrelation.period}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {returnsCorrelation.correlation !== null ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      {(returnsCorrelation.correlation * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getCorrelationLabel(returnsCorrelation.correlation)}{' '}
                      Correlation
                    </div>
                  </div>
                  <Badge
                    variant={
                      returnsCorrelation.correlation > 0.8
                        ? 'destructive'
                        : returnsCorrelation.correlation > 0.6
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {returnsCorrelation.dataPoints} data points
                  </Badge>
                </div>

                <Progress
                  value={Math.abs(returnsCorrelation.correlation) * 100}
                  className="h-2"
                />

                {returnsCorrelation.correlation > 0.8 && (
                  <div className="flex items-start gap-2 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        High Correlation Detected
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        These funds move together closely (correlation:{' '}
                        {returnsCorrelation.correlation.toFixed(2)}). Holding
                        both may not provide significant diversification
                        benefits.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {returnsCorrelation.error || 'Correlation data unavailable'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
