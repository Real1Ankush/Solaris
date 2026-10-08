import { Pause, Play, Square } from "lucide-react";

export type SessionState = "idle" | "running" | "paused";

export function InspectionControls({
  state, onStart, onPause, onStop, commandsSent,
}: {
  state: SessionState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  commandsSent: boolean;
}) {
  const button =
    "inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb020] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onStart}
        disabled={state === "running"}
        className={`${button} border-[#ffb020]/40 bg-[#ffb020]/10 text-[#ffb020] hover:bg-[#ffb020]/20`}
      >
        <Play className="h-3.5 w-3.5" aria-hidden />
        Start Inspection
      </button>
      <button
        type="button"
        onClick={onPause}
        disabled={state !== "running"}
        className={`${button} border-white/15 text-slate-200 hover:bg-white/[0.05]`}
      >
        <Pause className="h-3.5 w-3.5" aria-hidden />
        Pause
      </button>
      <button
        type="button"
        onClick={onStop}
        disabled={state === "idle"}
        className={`${button} border-white/15 text-slate-200 hover:bg-white/[0.05]`}
      >
        <Square className="h-3.5 w-3.5" aria-hidden />
        Stop
      </button>

      <span className="ml-auto font-mono text-[10px] tracking-[0.14em] text-slate-600">
        {commandsSent ? "COMMANDS SENT TO DEVICE" : "LOCAL SESSION ONLY · NO COMMANDS SENT"}
      </span>
    </div>
  );
}