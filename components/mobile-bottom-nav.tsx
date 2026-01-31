'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Search, Bot, Newspaper } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Funds', icon: TrendingUp, href: '/equity' },
    { label: 'Search', icon: Search, href: '/search-mobile' },
    { label: 'News', icon: Newspaper, href: '/news' },
    { label: 'AI Chat', icon: Bot, href: '/chat' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-pb">
      <nav className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${active ? 'scale-110' : ''}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium ${
                  active ? 'font-semibold' : ''
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
