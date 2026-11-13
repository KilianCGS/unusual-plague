// The first-time tutorial as a tiny pure state machine. It never reads input:
// the game REPORTS what really happened (the Book opened, the Map was shown,
// the Doctor moved, a Book page or tab changed, the chest was reached /
// opened, the flask was taken) and the machine only decides
// whether that event is the one the current step was waiting for. Wrong events
// are ignored; there are no timers.
export type TutorialStep =
  | "intro" // the opening (illustration + monologue) is still running
  | "goal" // what the game is about (acknowledged with Enter / a click)
  | "book" // open the Book (Q)
  | "book-cover" // click the closed Book to open it
  | "book-page" // turn a page
  | "book-preparations" // open the PREPARADOS section
  | "book-ailments" // ...then DOLENCIAS
  | "book-patients" // ...then PACIENTES
  | "book-close" // close it
  | "map"
  | "move"
  | "chest-approach" // walk up to the chest in the room
  | "chest-interact" // open it with E
  | "take-flask" // move the Empty flask to the carried inventory
  | "bar" // what the inventory bar and the coins are (acknowledged)
  | "exit-room" // go down to the Botica
  | "botica" // the two crafting interfaces (acknowledged)
  | "exit-botica" // go out to the street
  | "run" // hold Space while moving
  | "done";

export type TutorialEvent =
  | "intro-finished"
  | "continue" // the player acknowledged an information step (Enter / click)
  | "book-opened"
  | "book-cover-opened" // ...and then opened its cover

  | "book-page-changed"
  | "book-section-preparations" // the Book showed that section
  | "book-section-ailments"
  | "book-section-patients"
  | "book-closed"
  | "map-opened"
  | "player-moved"
  | "chest-in-range" // the Doctor can use the chest's interaction zone
  | "chest-out-of-range"
  | "chest-opened" // the Storage was opened from the chest
  | "storage-closed" // ...and closed again
  | "flask-taken" // the Empty flask really reached the carried inventory
  | "botica-entered"
  | "street-entered"
  | "run-started";

// The one event that completes each step, in order.
const STEP_COMPLETED_BY: Record<
  Exclude<TutorialStep, "done">,
  { event: TutorialEvent; next: TutorialStep }
> = {
  intro: { event: "intro-finished", next: "goal" },
  goal: { event: "continue", next: "book" },
  book: { event: "book-opened", next: "book-cover" },
  "book-cover": { event: "book-cover-opened", next: "book-page" },
  "book-page": { event: "book-page-changed", next: "book-preparations" },
  "book-preparations": { event: "book-section-preparations", next: "book-ailments" },
  "book-ailments": { event: "book-section-ailments", next: "book-patients" },
  "book-patients": { event: "book-section-patients", next: "book-close" },
  "book-close": { event: "book-closed", next: "map" },
  map: { event: "map-opened", next: "move" },
  move: { event: "player-moved", next: "chest-approach" },
  "chest-approach": { event: "chest-in-range", next: "chest-interact" },
  "chest-interact": { event: "chest-opened", next: "take-flask" },
  "take-flask": { event: "flask-taken", next: "bar" },
  bar: { event: "continue", next: "exit-room" },
  "exit-room": { event: "botica-entered", next: "botica" },
  botica: { event: "continue", next: "exit-botica" },
  "exit-botica": { event: "street-entered", next: "run" },
  run: { event: "run-started", next: "done" },
};

// The steps that wait for the player to say "understood" (a button and Enter).
export const ACK_STEPS: readonly TutorialStep[] = ["goal", "bar", "botica"];

// The inventory bar and the coins are shown from the step that explains them.
const HUD_STEPS: readonly TutorialStep[] = [
  "bar",
  "exit-room",
  "botica",
  "exit-botica",
  "run",
  "done",
];
export function isTutorialHudUnlocked(step: TutorialStep): boolean {
  return HUD_STEPS.includes(step);
}

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

// The way out of the Doctor's room stays shut until the tutorial has got him to the
// "go down to the Botica" step: the player cannot leave without having done it.
export function isRoomExitBlocked(step: TutorialStep): boolean {
  return !["exit-room", "botica", "exit-botica", "run", "done"].includes(step);
}

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
    return "bar";
  }

  // A late tutorial never traps a player who already did the thing: the botica
  // step is skipped if he is already past it (he reached the street).
  if (event === "street-entered" && (step === "botica" || step === "exit-room")) {
    return "run";
  }

  const rule = STEP_COMPLETED_BY[step];

  if (rule.event === event) {
    return rule.next;
  }

  const back = STEP_REVERTED_BY[step];

  return back && back.event === event ? back.previous : step;
}
