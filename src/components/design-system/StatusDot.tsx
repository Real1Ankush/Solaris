import { forwardRef } from "react";
import { clsx } from "clsx";

export type StatusTone = "nominal" | "active" | "warn" | "fault" | "idle";

const TONE_TEXT: Record<StatusTone, string> = {
  nominal: "NOMINAL",
  active: "ACTIVE",
  warn: "WARNING",
  fault: "FAULT",
  idle: "IDLE",
};

export type StatusDotProps = {
  tone?: StatusTone;
  /** Visible label. Omit for a bare indicator. */
  label?: string;
  /** Set false for states known to be static. */
  pulse?: boolean;
  className?: string;
};

function pulseClassFor(tone: StatusTone, pulse: boolean) {
  if (!pulse) return "";
  if (tone === "fault") return "ds-dot--pulse-fast";
  if (tone === "warn" || tone === "active") return "ds-dot--pulse";
  return "";
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  function StatusDot({ tone = "nominal", label, pulse = true, className }, ref) {
    const dotClass = clsx("ds-dot", `ds-dot--${tone}`, pulseClassFor(tone, pulse));

    /*
     * Bare form. The graphic is decorative, so it stays aria-hidden, but the
     * tone is carried in visually-hidden text rather than left to a companion
     * component the caller has to remember to add.
     */
    if (!label) {
      return (
        <span ref={ref} className={clsx("ds-status", className)}>
          <span aria-hidden="true" className={dotClass} />
          <span className="ds-sr-only">{TONE_TEXT[tone]}</span>
        </span>
      );
    }

    return (
      <span className={clsx("ds-status", className)}>
        <span ref={ref} aria-hidden="true" className={dotClass} />
        {label}
      </span>
    );
  },
);
