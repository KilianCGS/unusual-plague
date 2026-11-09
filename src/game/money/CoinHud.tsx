import type { CSSProperties } from "react";

import { moneyCopy } from "../i18n/money";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./CoinHud.module.css";

export const COIN_ICON = "/game/ui/coin.png";

// The Doctor's copper coins, bottom-right of the game frame: the coin and the
// count. Purely presentational and click-through. Mount it in the scene overlay
// layer, next to the inventory bar, and show it by the same rule.
export function CoinHud({ coins, language }: { coins: number; language: Language }) {
  return (
    <div
      className={styles.dock}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      role="status"
      aria-label={`${moneyCopy[language].coins}: ${coins}`}
      data-coin-hud
      data-coins={coins}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.coin} src={COIN_ICON} alt="" width={16} height={16} draggable={false} />
      <span className={styles.count}>{coins}</span>
    </div>
  );
}
