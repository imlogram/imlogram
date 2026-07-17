"use client";

import { useState } from "react";

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-[0.8125rem] leading-relaxed text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
        <code className={lang ? `language-${lang}` : undefined}>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md border border-slate-200 bg-white/90 px-2 py-1 text-xs font-medium text-slate-500 opacity-0 shadow-sm transition hover:text-brand-600 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-brand-300"
      >
        {copied ? "Nusxalandi ✓" : "Nusxalaş"}
      </button>
    </div>
  );
}
