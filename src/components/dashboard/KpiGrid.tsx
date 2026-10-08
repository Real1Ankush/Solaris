import type { DashboardMetrics } from "../../types";
import { formatUptime } from "../../lib/format";

interface Props {
  metrics: DashboardMetrics;
  isDemo: boolean;
}

function Kpi({
  label, value, sub, accent = "default",
}: { label: string; value: string; sub: string; accent?: "default" | "amber" | "rose" | "cyan" }) {
  const accentClass = {
    default: "text-white",
    amber: "text-[#ffb020]",
    rose: "text-rose-300",
    cyan: "text-[#22d3ee]",
  }[accent];

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10] p-4 transition-colors duration-200 hover:border-white/[0.14]">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] leading-tight tracking-[0.16em] text-slate-500">{label}</span>
        <span className="h-1 w-1 rounded-full bg-white/20 transition-colors group-hover:bg-[#ffb020]" aria-hidden />
      </div>
      <p className={`mt-3 font-mono text-2xl tabular-nums ${accentClass}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-500">{sub}</p>
    </div>
  );
}

export function KpiGrid({ metrics, isDemo }: Props) {
  const demoNote = isDemo ? " · demo data" : "";

  return (
    <section aria-label="Key metrics">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          label="PANELS INSPECTED"
          value={metrics.panelsInspected.toLocaleString()}
          sub={`Across ${metrics.inspectionSessions} sessions${demoNote}`}
          accent="cyan"
        />
        <Kpi
          label="DEFECTS DETECTED"
          value={metrics.defectsDetected.toLocaleString()}
          sub="All five classes, camera + uploads"
          accent="amber"
        />
        <Kpi
          label="CRITICAL DEFECTS"
          value={metrics.criticalDefects.toLocaleString()}
          sub="Electrical-Damage and Physical Damage"
          accent="rose"
        />
        <Kpi
          label="AVERAGE CONFIDENCE"
          value={metrics.averageConfidence === null ? "—" : `${(metrics.averageConfidence * 100).toFixed(1)}%`}
          sub="Mean per-detection confidence — not model accuracy"
        />
        <Kpi
          label="INSPECTION SESSIONS"
          value={metrics.inspectionSessions.toLocaleString()}
          sub="Recorded in current dataset"
          accent="cyan"
        />
        <Kpi
          label="SYSTEM UPTIME"
          value={metrics.systemUptimeSec > 0 ? formatUptime(metrics.systemUptimeSec) : "—"}
          sub={metrics.systemUptimeSec > 0 ? "Device uptime" : "No device attached to report uptime"}
        />
      </div>
    </section>
  );
}