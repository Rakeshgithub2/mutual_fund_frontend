"use client";

import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface SectorAllocationProps {
  allocation: { [key: string]: number };
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f97316", // orange
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#ef4444", // red
  "#6366f1", // indigo
];

export function SectorAllocation({ allocation }: SectorAllocationProps) {
  const data = Object.entries(allocation).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">📊</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            Sector Allocation
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Portfolio distribution across sectors
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${(props.percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => `${value.toFixed(2)}%`}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sector List */}
        <div className="space-y-3">
          {data.map((sector, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-blue-200 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full shadow-md"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {sector.name}
                </span>
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                {sector.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
