import { useCallback, useEffect, useState } from "react";
import { getDashboardData } from "../services/api";
import type { DashboardData } from "../types";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      setData(await getDashboardData());
    } catch {
      setError("Dashboard data unavailable. The API client returned an unexpected error.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect starts the initial asynchronous request for the page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  return { data, isLoading, error, reload, mode: data?.mode ?? "demo" };
}
