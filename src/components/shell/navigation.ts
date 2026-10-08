import {
  BarChart3, Bot, Camera, Cpu, History, LayoutDashboard, ScanLine, Server,
} from "lucide-react";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live-inspection", label: "Live Inspection", icon: Camera },
  { to: "/analyze", label: "Analyze", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/robot", label: "Robot", icon: Bot },
  { to: "/model", label: "Model", icon: Cpu },
  { to: "/system", label: "System", icon: Server },
] as const;
