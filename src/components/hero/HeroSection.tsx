import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRobotTracking } from "../../hooks/useRobotTracking";
import { HeroHud } from "./HeroHud";
import { HeroRail } from "./HeroRail";
import { HeroStageFallback } from "./HeroStageFallback";

// The entire Three.js / R3F / Drei stack lives behind this boundary. The
// landing bundle never imports it directly.
const HeroScene = lazy(() => import("./HeroScene"));

gsap.registerPlugin(ScrollTrigger);

function webglAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/*
 * 01 — INSPECTION BAY.
 *
 * Not a two-column hero. Four depth layers stack across one full viewport:
 * ghost typography behind the canvas, the transparent WebGL bay, editorial
 * type that crosses the machine, then the instrument layer (spatial labels,
 * reticle, readout rail).
 */
export function HeroSection() {
  const {
    containerRef,
    yaw,
    pitch,
    bodyX,
    bodyY,
    crossX,
    crossY,
    crossPresence,
    isTracking,
    reducedMotion,
  } = useRobotTracking<HTMLDivElement>();

  const rootRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(true);
  const [webgl] = useState(webglAvailable);
  const [dpr] = useState<[number, number]>(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1.25] : [1, 1.75],
  );

  // Render loop runs only while the hero is on screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      const nav = document.querySelector("[data-nav-shell]");

      /*
       * Presentation choreography. Each beat enters from a different
       * direction so the page assembles like an instrument, not a template.
       */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-hero-env]", { opacity: 0, scale: 1.05, duration: 1.2, ease: "power2.out" }, 0)
        .from(nav, { yPercent: -130, opacity: 0, duration: 0.5, ease: "power4.out" }, 0.15)
        .from(
          "[data-hero-eyebrow]",
          { clipPath: "inset(0 100% 0 0)", x: -18, duration: 0.45, ease: "power3.out" },
          0.25,
        )
        .from(
          "[data-hero-line]",
          {
            yPercent: 118,
            rotateX: -44,
            skewY: 3,
            duration: 0.78,
            stagger: 0.07,
            ease: "power4.out",
          },
          0.4,
        )
        .from(
          "[data-hero-stage]",
          { opacity: 0, scale: 1.14, xPercent: 5, duration: 1.25, ease: "power3.out" },
          0.6,
        )
        .from(
          "[data-hero-hud-cell]",
          {
            opacity: 0,
            scaleX: 0.2,
            transformOrigin: "left center",
            duration: 0.45,
            stagger: 0.06,
          },
          0.8,
        )
        .from(
          "[data-hero-annotation]",
          { opacity: 0, x: 26, duration: 0.5, ease: "power3.out" },
          0.8,
        )
        .from(
          "[data-hero-rail]",
          { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "power3.out" },
          1,
        )
        .from("[data-hero-cmd]", { opacity: 0, x: -12, duration: 0.4, stagger: 0.06 }, 1);

      // Scroll exit — the bay recedes, the type separates at three rates.
      gsap.to("[data-hero-ghost]", {
        xPercent: -16,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-line='1']", {
        xPercent: -7,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-line='2']", {
        xPercent: 9,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-line='3']", {
        xPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-stage]", {
        yPercent: -7,
        scale: 1.04,
        opacity: 0.34,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.7 },
      });
      gsap.to("[data-hero-rail]", {
        yPercent: 70,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.7 },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="hero-root" aria-labelledby="hero-title">
      {/* Layer 0 — environment + ghost type, occluded by the rover. */}
      <div className="hero-env" data-hero-env aria-hidden="true">
        <span className="hero-ghost" data-hero-ghost>
          SOLARIS
        </span>
        <div className="hero-env-grid" />
        <div className="hero-env-horizon" />
      </div>

      {/* Layer 1 — full-bleed inspection bay. */}
      <div ref={containerRef} className="hero-field" data-hero-stage>
        <div className="hero-canvas">
          {webgl ? (
            <Suspense fallback={<HeroStageFallback />}>
              <HeroScene
                yaw={yaw}
                pitch={pitch}
                bodyX={bodyX}
                bodyY={bodyY}
                active={inView}
                reducedMotion={reducedMotion}
                dpr={dpr}
              />
            </Suspense>
          ) : (
            <HeroStageFallback label="OPTICAL SURFACE UNAVAILABLE · SCHEMATIC VIEW" />
          )}
        </div>

        <motion.div
          aria-hidden
          className="hero-reticle"
          style={{ left: crossX, top: crossY, opacity: crossPresence }}
        />

        <HeroHud tracking={isTracking} />
      </div>

      {/* Layer 2 — editorial type crossing the scene. */}
      <div className="hero-type">
        <p className="hero-eyebrow" data-hero-eyebrow>
          <span className="hero-eyebrow-index">01</span>
          <span>Autonomous PV inspection</span>
          <span className="hero-eyebrow-rule" aria-hidden="true" />
          <span>Edge node · Raspberry Pi 4</span>
        </p>

        <h1 id="hero-title" className="hero-headline">
          <span className="hero-line-mask hero-line-mask--1">
            <span className="hero-line hero-line--1" data-hero-line="1">
              THE PANEL
            </span>
          </span>
          <span className="hero-line-mask hero-line-mask--2">
            <span className="hero-line hero-line--2" data-hero-line="2">
              INSPECTION
            </span>
          </span>
          <span className="hero-line-mask hero-line-mask--3">
            <span className="hero-line hero-line--3" data-hero-line="3">
              MACHINE
            </span>
          </span>
        </h1>

        <p className="hero-annotation" data-hero-annotation>
          <span className="hero-annotation-lead" aria-hidden="true" />
          Computer vision and edge robotics for automated solar asset inspection.
          <strong> Inference runs on the device.</strong>
        </p>
      </div>

      {/* Layer 3 — instrumentation. */}
      <HeroRail />

      <div className="hero-cue" aria-hidden="true">
        <span>SCROLL</span>
        <span className="hero-cue-line" />
      </div>
    </section>
  );
}
