"use client";

import { useMemo, useState } from "react";
import { detect } from "@imlogram/core";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const LABELS: Record<string, string> = {
  old: "Eski alifbo",
  new: "Yangi alifbo",
  mixed: "Aralaş yozuv",
};

const BADGE_CLASS: Record<string, string> = {
  old: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  new: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  mixed: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

const DEBOUNCE_MS = 150;

function Spinner() {
  return (
    <span
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400"
      aria-hidden
    />
  );
}

export function DetectorPanel() {
  const [input, setInput] = useState(
    "Bu shahar juda chiroyli. Bu şahar esa juda gözal — ikkalasi ham bir xil ma'noni bildiradi.",
  );

  const debouncedInput = useDebouncedValue(input, DEBOUNCE_MS);
  const isPending = input !== debouncedInput;

  const result = useMemo(
    () => (debouncedInput.trim().length > 0 ? detect(debouncedInput) : null),
    [debouncedInput],
  );

  const parts = useMemo(() => {
    if (!result || result.segments.length === 0) return null;
    const out: { text: string; classification?: "old" | "new" }[] = [];
    let cursor = 0;
    for (const seg of result.segments) {
      if (seg.start > cursor) out.push({ text: debouncedInput.slice(cursor, seg.start) });
      out.push({ text: debouncedInput.slice(seg.start, seg.end), classification: seg.classification });
      cursor = seg.end;
    }
    if (cursor < debouncedInput.length) out.push({ text: debouncedInput.slice(cursor) });
    return out;
  }, [result, debouncedInput]);

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        className="w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-base transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-700 dark:bg-slate-900"
      />

      {result && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${BADGE_CLASS[result.classification]}`}>
              {LABELS[result.classification]}
            </span>
            <span className="text-sm text-slate-500">
              Işonç: {Math.round(result.confidence * 100)}%
            </span>
            {isPending && <Spinner />}
          </div>

          <div
            aria-live="polite"
            className={`whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-base transition-opacity duration-150 dark:border-slate-800 dark:bg-slate-900/50 ${
              isPending ? "opacity-60" : "opacity-100"
            }`}
          >
            {parts
              ? parts.map((part, i) =>
                  part.classification ? (
                    <mark
                      key={i}
                      className={
                        part.classification === "old"
                          ? "rounded bg-amber-200/60 text-inherit dark:bg-amber-800/40"
                          : "rounded bg-emerald-200/60 text-inherit dark:bg-emerald-800/40"
                      }
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )
              : debouncedInput}
          </div>
        </div>
      )}
    </div>
  );
}
