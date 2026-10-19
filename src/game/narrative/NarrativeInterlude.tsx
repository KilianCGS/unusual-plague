"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { CSSProperties } from "react";

import type { Conversation } from "../dialogue/dialogueTypes";
import { useDialogue } from "../dialogue/useDialogue";
import { narrativeCopy } from "../i18n/narrative";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import {
  advanceInterlude,
  canSkipInterlude,
  INITIAL_INTERLUDE_PHASE,
} from "./interludeFlow";
import type { NarrativeIllustration } from "./illustrations";
import styles from "./NarrativeInterlude.module.css";

const FADE_IN_MS = 1500;
const FADE_OUT_MS = 1000;
const SKIP_FADE_OUT_MS = 600;
const REVEAL_MS = 1000;

// A full-screen narrative moment: black, the illustration fading in at its own
// aspect ratio, and the text as a quiet panel over its lower part, typed line by
// line. It reuses the dialogue hook for the typewriter and for Space (types the
// rest of the line / goes to the next one), but it is NOT a world dialogue: no
// speaker, no bubble, no scene. Esc skips it. When it ends the black fades away
// and `onFinished` is called, so the game behind it is revealed first.
export function NarrativeInterlude({
  illustration,
  conversation,
  language,
  onFinished,
}: {
  illustration: NarrativeIllustration;
  conversation: Conversation;
  language: Language;
  onFinished: () => void;
}) {
  const copy = narrativeCopy[language];
  const dialogue = useDialogue();
  const startDialogue = dialogue.start;
  const closeDialogue = dialogue.close;
  const [phase, dispatch] = useReducer(
    advanceInterlude,
    INITIAL_INTERLUDE_PHASE,
  );
  const [visible, setVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const textStartedRef = useRef(false);
  const textSeenRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  });

  // Black first, then the illustration fades in.
  useEffect(() => {
    const showId = window.setTimeout(() => setVisible(true), 60);
    const readId = window.setTimeout(
      () => dispatch("illustration-visible"),
      FADE_IN_MS,
    );

    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(readId);
    };
  }, []);

  // The monologue starts when the illustration is fully there, once.
  useEffect(() => {
    if (phase === "reading" && !textStartedRef.current) {
      textStartedRef.current = true;
      startDialogue(conversation);
    }
  }, [phase, conversation, startDialogue]);

  // The last line was dismissed with Space. The dialogue only counts as
  // "finished" after it was seen ACTIVE, otherwise the commit that starts it
  // (when `active` is still false) would look like an immediate dismissal.
  useEffect(() => {
    if (dialogue.active) {
      textSeenRef.current = true;
    } else if (phase === "reading" && textSeenRef.current) {
      dispatch("text-finished");
    }
  }, [phase, dialogue.active]);

  // Esc skips (and only while it can: it never fires twice).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.repeat) {
        return;
      }

      event.preventDefault();

      if (canSkipInterlude(phase)) {
        setSkipped(true);
        closeDialogue();
        dispatch("skip");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, closeDialogue]);

  // The fade to black, then the reveal, then the end.
  useEffect(() => {
    if (phase === "fade-out") {
      const id = window.setTimeout(
        () => dispatch("faded-out"),
        skipped ? SKIP_FADE_OUT_MS : FADE_OUT_MS,
      );

      return () => window.clearTimeout(id);
    }

    if (phase === "reveal") {
      const id = window.setTimeout(() => dispatch("revealed"), REVEAL_MS);

      return () => window.clearTimeout(id);
    }

    if (phase === "done") {
      onFinishedRef.current();
    }
  }, [phase, skipped]);

  if (phase === "done") {
    return null;
  }

  const showingPicture =
    visible && (phase === "fade-in" || phase === "reading");
  const fadeMs =
    phase === "fade-out"
      ? skipped
        ? SKIP_FADE_OUT_MS
        : FADE_OUT_MS
      : FADE_IN_MS;

  return (
    <div
      className={styles.root}
      style={
        {
          ["--ui-font" as string]: PIXEL_FONT_FAMILY,
          opacity: phase === "reveal" ? 0 : 1,
          transitionDuration: `${REVEAL_MS}ms`,
        } as CSSProperties
      }
      data-narrative-interlude
      data-phase={phase}
    >
      <div
        className={styles.stage}
        style={
          {
            ["--ratio" as string]: illustration.width / illustration.height,
            opacity: showingPicture ? 1 : 0,
            transitionDuration: `${fadeMs}ms`,
          } as CSSProperties
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.image}
          src={illustration.src}
          alt=""
          draggable={false}
        />
        {dialogue.line ? (
          <div className={styles.panel} role="status">
            <p className={styles.text}>
              <span>{dialogue.visibleText}</span>
              <span className={styles.rest}>
                {dialogue.fullText.slice(dialogue.visibleText.length)}
              </span>
            </p>
            <p className={styles.hint}>
              <span className={dialogue.isComplete ? styles.ready : undefined}>
                {copy.continue}
              </span>
              <span>{copy.skip}</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
