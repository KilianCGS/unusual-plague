import type { Language } from "./types";

type TitleScreenCopy = {
  title: string;
  subtitle: string;
  beginButton: string;
  aboutButton: string;
  languageSelectorLabel: string;
  aboutPanel: {
    title: string;
    paragraphs: [string, string, string, string, string];
    closeButton: string;
  };
};

export const titleScreenCopy: Record<Language, TitleScreenCopy> = {
  es: {
    title: "UNUSUAL PLAGUE",
    subtitle: "Algo extraño se acerca.",
    beginButton: "EMPEZAR",
    aboutButton: "SOBRE EL JUEGO",
    languageSelectorLabel: "Selector de idioma",
    aboutPanel: {
      title: "ACERCA DE UNUSUAL PLAGUE",
      paragraphs: [
        "Unusual Plague es una breve aventura narrativa sobre la tecnología, la atención y la forma en que nuestra relación con las herramientas puede cambiarnos.",
        "Eres un médico de la peste en una ciudad medieval donde empiezan a aparecer dolencias extrañas. Durante cuatro días recorrerás sus calles, hablarás con sus vecinos y tratarás a los pacientes que lo necesiten.",
        "Tu herramienta principal es el Compendio, un libro donde consultas dolencias, ingredientes y preparados. Recoge hierbas, compra lo que te falte y combina los ingredientes en tu botica para preparar el remedio justo.",
        "Creado por Kilian García Santana.",
        "Desarrollado con Next.js, React y TypeScript mediante un flujo de trabajo asistido por IA.",
      ],
      closeButton: "CERRAR",
    },
  },
  en: {
    title: "UNUSUAL PLAGUE",
    subtitle: "Something strange is coming.",
    beginButton: "BEGIN",
    aboutButton: "ABOUT THE GAME",
    languageSelectorLabel: "Language selector",
    aboutPanel: {
      title: "ABOUT UNUSUAL PLAGUE",
      paragraphs: [
        "Unusual Plague is a short narrative adventure about technology, attention and the way our relationship with tools can change us.",
        "You are a plague doctor in a medieval town where strange ailments are beginning to appear. Over four days you will wander its streets, talk with its people and treat the patients who need it.",
        "Your main tool is the Compendium, a book where you look up ailments, ingredients and preparations. Gather herbs, buy what you lack and combine the ingredients in your apothecary to prepare the right remedy.",
        "Created by Kilian García Santana.",
        "Built with Next.js, React and TypeScript using an AI-assisted development workflow.",
      ],
      closeButton: "CLOSE",
    },
  },
};