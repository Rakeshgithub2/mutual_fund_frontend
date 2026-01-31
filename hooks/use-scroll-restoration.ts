'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to save and restore scroll position
 * Works with browser back button and custom back navigation
 *
 * Usage:
 * const { saveScrollPosition, restoreScrollPosition } = useScrollRestoration();
 *
 * // Call before navigating away
 * saveScrollPosition();
 *
 * // Or let it auto-restore on mount
 */
export function useScrollRestoration(key?: string) {
  const pathname = usePathname();
  const scrollKey = key || `scroll:${pathname}`;
  const hasRestored = useRef(false);

  // Save scroll position to sessionStorage
  const saveScrollPosition = useCallback(() => {
    const scrollY = window.scrollY;
    if (scrollY > 0) {
      sessionStorage.setItem(scrollKey, String(scrollY));
      console.log(`💾 Saved scroll position: ${scrollY}px for ${scrollKey}`);
    }
  }, [scrollKey]);

  // Restore scroll position from sessionStorage
  const restoreScrollPosition = useCallback(() => {
    const saved = sessionStorage.getItem(scrollKey);
    if (saved && !hasRestored.current) {
      const scrollY = parseInt(saved, 10);
      if (!isNaN(scrollY) && scrollY > 0) {
        // Use requestAnimationFrame for smooth restoration after content loads
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: 'instant' });
          console.log(
            `📍 Restored scroll position: ${scrollY}px for ${scrollKey}`
          );
        });
        hasRestored.current = true;
      }
    }
  }, [scrollKey]);

  // Clear saved scroll position
  const clearScrollPosition = useCallback(() => {
    sessionStorage.removeItem(scrollKey);
    hasRestored.current = false;
  }, [scrollKey]);

  // Auto-save on scroll (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [saveScrollPosition]);

  // Save before unload (browser navigation)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveScrollPosition]);

  // Reset restored flag when pathname changes
  useEffect(() => {
    hasRestored.current = false;
  }, [pathname]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}

/**
 * Hook to restore scroll position after data loads
 * Pass the loading state and it will restore after loading completes
 */
export function useScrollRestorationOnLoad(
  loading: boolean,
  dataLength: number
) {
  const { restoreScrollPosition } = useScrollRestoration();
  const hasData = useRef(false);

  useEffect(() => {
    // Only restore after first data load
    if (!loading && dataLength > 0 && !hasData.current) {
      hasData.current = true;
      // Small delay to ensure DOM is rendered
      setTimeout(restoreScrollPosition, 50);
    }
  }, [loading, dataLength, restoreScrollPosition]);

  // Reset when navigating away
  useEffect(() => {
    return () => {
      hasData.current = false;
    };
  }, []);
}

export default useScrollRestoration;
