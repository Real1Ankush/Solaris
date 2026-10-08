import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { ModeBadge } from "../components/shell/ModeBadge";
import { useInspectionHistory } from "../hooks/useInspectionHistory";
import { DEFECT_COLORS } from "../lib/defectColors";
import { DEFECT_CLASSES } from "../services/mockData";
import type { DefectClass, Severity } from "../types";

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#f43f5e",
  warning: "#ffb020",
  info: "#22d3ee",
};

const AXIS = { fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono, monospace" } as const;
const TOOLTIP = {
  contentStyle: { background: "#0b0d10", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 6, fontSize: 12, fontFamily: "JetBrains Mono, monospace" },
  labelStyle: { color: "#e2e8f0" },
} as const;

export default function AnalyticsPage() {
  const { inspections, mode } = useInspectionHistory();

  const byClass = useMemo(
    () => DEFECT_CLASSES.map((className) => ({
      className,
      count: inspections.reduce((sum, i) => sum + i.detections.filter((d) => d.className === className).length, 0),
    })),
    [inspections],
  );

  const overTime = useMemo(() => {
    const buckets = new Map<string, { date: string; defects: number; sessions: number }>();
    for (const i of [...inspections].reverse()) {
      const date = i.startedAt.slice(0, 10);
      const entry = buckets.get(date) ?? { date, defects: 0, sessions: 0 };
      entry.defects += i.defectsFound;
      entry.sessions += 1;
      buckets.set(date, entry);
    }
    return [...buckets.values()];
  }, [inspections]);

  const confidenceBins = useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}–${i * 10 + 10}%`,
      count: 0,
    }));
    for (const i of inspections) {
      if (i.averageConfidence === null) continue;
      bins[Math.min(9, Math.floor(i.averageConfidence * 10))].count += 1;
    }
    return bins;
  }, [inspections]);

  const panelHealth = useMemo(() => {
    const clean = inspections.reduce((s, i) => s + i.panelsInspected - i.defectsFound, 0);
    const total = inspections.reduce((s, i) => s + i.panelsInspected, 0);
    return [
      { name: "Healthy", value: Math.max(0, clean) },
      { name: "Flagged", value: Math.max(0, total - Math.max(0, clean)) },
    ];
  }, [inspections]);

  const severity = useMemo(() => {
    const counts: Record<Severity, number> = { critical: 0, warning: 0, info: 0 };
    for (const i of inspections) for (const d of i.detections) counts[d.severity] += 1;
    return (Object.keys(counts) as Severity[]).map((k) => ({ name: k, value: counts[k], color: SEVERITY_COLORS[k] }));
  }, [inspections]);

  return (
    <PageShell title="Analytics" description="Defect trends, confidence distribution and panel health across recorded sessions.">
      <div className="space-y-4">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-slate-600">
          DATA SOURCE: {mode === "demo" ? "DEMO MODE — SAMPLE DATA" : "LIVE"} <ModeBadge mode={mode} size="sm" />
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Defects by class">
            <div className="h-[260px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byClass} margin={{ top: 4, right: 8, left: -20, bottom: 44 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,180,220,0.10)" vertical={false} />
                  <XAxis dataKey="className" tick={AXIS} tickLine={false} axisLine={{ stroke: "rgba(148,180,220,0.12)" }} interval={0} angle={-20} textAnchor="end" height={56} />
                  <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip {...TOOLTIP} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={40}>
                    {byClass.map((e) => <Cell key={e.className} fill={DEFECT_COLORS[e.className as DefectClass]} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Defect frequency over time">
            <div className="h-[260px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overTime} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <defs>
                    <linearGradient id="gradDefects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffb020" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ffb020" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,180,220,0.10)" vertical={false} />
                  <XAxis dataKey="date" tick={AXIS} tickLine={false} axisLine={{ stroke: "rgba(148,180,220,0.12)" }} minTickGap={24} />
                  <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip {...TOOLTIP} />
                  <Area type="monotone" dataKey="defects" stroke="#ffb020" strokeWidth={1.5} fill="url(#gradDefects)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Confidence distribution">
            <div className="h-[260px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceBins} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,180,220,0.10)" vertical={false} />
                  <XAxis dataKey="range" tick={AXIS} tickLine={false} axisLine={{ stroke: "rgba(148,180,220,0.12)" }} interval={2} />
                  <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip {...TOOLTIP} />
                  <Bar dataKey="count" fill="#22d3ee" fillOpacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-[10px] text-slate-600">Mean per-detection confidence per session. Not a model accuracy metric.</p>
            </div>
          </Panel>

          <Panel title="Inspection activity">
            <div className="h-[260px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overTime} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,180,220,0.10)" vertical={false} />
                  <XAxis dataKey="date" tick={AXIS} tickLine={false} axisLine={{ stroke: "rgba(148,180,220,0.12)" }} minTickGap={24} />
                  <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip {...TOOLTIP} />
                  <Bar dataKey="sessions" fill="#64748b" radius={[3, 3, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Panel health">
            <div className="h-[240px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={panelHealth} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
                    {panelHealth.map((e, i) => <Cell key={e.name} fill={i === 0 ? "#34d399" : "#fb7185"} fillOpacity={0.85} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Severity distribution">
            <div className="h-[240px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severity} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
                    {severity.map((e) => <Cell key={e.name} fill={e.color} fillOpacity={0.85} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}