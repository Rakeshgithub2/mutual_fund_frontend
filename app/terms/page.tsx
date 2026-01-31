'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, Ban, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 mt-2 hidden md:block">
          <BackButton />
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Rules and guidelines for using this platform
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                By accessing and using <strong>MF Analyzer</strong>, you accept
                and agree to be bound by these Terms and Conditions. If you do
                not agree to these terms, please do not use this platform.
              </p>
              <p>
                These terms apply to all visitors, users, and others who access
                or use the service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Use License
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Permission is granted to temporarily access the materials
                (information and services) on MF Analyzer for personal,
                non-commercial use only.
              </p>
              <p className="font-semibold">You may NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>
                  Attempt to decompile or reverse engineer any software on the
                  platform
                </li>
                <li>Remove any copyright or proprietary notations</li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
                <li>
                  Use automated systems (bots, scrapers) to access the platform
                </li>
                <li>
                  Overload or interfere with the proper functioning of the
                  platform
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>When you create an account, you are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
              <p className="mt-4 font-semibold">
                We reserve the right to suspend or terminate accounts that
                violate these terms or engage in fraudulent activity.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Information Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>While we strive to provide accurate information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Materials may include technical, typographical, or
                  photographic errors
                </li>
                <li>
                  We do not warrant that any information is accurate, complete,
                  or current
                </li>
                <li>Information may change without notice</li>
                <li>
                  We are not responsible for errors in third-party data sources
                </li>
              </ul>
              <p className="mt-4 font-semibold text-red-600 dark:text-red-400">
                Always verify information from official sources (AMC websites,
                AMFI) before making investment decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30">
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Prohibited Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit viruses, malware, or harmful code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data of other users</li>
                <li>Use the platform for money laundering or fraud</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Interfere with security features</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle>Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                MF Analyzer may contain links to third-party websites. These
                links are provided for convenience only.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We have no control over third-party content</li>
                <li>
                  We do not endorse or assume responsibility for third-party
                  sites
                </li>
                <li>Access third-party sites at your own risk</li>
                <li>Review their terms and privacy policies independently</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  MF Analyzer and its operators shall not be liable for any
                  damages arising from use of the platform
                </li>
                <li>
                  This includes direct, indirect, incidental, punitive, and
                  consequential damages
                </li>
                <li>
                  We are not liable for investment losses or financial decisions
                  made based on information provided
                </li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>
                  Total liability shall not exceed the amount you paid (if any)
                  to use the service
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30">
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                All content, features, and functionality are owned by MF
                Analyzer and protected by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copyright laws</li>
                <li>Trademark laws</li>
                <li>Patent laws</li>
                <li>Trade secret laws</li>
                <li>Other intellectual property rights</li>
              </ul>
              <p className="mt-4">
                Mutual fund data and brand names are property of respective
                Asset Management Companies and regulatory bodies.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30">
              <CardTitle>Service Modifications</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We reserve the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or discontinue the service at any time</li>
                <li>Change features, functionality, or content</li>
                <li>Update pricing (with notice for paid services)</li>
                <li>Impose usage limits or restrictions</li>
                <li>
                  Perform maintenance that may cause temporary unavailability
                </li>
              </ul>
              <p className="mt-4">
                We will not be liable for any modification, suspension, or
                discontinuation of the service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may terminate or suspend your account immediately, without
                notice, for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Breach of these Terms and Conditions</li>
                <li>Fraudulent or illegal activity</li>
                <li>Abuse of the platform or other users</li>
                <li>Any other reason at our sole discretion</li>
              </ul>
              <p className="mt-4">
                Upon termination, your right to use the service will immediately
                cease. You may also delete your account at any time from
                settings.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India.
              </p>
              <p>
                Any disputes arising from these terms or use of the platform
                shall be subject to the exclusive jurisdiction of the courts in
                [Your City], India.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We reserve the right to update these Terms at any time. Changes
                will be effective immediately upon posting.
              </p>
              <p>
                Your continued use of the platform after changes constitutes
                acceptance of the updated terms.
              </p>
              <p className="font-semibold">
                We recommend reviewing these terms periodically for any changes.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-purple-400 dark:border-purple-600">
            <CardContent className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                If you have questions about these Terms & Conditions, please
                contact:
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
