import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { moneyCopy } from "../i18n/money";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./CoinHud.module.css";

export const COIN_ICON = "/game/ui/coin.png";

// The HUD is unmounted while a shop, a dialogue or a menu is open, and that is
// exactly when coins change. So it remembers the last number it drew, and when it
// comes back with a different one it shows the change. GameWorld clears it when the
// game is left, so a new game never shows a made-up "-22".
let lastShownCoins: number | null = null;

export function resetCoinHudMemory() {
  lastShownCoins = null;
}

// The Doctor's copper coins, bottom-right of the game frame: the coin and the
// count, in a wooden frame like the inventory bar. When the number changes the
// count bounces once and a "+6" / "-1" rises above it (a gift, a payment, a
// purchase). Purely presentational and click-through. Mount it in the scene
// overlay layer, next to the inventory bar, and show it by the same rule.
export function CoinHud({ coins, language }: { coins: number; language: Language }) {
  // The last change, kept by comparing with the previous number while rendering
  // (no effect): `id` makes a new "+N" element each time, so its animation
  // restarts even for two equal changes in a row.
  const [seen, setSeen] = useState<{ coins: number; id: number; amount: number }>(
    () => ({ coins: lastShownCoins ?? coins, id: 0, amount: 0 }),
  );

  useEffect(() => {
    lastShownCoins = coins;
  }, [coins]);

  if (seen.coins !== coins) {
    setSeen({ coins, id: seen.id + 1, amount: coins - seen.coins });
  }

  return (
    <div
      className={styles.dock}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      role="status"
      aria-label={`${moneyCopy[language].coins}: ${coins}`}
      data-coin-hud
      data-coins={coins}
    >
      <div className={styles.window}>
        {seen.amount !== 0 ? (
          <span
            key={seen.id}
            aria-hidden
            data-coin-delta={seen.amount}
            className={`${styles.delta} ${seen.amount > 0 ? styles.deltaGain : styles.deltaSpend}`}
          >
            {seen.amount > 0 ? "+" : ""}
            {seen.amount}
          </span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.coin} src={COIN_ICON} alt="" width={16} height={16} draggable={false} />
        <span key={coins} className={styles.count}>
          {coins}
        </span>
      </div>
    </div>
  );
}
