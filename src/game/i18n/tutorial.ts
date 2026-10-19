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
    "book-page": {
      title: ["Pasa de página con ", { key: "←" }, " ", { key: "→" }, "."],
      body: "Si el libro sigue cerrado, haz clic en la portada o pulsa Espacio. También puedes usar las flechas junto a las páginas.",
    },
    "book-tab": {
      title: ["Elige otra sección del libro."],
      body: "Haz clic en una de las pestañas: pacientes, dolencias, ingredientes o preparados.",
    },
    "book-close": {
      title: [
        "Pulsa ",
        { key: "Q" },
        " o ",
        { key: "Esc" },
        " para cerrar el libro.",
      ],
      body: "Podrás volver a consultarlo cuando quieras.",
    },
    map: {
      title: ["Mantén ", { key: "TAB" }, " para consultar el mapa."],
      body: "Aquí podrás comprobar dónde te encuentras y orientarte por la ciudad.",
    },
    move: {
      title: ["Usa ", { key: "WASD" }, " o las flechas para moverte."],
      body: "Recorre tu habitación.",
    },
    "chest-approach": {
      title: ["Acércate al cofre."],
      body: "Es tu almacén personal, junto a la cama.",
    },
    "chest-interact": {
      title: ["Pulsa ", { key: "E" }, " para interactuar."],
      body: "Ábrelo y toma el frasco vacío.",
    },
    "take-flask": {
      title: ["Selecciona el frasco vacío para guardarlo en tu inventario."],
      body: "Lo necesitarás para recoger muestras.",
    },
  },
  en: {
    book: {
      title: ["Press ", { key: "Q" }, " to open your book."],
      body: "Here you can consult information about your patients, ailments, ingredients and preparations.",
    },
    "book-page": {
      title: ["Turn the page with ", { key: "←" }, " ", { key: "→" }, "."],
      body: "If the book is still closed, click its cover or press Space. You can also use the arrows beside the pages.",
    },
    "book-tab": {
      title: ["Choose another section of the book."],
      body: "Click one of the tabs: patients, ailments, ingredients or preparations.",
    },
    "book-close": {
      title: [
        "Press ",
        { key: "Q" },
        " or ",
        { key: "Esc" },
        " to close the book.",
      ],
      body: "You can consult it again whenever you like.",
    },
    map: {
      title: ["Hold ", { key: "TAB" }, " to check your map."],
      body: "Here you can see where you are and find your way around town.",
    },
    move: {
      title: ["Use ", { key: "WASD" }, " or the arrow keys to move."],
      body: "Look around your room.",
    },
    "chest-approach": {
      title: ["Approach the chest."],
      body: "It is your personal storage, beside the bed.",
    },
    "chest-interact": {
      title: ["Press ", { key: "E" }, " to interact."],
      body: "Open it and take the empty flask.",
    },
    "take-flask": {
      title: ["Select the empty flask to move it to your inventory."],
      body: "You will need it to collect samples.",
    },
  },
};
