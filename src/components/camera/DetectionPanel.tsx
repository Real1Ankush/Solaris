import { useMemo } from "react";
import type { Detection, DefectClass } from "../../types";
import { DEFECT_CLASSES } from "../../services/mockData";
import { DEFECT_COLORS } from "../../lib/defectColors";

function CurrentDetection({ detection }: { detection: Detection | null }) {
  if (!detection) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="font-mono text-xs tracking-[0.16em] text-slate-500">NO DETECTIONS</p>
        <p className="mt-1.5 text-[11px] text-slate-600">
          Start an inspection to populate the detection list.
        </p>
      </div>
    );
  }

  const color = DEFECT_COLORS[detection.className];

  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: color }} aria-hidden />
            <span className="truncate text-sm font-medium text-white">{detection.className}</span>
          </span>
          <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-slate-600">{detection.id}</p>
        </div>
        <span className="shrink-0 font-mono text-lg tabular-nums" style={{ color }}>
          {(detection.confidence * 100).toFixed(1)}%
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div>
          <dt className="text-slate-600">SEVERITY</dt>
          <dd className="uppercase text-slate-300">{detection.severity}</dd>
        </div>
        <div>
          <dt className="text-slate-600">SOURCE</dt>
          <dd className="uppercase text-slate-300">{detection.source}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[10px] leading-relaxed text-slate-600">
        Confidence is a per-detection model output, not a model accuracy score.
      </p>
    </div>
  );
}

export function DetectionPanel({
  detections, isDemo,
}: { detections: Detection[]; isDemo: boolean }) {
  const primary = useMemo(
    () => [...detections].sort((a, b) => b.confidence - a.confidence)[0] ?? null,
    [detections],
  );

  const summary = useMemo(() => {
    const counts = new Map<DefectClass, number>();
    for (const d of detections) counts.set(d.className, (counts.get(d.className) ?? 0) + 1);
    return DEFECT_CLASSES.map((className) => ({ className, count: counts.get(className) ?? 0 }));
  }, [detections]);

  const maxCount = Math.max(1, ...summary.map((s) => s.count));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]">
      <div className="border-b border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">CURRENT DETECTION</h3>
      </div>
      <CurrentDetection detection={primary} />

      <div className="border-t border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">DETECTION SUMMARY</h3>
      </div>
      <ul className="space-y-1.5 px-4 py-3">
        {summary.map(({ className, count }) => (
          <li key={className} className="flex items-center gap-2">
            <span className="w-[104px] shrink-0 truncate font-mono text-[10px] text-slate-500">
              {className}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className="block h-full rounded-full transition-[width] duration-300"
                style={{ width: `${(count / maxCount) * 100}%`, background: DEFECT_COLORS[className] }}
              />
            </span>
            <span className="w-6 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-300">
              {count}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">RECENT DETECTIONS</h3>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {detections.length === 0 ? (
          <p className="px-4 py-6 text-center font-mono text-[11px] text-slate-600">TIMELINE EMPTY</p>
        ) : (
          <ol className="divide-y divide-white/[0.05]">
            {detections.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DEFECT_COLORS[d.className] }} aria-hidden />
                  <span className="truncate text-xs text-slate-300">{d.className}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-500">
                  {(d.confidence * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {isDemo && (
        <p className="border-t border-white/[0.07] px-4 py-2 text-[10px] text-slate-600">
          Sample detections generated locally. No model has run.
        </p>
      )}
    </div>
  );
}