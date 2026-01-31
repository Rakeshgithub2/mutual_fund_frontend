"use client"

import { useState } from "react"
import { getTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/i18n"

interface GlossaryTermProps {
  term: {
    id: string
    term: string
    definition: string
    examples: string[]
    investorImpact: string
    quiz: {
      question: string
      options: string[]
      correct: number
    }
  }
  language: Language
}

export function GlossaryTerm({ term, language }: GlossaryTermProps) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const t = (key: string) => getTranslation(language, key)

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const isCorrect = selectedAnswer === term.quiz.correct

  return (
    <div className="space-y-6">
      {/* Term Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-3xl font-bold text-foreground">{term.term}</h1>
        <p className="mt-4 text-lg text-muted">{term.definition}</p>
      </div>

      {/* Examples */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Indian Examples</h2>
        <ul className="space-y-3">
          {term.examples.map((example, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-foreground">{example}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Investor Impact */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">How It Affects Investors</h2>
        <p className="text-foreground leading-relaxed">{term.investorImpact}</p>
      </div>

      {/* Quiz */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Quick Quiz</h2>
          <button
            onClick={() => {
              setShowQuiz(!showQuiz)
              setSelectedAnswer(null)
              setQuizSubmitted(false)
            }}
            className="text-sm text-primary hover:underline"
          >
            {showQuiz ? "Hide" : "Show"}
          </button>
        </div>

        {showQuiz && (
          <div className="space-y-4">
            <p className="font-medium text-foreground">{term.quiz.question}</p>

            <div className="space-y-2">
              {term.quiz.options.map((option, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="quiz"
                    value={i}
                    checked={selectedAnswer === i}
                    onChange={() => setSelectedAnswer(i)}
                    disabled={quizSubmitted}
                    className="h-4 w-4"
                  />
                  <span
                    className={`text-foreground ${quizSubmitted && i === term.quiz.correct ? "text-success font-semibold" : ""}`}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>

            {!quizSubmitted && selectedAnswer !== null && (
              <button
                onClick={handleSubmitQuiz}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light transition-colors"
              >
                Submit Answer
              </button>
            )}

            {quizSubmitted && (
              <div
                className={`mt-4 rounded-lg p-4 ${isCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
              >
                <p className="font-semibold">{isCorrect ? "Correct! 🎉" : "Not quite right."}</p>
                <p className="mt-1 text-sm">
                  {isCorrect ? "Great job!" : `The correct answer is: ${term.quiz.options[term.quiz.correct]}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
