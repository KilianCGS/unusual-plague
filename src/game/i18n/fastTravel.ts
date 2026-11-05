import type { Language } from "./types";

// Fast travel to the apothecary: the action's label and the line shown over
// the black screen while the Doctor makes his way there.
export const fastTravelCopy: Record<
  Language,
  { label: string; caption: string }
> = {
  es: {
    label: "Viaje rápido a la botica",
    caption: "Te diriges a la botica precipitadamente...",
  },
  en: {
    label: "Fast travel to the apothecary",
    caption: "You make your way to the apothecary in a hurry...",
  },
};
