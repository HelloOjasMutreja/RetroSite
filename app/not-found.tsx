"use client";

import { useEffect, useRef } from "react";
import { PixelButton } from "@/components/ui/PixelButton";

/* ------------------------------------------------------------------ */
/*  Static noise canvas - 30x30 grid redrawn at 12fps                  */
/* ------------------------------------------------------------------ */

function StaticScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 30;
    canvas.height = 30;

    const draw = () => {
      for (let y = 0; y < 30; y++) {
        for (let x = 0; x < 30; x++) {
          const v = Math.floor(Math.random() * 80) + 20;
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    };

    const id = setInterval(draw, 1000 / 12);
    return () => clearInterval(id);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Not Found page                                                     */
/* ------------------------------------------------------------------ */

export default function NotFound() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#07071a",
        padding: "20px",
        gap: "16px",
      }}
    >
      {/* SVG Illustration */}
      <div style={{ position: "relative", marginBottom: "8px" }}>
        <svg
          width="260"
          height="320"
          viewBox="0 0 260 320"
          fill="none"
          aria-hidden="true"
        >
          {/* ─── Cabinet body ─── */}
          <rect x="50" y="10" width="160" height="260" rx="2" fill="#1a0505" />
          <rect x="55" y="15" width="150" height="250" rx="1" fill="#3a0a0a" />

          {/* ─── Narrower top section ─── */}
          <rect x="60" y="15" width="140" height="30" fill="#5a1515" />

          {/* ─── Marquee ─── */}
          <rect x="65" y="20" width="130" height="20" fill="#ff2d78" opacity="0.7" />
          <text
            x="130"
            y="35"
            textAnchor="middle"
            fill="#ffffff"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: "5px" }}
          >
            GAME OVER
          </text>

          {/* ─── Screen bezel ─── */}
          <rect x="65" y="50" width="130" height="100" fill="#111122" />

          {/* ─── Screen — static fills this via foreignObject ─── */}
          <foreignObject x="70" y="55" width="120" height="90">
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <StaticScreen />
            </div>
          </foreignObject>

          {/* ─── Control panel ─── */}
          <polygon points="55,165 65,155 195,155 205,165 205,195 55,195" fill="#222233" />
          {/* Buttons */}
          <circle cx="105" cy="178" r="6" fill="#ff2d78" />
          <circle cx="125" cy="178" r="6" fill="#ffe600" />
          <circle cx="145" cy="178" r="6" fill="#00e5ff" />
          {/* Joystick base */}
          <rect x="78" y="170" width="10" height="10" fill="#333355" />
          <rect x="81" y="164" width="4" height="10" fill="#666688" />

          {/* ─── Coin slot ─── */}
          <rect x="115" y="205" width="30" height="6" rx="1" fill="#111122" />
          <rect x="120" y="207" width="20" height="2" fill="#0a0a15" />

          {/* ─── Speaker grilles ─── */}
          <rect x="90" y="220" width="80" height="2" fill="#222233" />
          <rect x="90" y="225" width="80" height="2" fill="#222233" />
          <rect x="90" y="230" width="80" height="2" fill="#222233" />

          {/* ─── Legs ─── */}
          <rect x="60" y="265" width="8" height="25" fill="#1a0505" />
          <rect x="192" y="265" width="8" height="25" fill="#1a0505" />

          {/* ─── Power cord (unplugged) ─── */}
          <path
            d="M 60 270 Q 40 280, 35 290 Q 30 300, 20 310"
            stroke="#333355"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Plug end */}
          <rect x="14" y="308" width="12" height="6" rx="1" fill="#444466" />
          <rect x="16" y="314" width="3" height="4" fill="#666688" />
          <rect x="21" y="314" width="3" height="4" fill="#666688" />

          {/* ─── Pixel sparks ─── */}
          <line x1="10" y1="305" x2="6" y2="300" stroke="#ffe600" strokeWidth="1.5" className="spark-1" />
          <line x1="8" y1="310" x2="2" y2="308" stroke="#ff8800" strokeWidth="1.5" className="spark-2" />
          <line x1="12" y1="315" x2="8" y2="318" stroke="#ffe600" strokeWidth="1.5" className="spark-3" />

          {/* ─── Pixel dino (lying flat on its side) ─── */}
          <g transform="translate(210, 290) rotate(90)">
            {/* Body */}
            <rect x="0" y="0" width="4" height="8" fill="#2a2a2a" />
            {/* Head */}
            <rect x="-2" y="-4" width="6" height="4" fill="#2a2a2a" />
            {/* Eye */}
            <rect x="2" y="-3" width="1" height="1" fill="#ff2d78" />
            {/* X eye (dead) */}
            <rect x="0" y="-2" width="1" height="1" fill="#ff2d78" />
            {/* Tiny arm */}
            <rect x="4" y="2" width="2" height="1" fill="#2a2a2a" />
            {/* Legs */}
            <rect x="0" y="8" width="2" height="3" fill="#2a2a2a" />
            <rect x="3" y="8" width="2" height="3" fill="#2a2a2a" />
            {/* Tail */}
            <rect x="-2" y="5" width="2" height="2" fill="#2a2a2a" />
          </g>
        </svg>

        {/* ─── Orbiting pixel fly ─── */}
        <div className="fly-orbit">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            {/* Body */}
            <ellipse cx="6" cy="7" rx="2" ry="3" fill="#444466" />
            {/* Wings */}
            <ellipse cx="3" cy="5" rx="2" ry="1" fill="#88aacc" opacity="0.6" />
            <ellipse cx="9" cy="5" rx="2" ry="1" fill="#88aacc" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* ─── TEXT ─── */}
      <div
        data-glitch="true"
        data-glitch-rgb="true"
        style={{
          fontFamily: '"Mondwest", "Press Start 2P", monospace',
          fontSize: "3rem",
          color: "#ff2d78",
          textAlign: "center",
        }}
      >
        ERROR 404
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "12px",
          color: "#ffe600",
          letterSpacing: "0.15em",
        }}
      >
        CABINET OFFLINE
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "8px",
          color: "#aaaacc",
        }}
      >
        SOMEONE PULLED THE PLUG
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "7px",
          color: "#555577",
          marginBottom: "16px",
        }}
      >
        OR MAYBE THIS LEVEL DOESN&apos;T EXIST
      </div>

      {/* ─── RETURN BUTTON ─── */}
      <PixelButton color="#ff2d78" shadowColor="#b3164f" onClick={() => window.location.href = "/"}>
        [ ▶ RETURN TO ARCADE ]
      </PixelButton>

      {/* ─── CSS animations for sparks and fly ─── */}
      <style jsx>{`
        .spark-1 {
          animation: spark 0.8s ease-in-out infinite;
        }
        .spark-2 {
          animation: spark 0.8s ease-in-out 0.3s infinite;
        }
        .spark-3 {
          animation: spark 0.8s ease-in-out 0.6s infinite;
        }
        @keyframes spark {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .fly-orbit {
          position: absolute;
          top: 270px;
          left: 210px;
          animation: orbit 3s linear infinite;
        }
        @keyframes orbit {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(20px, -10px); }
          50%  { transform: translate(40px, 0); }
          75%  { transform: translate(20px, 10px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
