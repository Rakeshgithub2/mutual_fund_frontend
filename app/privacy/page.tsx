'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 mt-2 hidden md:block">
          <BackButton />
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                How we collect, use, and protect your information
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name and email address (for account creation)</li>
                  <li>Login credentials (encrypted)</li>
                  <li>Profile preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Funds you view, compare, or add to watchlist</li>
                  <li>Search queries and filter preferences</li>
                  <li>Calculator inputs and results</li>
                  <li>Page views and navigation patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Time zone and language preferences</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>
                  Personalize your experience and remember your preferences
                </li>
                <li>Save your watchlists, portfolios, and comparison data</li>
                <li>Send you important updates about the platform</li>
                <li>Improve our website and develop new features</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraud and maintain security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We implement security measures to protect your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Encryption:</strong> All sensitive data is encrypted
                  in transit and at rest
                </li>
                <li>
                  <strong>Secure Authentication:</strong> Passwords are hashed
                  using industry-standard algorithms
                </li>
                <li>
                  <strong>Access Controls:</strong> Limited access to personal
                  data on a need-to-know basis
                </li>
                <li>
                  <strong>Regular Audits:</strong> Security reviews and
                  vulnerability assessments
                </li>
                <li>
                  <strong>HTTPS:</strong> Secure connections for all
                  communications
                </li>
              </ul>
              <p className="mt-4 text-sm">
                <strong>Note:</strong> No method of transmission over the
                Internet is 100% secure. While we strive to protect your data,
                we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain your login session</li>
                <li>Remember your preferences (theme, language, filters)</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve website performance</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. However,
                disabling cookies may limit some functionality of the website.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
              <CardTitle>Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold">
                We do NOT sell your personal information to third parties.
              </p>
              <p>We may share limited information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> Cloud hosting, analytics,
                  and email services (under strict confidentiality agreements)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our legal rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger,
                  acquisition, or asset sale (with notice to users)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and data
                </li>
                <li>
                  <strong>Portability:</strong> Export your data in a
                  machine-readable format
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Revoke permissions at any
                  time
                </li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at:{' '}
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  rakeshd01042024@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We retain your information for as long as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account is active</li>
                <li>Needed to provide services</li>
                <li>Required by law or for legitimate business purposes</li>
              </ul>
              <p className="mt-4">
                When you delete your account, we will delete or anonymize your
                personal information within 30 days, except where retention is
                required by law.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Our platform is not intended for users under 18 years of age. We
                do not knowingly collect personal information from children. If
                you believe we have collected information from a child, please
                contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30">
              <CardTitle>Changes to Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending an email notification (for significant changes)</li>
              </ul>
              <p className="mt-4">
                Your continued use of the platform after changes constitute
                acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-blue-400 dark:border-blue-600">
            <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Contact Us
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                If you have questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  rakeshd01042024@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: December 21, 2025
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
