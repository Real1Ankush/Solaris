import { useCallback, useEffect, useState } from "react";
import { getSystemStatus } from "../services/api";
import type { SystemStatus } from "../types";

const POLL_MS = 5000;

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      setStatus(await getSystemStatus());
      setError(null);
    } catch {
      setError("Unable to read system status.");
    } finally {
      setIsLoading(false);
    }
    if (signal?.aborted) return;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    // Start status polling after mount; refresh awaits the API request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh(controller.signal);
    const timer = setInterval(() => void refresh(controller.signal), POLL_MS);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [refresh]);

  return { status, isLoading, error, refresh };
}
