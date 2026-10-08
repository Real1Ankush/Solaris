import type { DataMode } from "../../types";

const STYLES: Record<DataMode, { label: string; dot: string; text: string; border: string }> = {
  live: { label: "LIVE", dot: "bg-emerald-400", text: "text-emerald-300", border: "border-emerald-500/30" },
  demo: { label: "DEMO MODE", dot: "bg-[#ffb020]", text: "text-[#ffb020]", border: "border-[#ffb020]/30" },
  offline: { label: "OFFLINE", dot: "bg-rose-500", text: "text-rose-300", border: "border-rose-500/30" },
};

export function ModeBadge({ mode, size = "md" }: { mode: DataMode; size?: "sm" | "md" }) {
  const style = STYLES[mode];
  return (
    <span
      role="status"
      aria-label={`Data source: ${style.label}`}
      className={`inline-flex items-center gap-2 rounded border ${style.border} bg-white/[0.03] ${style.text} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      } font-mono tracking-[0.14em]`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      {style.label}
    </span>
  );
}