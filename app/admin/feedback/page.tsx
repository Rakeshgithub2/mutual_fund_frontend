'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import {
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface Feedback {
  _id: string;
  feedbackType: string;
  rating: number;
  name: string;
  email: string | null;
  message: string;
  userId: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

interface FeedbackStats {
  total: number;
  byStatus: {
    pending: number;
    reviewed: number;
    resolved: number;
  };
  averageRating: number;
  byType: Record<string, number>;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'reviewed' | 'resolved'
  >('all');

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [filter]);

  const fetchFeedback = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const statusParam = filter !== 'all' ? `?status=${filter}` : '';

      const response = await fetch(`${apiUrl}/api/feedback${statusParam}`);
      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/feedback/stats/summary`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (
    id: string,
    status: 'pending' | 'reviewed' | 'resolved'
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/feedback/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        fetchFeedback();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300';
      case 'feature':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Feedback Management
          </h1>
          <p className="mt-2 text-lg text-muted">
            View and manage user feedback
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted">Total Feedback</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted">Pending</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.byStatus.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted">Resolved</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.byStatus.resolved}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted">Avg Rating</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.averageRating.toFixed(1)} ⭐
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {['all', 'pending', 'reviewed', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`rounded-lg px-4 py-2 font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-primary text-white shadow-lg'
                  : 'border border-border hover:border-primary hover:bg-background'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-lg text-muted">Loading feedback...</div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-muted" />
              <p className="mt-4 text-lg text-muted">No feedback found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(
                          feedback.feedbackType
                        )}`}
                      >
                        {feedback.feedbackType === 'bug'
                          ? '🐛 Bug'
                          : feedback.feedbackType === 'feature'
                          ? '💡 Feature'
                          : '💬 General'}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          feedback.status
                        )}`}
                      >
                        {feedback.status}
                      </span>
                      {feedback.rating > 0 && (
                        <span className="text-sm">
                          {'⭐'.repeat(feedback.rating)}
                        </span>
                      )}
                    </div>

                    <p className="mb-2 text-foreground whitespace-pre-wrap">
                      {feedback.message}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                      <span>👤 {feedback.name}</span>
                      {feedback.email && <span>📧 {feedback.email}</span>}
                      <span>
                        📅 {new Date(feedback.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2">
                    {feedback.status !== 'reviewed' && (
                      <button
                        onClick={() => updateStatus(feedback._id, 'reviewed')}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 transition-colors"
                      >
                        Mark Reviewed
                      </button>
                    )}
                    {feedback.status !== 'resolved' && (
                      <button
                        onClick={() => updateStatus(feedback._id, 'resolved')}
                        className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {feedback.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(feedback._id, 'pending')}
                        className="rounded-lg bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700 transition-colors"
                      >
                        Mark Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
