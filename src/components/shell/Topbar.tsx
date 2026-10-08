import { Menu } from "lucide-react";
import { ModeBadge } from "./ModeBadge";
import type { DataMode } from "../../types";

export function Topbar({
  title, mode, onOpenNav, isLoading,
}: { title: string; mode: DataMode; onOpenNav: () => void; isLoading: boolean }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.07] bg-[#0b0d10]/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="rounded-md p-2 text-slate-300 transition-colors hover:bg-white/[0.06] lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <h1 className="min-w-0 flex-1 truncate text-sm font-medium tracking-tight text-slate-100 sm:text-base">
        {title}
      </h1>

      <div className="hidden items-center gap-4 font-mono text-[11px] text-slate-500 sm:flex">
        <span>UPTIME&nbsp;{isLoading ? "—" : "—"}</span>
        <span className="h-3 w-px bg-white/10" aria-hidden />
        <span>RPI4 · YOLOv5n</span>
      </div>

      <ModeBadge mode={mode} />
    </header>
  );
}