'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/about',
  '/glossary',
  '/equity',
  '/debt',
  '/commodity',
  '/funds-demo',
  '/search',
  '/compare',
  '/overlap',
  '/fund-manager',
  '/fund-managers',
  '/knowledge',
  '/how-it-works',
  '/contact',
  '/feedback',
  '/help',
  '/terms',
  '/privacy',
  '/disclaimer',
  '/calculators',
  '/chat',
  '/news',
  '/market',
];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirect during initial loading
    if (isLoading) return;

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some((route) => {
      if (route === '/') return pathname === '/';
      return pathname?.startsWith(route);
    });

    // Redirect to login if not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      // Store the intended destination
      sessionStorage.setItem('redirectAfterLogin', pathname || '/');
      router.push('/auth/login');
    }
  }, [user, isLoading, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt for protected routes when not authenticated
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname?.startsWith(route);
  });

  if (!user && !isPublicRoute) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}
