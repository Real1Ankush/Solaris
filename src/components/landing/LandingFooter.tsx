import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Workspace",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/live-inspection", label: "Live Inspection" },
      { to: "/analyze", label: "Analyze" },
    ],
  },
  {
    title: "Records",
    links: [
      { to: "/history", label: "History" },
      { to: "/analytics", label: "Analytics" },
      { to: "/model", label: "Model" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/robot", label: "Robot" },
      { to: "/system", label: "System" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-14">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded border border-[#ffb020]/30 bg-[#ffb020]/10">
                <span className="h-2.5 w-2.5 rotate-45 border border-[#ffb020]" aria-hidden />
              </span>
              <span className="font-mono text-sm font-semibold tracking-[0.22em] text-white">SOLARIS</span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-slate-500">
              AI-powered solar-panel inspection and defect detection, running on edge hardware.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[10px] tracking-[0.18em] text-slate-600">{column.title.toUpperCase()}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-[13px] text-slate-400 transition-colors hover:text-slate-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-2 border-t border-white/[0.06] pt-6">
          <p className="text-[11px] leading-relaxed text-slate-600">
            This interface runs in DEMO MODE without a connected Raspberry Pi. Figures shown are sample
            data unless a backend is attached.
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Raspberry Pi 4 benchmarks shown are measured deployment throughput and latency. Model
            evaluation metrics are not configured for this deployment.
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-slate-700">
            SOLARIS · YOLOv5n · PICAMERA2 · RASPBERRY PI 4
          </p>
        </div>
      </div>
    </footer>
  );
}