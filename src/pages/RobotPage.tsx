import { useSystemStatus } from "../hooks/useSystemStatus";
import { getRobotStatus } from "../services/api";
import { useEffect, useState } from "react";
import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { DemoNotice } from "../components/shared/EmptyState";
import { RobotMonitor } from "../components/robot/RobotMonitor";
import { formatUptime } from "../lib/format";
import type { RobotStatus } from "../types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5 last:border-b-0">
      <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">{label.toUpperCase()}</span>
      <span className="truncate font-mono text-xs text-slate-300">{value}</span>
    </div>
  );
}

export default function RobotPage() {
  const { status } = useSystemStatus();
  const [robot, setRobot] = useState<RobotStatus | null>(null);

  useEffect(() => {
    let active = true;
    void getRobotStatus().then((r) => active && setRobot(r));
    return () => {
      active = false;
    };
  }, []);

  const offline = !robot?.online;
  const na = "NOT AVAILABLE";

  return (
    <PageShell title="Robot" description="Rover status, telemetry and inspection state.">
      <div className="space-y-4">
        <DemoNotice>
          no rover is connected. Telemetry fields below read NOT AVAILABLE because nothing is reporting
          them, and every control is disabled.
        </DemoNotice>

        {offline && (
          <div role="alert" className="rounded-md border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm font-medium text-rose-200">
            ROBOT OFFLINE — no physical commands can be sent.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4">
            <RobotMonitor />
            <Panel title="Mission">
              <div className="grid grid-cols-2 gap-px bg-white/[0.06] sm:grid-cols-4">
                <Field label="State" value={robot?.inspection.state.toUpperCase() ?? na} />
                <Field label="Zone" value={robot?.position.zone ?? na} />
                <Field label="Current target" value={robot?.inspection.currentTarget ?? na} />
                <Field label="Current panel" value={robot?.inspection.currentPanel ?? na} />
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-slate-600">
                  <span>PROGRESS</span>
                  <span>{robot?.inspection.progressPct ?? 0}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-[#ffb020] transition-[width] duration-500" style={{ width: `${robot?.inspection.progressPct ?? 0}%` }} />
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Telemetry">
              <Field label="Connection" value={robot?.connection.toUpperCase() ?? na} />
              <Field label="Battery" value={robot?.batteryPct !== null && robot?.batteryPct !== undefined ? `${robot.batteryPct}%` : na} />
              <Field label="CPU temperature" value={robot?.temperatureC !== null && robot?.temperatureC !== undefined ? `${robot.temperatureC} °C` : na} />
              <Field label="Network SSID" value={robot?.network.ssid ?? na} />
              <Field label="Signal" value={robot?.network.rssiDbm !== null && robot?.network.rssiDbm !== undefined ? `${robot.network.rssiDbm} dBm` : na} />
              <Field label="IP address" value={robot?.network.ip ?? na} />
              <Field label="Position" value={robot ? `x ${robot.position.x} · y ${robot.position.y}` : na} />
              <Field label="Firmware" value={robot?.firmware ?? na} />
              <Field label="Uptime" value={robot?.uptimeSec ? formatUptime(robot.uptimeSec) : na} />
            </Panel>

            <Panel title="Camera">
              <Field label="Status" value={robot?.camera.connected ? "CONNECTED" : "DISCONNECTED"} />
              <Field label="Resolution" value={robot?.camera.resolution ?? na} />
              <Field label="Stream" value={robot?.camera.streamState.toUpperCase() ?? na} />
            </Panel>

            <Panel title="Controls">
              <div className="flex flex-wrap gap-2 p-4">
                {["Return to dock", "Pause mission", "Emergency stop", "Recalibrate"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled
                    title="Requires a connected backend"
                    className="cursor-not-allowed rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-600"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="border-t border-white/[0.07] px-4 py-2 text-[10px] text-slate-600">
                Controls are present in the interface but disabled. No movement command has been sent.
              </p>
            </Panel>
          </div>
        </div>

        <p className="font-mono text-[10px] tracking-[0.14em] text-slate-700">
          BACKEND: {status?.backend.reachable ? "REACHABLE" : "NOT CONFIGURED"} · BASE URL: {status?.backend.baseUrl || "VITE_API_BASE_URL unset"}
        </p>
      </div>
    </PageShell>
  );
}