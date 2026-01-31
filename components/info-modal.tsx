"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { knowledgeBase, type KnowledgeKey } from "@/lib/knowledge-base"

interface InfoModalProps {
  term: KnowledgeKey
  children: React.ReactNode
}

export function InfoModal({ term, children }: InfoModalProps) {
  const [open, setOpen] = useState(false)
  const info = knowledgeBase[term]

  if (!info) return <>{children}</>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-primary hover:text-primary-light transition-colors cursor-help"
        title="Click for more information"
      >
        {children}
        <span className="text-xs bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center font-bold">?</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">{info.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Definition */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">What is it?</h3>
              <p className="text-muted leading-relaxed">{info.definition}</p>
            </div>

            {/* Why Important */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Why is it important?</h3>
              <p className="text-muted leading-relaxed">{info.whyImportant}</p>
            </div>

            {/* Typical Range */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Typical Range</h3>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-foreground font-medium">{info.typicalRange}</p>
              </div>
            </div>

            {/* How to Analyze */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">How to Analyze</h3>
              <p className="text-muted leading-relaxed">{info.howToAnalyze}</p>
            </div>

            {/* Example */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Real-World Example</h3>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <p className="text-muted leading-relaxed">{info.example}</p>
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-primary mb-2">Key Takeaway:</p>
              <p className="text-sm text-foreground">
                Understanding {info.title.toLowerCase()} helps you make informed investment decisions and compare funds
                effectively.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
