import type { Language } from "./types";

// Texts of the saved game on the title screen (2026-11-18). NEW TEXT, awaiting Kilian's review.
export const saveCopy: Record<Language, {
  continueButton: string;
  saveButton: string;
  title: string;
  intro: string;
  copy: string;
  copied: string;
  load: string;
  loaded: string;
  invalid: string;
  empty: string;
  placeholder: string;
  close: string;
}> = {
  es: {
    continueButton: "Continuar",
    saveButton: "Partida",
    title: "Partida guardada",
    intro: "El juego se guarda solo cada amanecer, en este navegador. Aquí puedes copiar esa partida como texto o pegar la de otro navegador.",
    copy: "Copiar partida",
    copied: "Partida copiada. Pégala donde quieras guardarla.",
    load: "Cargar texto pegado",
    loaded: "Partida cargada. Pulsa «Continuar».",
    invalid: "Ese texto no es una partida válida.",
    empty: "Aún no hay partida guardada: se guarda al empezar el día 2.",
    placeholder: "Pega aquí el texto de una partida (empieza por UP1:)",
    close: "Cerrar",
  },
  en: {
    continueButton: "Continue",
    saveButton: "Saved game",
    title: "Saved game",
    intro: "The game saves itself at every dawn, in this browser. Here you can copy that game as text or paste one from another browser.",
    copy: "Copy saved game",
    copied: "Game copied. Paste it wherever you want to keep it.",
    load: "Load pasted text",
    loaded: "Game loaded. Press \"Continue\".",
    invalid: "That text is not a valid saved game.",
    empty: "There is no saved game yet: it is saved when Day 2 begins.",
    placeholder: "Paste the text of a saved game here (it starts with UP1:)",
    close: "Close",
  },
};
