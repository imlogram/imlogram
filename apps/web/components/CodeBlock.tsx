export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-[0.8125rem] leading-relaxed text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
      <code className={lang ? `language-${lang}` : undefined}>{code}</code>
    </pre>
  );
}
