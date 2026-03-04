import { useState, useCallback } from "react";

const STORAGE_KEY = "promtree:search-history";
const MAX_ENTRIES = 10;

export interface SearchHistoryEntry {
  url: string;
  hostname: string;
  timestamp: number;
}

function load(): SearchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(entries: SearchHistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>(load);

  const addEntry = useCallback((url: string) => {
    setHistory((prev) => {
      const hostname = new URL(url).hostname;
      const next = [
        { url, hostname, timestamp: Date.now() },
        ...prev.filter((e) => e.url !== url),
      ].slice(0, MAX_ENTRIES);
      save(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((url: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.url !== url);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
