"use client";

import { useCallback, useEffect, useState } from "react";

import type { Conversation, DialogueLine } from "./dialogueTypes";
import { delayAfter } from "./typewriter";

type State = { conversation: Conversation; index: number; shown: number };

export type DialogueHandle = {
  // True from start() until the last line is dismissed. While active the
  // owner should block the protagonist's movement.
  active: boolean;
  line: DialogueLine | null;
  // The characters revealed so far / the whole text of the current line.
  visibleText: string;
  fullText: string;
  isComplete: boolean;
  start: (conversation: Conversation) => void;
  close: () => void;
};

// Owns one conversation and its typewriter. Space:
//   - while the line is still typing -> reveals the rest of it;
//   - when the line is complete -> next line, or closes after the last one.
// It knows nothing about scenes, camera or where the bubble is drawn.
export function useDialogue(): DialogueHandle {
  const [state, setState] = useState<State | null>(null);

  const line = state ? (state.conversation.lines[state.index] ?? null) : null;
  const fullText = line?.text ?? "";
  const shown = state?.shown ?? 0;
  const isComplete = line !== null && shown >= fullText.length;
  const active = state !== null;

  // Typewriter: one timeout per character, with punctuation pauses.
  useEffect(() => {
    if (!line || shown >= line.text.length) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => {
        setState((current) =>
          current ? { ...current, shown: current.shown + 1 } : current,
        );
      },
      delayAfter(line.text[shown - 1] ?? "", line.text[shown]),
    );

    return () => window.clearTimeout(timeoutId);
  }, [line, shown]);

  useEffect(() => {
    if (!active) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space") {
        return;
      }

      event.preventDefault();

      if (event.repeat) {
        return;
      }

      setState((current) => {
        if (!current) {
          return current;
        }

        const currentLine = current.conversation.lines[current.index];

        if (currentLine && current.shown < currentLine.text.length) {
          return { ...current, shown: currentLine.text.length };
        }

        const nextIndex = current.index + 1;

        return nextIndex < current.conversation.lines.length
          ? { ...current, index: nextIndex, shown: 0 }
          : null;
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  const start = useCallback((conversation: Conversation) => {
    if (conversation.lines.length > 0) {
      setState({ conversation, index: 0, shown: 0 });
    }
  }, []);

  const close = useCallback(() => setState(null), []);

  return {
    active,
    line,
    visibleText: fullText.slice(0, shown),
    fullText,
    isComplete,
    start,
    close,
  };
}
