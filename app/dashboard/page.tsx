'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Mail, Shield, IdCard } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Welcome Card */}
            <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Welcome back, {user?.name}! 👋
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-100">
                  You're successfully logged in to your account. Start exploring
                  your investment portfolio.
                </p>
              </CardContent>
            </Card>

            {/* User Info Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Name</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900">
                  {user?.name}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-medium text-gray-900 break-all">
                  {user?.email}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900">
                  {(user as any)?.role || 'USER'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <IdCard className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">User ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {(user as any)?.id || (user as any)?.userId || 'N/A'}
                </p>
              </CardContent>
            </Card>

            {/* Authentication Status */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Authentication Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-600">Active</span>{' '}
                    - You are currently authenticated
                  </p>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    🔐 Your session is secured with JWT tokens. Access tokens
                    are automatically refreshed to keep you logged in.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push('/funds')}
                >
                  Browse Mutual Funds
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push('/compare')}
                >
                  Compare Funds
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push('/goals')}
                >
                  Financial Goals
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push('/calculators')}
                >
                  Calculators
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
