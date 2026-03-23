"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useParallax } from "@/hooks/useParallax";
import { useTransform, useMotionValueEvent } from "framer-motion";
import { AttractModeGame } from "./AttractModeGame";

/* ------------------------------------------------------------------ */
/*  Parallax‑driven cabinet wrapper                                    */
/* ------------------------------------------------------------------ */

function CabinetScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const { x, y } = useParallax(0.3);

  const rotY = useTransform(x, [-1, 1], [-0.12, 0.12]);
  const rotX = useTransform(y, [-1, 1], [0.08, -0.08]);

  useMotionValueEvent(rotY, "change", (v) => {
    if (groupRef.current) groupRef.current.rotation.y = v;
  });

  useMotionValueEvent(rotX, "change", (v) => {
    if (groupRef.current) groupRef.current.rotation.x = v;
  });

  return (
    <group ref={groupRef}>
      <CabinetModel />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  3D Arcade Cabinet                                                  */
/* ------------------------------------------------------------------ */

function CabinetModel() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* MAIN BODY — lower wider section */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2.4, 3.2, 1.6]} />
        <meshStandardMaterial
          color="#8B1A1A"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Upper body — slightly narrower */}
      <mesh position={[0, 1.9, -0.05]}>
        <boxGeometry args={[2.2, 1.2, 1.5]} />
        <meshStandardMaterial
          color="#8B1A1A"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* SCREEN BEZEL */}
      <mesh position={[0, 1.1, 0.72]}>
        <boxGeometry args={[1.8, 1.5, 0.12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0} />
      </mesh>

      {/* SCREEN FACE — emissive glow */}
      <mesh position={[0, 1.1, 0.79]}>
        <boxGeometry args={[1.55, 1.25, 0.02]} />
        <meshStandardMaterial
          color="#002233"
          emissive="#00e5ff"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0}
        />
      </mesh>

      {/* AttractModeGame rendered onto the screen via Html */}
      <Html
        position={[0, 1.1, 0.81]}
        transform
        occlude
        scale={0.12}
        style={{
          width: "240px",
          height: "190px",
          overflow: "hidden",
          borderRadius: "0px",
          pointerEvents: "none",
        }}
      >
        <div style={{ width: 240, height: 190, background: "#000" }}>
          <AttractModeGame width={240} height={190} />
        </div>
      </Html>

      {/* TOP MARQUEE */}
      <mesh position={[0, 2.65, 0.05]}>
        <boxGeometry args={[2.2, 0.4, 1.3]} />
        <meshStandardMaterial
          color="#ff2d78"
          emissive="#ff2d78"
          emissiveIntensity={0.35}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* MARQUEE CAP — top crown */}
      <mesh position={[0, 2.92, -0.1]}>
        <boxGeometry args={[2.3, 0.15, 1.4]} />
        <meshStandardMaterial color="#5a0a2a" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* CONTROL PANEL — angled using rotation */}
      <group position={[0, -0.5, 1.0]} rotation={[-0.45, 0, 0]}>
        {/* Panel surface */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.9, 0.12]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Left JOYSTICK — base + pole */}
        <mesh position={[-0.55, 0.05, 0.07]}>
          <cylinderGeometry args={[0.08, 0.1, 0.06, 8]} />
          <meshStandardMaterial color="#333355" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[-0.55, 0.05, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
          <meshStandardMaterial color="#dddddd" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Joystick ball */}
        <mesh position={[-0.55, 0.05, 0.33]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#ff2d78" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* BUTTONS — 6 flat cylinders, 2 rows of 3 */}
        <ButtonCircle position={[0.25, -0.15, 0.08]} color="#ff2d78" />
        <ButtonCircle position={[0.55, -0.15, 0.08]} color="#ffe600" />
        <ButtonCircle position={[0.85, -0.15, 0.08]} color="#00e5ff" />
        <ButtonCircle position={[0.35, 0.15, 0.08]} color="#ff2d78" />
        <ButtonCircle position={[0.65, 0.15, 0.08]} color="#ffe600" />
        <ButtonCircle position={[0.95, 0.15, 0.08]} color="#00e5ff" />
      </group>

      {/* COIN SLOT area */}
      <mesh position={[0, -1.55, 0.82]}>
        <boxGeometry args={[0.5, 0.3, 0.06]} />
        <meshStandardMaterial color="#111122" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Coin slot opening */}
      <mesh position={[0, -1.55, 0.86]}>
        <boxGeometry args={[0.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#050510" roughness={1} metalness={0} />
      </mesh>

      {/* SPEAKER GRILLES — left side */}
      <SpeakerGrille position={[-0.95, 1.1, 0.72]} />
      {/* SPEAKER GRILLES — right side */}
      <SpeakerGrille position={[0.95, 1.1, 0.72]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub‑components                                                     */
/* ------------------------------------------------------------------ */

function ButtonCircle({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}

function SpeakerGrille({ position }: { position: [number, number, number] }) {
  const rows = 4;
  const cols = 1;
  const gap = 0.1;

  return (
    <group position={position}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <mesh
            key={`${r}-${c}`}
            position={[c * gap, (r - rows / 2 + 0.5) * gap, 0]}
          >
            <boxGeometry args={[0.08, 0.04, 0.05]} />
            <meshStandardMaterial color="#0a0a1a" roughness={1} metalness={0} />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported ArcadeCabinet — Canvas wrapper                            */
/* ------------------------------------------------------------------ */

export function ArcadeCabinet({
  onScreenHover,
}: {
  onScreenHover?: (hovered: boolean) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, -1, 6], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
      onPointerOver={() => onScreenHover?.(true)}
      onPointerOut={() => onScreenHover?.(false)}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[1, 2, 2]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-2, 0, 3]} intensity={0.3} color="#ff2d78" />
      <CabinetScene />
    </Canvas>
  );
}
