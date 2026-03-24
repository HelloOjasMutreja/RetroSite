import type { Metadata } from "next";
import { CursorProvider } from "@/components/arcade/CustomCursor";
import "./globals.css";
import { GlitchInitializer } from "@/components/arcade/GlitchInitializer";
import { MuteToggle } from "@/components/ui/MuteToggle";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "RESONATE 2.0 — Arcade",
  description: "Arcade-style registration for RESONATE 2.0"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-arcade-dark text-white antialiased">
        <CursorProvider>
          <GlitchInitializer />
          <PageTransition />
          <MuteToggle />
          {children}
        </CursorProvider>
      </body>
    </html>
  );
}
