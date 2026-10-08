import { MEASURED_BENCHMARKS } from "../../services/mockData";
import type { StreamState } from "../../types";

function Cell({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "cyan" | "amber" }) {
  const toneClass = { default: "text-slate-200", cyan: "text-[#22d3ee]", amber: "text-[#ffb020]" }[tone];
  return (
    <div className="min-w-0 px-3 py-2.5">
      <dt className="truncate font-mono text-[9px] tracking-[0.14em] text-slate-600">{label}</dt>
      <dd className={`mt-0.5 truncate font-mono text-sm tabular-nums ${toneClass}`}>{value}</dd>
    </div>
  );
}

export function TelemetryBar({
  streamState, modelName, isRunning, elapsedSec,
}: { streamState: StreamState; modelName: string; isRunning: boolean; elapsedSec: number }) {
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]">
      <dl className="grid grid-cols-2 divide-x divide-white/[0.06] border-b border-white/[0.07] sm:grid-cols-4">
        <Cell label="SESSION FPS" value={isRunning && streamState === "live" ? "—" : "—"} tone="cyan" />
        <Cell
          label="INFERENCE LATENCY"
          value={isRunning && streamState === "live" ? "—" : "—"}
        />
        <Cell label="MODEL" value={modelName} tone="amber" />
        <Cell label="SESSION TIME" value={`${minutes}:${String(seconds).padStart(2, "0")}`} />
      </dl>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2">
        <span className="font-mono text-[9px] tracking-[0.14em] text-slate-600">MEASURED RPI4 DEPLOYMENT · NOT ACCURACY</span>
        <span className="font-mono text-[11px] text-slate-300">model-only {MEASURED_BENCHMARKS.modelOnlyFps} FPS</span>
        <span className="font-mono text-[11px] text-slate-300">{MEASURED_BENCHMARKS.modelOnlyLatencyMs} ms latency</span>
        <span className="font-mono text-[11px] text-slate-300">pipeline {MEASURED_BENCHMARKS.livePipelineFps} FPS</span>
      </div>
    </div>
  );
}