"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InfoButtonProps {
  term: string;
  definition: string;
  importance: string;
  futureUsage: string;
  pros: string[];
  cons: string[];
}

export function InfoButton({
  term,
  definition,
  importance,
  futureUsage,
  pros,
  cons,
}: InfoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-2 h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
        onClick={() => setOpen(true)}
      >
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              {term}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Definition */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">
                What is {term}?
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {definition}
              </p>
            </div>

            {/* Importance */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-2">
                Why is it Important?
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {importance}
              </p>
            </div>

            {/* Future Usage */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2">
                Future Usage & Application
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {futureUsage}
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <span className="text-xl">✅</span> Advantages
                </h3>
                <ul className="space-y-2">
                  {pros.map((pro, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Considerations
                </h3>
                <ul className="space-y-2">
                  {cons.map((con, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                        •
                      </span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
