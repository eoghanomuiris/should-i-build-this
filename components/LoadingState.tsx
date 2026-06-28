export function LoadingState() {
  return (
    <div className="py-8" aria-live="polite" aria-busy="true">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-600">
          Analyzing market, competition, and feasibility…
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl bg-slate-200/70"
          />
        ))}
      </div>
    </div>
  );
}
