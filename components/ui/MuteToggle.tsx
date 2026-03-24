"use client";

import { useState, useEffect, useCallback } from "react";
import { isMuted, setMuted, loadMutePreference } from "@/lib/sounds";

export function MuteToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    loadMutePreference();
    setMutedState(isMuted());
  }, []);

  const toggle = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }, [muted]);

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute" : "Mute"}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 100,
        background: "rgba(7, 7, 26, 0.8)",
        border: "1.5px solid #2a2a4a",
        color: muted ? "#555566" : "#00ff88",
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "10px",
        padding: "8px 10px",
        cursor: "none",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#00e5ff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2a2a4a";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1" y="5" width="4" height="6" fill="currentColor" />
        <polygon points="5,5 10,2 10,14 5,11" fill="currentColor" />
        {!muted && (
          <>
            <rect x="12" y="4" width="1" height="2" fill="currentColor" />
            <rect x="12" y="10" width="1" height="2" fill="currentColor" />
            <rect x="14" y="3" width="1" height="3" fill="currentColor" />
            <rect x="14" y="10" width="1" height="3" fill="currentColor" />
          </>
        )}
        {muted && (
          <>
            <rect x="12" y="4" width="1" height="8" fill="#ff2d78" transform="rotate(45 12.5 8)" />
            <rect x="12" y="4" width="1" height="8" fill="#ff2d78" transform="rotate(-45 12.5 8)" />
          </>
        )}
      </svg>
      {muted ? "OFF" : "SFX"}
    </button>
  );
}
