import type { Language } from "./types";

type IntroScreenCopy = {
  blocks: [string, string, string];
};

export const introScreenCopy: Record<Language, IntroScreenCopy> = {
  es: {
    blocks: [
      "La peste quedó atrás hace ya algunos años.\n\nSe llevó consigo muchas vidas, pero no logró acabar con nosotros.",
      "Nuestro pequeño pueblo volvió a llenarse de voces, trabajo y días tranquilos.\n\nPoco a poco, la normalidad regresó.",
      "Yo seguí haciendo lo que siempre había hecho.\n\nCuidar de quienes me necesitaran.",
    ],
  },
  en: {
    blocks: [
      "The plague was left behind years ago.\n\nIt took many lives, but it could not bring an end to us.",
      "Our small village slowly filled again with voices, work, and peaceful days.\n\nLittle by little, normal life returned.",
      "I continued doing what I had always done.\n\nCaring for those who needed me.",
    ],
  },
};