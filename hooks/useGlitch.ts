"use client";

import { useEffect } from "react";
import { GlitchController } from "@/lib/glitch";

export function useGlitch() {
  useEffect(() => {
    const controller = new GlitchController();
    controller.start();

    return () => {
      controller.stop();
    };
  }, []);
}
