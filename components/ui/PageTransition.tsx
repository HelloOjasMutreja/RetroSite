"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { playStatic } from "@/lib/sounds";

export function PageTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const isFirstMount = useRef(true);

  const runStaticNoise = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    container.style.opacity = "1";
    container.style.pointerEvents = "auto";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 30;
    canvas.height = 30;
    ctx.imageSmoothingEnabled = false;

    playStatic();

    let frame = 0;
    const maxFrames = 8; // ~250ms at 30fps
    const id = setInterval(() => {
      for (let y = 0; y < 30; y++) {
        for (let x = 0; x < 30; x++) {
          const v = Math.floor(Math.random() * 100);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      frame++;
      if (frame >= maxFrames) {
        clearInterval(id);
        // Fade out
        container.style.transition = "opacity 0.15s";
        container.style.opacity = "0";
        setTimeout(() => {
          container.style.pointerEvents = "none";
          container.style.transition = "";
        }, 150);
      }
    }, 1000 / 30);
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      runStaticNoise();
    }
  }, [pathname, runStaticNoise]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
