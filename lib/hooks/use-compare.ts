"use client";

import { useState, useEffect, useCallback } from "react";

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load compare list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("compareList");
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse compareList:", e);
        setCompareList([]);
      }
    }
    setMounted(true);
  }, []);

  // Listen for storage events (changes in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "compareList" && e.newValue) {
        try {
          setCompareList(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            "Failed to parse compareList from storage event:",
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for custom events (changes in same tab/window)
  useEffect(() => {
    const handleCompareChange = (e: CustomEvent) => {
      setCompareList(e.detail);
    };

    window.addEventListener(
      "compare-changed",
      handleCompareChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "compare-changed",
        handleCompareChange as EventListener
      );
  }, []);

  const addToCompare = useCallback((fundId: string) => {
    setCompareList((prev) => {
      if (prev.length >= 3) return prev;
      const updated = [...new Set([...prev, fundId])];
      localStorage.setItem("compareList", JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("compare-changed", { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const removeFromCompare = useCallback((fundId: string) => {
    setCompareList((prev) => {
      const updated = prev.filter((id) => id !== fundId);
      localStorage.setItem("compareList", JSON.stringify(updated));

      // Dispatch custom event for same-tab updates (defer to avoid setState during render)
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("compare-changed", { detail: updated })
        );
      }, 0);

      return updated;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    localStorage.removeItem("compareList");

    // Dispatch custom event for same-tab updates (defer to avoid setState during render)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("compare-changed", { detail: [] }));
    }, 0);
  }, []);

  const isInCompare = useCallback(
    (fundId: string) => compareList.includes(fundId),
    [compareList]
  );

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    mounted,
  };
}
