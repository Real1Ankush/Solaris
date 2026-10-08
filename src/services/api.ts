import type {
  DashboardData,
  Detection,
  Inspection,
  ModelMetrics,
  RobotStatus,
  SystemStatus,
} from "../types";

import {
  createDemoDashboardData,
  createDemoDetections,
  createDemoInspections,
  createDemoModel,
  createDemoRobot,
  createDemoSystemStatus,
} from "./mockData";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

const PROBE_TIMEOUT_MS = 4000;
const REQUEST_TIMEOUT_MS = 8000;

let backendReachable = false;
let lastProbeAt: string | null = null;

export function isBackendConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export function getBackendState() {
  return {
    configured: isBackendConfigured(),
    reachable: backendReachable,
    lastProbeAt,
  };
}

async function fetchJson<T>(
  path: string,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<T | null> {
  if (!API_BASE_URL) {
    return null;
  }

  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

const withMode = <T extends { mode?: string }>(
  data: T,
  mode: "live" | "demo",
): T => {
  return {
    ...data,
    mode,
  } as T;
};

export async function probeBackend(): Promise<boolean> {
  if (!API_BASE_URL) {
    backendReachable = false;
    lastProbeAt = new Date().toISOString();
    return false;
  }

  try {
    const result = await fetchJson<unknown>(
      "/api/status",
      PROBE_TIMEOUT_MS,
    );

    backendReachable = result !== null;
  } catch {
    backendReachable = false;
  }

  lastProbeAt = new Date().toISOString();

  return backendReachable;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  if (isBackendConfigured()) {
    try {
      const data = await fetchJson<SystemStatus>("/api/status");

      if (data) {
        backendReachable = true;
        return withMode(data, "live");
      }
    } catch {
      backendReachable = false;
    }
  }

  return createDemoSystemStatus();
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  if (isBackendConfigured()) {
    try {
      const data = await fetchJson<ModelMetrics>("/api/model");

      if (data) {
        backendReachable = true;
        return data;
      }
    } catch {
      backendReachable = false;
    }
  }

  return createDemoModel();
}

export async function getRobotStatus(): Promise<RobotStatus> {
  if (isBackendConfigured()) {
    try {
      const data = await fetchJson<RobotStatus>("/api/robot");

      if (data) {
        backendReachable = true;
        return data;
      }
    } catch {
      backendReachable = false;
    }
  }

  return createDemoRobot();
}

export async function getCurrentDetections(
  signal?: AbortSignal,
): Promise<Detection[]> {
  if (isBackendConfigured()) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/detections/current`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      backendReachable = true;

      return (await response.json()) as Detection[];
    } catch {
      backendReachable = false;
    }
  }

  return createDemoDetections("demo-live", 5);
}

export async function getInspectionHistory(): Promise<Inspection[]> {
  if (isBackendConfigured()) {
    try {
      const data = await fetchJson<Inspection[]>("/api/inspections");

      if (data) {
        backendReachable = true;
        return data;
      }
    } catch {
      backendReachable = false;
    }
  }

  return createDemoInspections();
}

export async function getDashboardData(): Promise<DashboardData> {
  if (isBackendConfigured()) {
    try {
      const data = await fetchJson<DashboardData>("/api/dashboard");

      if (data) {
        backendReachable = true;
        return withMode(data, "live");
      }
    } catch {
      backendReachable = false;
    }
  }

  return createDemoDashboardData();
}