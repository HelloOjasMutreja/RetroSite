"use client";

/* ------------------------------------------------------------------ */
/*  Web Audio sound system — no file dependencies                      */
/* ------------------------------------------------------------------ */

let _muted = false;
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (_muted) return null;
  if (!_ctx) {
    try {
      _ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  return _ctx;
}

/** Short 8-bit blip for hover — 800 Hz, 40ms */
export function playBlip() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 800;
  gain.gain.value = 0.08;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

/** Coin-insert sound — 1200Hz then 1600Hz, 60ms each */
export function playCoin() {
  const ctx = getCtx();
  if (!ctx) return;
  const gain = ctx.createGain();
  gain.gain.value = 0.1;
  gain.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  osc1.type = "square";
  osc1.frequency.value = 1200;
  osc1.connect(gain);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.06);

  const osc2 = ctx.createOscillator();
  osc2.type = "square";
  osc2.frequency.value = 1600;
  osc2.connect(gain);
  osc2.start(ctx.currentTime + 0.06);
  osc2.stop(ctx.currentTime + 0.12);
}

/** Static burst — short white noise for transitions */
export function playStatic() {
  const ctx = getCtx();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.06;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
}

/* ------------------------------------------------------------------ */
/*  Mute / unmute                                                      */
/* ------------------------------------------------------------------ */

export function isMuted(): boolean {
  return _muted;
}

export function setMuted(muted: boolean) {
  _muted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("retrosite-muted", muted ? "1" : "0");
  }
}

export function loadMutePreference() {
  if (typeof window !== "undefined") {
    _muted = localStorage.getItem("retrosite-muted") === "1";
  }
}
