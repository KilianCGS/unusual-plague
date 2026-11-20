import { doctorThought } from "./doctorThought";
import type { LocalizedConversation, LocalizedLine } from "./localizedConversation";

// COLLECTIBLE NOTES (2026-11-20, Kilian): a scroll with a black ribbon lies in front of the Botica on Day 3. Picking it
// up (it has the usual pick-up aura) makes the Doctor read it: a short "reading" conversation, no item goes to the bag.
// It gives the player a place to start: the mine is shut and a stonecutter is unwell.
// A note asset declares `collectibleItemId: "note:<id>"`; GameWorld sees the prefix and reads it instead of picking it up.
// ALL THE TEXT IS NEW (ES/EN) and awaits Kilian's review.
export const NOTE_PREFIX = "note:";
export const DAY3_BOTICA_NOTE = `${NOTE_PREFIX}day3-botica`;

const reading = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });

export const NOTES: Readonly<Record<string, LocalizedConversation>> = {
  [DAY3_BOTICA_NOTE]: {
    id: "chapter3.note.botica",
    lines: [
      doctorThought("Un pergamino atado con una cinta negra, clavado donde cualquiera pasa. Lo desenrollo y leo en voz baja.", "A scroll tied with a black ribbon, left where anyone would pass. I unroll it and read under my breath."),
      reading("«Doctor: el paso a la mina está cortado por un desprendimiento. Hay un guardia en la entrada y no deja pasar a nadie.»", "\"Doctor: the way into the mine is cut off by a rockfall. A guard stands at the entrance and lets no one through.\""),
      reading("«En la cantera, un picapedrero se sostiene el brazo y no puede trabajar. Ha pedido que alguien lo vea. No se fíe de lo que dice el capataz: duele más de lo que cuenta.»", "\"At the quarry, a stonecutter is holding his arm and cannot work. He has asked for someone to see him. Don't trust what the foreman says: it hurts more than he lets on.\""),
      doctorThought("Una mina cerrada y un brazo que no se mueve. Tengo por dónde empezar: la cantera.", "A shut mine and an arm that won't move. I know where to begin: the quarry."),
    ],
  },
};

export function getNoteConversation(itemId: string): LocalizedConversation | undefined {
  return NOTES[itemId];
}
