'use client';

export const dynamic = 'force-dynamic';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useTheme } from '@/lib/hooks/use-theme';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isDark, toggleTheme, mounted: themeMounted } = useTheme();
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const [exporting, setExporting] = useState(false);

  // TODO: Replace with actual user ID from authentication
  const userId = 'temp-user-id';

  if (!themeMounted || !watchlistMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleExportWatchlist = () => {
    const data = JSON.stringify(
      { watchlist, exportDate: new Date().toISOString() },
      null,
      2
    );
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' + encodeURIComponent(data)
    );
    element.setAttribute('download', 'watchlist.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Watchlist downloaded successfully');
  };

  const handleEmailWatchlist = async () => {
    if (watchlist.length === 0) {
      toast.error('Your watchlist is empty');
      return;
    }

    setExporting(true);
    try {
      const response = await fetch('/api/watchlist/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          watchlist,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.emailSent) {
          toast.success('Watchlist sent to your registered email!');
        } else {
          toast.warning(data.message || 'Email service not configured');
        }
      } else {
        toast.error('Failed to send watchlist');
      }
    } catch (error) {
      console.error('Error sending watchlist:', error);
      toast.error('Failed to send watchlist');
    } finally {
      setExporting(false);
    }
  };

  const handleImportWatchlist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          localStorage.setItem('watchlist', JSON.stringify(data.watchlist));
          alert('Watchlist imported successfully!');
        } catch {
          alert('Error importing watchlist');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Customize your experience and manage preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance Settings */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Customize how the app looks
              </p>
            </div>

            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isDark ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Watchlist Management */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Watchlist Management
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your saved funds
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You have{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {watchlist.length}
                </span>{' '}
                fund(s) in your watchlist
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleExportWatchlist}
                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                📥 Download Watchlist
              </button>
              <button
                onClick={handleEmailWatchlist}
                disabled={exporting}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {exporting ? '⏳ Sending...' : '📧 Email Watchlist'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Email will be sent to your registered email address
            </p>
          </section>

          {/* About Section */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                About
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                App information and legal
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">
                    App Version:
                  </strong>{' '}
                  1.0.0
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">
                    Last Updated:
                  </strong>{' '}
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/feedback"
                  className="text-primary hover:underline font-medium"
                >
                  💬 Send Feedback
                </Link>
                <Link
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-8 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} MF Analyzer. All rights reserved.
            </p>
            <p className="mt-2">Version 2.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
