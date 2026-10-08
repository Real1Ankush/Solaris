import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { useLiveInspection } from "../hooks/useLiveInspection";
import { MEASURED_BENCHMARKS } from "../services/mockData";
import { DEFECT_COLORS } from "../lib/defectColors";

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-[#0b0d10] p-4">
      <p className="font-mono text-[10px] tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular-nums text-white">{value}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-500">{note}</p>
    </div>
  );
}

export default function ModelPage() {
  const model = useLiveInspection().model;

  return (
    <PageShell title="Model" description="YOLOv5n deployment characteristics on Raspberry Pi 4.">
      <div className="space-y-4">
        <Panel title="Measured deployment performance" meta={<span className="font-mono text-[10px] text-slate-600">RASPBERRY PI 4</span>}>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Metric label="MODEL-ONLY THROUGHPUT" value={`${MEASURED_BENCHMARKS.modelOnlyFps} FPS`} note="Frames per second with inference alone." />
              <Metric label="MODEL-ONLY LATENCY" value={`${MEASURED_BENCHMARKS.modelOnlyLatencyMs} ms`} note="Average inference time per frame." />
              <Metric label="LIVE PIPELINE THROUGHPUT" value={`${MEASURED_BENCHMARKS.livePipelineFps} FPS`} note="End-to-end camera pipeline rate." />
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
              These are measured throughput and latency figures for this deployment on Raspberry Pi 4.
              They are not accuracy measurements. Source: {MEASURED_BENCHMARKS.source}.
            </p>
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Evaluation metrics">
            <div className="divide-y divide-white/[0.06]">
              {["mAP@0.5", "Precision", "Recall", "F1"].map((label) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="font-mono text-xs tracking-[0.12em] text-slate-500">NOT CONFIGURED</span>
                </div>
              ))}
            </div>
            <p className="border-t border-white/[0.07] px-4 py-2.5 text-[10px] leading-relaxed text-slate-600">
              No evaluation run has been configured for this deployment. These values are intentionally
              absent rather than estimated.
            </p>
          </Panel>

          <Panel title="Model configuration">
            <div className="divide-y divide-white/[0.06]">
              {[
                ["Architecture", model?.name ?? "YOLOv5n"],
                ["Runtime", model?.runtime ?? "Raspberry Pi 4"],
                ["Version", model?.version ?? "NOT AVAILABLE"],
                ["Weights", model?.weightsLoaded ? "LOADED" : "NOT LOADED"],
                ["Confidence threshold", model?.confidenceThreshold.toFixed(2) ?? "0.45"],
                ["IoU threshold", model?.iouThreshold.toFixed(2) ?? "0.45"],
                ["Camera stack", "Picamera2"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">{label.toUpperCase()}</span>
                  <span className="font-mono text-xs text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Detected classes">
          <ul className="grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
            {(model?.classes ?? []).map((className) => (
              <li key={className} className="flex items-center gap-2 bg-[#0b0d10] px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: DEFECT_COLORS[className] }} aria-hidden />
                <span className="truncate text-xs text-slate-200">{className}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </PageShell>
  );
}