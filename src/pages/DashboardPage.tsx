import { RefreshCw } from "lucide-react";
import { PageShell } from "../components/shell/PageShell";
import { StatusStrip } from "../components/dashboard/StatusStrip";
import { KpiGrid } from "../components/dashboard/KpiGrid";
import { LivePreview } from "../components/dashboard/LivePreview";
import { DefectDistribution } from "../components/dashboard/DefectDistribution";
import { RecentInspections } from "../components/dashboard/RecentInspections";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardPage() {
  const { data, isLoading, error, reload, mode } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <PageShell
      title="Operations Dashboard"
      description="Inspection telemetry, defect distribution and session history across the solar asset."
      actions={
        <button
          type="button"
          onClick={() => void reload()}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/[0.05]"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Refresh
        </button>
      }
    >
      {error && (
        <div role="alert" className="mb-4 rounded-md border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {data ? (
        <div className="space-y-4">
          {mode === "demo" && (
            <p className="rounded-md border border-[#ffb020]/25 bg-[#ffb020]/5 px-4 py-2.5 text-xs leading-relaxed text-[#ffb020]">
              <strong className="font-semibold">DEMO MODE</strong> — no Raspberry Pi backend is
              connected. All figures below are illustrative sample data, not measurements from a
              device.
            </p>
          )}

          <StatusStrip data={data} />
          <KpiGrid metrics={data.metrics} isDemo={mode === "demo"} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <LivePreview data={data} />
            <DefectDistribution data={data} />
          </div>

          <RecentInspections data={data} />
        </div>
      ) : (
        <div className="rounded-lg border border-white/[0.07] bg-[#0b0d10] px-6 py-14 text-center">
          <p className="font-mono text-xs tracking-[0.18em] text-slate-400">NO DATA AVAILABLE</p>
          <p className="mt-2 text-sm text-slate-500">
            The dashboard could not load. Check the system page for backend connectivity.
          </p>
        </div>
      )}
    </PageShell>
  );
}