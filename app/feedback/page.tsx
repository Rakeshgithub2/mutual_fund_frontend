'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import {
  Send,
  MessageSquare,
  Star,
  Lightbulb,
  Bug,
  Heart,
  ArrowLeft,
} from 'lucide-react';

export default function FeedbackPage() {
  const router = useRouter();
  const [feedbackType, setFeedbackType] = useState<
    'bug' | 'feature' | 'general'
  >('general');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Get user data if logged in
      const userData =
        localStorage.getItem('varta_user') || localStorage.getItem('user');
      let userName = 'Anonymous';
      let userId = null;
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userName = user.name || user.username || 'Anonymous';
          userId = user.id || user._id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      const feedbackData = {
        feedbackType,
        rating,
        name: userName,
        email: null,
        message: message.trim(),
        userId,
      };

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Server returned invalid response. Please try again.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      // Show success message
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackType('general');
        setRating(0);
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit feedback. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button - Fixed at top left */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <MessageSquare className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            We'd Love Your Feedback
          </h1>
          <p className="mt-3 text-lg text-muted">
            Help us improve MutualFunds.in with your valuable suggestions and
            reports
          </p>
          <div className="mt-6 mx-auto max-w-2xl rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              📧 Your feedback will open your email client to send to:{' '}
              <strong>rakeshd01042024@gmail.com</strong>
            </p>
          </div>
        </div>

        {submitted ? (
          // Success Message
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border-2 border-green-500 bg-green-50 dark:bg-green-950 p-8 text-center">
              <div className="mb-4 flex justify-center">
                <Heart className="h-16 w-16 text-green-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                Thank You!
              </h2>
              <p className="text-green-700 dark:text-green-300">
                Your feedback has been submitted successfully. We appreciate
                your input!
              </p>
            </div>
          </div>
        ) : (
          // Feedback Form
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Feedback Type */}
              <div>
                <label className="mb-4 block text-lg font-semibold text-foreground">
                  What type of feedback do you have?
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('bug')}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                      feedbackType === 'bug'
                        ? 'border-red-500 bg-red-50 dark:bg-red-950 shadow-lg'
                        : 'border-border hover:border-red-300 hover:bg-background'
                    }`}
                  >
                    <Bug
                      className={`h-8 w-8 ${
                        feedbackType === 'bug' ? 'text-red-600' : 'text-muted'
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      Bug Report
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('feature')}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                      feedbackType === 'feature'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                        : 'border-border hover:border-blue-300 hover:bg-background'
                    }`}
                  >
                    <Lightbulb
                      className={`h-8 w-8 ${
                        feedbackType === 'feature'
                          ? 'text-blue-600'
                          : 'text-muted'
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      Feature Request
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackType('general')}
                    className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                      feedbackType === 'general'
                        ? 'border-green-500 bg-green-50 dark:bg-green-950 shadow-lg'
                        : 'border-border hover:border-green-300 hover:bg-background'
                    }`}
                  >
                    <MessageSquare
                      className={`h-8 w-8 ${
                        feedbackType === 'general'
                          ? 'text-green-600'
                          : 'text-muted'
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      General Feedback
                    </span>
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-4 block text-lg font-semibold text-foreground">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2 justify-center sm:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Tell us what you think, what issues you encountered, or what features you'd like to see..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950 p-4 text-red-700 dark:text-red-300">
                  <p className="font-medium">❌ {error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="h-5 w-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted">We Read All Feedback</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-primary">48hrs</div>
            <div className="text-sm text-muted">Average Response Time</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted">Features From Users</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 rounded-lg border border-border bg-card p-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Other Ways to Reach Us
          </h2>
          <div className="space-y-3 text-muted">
            <p>
              📧 Email:{' '}
              <a
                href="mailto:rakeshd01042024@gmail.com"
                className="text-primary hover:underline"
              >
                rakeshd01042024@gmail.com
              </a>
            </p>
            <p>
              📱 Mobile:{' '}
              <a
                href="tel:+919740104978"
                className="text-primary hover:underline"
              >
                +91 9740104978
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted">
            <p>&copy; 2025 MutualFunds.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
