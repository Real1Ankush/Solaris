import type { Inspection } from "../types";
import { MEASURED_BENCHMARKS } from "../services/mockData";
import { formatDateTime, formatDuration } from "./format";

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadInspectionReport(inspection: Inspection) {
  const lines = [
    "SOLARIS — INSPECTION REPORT",
    "=".repeat(52),
    `Inspection ID : ${inspection.id}`,
    `Started : ${formatDateTime(inspection.startedAt)}`,
    `Duration       : ${formatDuration(inspection.durationSec)}`,
    `Panels         : ${inspection.panelsInspected}`,
    `Defects        : ${inspection.defectsFound}`,
    `Critical       : ${inspection.criticalDefects}`,
    `Mean confidence: ${inspection.averageConfidence === null ? "NOT AVAILABLE" : `${(inspection.averageConfidence * 100).toFixed(1)}%`}`,
    "",
    "Data source    : " + (inspection.mode === "live" ? "LIVE" : "DEMO MODE — sample data, not device measurements"),
    "",
    "DETECTIONS",
    "-".repeat(52),
    ...(inspection.detections.length
      ? inspection.detections.map(
          (d) =>
            `${d.id}  ${d.className.padEnd(20)} conf=${(d.confidence * 100).toFixed(1)}%  sev=${d.severity}`,
        )
      : ["(no detection records retained for this inspection)"]),
    "",
    "MODEL",
    "-".repeat(52),
    "YOLOv5n on Raspberry Pi 4",
    `Measured model-only throughput : ${MEASURED_BENCHMARKS.modelOnlyFps} FPS`,
    `Measured model-only latency    : ${MEASURED_BENCHMARKS.modelOnlyLatencyMs} ms`,
    `Measured live pipeline         : ${MEASURED_BENCHMARKS.livePipelineFps} FPS`,
    "These are deployment throughput/latency figures, not accuracy.",
    "Evaluation metrics (mAP, precision, recall, F1): NOT CONFIGURED.",
    `Source: ${MEASURED_BENCHMARKS.source}`,
  ];

  triggerDownload(`${inspection.id}-report.txt`, lines.join("\n"), "text/plain;charset=utf-8");
}

export function downloadInspectionJson(inspection: Inspection) {
  triggerDownload(
    `${inspection.id}.json`,
    JSON.stringify(inspection, null, 2),
    "application/json",
  );
}