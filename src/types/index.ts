export type DefectClass =
  | "Bird-drop"
  | "Dusty"
  | "Electrical-Damage"
  | "Non-Defective"
  | "Physical Damage";

export type Severity = "critical" | "warning" | "info";
export type DataMode = "live" | "demo" | "offline";
export type StreamState = "live" | "demo" | "disconnected";
export type InspectionStatus = "completed" | "processing" | "failed" | "queued";

/** Normalised to the 0..1 range of the source frame, not to screen pixels. */
export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  id: string;
  inspectionId: string | null;
  className: DefectClass;
  /** Per-detection confidence from the model output. This is not model accuracy. */
  confidence: number;
  box: BoundingBox;
  frameTimestamp: string;
  severity: Severity;
  source: "camera" | "upload";
}

export interface Inspection {
  id: string;
  startedAt: string;
  completedAt: string | null;
  durationSec: number;
  panelsInspected: number;
  defectsFound: number;
  criticalDefects: number;
  /** Mean confidence across this inspection's detections. Not an evaluation metric. */
  averageConfidence: number | null;
  status: InspectionStatus;
  mode: DataMode;
  sourceImage: string | null;
  detections: Detection[];
}

export interface RobotStatus {
  id: string;
  name: string;
  online: boolean;
  connection: "connected" | "disconnected" | "connecting";
  batteryPct: number | null;
  temperatureC: number | null;
  network: { ssid: string | null; rssiDbm: number | null; ip: string | null };
  position: { x: number; y: number; zone: string; panelRow: string | null };
  camera: { connected: boolean; resolution: string; fps: number | null; streamState: StreamState };
  inspection: {
    active: boolean;
    state: "idle" | "scanning" | "paused" | "complete";
    currentTarget: string | null;
    currentPanel: string | null;
    progressPct: number;
  };
  uptimeSec: number;
  firmware: string | null;
  mode: DataMode;
}

export interface ModelMetrics {
  name: string;
  version: string | null;
  runtime: string;
  classes: DefectClass[];
  /**
   * Measured deployment throughput on Raspberry Pi 4.
   * Throughput and latency only — these are NOT accuracy figures.
   */
  measured: {
    modelOnlyFps: number;
    modelOnlyLatencyMs: number;
    livePipelineFps: number;
    source: string;
    measuredOn: string | null;
  };
  /**
   * No evaluation run has been configured for this deployment,
   * so every field is permanently null and the UI must render
   * "NOT CONFIGURED".
   */
  evaluation: {
    map: null;
    precision: null;
    recall: null;
    f1: null;
    status: "not-configured";
  };
  weightsLoaded: boolean;
  confidenceThreshold: number;
  iouThreshold: number;
}

export interface SystemStatus {
  mode: DataMode;
  backend: { reachable: boolean; baseUrl: string; checkedAt: string };
  model: { loaded: boolean; name: string };
  robot: { online: boolean };
  camera: { streamState: StreamState };
  uptimeSec: number;
  lastError: string | null;
}

export interface DashboardMetrics {
  panelsInspected: number;
  defectsDetected: number;
  criticalDefects: number;
  averageConfidence: number | null;
  inspectionSessions: number;
  systemUptimeSec: number;
}

export interface DefectCount {
  className: DefectClass;
  count: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  system: SystemStatus;
  robot: RobotStatus;
  model: ModelMetrics;
  defectsByClass: DefectCount[];
  recentInspections: Inspection[];
  activeInspection: Inspection | null;
  generatedAt: string;
  mode: DataMode;
}