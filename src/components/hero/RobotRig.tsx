import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const DEG = Math.PI / 180;

export type RobotRigProps = {
  yaw: MotionValue<number>;
  pitch: MotionValue<number>;
  bodyX: MotionValue<number>;
  bodyY: MotionValue<number>;
  reducedMotion: boolean;
};

const WHEELS: Array<[number, number, number]> = [
  [-0.95, 0.36, 0.68],
  [0.95, 0.36, 0.68],
  [-0.95, 0.36, -0.68],
  [0.95, 0.36, -0.68],
];

/*
 * Procedural Solaris inspection rover.
 *
 * This is a visual representation, not a claim about real hardware. When a
 * photographic or modelled asset becomes available, swap the contents of this
 * group for it — the head-tracking contract below is what the rest of the
 * hero depends on, and it is deliberately kept in one place.
 */
export function RobotRig({ yaw, pitch, bodyX, bodyY, reducedMotion }: RobotRigProps) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group[]>([]);
  const scanCone = useRef<THREE.Mesh>(null);
  const lens = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;

    if (head.current) {
      // Pointer tracking comes from useRobotTracking, already clamped to
      // ±12° yaw / ±6° pitch. Damped again here so 3D inertia matches the
      // spring feel of the DOM layer.
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        yaw.get() * DEG,
        9,
        dt,
      );
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        pitch.get() * DEG,
        9,
        dt,
      );
    }

    if (body.current) {
      // The body barely moves. Depth cue only — no full-body rotation.
      body.current.position.x = THREE.MathUtils.damp(
        body.current.position.x,
        bodyX.get() * 0.0055,
        5,
        dt,
      );
      body.current.position.y = THREE.MathUtils.damp(
        body.current.position.y,
        bodyY.get() * 0.003,
        5,
        dt,
      );
    }

    if (!reducedMotion) {
      spin.current.forEach((wheel) => {
        if (wheel) wheel.rotation.y = t * 0.5;
      });
      if (scanCone.current) {
        const mat = scanCone.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.07 + Math.sin(t * 1.25) * 0.02;
      }
      if (lens.current) lens.current.emissiveIntensity = 2.4 + Math.sin(t * 2.4) * 0.4;
    }
  });

  return (
    // 1.18× — the machine has to hold the frame, not float inside it.
    <group scale={1.18} dispose={null}>
      <group ref={body}>
        {/* ── chassis ───────────────────────────────────────── */}
        <mesh position={[0, 0.64, 0]}>
          <boxGeometry args={[2.36, 0.44, 1.56]} />
          <meshStandardMaterial color="#0d1218" metalness={0.55} roughness={0.72} />
        </mesh>

        {/* shoulder deck — brushed graphite, catches the key light */}
        <mesh position={[0, 0.89, 0]}>
          <boxGeometry args={[2.04, 0.08, 1.36]} />
          <meshStandardMaterial color="#303a45" metalness={0.86} roughness={0.36} />
        </mesh>

        {/* recessed side skirts give the body a manufactured edge */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 1.14, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.2, 1.3]} />
            <meshStandardMaterial color="#111820" metalness={0.7} roughness={0.55} />
          </mesh>
        ))}

        {/* flank stripe + amber service marker */}
        {[-1, 1].map((side) => (
          <mesh key={`stripe-${side}`} position={[side * 1.195, 0.68, 0]}>
            <boxGeometry args={[0.012, 0.06, 1.12]} />
            <meshStandardMaterial
              color="#f5b942"
              emissive="#f5b942"
              emissiveIntensity={0.7}
              roughness={0.45}
            />
          </mesh>
        ))}

        {/* bumpers */}
        {[-1, 1].map((side) => (
          <mesh key={`bumper-${side}`} position={[0, 0.5, side * 0.82]}>
            <boxGeometry args={[2.08, 0.18, 0.09]} />
            <meshStandardMaterial color="#0a0e13" metalness={0.6} roughness={0.66} />
          </mesh>
        ))}

        {/* ── equipment bay ─────────────────────────────────── */}
        <mesh position={[0.66, 1.06, -0.16]}>
          <boxGeometry args={[0.78, 0.3, 0.86]} />
          <meshStandardMaterial color="#151c24" metalness={0.72} roughness={0.5} />
        </mesh>
        {[-0.24, -0.08, 0.08, 0.24].map((z) => (
          <mesh key={z} position={[1.06, 1.06, -0.16 + z]}>
            <boxGeometry args={[0.02, 0.18, 0.07]} />
            <meshStandardMaterial color="#0a0e13" metalness={0.5} roughness={0.7} />
          </mesh>
        ))}

        {/* ── solar deck ────────────────────────────────────── */}
        <group position={[0.44, 0.95, 0.1]} rotation={[-0.16, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.04, 0.03, 1.0]} />
            <meshStandardMaterial
              color="#0a1622"
              metalness={0.5}
              roughness={0.26}
              emissive="#0d2436"
              emissiveIntensity={0.6}
            />
          </mesh>
          {[-0.25, 0, 0.25].map((z) => (
            <mesh key={z} position={[0, 0.018, z]}>
              <boxGeometry args={[1.0, 0.004, 0.012]} />
              <meshBasicMaterial color="#43d9ff" transparent opacity={0.3} />
            </mesh>
          ))}
          {[-0.33, 0.33].map((x) => (
            <mesh key={x} position={[x, 0.018, 0]}>
              <boxGeometry args={[0.012, 0.004, 0.98]} />
              <meshBasicMaterial color="#43d9ff" transparent opacity={0.2} />
            </mesh>
          ))}
        </group>

        {/* ── running gear ──────────────────────────────────── */}
        {WHEELS.map(([x, y, z], index) => (
          <group key={`${x}-${z}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <group
              ref={(el) => {
                if (el) spin.current[index] = el;
              }}
            >
              <mesh>
                <cylinderGeometry args={[0.36, 0.36, 0.3, 28]} />
                <meshStandardMaterial color="#0b0f14" metalness={0.2} roughness={0.9} />
              </mesh>
              {/* tread ribs */}
              {[-0.1, 0, 0.1].map((offset) => (
                <mesh key={offset} position={[0, offset, 0]}>
                  <torusGeometry args={[0.35, 0.022, 6, 26]} />
                  <meshStandardMaterial color="#161c23" metalness={0.3} roughness={0.8} />
                </mesh>
              ))}
              {/* hub — warm, reads as a powered joint */}
              <mesh position={[0, 0.16, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.04, 18]} />
                <meshStandardMaterial
                  color="#f5b942"
                  emissive="#f5b942"
                  emissiveIntensity={0.45}
                  metalness={0.8}
                  roughness={0.35}
                />
              </mesh>
            </group>
          </group>
        ))}

        {/* suspension links */}
        {[-1, 1].map((side) =>
          [0.68, -0.68].map((z) => (
            <mesh
              key={`${side}-${z}`}
              position={[side * 0.8, 0.46, z]}
              rotation={[0, 0, side * 0.16]}
            >
              <boxGeometry args={[0.36, 0.06, 0.07]} />
              <meshStandardMaterial color="#151c25" metalness={0.75} roughness={0.48} />
            </mesh>
          )),
        )}

        {/* ── mast + camera head ────────────────────────────── */}
        <mesh position={[-0.62, 1.3, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.94, 16]} />
          <meshStandardMaterial color="#1e2630" metalness={0.9} roughness={0.32} />
        </mesh>

        {/* protective cage around the mast */}
        {[-0.28, 0.28].map((offset) => (
          <mesh key={offset} position={[-0.62 + offset, 1.34, 0]}>
            <boxGeometry args={[0.05, 0.86, 0.05]} />
            <meshStandardMaterial color="#1a222b" metalness={0.82} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[-0.62, 1.76, 0]}>
          <boxGeometry args={[0.61, 0.05, 0.05]} />
          <meshStandardMaterial color="#1a222b" metalness={0.82} roughness={0.4} />
        </mesh>

        {/* neck joint */}
        <mesh position={[-0.62, 1.78, 0]}>
          <sphereGeometry args={[0.1, 18, 14]} />
          <meshStandardMaterial
            color="#f5b942"
            emissive="#f5b942"
            emissiveIntensity={0.35}
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>

        <group ref={head} position={[-0.62, 1.86, 0]}>
          <mesh>
            <boxGeometry args={[0.44, 0.32, 0.4]} />
            <meshStandardMaterial color="#1a222b" metalness={0.8} roughness={0.34} />
          </mesh>

          {/* brow / sun shield */}
          <mesh position={[0, 0.19, 0.1]} rotation={[0.22, 0, 0]}>
            <boxGeometry args={[0.48, 0.04, 0.34]} />
            <meshStandardMaterial color="#0c1117" metalness={0.6} roughness={0.6} />
          </mesh>

          {/* barrel */}
          <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.12, 0.2, 24]} />
            <meshStandardMaterial color="#12181f" metalness={0.9} roughness={0.26} />
          </mesh>

          {/* lens */}
          <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.09, 24]} />
            <meshStandardMaterial
              ref={lens}
              color="#04121a"
              emissive="#43d9ff"
              emissiveIntensity={2.4}
              roughness={0.12}
              metalness={0}
            />
          </mesh>

          {/* illuminator + status LED */}
          <mesh position={[0.16, -0.1, 0.21]}>
            <sphereGeometry args={[0.03, 12, 10]} />
            <meshStandardMaterial
              color="#3a2408"
              emissive="#ffb347"
              emissiveIntensity={1.7}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[-0.16, 0.11, 0.21]}>
            <sphereGeometry args={[0.024, 10, 8]} />
            <meshStandardMaterial
              color="#06222c"
              emissive="#43d9ff"
              emissiveIntensity={2.4}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* ── scan cone ─────────────────────────────────────── */}
        {!reducedMotion && (
          <mesh ref={scanCone} position={[-0.62, 1.86, 1.55]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.0, 2.4, 32, 1, true]} />
            <meshBasicMaterial
              color="#f5b942"
              transparent
              opacity={0.07}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* ── antenna ───────────────────────────────────────── */}
        <mesh position={[1.0, 1.34, -0.5]}>
          <cylinderGeometry args={[0.013, 0.018, 0.6, 8]} />
          <meshStandardMaterial color="#20282f" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[1.0, 1.65, -0.5]}>
          <sphereGeometry args={[0.038, 12, 10]} />
          <meshStandardMaterial
            color="#3a1d05"
            emissive="#f5b942"
            emissiveIntensity={1.4}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}
