import type { ReactNode } from "react";

// The /dev/* pages are the author's TOOLS (Decorator, collisions, test starts...). In a PRODUCTION build (what gets published)
// they are hidden: they show a short notice instead. `next dev` shows them as always; set NEXT_PUBLIC_SHOW_DEV=1 to keep
// them in a build (2026-11-20).
const HIDDEN = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_DEV !== "1";

export default function DevLayout({ children }: { children: ReactNode }) {
  if (HIDDEN) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0907", color: "#f4ead5", font: "16px monospace", padding: 24, textAlign: "center" }}>
        <p>Esta página es una herramienta de desarrollo y no está disponible aquí.<br />This page is a development tool and is not available here.</p>
      </main>
    );
  }
  return <>{children}</>;
}
