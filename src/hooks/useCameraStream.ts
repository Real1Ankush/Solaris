import { useEffect, useState } from "react";
import type { StreamState } from "../types";
import { NO_SOURCE, SNAPSHOT_INTERVAL_MS, type CameraSource } from "../services/stream";

export function useCameraStream(source: CameraSource, fallbackState: StreamState) {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<StreamState>(fallbackState);

  useEffect(() => {
    // Source changes reset the previous stream's surfaced error before setup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    setSnapshotUrl(null);

    if (source.kind === "none") {
      setState(fallbackState);
      return;
    }

    if (source.kind === "webrtc" || source.kind === "websocket") {
      setState("disconnected");
      setError(
        `${source.label} transport is not implemented in the frontend yet. Add the handler in useCameraStream before enabling it.`,
      );
      return;
    }

    if (source.kind === "mjpeg") {
      setState("live");
      return;
    }

    // snapshot polling
    setState("live");
    const tick = () => {
      const base = source.url ?? "";
      const separator = base.includes("?") ? "&" : "?";
      setSnapshotUrl(`${base}${separator}t=${Date.now()}`);
    };
    tick();
    const timer = setInterval(tick, SNAPSHOT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [source, fallbackState]);

  return { snapshotUrl, error, state, source: source.kind === "none" ? NO_SOURCE : source };
}
