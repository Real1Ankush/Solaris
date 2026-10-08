import type { ElementType, ReactNode } from "react";
import { clsx } from "clsx";

// ElementType needs its prop shape declared, otherwise the polymorphic tag
// resolves to `never` props and every child is rejected.
type MarkerElement = ElementType<{ children?: ReactNode; className?: string }>;

export type SectionMarkerProps = {
  index: string;
  label: string;
  as?: MarkerElement;
  className?: string;
  children?: ReactNode;
};

/**
 * Numbered technical section marker: 01 ——— PIPELINE.
 * Carries scroll-storytelling structure without a decorative frame.
 */
export function SectionMarker({
  index,
  label,
  as: Tag = "div",
  className,
  children,
}: SectionMarkerProps) {
  return (
    <Tag className={clsx("flex items-center gap-4", className)}>
      <span className="ds-label ds-label-beam tabular-nums">{index}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--ds-rule)]" />
      <span className="ds-label">{label}</span>
      {children}
    </Tag>
  );
}
