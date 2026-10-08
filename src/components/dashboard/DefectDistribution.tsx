import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { DashboardData, DefectClass } from "../../types";

const CLASS_COLOR: Record<DefectClass, string> = {
  "Bird-drop": "#22d3ee",
  Dusty: "#ffb020",
  "Electrical-Damage": "#fb7185",
  "Non-Defective": "#34d399",
  "Physical Damage": "#f43f5e",
};

function Bars({ data }: { data: DashboardData["defectsByClass"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -18 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(148,180,220,0.10)" vertical={false} />
        <XAxis
          dataKey="className"
          tick={{ fill: "#64748b", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(148,180,220,0.12)" }}
          interval={0}
          angle={-18}
          textAnchor="end"
          height={54}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,176,32,0.06)" }}
          contentStyle={{
            background: "#0b0d10",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 6,
            fontSize: 12,
            fontFamily: "JetBrains Mono, monospace",
          }}
          labelStyle={{ color: "#e2e8f0" }}
          formatter={(value, name) => [String(value ?? 0), name === "count" ? "Detections" : String(name)]}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={44}>
          {data.map((entry) => (
            <Cell key={entry.className} fill={CLASS_COLOR[entry.className]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DefectDistribution({ data }: { data: DashboardData }) {
  return (
    <section
      aria-label="Defect distribution"
      className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">DEFECT DISTRIBUTION</h3>
        <span className="font-mono text-[10px] text-slate-600">
          {data.mode === "demo" ? "DEMO DATA" : "LIVE DATA"}
        </span>
      </div>
      <figure className="p-4">
        <div className="h-[240px] w-full">
          <Bars data={data.defectsByClass} />
        </div>
        <figcaption className="mt-2 text-[10px] text-slate-600">
          Detection counts per class across the current dataset.
        </figcaption>
      </figure>
    </section>
  );
}