import { Reveal, SectionHeading } from "./Reveal";
import { MEASURED_BENCHMARKS } from "../../services/mockData";

const STAGES = ["Camera", "Raspberry Pi 4", "YOLOv5n", "Detection Engine", "Solaris"];

export function EdgePipeline() {
  return (
    <section id="edge" aria-labelledby="edge-title" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="edge-title"
          eyebrow="HARDWARE"
          title="Built for the Edge"
          description="Inference runs on the device itself. Frames are classified on a Raspberry Pi 4 rather than streamed off-site."
        />

        <Reveal delay={0.1} className="mt-12">
          <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {STAGES.map((stage, i) => (
              <li key={stage} className="flex flex-1 items-center gap-2">
                <div className="flex-1 rounded-md border border-white/[0.10] bg-[#0b0d10] px-4 py-3">
                  <p className="font-mono text-[11px] tracking-[0.14em] text-slate-300">{stage}</p>
                </div>
                {i < STAGES.length - 1 && (
                  <span className="hidden font-mono text-xs text-[#ffb020] sm:block" aria-hidden>
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.16} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "MODEL-ONLY THROUGHPUT", value: `${MEASURED_BENCHMARKS.modelOnlyFps} FPS` },
            { label: "MODEL-ONLY LATENCY", value: `${MEASURED_BENCHMARKS.modelOnlyLatencyMs} ms` },
            { label: "LIVE PIPELINE", value: `${MEASURED_BENCHMARKS.livePipelineFps} FPS` },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-white/[0.07] bg-[#0b0d10] p-4">
              <p className="font-mono text-[10px] tracking-[0.16em] text-slate-500">{item.label}</p>
              <p className="mt-1.5 font-mono text-xl tabular-nums text-white">{item.value}</p>
            </div>
          ))}
        </Reveal>

        <p className="mt-4 max-w-2xl text-[11px] leading-relaxed text-slate-600">
          Measured Raspberry Pi 4 deployment throughput and latency. These are performance figures, not
          model accuracy. Source: {MEASURED_BENCHMARKS.source}.
        </p>
      </div>
    </section>
  );
}