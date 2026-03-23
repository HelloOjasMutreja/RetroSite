"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRegistration } from "@/lib/registration-context";
import { PixelButton } from "@/components/ui/PixelButton";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_NAMES = [
  "CTRL+ALT+DEFEAT",
  "404 TEAM NOT FOUND",
  "THE SEGFAULT SQUAD",
  "BIT SHIFTERS",
  "NULL POINTERS",
];

const MAX_TEAM_NAME = 24;

/* ------------------------------------------------------------------ */
/*  Styled retro input field                                           */
/* ------------------------------------------------------------------ */

function RetroField({
  label,
  value,
  onChange,
  type = "text",
  inputRef,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "8px",
          color: "#8888aa",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "transparent",
          border: "1.5px solid #2a2a4a",
          color: "#ffffff",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "9px",
          height: "40px",
          padding: "0 12px",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          cursor: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#00e5ff";
          e.currentTarget.style.boxShadow = "0 0 0 1px #00e5ff33";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#2a2a4a";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StageTeam component                                                */
/* ------------------------------------------------------------------ */

export function StageTeam() {
  const { data, updateData, updateLeader, setStage } = useRegistration();
  const panelRef = useRef<HTMLDivElement>(null);

  /* ― team name state ― */
  const [teamName, setTeamName] = useState(data.teamName);
  const teamInputRef = useRef<HTMLInputElement>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderFade, setPlaceholderFade] = useState(true);
  const [teamFocused, setTeamFocused] = useState(false);

  /* ― leader state ― */
  const [leaderName, setLeaderName] = useState(data.leader.name);
  const [leaderEmail, setLeaderEmail] = useState(data.leader.email);
  const [leaderPhone, setLeaderPhone] = useState(data.leader.phone);
  const [leaderDiv, setLeaderDiv] = useState(data.leader.division);

  /* ― refs for validation flash ― */
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const emailFieldRef = useRef<HTMLInputElement>(null);
  const phoneFieldRef = useRef<HTMLInputElement>(null);
  const divFieldRef = useRef<HTMLInputElement>(null);
  const teamBorderRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------- */
  /*  Cycling placeholder names                                        */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderFade(false);
      setTimeout(() => {
        setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDER_NAMES.length);
        setPlaceholderFade(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Team name border focus animation                                 */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (teamBorderRef.current) {
      gsap.to(teamBorderRef.current, {
        borderBottomColor: teamFocused ? "#00ff88" : "#00e5ff",
        duration: 0.2,
      });
    }
  }, [teamFocused]);

  /* ---------------------------------------------------------------- */
  /*  Validation + navigation                                          */
  /* ---------------------------------------------------------------- */

  const flashInvalid = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    gsap.fromTo(
      el,
      { borderColor: "#ff2d78" },
      {
        borderColor: "#2a2a4a",
        duration: 0.15,
        repeat: 5,
        yoyo: true,
        ease: "none",
      }
    );
  }, []);

  const handleNext = useCallback(() => {
    let valid = true;

    if (!teamName.trim()) {
      flashInvalid(teamBorderRef.current);
      valid = false;
    }
    if (!leaderName.trim()) {
      flashInvalid(nameFieldRef.current);
      valid = false;
    }
    if (!leaderEmail.trim()) {
      flashInvalid(emailFieldRef.current);
      valid = false;
    }
    if (!leaderPhone.trim()) {
      flashInvalid(phoneFieldRef.current);
      valid = false;
    }
    if (!leaderDiv.trim()) {
      flashInvalid(divFieldRef.current);
      valid = false;
    }

    if (!valid) return;

    // Save to context
    updateData({ teamName: teamName.trim() });
    updateLeader({
      name: leaderName.trim(),
      email: leaderEmail.trim(),
      phone: leaderPhone.trim(),
      division: leaderDiv.trim(),
    });

    // VHS stutter + slide out transition
    if (panelRef.current) {
      const tl = gsap.timeline();

      // Glitch stutter
      tl.to(panelRef.current, { x: -8, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 5, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: -3, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 0, duration: 0.025, ease: "none" });

      // Slide out
      tl.to(panelRef.current, {
        x: -60,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setStage(2);
        },
      });
    } else {
      setStage(2);
    }
  }, [
    teamName, leaderName, leaderEmail, leaderPhone, leaderDiv,
    flashInvalid, updateData, updateLeader, setStage,
  ]);

  /* ---------------------------------------------------------------- */
  /*  Slide-in entry animation                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const charCount = teamName.length;

  return (
    <div ref={panelRef} style={{ width: "100%" }}>
      {/* ─── TEAM NAME HERO INPUT ─── */}
      <div style={{ marginBottom: "40px" }}>
        <label
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "10px",
            color: "#00e5ff",
            letterSpacing: "0.2em",
            display: "block",
            marginBottom: "12px",
          }}
        >
          TEAM NAME:
        </label>

        <div
          ref={teamBorderRef}
          style={{
            position: "relative",
            borderBottom: "3px solid #00e5ff",
          }}
        >
          {/* Placeholder cycling */}
          {!teamName && !teamFocused && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "72px",
                display: "flex",
                alignItems: "center",
                fontFamily: '"Mondwest", "Press Start 2P", monospace',
                fontSize: "2.5rem",
                color: "#2a2a4a",
                pointerEvents: "none",
                opacity: placeholderFade ? 0.6 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {PLACEHOLDER_NAMES[placeholderIdx]}
            </div>
          )}

          <input
            ref={teamInputRef}
            type="text"
            value={teamName}
            maxLength={MAX_TEAM_NAME}
            onChange={(e) => setTeamName(e.target.value.toUpperCase())}
            onFocus={() => setTeamFocused(true)}
            onBlur={() => setTeamFocused(false)}
            style={{
              width: "100%",
              height: "72px",
              background: "transparent",
              border: "none",
              fontFamily: '"Mondwest", "Press Start 2P", monospace',
              fontSize: "2.5rem",
              color: "#ffffff",
              outline: "none",
              caretColor: "transparent",
              cursor: "none",
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* Blinking block cursor */}
          <div
            className="blink-cursor"
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: `${Math.min(charCount * 28 + 4, 680)}px`,
              width: "12px",
              height: "28px",
              background: "#00ff88",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Character counter */}
        <div
          style={{
            textAlign: "right",
            marginTop: "6px",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "7px",
            color: charCount > 20 ? "#ff2d78" : "#444466",
            letterSpacing: "0.05em",
          }}
        >
          {charCount} / {MAX_TEAM_NAME} CHARS
        </div>
      </div>

      {/* ─── LEADER DETAILS SECTION ─── */}
      <div style={{ marginBottom: "36px" }}>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "10px",
            color: "#ffffff",
            letterSpacing: "0.15em",
            marginBottom: "8px",
          }}
        >
          PLAYER 1 — SQUAD LEADER
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #2a2a4a",
            marginBottom: "24px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <RetroField
            label="CALL SIGN"
            value={leaderName}
            onChange={setLeaderName}
            inputRef={nameFieldRef}
          />
          <RetroField
            label="COMMS"
            value={leaderEmail}
            onChange={setLeaderEmail}
            type="email"
            inputRef={emailFieldRef}
          />
          <RetroField
            label="CONTACT"
            value={leaderPhone}
            onChange={setLeaderPhone}
            type="tel"
            inputRef={phoneFieldRef}
          />
          <RetroField
            label="DIVISION"
            value={leaderDiv}
            onChange={setLeaderDiv}
            inputRef={divFieldRef}
          />
        </div>
      </div>

      {/* ─── NEXT BUTTON ─── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PixelButton
          color="#00ff88"
          shadowColor="#007744"
          onClick={handleNext}
        >
          ADD PLAYER 2 ▶▶
        </PixelButton>
      </div>
    </div>
  );
}
