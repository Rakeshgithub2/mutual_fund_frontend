"use client";

import { ReactNode } from "react";
import { KnowledgeButton } from "./knowledge-button";

interface TechnicalTextProps {
  children: string;
  className?: string;
}

// Map of technical terms to their glossary IDs
const technicalTerms: { [key: string]: string } = {
  "large cap": "large-cap",
  "mid cap": "mid-cap",
  "small cap": "small-cap",
  nav: "nav",
  "expense ratio": "expense-ratio",
  aum: "aum",
  cagr: "cagr",
  etf: "etf",
  dividend: "dividend-yield",
  sip: "sip",
  returns: "returns",
  equity: "equity",
  debt: "debt",
  nifty: "nifty",
  sensex: "sensex",
  elss: "elss",
  benchmark: "benchmark",
  portfolio: "portfolio",
  "mutual fund": "nav",
  bluechip: "large-cap",
  "blue chip": "large-cap",
  "systematic investment": "sip",
};

/**
 * Component that automatically highlights technical investment terms
 * and adds knowledge buttons next to them
 */
export function TechnicalText({
  children,
  className = "",
}: TechnicalTextProps) {
  if (!children || typeof children !== "string") {
    return <span className={className}>{children}</span>;
  }

  const parts: ReactNode[] = [];
  let remainingText = children;
  let key = 0;

  // Sort terms by length (longest first) to match longer phrases first
  const sortedTerms = Object.keys(technicalTerms).sort(
    (a, b) => b.length - a.length
  );

  while (remainingText.length > 0) {
    let matched = false;

    for (const term of sortedTerms) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      const match = remainingText.match(regex);

      if (match && match.index !== undefined) {
        // Add text before the match
        if (match.index > 0) {
          parts.push(remainingText.substring(0, match.index));
        }

        // Add the matched term with knowledge button
        const matchedText = match[0];
        parts.push(
          <span key={key++} className="inline-flex items-center gap-1">
            {matchedText}
            <KnowledgeButton term={technicalTerms[term.toLowerCase()]} />
          </span>
        );

        // Update remaining text
        remainingText = remainingText.substring(
          match.index + matchedText.length
        );
        matched = true;
        break;
      }
    }

    if (!matched) {
      // No more matches, add the rest
      parts.push(remainingText);
      break;
    }
  }

  return <span className={className}>{parts}</span>;
}
