import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Search } from "lucide-react";
import { PageShell } from "../components/shell/PageShell";
import { Panel } from "../components/shared/Panel";
import { EmptyState, ErrorState } from "../components/shared/EmptyState";
import { ModeBadge } from "../components/shell/ModeBadge";
import { useInspectionHistory } from "../hooks/useInspectionHistory";
import { downloadInspectionReport } from "../lib/report";
import { formatDateTime, formatDuration } from "../lib/format";
import type { DefectClass, Inspection } from "../types";
import { DEFECT_CLASSES } from "../services/mockData";

const PAGE_SIZE = 8;
const STATUSES: Inspection["status"][] = ["completed", "processing", "queued", "failed"];

const STATUS_TONE: Record<Inspection["status"], string> = {
  completed: "text-emerald-300 border-emerald-500/25 bg-emerald-500/5",
  processing: "text-[#22d3ee] border-[#22d3ee]/25 bg-[#22d3ee]/5",
  queued: "text-slate-300 border-white/15 bg-white/[0.03]",
  failed: "text-rose-300 border-rose-500/25 bg-rose-500/5",
};

const select =
  "rounded-md border border-white/10 bg-[#0f1216] px-2 py-1.5 font-mono text-[11px] text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--amber)]";

export default function HistoryPage() {
  const { inspections, isLoading, error, reload, mode } = useInspectionHistory();
  const [query, setQuery] = useState("");
  const [defect, setDefect] = useState<DefectClass | "all">("all");
  const [severity, setSeverity] = useState<"all" | "critical" | "warning" | "info">("all");
  const [status, setStatus] = useState<Inspection["status"] | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inspections.filter((i) => {
      if (q && !i.id.toLowerCase().includes(q)) return false;
      if (status !== "all" && i.status !== status) return false;
      if (defect !== "all" && !i.detections.some((d) => d.className === defect)) return false;
      if (severity !== "all" && !i.detections.some((d) => d.severity === severity)) return false;
      const day = i.startedAt.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;
      return true;
    });
  }, [inspections, query, status, defect, severity, from, to]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  if (error) return <ErrorState message={error} onRetry={() => void reload()} />;
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="h-16 animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
        <div className="h-[420px] animate-pulse rounded-lg border border-white/[0.07] bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <PageShell title="Inspection History" description="Every recorded inspection session, filterable by date, defect class, severity and status.">
      <Panel        title={`${filtered.length} of ${inspections.length} inspections`}
        meta={<ModeBadge mode={mode} size="sm" />}
      >
        <div className="grid grid-cols-1 gap-2 border-b border-white/[0.07] p-3 sm:grid-cols-2 lg:grid-cols-6">
          <label className="relative lg:col-span-2">
            <span className="sr-only">Search by inspection ID</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search inspection ID"
              className="w-full rounded-md border border-white/10 bg-[#0f1216] py-1.5 pl-8 pr-2 text-xs text-slate-200 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb020]"
            />
          </label>
          <select aria-label="Filter by defect class" value={defect} onChange={(e) => { setDefect(e.target.value as DefectClass | "all"); setPage(0); }} className={select}>
            <option value="all">All classes</option>
            {DEFECT_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Filter by severity" value={severity} onChange={(e) => { setSeverity(e.target.value as typeof severity); setPage(0); }} className={select}>
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value as Inspection["status"] | "all"); setPage(0); }} className={select}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input type="date" aria-label="From date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0); }} className={`${select} w-full`} />
            <input type="date" aria-label="To date" value={to} onChange={(e) => { setTo(e.target.value); setPage(0); }} className={`${select} w-full`} />
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title={inspections.length === 0 ? "NO INSPECTIONS YET" : "NO MATCHING INSPECTIONS"}
            description={
              inspections.length === 0
                ? "Run your first solar-panel inspection to see results here."
                : "Adjust or clear the filters above to see more results."
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] border-collapse">
                <caption className="sr-only">Inspection sessions</caption>
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {["Inspection ID", "Date", "Panels", "Defects", "Critical", "Avg Confidence", "Duration", "Status", ""].map((h) => (
                      <th key={h} scope="col" className="px-4 py-2.5 text-left font-mono text-[10px] font-normal tracking-[0.14em] text-slate-500">
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id} className="border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.025]">
                      <td className="px-4 py-3">
                        <Link to={`/history/${i.id}`} className="font-mono text-xs text-[#22d3ee] underline-offset-4 hover:underline">{i.id}</Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">{formatDateTime(i.startedAt)}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-300">{i.panelsInspected}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-300">{i.defectsFound}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-rose-300">{i.criticalDefects}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-300">
                        {i.averageConfidence === null ? "—" : `${(i.averageConfidence * 100).toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">{formatDuration(i.durationSec)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] ${STATUS_TONE[i.status]}`}>{i.status.toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => downloadInspectionReport(i)} aria-label={`Download report for ${i.id}`} className="text-slate-500 transition-colors hover:text-[#ffb020]">
                          <Download className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-white/[0.06] md:hidden">
              {rows.map((i) => (
                <li key={i.id}>
                  <Link to={`/history/${i.id}`} className="block px-4 py-3 hover:bg-white/[0.03]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-[#22d3ee]">{i.id}</span>
                      <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${STATUS_TONE[i.status]}`}>{i.status.toUpperCase()}</span>
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

            {pageCount > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-2.5">
                <span className="font-mono text-[11px] text-slate-500">
                  PAGE {safePage + 1} / {pageCount}
                </span>
                <div className="flex gap-2">
                  <button type="button" disabled={safePage === 0} onClick={() => setPage((p) => p - 1)} className="rounded border border-white/15 px-3 py-1 text-xs text-slate-300 disabled:opacity-40">
                    Previous
                  </button>
                  <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="rounded border border-white/15 px-3 py-1 text-xs text-slate-300 disabled:opacity-40">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Panel>
    </PageShell>
  );
}