"use client";

import { useState, useEffect, useCallback } from "react";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse watchlist:", e);
        setWatchlist([]);
      }
    }
    setMounted(true);
  }, []);

  // Listen for storage events (changes in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "watchlist" && e.newValue) {
        try {
          setWatchlist(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Failed to parse watchlist from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for custom events (changes in same tab/window)
  useEffect(() => {
    const handleWatchlistChange = (e: CustomEvent) => {
      setWatchlist(e.detail);
    };

    window.addEventListener(
      "watchlist-changed",
      handleWatchlistChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "watchlist-changed",
        handleWatchlistChange as EventListener
      );
  }, []);

  const addToWatchlist = useCallback((fundId: string) => {
    setWatchlist((prev) => {
      const updated = [...new Set([...prev, fundId])];
      localStorage.setItem("watchlist", JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("watchlist-changed", { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const removeFromWatchlist = useCallback((fundId: string) => {
    setWatchlist((prev) => {
      const updated = prev.filter((id) => id !== fundId);
      localStorage.setItem("watchlist", JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("watchlist-changed", { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const toggleWatchlist = useCallback((fundId: string) => {
    setWatchlist((prev) => {
      const isInList = prev.includes(fundId);
      const updated = isInList
        ? prev.filter((id) => id !== fundId)
        : [...new Set([...prev, fundId])];

      localStorage.setItem("watchlist", JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("watchlist-changed", { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const isInWatchlist = useCallback(
    (fundId: string) => watchlist.includes(fundId),
    [watchlist]
  );

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    mounted,
  };
}
