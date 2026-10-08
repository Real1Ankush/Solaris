import type { ReactNode } from "react";

export function EmptyState({
  title, description, action,
}: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-mono text-xs tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-rose-500/25 bg-rose-500/5 px-6 py-10 text-center">
      <p className="font-mono text-xs tracking-[0.18em] text-rose-300">SOMETHING FAILED</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-md border border-white/15 px-3.5 py-1.5 text-xs text-slate-200 transition-colors hover:bg-white/[0.05]"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-[#ffb020]/25 bg-[#ffb020]/5 px-4 py-2.5 text-xs leading-relaxed text-[#ffb020]">
      <strong className="font-semibold">DEMO MODE</strong> — {children}
    </p>
  );
}