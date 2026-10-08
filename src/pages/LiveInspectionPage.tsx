import { PageShell } from "../components/shell/PageShell";
import { CameraViewer } from "../components/camera/CameraViewer";
import { DetectionPanel } from "../components/camera/DetectionPanel";
import { InspectionControls } from "../components/camera/InspectionControls";
import { InspectionSettings } from "../components/camera/InspectionSettings";
import { TelemetryBar } from "../components/camera/TelemetryBar";
import { useLiveInspection } from "../hooks/useLiveInspection";
import { streamStateFor } from "../services/stream";

const FALLBACK_MODEL = {
  name: "YOLOv5n",
  version: null,
  runtime: "Raspberry Pi 4",
  classes: [],
  measured: { modelOnlyFps: 0, modelOnlyLatencyMs: 0, livePipelineFps: 0, source: "", measuredOn: null },
  evaluation: { map: null, precision: null, recall: null, f1: null, status: "not-configured" as const },
  weightsLoaded: false,
  confidenceThreshold: 0.45,
  iouThreshold: 0.45,
};

export default function LiveInspectionPage() {
  const insp = useLiveInspection();
  const model = insp.model ?? FALLBACK_MODEL;
  const streamState = streamStateFor(insp.source, insp.isDemo ? "demo" : "live");

  return (
    <PageShell
      title="Live Inspection"
      description="Camera viewport with detection overlay and session telemetry."
      actions={<InspectionControls state={insp.state} onStart={insp.start} onPause={insp.pause} onStop={insp.stop} commandsSent={insp.commandsSent} />}
    >
      <div className="space-y-4">
        {insp.isDemo && (
          <p className="rounded-md border border-[#ffb020]/25 bg-[#ffb020]/5 px-4 py-2.5 text-xs leading-relaxed text-[#ffb020]">
            <strong className="font-semibold">DEMO MODE</strong> — no Raspberry Pi is connected. The
            viewport shows a synthetic frame and detections are generated locally. No model inference
            is running and no commands are being sent to hardware.
          </p>
        )}

        <TelemetryBar
          streamState={streamState}
          modelName={model.name}
          isRunning={insp.state === "running"}
          elapsedSec={insp.elapsedSec}
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
          <div className="min-w-0 space-y-4">
            <CameraViewer
              source={insp.source}
              detections={insp.detections}
              options={insp.options}
              streamState={streamState}
              resolution={insp.resolution}
            />
            <div className="rounded-lg border border-white/[0.07] bg-[#0b0d10] p-4">
              <h3 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-slate-400">SETTINGS</h3>
              <InspectionSettings
                model={model}
                camera={insp.camera}
                resolution={insp.resolution}
                confidenceThreshold={insp.confidenceThreshold}
                iouThreshold={insp.iouThreshold}
                options={insp.options}
                isLive={!insp.isDemo}
                onCameraChange={insp.setCamera}
                onResolutionChange={insp.setResolution}
                onConfidenceChange={insp.setConfidenceThreshold}
                onIouChange={insp.setIouThreshold}
                onOptionsChange={insp.setOptions}
              />
            </div>
          </div>

          <DetectionPanel detections={insp.detections} isDemo={insp.isDemo} />
        </div>
      </div>
    </PageShell>
  );
}
