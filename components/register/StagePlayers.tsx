"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRegistration, type Player } from "@/lib/registration-context";
import { PixelButton } from "@/components/ui/PixelButton";

/* ------------------------------------------------------------------ */
/*  Squad badge labels                                                 */
/* ------------------------------------------------------------------ */

const SQUAD_LABELS: { text: string; color: string }[] = [
  { text: "( S O L O )", color: "#555566" },
  { text: "( D U O )", color: "#00e5ff" },
  { text: "( T R I O )", color: "#ffe600" },
  { text: "( S Q U A D )", color: "#ff2d78" },
];

/* ------------------------------------------------------------------ */
/*  Retro field (same style as StageTeam)                              */
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
/*  StagePlayers component                                             */
/* ------------------------------------------------------------------ */

export function StagePlayers() {
  const { data, addPlayer, setStage } = useRegistration();
  const panelRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  /* ― local form state ― */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const [error, setError] = useState("");

  /* ― refs for validation flash ― */
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLInputElement>(null);

  const addedCount = data.players.length;
  const currentPlayerNum = addedCount + 2; // leader is P1
  const canAddMore = addedCount < 3;

  /* ---------------------------------------------------------------- */
  /*  Badge stamp animation on addedCount change                       */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0 },
        { scale: 1.15, duration: 0.15, ease: "power2.out" }
      );
      gsap.to(badgeRef.current, {
        scale: 1,
        duration: 0.1,
        delay: 0.15,
        ease: "back.out(2)",
      });
    }
  }, [addedCount]);

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
  /*  Flash invalid field                                              */
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

  /* ---------------------------------------------------------------- */
  /*  Form slide stutter animation                                     */
  /* ---------------------------------------------------------------- */

  const stutterSlideForm = useCallback((onComplete: () => void) => {
    if (!formRef.current) {
      onComplete();
      return;
    }
    const tl = gsap.timeline();
    // VHS stutter
    tl.to(formRef.current, { x: -8, duration: 0.025, ease: "none" })
      .to(formRef.current, { x: 5, duration: 0.025, ease: "none" })
      .to(formRef.current, { x: -3, duration: 0.025, ease: "none" })
      .to(formRef.current, { x: 0, duration: 0.025, ease: "none" });
    // Slide out
    tl.to(formRef.current, {
      x: -60,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        onComplete();
        // Slide in new form
        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" }
          );
        }
      },
    });
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Add player handler                                               */
  /* ---------------------------------------------------------------- */

  const handleAddPlayer = useCallback(() => {
    setError("");
    let valid = true;

    if (!name.trim()) { flashInvalid(nameRef.current); valid = false; }
    if (!email.trim()) { flashInvalid(emailRef.current); valid = false; }
    if (!division.trim()) { flashInvalid(divRef.current); valid = false; }

    if (!valid) return;

    const player: Player = {
      name: name.trim(),
      email: email.trim(),
      phone: "",
      division: division.trim(),
    };

    stutterSlideForm(() => {
      addPlayer(player);
      setName("");
      setEmail("");
      setDivision("");
    });
  }, [name, email, division, flashInvalid, stutterSlideForm, addPlayer]);

  /* ---------------------------------------------------------------- */
  /*  Proceed handler                                                  */
  /* ---------------------------------------------------------------- */

  const handleProceed = useCallback(() => {
    setError("");

    // Must have at least 1 added player
    if (addedCount === 0) {
      setError("ADD AT LEAST ONE MORE PLAYER");
      return;
    }

    // If fields are partially filled, validate and save
    const hasAnyField = name.trim() || email.trim() || division.trim();
    if (hasAnyField) {
      let valid = true;
      if (!name.trim()) { flashInvalid(nameRef.current); valid = false; }
      if (!email.trim()) { flashInvalid(emailRef.current); valid = false; }
      if (!division.trim()) { flashInvalid(divRef.current); valid = false; }
      if (!valid) return;

      addPlayer({
        name: name.trim(),
        email: email.trim(),
        phone: "",
        division: division.trim(),
      });
    }

    // Dramatic stutter + slide out
    if (panelRef.current) {
      const tl = gsap.timeline();
      tl.to(panelRef.current, { x: -12, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 10, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: -8, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 5, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: -3, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 0, duration: 0.025, ease: "none" });
      tl.to(panelRef.current, {
        x: -60,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setStage(3),
      });
    } else {
      setStage(3);
    }
  }, [addedCount, name, email, division, flashInvalid, addPlayer, setStage]);

  /* ---------------------------------------------------------------- */
  /*  Back handler                                                     */
  /* ---------------------------------------------------------------- */

  const handleBack = useCallback(() => {
    if (panelRef.current) {
      const tl = gsap.timeline();
      tl.to(panelRef.current, { x: 8, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: -5, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 3, duration: 0.025, ease: "none" })
        .to(panelRef.current, { x: 0, duration: 0.025, ease: "none" });
      tl.to(panelRef.current, {
        x: 60,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setStage(1),
      });
    } else {
      setStage(1);
    }
  }, [setStage]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const badge = SQUAD_LABELS[Math.min(addedCount, 3)];
  const showProceed = addedCount >= 1;

  return (
    <div ref={panelRef} style={{ width: "100%" }}>

      {/* ─── SQUAD BADGE ─── */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div
          ref={badgeRef}
          style={{
            fontFamily: '"Mondwest", "Press Start 2P", monospace',
            fontSize: "2rem",
            color: badge.color,
            letterSpacing: "0.4em",
            display: "inline-block",
          }}
        >
          {badge.text}
        </div>
      </div>

      {/* ─── ROSTER PREVIEW ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "32px",
          padding: "12px 16px",
          background: "rgba(26, 26, 58, 0.5)",
          border: "1px solid #1a1a3a",
        }}
      >
        {[0, 1, 2, 3].map((idx) => {
          const isLeader = idx === 0;
          const playerIdx = idx - 1;
          const player = isLeader
            ? data.leader
            : data.players[playerIdx];
          const filled = player && player.name;
          const slotLabel = `P${idx + 1}`;

          return (
            <div
              key={idx}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ color: "#555566" }}>{slotLabel}</span>
              <span
                style={{
                  color: filled ? "#00ff88" : "#2a2a4a",
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {filled ? player.name : "▒▒▒▒"}
              </span>
              <span style={{ color: filled ? "#ffe600" : "#2a2a4a" }}>
                {filled ? "★" : "□"}
              </span>
            </div>
          );
        })}
      </div>

      {/* ─── PLAYER FORM ─── */}
      {canAddMore ? (
        <div ref={formRef}>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "10px",
              color: "#ffffff",
              letterSpacing: "0.15em",
              marginBottom: "8px",
            }}
          >
            PLAYER {currentPlayerNum} — SELECT CHARACTER
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
              marginBottom: "24px",
            }}
          >
            <RetroField
              label="CALL SIGN"
              value={name}
              onChange={setName}
              inputRef={nameRef}
            />
            <RetroField
              label="COMMS"
              value={email}
              onChange={setEmail}
              type="email"
              inputRef={emailRef}
            />
          </div>
          <div style={{ maxWidth: "calc(50% - 10px)", marginBottom: "28px" }}>
            <RetroField
              label="DIVISION"
              value={division}
              onChange={setDivision}
              inputRef={divRef}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "9px",
            color: "#00ff88",
            textAlign: "center",
            padding: "24px 0",
            letterSpacing: "0.1em",
          }}
        >
          SQUAD IS FULL — 4/4 PLAYERS
        </div>
      )}

      {/* ─── ERROR MESSAGE ─── */}
      {error && (
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "8px",
            color: "#ff2d78",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          {error}
        </div>
      )}

      {/* ─── NAVIGATION BUTTONS ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PixelButton
          color="transparent"
          shadowColor="#2a2a4a"
          onClick={handleBack}
        >
          ◀ BACK
        </PixelButton>

        <div style={{ display: "flex", gap: "12px" }}>
          {canAddMore && (
            <PixelButton
              color="#00e5ff"
              shadowColor="#0099aa"
              onClick={handleAddPlayer}
            >
              ADD PLAYER {currentPlayerNum} ▶▶
            </PixelButton>
          )}

          {showProceed && (
            <PixelButton
              color="#00ff88"
              shadowColor="#007744"
              onClick={handleProceed}
              className="proceed-pulse"
            >
              <span style={{ color: "#003322" }}>PROCEED TO PAY ▶▶</span>
            </PixelButton>
          )}

          {!showProceed && !canAddMore && (
            <PixelButton
              color="#00ff88"
              shadowColor="#007744"
              onClick={handleProceed}
            >
              <span style={{ color: "#003322" }}>PROCEED TO PAY ▶▶</span>
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
