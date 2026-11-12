import type { Language } from "./types";

// What the Doctor says when Space is pressed where running is not allowed
// (interiors). One is picked at random (never the same twice in a row).
// AWAITING KILIAN'S REVIEW: new text.
export const noRunLines: Record<Language, readonly string[]> = {
  es: [
    "Aquí dentro no hay prisa.",
    "No queremos chocarnos con nadie.",
    "Con calma. Esto es un lugar de trabajo, no una carrera.",
    "Los frascos agradecen que no corra.",
    "Dentro se camina. Fuera ya correremos.",
  ],
  en: [
    "No need to hurry in here.",
    "Let's not bump into anyone.",
    "Easy does it. This is a workplace, not a race.",
    "The flasks would thank me for not running.",
    "Walk indoors. We'll run outside.",
  ],
};
