'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();

    if (pasteData.length === 6 && /^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs[5].current?.focus();
      handleVerify(pasteData);
    }
  };

  const handleVerify = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      console.log('✅ OTP verified:', data);
      setSuccess(true);
      toast.success('OTP verified successfully!');

      // Redirect to reset password page
      setTimeout(() => {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(
            email
          )}&otp=${otpCode}`
        );
      }, 1500);
    } catch (err: any) {
      console.error('❌ OTP verification error:', err);
      const errorMessage = err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setOtp(['', '', '', '', '', '']); // Clear OTP
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs[0].current?.focus();

      // Show success message
      toast.success('New OTP sent to your email!');
    } catch (err: any) {
      const errorMessage = 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Email not found. Please start from the forgot password page.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-4 shadow-lg">
              <span className="text-3xl">📧</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a 6-digit code to
              <br />
              <strong className="text-gray-900 dark:text-white">{email}</strong>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-300 text-sm">
                ✓ OTP verified! Redirecting...
              </p>
            </div>
          )}

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg outline-none transition-all
                  ${
                    digit
                      ? 'border-indigo-600 dark:border-indigo-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }
                  ${error ? 'border-red-500' : ''}
                  dark:bg-gray-800 dark:text-white
                  focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                disabled={loading || success}
              />
            ))}
          </div>

          {/* Resend Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendOTP}
              disabled={loading || success}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn't receive code? Resend OTP
            </button>
          </div>

          {/* Manual Verify Button (optional) */}
          <Button
            onClick={() => handleVerify()}
            disabled={loading || success || otp.some((d) => !d)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? 'Verifying...' : success ? 'Verified!' : 'Verify OTP'}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Need help? Contact our{' '}
          <Link
            href="/contact"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            support team
          </Link>
        </p>
      </div>
    </div>
  );
}
