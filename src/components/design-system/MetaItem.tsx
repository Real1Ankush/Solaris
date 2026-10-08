import type { ReactNode } from "react";
import { clsx } from "clsx";

export type MetaItemProps = {
  label: string;
  value: ReactNode;
  /** Small qualifier line — e.g. "model-only", "measured". */
  hint?: string;
  tone?: "solar" | "beam";
  className?: string;
};

/**
 * Compact technical metadata readout. Replaces the .hero-meta-item pattern
 * and the same figure/label pair used on the model, system and robot pages.
 */
export function MetaItem({
  label,
  value,
  hint,
  tone,
  className,
}: MetaItemProps) {
  const valueColor =
    tone === "solar"
      ? "text-[var(--ds-solar)]"
      : tone === "beam"
        ? "text-[var(--ds-beam)]"
 : "";

  return (
    <div className={clsx("ds-inset px-3 py-2.5", className)}>
      <span className="ds-label block">{label}</span>
      <span className={clsx("ds-value mt-1 block text-[0.95rem]", valueColor)}>
        {value}
      </span>
      {hint ? (
        <span className="mt-0.5 block font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[var(--ds-fog)]">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
