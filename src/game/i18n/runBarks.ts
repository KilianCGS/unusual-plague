import type { Language } from "./types";

// What the Doctor mutters when he keeps running (see bark/runBarks.ts). Same
// phrases, same order, in both languages: the shuffle bag works on the INDEX.
export const runBarkLines: Record<Language, readonly string[]> = {
  es: [
    "Mi médico me recomendó ejercicio. Mi médico soy yo, y me ignoro.",
    "Caminar existe, ¿sabes? Lo inventaron hace siglos.",
    "Si es una emergencia, nadie me ha avisado. Y yo soy el que avisan.",
    "Mis rodillas han presentado una queja formal.",
    "Corro tanto que el pico de la máscara va abriendo camino.",
    "Puedes soltar la tecla. Los dos lo necesitamos.",
    "Sí, correr funciona. Lástima que la tarde no se adelante.",
    "Mantenerlo pulsado no me da más velocidad. Solo más sudor.",
    "No hay premio por llegar antes. Lo he mirado. Dos veces.",
    "Espero que sepas adónde vamos, porque yo ya perdí el hilo.",
    "La máscara no está hecha para esto. Huele a mí. Ahora mismo, mucho.",
    "Soy médico, no gacela. Que conste en el expediente.",
    "A este paso el siguiente paciente voy a ser yo, y cobro barato.",
    "Curiosa epidemia: todo el pueblo sano y yo sin aire.",
    "Insisto: caminar sigue disponible, y es gratis.",
  ],
  en: [
    "My doctor recommended exercise. My doctor is me, and I ignore him.",
    "Walking exists, you know. They invented it ages ago.",
    "If it's an emergency, nobody told me. And I'm the one they tell.",
    "My knees have filed a formal complaint.",
    "I'm running so fast the beak is clearing the way.",
    "You can let go of the key. We both need it.",
    "Yes, running works. Shame the afternoon does not speed up.",
    "Holding it down doesn't make me faster. Only sweatier.",
    "There's no prize for arriving sooner. I checked. Twice.",
    "I hope you know where we're going, because I've lost the thread.",
    "The mask isn't made for this. It smells like me. Right now, a lot.",
    "I'm a doctor, not a gazelle. Let the record show.",
    "At this rate my next patient will be me, and I charge cheap.",
    "Curious epidemic: the whole village healthy and me out of breath.",
    "I insist: walking is still available, and it's free.",
  ],
};
