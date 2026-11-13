import type { CSSProperties } from "react";

import styles from "./PickupAura.module.css";

// A soft, slow glow (with a few twinkling pixel stars) behind something in the world the Doctor can pick up, so it
// reads as interactive without a symbol over it (the "!" stays for characters
// with news). It lives in world space, centred on (x, y), and only draws; the
// owner decides which objects get one and when it goes (a collected object has
// no sprite, so its aura is simply never drawn).
export function PickupAura({
  x,
  y,
  width,
  height,
  zIndex,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}) {
  return (
    <div
      className={styles.aura}
      style={{ left: x, top: y, width, height, zIndex } as CSSProperties}
      data-pickup-aura
      aria-hidden="true"
    >
      {/* three tiny pixel stars that twinkle one after another (2026-11-13) */}
      <i className={`${styles.spark} ${styles.sparkA}`} />
      <i className={`${styles.spark} ${styles.sparkB}`} />
      <i className={`${styles.spark} ${styles.sparkC}`} />
    </div>
  );
}
