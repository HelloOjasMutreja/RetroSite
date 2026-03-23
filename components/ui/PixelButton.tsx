"use client";

import { useCursor } from "@/components/arcade/CustomCursor";
import { type ReactNode, useCallback, useRef, useState } from "react";

interface PixelButtonProps {
  children: ReactNode;
  color: string;           // e.g. "#ff2d78"
  shadowColor: string;     // darker shade e.g. "#b3164f"
  onClick?: () => void;
  className?: string;
}

export function PixelButton({
  children,
  color,
  shadowColor,
  onClick,
  className = "",
}: PixelButtonProps) {
  const { setCursorState } = useCursor();
  const [pressed, setPressed] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
    setCursorState("pointer");
  }, [setCursorState]);

  const handleMouseLeave = useCallback(() => {
    setCursorState("default");
    setPressed(false);
  }, [setCursorState]);

  return (
    <button
      ref={btnRef}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 28px",
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "11px",
        lineHeight: 1.6,
        color: "#ffffff",
        background: color,
        border: `3px solid ${shadowColor}`,
        borderRadius: 0,
        outline: "none",
        cursor: "none",
        userSelect: "none",
        boxShadow: pressed
          ? `2px 2px 0px ${shadowColor}`
          : `4px 4px 0px ${shadowColor}`,
        transform: pressed ? "translate(2px, 2px)" : "translate(0, 0)",
        transition: "transform 0.05s, box-shadow 0.05s",
        pointerEvents: "auto",
      }}
    >
      {children}
    </button>
  );
}
