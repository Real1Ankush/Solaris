import { useCallback, useEffect, useRef, useState } from "react";
import type { Detection, Inspection } from "../types";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;
const DEMO_LATENCY_MS = 900;

function buildDetections(seedText: string): Detection[] {
  let hash = 0;
  for (let i = 0; i < seedText.length; i += 1) hash = (hash * 31 + seedText.charCodeAt(i)) | 0;
  const rand = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
  const classes = ["Bird-drop", "Dusty", "Electrical-Damage", "Non-Defective", "Physical Damage"] as const;
  const count = 1 + Math.floor(rand() * 4);

  return Array.from({ length: count }, (_, i) => {
    const className = classes[Math.floor(rand() * classes.length)];
    const w = 0.1 + rand() * 0.18;
    const h = 0.12 + rand() * 0.2;
    const x = rand() * (1 - w);
    const y = rand() * (1 - h);
    const critical = className === "Electrical-Damage" || className === "Physical Damage";
    return {
      id: `det-upload-${i}`,
      inspectionId: null,
      className,
      confidence: Math.round((0.5 + rand() * 0.49) * 1000) / 1000,
      box: { x1: x, y1: y, x2: x + w, y2: y + h },
      frameTimestamp: new Date().toISOString(),
      severity: critical ? "critical" : className === "Non-Defective" ? "info" : "warning",
      source: "upload",
    };
  });
}

export function useImageAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setFile(null);
    setPreviewUrl(null);
    setDetections([]);
    setError(null);
    setSavedId(null);
  }, [cleanup]);

  const acceptFile = useCallback(
    (incoming: File | null) => {
      setError(null);
      setDetections([]);
      setSavedId(null);

      if (!incoming) {
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!ACCEPTED.includes(incoming.type)) {
        setError(`Unsupported file type: ${incoming.type || "unknown"}. Use JPG, JPEG, PNG or WEBP.`);
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (incoming.size > MAX_BYTES) {
        setError(`File is ${(incoming.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB.`);
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      cleanup();
      const url = URL.createObjectURL(incoming);
      objectUrlRef.current = url;
      setFile(incoming);
      setPreviewUrl(url);
    },
    [cleanup],
  );

  const runDetection = useCallback(() => {
    if (!file) return;
    setIsRunning(true);
    setError(null);
    timerRef.current = window.setTimeout(() => {
      setDetections(buildDetections(`${file.name}:${file.size}`));
      setIsRunning(false);
    }, DEMO_LATENCY_MS);
  }, [file]);

  const buildInspection = useCallback((): Inspection | null => {
    if (!file) return null;
    const confidences = detections.map((d) => d.confidence);
    const mean = confidences.length
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : null;
    return {
      id: `INS-IMG-${Date.now().toString().slice(-6)}`,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationSec: 1,
      panelsInspected: 1,
      defectsFound: detections.length,
      criticalDefects: detections.filter((d) => d.severity === "critical").length,
      averageConfidence: mean === null ? null : Math.round(mean * 1000) / 1000,
      status: "completed",
      mode: "demo",
      sourceImage: previewUrl,
      detections,
    };
  }, [file, detections, previewUrl]);

  const saveInspection = useCallback(() => {
    const inspection = buildInspection();
    if (!inspection) return;
    setSavedId(inspection.id);
    // DEMO: nothing is persisted. Wire this to the /api/inspections endpoint when it exists.
  }, [buildInspection]);

  return {
    file, previewUrl, detections, isRunning, error, savedId,
    acceptFile, runDetection, reset, saveInspection,
    inspection: buildInspection(),
  };
}