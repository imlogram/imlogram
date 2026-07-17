"use client";

import type { HistoryEntry } from "@/lib/use-history";
import { relativeTime } from "@/lib/relative-time";

const DIRECTION_LABEL: Record<string, string> = {
  old_to_new: "Eski → Yangi",
  new_to_old: "Yangi → Eski",
  cyrillic_to_latin: "Kirilcha → Yangi",
  latin_to_cyrillic: "Yangi → Kirilcha",
};

function truncate(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function HistoryPanel({
  entries,
  onLoad,
  onRemove,
  onClearAll,
}: {
  entries: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">Hali tarix boş.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">Tarix</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
        >
          Tarixni tozalaş
        </button>
      </div>
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-start gap-2 p-2.5 text-sm">
            <button
              type="button"
              onClick={() => onLoad(entry)}
              className="min-w-0 flex-1 text-left"
              title="Yuklaş"
            >
              <div className="truncate text-slate-700 dark:text-slate-300">{truncate(entry.output)}</div>
              <div className="mt-0.5 text-xs text-slate-400">
                {DIRECTION_LABEL[entry.direction] ?? entry.direction} · {relativeTime(entry.timestamp)}
              </div>
            </button>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="shrink-0 rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
              aria-label="Öçiriş"
              title="Öçiriş"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
