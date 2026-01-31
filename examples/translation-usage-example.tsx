// Translation Hook Example - Use this pattern in your components

'use client';

import { useTranslation, useTranslations } from '@/contexts/TranslationContext';

export function ExampleComponent() {
  // Method 1: Use the full translation function
  const { t } = useTranslation();

  // Access nested translations
  const title = t('fundManager.title'); // "Fund Managers"
  const subtitle = t('fundManager.subtitle'); // "Meet the experts managing your investments"

  // Method 2: Use namespace-specific translation
  const tFund = useTranslations('fundManager');

  const experience = tFund('experience'); // "Experience"
  const fundsManaged = tFund('fundsManaged'); // "Funds Managed"

  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div>
        <span>{experience}</span>
        <span>{fundsManaged}</span>
      </div>
    </div>
  );
}

// Pattern for dynamic content:
export function DynamicExample() {
  const { t, language } = useTranslation();

  // Get current language
  console.log('Current language:', language); // 'en', 'hi', or 'es'

  // Common translations
  const commonT = useTranslations('common');

  return (
    <div>
      <button>{commonT('save')}</button>
      <button>{commonT('cancel')}</button>
      <input placeholder={commonT('search')} />
    </div>
  );
}
