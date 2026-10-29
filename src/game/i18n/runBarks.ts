import type { Language } from "./types";

// What the Doctor mutters when he keeps running (see bark/runBarks.ts). Same
// phrases, same order, in both languages: the shuffle bag works on the INDEX.
export const runBarkLines: Record<Language, readonly string[]> = {
  es: [
    "Creo que hoy ya he hecho bastante ejercicio.",
    "Podríamos caminar. Es una posibilidad.",
    "No tengo tanta prisa.",
    "Mis rodillas agradecerían cierta moderación.",
    "Empiezo a sospechar que llegamos tarde a algún sitio.",
    "Puedes relajar el dedo del espacio también.",
    "Sí, funciona. Ya lo hemos comprobado.",
    "Mantenerlo pulsado no hace que corra más.",
    "No hay premio por llegar antes.",
    "Espero que al menos sepas adónde vamos.",
    "La máscara no fue diseñada para esto.",
    "Soy médico. No atleta.",
    "A este ritmo voy a necesitar tratarme yo.",
    "Curiosa epidemia esta de correr a todas partes.",
    "Insisto: caminar sigue disponible.",
  ],
  en: [
    "I believe I've had quite enough exercise for today.",
    "We could walk. It is a possibility.",
    "I'm not in that much of a hurry.",
    "My knees would appreciate a little moderation.",
    "I'm beginning to suspect we're late for something.",
    "You can relax your finger off the space bar too.",
    "Yes, it works. We've already established that.",
    "Holding it down doesn't make me run any faster.",
    "There's no prize for arriving sooner.",
    "I do hope you at least know where we're going.",
    "The mask was not designed for this.",
    "I'm a doctor. Not an athlete.",
    "At this rate I'll need treating myself.",
    "Curious epidemic, this running everywhere.",
    "I insist: walking is still available.",
  ],
};
