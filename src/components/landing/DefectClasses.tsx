import { Reveal, SectionHeading } from "./Reveal";
import { DEFECT_CLASSES } from "../../services/mockData";
import { DEFECT_COLORS } from "../../lib/defectColors";
import type { DefectClass } from "../../types";

const DESCRIPTIONS: Record<DefectClass, string> = {
  "Bird-drop": "Droppings covering part of the module surface.",
  Dusty: "Accumulated soiling that reduces effective output.",
  "Electrical-Damage": "Cell or string faults visible to the camera.",
  "Non-Defective": "Healthy panel area retained for contrast.",
  "Physical Damage": "Cracks, delamination and mechanical damage.",
};

export function DefectClasses() {
  return (
    <section id="defects" aria-labelledby="defects-title" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="defects-title"
          eyebrow="CLASSES"
          title="Detect What Matters"
          description="Five classes cover the conditions a camera can actually distinguish on a module surface."
        />

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
          {DEFECT_CLASSES.map((className, i) => (
            <Reveal key={className} delay={i * 0.06} className="bg-[#0b0d10] p-5">
              <span className="h-2 w-2 rounded-sm" style={{ background: DEFECT_COLORS[className] }} aria-hidden />
              <h3 className="mt-3 text-sm font-medium text-white">{className}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{DESCRIPTIONS[className]}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}