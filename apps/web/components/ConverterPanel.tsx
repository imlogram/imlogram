"use client";

import { useEffect, useMemo, useState } from "react";
import {
  convertToNew,
  convertToOld,
  convertCyrillicToLatin,
  convertLatinToCyrillic,
  detect,
  type ConversionDirection,
} from "@imlogram/core";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useHistory, type HistoryEntry } from "@/lib/use-history";
import { HistoryPanel } from "@/components/HistoryPanel";

type Mode = ConversionDirection | "auto";

const MODES: { value: Mode; label: string }[] = [
  { value: "auto", label: "Avtomatik aniqlaş" },
  { value: "old_to_new", label: "Eski → Yangi" },
  { value: "new_to_old", label: "Yangi → Eski" },
  { value: "cyrillic_to_latin", label: "Kirilcha → Yangi" },
  { value: "latin_to_cyrillic", label: "Yangi → Kirilcha" },
];

const DEBOUNCE_MS = 150;

// "Auto" only resolves between old- and new-Latin — detect() doesn't reason
// about Cyrillic, so those two modes are explicit-selection only.
function resolveDirection(text: string): ConversionDirection {
  const result = detect(text);
  // Mixed script text has no single "correct" target; default to the platform's
  // primary use case (finishing the migration to the new alphabet).
  if (result.classification === "old") return "old_to_new";
  if (result.classification === "new") return "new_to_old";
  return "old_to_new";
}

function runConversion(direction: ConversionDirection, text: string) {
  switch (direction) {
    case "old_to_new":
      return convertToNew(text);
    case "new_to_old":
      return convertToOld(text);
    case "cyrillic_to_latin":
      return convertCyrillicToLatin(text);
    case "latin_to_cyrillic":
      return convertLatinToCyrillic(text);
  }
}

function Spinner() {
  return (
    <span
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400"
      aria-hidden
    />
  );
}

export function ConverterPanel({ initialText = "" }: { initialText?: string }) {
  const [input, setInput] = useState(initialText);
  const [mode, setMode] = useState<Mode>("auto");
  const [showChanges, setShowChanges] = useState(true);
  const [copied, setCopied] = useState(false);

  const debouncedInput = useDebouncedValue(input, DEBOUNCE_MS);
  const isPending = input !== debouncedInput;

  const result = useMemo(() => {
    if (debouncedInput.trim().length === 0) return null;
    const direction = mode === "auto" ? resolveDirection(debouncedInput) : mode;
    return runConversion(direction, debouncedInput);
  }, [debouncedInput, mode]);

  const { entries, addEntry, removeEntry, clearAll } = useHistory();

  // Saved once a debounce settles (not on every keystroke) — this is the
  // client-side-only history described in /maxfiylik, never sent anywhere.
  // Guarded against `debouncedInput === initialText`: the homepage seeds the
  // textarea with a canned demo string, and without this check that demo
  // would get saved to every visitor's history on every page load.
  useEffect(() => {
    if (isPending || !result || debouncedInput === initialText) return;
    addEntry(result.direction, debouncedInput, result.text);
  }, [isPending, result, debouncedInput, initialText, addEntry]);

  function handleLoadHistory(entry: HistoryEntry) {
    setInput(entry.input);
    setMode(entry.direction as Mode);
  }

  // `changes` are {start,end} offsets into the *source* text with the exact
  // replacement string already computed, so the highlighted view is built by
  // walking the debounced input (not `result.text`) and splicing in each
  // replacement — no need to diff the converted output separately.
  const highlighted = useMemo(() => {
    if (!result || result.changes.length === 0) return null;
    const parts: { text: string; changed: boolean }[] = [];
    let cursor = 0;
    for (const change of result.changes) {
      if (change.start > cursor) {
        parts.push({ text: debouncedInput.slice(cursor, change.start), changed: false });
      }
      parts.push({ text: change.to, changed: true });
      cursor = change.end;
    }
    if (cursor < debouncedInput.length) {
      parts.push({ text: debouncedInput.slice(cursor), changed: false });
    }
    return parts;
  }, [result, debouncedInput]);

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              mode === m.value
                ? "border-brand-600 bg-brand-600 text-white shadow-soft"
                : "border-slate-300 text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Kiriş matni
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Matnni şu yerga yozing yoki joylaştiring..."
            className="h-64 w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-base transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-1 flex items-center gap-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Natija
            </label>
            {isPending && <Spinner />}
          </div>
          <div
            aria-live="polite"
            className={`h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-base transition-opacity duration-150 dark:border-slate-800 dark:bg-slate-900/50 ${
              isPending ? "opacity-60" : "opacity-100"
            }`}
          >
            {!result && <span className="text-slate-400">Natija şu yerda körinadi</span>}
            {result && showChanges && highlighted
              ? highlighted.map((part, i) =>
                  part.changed ? (
                    <mark
                      key={i}
                      className="rounded bg-brand-200/70 text-inherit dark:bg-brand-800/50"
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )
              : result?.text}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-4">
          {result ? (
            <span>
              {result.stats.charCount} belgi · {result.stats.wordCount} söz ·{" "}
              {result.stats.changedCount} özgariş · ~{result.stats.readingTimeSec} soniya öqiş
            </span>
          ) : (
            <span>0 belgi</span>
          )}
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={showChanges}
              onChange={(e) => setShowChanges(e.target.checked)}
              className="accent-brand-600"
            />
            Özgarişlarni körsatiş
          </label>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!result}
          className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300"
        >
          {copied ? "Nusxalandi ✓" : "Copy"}
        </button>
      </div>

      <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
        <HistoryPanel entries={entries} onLoad={handleLoadHistory} onRemove={removeEntry} onClearAll={clearAll} />
      </div>
    </div>
  );
}
