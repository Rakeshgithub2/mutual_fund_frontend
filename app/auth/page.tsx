'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  LogIn,
  UserPlus,
  Shield,
  TrendingUp,
  PieChart,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm mx-auto mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">MF</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to MutualFunds.in
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Your trusted partner for smart mutual fund investments
            </p>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 p-8 md:p-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Track Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor your investments in real-time
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <PieChart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Smart Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered insights and recommendations
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Safe
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bank-grade security for your data
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Get Started Today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Choose how you'd like to continue. Already have an account? Sign
              in. New here? Create your free account.
            </p>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Login Card */}
              <Link href="/auth/login" className="group">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-xl cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogIn className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sign In
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Already have an account? Welcome back!
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Access your portfolio
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Continue tracking your funds
                    </li>
                  </ul>
                </div>
              </Link>

              {/* Register Card */}
              <Link href="/auth/register" className="group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Create Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    New here? Join thousands of investors!
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Free forever
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Set up in 2 minutes
                    </li>
                  </ul>
                </div>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Trusted by 10,000+ investors across India
          </p>
          <div className="flex items-center justify-center gap-8 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
