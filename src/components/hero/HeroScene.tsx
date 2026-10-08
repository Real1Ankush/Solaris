import { Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { SceneEnvironment } from "./SceneEnvironment";
import { RobotRig } from "./RobotRig";

export type HeroSceneProps = {
  yaw: MotionValue<number>;
  pitch: MotionValue<number>;
  bodyX: MotionValue<number>;
  bodyY: MotionValue<number>;
  /** Render loop runs only while the hero is on screen. */
  active: boolean;
  reducedMotion: boolean;
  dpr: [number, number];
  /** Scroll chapter owning the shared inspection scene. */
  chapter?: number;
};

/*
 * Framing is authored, not defaulted. The wide composition pushes the target
 * left so the rover sits right of centre and fills roughly two thirds of the
 * viewport height; the compact composition pulls back far enough that the
 * machine still reads across a portrait screen.
 */
function framing(compact: boolean) {
  return compact
    ? { position: new THREE.Vector3(2.0, 1.55, 5.6), target: new THREE.Vector3(-0.1, 1.0, 0), fov: 36 }
    : { position: new THREE.Vector3(2.1, 1.5, 3.6), target: new THREE.Vector3(-0.6, 1.05, 0), fov: 34 };
}

function CameraRig({
  bodyX,
  bodyY,
  reducedMotion,
  chapter = 0,
}: {
  bodyX: MotionValue<number>;
  bodyY: MotionValue<number>;
  reducedMotion: boolean;
  chapter: number;
}) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const look = useMemo(() => new THREE.Vector3(), []);
  const compact = size.width < 900;
  const rigs = useMemo(() => compact
    ? {
        wide: { position: new THREE.Vector3(2.8, 2.1, 7.8), target: new THREE.Vector3(0, 0.9, -2.1) },
        close: { position: new THREE.Vector3(1.6, 3.25, 1.05), target: new THREE.Vector3(0, 0.88, -2.55) },
        machine: { position: new THREE.Vector3(2.7, 2.1, 5.7), target: new THREE.Vector3(0.5, 0.9, -0.3) },
      }
    : {
        wide: { position: new THREE.Vector3(3.8, 2.35, 7.6), target: new THREE.Vector3(0, 0.85, -2.2) },
        close: { position: new THREE.Vector3(0.65, 3.3, 1.15), target: new THREE.Vector3(0, 0.88, -2.6) },
        machine: { position: new THREE.Vector3(2.2, 1.8, 4.6), target: new THREE.Vector3(0.25, 0.85, -0.45) },
      }, [compact]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const rig = chapter <= 0 || chapter === 6 ? rigs.wide : chapter >= 5 ? rigs.machine : rigs.close;

    // Environment parallax only — a few centimetres, never a scene rotation.
    const px = reducedMotion ? 0 : bodyX.get() * 0.014;
    const py = reducedMotion ? 0 : bodyY.get() * 0.009;

    // R3F's frame loop is the intended imperative camera animation boundary.
    // eslint-disable-next-line react-hooks/immutability
    camera.position.x = THREE.MathUtils.damp(camera.position.x, rig.position.x + px, 4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, rig.position.y - py, 4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, rig.position.z, 4, dt);
    look.set(rig.target.x, rig.target.y - py * 0.6, rig.target.z);
    camera.lookAt(look);
  });

  return null;
}

export default function HeroScene({
  yaw,
  pitch,
  bodyX,
  bodyY,
  active,
  reducedMotion,
  dpr,
  chapter = 0,
}: HeroSceneProps) {
  const compact = typeof window !== "undefined" && window.innerWidth < 900;
  const rig = framing(compact);

  return (
    <Canvas
      dpr={dpr}
      // Stops GPU work entirely when the hero scrolls away.
      frameloop={active ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: rig.position.toArray(), fov: rig.fov, near: 0.1, far: 60 }}
    >
      <fog attach="fog" args={["#05080b", 7.5, 24]} />
      <CameraRig bodyX={bodyX} bodyY={bodyY} reducedMotion={reducedMotion} chapter={chapter} />
      <Suspense fallback={null}>
        <SceneEnvironment chapter={chapter} />
        <RobotRig
          yaw={yaw}
          pitch={pitch}
          bodyX={bodyX}
          bodyY={bodyY}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
