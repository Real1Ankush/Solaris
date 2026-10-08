import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { EmptyState } from "../components/shared/EmptyState";
import { DetectionOverlay } from "../components/camera/DetectionOverlay";
import { useInspectionHistory } from "../hooks/useInspectionHistory";
import { downloadInspectionReport } from "../lib/report";
import { formatDateTime, formatDuration } from "../lib/format";
import { DEFECT_COLORS } from "../lib/defectColors";

const OVERLAY = { showBoxes: true, showLabels: true, showConfidence: true, showZone: false };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="font-mono text-[9px] tracking-[0.14em] text-slate-600">{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums text-slate-200">{value}</p>
    </div>
  );
}

export default function InspectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { inspections, isLoading } = useInspectionHistory();
  const inspection = inspections.find((i) => i.id === id);

  if (isLoading) {
    return <div className="mx-auto max-w-[1400px] h-[420px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />;
  }

  if (!inspection) {
    return (
      <PageShell title="Inspection Detail" description={`No record found for ${id ?? "this inspection"}.`}>
        <Panel title="Not found">
          <EmptyState
            title="INSPECTION NOT FOUND"
            description="This inspection is not present in the current dataset."
            action={<Link to="/history" className="rounded-md border border-white/15 px-3.5 py-1.5 text-xs text-slate-200 hover:bg-white/[0.05]">Back to history</Link>}
          />
        </Panel>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={inspection.id}
      description={`${formatDateTime(inspection.startedAt)} · ${inspection.mode === "demo" ? "DEMO MODE" : "LIVE DATA"}`}
      actions={
        <div className="flex gap-2">
          <Link to="/history" className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3.5 py-2 text-xs text-slate-200 hover:bg-white/[0.05]">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
          </Link>
          <button type="button" onClick={() => downloadInspectionReport(inspection)} className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3.5 py-2 text-xs text-slate-200 hover:bg-white/[0.05]">
            <Download className="h-3.5 w-3.5" aria-hidden /> Report
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 divide-x divide-white/[0.06] overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10] sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="DURATION" value={formatDuration(inspection.durationSec)} />
          <Stat label="PANELS INSPECTED" value={String(inspection.panelsInspected)} />
          <Stat label="DEFECTS FOUND" value={String(inspection.defectsFound)} />
          <Stat label="CRITICAL" value={String(inspection.criticalDefects)} />
          <Stat label="MEAN CONFIDENCE" value={inspection.averageConfidence === null ? "NOT AVAILABLE" : `${(inspection.averageConfidence * 100).toFixed(1)}%`} />
          <Stat label="MODEL" value="YOLOv5n" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
          <Panel title="Inspection frames">
            <div className="p-4">
              {inspection.sourceImage ? (
                <div className="relative overflow-hidden rounded border border-white/[0.07] bg-black">
                  <img src={inspection.sourceImage} alt="Inspected panel" className="w-full" />
                  <DetectionOverlay detections={inspection.detections} options={OVERLAY} />
                </div>
              ) : (
                <EmptyState
                  title="NO FRAME STORED"
                  description="Camera inspection frames are not retained by the edge device. This session recorded metrics only."
                />
              )}
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="Defects">
              {inspection.detections.length === 0 ? (
                <EmptyState title="NO DEFECT RECORDS" description="Per-detection records were not retained for this session." />
              ) : (
                <ul className="divide-y divide-white/[0.06]">
                  {inspection.detections.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: DEFECT_COLORS[d.className] }} aria-hidden />
                        <span className="truncate text-xs text-slate-200">{d.className}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-400">{(d.confidence * 100).toFixed(1)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Timeline">
              <ol className="space-y-3 px-4 py-4">
                {[
                  { t: inspection.startedAt, label: "Session started", tone: "text-[#22d3ee]" },
                  { t: inspection.startedAt, label: `Camera acquisition opened (${"1280x720"})`, tone: "text-slate-400" },
                  { t: inspection.completedAt ?? inspection.startedAt, label: `${inspection.defectsFound} defects recorded`, tone: "text-[#ffb020]" },
                  { t: inspection.completedAt ?? inspection.startedAt, label: "Session closed", tone: "text-slate-400" },
                ].map((entry, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${entry.tone.replace("text-", "bg-")}`} aria-hidden />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-300">{entry.label}</p>
                      <p className="font-mono text-[10px] text-slate-600">{formatDateTime(entry.t)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>
      </div>
    </PageShell>
  );
}