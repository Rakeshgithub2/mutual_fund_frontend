/**
 * Example: Protected Route with Redirect After Login
 *
 * This example shows how to protect a page and redirect users back
 * after they successfully log in.
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function ProtectedPageExample() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save the current page path to redirect back after login
      sessionStorage.setItem(
        'redirectAfterLogin',
        window.location.pathname + window.location.search
      );

      // Redirect to login page
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (user will be redirected)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
      <p className="mb-4">Welcome, {user?.name}!</p>
      <p className="text-gray-600">
        This page is protected. You can only see it because you're logged in.
      </p>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">How the redirect works:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>User tries to access this protected page</li>
          <li>If not logged in, current URL is saved to sessionStorage</li>
          <li>User is redirected to /auth/login</li>
          <li>
            After successful login, user is automatically redirected back here
          </li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h2 className="font-semibold mb-2">User Information:</h2>
        <pre className="text-sm bg-white p-3 rounded border overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * Alternative: Using the existing ProtectedRoute component
 *
 * You can also wrap your page with the existing ProtectedRoute component:
 */

/*
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
*/
