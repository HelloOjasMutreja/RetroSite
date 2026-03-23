"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { FloatingObject, type FloatingObjectType, type DepthLayer } from "./FloatingObject";

/* ------------------------------------------------------------------ */
/*  Spawner configuration                                              */
/* ------------------------------------------------------------------ */

const TYPES: FloatingObjectType[] = [
  "dino", "coin", "star", "ghost",
  "mushroom", "lightning", "gem", "skull", "controller",
];

interface SpawnedObject {
  type: FloatingObjectType;
  position: [number, number, number];
  depth: DepthLayer;
  speed: number;
  scale: number;
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildSpawnList(): SpawnedObject[] {
  const objects: SpawnedObject[] = [];

  const layers: { depth: DepthLayer; count: number }[] = [
    { depth: "far", count: 6 },
    { depth: "mid", count: 7 },
    { depth: "near", count: 5 },
  ];

  for (const { depth, count } of layers) {
    for (let i = 0; i < count; i++) {
      objects.push({
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        position: [
          randomRange(-8, 8),
          randomRange(-8, 8),
          randomRange(-1, 1),
        ],
        depth,
        speed: randomRange(0.6, 1.4),
        scale: randomRange(0.8, 1.2),
      });
    }
  }

  return objects;
}

/* ------------------------------------------------------------------ */
/*  Scene contents (inside Canvas)                                     */
/* ------------------------------------------------------------------ */

function FloatingScene({ objects }: { objects: SpawnedObject[] }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 4, 6]} intensity={1} color="#ffffff" />

      {objects.map((obj, i) => (
        <FloatingObject
          key={i}
          type={obj.type}
          position={obj.position}
          depth={obj.depth}
          speed={obj.speed}
          scale={obj.scale}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingWorld — fixed background Canvas                            */
/* ------------------------------------------------------------------ */

export function FloatingWorld() {
  const objects = useMemo(() => buildSpawnList(), []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <FloatingScene objects={objects} />
      </Canvas>
    </div>
  );
}
