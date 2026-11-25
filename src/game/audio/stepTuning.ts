"use client";

import { useSyncExternalStore } from "react";

// The step beat: EVERY how many milliseconds the step sound repeats while the Doctor walks or runs, whether or not it lines up with
// the sprite. /dev/steps lets the author change it live (nothing is saved); the game uses the defaults below.
export type StepTuning = {
  enabled: boolean;
  // Milliseconds between two steps while walking / running.
  walkMs: number;
  runMs: number;
  // Playback rate of the step sound while running (the game uses 1.15).
  runRate: number;
};

// 2026-11-21 (Kilian, chosen by ear in /dev/steps): the game's steps repeat on a fixed beat, walking every 350 ms and running every
// 240 ms at rate 1.15, whether or not it lines up with the sprite. `enabled: false` (only in /dev/steps) gives back the old frame-synced steps.
export const DEFAULT_STEP_TUNING: StepTuning = { enabled: true, walkMs: 350, runMs: 240, runRate: 1.15 };

export const STEP_MS_MIN = 60;
export const STEP_MS_MAX = 1500;

let current: StepTuning = DEFAULT_STEP_TUNING;
const listeners = new Set<() => void>();

const clampMs = (value: number) => Math.min(STEP_MS_MAX, Math.max(STEP_MS_MIN, Math.round(value)));

export function getStepTuning(): StepTuning {
  return current;
}

export function setStepTuning(next: Partial<StepTuning>) {
  const merged = { ...current, ...next };
  current = {
    enabled: merged.enabled === true,
    walkMs: clampMs(merged.walkMs),
    runMs: clampMs(merged.runMs),
    runRate: Math.min(2, Math.max(0.5, Math.round(merged.runRate * 100) / 100)),
  };
  listeners.forEach((listener) => listener());
}

export function resetStepTuning() {
  current = DEFAULT_STEP_TUNING;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStepTuning(): StepTuning {
  return useSyncExternalStore(subscribe, getStepTuning, () => DEFAULT_STEP_TUNING);
}
