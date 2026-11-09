"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import { objectivesCopy, type Objective } from "./objectives";
import styles from "./ObjectivesPanel.module.css";

// How long a finished errand stays on the list with its tick before it goes.
export const DONE_VISIBLE_MS = 6000;

// A small fold-out list at the top left of the game frame: one line per pending
// errand with an empty box, which gets a tick when it is done and then leaves
// by itself. R (or a click on the title) folds it. It owns no rules: the list
// comes from objectives.ts; this only draws and remembers what was just done.
export function ObjectivesPanel({
  objectives,
  language,
  keyboardActive,
}: {
  objectives: readonly Objective[];
  language: Language;
  // Whether the R key is listened to (only while the Doctor is walking about).
  keyboardActive: boolean;
}) {
  const copy = objectivesCopy[language];
  const [open, setOpen] = useState(true);
  // The errands that were open and have just been completed (shown ticked).
  const [justDone, setJustDone] = useState<readonly string[]>([]);
  const previousOpen = useRef<ReadonlySet<string> | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const openNow = new Set(objectives.filter((o) => !o.done).map((o) => o.id));
    const before = previousOpen.current;

    previousOpen.current = openNow;

    if (!before) {
      return;
    }

    const completed = objectives.filter((o) => o.done && before.has(o.id)).map((o) => o.id);

    if (completed.length === 0) {
      return;
    }

    setJustDone((current) => [...current, ...completed]);
    timers.current.push(
      window.setTimeout(
        () => setJustDone((current) => current.filter((id) => !completed.includes(id))),
        DONE_VISIBLE_MS,
      ),
    );
  }, [objectives]);

  useEffect(() => {
    const pending = timers.current;

    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    if (!keyboardActive) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.key === "r" || event.key === "R") && !event.repeat && !event.ctrlKey && !event.metaKey) {
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardActive]);

  const shown = objectives.filter((o) => !o.done || justDone.includes(o.id));

  if (shown.length === 0) {
    return null;
  }

  return (
    <aside
      className={styles.panel}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-objectives-panel
    >
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "▾" : "▸"}</span>
        <span className={styles.title}>{copy.title}</span>
        <span className={styles.hint}>{open ? copy.toggleHint : `${shown.length} ${copy.toggleHint}`}</span>
      </button>
      {open ? (
        <ul className={styles.list}>
          {shown.map((objective) => (
            <li
              key={objective.id}
              className={`${styles.item}${objective.done ? ` ${styles.done}` : ""}`}
              data-objective={objective.id}
              data-done={objective.done}
            >
              <span className={styles.box} aria-hidden="true">
                {objective.done ? "✓" : ""}
              </span>
              <span className={styles.text}>{objective.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
