'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Translation types
type TranslationKeys = Record<string, any>;

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translations: TranslationKeys;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

// Supported languages
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
};

// Helper function to get nested translation
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return the key if translation not found
    }
  }

  return typeof result === 'string' ? result : path;
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en');
  const [translations, setTranslations] = useState<TranslationKeys>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        } else {
          console.error(
            `Failed to load translations for language: ${language}`
          );
          // Fallback to English if loading fails
          if (language !== 'en') {
            const fallbackResponse = await fetch('/locales/en.json');
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              setTranslations(fallbackData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage in LANGUAGES) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  const setLanguage = (lang: string) => {
    if (lang in LANGUAGES) {
      setLanguageState(lang);
      localStorage.setItem('preferred-language', lang);

      // Update HTML lang attribute
      document.documentElement.lang = lang;
    }
  };

  // Translation function
  const t = (key: string): string => {
    if (isLoading) return key;
    return getNestedTranslation(translations, key);
  };

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, t, translations }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Hook for specific namespace
export function useTranslations(namespace: string) {
  const { t } = useTranslation();

  return (key: string) => t(`${namespace}.${key}`);
}
