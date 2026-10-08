import { Link } from "react-router-dom";
import { Camera, ExternalLink } from "lucide-react";
import type { DashboardData } from "../../types";
import { MEASURED_BENCHMARKS } from "../../services/mockData";

export function LivePreview({ data }: { data: DashboardData }) {
  const hasSignal = data.system.camera.streamState === "live";

  return (
    <section
      aria-label="Live inspection preview"
      className="flex flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">LIVE INSPECTION</h3>
        <Link
          to="/live-inspection"
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 transition-colors hover:text-[#ffb020]"
        >
          Open workspace <ExternalLink className="h-3 w-3" aria-hidden />
        </Link>
      </div>

      <div className="relative aspect-video w-full bg-[#050607]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,180,220,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,180,220,0.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {!hasSignal && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <Camera className="h-7 w-7 text-slate-600" aria-hidden />
            <p className="font-mono text-xs tracking-[0.18em] text-slate-400">NO CAMERA SIGNAL</p>
            <p className="max-w-xs text-[11px] leading-relaxed text-slate-600">
              Preview activates when a Raspberry Pi camera stream is connected. Nothing is being
              transmitted or inferred right now.
            </p>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-slate-400">
          {hasSignal ? "LIVE" : "DEMO · NO SIGNAL"}
        </span>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.07]">
        <div className="px-3 py-2.5">
          <dt className="font-mono text-[9px] tracking-[0.14em] text-slate-600">PIPELINE</dt>
          <dd className="mt-0.5 font-mono text-sm tabular-nums text-[#22d3ee]">
            {MEASURED_BENCHMARKS.livePipelineFps} FPS
          </dd>
        </div>
        <div className="px-3 py-2.5">
          <dt className="font-mono text-[9px] tracking-[0.14em] text-slate-600">INFERENCE</dt>
          <dd className="mt-0.5 font-mono text-sm tabular-nums text-slate-200">
            {MEASURED_BENCHMARKS.modelOnlyLatencyMs} ms
          </dd>
        </div>
        <div className="px-3 py-2.5">
          <dt className="font-mono text-[9px] tracking-[0.14em] text-slate-600">MODEL</dt>
          <dd className="mt-0.5 font-mono text-sm text-slate-200">{data.model.name}</dd>
        </div>
      </dl>
      <p className="border-t border-white/[0.06] px-4 py-2 text-[10px] leading-relaxed text-slate-600">
        Measured Raspberry Pi 4 deployment throughput and latency. Not accuracy.
      </p>
    </section>
  );
}