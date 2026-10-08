import type { OverlayOptions } from "./DetectionOverlay";
import type { ModelMetrics } from "../../types";

const RESOLUTIONS = ["640x480", "1280x720", "1920x1080"] as const;
const CAMERAS = ["picamera2 (main)", "picamera2 (wide)", "USB webcam"] as const;

function Toggle({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-slate-300">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-white/[0.04] accent-[#ffb020]"
      />
    </label>
  );
}

function Slider({
  label, value, min, max, step, onChange,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block py-2">
      <span className="flex items-center justify-between text-xs text-slate-300">
        {label}
        <span className="font-mono tabular-nums text-slate-400">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-[#ffb020]"
 />
    </label>
  );
}

export function InspectionSettings({
  model, camera, resolution, confidenceThreshold, iouThreshold, options, isLive,
  onCameraChange, onResolutionChange, onConfidenceChange, onIouChange, onOptionsChange,
}: {
  model: ModelMetrics;
  camera: string;
  resolution: string;
  confidenceThreshold: number;
  iouThreshold: number;
  options: OverlayOptions;
  isLive: boolean;
  onCameraChange: (v: string) => void;
  onResolutionChange: (v: string) => void;
  onConfidenceChange: (v: number) => void;
  onIouChange: (v: number) => void;
  onOptionsChange: (o: OverlayOptions) => void;
}) {
  const select =
    "w-full rounded-md border border-white/10 bg-[#0f1216] px-2.5 py-1.5 font-mono text-xs text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb020] disabled:opacity-50";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <fieldset className="space-y-2">
        <legend className="font-mono text-[10px] tracking-[0.16em] text-slate-500">CAPTURE</legend>
        <label className="block">
          <span className="mb-1 block text-[11px] text-slate-400">Camera</span>
          <select className={select} value={camera} onChange={(e) => onCameraChange(e.target.value)} disabled={!isLive}>
            {CAMERAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-slate-400">Resolution</span>
          <select className={select} value={resolution} onChange={(e) => onResolutionChange(e.target.value)} disabled={!isLive}>
            {RESOLUTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-slate-400">Model</span>
          <select className={select} value={model.name} disabled>
            <option value={model.name}>{model.name}</option>
          </select>
        </label>
</fieldset>

      <fieldset className="space-y-1">
        <legend className="font-mono text-[10px] tracking-[0.16em] text-slate-500">DETECTION</legend>
        <Slider label="Confidence threshold" value={confidenceThreshold} min={0.1} max={0.9} step={0.01} onChange={onConfidenceChange} />
        <Slider label="IoU threshold" value={iouThreshold} min={0.1} max={0.9} step={0.01} onChange={onIouChange} />
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className="font-mono text-[10px] tracking-[0.16em] text-slate-500">OVERLAY</legend>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          <Toggle label="Show Bounding Boxes" checked={options.showBoxes} onChange={(v) => onOptionsChange({ ...options, showBoxes: v })} />
          <Toggle label="Show Labels" checked={options.showLabels} onChange={(v) => onOptionsChange({ ...options, showLabels: v })} />
          <Toggle label="Show Confidence" checked={options.showConfidence} onChange={(v) => onOptionsChange({ ...options, showConfidence: v })} />
          <Toggle label="Show Inspection Zone" checked={options.showZone} onChange={(v) => onOptionsChange({ ...options, showZone: v })} />
        </div>
      </fieldset>
    </div>
  );
}