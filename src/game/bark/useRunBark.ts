"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { runBarkLines } from "../i18n/runBarks";
import { MAX_FRAME_DELTA_SECONDS } from "../protagonist/protagonistRun";
import {
  advanceRunBark,
  createRunBarkTracker,
  visibleRunBarkIndex,
  type RunBarkTracker,
} from "./runBarks";

const PHRASE_COUNT = runBarkLines.es.length;

// Owns the Doctor's run remarks for the session: it must live ABOVE the scenes
// (they remount on every scene change), so the cooldown and the shuffle bag
// survive them. `running` = the Doctor is really running; `enabled` = the game
// is in plain play (no dialogue, interface, narrative scene or fade).
//
// Returns the phrase index to show (null = none) and `dismiss`, to be called
// when the remark finished showing. The remark is not a conversation: nothing
// here touches input, movement or the game phase.
export function useRunBark({
  running,
  enabled,
}: {
  running: boolean;
  enabled: boolean;
}) {
  const [phraseIndex, setPhraseIndex] = useState<number | null>(null);
  const trackerRef = useRef<RunBarkTracker | null>(null);
  const visibleRef = useRef(false);
  const active = running && enabled;

  // A remark does not outlive plain play: leaving it clears the remark.
  if (!enabled && phraseIndex !== null) {
    setPhraseIndex(null);
  }

  useEffect(() => {
    visibleRef.current = phraseIndex !== null;
  }, [phraseIndex]);

  useEffect(() => {
    if (!active) {
      // stopped (or not in play): the continuous count starts over; the
      // cooldown and the bag are kept
      if (trackerRef.current) {
        trackerRef.current = { ...trackerRef.current, continuousSeconds: 0 };
      }

      return;
    }

    trackerRef.current ??= createRunBarkTracker(PHRASE_COUNT, Math.random);

    let frame = 0;
    let previous: number | null = null;

    function tick(timestamp: number) {
      const deltaSeconds =
        previous === null
          ? 0
          : Math.min((timestamp - previous) / 1000, MAX_FRAME_DELTA_SECONDS);

      previous = timestamp;

      if (trackerRef.current) {
        const step = advanceRunBark(
          trackerRef.current,
          deltaSeconds,
          true,
          visibleRef.current,
          PHRASE_COUNT,
          Math.random,
        );

        trackerRef.current = step.tracker;

        if (step.phraseIndex !== null) {
          visibleRef.current = true;
          setPhraseIndex(step.phraseIndex);
        }
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  const dismiss = useCallback(() => {
    visibleRef.current = false;
    setPhraseIndex(null);
  }, []);

  return { phraseIndex: visibleRunBarkIndex(phraseIndex, enabled), dismiss };
}
