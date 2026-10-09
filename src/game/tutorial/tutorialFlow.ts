// The first-time tutorial as a tiny pure state machine. It never reads input:
// the game REPORTS what really happened (the Book opened, the Map was shown,
// the Doctor moved, an interaction started) and the machine only decides
// whether that event is the one the current step was waiting for. Wrong events
// are ignored; there are no timers.
export type TutorialStep =
  | "intro" // the Doctor's opening monologue is still running
  | "book"
  | "map"
  | "move"
  | "interact"
  | "done";

export type TutorialEvent =
  | "intro-finished"
  | "book-opened"
  | "map-opened"
  | "player-moved"
  | "interaction-started";

// The one event that completes each step, in order.
const STEP_COMPLETED_BY: Record<
  Exclude<TutorialStep, "done">,
  { event: TutorialEvent; next: TutorialStep }
> = {
  intro: { event: "intro-finished", next: "book" },
  book: { event: "book-opened", next: "map" },
  map: { event: "map-opened", next: "move" },
  move: { event: "player-moved", next: "interact" },
  interact: { event: "interaction-started", next: "done" },
};

export const INITIAL_TUTORIAL_STEP: TutorialStep = "intro";

export function advanceTutorial(
  step: TutorialStep,
  event: TutorialEvent,
): TutorialStep {
  if (step === "done") {
    return step;
  }

  const rule = STEP_COMPLETED_BY[step];

  return rule.event === event ? rule.next : step;
}
