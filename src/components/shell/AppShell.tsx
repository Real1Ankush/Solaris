import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarDesktop, SidebarMobile } from "./Sidebar";
import { NAV_ITEMS } from "./navigation";
import { Topbar } from "./Topbar";
import { useSystemStatus } from "../../hooks/useSystemStatus";
import type { DataMode } from "../../types";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/live-inspection": "Live Inspection",
  "/analyze": "Analyze",
  "/history": "Inspection History",
  "/analytics": "Analytics",
  "/robot": "Robot",
  "/model": "Model",
  "/system": "System",
};

export function AppShell() {
  const [collapsed, setCollapsed] = useState(() => window.localStorage.getItem("solaris.sidebar") === "collapsed");
  const [navOpenPath, setNavOpenPath] = useState<string | null>(null);
  const location = useLocation();
  const navOpen = navOpenPath === location.pathname;
  const { status, isLoading } = useSystemStatus();

  const mode: DataMode = status?.mode ?? "demo";

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("solaris.sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  };

  const base = `/${location.pathname.split("/")[1]}`;
  const title = TITLES[base] ?? NAV_ITEMS.find((i) => i.to === base)?.label ?? "Solaris";

  return (
    <div className="flex min-h-screen bg-[#08090b] text-slate-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#ffb020] focus:px-3 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>

      <SidebarDesktop collapsed={collapsed} onToggle={toggleCollapsed} />
      <SidebarMobile open={navOpen} mode={mode} onClose={() => setNavOpenPath(null)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} mode={mode} onOpenNav={() => setNavOpenPath(location.pathname)} isLoading={isLoading} />
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
