import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export const MAX_YAW_DEG = 12;
export const MAX_PITCH_DEG = 6;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

type Options = { disabled?: boolean };

export function useRobotTracking<T extends HTMLElement = HTMLDivElement>(
  options: Options = {},
) {
  const { disabled = false } = options;

  const containerRef = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [isTouch, setIsTouch] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Raw pointer position, normalised to -1..1 inside the hero box.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawPresence = useMotionValue(0);

  // Spring config: low-ish damping gives the subtle inertia/overshoot.
  const headSpring = { stiffness: 110, damping: 16, mass: 0.7 };
  const x = useSpring(rawX, headSpring);
  const y = useSpring(rawY, headSpring);
  const presence = useSpring(rawPresence, { stiffness: 220, damping: 30 });

  // Head rotation. Pointer right => negative rotateY (head turns right).
  const yaw: MotionValue<number> = useTransform(
    x,
    [-1, 1],
    [MAX_YAW_DEG, -MAX_YAW_DEG],
  );
  const pitch: MotionValue<number> = useTransform(
    y,
    [-1, 1],
    [MAX_PITCH_DEG, -MAX_PITCH_DEG],
  );

  // Body gets a whisper of movement for depth, never a full rotation.
  const bodyX = useTransform(x, [-1, 1], [10, -10]);
  const bodyY = useTransform(y, [-1, 1], [4, -4]);
  const bodyTilt = useTransform(x, [-1, 1], [1.8, -1.8]);

  // Crosshair position, as percentage strings so it tracks without re-render.
  const crossX = useTransform(x, (v) => `${(v * 0.5 + 0.5) * 100}%`);
  const crossY = useTransform(y, (v) => `${(v * 0.5 + 0.5) * 100}%`);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(!hover.matches || coarse.matches);
    update();
    hover.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      hover.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled || prefersReducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      rawX.set(
        clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      );
      rawY.set(
        clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
      );
      rawPresence.set(1);
      setIsTracking(true);
    };

    const onPointerLeave = () => {
      rawX.set(0);
      rawY.set(0);
      rawPresence.set(0);
      setIsTracking(false);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [disabled, prefersReducedMotion, rawX, rawY, rawPresence]);

  // Touch devices and reduced-motion users get a slow idle scan instead.
  useEffect(() => {
    if (!isTouch || disabled || prefersReducedMotion) return;
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = (now - started) / 1000;
      rawX.set(Math.sin(t * 0.42) * 0.4);
      rawY.set(Math.sin(t * 0.27 + 1.2) * 0.16);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isTouch, disabled, prefersReducedMotion, rawX, rawY]);

  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      rawX.set(0);
      rawY.set(0);
      rawPresence.set(0);
    }
  }, [disabled, prefersReducedMotion, rawX, rawY, rawPresence]);

  return {
    containerRef,
    yaw,
    pitch,
    bodyX,
    bodyY,
    bodyTilt,
    crossX,
    crossY,
    crossPresence: presence,
    isTracking,
    isTouch,
    reducedMotion: Boolean(prefersReducedMotion),
  };
}