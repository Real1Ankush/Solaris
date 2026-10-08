import { ModeBadge } from "../shell/ModeBadge";
import type { DashboardData } from "../../types";

type Tone = "ok" | "warn" | "error" | "idle";

const DOT: Record<Tone, string> = {
  ok: "bg-emerald-400",
  warn: "bg-[#ffb020]",
  error: "bg-rose-500",
  idle: "bg-slate-600",
};

const VALUE: Record<Tone, string> = {
  ok: "text-emerald-300",
  warn: "text-[#ffb020]",
  error: "text-rose-300",
  idle: "text-slate-400",
};

interface Item {
  label: string;
  value: string;
  tone: Tone;
  detail: string;
}

export function StatusStrip({ data }: { data: DashboardData }) {
  const { robot, model, system } = data;

  const items: Item[] = [
    {
      label: "Robot",
      value: robot.online ? "ONLINE" : "ROBOT OFFLINE",
      tone: robot.online ? "ok" : "error",
      detail: robot.online ? robot.name : "No rover connected",
    },
    {
      label: "Camera",
      value: robot.camera.connected ? "CONNECTED" : "DISCONNECTED",
      tone: robot.camera.connected ? "ok" : "error",
      detail: robot.camera.connected ? robot.camera.resolution : "No camera stream",
    },
    {
      label: "AI Model",
      value: model.weightsLoaded ? model.name : "NOT LOADED",
      tone: model.weightsLoaded ? "ok" : "warn",
      detail: model.weightsLoaded ? `Weights ready on ${model.runtime}` : "Weights unavailable",
    },
    {
      label: "Inference",
      value: system.mode === "live" ? "RUNNING" : "STANDBY",
      tone: system.mode === "live" ? "ok" : "idle",
      detail:
        system.mode === "live"
          ? "Detection loop active"
          : "No device attached — nothing is being inferred",
    },
    {
      label: "Connection",
      value: system.backend.reachable ? "API CONNECTED" : system.backend.baseUrl ? "API UNREACHABLE" : "NO API CONFIGURED",
      tone: system.backend.reachable ? "ok" : "warn",
      detail: system.backend.baseUrl
        ? system.backend.baseUrl
        : "Set VITE_API_BASE_URL to connect a Raspberry Pi backend",
    },
  ];

  return (
    <section
      aria-label="System status"
      className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">SYSTEM STATUS</h3>
        <ModeBadge mode={data.mode} size="sm" />
      </div>

      <ul className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-5">
        {items.map((item) => (
          <li key={item.label} className="border-b border-white/[0.06] px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[item.tone]}`} aria-hidden />
              <span className="font-mono text-[10px] tracking-[0.16em] text-slate-500">{item.label.toUpperCase()}</span>
            </div>
            <p className={`mt-1.5 font-mono text-sm ${VALUE[item.tone]}`}>{item.value}</p>
            <p className="mt-0.5 truncate text-[11px] text-slate-500" title={item.detail}>
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}