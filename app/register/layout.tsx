import { FloatingWorld } from "@/components/ui/FloatingWorld";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingWorld />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </>
  );
}
