"use client"

import type React from "react"

import { useState } from "react"

interface TooltipProps {
  term: string
  definition: string
  children: React.ReactNode
}

export function Tooltip({ term, definition, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 border-b border-dotted border-primary hover:border-solid transition-all"
      >
        {children}
        <span className="text-xs font-bold text-primary">?</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-lg bg-card border border-border shadow-lg p-3">
          <p className="text-sm font-semibold text-foreground mb-1">{term}</p>
          <p className="text-xs text-muted leading-relaxed">{definition}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card" />
        </div>
      )}
    </div>
  )
}
