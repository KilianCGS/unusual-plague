import type { Language } from "./types";

// The end of a day: what the Doctor thinks when the last patient is treated, and the sign at the
// top right. New text, awaiting Kilian's review. The Day 1 line is his own wording.
export const dayEndCopy: Record<
  Language,
  { thoughts: Record<string, string>; sign: string }
> = {
  es: {
    thoughts: {
      "chapter-1": "Creo que por hoy he hecho un buen trabajo. Debería descansar.",
      "chapter-2": "Hoy ha dado mucho de sí, y ha salido bien. Será mejor que descanse.",
      "chapter-3": "Estoy cansado, pero contento. Mañana será otro día: a descansar.",
    },
    sign: "Ve a la botica",
  },
  en: {
    thoughts: {
      "chapter-1": "I think I've done a good day's work. I should get some rest.",
      "chapter-2": "Today gave a lot, and it went well. I'd better rest.",
      "chapter-3": "I'm tired, but glad. Tomorrow is another day: time to rest.",
    },
    sign: "Go to the apothecary",
  },
};
