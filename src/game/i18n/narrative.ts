import type { Language } from "./types";

type NarrativeCopy = {
  // The small hint under the text of a narrative interlude.
  continue: string;
  skip: string;
};

export const narrativeCopy: Record<Language, NarrativeCopy> = {
  es: { continue: "Espacio — Continuar", skip: "Esc — Saltar" },
  en: { continue: "Space — Continue", skip: "Esc — Skip" },
};
