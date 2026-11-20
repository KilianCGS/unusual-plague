import type { Language } from "./types";

type TitleScreenCopy = {
  title: string;
  subtitle: string;
  beginButton: string;
  aboutButton: string;
  languageSelectorLabel: string;
  aboutPanel: {
    title: string;
    paragraphs: [string, string, string, string];
    // 2026-11-20: credits and licences (NEW TEXT, awaiting Kilian's review; the audio line is to be completed)
    creditsTitle: string;
    credits: string[];
    closeButton: string;
  };
};

export const titleScreenCopy: Record<Language, TitleScreenCopy> = {
  es: {
    title: "UNUSUAL PLAGUE",
    subtitle: "Algo extraño se acerca.",
    beginButton: "Empezar",
    aboutButton: "Sobre el juego",
    languageSelectorLabel: "Selector de idioma",
    aboutPanel: {
      title: "Acerca de Unusual Plague",
      paragraphs: [
        "Eres un médico de la peste en una ciudad medieval donde empiezan a aparecer dolencias extrañas. Durante cuatro días recorrerás sus calles, hablarás con sus vecinos y tratarás a los pacientes que lo necesiten.",
        "Tu herramienta principal es el Compendio, un libro donde consultas dolencias, ingredientes y preparados. Recoge hierbas, compra lo que te falte y combina los ingredientes en tu botica para preparar el remedio justo.",
        "Creado por Kilian García Santana.",
        "Desarrollado con Next.js, React y TypeScript mediante un flujo de trabajo asistido por IA.",
      ],
      creditsTitle: "Créditos y licencias",
      credits: [
        "Diseño, guion, dirección de arte y colocación de escenas: Kilian García Santana. Código, arte, música, sonidos y textos: todos los derechos reservados, salvo lo que se indique en el repositorio.",
        "Arte generado con ayuda de herramientas de IA (PixelLab y ChatGPT) y retocado por el autor. Música del final: Sonata n.º 14 «Claro de luna» (1.er movimiento) de Beethoven, interpretada por Paul Pitman para Musopen (dominio público, musopen.org). [Resto de música y sonidos: pendiente de completar.]",
        "Tipografías abiertas (licencia SIL OFL): Almendra, MedievalSharp, Metamorphous, IM Fell DW Pica, Grenze Gotisch y Patrick Hand. Construido con Next.js y React (licencia MIT).",
      ],
      closeButton: "Cerrar",
    },
  },
  en: {
    title: "UNUSUAL PLAGUE",
    subtitle: "Something strange is coming.",
    beginButton: "Begin",
    aboutButton: "About the game",
    languageSelectorLabel: "Language selector",
    aboutPanel: {
      title: "About Unusual Plague",
      paragraphs: [
        "You are a plague doctor in a medieval town where strange ailments are beginning to appear. Over four days you will wander its streets, talk with its people and treat the patients who need it.",
        "Your main tool is the Compendium, a book where you look up ailments, ingredients and preparations. Gather herbs, buy what you lack and combine the ingredients in your apothecary to prepare the right remedy.",
        "Created by Kilian García Santana.",
        "Built with Next.js, React and TypeScript using an AI-assisted development workflow.",
      ],
      creditsTitle: "Credits and licences",
      credits: [
        "Design, script, art direction and scene placement: Kilian García Santana. Code, art, music, sounds and texts: all rights reserved, except where the repository says otherwise.",
        "Art generated with the help of AI tools (PixelLab and ChatGPT) and retouched by the author. Final music: Piano Sonata No. 14 \"Moonlight\" (1st movement) by Beethoven, performed by Paul Pitman for Musopen (public domain, musopen.org). [Other music and sounds: to be completed.]",
        "Open typefaces (SIL OFL licence): Almendra, MedievalSharp, Metamorphous, IM Fell DW Pica, Grenze Gotisch and Patrick Hand. Built with Next.js and React (MIT licence).",
      ],
      closeButton: "Close",
    },
  },
};