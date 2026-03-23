"use client";

import { type ReactNode } from "react";

interface StageContainerProps {
  stage: number;
  children: ReactNode;
}

export function StageContainer({ stage, children }: StageContainerProps) {
  const cornerSize = 12;
  const cornerThickness = 2;
  const cornerColor = "#00e5ff";

  const cornerStyle = (
    top: boolean,
    left: boolean
  ): React.CSSProperties => ({
    position: "absolute",
    width: `${cornerSize}px`,
    height: `${cornerSize}px`,
    ...(top ? { top: "-1px" } : { bottom: "-1px" }),
    ...(left ? { left: "-1px" } : { right: "-1px" }),
    borderStyle: "solid",
    borderColor: cornerColor,
    borderTopWidth: top ? `${cornerThickness}px` : "0",
    borderBottomWidth: !top ? `${cornerThickness}px` : "0",
    borderLeftWidth: left ? `${cornerThickness}px` : "0",
    borderRightWidth: !left ? `${cornerThickness}px` : "0",
    pointerEvents: "none",
  });

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "760px",
        width: "100%",
        margin: "0 auto",
        padding: "48px",
        background: "rgba(7, 7, 26, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1.5px solid rgba(0, 229, 255, 0.2)",
      }}
    >
      {/* Corner decorations */}
      <div style={cornerStyle(true, true)} />
      <div style={cornerStyle(true, false)} />
      <div style={cornerStyle(false, true)} />
      <div style={cornerStyle(false, false)} />

      {/* Stage label */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "14px",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "7px",
          color: "#00e5ff",
          letterSpacing: "1px",
          pointerEvents: "none",
        }}
      >
        STAGE {stage} / 4
      </div>

      {children}
    </div>
  );
}
