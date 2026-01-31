"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import glossaryData from "@/data/glossary.json";

interface KnowledgeButtonProps {
  term: string;
  className?: string;
}

export function KnowledgeButton({
  term,
  className = "",
}: KnowledgeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find the term in glossary
  const glossaryTerm = glossaryData.terms.find(
    (t) =>
      t.term.toLowerCase().includes(term.toLowerCase()) ||
      t.id === term.toLowerCase().replace(/\s+/g, "-")
  );

  if (!glossaryTerm) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-pulse ${className}`}
        title={`Learn about ${term}`}
        aria-label={`Learn about ${term}`}
      >
        <Info className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 -mx-6 -mt-6 px-6 pt-6 pb-4 border-b-2 border-purple-200 dark:border-purple-800">
            <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {glossaryTerm.term}
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-800 dark:text-gray-100 mt-3 font-medium leading-relaxed">
              {glossaryTerm.definition}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Examples */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Examples:
              </h3>
              <ul className="space-y-3">
                {glossaryTerm.examples.map((example: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 mt-1 text-xl font-bold">
                      •
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 text-base font-medium leading-relaxed">
                      {example}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Investor Impact */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-5 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Why This Matters:
              </h3>
              <p className="text-gray-900 dark:text-gray-100 text-base font-medium leading-relaxed">
                {glossaryTerm.investorImpact}
              </p>
            </div>

            {/* Quick Quiz */}
            {glossaryTerm.quiz && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-5 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">🤔</span>
                  Quick Check:
                </h3>
                <p className="text-base text-gray-900 dark:text-gray-100 font-medium italic leading-relaxed">
                  {glossaryTerm.quiz.question}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t-2 border-purple-200 dark:border-purple-800">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-base"
              >
                Got it! ✓
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
