export default function ConverterLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-32 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="flex gap-2">
        <div className="h-8 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-[13.5rem] rounded-lg bg-slate-100 dark:bg-slate-900" />
        <div className="h-[13.5rem] rounded-lg bg-slate-100 dark:bg-slate-900" />
      </div>
      <div className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
