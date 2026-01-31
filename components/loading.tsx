/**
 * Loading Components
 * Skeleton loaders for various UI elements
 */

'use client';

import { Loader2 } from 'lucide-react';

/**
 * Fund Card Skeleton
 */
export function FundCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>

      {/* NAV Section */}
      <div className="mb-4 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>

      {/* Metrics Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>

      {/* Returns */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fund List Skeleton
 */
interface FundListSkeletonProps {
  count?: number;
}

export function FundListSkeleton({ count = 6 }: FundListSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <FundCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Page Loader (Full Screen)
 */
interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Inline Loader
 */
interface InlineLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoader({ message, size = 'md' }: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary mb-2`}
      />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </td>
    </tr>
  );
}

/**
 * Chart Skeleton
 */
export function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-end justify-around p-4 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-300 dark:bg-gray-600 rounded-t"
          style={{ height: `${Math.random() * 80 + 20}%`, width: '100%' }}
        ></div>
      ))}
    </div>
  );
}

/**
 * Button Loader
 */
export function ButtonLoader() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
