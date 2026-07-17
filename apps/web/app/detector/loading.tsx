export default function DetectorLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-28 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-900" />
      <div className="flex gap-3">
        <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-24 rounded-lg bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}
