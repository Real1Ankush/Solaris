import { Suspense, type ReactNode } from "react";

/**
 * Suspense fallback for lazy routes.
 * A labelled progress rail rather than a spinner, so a route change reads
 * as an instrument loading, not as a page load.
 */
export function RouteFallback({ label = "LOADING MODULE" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center px-6"
    >
      <div className="w-full max-w-sm">
        <p className="mono-label text-[var(--soft)]">{label}</p>
        <div className="mt-3 h-px w-full overflow-hidden bg-[var(--line)]">
          <div className="solaris-scan h-full w-1/3 bg-[var(--cyan)]" />
        </div>
      </div>
    </div>
  );
}

export function PageBoundary({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return <Suspense fallback={<RouteFallback label={label} />}>{children}</Suspense>;
}