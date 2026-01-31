'use client';

import React from 'react';
import { useTranslation, LANGUAGES } from '@/contexts/TranslationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages, Check, Globe2 } from 'lucide-react';

// Language flag emojis
const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇺🇸',
  hi: '🇮🇳',
  mr: '🇮🇳',
  gu: '🇮🇳',
  ta: '🇮🇳',
  te: '🇮🇳',
  kn: '🇮🇳',
  bn: '🇮🇳',
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const currentLang = LANGUAGES[language as keyof typeof LANGUAGES];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-0 w-10 h-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
          aria-label="Change language"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all">
            <span className="text-white font-bold text-lg">
              {currentLang?.code.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 bg-white dark:bg-gray-900 shadow-2xl border-2 border-blue-100 dark:border-blue-900 rounded-2xl p-2"
      >
        <DropdownMenuLabel className="flex items-center gap-3 text-base font-bold text-blue-900 dark:text-blue-100 px-3 py-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Languages className="h-4 w-4 text-white" />
          </div>
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-100 dark:bg-blue-900 my-2" />
        {Object.values(LANGUAGES).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all ${
              language === lang.code
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50'
                : 'hover:bg-blue-50 dark:hover:bg-blue-950/30'
            }`}
          >
            <span className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                <span className="text-white font-bold text-lg">
                  {lang.code.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {lang.nativeName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {lang.name}
                </span>
              </div>
            </span>
            {language === lang.code && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
                <Check className="h-4 w-4 text-white font-bold" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
