"use client";

import { useRouter } from "next/navigation";
import { PixelButton } from "@/components/ui/PixelButton";
import { GlitchText } from "@/components/ui/GlitchText";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px"
      }}
    >
      <section
        style={{
          maxWidth: "780px",
          width: "100%",
          border: "2px solid #2a2a4a",
          background: "rgba(7, 7, 26, 0.85)",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <GlitchText as="h1">DASHBOARD</GlitchText>
        <p
          data-glitch="true"
          style={{
            margin: 0,
            color: "#d4d4ee",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "10px",
            lineHeight: 1.8
          }}
        >
          Your application space is now active.
          <br />
          We will wire real stats and status next.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <PixelButton color="#00e5ff" shadowColor="#008fa0" onClick={() => router.push("/")}>
            ← BACK TO ARCADE
          </PixelButton>
          <PixelButton color="#ff2d78" shadowColor="#a3164f" onClick={() => router.push("/register")}>
            GO TO REGISTER
          </PixelButton>
        </div>
      </section>
    </main>
  );
}
