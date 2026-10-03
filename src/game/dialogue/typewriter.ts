// Typewriter timing. Pure functions, no React.
export const CHAR_DELAY_MS = 28;
const COMMA_PAUSE_MS = 120;
const SENTENCE_PAUSE_MS = 260;
const ELLIPSIS_PAUSE_MS = 420;

// Delay before the NEXT character appears, given the one just shown.
export function delayAfter(shown: string, next: string | undefined): number {
  if (shown === "…") {
    return CHAR_DELAY_MS + ELLIPSIS_PAUSE_MS;
  }

  // A run of dots ("...") pauses once, after the last dot.
  if (shown === "." && next === ".") {
    return CHAR_DELAY_MS;
  }

  if (shown === "." || shown === "?" || shown === "!") {
    return next === undefined || next === " "
      ? CHAR_DELAY_MS + SENTENCE_PAUSE_MS
      : CHAR_DELAY_MS;
  }

  if (shown === "," || shown === ";" || shown === ":") {
    return CHAR_DELAY_MS + COMMA_PAUSE_MS;
  }

  return CHAR_DELAY_MS;
}
