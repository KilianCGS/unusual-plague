// The Doctor's run key (Space), as a small state machine with no React and no
// DOM.
//
// Space arms the run only with a FRESH press (never auto-repeat) at a moment
// when the game takes input. Releasing it, or the game taking the input away
// (a dialogue, an interface...), disarms it. A Space that closes a dialogue
// arrives while input is still off, and the repeats of a held key are ignored,
// so keeping it held never starts a run by accident.
//
// One exception, the run INTENT survives a scene change: the fade takes the
// input away for a moment, but whoever was running (Space armed) and keeps
// holding Space gets the run back, with no new press, when control returns.
// What matters is the intent that existed BEFORE the pause, never just "Space
// is down": the owner marks the pause as a transition (beginTransition /
// endTransition); any other pause (dialogue, Book, Crafting, Map, Storage...)
// drops the intent as before.
//
//   RUNNING --(fade starts)--> SUSPENDED --(fade ends, Space still held)--> RUNNING
//   RUNNING --(dialogue / interface)--> not running; Space held later: no run
//   SUSPENDED --(Space released)--> not running
export type RunInput = {
  setEnabled: (enabled: boolean) => void;
  // Returns true when the key press belongs to the run (the caller then calls
  // preventDefault); false when the game does not take input right now and
  // Space is left to whoever uses it (dialogue, Book, Crafting...).
  keyDown: (repeat: boolean) => boolean;
  keyUp: () => void;
  // A scene change starts: the input pause that follows keeps the run intent.
  beginTransition: () => void;
  // The scene change is over. `inputBack` = the game takes input again right
  // now (not, for example, a dialogue that starts on arrival).
  endTransition: (inputBack: boolean) => void;
  reset: () => void;
  isArmed: () => boolean;
};

export function createRunInput(): RunInput {
  let enabled = false;
  let armed = false;
  // Space is physically down (a press counted even while input was off).
  let held = false;
  let transitioning = false;
  // The run intent that a transition took away and may give back.
  let suspended = false;

  return {
    setEnabled(next) {
      enabled = next;

      if (!next) {
        // during a transition every scene (the old one, the new one) reports
        // "no input": the first one to see the run keeps its intent
        suspended = transitioning ? suspended || armed : false;
        armed = false;
      }
    },
    keyDown(repeat) {
      held = true;

      if (!enabled) {
        return false;
      }

      if (!repeat) {
        armed = true;
      }

      return true;
    },
    keyUp() {
      held = false;
      armed = false;
      suspended = false;
    },
    beginTransition() {
      transitioning = true;
    },
    endTransition(inputBack) {
      if (!transitioning) {
        return;
      }

      transitioning = false;

      if (suspended && held && inputBack) {
        armed = true;
      }

      suspended = false;
    },
    reset() {
      armed = false;
      held = false;
      suspended = false;
    },
    isArmed: () => armed,
  };
}
