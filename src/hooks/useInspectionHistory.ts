import { useCallback, useEffect, useMemo, useState } from "react";
import { getInspectionHistory } from "../services/api";
import type { Inspection } from "../types";

export function useInspectionHistory() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      setInspections(await getInspectionHistory());
    } catch {
      setError("Inspection history could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect starts the initial asynchronous request for the page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  const mode = useMemo<"live" | "demo">(
    () => (inspections.every((i) => i.mode === "live") && inspections.length > 0 ? "live" : "demo"),
    [inspections],
  );

  return { inspections, isLoading, error, reload, mode };
}
