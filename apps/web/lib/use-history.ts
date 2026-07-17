"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "imlogram:history";
const MAX_ENTRIES = 20;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  direction: string;
  input: string;
  output: string;
}

function load(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable (e.g. private browsing) — history
    // just won't persist across reloads, nothing to recover from here.
  }
}

/**
 * Client-side-only conversion history — nothing is ever sent to a server
 * (matches the "your text isn't stored by default" stance in /maxfiylik).
 */
export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(load());
  }, []);

  const addEntry = useCallback((direction: string, input: string, output: string) => {
    setEntries((prev) => {
      if (prev[0]?.input === input && prev[0]?.direction === direction) return prev;
      const next = [{ id: crypto.randomUUID(), timestamp: Date.now(), direction, input, output }, ...prev].slice(
        0,
        MAX_ENTRIES,
      );
      persist(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    persist([]);
  }, []);

  return { entries, addEntry, removeEntry, clearAll };
}
