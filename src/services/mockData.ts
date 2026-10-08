import type {
  DashboardData,
  DefectClass,
  Detection,
  Inspection,
  ModelMetrics,
  RobotStatus,
  SystemStatus,
} from "../types";

/**
 * Source: measured Raspberry Pi 4 deployment benchmark for this project.
 * These are throughput/latency measurements. They are not accuracy.
 */
export const MEASURED_BENCHMARKS = {
  modelOnlyFps: 1.91,
  modelOnlyLatencyMs: 524,
  livePipelineFps: 1.69,
  source: "Measured Raspberry Pi 4 deployment benchmark (YOLOv5n)",
} as const;

export const DEFECT_CLASSES: DefectClass[] = [
  "Bird-drop",
  "Dusty",
  "Electrical-Damage",
  "Non-Defective",
  "Physical Damage",
];

/** mulberry32 — deterministic, so DEMO data does not reshuffle on re-render. */
function createRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = createRandom(20261005);

const pick = <T,>(items: T[]): T => items[Math.floor(rand() * items.length)];

const severityFor = (className: DefectClass): Detection["severity"] => {
  if (className === "Electrical-Damage" || className === "Physical Damage") return "critical";
  if (className === "Dusty" || className === "Bird-drop") return "warning";
  return "info";
};

export function createDemoDetections(inspectionId: string | null, count: number): Detection[] {
  return Array.from({ length: count }, (_, i) => {
    const className = pick(DEFECT_CLASSES);
    const w = 0.08 + rand() * 0.16;
    const h = 0.1 + rand() * 0.18;
    const x = rand() * (1 - w);
    const y = rand() * (1 - h);
    return {
      id: `det-${inspectionId ?? "live"}-${i}`,
      inspectionId,
      className,
      confidence: Math.round((0.55 + rand() * 0.44) * 1000) / 1000,
      box: { x1: x, y1: y, x2: x + w, y2: y + h },
      frameTimestamp: new Date().toISOString(),
      severity: severityFor(className),
      source: "camera",
    };
  });
}

export function createDemoInspections(count = 24): Inspection[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const startedAt = new Date(now - i * 5.4 * 3600 * 1000 - rand() * 3600_000);
    const durationSec = Math.round(180 + rand() * 900);
    const defects = createDemoDetections(`INS-2026-${String(1042 - i).padStart(4, "0")}`, 0);
    const panels = Math.round(8 + rand() * 40);
    const found = defects.length ? defects.length : Math.round(panels * (0.1 + rand() * 0.35));
    const critical = defects.filter((d) => d.severity === "critical").length;
    return {
      id: `INS-2026-${String(1042 - i).padStart(4, "0")}`,
      startedAt: startedAt.toISOString(),
      completedAt: new Date(startedAt.getTime() + durationSec * 1000).toISOString(),
      durationSec,
      panelsInspected: panels,
      defectsFound: found,
      criticalDefects: critical,
      averageConfidence: Math.round((0.62 + rand() * 0.33) * 1000) / 1000,
      status: i === 0 ? "processing" : "completed",
      mode: "demo",
      sourceImage: null,
      detections: defects,
    };
  });
}

export function createDemoModel(): ModelMetrics {
  return {
    name: "YOLOv5n",
    version: "v5n deployment build",
    runtime: "Raspberry Pi 4",
    classes: DEFECT_CLASSES,
    measured: {
      modelOnlyFps: MEASURED_BENCHMARKS.modelOnlyFps,
      modelOnlyLatencyMs: MEASURED_BENCHMARKS.modelOnlyLatencyMs,
      livePipelineFps: MEASURED_BENCHMARKS.livePipelineFps,
      source: MEASURED_BENCHMARKS.source,
      measuredOn: null,
    },
    evaluation: { map: null, precision: null, recall: null, f1: null, status: "not-configured" },
    weightsLoaded: true,
    confidenceThreshold: 0.45,
    iouThreshold: 0.45,
  };
}

export function createDemoRobot(): RobotStatus {
  return {
    id: "rover-01",
    name: "Solaris Rover 01",
    online: false,
    connection: "disconnected",
    batteryPct: null,
    temperatureC: null,
    network: { ssid: null, rssiDbm: null, ip: null },
    position: { x: 0, y: 0, zone: "Block B", panelRow: null },
    camera: { connected: false, resolution: "1280x720", fps: null, streamState: "disconnected" },
    inspection: {
      active: false,
      state: "idle",
      currentTarget: null,
      currentPanel: null,
      progressPct: 0,
    },
    uptimeSec: 0,
    firmware: null,
    mode: "demo",
  };
}

export function createDemoSystemStatus(): SystemStatus {
  return {
    mode: "demo",
    backend: { reachable: false, baseUrl: "", checkedAt: new Date().toISOString() },
    model: { loaded: true, name: "YOLOv5n" },
    robot: { online: false },
    camera: { streamState: "disconnected" },
    uptimeSec: 0,
    lastError: null,
  };
}

export function createDemoDashboardData(): DashboardData {
  const inspections = createDemoInspections();
  const completed = inspections.filter((i) => i.status === "completed");
  const panels = completed.reduce((sum, i) => sum + i.panelsInspected, 0);
  const defects = completed.reduce((sum, i) => sum + i.defectsFound, 0);
  const critical = completed.reduce((sum, i) => sum + i.criticalDefects, 0);
  const confidenceValues = completed
    .map((i) => i.averageConfidence)
    .filter((c): c is number => c !== null);
  const averageConfidence = confidenceValues.length
    ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
    : null;

  const defectsByClass = DEFECT_CLASSES.map((className) => ({
    className,
    count: inspections.reduce(
      (sum, i) => sum + i.detections.filter((d) => d.className === className).length,
      0,
    ),
  }));

  return {
    metrics: {
      panelsInspected: panels,
      defectsDetected: defects,
      criticalDefects: critical,
      averageConfidence: averageConfidence === null ? null : Math.round(averageConfidence * 1000) / 1000,
      inspectionSessions: inspections.length,
      systemUptimeSec: 0,
    },
    system: createDemoSystemStatus(),
    robot: createDemoRobot(),
    model: createDemoModel(),
    defectsByClass,
    recentInspections: inspections.slice(0, 5),
    activeInspection: inspections[0]?.status === "processing" ? inspections[0] : null,
    generatedAt: new Date().toISOString(),
    mode: "demo",
  };
}