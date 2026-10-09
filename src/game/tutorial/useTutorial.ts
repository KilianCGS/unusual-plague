"use client";

import { useCallback, useReducer } from "react";

import {
  advanceTutorial,
  INITIAL_TUTORIAL_STEP,
  type TutorialEvent,
  type TutorialStep,
} from "./tutorialFlow";

// Owns the tutorial step for the whole game session (in memory only). The
// reducer returns the same state for events that do not apply, so reporting
// every movement frame costs no re-render.
export function useTutorial(): {
  step: TutorialStep;
  notify: (event: TutorialEvent) => void;
} {
  const [step, dispatch] = useReducer(advanceTutorial, INITIAL_TUTORIAL_STEP);
  const notify = useCallback((event: TutorialEvent) => dispatch(event), []);

  return { step, notify };
}
