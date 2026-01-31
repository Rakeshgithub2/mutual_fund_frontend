'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface SectorData {
  sector: string;
  percentage: number;
  value: number;
}

interface SectorAllocationChartProps {
  sectors: SectorData[];
  sectorAllocationCount?: number;
}

const SECTOR_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#a855f7', // violet
  '#f43f5e', // rose
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4 shadow-xl">
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
          {data.sector}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Percentage:</span>{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {(data.percentage || 0).toFixed(2)}%
          </span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Value:</span>{' '}
          <span className="font-bold text-purple-600 dark:text-purple-400">
            ₹
            {(data.value || 0).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
            })}{' '}
            Cr
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom label for the pie chart
const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percentage } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is > 3% to avoid clutter
  if ((percentage || 0) < 3) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-bold text-sm"
      style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
    >
      {`${(percentage || 0).toFixed(1)}%`}
    </text>
  );
};

export function SectorAllocationChart({
  sectors,
  sectorAllocationCount,
}: SectorAllocationChartProps) {
  // Handle empty state
  if (!sectors || sectors.length === 0) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                Sector Allocation
              </CardTitle>
              <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
                Portfolio distribution across sectors
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No sector allocation data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <PieChartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Sector Allocation
            </CardTitle>
            <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
              {sectorAllocationCount
                ? `Distribution across ${sectorAllocationCount} sectors`
                : 'Portfolio distribution across sectors'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Donut Chart */}
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectors as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={140}
                innerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
                paddingAngle={2}
              >
                {sectors.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                formatter={(value, entry: any) => {
                  const sector = sectors.find((s) => s.sector === value);
                  return `${value} (${(sector?.percentage || 0).toFixed(1)}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sector List - Mobile Friendly */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sectors.map((sector, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-4 h-4 rounded-full shadow-md flex-shrink-0"
                  style={{
                    backgroundColor:
                      SECTOR_COLORS[index % SECTOR_COLORS.length],
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {sector.sector}
                </span>
              </div>
              <div className="flex flex-col items-end ml-2">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                  {(sector.percentage || 0).toFixed(2)}%
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  ₹
                  {((sector.value || 0) / 1).toLocaleString('en-IN', {
                    maximumFractionDigits: 0,
                  })}
                  Cr
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Info */}
        <div className="mt-6 p-4 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-blue-200 dark:border-blue-800/50">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              💡 Diversification:
            </span>{' '}
            Portfolio is spread across {sectors.length} different sectors. The
            largest allocation is{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {sectors[0]?.sector} ({(sectors[0]?.percentage || 0).toFixed(2)}%)
            </span>
            , helping to balance risk across industries.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
