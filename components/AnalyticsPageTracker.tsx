'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics';

/**
 * AnalyticsPageTrackerContent Component
 *
 * Internal component that uses useSearchParams
 */
function AnalyticsPageTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Build full URL with search params
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * AnalyticsPageTracker Component
 *
 * Automatically tracks page views when the route changes.
 * Uses Next.js App Router hooks to detect navigation.
 * Wrapped in Suspense to handle useSearchParams() properly.
 */
export default function AnalyticsPageTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageTrackerContent />
    </Suspense>
  );
}
