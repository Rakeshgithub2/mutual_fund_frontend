import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/lib/auth-context';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AnalyticsPageTracker from '@/components/AnalyticsPageTracker';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { FundDataProvider } from '@/components/fund-data-provider';
import './globals.css';
import './mobile-responsive.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "MutualFunds.in - India's Mutual Funds & ETFs Portal",
  description:
    'Explore, compare, and invest in mutual funds and ETFs with expert insights',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
  },
};

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Bootstrap 5.3.8 CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.className} text-foreground`}>
        {/* Google Analytics - Loaded first for tracking */}
        <GoogleAnalytics />
        <AnalyticsPageTracker />

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <TranslationProvider>
            <AuthProvider>
              <FundDataProvider>
                <ProtectedRoute>{children}</ProtectedRoute>
                <MobileBottomNav />
              </FundDataProvider>
              <Toaster />
            </AuthProvider>
          </TranslationProvider>
        </GoogleOAuthProvider>

        {/* Bootstrap 5.3.8 JS Bundle */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
