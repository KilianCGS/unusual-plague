import type { Language } from "./types";

type TitleScreenCopy = {
  title: string;
  subtitle: string;
  beginButton: string;
  aboutButton: string;
  languageSelectorLabel: string;
  aboutPanel: {
    title: string;
    paragraphs: [string, string, string];
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
        "Created by Kilian García Santana.",
        "Built with Next.js, React and TypeScript using an AI-assisted development workflow.",
      ],
      closeButton: "CLOSE",
    },
  },
};