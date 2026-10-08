import { Download, Play, RotateCcw, Save } from "lucide-react";
import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { DemoNotice } from "../components/shared/EmptyState";
import { UploadDropzone } from "../components/analyze/UploadDropzone";
import { DetectionOverlay, type OverlayOptions } from "../components/camera/DetectionOverlay";
import { useImageAnalysis } from "../hooks/useImageAnalysis";
import { downloadInspectionReport } from "../lib/report";
import { DEFECT_COLORS } from "../lib/defectColors";

const OVERLAY: OverlayOptions = { showBoxes: true, showLabels: true, showConfidence: true, showZone: false };
const button =
  "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

export default function AnalyzePage() {
  const a = useImageAnalysis();

  return (
    <PageShell
      title="Analyze"
      description="Upload a panel image and run detection on a static frame."
    >
      <div className="space-y-4">
        <DemoNotice>
          detection here runs against generated sample output. No model inference is performed until
          a backend is connected.
        </DemoNotice>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Panel title="Source image">
            <div className="p-4">
              {!a.previewUrl ? (
                <UploadDropzone onFile={a.acceptFile} hasFile={false} />
              ) : (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded border border-white/[0.07] bg-black">
                    <img src={a.previewUrl} alt={`Uploaded panel image ${a.file?.name ?? ""}`} className="w-full" />
                    <DetectionOverlay detections={a.detections} options={OVERLAY} />
                    {a.isRunning && (
                      <div className="absolute inset-0 grid place-items-center bg-black/70">
                        <span className="font-mono text-xs tracking-[0.18em] text-[#ffb020]">PROCESSING…</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={a.runDetection}
                      disabled={a.isRunning}
                      className={`${button} border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020] hover:bg-[#ffb020]/20`}
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden />
                      {a.isRunning ? "Running…" : a.detections.length ? "Run Detection Again" : "Run Detection"}
                    </button>
                    <button type="button" onClick={a.reset} className={`${button} border-white/15 text-slate-200 hover:bg-white/[0.05]`}>
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={a.saveInspection}
                      disabled={!a.detections.length}
                      className={`${button} border-white/15 text-slate-200 hover:bg-white/[0.05]`}
                    >
                      <Save className="h-3.5 w-3.5" aria-hidden />
                      Save Inspection
                    </button>
                    <button
                      type="button"
                      onClick={() => a.inspection && downloadInspectionReport(a.inspection)}
                      disabled={!a.inspection}
                      className={`${button} border-white/15 text-slate-200 hover:bg-white/[0.05]`}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden />
                      Download Report
                    </button>
                  </div>

                  {a.savedId && (
                    <p role="status" className="font-mono text-[11px] text-emerald-300">
                      {a.savedId} staged in memory — not persisted while in DEMO MODE.
                    </p>
                  )}
                </div>
              )}

              {a.error && (
                <p role="alert" className="mt-3 rounded-md border border-rose-500/25 bg-rose-500/5 px-3 py-2 text-xs text-rose-200">
                  {a.error}
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Result">
            {a.detections.length === 0 ? (
              <p className="px-6 py-12 text-center font-mono text-[11px] tracking-[0.16em] text-slate-600">
                NO DETECTIONS
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {a.detections.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: DEFECT_COLORS[d.className] }} aria-hidden />
                      <span className="truncate text-xs text-slate-200">{d.className}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-slate-400">
                      {(d.confidence * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}