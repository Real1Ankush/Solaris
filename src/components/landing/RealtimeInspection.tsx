import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "./Reveal";

const CAPABILITIES = [
  "Camera viewport with normalised bounding-box overlays",
  "Live class labels and per-detection confidence",
  "Frame throughput, inference latency and resolution readouts",
  "Session controls with explicit device-state gating",
];

export function RealtimeInspection() {
  return (
    <section id="realtime" aria-labelledby="realtime-title" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            id="realtime-title"
            eyebrow="WORKSPACE"
            title="Real-Time Inspection"
            description="A dedicated workspace for watching the camera stream and the detection pipeline together."
          />
          <ul className="mt-8 space-y-3">
            {CAPABILITIES.map((item, i) => (
              <Reveal key={item} delay={0.08 + i * 0.05}>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22d3ee]" aria-hidden />
                  <span className="text-sm leading-relaxed text-slate-300">{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}>
            <Link
              to="/live-inspection"
              className="mt-8 inline-block rounded-md border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/[0.05]"
            >
              Open Live Inspection
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="relative aspect-video overflow-hidden rounded-lg border border-white/[0.07] bg-[#050607]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(148,180,220,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,180,220,0.3) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                transform: "perspective(700px) rotateX(56deg) scale(1.6) translateY(16%)",
                transformOrigin: "50% 100%",
              }}
            />
            <div className="absolute left-[14%] top-[38%] h-[26%] w-[30%] rounded-[2px] border-[1.5px] border-[#ffb020]" />
            <div className="absolute left-[46%] top-[26%] h-[30%] w-[26%] rounded-[2px] border-[1.5px] border-[#22d3ee]" />
            <div className="absolute left-[16%] top-[34%] rounded-sm bg-[#ffb020] px-1.5 py-0.5 font-mono text-[9px] leading-none text-[#08090b]">
              Dusty
            </div>
            <div className="absolute left-[48%] top-[22%] rounded-sm bg-[#22d3ee] px-1.5 py-0.5 font-mono text-[9px] leading-none text-[#08090b]">
              Bird-drop
            </div>
            <span className="absolute left-3 top-3 rounded border border-[#ffb020]/40 bg-[#ffb020]/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-[#ffb020]">
              ILLUSTRATION
            </span>
          </div>
          <p className="mt-2 text-[10px] text-slate-600">
            Stylised representation of the inspection viewport, not a live feed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}