import type { StreamState } from "../types";

export type StreamKind = "none" | "snapshot" | "mjpeg" | "webrtc" | "websocket";

export interface CameraSource {
  kind: StreamKind;
  url: string | null;
  label: string;
}

export const SNAPSHOT_INTERVAL_MS = 500;

export const NO_SOURCE: CameraSource = { kind: "none", url: null, label: "No stream" };

/**
 * Resolves a camera source from environment configuration.
 * Nothing here contacts a device; it only describes what is configured.
 */
export function resolveCameraSource(
  mode: "live" | "demo" | "offline",
  streamUrl: string | undefined,
): CameraSource {
  if (mode !== "live" || !streamUrl) return NO_SOURCE;

  if (streamUrl.startsWith("ws://") || streamUrl.startsWith("wss://")) {
    return { kind: "websocket", url: streamUrl, label: "WebSocket frames" };
  }
  if (streamUrl.endsWith(".mjpg") || streamUrl.endsWith("/mjpeg")) {
    return { kind: "mjpeg", url: streamUrl, label: "MJPEG" };
  }
  if (streamUrl.endsWith(".webrtc") || streamUrl.endsWith("/webrtc")) {
    return { kind: "webrtc", url: streamUrl, label: "WebRTC" };
  }
  return { kind: "snapshot", url: streamUrl, label: "HTTP snapshot" };
}

export function streamStateFor(source: CameraSource, mode: "live" | "demo" | "offline"): StreamState {
  if (source.kind === "none" || mode !== "live") return "disconnected";
  return "live";
}