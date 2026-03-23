"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FloatingWorld } from "@/components/ui/FloatingWorld";
import { ProgressBar } from "@/components/register/ProgressBar";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Entry animation — content fades/slides in after the flash transition
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.15 }
      );
    }
  }, []);

  return (
    <>
      {/* Fixed 3D floating objects background */}
      <FloatingWorld />

      {/* Progress bar — fixed at top */}
      <ProgressBar currentStage={1} />

      {/* Main content — centered, clears progress bar */}
      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "100px",
          paddingBottom: "40px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0, // starts invisible, GSAP animates in
        }}
      >
        {children}
      </div>
    </>
  );
}
