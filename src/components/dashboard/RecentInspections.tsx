import { Link } from "react-router-dom";
import type { DashboardData, Inspection } from "../../types";
import { formatDateTime, formatDuration } from "../../lib/format";

const STATUS_TONE: Record<Inspection["status"], string> = {
  completed: "text-emerald-300 border-emerald-500/25 bg-emerald-500/5",
  processing: "text-[#22d3ee] border-[#22d3ee]/25 bg-[#22d3ee]/5",
  queued: "text-slate-300 border-white/15 bg-white/[0.03]",
  failed: "text-rose-300 border-rose-500/25 bg-rose-500/5",
};

function Row({ inspection }: { inspection: Inspection }) {
  return (
    <tr className="border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.025]">
      <td className="px-4 py-3">
        <Link
          to={`/history/${inspection.id}`}
          className="font-mono text-xs text-[#22d3ee] underline-offset-4 hover:underline"
        >
          {inspection.id}
        </Link>
      </td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">{formatDateTime(inspection.startedAt)}</td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-300">{inspection.panelsInspected}</td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-300">{inspection.defectsFound}</td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-rose-300">{inspection.criticalDefects}</td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-300">
        {inspection.averageConfidence === null ? "—" : `${(inspection.averageConfidence * 100).toFixed(1)}%`}
      </td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">{formatDuration(inspection.durationSec)}</td>
      <td className="px-4 py-3">
        <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] ${STATUS_TONE[inspection.status]}`}>
          {inspection.status.toUpperCase()}
        </span>
      </td>
    </tr>
  );
}

export function RecentInspections({ data }: { data: DashboardData }) {
  const rows = data.recentInspections;

  return (
    <section
      aria-label="Recent inspections"
      className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">RECENT INSPECTIONS</h3>
        <Link to="/history" className="text-[11px] text-slate-400 transition-colors hover:text-[#ffb020]">
          View all
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="font-mono text-xs tracking-[0.16em] text-slate-400">NO INSPECTIONS YET</p>
          <p className="mt-1.5 text-sm text-slate-500">
            Run your first solar-panel inspection to see results here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] border-collapse">
              <caption className="sr-only">Five most recent inspection sessions</caption>
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {["Inspection ID", "Date", "Panels", "Defects", "Critical", "Avg Conf", "Duration", "Status"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-2.5 text-left font-mono text-[10px] font-normal tracking-[0.14em] text-slate-500">
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{rows.map((i) => <Row key={i.id} inspection={i} />)}</tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <ul className="divide-y divide-white/[0.06] md:hidden">
            {rows.map((i) => (
              <li key={i.id}>
                <Link to={`/history/${i.id}`} className="block px-4 py-3 transition-colors hover:bg-white/[0.03]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[#22d3ee]">{i.id}</span>
                    <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${STATUS_TONE[i.status]}`}>
                      {i.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">{formatDateTime(i.startedAt)}</p>
                  <dl className="mt-2 grid grid-cols-4 gap-2 font-mono text-[11px]">
                    <div><dt className="text-slate-600">PANELS</dt><dd className="text-slate-300">{i.panelsInspected}</dd></div>
                    <div><dt className="text-slate-600">DEFECTS</dt><dd className="text-slate-300">{i.defectsFound}</dd></div>
                    <div><dt className="text-slate-600">CRIT</dt><dd className="text-rose-300">{i.criticalDefects}</dd></div>
                    <div><dt className="text-slate-600">CONF</dt><dd className="text-slate-300">{i.averageConfidence === null ? "—" : `${(i.averageConfidence * 100).toFixed(0)}%`}</dd></div>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}