"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type FloatingObjectType =
  | "dino"
  | "coin"
  | "star"
  | "ghost"
  | "mushroom"
  | "lightning"
  | "gem"
  | "skull"
  | "controller";

export type DepthLayer = "near" | "mid" | "far";

interface FloatingObjectProps {
  type: FloatingObjectType;
  position: [number, number, number];
  scale?: number;
  speed?: number;
  depth: DepthLayer;
}

const DEPTH_CONFIG: Record<DepthLayer, { scale: number; opacity: number; speed: number }> = {
  far:  { scale: 0.3, opacity: 0.3, speed: 0.2 },
  mid:  { scale: 0.6, opacity: 0.6, speed: 0.4 },
  near: { scale: 1.0, opacity: 0.9, speed: 0.7 },
};

const GHOST_COLORS = ["#ff2d78", "#00e5ff", "#ff6b35"];

/* ------------------------------------------------------------------ */
/*  Voxel shape builders — each returns an array of mesh descriptors  */
/* ------------------------------------------------------------------ */

type VoxelBox = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
};

function dinoBoxes(): VoxelBox[] {
  const c = "#2a2a2a";
  return [
    // body
    { position: [0, 0, 0], size: [1.2, 0.8, 0.6], color: c },
    // chest / neck
    { position: [0.5, 0.5, 0], size: [0.5, 0.6, 0.5], color: c },
    // head
    { position: [0.7, 1.0, 0], size: [0.7, 0.5, 0.5], color: c },
    // jaw
    { position: [1.0, 0.7, 0], size: [0.5, 0.2, 0.4], color: c },
    // eye
    { position: [0.9, 1.1, 0.2], size: [0.12, 0.12, 0.12], color: "#ffffff" },
    // tail base
    { position: [-0.7, 0.1, 0], size: [0.6, 0.4, 0.4], color: c },
    // tail tip
    { position: [-1.2, 0.25, 0], size: [0.5, 0.25, 0.3], color: c },
    // left leg
    { position: [0.2, -0.6, 0.15], size: [0.25, 0.5, 0.25], color: c },
    // right leg
    { position: [0.2, -0.6, -0.15], size: [0.25, 0.5, 0.25], color: c },
    // left foot
    { position: [0.35, -0.9, 0.15], size: [0.3, 0.15, 0.25], color: c },
    // right foot
    { position: [0.35, -0.9, -0.15], size: [0.3, 0.15, 0.25], color: c },
    // tiny arm
    { position: [0.55, 0.15, 0.25], size: [0.15, 0.3, 0.12], color: c },
  ];
}

function starBoxes(): VoxelBox[] {
  const c = "#ffe600";
  // 4 long bars at 0°, 45°, 90°, 135° approximated with boxes
  const bars: VoxelBox[] = [
    // horizontal bar
    { position: [0, 0, 0], size: [1.6, 0.25, 0.25], color: c },
    // vertical bar
    { position: [0, 0, 0], size: [0.25, 1.6, 0.25], color: c },
    // diagonal 1 (NW-SE) — 2 offset boxes
    { position: [-0.35, 0.35, 0], size: [0.6, 0.25, 0.25], color: c },
    { position: [0.35, -0.35, 0], size: [0.6, 0.25, 0.25], color: c },
    { position: [-0.35, 0.35, 0], size: [0.25, 0.6, 0.25], color: c },
    { position: [0.35, -0.35, 0], size: [0.25, 0.6, 0.25], color: c },
    // diagonal 2 (NE-SW) — 2 offset boxes
    { position: [0.35, 0.35, 0], size: [0.6, 0.25, 0.25], color: c },
    { position: [-0.35, -0.35, 0], size: [0.6, 0.25, 0.25], color: c },
  ];
  return bars;
}

function ghostBoxes(): VoxelBox[] {
  const c = GHOST_COLORS[Math.floor(Math.random() * GHOST_COLORS.length)];
  return [
    // top cap (rounded approximation — stacked narrowing boxes)
    { position: [0, 0.7, 0], size: [0.5, 0.3, 0.5], color: c },
    { position: [0, 0.45, 0], size: [0.7, 0.3, 0.5], color: c },
    // body trunk
    { position: [0, 0.1, 0], size: [0.8, 0.5, 0.5], color: c },
    // lower body
    { position: [0, -0.25, 0], size: [0.8, 0.3, 0.5], color: c },
    // wavy bottom — 3 small boxes
    { position: [-0.28, -0.5, 0], size: [0.22, 0.2, 0.45], color: c },
    { position: [0, -0.55, 0], size: [0.22, 0.15, 0.45], color: c },
    { position: [0.28, -0.5, 0], size: [0.22, 0.2, 0.45], color: c },
    // left eye
    { position: [-0.18, 0.35, 0.26], size: [0.18, 0.22, 0.05], color: "#ffffff" },
    // right eye
    { position: [0.18, 0.35, 0.26], size: [0.18, 0.22, 0.05], color: "#ffffff" },
    // left pupil
    { position: [-0.15, 0.32, 0.29], size: [0.1, 0.12, 0.05], color: "#111111" },
    // right pupil
    { position: [0.15, 0.32, 0.29], size: [0.1, 0.12, 0.05], color: "#111111" },
  ];
}

/* ------------------------------------------------------------------ */
/*  Renderers for each object type                                     */
/* ------------------------------------------------------------------ */

function VoxelGroup({
  boxes,
  opacity,
}: {
  boxes: VoxelBox[];
  opacity: number;
}) {
  return (
    <>
      {boxes.map((box, i) => (
        <mesh key={i} position={box.position}>
          <boxGeometry args={box.size} />
          <meshStandardMaterial
            color={box.color}
            transparent={opacity < 1}
            opacity={opacity}
          />
        </mesh>
      ))}
    </>
  );
}

function CoinMesh({ opacity }: { opacity: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
      <meshStandardMaterial
        color="#ffe600"
        transparent={opacity < 1}
        opacity={opacity}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Main FloatingObject component                                      */
/* ------------------------------------------------------------------ */

export function FloatingObject({
  type,
  position,
  scale: userScale = 1,
  speed: userSpeed = 1,
  depth,
}: FloatingObjectProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const depthCfg = DEPTH_CONFIG[depth];
  const finalScale = userScale * depthCfg.scale;
  const finalSpeed = userSpeed * depthCfg.speed;
  const opacity = depthCfg.opacity;

  // Memoize random rotation rates per object
  const rotRates = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.2,
    }),
    []
  );

  // Memoize ghost/star boxes so colors don't change on re-render
  const boxes = useMemo(() => {
    switch (type) {
      case "dino":
        return dinoBoxes();
      case "star":
        return starBoxes();
      case "ghost":
        return ghostBoxes();
      default:
        return null;
    }
  }, [type]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Drift upward
    groupRef.current.position.y += finalSpeed * delta;

    // Gentle rotation
    groupRef.current.rotation.x += rotRates.x * delta;
    groupRef.current.rotation.y += rotRates.y * delta;
    groupRef.current.rotation.z += rotRates.z * delta;

    // Wraparound
    if (groupRef.current.position.y > 8) {
      groupRef.current.position.y = -8;
      groupRef.current.position.x = (Math.random() - 0.5) * 12;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={finalScale}>
      {type === "coin" ? (
        <CoinMesh opacity={opacity} />
      ) : boxes ? (
        <VoxelGroup boxes={boxes} opacity={opacity} />
      ) : (
        /* Fallback for unimplemented types: simple colored cube */
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#00ff88"
            transparent={opacity < 1}
            opacity={opacity}
          />
        </mesh>
      )}
    </group>
  );
}
