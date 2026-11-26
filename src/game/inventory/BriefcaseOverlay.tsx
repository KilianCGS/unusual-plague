"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { briefcaseCopy } from "../i18n/briefcase";
import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import { InventorySlotContents } from "./InventorySlotView";
import { InventorySlotTooltip } from "./InventorySlotTooltip";
import type { InventoryState } from "./inventory";
import styles from "./BriefcaseOverlay.module.css";

// The Doctor's open case: his carried inventory (15 places, 3 rows of 5) drawn over the case's picture, the world
// dimmed behind it. Objects are ordered by dragging them to another place (an occupied one swaps), or by clicking
// one and then the place it should go to. It owns no inventory rule: it only reports the move (moveSlot).
// Esc, the case's key (handled by the owner) or a click outside close it.
export function BriefcaseOverlay({
  inventory,
  language,
  keyLabel,
  onMove,
  onClose,
}: {
  inventory: InventoryState;
  language: Language;
  keyLabel: string;
  onMove: (from: number, to: number) => void;
  onClose: () => void;
}) {
  const copy = briefcaseCopy[language];
  // The place picked up (by drag or by click) and the place the pointer is over while dragging.
  const [picked, setPicked] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

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

  function drop(to: number) {
    if (picked !== null) onMove(picked, to);
    setPicked(null);
    setOver(null);
  }

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-briefcase-overlay
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.case} role="dialog" aria-label={copy.title}>
        <ul className={styles.grid} aria-label={copy.title}>
          {inventory.slots.map((slot, index) => (
            <li key={index} className={styles.cell}>
              <button
                type="button"
                className={styles.slot}
                data-briefcase-slot={index}
                data-occupied={slot !== null}
                data-picked={picked === index}
                data-over={over === index && picked !== null && picked !== index}
                data-item-id={slot?.itemId}
                draggable={slot !== null}
                aria-label={
                  slot === null
                    ? copy.emptySlot
                    : `${getItemName(slot.itemId, language)} x${slot.quantity}`
                }
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(index));
                  setPicked(index);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  if (over !== index) setOver(index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  drop(index);
                }}
                onDragEnd={() => {
                  setPicked(null);
                  setOver(null);
                }}
                onClick={() => {
                  if (picked === null) {
                    if (slot !== null) setPicked(index);
                  } else {
                    drop(index);
                  }
                }}
              >
                <InventorySlotContents slot={slot} language={language} classes={styles} showQuantityFromTwo />
                {slot !== null ? <InventorySlotTooltip slot={slot} language={language} /> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.hint}>{copy.hint.replace("{key}", keyLabel)}</p>
    </div>
  );
}

// The small button at the bottom of the frame that opens the case (it replaces the old bar).
export function BriefcaseChip({
  language,
  keyLabel,
  onOpen,
}: {
  language: Language;
  keyLabel: string;
  onOpen: () => void;
}) {
  const copy = briefcaseCopy[language];

  return (
    <button
      type="button"
      className={styles.chip}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-briefcase-chip
      aria-label={copy.open}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onOpen}
    >
      <span className={styles.chipKey}>{keyLabel}</span>
      <span>{copy.chip}</span>
    </button>
  );
}
