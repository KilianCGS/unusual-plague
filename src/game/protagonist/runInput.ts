// The Doctor's run key (Space), as a small state machine with no React and no
// DOM: Space arms the run only with a FRESH press (never auto-repeat) at a
// moment when the game accepts input; releasing it, or the game taking the
// input away (a dialogue, an interface, a fade...), disarms it. A Space that
// closes a dialogue arrives while input is still off, and the repeats of a
// held key are ignored, so keeping it held never starts a run by accident.
export type RunInput = {
  setEnabled: (enabled: boolean) => void;
  // Returns true when the key press belongs to the run (the caller then calls
  // preventDefault); false when the game does not take input right now and
  // Space is left to whoever uses it (dialogue, Book, Crafting...).
  keyDown: (repeat: boolean) => boolean;
  keyUp: () => void;
  reset: () => void;
  isArmed: () => boolean;
};

export function createRunInput(): RunInput {
  let enabled = false;
  let armed = false;

  return {
    setEnabled(next) {
      enabled = next;

      if (!next) {
        armed = false;
      }
    },
    keyDown(repeat) {
      if (!enabled) {
        return false;
      }

      if (!repeat) {
        armed = true;
      }

      return true;
    },
    keyUp() {
      armed = false;
    },
    reset() {
      armed = false;
    },
    isArmed: () => armed,
  };
}
