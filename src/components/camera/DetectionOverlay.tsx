import { motion } from "framer-motion";
import type { Detection } from "../../types";
import { DEFECT_COLORS } from "../../lib/defectColors";

export interface OverlayOptions {
  showBoxes: boolean;
  showLabels: boolean;
  showConfidence: boolean;
  showZone: boolean;
}

export function DetectionOverlay({
  detections, options,
}: { detections: Detection[]; options: OverlayOptions }) {
  if (!detections.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {options.showZone && (
        <div className="absolute inset-[6%_4%] rounded-sm border border-dashed border-[#22d3ee]/25" />
      )}

      {detections.map((d) => {
        const color = DEFECT_COLORS[d.className];
        const left = `${d.box.x1 * 100}%`;
        const top = `${d.box.y1 * 100}%`;
        const width = `${(d.box.x2 - d.box.x1) * 100}%`;
        const height = `${(d.box.y2 - d.box.y1) * 100}%`;

        return (
          <motion.div
            key={d.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute"
            style={{ left, top, width, height }}
          >
            {options.showBoxes && (
              <div className="h-full w-full rounded-[2px]" style={{ border: `1.5px solid ${color}` }} />
            )}

            {(options.showLabels || options.showConfidence) && (
              <div
                className="absolute -top-[18px] left-0 flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[9px] leading-none"
                style={{ background: color, color: "#08090b" }}
              >
                {options.showLabels && <span>{d.className}</span>}
                {options.showLabels && options.showConfidence && <span aria-hidden>·</span>}
                {options.showConfidence && <span>{(d.confidence * 100).toFixed(0)}%</span>}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}