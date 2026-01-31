'use client';

import { useState, useEffect, useCallback } from 'react';

export function useOverlap() {
  const [overlapList, setOverlapList] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load overlap list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('overlapList');
    if (saved) {
      try {
        setOverlapList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse overlapList:', e);
        setOverlapList([]);
      }
    }
    setMounted(true);
  }, []);

  // Listen for storage events (changes in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'overlapList' && e.newValue) {
        try {
          setOverlapList(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            'Failed to parse overlapList from storage event:',
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events (changes in same tab/window)
  useEffect(() => {
    const handleOverlapChange = (e: CustomEvent) => {
      setOverlapList(e.detail);
    };

    window.addEventListener(
      'overlap-changed',
      handleOverlapChange as EventListener
    );
    return () =>
      window.removeEventListener(
        'overlap-changed',
        handleOverlapChange as EventListener
      );
  }, []);

  const addToOverlap = useCallback((fundId: string) => {
    setOverlapList((prev) => {
      if (prev.length >= 5) return prev; // Max 5 funds for overlap
      const updated = [...new Set([...prev, fundId])];
      localStorage.setItem('overlapList', JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('overlap-changed', { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const removeFromOverlap = useCallback((fundId: string) => {
    setOverlapList((prev) => {
      const updated = prev.filter((id) => id !== fundId);
      localStorage.setItem('overlapList', JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('overlap-changed', { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const clearOverlapList = useCallback(() => {
    setOverlapList([]);
    localStorage.removeItem('overlapList');

    // Dispatch custom event for same-tab updates (defer to avoid setState during render)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('overlap-changed', { detail: [] }));
    }, 0);
  }, []);

  const isInOverlap = useCallback(
    (fundId: string) => {
      return overlapList.includes(fundId);
    },
    [overlapList]
  );

  return {
    overlapList,
    addToOverlap,
    removeFromOverlap,
    clearOverlapList,
    isInOverlap,
    mounted,
  };
}
