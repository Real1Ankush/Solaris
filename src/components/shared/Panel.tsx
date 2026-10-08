import type { ReactNode } from "react";

export function Panel({
  title, meta, children, className = "",
}: { title: string; meta?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0d10] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-2.5">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-slate-400">{title.toUpperCase()}</h3>
        {meta && <div className="shrink-0">{meta}</div>}
      </div>
      {children}
    </section>
  );
}