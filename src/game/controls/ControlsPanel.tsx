"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { controlsCopy } from "../i18n/controls";
import type { Language } from "../i18n/types";
import { KeyCap } from "../ui/KeyCap";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import { setBindings, useBindings } from "./controlsStore";
import {
  PRESETS,
  SLOTS_PER_ACTION,
  assignKey,
  cloneBindings,
  isAssignable,
  keyLabel,
  presetOf,
  DEFAULT_PRESET,
  type ControlAction,
  type PresetId,
} from "./keybindings";
import styles from "./ControlsPanel.module.css";

const MOVEMENT: readonly ControlAction[] = ["up", "down", "left", "right"];
const OTHERS: readonly ControlAction[] = ["interact", "run", "book", "map", "objectives"];

// The controls screen: layouts to pick from, and every action's key(s) to change. Wood
// frame and parchment like the game's other windows. It captures the next key press
// while a key is being changed (Esc cancels), so nothing else reacts to it.
export function ControlsPanel({ language, onClose }: { language: Language; onClose: () => void }) {
  const copy = controlsCopy[language];
  const bindings = useBindings();
  const [waiting, setWaiting] = useState<{ action: ControlAction; slot: number } | null>(null);
  const activePreset = presetOf(bindings);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      if (waiting) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (event.key === "Escape") {
          setWaiting(null);
        } else if (isAssignable(event.key)) {
          setBindings(assignKey(bindings, waiting.action, waiting.slot, event.key));
          setWaiting(null);
        }
        return;
      }
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        onClose();
      }
    }
    // capture phase: the panel answers before the game's own key handlers
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [waiting, bindings, onClose]);

  const slotButton = (action: ControlAction, slot: number, caption?: string) => {
    const isWaiting = waiting?.action === action && waiting.slot === slot;
    return (
      <button
        key={`${action}-${slot}`}
        type="button"
        className={`${styles.slot}${isWaiting ? ` ${styles.slotWaiting}` : ""}`}
        data-control-slot={`${action}:${slot}`}
        aria-label={`${copy.actionNames[action]}${caption ? ` (${caption})` : ""}`}
        onClick={(event) => {
          event.currentTarget.blur();
          setWaiting({ action, slot });
        }}
      >
        {isWaiting ? (
          <span className={styles.waiting}>{copy.waiting}</span>
        ) : (
          <KeyCap label={keyLabel(bindings[action][slot], language)} />
        )}
      </button>
    );
  };

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-controls-panel
    >
      <section className={styles.frame} role="dialog" aria-modal="true" aria-label={copy.title}>
        <div className={styles.paper}>
          <h2 className={styles.title}>{copy.title}</h2>

          <div className={styles.presets} role="group" aria-label={copy.presets}>
            {(Object.keys(PRESETS) as PresetId[]).map((id) => (
              <button
                key={id}
                type="button"
                className={`${styles.preset}${activePreset === id ? ` ${styles.presetActive}` : ""}`}
                data-control-preset={id}
                aria-pressed={activePreset === id}
                onClick={(event) => {
                  event.currentTarget.blur();
                  setWaiting(null);
                  setBindings(cloneBindings(PRESETS[id]));
                }}
              >
                {copy.presetNames[id]}
              </button>
            ))}
            <span className={`${styles.custom}${activePreset === null ? ` ${styles.customActive}` : ""}`}>
              {copy.custom}
            </span>
          </div>

          <h3 className={styles.group}>{copy.movement}</h3>
          <div className={styles.rows}>
            <div className={styles.head}>
              <span />
              <span>{copy.main}</span>
              <span>{copy.alternative}</span>
            </div>
            {MOVEMENT.map((action) => (
              <div key={action} className={styles.row}>
                <span className={styles.name}>{copy.actionNames[action]}</span>
                {Array.from({ length: SLOTS_PER_ACTION[action] }, (_, slot) =>
                  slotButton(action, slot, slot === 0 ? copy.main : copy.alternative),
                )}
              </div>
            ))}
          </div>

          <h3 className={styles.group}>{copy.actions}</h3>
          <div className={styles.rows}>
            {OTHERS.map((action) => (
              <div key={action} className={styles.row}>
                <span className={styles.name}>{copy.actionNames[action]}</span>
                {slotButton(action, 0)}
                <span />
              </div>
            ))}
          </div>

          <p className={styles.hint}>{copy.hint}</p>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.secondary}
              data-control-reset
              onClick={(event) => {
                event.currentTarget.blur();
                setWaiting(null);
                setBindings(cloneBindings(PRESETS[DEFAULT_PRESET]));
              }}
            >
              {copy.reset}
            </button>
            <button type="button" className={styles.primary} data-control-close onClick={onClose}>
              {copy.close}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
