"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ArcadeCabinet } from "./ArcadeCabinet";
import { GlitchText } from "@/components/ui/GlitchText";
import { PixelButton } from "@/components/ui/PixelButton";
import { useCursor } from "./CustomCursor";

export function ArcadeLanding() {
  const router = useRouter();
  const { setCursorState } = useCursor();
  const flashRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [transitioning, setTransitioning] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Zoom‑in transition: screen flicker → white flash → navigate      */
  /* ---------------------------------------------------------------- */
  const handleRegister = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);

    const tl = gsap.timeline();

    // 1. Screen flickers
    if (screenRef.current) {
      tl.to(screenRef.current, { opacity: 0.3, duration: 0.08 })
        .to(screenRef.current, { opacity: 1, duration: 0.06 })
        .to(screenRef.current, { opacity: 0.3, duration: 0.06 })
        .to(screenRef.current, { opacity: 1, duration: 0.06 })
        .to(screenRef.current, { opacity: 0.3, duration: 0.06 })
        .to(screenRef.current, { opacity: 1, duration: 0.06 });
    }

    // 2. White flash overlay
    if (flashRef.current) {
      tl.to(flashRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    // 3. Navigate at peak
    tl.call(() => {
      router.push("/register");
    });

    // 4. Flash fades out (on the new page it will be gone)
    if (flashRef.current) {
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [router, transitioning]);

  const handleScreenHover = useCallback(
    (hovered: boolean) => {
      setCursorState(hovered ? "select" : "default");
    },
    [setCursorState]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#07071a",
      }}
    >
      {/* 3D Cabinet Scene */}
      <div
        ref={screenRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <ArcadeCabinet onScreenHover={handleScreenHover} />
      </div>

      {/* UI OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "40px",
        }}
      >
        {/* Marquee title — top area */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <GlitchText as="h1">RESONATE 2.0</GlitchText>
        </div>

        {/* Bottom button area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Small text */}
          <p
            data-glitch="true"
            data-glitch-rgb="true"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "8px",
              color: "#ffffff",
              opacity: 0.6,
              letterSpacing: "1px",
              textAlign: "center",
              margin: 0,
              pointerEvents: "none",
            }}
          >
            © 2025 RESONATE · PRESS START
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <PixelButton
              color="#ff2d78"
              shadowColor="#a3164f"
              onClick={handleRegister}
            >
              🔴 INSERT COIN — REGISTER
            </PixelButton>

            <PixelButton
              color="#00e5ff"
              shadowColor="#0099aa"
              onClick={() => router.push("/dashboard")}
            >
              🔵 MY APPLICATION
            </PixelButton>
          </div>
        </div>
      </div>

      {/* WHITE FLASH OVERLAY */}
      <div
        ref={flashRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#ffffff",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
