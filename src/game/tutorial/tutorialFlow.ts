// The first-time tutorial as a tiny pure state machine. It never reads input:
// the game REPORTS what really happened (the Book opened, the Map was shown,
// the Doctor moved, a Book page or tab changed, the chest was reached /
// opened, the flask was taken) and the machine only decides
// whether that event is the one the current step was waiting for. Wrong events
// are ignored; there are no timers.
export type TutorialStep =
  | "intro" // the opening (illustration + monologue) is still running
  | "book" // open the Book (Q)
  | "book-page" // turn a page
  | "book-tab" // choose another section
  | "book-close" // close it
  | "map"
  | "move"
  | "chest-approach" // walk up to the chest in the room
  | "chest-interact" // open it with E
  | "take-flask" // move the Empty flask to the carried inventory
  | "done";

export type TutorialEvent =
  | "intro-finished"
  | "book-opened"
  | "book-page-changed"
  | "book-tab-changed"
  | "book-closed"
  | "map-opened"
  | "player-moved"
  | "chest-in-range" // the Doctor can use the chest's interaction zone
  | "chest-out-of-range"
  | "chest-opened" // the Storage was opened from the chest
  | "storage-closed" // ...and closed again
  | "flask-taken"; // the Empty flask really reached the carried inventory

// The one event that completes each step, in order.
const STEP_COMPLETED_BY: Record<
  Exclude<TutorialStep, "done">,
  { event: TutorialEvent; next: TutorialStep }
> = {
  intro: { event: "intro-finished", next: "book" },
  book: { event: "book-opened", next: "book-page" },
  "book-page": { event: "book-page-changed", next: "book-tab" },
  "book-tab": { event: "book-tab-changed", next: "book-close" },
  "book-close": { event: "book-closed", next: "map" },
  map: { event: "map-opened", next: "move" },
  move: { event: "player-moved", next: "chest-approach" },
  "chest-approach": { event: "chest-in-range", next: "chest-interact" },
  "chest-interact": { event: "chest-opened", next: "take-flask" },
  "take-flask": { event: "flask-taken", next: "done" },
};

// The only way BACK: the player walks away from the chest, or closes the
// Storage without the flask. Book, Map and movement are never repeated.
const STEP_REVERTED_BY: Partial<
  Record<
    Exclude<TutorialStep, "done">,
    { event: TutorialEvent; previous: TutorialStep }
  >
> = {
  "chest-interact": { event: "chest-out-of-range", previous: "chest-approach" },
  "take-flask": { event: "storage-closed", previous: "chest-interact" },
};

const CHEST_STEPS: TutorialStep[] = [
  "chest-approach",
  "chest-interact",
  "take-flask",
];

export const INITIAL_TUTORIAL_STEP: TutorialStep = "intro";

export function advanceTutorial(
  step: TutorialStep,
  event: TutorialEvent,
): TutorialStep {
  if (step === "done") {
    return step;
  }

  // The flask is the goal of the three chest steps: if it is already carried
  // (taken before the tutorial got there) there is nothing left to teach.
  if (event === "flask-taken" && CHEST_STEPS.includes(step)) {
    return "done";
  }

  const rule = STEP_COMPLETED_BY[step];

  if (rule.event === event) {
    return rule.next;
  }

  const back = STEP_REVERTED_BY[step];

  return back && back.event === event ? back.previous : step;
}
