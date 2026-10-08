import { useState } from "react";
import { motion } from "framer-motion";
import { ROBOT_ASSET_SRC, ROBOT_HEAD_VIEWPORT } from "../../config/robot";
import { useRobotTracking } from "../../hooks/useRobotTracking";

export function RobotMonitor() {
  const { containerRef, yaw, pitch, bodyX, bodyY } = useRobotTracking<HTMLDivElement>();
  const [failed, setFailed] = useState(false);
  const head = ROBOT_HEAD_VIEWPORT;

  return (
    <div ref={containerRef} className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#060809]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(148,180,220,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,180,220,0.3) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {failed ? (
        <div className="grid h-full place-items-center px-6 text-center">
          <p className="font-mono text-xs leading-relaxed text-slate-500">
            ROBOT ASSET UNAVAILABLE
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--soft)]">No render configured</span>
          </p>
        </div>
      ) : (
        <div className="absolute inset-6" style={{ perspective: 1400 }}>
          <motion.div className="relative h-full w-full" style={{ x: bodyX, y: bodyY }}>
<img src={ROBOT_ASSET_SRC} alt="Solaris inspection rover" className="h-full w-full object-contain" onError={() => setFailed(true)} draggable={false} />
            {!failed && (
              <div className="absolute" style={{ left: `${head.x}%`, top: `${head.y}%`, width: `${head.w}%`, height: `${head.h}%` }}>
                <motion.div className="absolute inset-0" style={{ rotateX: pitch, rotateY: yaw, transformOrigin: `${head.originX}% ${head.originY}%` }}>
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={ROBOT_ASSET_SRC}
                      alt=""
                      aria-hidden
                      draggable={false}
                      className="absolute max-w-none"
                      style={{ width: `${(100 / head.w) * 100}%`, left: `${-(head.x / head.w) * 100}%`, top: `${-(head.y / head.h) * 100}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <span className="absolute left-3 top-3 rounded border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-rose-300">
        ROBOT OFFLINE
      </span>
    </div>
  );
}