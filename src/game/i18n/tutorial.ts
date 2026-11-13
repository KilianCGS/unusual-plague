import type { TutorialStep } from "../tutorial/tutorialFlow";
import type { Language } from "./types";

// A piece of a hint: plain text, or a key to draw as a keycap. Keys are not
// translated.
// "key" = a fixed key (the arrows that turn pages, Esc); "action" = the key the player
// has chosen for that action; "move" = the four movement keys of slot 0 (main) or 1.
export type TutorialPart =
  | string
  | { key: string }
  | { action: "interact" | "run" | "book" | "map" | "objectives" }
  | { move: 0 | 1 };

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
      title: ["Pulsa ", { action: "book" }, " para abrir tu libro."],
      body: "El Compendio es tu herramienta más importante: lo consultarás una y otra vez para reconocer dolencias, recordar preparados y repasar a tus pacientes.",
    },
    "book-cover": {
      title: ["Haz clic en el libro para abrirlo."],
      body: "También puedes pulsar Espacio.",
    },
    "book-page": {
      title: ["Pasa de página con ", { key: "←" }, " ", { key: "→" }, "."],
      body:
      "Estás en INGREDIENTES: todo lo que puedes recoger o comprar y para qué sirve cada cosa.\nTambién puedes usar las flechas que hay junto a las páginas.",
    },
    "book-preparations": {
      title: ["Abre la pestaña PREPARADOS."],
      body: "Aquí se apuntan las recetas que vayas aprendiendo: qué mezclar, en qué estación y qué resulta.",
    },
    "book-ailments": {
      title: ["Ahora, la pestaña DOLENCIAS."],
      body: "Todas las enfermedades que conoces: sus síntomas para reconocerlas y cómo se tratan. Te hará falta para diagnosticar.",
    },
    "book-patients": {
      title: ["Y por último, PACIENTES."],
      body: "La ficha de cada persona a la que atiendas: qué le pasa, qué necesita y cómo va su tratamiento.",
    },
    "book-close": {
      title: [
        "Pulsa ",
        { action: "book" },
        " o ",
        { key: "Esc" },
        " para cerrar el libro.",
      ],
      body: "Podrás volver a abrirlo siempre que lo necesites.",
    },
    map: {
      title: ["Mantén ", { action: "map" }, " para consultar el mapa."],
      body: "Te mostrará dónde estás y te ayudará a orientarte por la ciudad.",
    },
    move: {
      title: ["Usa ", { move: 0 }, " o ", { move: 1 }, " para moverte."],
      body: "Echa un vistazo a tu habitación.",
    },
    "chest-approach": {
      title: ["Acércate al cofre."],
      body: "Es tu almacén personal, junto a la cama.",
    },
    "chest-interact": {
      title: ["Pulsa ", { action: "interact" }, " para interactuar."],
      body: "Con {interact} hablas con las personas y usas los objetos del mundo.\nPrueba con el cofre: ábrelo y toma el frasco vacío.",
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
      body: "La mesa de alquimia (izquierda) sirve para mezclar y preparar a mano; el mortero se abre desde ella.\nLa cocina (arriba a la derecha) sirve para cocer y hervir. Acércate y pulsa {interact}.",
    },
    "exit-botica": {
      title: ["Sal a la calle."],
      body: "Hay mucha ciudad por recorrer.",
    },
    run: {
      title: ["Mantén ", { action: "run" }, " mientras te mueves para correr."],
      body: "En interiores, mejor ir despacio.",
    },
  },
  en: {
    goal: {
      title: ["Explore the town and treat the patients who need it."],
      body: "That is your mission, Doctor. I will teach you the essentials along the way.",
    },
    book: {
      title: ["Press ", { action: "book" }, " to open your book."],
      body: "The Compendium is your most important tool: you will consult it again and again to recognise ailments, recall preparations and review your patients.",
    },
    "book-cover": {
      title: ["Click the book to open it."],
      body: "You can also press Space.",
    },
    "book-page": {
      title: ["Turn the page with ", { key: "←" }, " ", { key: "→" }, "."],
      body:
      "You are in INGREDIENTS: everything you can gather or buy, and what each thing is for.\nYou can also use the arrows beside the pages.",
    },
    "book-preparations": {
      title: ["Open the PREPARATIONS tab."],
      body: "Here go the recipes you learn: what to mix, at which station, and what comes out.",
    },
    "book-ailments": {
      title: ["Now, the AILMENTS tab."],
      body: "Every illness you know: its symptoms, so you can recognise it, and how it is treated. You will need it to diagnose.",
    },
    "book-patients": {
      title: ["And last, PATIENTS."],
      body: "The file of each person you treat: what is wrong, what they need and how the treatment is going.",
    },
    "book-close": {
      title: [
        "Press ",
        { action: "book" },
        " or ",
        { key: "Esc" },
        " to close the book.",
      ],
      body: "You can open it again whenever you need it.",
    },
    map: {
      title: ["Hold ", { action: "map" }, " to check the map."],
      body: "It shows where you are and helps you find your way around town.",
    },
    move: {
      title: ["Use ", { move: 0 }, " or ", { move: 1 }, " to move."],
      body: "Have a look around your room.",
    },
    "chest-approach": {
      title: ["Approach the chest."],
      body: "It is your personal storage, beside the bed.",
    },
    "chest-interact": {
      title: ["Press ", { action: "interact" }, " to interact."],
      body: "With {interact} you talk to people and use the objects of the world.\nTry it on the chest: open it and take the empty flask.",
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
      body: "The alchemy table (left) is for mixing and preparing by hand; the mortar opens from it.\nThe stove (top right) is for cooking and boiling. Step up and press {interact}.",
    },
    "exit-botica": {
      title: ["Head out to the street."],
      body: "There is a whole town to explore.",
    },
    run: {
      title: ["Hold ", { action: "run" }, " while moving to run."],
      body: "Indoors, better take it slow.",
    },
  },
};
