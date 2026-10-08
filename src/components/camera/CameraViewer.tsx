import { useCameraStream } from "../../hooks/useCameraStream";
import type { CameraSource } from "../../services/stream";
import type { Detection, StreamState } from "../../types";
import { DetectionOverlay, type OverlayOptions } from "./DetectionOverlay";

const STATE_STYLES: Record<StreamState, { label: string; className: string }> = {
  live: { label: "LIVE", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  demo: { label: "DEMO", className: "border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020]" },
  disconnected: { label: "DISCONNECTED", className: "border-rose-500/40 bg-rose-500/10 text-rose-300" },
};

function DemoFrame() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#060809]">
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,180,220,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(148,180,220,0.30) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          transform: "perspective(700px) rotateX(58deg) scale(1.6) translateY(18%)",
          transformOrigin: "50% 100%",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 50% 20%, rgba(255,176,32,0.10), transparent 65%)" }}
      />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 whitespace-nowrap font-mono text-2xl tracking-[0.3em] text-white/[0.06]">
        DEMO FEED
      </span>
    </div>
  );
}

export function CameraViewer({
  source, detections, options, streamState, resolution,
}: {
  source: CameraSource;
  detections: Detection[];
  options: OverlayOptions;
  streamState: StreamState;
  resolution: string;
}) {
  const { snapshotUrl, error, state } = useCameraStream(source, streamState);
  const badge = STATE_STYLES[state];

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]">
      <div className="relative aspect-video w-full bg-black">
        {source.kind === "none" ? (
          <DemoFrame />
        ) : source.kind === "mjpeg" && source.url ? (
          <img src={source.url} alt="Live camera stream from the inspection rover" className="h-full w-full object-cover" />
        ) : snapshotUrl ? (
          <img src={snapshotUrl} alt="Camera snapshot from the inspection rover" className="h-full w-full object-cover" />
        ) : null}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6 text-center">
            <p role="alert" className="max-w-sm font-mono text-[11px] leading-relaxed text-rose-300">{error}</p>
          </div>
        )}

        <DetectionOverlay detections={detections} options={options} />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
          <span className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] ${badge.className}`}>
            {badge.label}
          </span>
          {state === "demo" && (
            <span className="rounded border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-slate-400">
              NOT A REAL FEED
            </span>
          )}
        </div>

        <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-slate-400">
          {resolution}
        </span>
      </div>
    </div>
  );
}