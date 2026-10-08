export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-4" role="status" aria-live="polite" aria-label="Loading dashboard">
      <div className="h-[104px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[108px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="h-[320px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
        <div className="h-[320px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
      </div>
      <div className="h-[280px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
      <span className="sr-only">Loading dashboard data…</span>
    </div>
  );
}