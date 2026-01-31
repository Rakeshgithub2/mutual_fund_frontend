/**
 * Enhanced Fund Charts Component
 * Provides comprehensive visual analytics with responsive design
 */

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
};

const SECTOR_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#06b6d4',
  '#f97316',
  '#a855f7',
  '#14b8a6',
  '#f43f5e',
  '#6366f1',
];

interface ReturnsData {
  return_1M?: number;
  return_3M?: number;
  return_6M?: number;
  return_1Y?: number;
  return_3Y?: number;
  return_5Y?: number;
}

interface SectorAllocation {
  sector: string;
  percentage: number;
}

interface HoldingData {
  company: string;
  percentage: number;
}

interface FundChartsProps {
  returns?: ReturnsData;
  sectorAllocation?: SectorAllocation[];
  topHoldings?: HoldingData[];
  navHistory?: Array<{ date: string; nav: number }>;
}

// Returns Bar Chart Component
export function ReturnsBarChart({ returns }: { returns?: ReturnsData }) {
  const data = useMemo(() => {
    if (!returns) return [];

    return [
      { period: '1M', return: returns.return_1M || 0 },
      { period: '3M', return: returns.return_3M || 0 },
      { period: '6M', return: returns.return_6M || 0 },
      { period: '1Y', return: returns.return_1Y || 0 },
      { period: '3Y', return: returns.return_3Y || 0 },
      { period: '5Y', return: returns.return_5Y || 0 },
    ].filter((item) => item.return !== 0);
  }, [returns]);

  if (data.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Historical Returns
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Performance across different time periods
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{
                value: 'Return (%)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number | undefined) =>
                value !== undefined
                  ? [`${value.toFixed(2)}%`, 'Return']
                  : ['N/A', 'Return']
              }
            />
            <Bar dataKey="return" fill={COLORS.primary} radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.return >= 0 ? COLORS.success : COLORS.danger}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// NAV Line Chart Component
export function NAVLineChart({
  navHistory,
}: {
  navHistory?: Array<{ date: string; nav: number }>;
}) {
  const data = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return [];

    return navHistory.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      nav: item.nav,
      fullDate: new Date(item.date).toLocaleDateString('en-IN'),
    }));
  }, [navHistory]);

  if (data.length === 0) return null;

  const trend = data.length >= 2 && data[data.length - 1].nav > data[0].nav;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              {trend ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              NAV Trend
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Net Asset Value over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{
                value: 'NAV (₹)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number | undefined) =>
                value !== undefined
                  ? [`₹${value.toFixed(2)}`, 'NAV']
                  : ['N/A', 'NAV']
              }
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke={COLORS.primary}
              strokeWidth={2}
              fill="url(#navGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Sector Allocation Donut Chart
export function SectorDonutChart({
  sectorAllocation,
}: {
  sectorAllocation?: SectorAllocation[];
}) {
  const data = useMemo(() => {
    if (!sectorAllocation || sectorAllocation.length === 0) return [];

    return sectorAllocation
      .filter((item) => item.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10); // Top 10 sectors
  }, [sectorAllocation]);

  if (data.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Sector Allocation
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Portfolio distribution across sectors
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Donut Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data as any[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="percentage"
                  label={(entry: any) =>
                    `${entry.percentage?.toFixed(1) || 0}%`
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number | undefined) =>
                    value !== undefined ? `${value.toFixed(2)}%` : 'N/A'
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-col justify-center space-y-2">
            {data.map((entry, index) => (
              <div
                key={`${entry.sector}-${index}`}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        SECTOR_COLORS[index % SECTOR_COLORS.length],
                    }}
                  />
                  <span className="text-xs sm:text-sm truncate">
                    {entry.sector}
                  </span>
                </div>
                <span className="font-semibold text-xs sm:text-sm">
                  {entry.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Top Holdings Donut Chart
export function HoldingsDonutChart({
  topHoldings,
}: {
  topHoldings?: HoldingData[];
}) {
  const data = useMemo(() => {
    if (!topHoldings || topHoldings.length === 0) return [];

    return topHoldings
      .filter((item) => item.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10); // Top 10 holdings
  }, [topHoldings]);

  if (data.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Top Holdings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Major company allocations in portfolio
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Donut Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data as any[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="percentage"
                  label={(entry: any) =>
                    `${entry.percentage?.toFixed(1) || 0}%`
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number | undefined) =>
                    value !== undefined ? `${value.toFixed(2)}%` : 'N/A'
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-col justify-center space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
            {data.map((entry, index) => (
              <div
                key={entry.company}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        SECTOR_COLORS[index % SECTOR_COLORS.length],
                    }}
                  />
                  <span className="text-xs sm:text-sm truncate">
                    {entry.company}
                  </span>
                </div>
                <span className="font-semibold text-xs sm:text-sm ml-2">
                  {entry.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export all charts
export const FundCharts = {
  ReturnsBarChart,
  NAVLineChart,
  SectorDonutChart,
  HoldingsDonutChart,
};
