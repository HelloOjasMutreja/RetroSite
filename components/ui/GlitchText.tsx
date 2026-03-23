"use client";

import { type ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}

export function GlitchText({
  children,
  className = "",
  as = "span",
}: GlitchTextProps) {
  const sharedProps = {
    className,
    "data-glitch": "true" as const,
    "data-glitch-rgb": "true" as const,
    style: {
      fontFamily: '"Mondwest", "Press Start 2P", monospace',
      color: "#ff2d78",
      fontSize: "clamp(2rem, 5vw, 4rem)",
      textAlign: "center" as const,
      display: "inline-block",
    },
  };

  switch (as) {
    case "h1":
      return <h1 {...sharedProps}>{children}</h1>;
    case "h2":
      return <h2 {...sharedProps}>{children}</h2>;
    case "h3":
      return <h3 {...sharedProps}>{children}</h3>;
    case "p":
      return <p {...sharedProps}>{children}</p>;
    case "div":
      return <div {...sharedProps}>{children}</div>;
    default:
      return <span {...sharedProps}>{children}</span>;
  }
}
