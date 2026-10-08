import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { ModeBadge } from "../components/shell/ModeBadge";
import { useSystemStatus } from "../hooks/useSystemStatus";
import { formatUptime } from "../lib/format";

const STAGES = [
  { title: "Camera", detail: "Raspberry Pi Camera · Picamera2", state: "idle" },
  { title: "Edge compute", detail: "Raspberry Pi 4", state: "idle" },
  { title: "Inference", detail: "YOLOv5n", state: "ok" },
  { title: "Detection engine", detail: "NMS · class mapping", state: "ok" },
  { title: "Solaris", detail: "This interface", state: "ok" },
] as const;

export default function SystemPage() {
  const { status, isLoading } = useSystemStatus();
  const dot = { ok: "bg-emerald-400", idle: "bg-slate-600" } as const;

  return (
    <PageShell title="System" description="Pipeline architecture, connectivity and runtime health.">
      <div className="space-y-4">
        <Panel title="Pipeline architecture" meta={<ModeBadge mode={status?.mode ?? "demo"} size="sm" />}>
          <ol className="divide-y divide-white/[0.06]">
            {STAGES.map((stage, i) => (
              <li key={stage.title} className="flex items-center gap-3 px-4 py-3">
                <span className="w-5 shrink-0 font-mono text-[10px] text-slate-700">{String(i + 1).padStart(2, "0")}</span>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot[stage.state]}`} aria-hidden />
                <span className="text-xs text-slate-200">{stage.title}</span>
                <span className="ml-auto truncate font-mono text-[11px] text-slate-500">{stage.detail}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Backend connectivity">
            <div className="divide-y divide-white/[0.06]">
              {[
                ["API base URL", status?.backend.baseUrl || "VITE_API_BASE_URL NOT SET"],
                ["Reachable", status?.backend.reachable ? "YES" : "NO"],
                ["Last probe", status?.backend.checkedAt ? new Date(status.backend.checkedAt).toLocaleTimeString() : "NOT AVAILABLE"],
                ["Model loaded", status?.model.loaded ? status.model.name : "NOT LOADED"],
                ["Camera stream", status?.camera.streamState.toUpperCase() ?? "UNKNOWN"],
                ["Rover online", status?.robot.online ? "YES" : "NO"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">{label.toUpperCase()}</span>
                  <span className="truncate font-mono text-xs text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Runtime">
            <div className="divide-y divide-white/[0.06]">
              {[
                ["Uptime", status?.uptimeSec ? formatUptime(status.uptimeSec) : "NOT AVAILABLE"],
                ["Last error", status?.lastError ?? "NONE"],
                ["Frontend version", "0.1.0-demo"],
                ["Data retention", "SESSION ONLY"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">{label.toUpperCase()}</span>
                  <span className="truncate font-mono text-xs text-slate-300">{value}</span>
                </div>
              ))}
            </div>
            {isLoading && <p className="px-4 py-2 text-[10px] text-slate-600">Polling system status…</p>}
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}