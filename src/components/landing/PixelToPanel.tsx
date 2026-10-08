import { Reveal, SectionHeading } from "./Reveal";

const STEPS = [
  { title: "Capture", detail: "Picamera2 captures frames from the rover-mounted camera." },
  { title: "Detection", detail: "YOLOv5n locates candidate regions inside each frame." },
  { title: "Classification", detail: "Every region is assigned one of five panel classes." },
  { title: "Inspection Report", detail: "Detections are aggregated into a per-session record." },
];

export function PixelToPanel() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="how-it-works-title"
          eyebrow="PIPELINE"
          title="From Pixels to Panel Health"
          description="Four stages turn a camera frame into a structured inspection record."
        />

        <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.07} className="bg-[#0b0d10] p-6">
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#22d3ee]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-sm font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}