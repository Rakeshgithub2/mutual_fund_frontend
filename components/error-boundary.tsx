/**
 * Error Boundary and Error Components
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 */
interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-red-200 dark:border-red-900 p-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || 'An unexpected error occurred'}
          </p>

          <div className="flex gap-3 w-full">
            {onReset && (
              <Button onClick={onReset} variant="default" className="flex-1">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="mt-6 w-full">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-left bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto max-h-40">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Error Display
 */
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({
  message,
  onRetry,
  className = '',
}: InlineErrorProps) {
  return (
    <div
      className={`bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
            Error
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <RefreshCcw className="mr-2 h-3 w-3" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Not Found Component
 */
interface NotFoundProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export function NotFound({
  title = '404 - Not Found',
  message = 'The page or resource you are looking for does not exist.',
  showHomeButton = true,
}: NotFoundProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-gray-300 dark:text-gray-700 mb-4">
          404
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

        {showHomeButton && (
          <Link href="/">
            <Button variant="default">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
