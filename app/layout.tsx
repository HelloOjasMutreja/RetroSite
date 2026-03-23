import type { Metadata } from "next";
import { CursorProvider } from "@/components/arcade/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroSite",
  description: "Arcade-style web experience"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-arcade-dark text-white antialiased">
        <CursorProvider>{children}</CursorProvider>
      </body>
    </html>
  );
}
