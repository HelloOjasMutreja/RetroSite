"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ProgressBarProps {
  currentStage: 1 | 2 | 3 | 4;
}

/* ------------------------------------------------------------------ */
/*  Tiny pixel spaceship SVG                                           */
/* ------------------------------------------------------------------ */

function PixelShip() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" aria-hidden="true">
      {/* Body */}
      <rect x="6" y="2" width="4" height="2" fill="#00ff88" />
      <rect x="5" y="4" width="6" height="2" fill="#00ff88" />
      <rect x="4" y="6" width="8" height="4" fill="#00ff88" />
      {/* Wings */}
      <rect x="2" y="8" width="2" height="4" fill="#00e5ff" />
      <rect x="12" y="8" width="2" height="4" fill="#00e5ff" />
      {/* Exhaust */}
      <rect x="6" y="10" width="1" height="2" fill="#ffe600" />
      <rect x="9" y="10" width="1" height="2" fill="#ffe600" />
      <rect x="7" y="12" width="2" height="2" fill="#ff2d78" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage labels                                                       */
/* ------------------------------------------------------------------ */

const STAGES = [
  { num: 1, label: "TEAM INFO" },
  { num: 2, label: "ADD PLAYERS" },
  { num: 3, label: "PAY TO PLAY" },
  { num: 4, label: "AWAIT CLEARANCE" },
];

/* ------------------------------------------------------------------ */
/*  ProgressBar component                                              */
/* ------------------------------------------------------------------ */

export function ProgressBar({ currentStage }: ProgressBarProps) {
  const shipRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const prevStageRef = useRef(currentStage);

  // Calculate fill percentage: (currentStage - 1) / 3 * 100
  const fillPercent = ((currentStage - 1) / 3) * 100;

  // Animate ship position and fill width when stage changes
  useEffect(() => {
    if (shipRef.current) {
      gsap.to(shipRef.current, {
        left: `${fillPercent}%`,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }

    if (fillRef.current) {
      gsap.to(fillRef.current, {
        width: `${fillPercent}%`,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }

    prevStageRef.current = currentStage;
  }, [currentStage, fillPercent]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#0d0d2b",
        height: "72px",
        borderBottom: "2px solid #2a2a4a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      {/* Track container */}
      <div
        style={{
          position: "relative",
          width: "60%",
          maxWidth: "600px",
        }}
      >
        {/* Pixel ship indicator */}
        <div
          ref={shipRef}
          style={{
            position: "absolute",
            left: `${fillPercent}%`,
            top: "-18px",
            transform: "translateX(-50%)",
            zIndex: 2,
            filter: "drop-shadow(0 0 6px rgba(0, 255, 136, 0.5))",
          }}
        >
          <PixelShip />
        </div>

        {/* Track background */}
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "#1a1a3a",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Filled portion with pixel block pattern */}
          <div
            ref={fillRef}
            style={{
              height: "100%",
              width: `${fillPercent}%`,
              backgroundImage:
                "repeating-linear-gradient(to right, #00ff88 0px, #00ff88 14px, #007744 14px, #007744 16px)",
              transition: "none", // GSAP handles animation
            }}
          />
        </div>

        {/* Stage labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          {STAGES.map(({ num, label }) => {
            const isCompleted = num < currentStage;
            const isCurrent = num === currentStage;
            const isActive = isCompleted || isCurrent;

            return (
              <div
                key={num}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  flex: 1,
                }}
              >
                {/* Star for completed */}
                <span
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "7px",
                    color: "#ffe600",
                    visibility: isCompleted ? "visible" : "hidden",
                    lineHeight: 1,
                  }}
                >
                  ★
                </span>

                {/* Label */}
                <span
                  className={isCurrent ? "stage-pulse" : undefined}
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "7px",
                    color: isActive ? "#00ff88" : "#2a2a4a",
                    textAlign: "center",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pulse animation via style tag */}
      <style jsx>{`
        .stage-pulse {
          animation: pulse-label 1s ease-in-out infinite;
        }
        @keyframes pulse-label {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
