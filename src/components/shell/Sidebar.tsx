import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import type { DataMode } from "../../types";
import { NAV_ITEMS } from "./navigation";

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
              isActive
                ? "bg-white/[0.06] text-white"
                : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
            } ${collapsed ? "justify-center px-2" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded bg-[#ffb020]"
                  aria-hidden
                />
              )}
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-[#ffb020]/30 bg-[#ffb020]/10">
        <span className="h-2.5 w-2.5 rotate-45 border border-[#ffb020]" aria-hidden />
      </span>
      {!collapsed && (
        <span className="font-mono text-sm font-semibold tracking-[0.22em] text-white">SOLARIS</span>
      )}
    </div>
  );
}

export function SidebarDesktop({
  collapsed, onToggle,
}: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={`hidden shrink-0 border-r border-white/[0.07] bg-[#0b0d10] transition-[width] duration-300 ease-out lg:flex lg:flex-col ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className={`flex h-16 items-center border-b border-white/[0.07] ${collapsed ? "justify-center px-2" : "px-5"}`}>
        <Brand collapsed={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavList collapsed={collapsed} />
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="flex items-center gap-2 border-t border-white/[0.07] px-5 py-3 text-xs text-slate-500 transition-colors hover:text-slate-300"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden /> : <ChevronLeft className="h-4 w-4" aria-hidden />}
        {!collapsed && "Collapse"}
      </button>
    </aside>
  );
}

export function SidebarMobile({
  open, mode, onClose,
}: { open: boolean; mode: DataMode; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.07] bg-[#0b0d10] lg:hidden"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          >
            <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
              <Brand collapsed={false} />
              <button type="button" onClick={onClose} aria-label="Close navigation" className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavList collapsed={false} onNavigate={onClose} />
            </div>
            <div className="border-t border-white/[0.07] px-5 py-4 font-mono text-[10px] tracking-[0.14em] text-slate-500">
              DATA SOURCE: {mode.toUpperCase()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
