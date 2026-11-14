import type { Language } from "./types";

type IntroScreenCopy = {
  blocks: [string, string, string];
};

export const introScreenCopy: Record<Language, IntroScreenCopy> = {
  es: {
    blocks: [
      "La peste quedó atrás hace ya algunos años.\n\nSe llevó consigo muchas vidas, pero no logró acabar con nosotros. Todavía quedan sus huellas: cruces borradas en las puertas, campanas que nadie se atreve a tocar y una máscara de pico que sigo llevando por costumbre.",
      "Nuestro pequeño pueblo volvió a llenarse de voces, de pan caliente y de mercado los domingos.\n\nAprendimos a reír otra vez, casi con prisa, como quien teme que se lo quiten. Poco a poco, la normalidad regresó.",
      "Yo seguí haciendo lo que siempre había hecho: hierbas, frascos y paciencia.\n\nHasta esta mañana. Alguien ha llamado a la botica antes de que saliera el sol, y no era un enfermo cualquiera. Era alguien que sabe lo que pasa cuando algo no encaja.",
    ],
  },
  en: {
    blocks: [
      "The plague was left behind some years ago.\n\nIt took many lives, but it could not bring an end to us. Its marks remain: faded crosses on the doors, bells nobody dares to ring, and a beaked mask I still wear out of habit.",
      "Our small village slowly filled again with voices, warm bread, and market days on Sundays.\n\nWe learned to laugh again, almost in a hurry, like people afraid it might be taken from them. Little by little, normal life returned.",
      "I carried on doing what I had always done: herbs, jars, and patience.\n\nUntil this morning. Someone knocked at the apothecary before sunrise, and it was no ordinary patient. It was someone who knows what happens when something does not fit.",
    ],
  },
};
