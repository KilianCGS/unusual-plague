import type { TutorialStep } from "../tutorial/tutorialFlow";
import type { Language } from "./types";

// A piece of a hint: plain text, or a key to draw as a keycap. Keys are not
// translated.
export type TutorialPart = string | { key: string };

export type TutorialHintCopy = {
  title: TutorialPart[];
  body: string;
};

export type TutorialHintStep = Exclude<TutorialStep, "intro" | "done">;

export const tutorialCopy: Record<
  Language,
  Record<TutorialHintStep, TutorialHintCopy>
> = {
  es: {
    book: {
      title: ["Pulsa ", { key: "Q" }, " para abrir el libro."],
      body: "Aquí podrás consultar información sobre tus pacientes, dolencias, ingredientes y preparados.",
    },
    map: {
      title: ["Mantén ", { key: "TAB" }, " para consultar el mapa."],
      body: "Aquí podrás comprobar dónde te encuentras y orientarte por la ciudad.",
    },
    move: {
      title: ["Usa ", { key: "WASD" }, " o las flechas para moverte."],
      body: "Explora la ciudad y visita a tus pacientes.",
    },
    interact: {
      title: ["Pulsa ", { key: "E" }, " para interactuar."],
      body: "Habla con los habitantes y examina aquello que pueda resultar de interés.",
    },
  },
  en: {
    book: {
      title: ["Press ", { key: "Q" }, " to open your book."],
      body: "Here you can consult information about your patients, ailments, ingredients and preparations.",
    },
    map: {
      title: ["Hold ", { key: "TAB" }, " to check your map."],
      body: "Here you can see where you are and find your way around town.",
    },
    move: {
      title: ["Use ", { key: "WASD" }, " or the arrow keys to move."],
      body: "Explore the town and visit your patients.",
    },
    interact: {
      title: ["Press ", { key: "E" }, " to interact."],
      body: "Talk to the townsfolk and examine anything that may be of interest.",
    },
  },
};
