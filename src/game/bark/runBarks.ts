import {
  createShuffleBag,
  drawFromBag,
  type Random,
  type ShuffleBag,
} from "./shuffleBag";

// When the Doctor comments on his own running. Pure rules, no React: the
// tracker counts RUNNING time (not wall-clock time), so being stopped, walking,
// in a dialogue or in a menu neither advances nor spends anything.
//
//  - 5 seconds of CONTINUOUS running before the first remark; stopping before
//    that sends the count back to 0.
//  - After a remark, 30 seconds of running must pass before the next one. The
//    cooldown only counts down while running, and survives stops: stop, start
//    again and what was left of it is still left.
//  - The phrases come out of a shuffle bag (shuffleBag.ts): none repeats until
//    all have been said. The bag is session state (it lives as long as the
//    tracker does).
//  - At most one remark is visible at a time.
export const RUN_BARK_AFTER_SECONDS = 5;
export const RUN_BARK_COOLDOWN_SECONDS = 30;

export type RunBarkTracker = {
  // Seconds of uninterrupted running.
  continuousSeconds: number;
  // Seconds of running still to go before another remark is allowed.
  cooldownSeconds: number;
  bag: ShuffleBag;
};

export function createRunBarkTracker(
  phraseCount: number,
  random: Random,
): RunBarkTracker {
  return {
    continuousSeconds: 0,
    cooldownSeconds: 0,
    bag: createShuffleBag(phraseCount, random),
  };
}

export type RunBarkStep = {
  tracker: RunBarkTracker;
  // The index of the phrase to say now, or null.
  phraseIndex: number | null;
};

// One step of `deltaSeconds`. `running` = the Doctor is really running (input
// accepted, moving, run key armed). `visible` = a remark is on screen.
export function advanceRunBark(
  tracker: RunBarkTracker,
  deltaSeconds: number,
  running: boolean,
  visible: boolean,
  phraseCount: number,
  random: Random,
): RunBarkStep {
  if (!running) {
    return {
      tracker: { ...tracker, continuousSeconds: 0 },
      phraseIndex: null,
    };
  }

  const continuousSeconds = tracker.continuousSeconds + deltaSeconds;
  const cooldownSeconds = Math.max(0, tracker.cooldownSeconds - deltaSeconds);
  const advanced = { ...tracker, continuousSeconds, cooldownSeconds };

  if (
    visible ||
    continuousSeconds < RUN_BARK_AFTER_SECONDS ||
    cooldownSeconds > 0
  ) {
    return { tracker: advanced, phraseIndex: null };
  }

  const drawn = drawFromBag(tracker.bag, phraseCount, random);

  return {
    tracker: {
      ...advanced,
      cooldownSeconds: RUN_BARK_COOLDOWN_SECONDS,
      bag: drawn.bag,
    },
    phraseIndex: drawn.index,
  };
}

// A remark only shows while the game is in plain play (no dialogue, interface,
// narrative scene or fade): the owner says so with `enabled`, and the remark
// goes away the moment it is false.
export function visibleRunBarkIndex(
  phraseIndex: number | null,
  enabled: boolean,
): number | null {
  return enabled ? phraseIndex : null;
}
