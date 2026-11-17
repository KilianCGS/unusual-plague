import type { ReactNode } from "react";

// Scales a HUD piece (the inventory bar, the coins) around the edge it is anchored to, for the scenes that
// want them bigger or smaller (the market street). At 1 it adds nothing, so every other scene is untouched.
export function HudScale({
  scale,
  origin,
  children,
}: {
  scale: number;
  origin: "bottom center" | "bottom right";
  children: ReactNode;
}) {
  if (scale === 1) return <>{children}</>;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: origin,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
