import type { TutorialStep } from "../tutorial/tutorialFlow";
import type { Language } from "./types";

// A piece of a hint: plain text, or a key to draw as a keycap. Keys are not
// translated.
export type TutorialPart = string | { key: string };

export type TutorialHintCopy = {
  title: TutorialPart[];
  // Lines are separated by a newline (each one is drawn as its own paragraph).
  body: string;
};

// The label of the button / key of the steps that wait for an acknowledgement.
export const tutorialContinueCopy: Record<Language, { label: string; key: string }> = {
  es: { label: "Entendido", key: "Enter" },
  en: { label: "Got it", key: "Enter" },
};

export type TutorialHintStep = Exclude<TutorialStep, "intro" | "done">;

export const tutorialCopy: Record<
  Language,
  Record<TutorialHintStep, TutorialHintCopy>
> = {
  es: {
    goal: {
      title: ["Explora la ciudad y trata a los pacientes que lo necesiten."],
      body: "Esa es tu misión, Doctor. Te enseñaré lo imprescindible por el camino.",
    },
    book: {
      title: ["Pulsa ", { key: "Q" }, " para abrir tu libro."],
      body: "El Compendio es tu herramienta más importante: lo consultarás una y otra vez para reconocer dolencias, recordar preparados y repasar a tus pacientes.",
    },
    "book-cover": {
      title: ["Haz clic en el libro para abrirlo."],
      body: "También puedes pulsar Espacio.",
    },
    "book-page": {
      title: ["Pasa de página con ", { key: "←" }, " ", { key: "→" }, "."],
      body: "También puedes usar las flechas que hay junto a las páginas.",
    },
    "book-tab": {
      title: ["Elige otra sección del libro."],
      body: "Haz clic en una pestaña: pacientes, dolencias, ingredientes o preparados.",
    },
    "book-close": {
      title: [
        "Pulsa ",
        { key: "Q" },
        " o ",
        { key: "Esc" },
        " para cerrar el libro.",
      ],
      body: "Podrás volver a abrirlo siempre que lo necesites.",
    },
    map: {
      title: ["Mantén ", { key: "TAB" }, " para consultar el mapa."],
      body: "Te mostrará dónde estás y te ayudará a orientarte por la ciudad.",
    },
    move: {
      title: ["Usa ", { key: "WASD" }, " o las flechas para moverte."],
      body: "Echa un vistazo a tu habitación.",
    },
    "chest-approach": {
      title: ["Acércate al cofre."],
      body: "Es tu almacén personal, junto a la cama.",
    },
    "chest-interact": {
      title: ["Pulsa ", { key: "E" }, " para interactuar."],
      body: "Con E hablas con las personas y usas los objetos del mundo.\nPrueba con el cofre: ábrelo y toma el frasco vacío.",
    },
    "take-flask": {
      title: ["Selecciona el frasco vacío para llevarlo contigo."],
      body: "Lo necesitarás para recoger muestras.",
    },
    bar: {
      title: ["Tu inventario y tu dinero."],
      body: "La barra de abajo es lo que llevas encima: tiene pocas casillas, así que elige bien.\nLas monedas, abajo a la derecha, sirven para comprar ingredientes a los comerciantes.",
    },
    "exit-room": {
      title: ["Baja a la botica."],
      body: "Sal de tu habitación por la puerta.",
    },
    botica: {
      title: ["Dos lugares para preparar remedios."],
      body: "La mesa de alquimia (izquierda) sirve para mezclar y preparar a mano; el mortero se abre desde ella.\nLa cocina (arriba a la derecha) sirve para cocer y hervir. Acércate y pulsa E.",
    },
    "exit-botica": {
      title: ["Sal a la calle."],
      body: "Hay mucha ciudad por recorrer.",
    },
    run: {
      title: ["Mantén ", { key: "ESPACIO" }, " mientras te mueves para correr."],
      body: "En interiores, mejor ir despacio.",
    },
  },
  en: {
    goal: {
      title: ["Explore the town and treat the patients who need it."],
      body: "That is your mission, Doctor. I will teach you the essentials along the way.",
    },
    book: {
      title: ["Press ", { key: "Q" }, " to open your book."],
      body: "The Compendium is your most important tool: you will consult it again and again to recognise ailments, recall preparations and review your patients.",
    },
    "book-cover": {
      title: ["Click the book to open it."],
      body: "You can also press Space.",
    },
    "book-page": {
      title: ["Turn the page with ", { key: "←" }, " ", { key: "→" }, "."],
      body: "You can also use the arrows beside the pages.",
    },
    "book-tab": {
      title: ["Choose another section of the book."],
      body: "Click a tab: patients, ailments, ingredients or preparations.",
    },
    "book-close": {
      title: [
        "Press ",
        { key: "Q" },
        " or ",
        { key: "Esc" },
        " to close the book.",
      ],
      body: "You can open it again whenever you need it.",
    },
    map: {
      title: ["Hold ", { key: "TAB" }, " to check the map."],
      body: "It shows where you are and helps you find your way around town.",
    },
    move: {
      title: ["Use ", { key: "WASD" }, " or the arrow keys to move."],
      body: "Have a look around your room.",
    },
    "chest-approach": {
      title: ["Approach the chest."],
      body: "It is your personal storage, beside the bed.",
    },
    "chest-interact": {
      title: ["Press ", { key: "E" }, " to interact."],
      body: "With E you talk to people and use the objects of the world.\nTry it on the chest: open it and take the empty flask.",
    },
    "take-flask": {
      title: ["Select the empty flask to carry it with you."],
      body: "You will need it to collect samples.",
    },
    bar: {
      title: ["Your inventory and your money."],
      body: "The bar below is what you carry: it has few slots, so choose wisely.\nThe coins, bottom right, are for buying ingredients from the merchants.",
    },
    "exit-room": {
      title: ["Go down to the apothecary."],
      body: "Leave your room through the door.",
    },
    botica: {
      title: ["Two places to prepare remedies."],
      body: "The alchemy table (left) is for mixing and preparing by hand; the mortar opens from it.\nThe stove (top right) is for cooking and boiling. Step up and press E.",
    },
    "exit-botica": {
      title: ["Head out to the street."],
      body: "There is a whole town to explore.",
    },
    run: {
      title: ["Hold ", { key: "SPACE" }, " while moving to run."],
      body: "Indoors, better take it slow.",
    },
  },
};
