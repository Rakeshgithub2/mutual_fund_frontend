'use client';

import Link from 'next/link';
import {
  Mail,
  FileText,
  Shield,
  Info,
  HelpCircle,
  Database,
  Workflow,
  MessageSquare,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { name: 'Disclaimer', href: '/disclaimer', icon: Shield },
    { name: 'Privacy Policy', href: '/privacy', icon: FileText },
    { name: 'Terms & Conditions', href: '/terms', icon: FileText },
  ];

  const aboutLinks = [
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'How It Works', href: '/how-it-works', icon: Workflow },
    { name: 'Data Source', href: '/data-source', icon: Database },
  ];

  const supportLinks = [
    { name: 'Help / FAQs', href: '/help', icon: HelpCircle },
    { name: 'Contact Us', href: '/contact', icon: Mail },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">MF</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                MF Analyzer
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Your comprehensive mutual fund analysis platform. Make informed
              investment decisions with powerful tools and insights.
            </p>
            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <a
                  href="mailto:rakeshd01042024@gmail.com"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  rakeshd01042024@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-600">📱</span>
                <a
                  href="tel:+919740104978"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  +91 9740104978
                </a>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center leading-relaxed">
              <strong>Disclaimer:</strong> This platform is for educational and
              informational purposes only. Mutual fund investments are subject
              to market risks. Please read all scheme-related documents
              carefully before investing. Past performance is not indicative of
              future results. Consult with a qualified financial advisor before
              making investment decisions.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} MF Analyzer. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Made with ❤️ for Indian investors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
