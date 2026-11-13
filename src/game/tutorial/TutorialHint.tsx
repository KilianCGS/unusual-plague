import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import type { TutorialHintCopy, TutorialPart } from "../i18n/tutorial";
import { useBindings } from "../controls/controlsStore";
import { MOVE_ACTIONS, keyLabel } from "../controls/keybindings";
import type { Language } from "../i18n/types";
import { KeyCap } from "../ui/KeyCap";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./TutorialHint.module.css";

// Milliseconds per revealed unit (a letter, or one keycap): the note writes itself like the
// dialogues do. The mount is keyed by the step (see GameWorld), so every step starts again.
const REVEAL_MS = 22;

// How many units a title part takes: its letters, or one per keycap.
function partUnits(part: TutorialPart): number {
  if (typeof part === "string") return part.length;
  if ("move" in part) return MOVE_ACTIONS.length;
  return 1;
}

// A text that is partly written: what is revealed, and the rest kept in place (invisible) so
// the lines never re-wrap while it appears.
function Typed({ text, revealed }: { text: string; revealed: number }) {
  const n = Math.max(0, Math.min(text.length, revealed));
  return (
    <>
      <span>{text.slice(0, n)}</span>
      {n < text.length ? <span className={styles.unwritten}>{text.slice(n)}</span> : null}
    </>
  );
}

// A small contextual help box at the bottom of the screen. It never takes
// focus, blocks input or dims the world: it only shows the text it is given.
export function TutorialHint({
  copy,
  aboveOverlays = false,
  raised = false,
  onContinue,
  continueLabel,
  language = "es",
}: {
  copy: TutorialHintCopy;
  // Over the inventory bar and the coins (they are on screen from the "bar" step).
  raised?: boolean;
  // Steps that wait for "understood": a button, and the Enter key.
  onContinue?: () => void;
  continueLabel?: string;
  language?: Language;
  // Drawn over the Book (its backdrop sits above the normal hint layer).
  aboveOverlays?: boolean;
}) {
  const bindings = useBindings();
  // "{interact}", "{book}" ... inside a text are the player's own keys.
  const withKeys = (text: string) =>
    text.replace(/\{(interact|book|run|map|objectives)\}/g, (_, action: keyof typeof bindings) =>
      keyLabel(bindings[action][0], language),
    );
  const bodyLines = copy.body.split("\n").map(withKeys);
  const titleUnits = copy.title.reduce((n, part) => n + partUnits(part), 0);
  const total = titleUnits + bodyLines.reduce((n, line) => n + line.length, 0);

  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(
      () => setRevealed((current) => (reduced ? total : Math.min(total, current + 1))),
      reduced ? 0 : REVEAL_MS,
    );
    return () => window.clearInterval(id);
  }, [total]);
  const finished = revealed >= total;

  useEffect(() => {
    if (!onContinue) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.repeat) {
        event.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  // where each piece starts in the count of revealed units
  const titleStarts = copy.title.map((_, i) => copy.title.slice(0, i).reduce((n, p) => n + partUnits(p), 0));
  const bodyStarts = bodyLines.map((_, i) => titleUnits + bodyLines.slice(0, i).reduce((n, l) => n + l.length, 0));
  const titleNodes = copy.title.map((part, index) => {
    const start = titleStarts[index];
    if (typeof part === "string") {
      return <Typed key={index} text={part} revealed={revealed - start} />;
    }
    const caps =
      "move" in part
        ? MOVE_ACTIONS.map((action) => keyLabel(bindings[action][part.move], language))
        : ["key" in part ? part.key : keyLabel(bindings[part.action][0], language)];
    return (
      <span key={index}>
        {caps.map((label, i) => {
          const shown = revealed > start + i;
          return (
            <span key={i} className={shown ? styles.keyIn : styles.unwritten}>
              <KeyCap label={label} />
            </span>
          );
        })}
      </span>
    );
  });

  const bodyNodes = bodyLines.map((line, index) => {
    const start = bodyStarts[index];
    return (
      <p key={index} className={styles.body}>
        <Typed text={line} revealed={revealed - start} />
      </p>
    );
  });

  return (
    <div
      className={`${styles.hint}${aboveOverlays ? ` ${styles.aboveOverlays}` : ""}${raised ? ` ${styles.raised}` : ""}`}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-tutorial-hint
      role="status"
    >
      <div className={styles.inner}>
        <span className={styles.studTop} aria-hidden />
        <span className={styles.studBottom} aria-hidden />
        <p className={styles.title}>{titleNodes}</p>
        <span className={styles.rule} aria-hidden />
        {bodyNodes}
        {onContinue ? (
          <button
            type="button"
            className={`${styles.continue}${finished ? "" : ` ${styles.unwritten}`}`}
            data-tutorial-continue
            onClick={(event) => {
              // Space / Enter belong to the game: never keep focus.
              event.currentTarget.blur();
              onContinue();
            }}
          >
            {continueLabel} <KeyCap label="Enter" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
