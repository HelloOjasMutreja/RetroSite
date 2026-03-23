"use client";

import { gsap } from "gsap";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

export type CursorState = "default" | "pointer" | "select";

type CursorContextValue = {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
};

export const CursorContext = createContext<CursorContextValue | null>(null);

const INTERACTIVE_SELECTOR =
  "[data-cursor='select'], a, button, input, textarea, select, [role='button']";

const POINTER_SELECTOR = "[data-cursor='pointer']";

function getCursorStateForTarget(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) {
    return "default";
  }

  if (target.closest(POINTER_SELECTOR)) {
    return "pointer";
  }

  if (target.closest(INTERACTIVE_SELECTOR)) {
    return "select";
  }

  return "default";
}

function CursorSvg({ state }: { state: CursorState }) {
  if (state === "pointer") {
    const handPath =
      "M8 40H12V16H16V12H20V16H20V28H24V10H28V8H32V10H32V26H36V12H40V10H44V12H44V30H48V20H52V18H56V20H56V42H52V46H48V50H24V54H16V50H12V46H8Z";

    return (
      <svg viewBox="0 0 64 64" width={52} height={52} aria-hidden="true">
        <path d={handPath} transform="translate(4 4)" fill="#111428" />
        <path d={handPath} fill="#ffffff" stroke="#111428" strokeWidth="2" />
      </svg>
    );
  }

  if (state === "select") {
    const bubblePath = "M4 4H92V32H56V40H44V32H4Z";

    return (
      <svg viewBox="0 0 96 48" width={96} height={48} aria-hidden="true">
        <path d={bubblePath} transform="translate(4 4)" fill="#111428" />
        <path d={bubblePath} fill="#ffffff" stroke="#111428" strokeWidth="2" />
        <text
          x="12"
          y="23"
          fontFamily='"Press Start 2P", monospace'
          fontSize="8"
          fill="#111428"
        >
          SELECT
        </text>
      </svg>
    );
  }

  const arrowPath =
    "M4 4H12V8H16V12H20V16H24V20H28V24H32V28H36V32H40V36H32V44H28V36H20V32H16V28H12V24H8V20H4Z";

  return (
    <svg viewBox="0 0 64 64" width={48} height={48} aria-hidden="true">
      <path d={arrowPath} transform="translate(4 4)" fill="#111428" />
      <path d={arrowPath} fill="#ffffff" stroke="#111428" strokeWidth="2" />
    </svg>
  );
}

function CursorVisual({ state }: { state: CursorState }) {
  return (
    <div
      className="fixed left-0 top-0 z-[9999] pointer-events-none"
      style={{ transformOrigin: "top left" }}
    >
      <CursorSvg state={state} />
    </div>
  );
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const [cursorState, setCursorStateRaw] = useState<CursorState>("default");

  const setCursorState = useCallback((state: CursorState) => {
    setCursorStateRaw((prev) => (prev === state ? prev : state));
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      cursorPosRef.current = { x: event.clientX, y: event.clientY };

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: cursorPosRef.current.x,
          y: cursorPosRef.current.y,
          duration: 0.08,
          ease: "power2.out"
        });
      }

      setCursorState(getCursorStateForTarget(event.target));
    };

    const onMouseDown = () => {
      if (!cursorRef.current) {
        return;
      }

      gsap.killTweensOf(cursorRef.current, "scale");
      gsap.fromTo(
        cursorRef.current,
        { scale: 0.85 },
        { scale: 1, duration: 0.1, ease: "power2.out" }
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [setCursorState]);

  const value = useMemo(
    () => ({ cursorState, setCursorState }),
    [cursorState, setCursorState]
  );

  return (
    <CursorContext.Provider value={value}>
      {children}
      <div ref={cursorRef} className="fixed left-0 top-0 pointer-events-none z-[9999]">
        <CursorVisual state={cursorState} />
      </div>
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }

  return { setCursorState: context.setCursorState };
}

export function CustomCursor() {
  return null;
}
