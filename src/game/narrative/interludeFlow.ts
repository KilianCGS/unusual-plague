// The phases of a narrative interlude (illustration + text over black) as a
// tiny pure state machine, so it is testable without a browser. Like the
// tutorial it only reacts to REPORTED events; the component owns the timers.
//
//   fade-in   black > the illustration appears
//   reading   the monologue plays (Space types/advances, Esc skips)
//   fade-out  the illustration and text fade to black
//   reveal    the black fades away, showing the game behind it
//   done      the interlude is over; the owner gives control back
export type InterludePhase =
  "fade-in" | "reading" | "fade-out" | "reveal" | "done";

export type InterludeEvent =
  | "illustration-visible" // the fade-in finished
  | "text-finished" // the last line was dismissed
  | "skip" // Esc
  | "faded-out" // the fade to black finished
  | "revealed"; // the black is gone

export const INITIAL_INTERLUDE_PHASE: InterludePhase = "fade-in";

export function advanceInterlude(
  phase: InterludePhase,
  event: InterludeEvent,
): InterludePhase {
  switch (phase) {
    case "fade-in":
      return event === "illustration-visible"
        ? "reading"
        : event === "skip"
          ? "fade-out"
          : phase;
    case "reading":
      return event === "text-finished" || event === "skip" ? "fade-out" : phase;
    case "fade-out":
      return event === "faded-out" ? "reveal" : phase;
    case "reveal":
      return event === "revealed" ? "done" : phase;
    default:
      return phase;
  }
}

// Whether Esc may skip right now. Once the fade to black has started the
// interlude is already ending, so a second Esc is ignored.
export function canSkipInterlude(phase: InterludePhase): boolean {
  return phase === "fade-in" || phase === "reading";
}
