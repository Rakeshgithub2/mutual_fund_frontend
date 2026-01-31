'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * GoogleAnalytics Component
 *
 * Loads Google Analytics scripts and initializes tracking.
 * Only loads in production or when GA_MEASUREMENT_ID is set.
 */
export default function GoogleAnalytics() {
  // Only load in production or when explicitly enabled
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldLoad =
    GA_MEASUREMENT_ID &&
    (isProduction || process.env.NEXT_PUBLIC_GA_DEBUG === 'true');

  useEffect(() => {
    if (shouldLoad) {
      console.log(
        '✅ Google Analytics initialized with ID:',
        GA_MEASUREMENT_ID
      );
    } else {
      console.log(
        'ℹ️ Google Analytics not loaded (development mode or missing ID)'
      );
    }
  }, [shouldLoad]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
          
          // Log initialization
          console.log('📊 Google Analytics gtag loaded');
        `}
      </Script>
    </>
  );
}
