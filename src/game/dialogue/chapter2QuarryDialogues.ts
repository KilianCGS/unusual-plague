import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// The quarry's first errand (2026-11-11): the miner on the bench asks for a bone
// broth and pays five coins. ALL THE TEXT BELOW IS NEW and awaits Kilian's review.
// "subject" is the miner; the character is placed by Kilian in the Decorator with the
// interaction id chapter2.quarry.miner.
const miner = (es: string, en: string): LocalizedLine => ({
  speaker: "subject",
  text: { es, en },
});
const doctor = (es: string, en: string): LocalizedLine => ({
  speaker: "doctor",
  text: { es, en },
});

const conversation = (
  id: string,
  lines: LocalizedLine[],
): LocalizedConversation => ({ id: `chapter2.quarry.miner.${id}`, lines });

// The request (while the Doctor carries no broth).
export const quarryMinerAsk = conversation("ask", [
  miner(
    "Aquí arriba el viento se cuela por las costuras de la ropa.",
    "Up here the wind gets in through the seams of your clothes.",
  ),
  miner(
    "¿Sabrías hacerme un caldo de huesos? Caliente, con algo de sal. Te lo pago.",
    "Could you make me a bone broth? Hot, with a bit of salt. I'll pay you.",
  ),
  doctor("Claro que sí, déjalo en mis manos. Veré qué puedo preparar.", "Of course, leave it with me. I'll see what I can prepare."),
]);

// The delivery.
export const quarryMinerReady = conversation("ready", [
  doctor("¡Caldo de huesos! Todavía está calentito.", "Bone broth! Still nice and hot."),
  miner(
    "Eso huele a casa. Toma: cinco monedas.",
    "That smells like home. Here: five coins.",
  ),
  doctor("No hacía falta pagar tanto, de verdad.", "You really didn't have to pay that much."),
  miner(
    "Aquí se paga el caldo, no las palabras.",
    "Here you pay for the broth, not for words.",
  ),
]);

// After it.
export const quarryMinerDone = conversation("done", [
  miner(
    "Ya no me hace falta nada. El caldo me ha durado toda la tarde.",
    "I don't need anything now. The broth lasted me the whole afternoon.",
  ),
]);
