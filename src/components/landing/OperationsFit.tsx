import { Reveal, SectionHeading } from "./Reveal";

const POINTS = [
  { title: "Edge-first by default", detail: "Classification happens on the device, so operation does not depend on site bandwidth." },
  { title: "Per-session records", detail: "Every inspection is stored with its detections, timings and mean detection confidence." },
  { title: "Severity triage", detail: "Electrical and physical damage are separated from soiling so crews can prioritise." },
  { title: "Exportable reports", detail: "Session summaries download as text or JSON for asset management." },
];

export function OperationsFit() {
  return (
    <section id="operations" aria-labelledby="operations-title" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="operations-title"
          eyebrow="OPERATIONS"
          title="Designed for Solar Operations"
          description="The interface is built around the questions an asset team actually asks."
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.06} className="bg-[#0b0d10] p-6">
              <h3 className="text-sm font-medium text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{point.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}