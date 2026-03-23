import type { Metadata } from "next";
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
      <body className="bg-arcade-dark text-white antialiased">{children}</body>
    </html>
  );
}
