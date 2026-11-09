"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

import { moneyCopy } from "../i18n/money";
import type { Language } from "../i18n/types";
import { getItemIcon, getItemName } from "../items/items";
import { ItemIcon } from "../items/ItemIcon";
import { COIN_ICON } from "../money/CoinHud";
import { canAfford } from "../money/money";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import { unitsLeft, type ShopDefinition, type ShopEntry } from "./shops";
import styles from "./ShopOverlay.module.css";

// The buying interface. One row per item on sale: icon, name, price and a Buy
// button. What can no longer be bought (sold out) is dimmed and its button is
// off; an item the Doctor cannot afford yet is dimmed too. It owns no rules:
// buying is decided and applied by the game (all or nothing).
export function ShopOverlay({
  shop,
  coins,
  claimedRewards,
  language,
  message,
  onBuy,
  onClose,
}: {
  shop: ShopDefinition;
  coins: number;
  claimedRewards: ReadonlySet<string>;
  language: Language;
  message: string | null;
  onBuy: (entry: ShopEntry) => void;
  onClose: () => void;
}) {
  const copy = moneyCopy[language].shop;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.repeat) {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-shop-overlay={shop.id}
    >
      <div className={styles.border}>
        <div className={styles.paper}>
          <button type="button" className={styles.close} aria-label={copy.close} onClick={onClose}>
            ×
          </button>
          <h2 className={styles.title}>{shop.title[language]}</h2>
          <p className={styles.greeting}>{shop.greeting[language]}</p>
          <ul className={styles.list}>
            {shop.entries.map((entry) => {
              const left = unitsLeft(claimedRewards, shop, entry);
              const soldOut = left === 0;
              const affordable = canAfford(coins, entry.price);

              return (
                <li
                  key={entry.itemId}
                  className={`${styles.row}${soldOut ? ` ${styles.soldOut}` : ""}${!soldOut && !affordable ? ` ${styles.tooDear}` : ""}`}
                  data-shop-entry={entry.itemId}
                  data-sold-out={soldOut}
                  data-affordable={affordable}
                >
                  <span className={styles.icon}>
                    {getItemIcon(entry.itemId) ? <ItemIcon itemId={entry.itemId} className={styles.itemIcon} /> : null}
                  </span>
                  <span className={styles.name}>{getItemName(entry.itemId, language)}</span>
                  <span className={styles.left}>×{left}</span>
                  <span className={styles.price}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={styles.coin} src={COIN_ICON} alt="" width={16} height={16} draggable={false} />
                    {entry.price}
                  </span>
                  <button
                    type="button"
                    className={styles.buy}
                    disabled={soldOut}
                    onClick={() => onBuy(entry)}
                    data-shop-buy={entry.itemId}
                  >
                    {soldOut ? copy.soldOut : copy.buy}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className={styles.message} data-shop-message>
            {message ?? " "}
          </p>
          <div className={styles.purse}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coin} src={COIN_ICON} alt="" width={16} height={16} draggable={false} />
            <span data-shop-coins>{coins}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
