'use client';

import { useState, useEffect } from 'react';
import { FeedbackButton } from '@/components/FeedbackButton';

export function ClientFeedbackButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server, only after client mount
  if (!mounted) {
    return null;
  }

  return (
    <div suppressHydrationWarning>
      <FeedbackButton />
    </div>
  );
}
