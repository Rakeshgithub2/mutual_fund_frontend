'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface Reminder {
  _id: string;
  type: string;
  title: string;
  description?: string;
  reminderDate: string;
  frequency: string;
  status: string;
  notifyVia: {
    email: boolean;
    push: boolean;
  };
  createdAt: string;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CUSTOM',
    title: '',
    description: '',
    reminderDate: '',
    reminderTime: '',
    reminderPeriod: 'AM',
    frequency: 'ONCE',
    notifyEmail: true,
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    console.log('📊 Reminders state updated. Count:', reminders.length);
    console.log('📋 Current reminders:', reminders);
  }, [reminders]);

  const fetchReminders = async () => {
    try {
      console.log('🔄 Fetching reminders...');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('❌ No token found, user not logged in');
        toast.error('Please login to view reminders');
        return;
      }

      console.log('📡 Fetching from:', `${API_URL}/api/reminders`);
      const response = await fetch(`${API_URL}/api/reminders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📨 Fetch response status:', response.status);
      const data = await response.json();
      console.log('📨 Fetch response data:', data);

      if (data.success) {
        console.log(`✅ Found ${data.data.length} reminders`);
        setReminders(data.data);
      } else {
        console.log('❌ Fetch failed:', data.message);
      }
    } catch (error: any) {
      console.error('❌ Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔵 Create Reminder button clicked!');
    console.log('📝 Form Data:', formData);

    if (!formData.title || !formData.reminderDate || !formData.reminderTime) {
      console.log('❌ Validation failed - missing required fields');
      toast.error('Please fill all required fields');
      return;
    }

    // Validate time format
    const timePattern = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
    if (!timePattern.test(formData.reminderTime)) {
      console.log('❌ Invalid time format:', formData.reminderTime);
      toast.error('Please enter valid time in HH:MM format (e.g., 09:30)');
      return;
    }

    console.log('✅ Validation passed, proceeding to create reminder...');

    try {
      const token = localStorage.getItem('accessToken');
      console.log(
        '🔑 Checking authentication token...',
        token ? 'Token found' : 'NO TOKEN - USER NOT LOGGED IN!'
      );

      if (!token) {
        console.log('❌ ERROR: No authentication token found!');
        toast.error('Please login to create reminders');
        return;
      }

      // Convert 12-hour time to 24-hour format
      const [hours, minutes] = formData.reminderTime.split(':').map(Number);
      let hour24 = hours;

      if (formData.reminderPeriod === 'PM' && hours !== 12) {
        hour24 = hours + 12;
      } else if (formData.reminderPeriod === 'AM' && hours === 12) {
        hour24 = 0;
      }

      // Combine date and time in 24-hour format
      const time24 = `${hour24.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      const reminderDateTime = new Date(`${formData.reminderDate}T${time24}`);

      console.log('Creating reminder:', {
        date: formData.reminderDate,
        time12: formData.reminderTime,
        period: formData.reminderPeriod,
        time24: time24,
        dateTime: reminderDateTime.toISOString(),
        userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      console.log('📡 Sending POST request to:', `${API_URL}/api/reminders`);
      console.log('📦 Request body:', {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        reminderDate: reminderDateTime.toISOString(),
        frequency: formData.frequency,
        notifyVia: {
          email: formData.notifyEmail,
          push: false,
        },
      });

      const response = await fetch(`${API_URL}/api/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          reminderDate: reminderDateTime.toISOString(),
          frequency: formData.frequency,
          notifyVia: {
            email: formData.notifyEmail,
            push: false,
          },
        }),
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);

      const data = await response.json();
      console.log('📨 Response data:', data);

      if (data.success) {
        toast.success('✅ Reminder Created Successfully!', {
          description:
            'Your reminder has been saved and will be sent at the scheduled time.',
          duration: 5000,
        });
        console.log('✅ Reminder saved to DB:', data.data);
        console.log(
          '📧 Confirmation email should be sent to:',
          data.data.userId?.email
        );
        setFormData({
          type: 'CUSTOM',
          title: '',
          description: '',
          reminderDate: '',
          reminderTime: '',
          reminderPeriod: 'AM',
          frequency: 'ONCE',
          notifyEmail: true,
        });
        setShowForm(false);
        console.log('🔄 Calling fetchReminders to refresh the list...');
        fetchReminders();
      } else {
        console.log('❌ API returned success: false');
        throw new Error(data.message || 'Failed to create reminder');
      }
    } catch (error: any) {
      console.error('❌ Error creating reminder:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Failed to create reminder');
    }
  };

  const deleteReminder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login');
        return;
      }

      console.log('Deleting reminder:', id);

      const response = await fetch(`${API_URL}/api/reminders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reminder deleted from database successfully');
        console.log('Reminder deleted from DB');
        fetchReminders();
      } else {
        throw new Error(data.message || 'Failed to delete reminder');
      }
    } catch (error: any) {
      console.error('Error deleting reminder:', error);
      toast.error(error.message || 'Failed to delete reminder');
    }
  };

  const completeReminder = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login');
        return;
      }

      console.log('Completing reminder:', id);

      const response = await fetch(`${API_URL}/api/reminders/${id}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reminder marked as completed in database');
        console.log('Reminder updated in DB:', data.data);
        fetchReminders();
      } else {
        throw new Error(data.message || 'Failed to complete reminder');
      }
    } catch (error: any) {
      console.error('Error completing reminder:', error);
      toast.error(error.message || 'Failed to complete reminder');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      hour12: true, // Show AM/PM
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Reminders
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Never miss an important investment task
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Reminder
            </Button>
          </div>

          {/* Info Alert */}
          <Card className="mb-6 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="p-4 flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Email Notifications</p>
                <p>
                  Reminders will be sent to your registered email address at the
                  scheduled date and time. Make sure your email is verified.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Create Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardTitle>Create New Reminder</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="CUSTOM">Custom</option>
                        <option value="SIP">SIP Payment</option>
                        <option value="GOAL_REVIEW">Goal Review</option>
                        <option value="REBALANCE">Portfolio Rebalance</option>
                        <option value="DOCUMENT">Document Update</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="frequency">
                        Frequency <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="frequency"
                        value={formData.frequency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            frequency: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="ONCE">One Time</option>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g., Monthly SIP Payment"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add notes or details about this reminder..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="dark:bg-gray-800 dark:border-gray-700"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reminderDate">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reminderDate"
                        type="date"
                        value={formData.reminderDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminderDate: e.target.value,
                          })
                        }
                        className="dark:bg-gray-800 dark:border-gray-700"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="reminderTime">
                        Time <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="reminderTime"
                          type="text"
                          placeholder="HH:MM (e.g., 09:30)"
                          value={formData.reminderTime}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9:]/g,
                              ''
                            );
                            if (value.length <= 5) {
                              setFormData({
                                ...formData,
                                reminderTime: value,
                              });
                            }
                          }}
                          onBlur={(e) => {
                            // Auto-format on blur
                            const value = e.target.value.replace(/:/g, '');
                            if (value.length >= 3) {
                              const hours = value.substring(0, 2);
                              const minutes = value.substring(2, 4);
                              const formattedTime = `${hours}:${minutes}`;
                              setFormData({
                                ...formData,
                                reminderTime: formattedTime,
                              });
                            }
                          }}
                          className="flex-1 dark:bg-gray-800 dark:border-gray-700"
                          pattern="^(0?[1-9]|1[0-2]):[0-5][0-9]$"
                          title="Enter time in HH:MM format (e.g., 09:30)"
                          required
                        />
                        <select
                          value={formData.reminderPeriod}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reminderPeriod: e.target.value,
                            })
                          }
                          className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter time in 12-hour format (e.g., 09:30)
                      </p>
                      {formData.reminderDate && formData.reminderTime && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            ⏰ Reminder will be sent on{' '}
                            <span className="font-semibold">
                              {new Date(
                                `${formData.reminderDate}T00:00:00`
                              ).toLocaleDateString('en-IN', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              at {formData.reminderTime}{' '}
                              {formData.reminderPeriod}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="notifyEmail"
                      checked={formData.notifyEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notifyEmail: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="notifyEmail" className="cursor-pointer">
                      Send email notification
                    </Label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Create Reminder
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Created Reminders Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📋 My Created Reminders
              </h2>
              {!loading && reminders.length > 0 && (
                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold">
                  {reminders.length} Reminder{reminders.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Reminders List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading reminders...
                </p>
              </div>
            ) : reminders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Reminders Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "New Reminder" button above to create your first
                    reminder
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {reminders.map((reminder) => (
                  <Card
                    key={reminder._id}
                    className="hover:shadow-lg transition-shadow border-2 hover:border-purple-300 dark:hover:border-purple-700"
                  >
                    <CardContent className="p-6">
                      {/* Header with Title and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {reminder.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                reminder.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                                  : reminder.status === 'SENT'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                  : reminder.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
                              }`}
                            >
                              {reminder.status}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full text-xs font-semibold">
                              {reminder.type}
                            </span>
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-semibold">
                              {reminder.frequency}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {reminder.description && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {reminder.description}
                          </p>
                        </div>
                      )}

                      {/* Date and Time Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              Scheduled for
                            </span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatDate(reminder.reminderDate)}
                            </p>
                          </div>
                        </div>

                        {reminder.notifyVia.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                Notification via
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Email
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {reminder.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => completeReminder(reminder._id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteReminder(reminder._id)}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-800"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
