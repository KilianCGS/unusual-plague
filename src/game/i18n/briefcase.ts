import type { Language } from "./types";

// The Doctor's open case (2026-11-25). New text, awaiting Kilian's review.
type BriefcaseCopy = {
  title: string;
  emptySlot: string;
  hint: string;
  open: string;
  chip: string;
};

export const briefcaseCopy: Record<Language, BriefcaseCopy> = {
  es: {
    title: "Maletín",
    emptySlot: "Hueco vacío",
    hint: "Arrastra para ordenar · {key} o Esc para cerrar",
    open: "Abrir el maletín",
    chip: "Abrir maletín",
  },
  en: {
    title: "Bag",
    emptySlot: "Empty slot",
    hint: "Drag to sort · {key} or Esc to close",
    open: "Open the bag",
    chip: "Open bag",
  },
};
