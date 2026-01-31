'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bug,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

type FeedbackType = 'bug' | 'feature' | 'general';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function FeedbackButton() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate user data when logged in or modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name is required
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // For logged-in users, email is required
    if (user && !email) {
      newErrors.email = 'Email is required for registered users';
    }

    // Message is required
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    // Rating validation (0-5)
    if (rating < 0 || rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFeedbackType('general');
    setRating(0);
    setMessage('');
    if (!user) {
      setName('');
      setEmail('');
    }
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        feedbackType,
        rating,
        name: name.trim(),
        email: email?.trim() || null,
        message: message.trim(),
        userId: user?.userId || null,
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
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      // Success
      setSubmitted(true);
      toast({
        title: 'Success! 🎉',
        description: data.emailSent
          ? 'Your feedback has been sent to rakeshd01042024@gmail.com'
          : 'Your feedback has been received. ' + (data.warning || ''),
      });

      resetForm();

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    switch (feedbackType) {
      case 'bug':
        return 'Describe the bug you encountered...';
      case 'feature':
        return "Describe the feature you'd like to see...";
      default:
        return 'Share your thoughts with us...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          suppressHydrationWarning
          className="fixed bottom-8 right-8 group flex items-center gap-3 h-16 px-6 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 shadow-2xl hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] hover:scale-105 transition-all duration-300 z-50 animate-pulse hover:animate-none"
          title="Share your feedback with us!"
        >
          <MessageSquare className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-white font-bold text-base hidden sm:inline-block">
            Feedback
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Your Feedback
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            We value your opinion! Let us know what you think about our
            platform.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your feedback has been received. We'll review it shortly!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Feedback Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Feedback Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackType('bug')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    feedbackType === 'bug'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700'
                  }`}
                  disabled={isSubmitting}
                >
                  <Bug className="w-5 h-5" />
                  <span className="text-xs font-medium">Bug Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('feature')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    feedbackType === 'feature'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                  }`}
                  disabled={isSubmitting}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium">Feature Request</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    feedbackType === 'general'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  disabled={isSubmitting}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-medium">General</span>
                </button>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rate Your Experience
              </label>
              <div className="flex justify-center">
                <StarRating
                  value={rating}
                  onChange={setRating}
                  disabled={isSubmitting}
                />
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {rating === 1 && '⭐ Poor'}
                  {rating === 2 && '⭐⭐ Fair'}
                  {rating === 3 && '⭐⭐⭐ Good'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                  {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email {user && <span className="text-red-500">*</span>}
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || !!user}
                readOnly={!!user}
                required={!!user}
              />
              {user && (
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  ✓ Using your registered email
                </p>
              )}
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none transition-all"
                placeholder={getPlaceholder()}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {message.length} characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
