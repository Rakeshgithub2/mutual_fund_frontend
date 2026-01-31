'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Send, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct mailto link with form data
    const mailtoLink = `mailto:rakeshd01042024@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                We'd love to hear from you
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  For general inquiries, support requests, or feedback:
                </p>
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  rakeshd01042024@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                <p className="mb-4">Reach us by phone:</p>
                <a
                  href="tel:+919740104978"
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  +91 9740104978
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                <p className="mb-2">We typically respond within:</p>
                <ul className="space-y-1">
                  <li>
                    • <strong>General queries:</strong> 24-48 hours
                  </li>
                  <li>
                    • <strong>Technical issues:</strong> 12-24 hours
                  </li>
                  <li>
                    • <strong>Data corrections:</strong> 48-72 hours
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's your message about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us what you need help with..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  * All fields are required. This will open your default email
                  client.
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardTitle>What to Include in Your Message</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-3">
                To help us assist you better, please include:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">For Technical Issues:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Browser and version</li>
                    <li>Operating system</li>
                    <li>Description of the problem</li>
                    <li>Steps to reproduce the issue</li>
                    <li>Screenshots (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Data Corrections:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Fund name and ISIN code</li>
                    <li>What data is incorrect</li>
                    <li>Correct data source (AMC link)</li>
                    <li>Date when you noticed the issue</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Feature Requests:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Detailed feature description</li>
                    <li>How it would help you</li>
                    <li>Examples from other platforms</li>
                    <li>Priority/urgency level</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For General Inquiries:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Clear subject line</li>
                    <li>Specific questions</li>
                    <li>Any relevant fund names</li>
                    <li>Your investment experience level</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                About Our Team
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-700 dark:text-gray-300 space-y-3">
              <p>
                MF Analyzer is built by a passionate team of developers and
                financial enthusiasts dedicated to making mutual fund investing
                simpler for every Indian investor.
              </p>
              <p>
                We're based in India and understand the unique challenges Indian
                investors face. Our goal is to provide professional-grade
                research tools that were previously accessible only to financial
                advisors.
              </p>
              <p>
                Whether you're a first-time investor or managing a large
                portfolio, we're here to support your investment journey.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-green-400 dark:border-green-600">
            <CardContent className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Other Ways to Connect
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">📚 Documentation</h4>
                  <p className="text-sm">
                    Check our{' '}
                    <a
                      href="/help"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Help & FAQs
                    </a>{' '}
                    and{' '}
                    <a
                      href="/how-it-works"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      How It Works
                    </a>{' '}
                    pages for detailed guides.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">🐛 Report Bugs</h4>
                  <p className="text-sm">
                    Found a bug? Email us with details at{' '}
                    <a
                      href="mailto:rakeshd01042024@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      rakeshd01042024@gmail.com
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">💡 Feature Suggestions</h4>
                  <p className="text-sm">
                    Have ideas for new features? We'd love to hear them! Send
                    your suggestions to our email.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">📊 Data Partnerships</h4>
                  <p className="text-sm">
                    Interested in data partnerships or API access? Contact us
                    for business inquiries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
