import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBackendState, getCurrentDetections, getModelMetrics } from "../services/api";
import { NO_SOURCE, resolveCameraSource } from "../services/stream";
import type { Detection, ModelMetrics } from "../types";
import type { OverlayOptions } from "../components/camera/DetectionOverlay";
import type { SessionState } from "../components/camera/InspectionControls";

const POLL_MS = 1200;

export function useLiveInspection() {
  const [state, setState] = useState<SessionState>("idle");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [model, setModel] = useState<ModelMetrics | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isDemo, setIsDemo] = useState(true);
  const [camera, setCamera] = useState("picamera2 (main)");
  const [resolution, setResolution] = useState("1280x720");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.45);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [options, setOptions] = useState<OverlayOptions>({
    showBoxes: true,
    showLabels: true,
    showConfidence: true,
    showZone: true,
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    void getModelMetrics().then((m) => active && setModel(m));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (state !== "running") return;
    timerRef.current = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "running") return;
    const controller = new AbortController();
    const poll = async () => {
      const next = await getCurrentDetections(controller.signal);
      setDetections(next);
      setIsDemo(!getBackendState().reachable);
    };
    void poll();
    const timer = window.setInterval(() => void poll(), POLL_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [state]);

  const visible = useMemo(
    () => detections.filter((d) => d.confidence >= confidenceThreshold),
    [detections, confidenceThreshold],
  );

  const source = useMemo(
    () => (isDemo ? NO_SOURCE : resolveCameraSource("live", import.meta.env.VITE_CAMERA_URL)),
    [isDemo],
  );

  const start = useCallback(() => {
    setElapsedSec(0);
    setState("running");
  }, []);
  const pause = useCallback(() => setState("paused"), []);
  const stop = useCallback(() => {
    setState("idle");
    setDetections([]);
    setElapsedSec(0);
  }, []);

  return {
    state, detections: visible, model, elapsedSec, isDemo, camera, resolution,
    confidenceThreshold, iouThreshold, options, source,
    setCamera, setResolution, setConfidenceThreshold, setIouThreshold, setOptions,
    start, pause, stop,
    commandsSent: false,
  };
}