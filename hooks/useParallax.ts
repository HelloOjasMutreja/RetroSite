"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

type ParallaxValues = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useParallax(strength: number = 1): ParallaxValues {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 80, damping: 20 });
  const y = useSpring(rawY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const normalizedX = clamp((event.clientX - centerX) / centerX, -1, 1);
      const normalizedY = clamp((event.clientY - centerY) / centerY, -1, 1);

      rawX.set(normalizedX * strength);
      rawY.set(normalizedY * strength);
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [rawX, rawY, strength]);

  return { x, y };
}
