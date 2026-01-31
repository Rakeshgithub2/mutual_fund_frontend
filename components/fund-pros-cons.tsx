"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FundProsConsProps {
  pros: string[];
  cons: string[];
}

export function FundProsCons({ pros, cons }: FundProsConsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pros Section */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 text-transparent bg-clip-text">
              Advantages
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Why investors love this fund
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {pros.map((pro, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed font-medium">
                {pro}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Cons Section */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 text-transparent bg-clip-text">
              Considerations
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Things to keep in mind
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {cons.map((con, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 group"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed font-medium">
                {con}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
