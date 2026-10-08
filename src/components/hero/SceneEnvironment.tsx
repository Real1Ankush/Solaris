import { useLayoutEffect, useRef } from "react";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

type PanelSlot = { x: number; z: number };

/*
 * Two rows of tilted modules define the lane the rover inspects. Panels,
 * legs and busbars are instanced, so the field costs four draw calls rather
 * than one mesh per part.
 */
const PANELS: PanelSlot[] = [
  ...[-6.0, -3.6, -1.2, 1.2, 3.6, 6.0].map((x) => ({ x, z: -2.6 })),
  ...[-7.2, -4.8, -2.4, 0, 2.4, 4.8, 7.2].map((x) => ({ x, z: -5.4 })),
];

const PANEL_COUNT = PANELS.length;
const LEG_COUNT = PANEL_COUNT * 2;
const BUSBAR_COUNT = PANEL_COUNT * 3;
const TILT = 0.42;

function PanelField() {
  const frames = useRef<THREE.InstancedMesh>(null);
  const surfaces = useRef<THREE.InstancedMesh>(null);
  const busbars = useRef<THREE.InstancedMesh>(null);
  const legs = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const local = new THREE.Matrix4();
    const euler = new THREE.Euler(TILT, 0, 0);

    PANELS.forEach((panel, index) => {
      dummy.position.set(panel.x, 0.76, panel.z);
      dummy.rotation.copy(euler);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      const base = dummy.matrix.clone();

      frames.current?.setMatrixAt(index, base);
      surfaces.current?.setMatrixAt(index, base.clone().multiply(local.makeTranslation(0, 0.05, 0)));

      [-0.34, 0, 0.34].forEach((offset, busIndex) => {
        busbars.current?.setMatrixAt(
          index * 3 + busIndex,
          base.clone().multiply(local.makeTranslation(0, 0.075, offset)),
        );
      });

      [-0.78, 0.78].forEach((offset, legIndex) => {
        dummy.position.set(panel.x + offset, 0.3, panel.z);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        legs.current?.setMatrixAt(index * 2 + legIndex, dummy.matrix);
      });
    });

    [frames, surfaces, busbars, legs].forEach((ref) => {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    });
  }, []);

  return (
    <group>
      <instancedMesh
        ref={frames}
        args={[undefined, undefined, PANEL_COUNT]}
        frustumCulled={false}
        castShadow={false}
      >
        <boxGeometry args={[2.1, 0.08, 1.18]} />
        <meshStandardMaterial color="#1a2129" metalness={0.8} roughness={0.42} />
      </instancedMesh>

      <instancedMesh
        ref={surfaces}
        args={[undefined, undefined, PANEL_COUNT]}
        frustumCulled={false}
        castShadow={false}
      >
        <boxGeometry args={[1.98, 0.03, 1.06]} />
        <meshStandardMaterial
          color="#0a1723"
          metalness={0.45}
          roughness={0.3}
          emissive="#0a2434"
          emissiveIntensity={0.55}
        />
      </instancedMesh>

      <instancedMesh
        ref={busbars}
        args={[undefined, undefined, BUSBAR_COUNT]}
        frustumCulled={false}
        castShadow={false}
      >
        <boxGeometry args={[1.9, 0.012, 0.02]} />
        <meshBasicMaterial color="#43d9ff" transparent opacity={0.2} />
      </instancedMesh>

      <instancedMesh
        ref={legs}
        args={[undefined, undefined, LEG_COUNT]}
        frustumCulled={false}
        castShadow={false}
      >
        <boxGeometry args={[0.09, 0.6, 0.09]} />
        <meshStandardMaterial color="#12181f" metalness={0.7} roughness={0.55} />
      </instancedMesh>
    </group>
  );
}

/*
 * Lighting and bay structure. No HDRI, no environment map, no post-processing:
 * five lights, one instanced field, one deck and one grid keep the frame cost
 * flat while the scene still reads as a controlled industrial environment.
 */
export function SceneEnvironment({ chapter = 0 }: { chapter?: number }) {
  return (
    <>
      <ambientLight intensity={0.36} color="#51677b" />

      {/* cool key, upper left */}
      <directionalLight position={[-4, 5, 3]} intensity={1.7} color="#cfe6ff" />

      {/* warm rim, low right — separates the chassis from the background */}
      <spotLight
        position={[3.6, 1.4, -2.4]}
        angle={0.7}
        penumbra={0.9}
        intensity={26}
        distance={14}
        color="#f5b942"
      />

      {/* fills the underside so the wheels do not crush to black */}
      <pointLight position={[0, 0.2, 2.6]} intensity={3.2} distance={7} color="#43d9ff" />

      {/* overhead bay light */}
      <spotLight
        position={[0, 4.4, 1.4]}
        angle={0.85}
        penumbra={0.85}
        intensity={20}
        distance={14}
        color="#dbeaff"
      />

      {/* deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, -2]}>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial color="#070a0d" metalness={0.18} roughness={0.94} />
      </mesh>

      <Grid
        position={[0, 0.012, 0]}
        args={[30, 30]}
        cellSize={0.6}
        cellThickness={0.5}
        cellColor="#16242e"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#2f4a5a"
        fadeDistance={16}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid
      />

      <PanelField />

      {/* One panel is marked only while the narrative examines a defect. */}
      {chapter === 3 || chapter === 4 ? (
        <group position={[0, 0.87, -2.58]} rotation={[0.42, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.012, 0.28]} />
            <meshBasicMaterial color={chapter === 3 ? "#d8a64a" : "#e5c17c"} transparent opacity={0.72} />
          </mesh>
          <mesh position={[0, 0.008, 0]}>
            <boxGeometry args={[0.36, 0.004, 0.34]} />
            <meshBasicMaterial color="#e5c17c" transparent opacity={0.25} wireframe />
          </mesh>
        </group>
      ) : null}

      {chapter === 2 ? (
        <mesh position={[0, 0.9, -2.58]} rotation={[0.42, 0, 0]}>
          <boxGeometry args={[1.94, 0.006, 0.018]} />
          <meshBasicMaterial color="#d8c18b" transparent opacity={0.5} />
        </mesh>
      ) : null}

      {/* gantry over the inspection lane */}
      {[-2.6, 2.6].map((x) => (
        <mesh key={x} position={[x, 1.5, -3.2]}>
          <boxGeometry args={[0.24, 3, 0.24]} />
          <meshStandardMaterial color="#151b22" metalness={0.75} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 3, -3.2]}>
        <boxGeometry args={[5.44, 0.24, 0.3]} />
        <meshStandardMaterial color="#151b22" metalness={0.75} roughness={0.5} />
      </mesh>

      {/* back wall + one horizon marker */}
      <mesh position={[0, 2.6, -8.5]}>
        <planeGeometry args={[46, 11]} />
        <meshStandardMaterial color="#070b0f" metalness={0.2} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.85, -8.44]}>
        <boxGeometry args={[46, 0.05, 0.05]} />
        <meshStandardMaterial
          color="#3a2a0d"
          emissive="#f5b942"
          emissiveIntensity={0.75}
          roughness={0.5}
        />
      </mesh>
    </>
  );
}
