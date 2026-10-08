import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0d10] px-6 py-16 text-center sm:px-12">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(255,176,32,0.10), transparent 70%)" }}
          />
          <div className="relative">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#ffb020]">GET STARTED</p>
            <h2 id="cta-title" className="mx-auto mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Point a camera at your array.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
              Open the inspection workspace to review the full detection pipeline, or start with the
              operations dashboard.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/live-inspection"
                className="rounded-md bg-[#ffb020] px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Launch Inspection
              </Link>
              <Link
                to="/dashboard"
                className="rounded-md border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/[0.05]"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}