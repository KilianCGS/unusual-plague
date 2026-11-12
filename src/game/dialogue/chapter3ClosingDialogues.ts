import type { LocalizedConversation } from "./localizedConversation";
import { doctorThought } from "./doctorThought";

// The closing of Day 3 (2026-11-12). NEW text, awaiting Kilian's review.
export const day3Closing: LocalizedConversation = {
  id: "chapter3.day3.closing", lines: [
    { speaker: "doctor", text: {
      es: "Con los pacientes atendidos, vuelves a casa. Anochece antes de lo que esperabas.",
      en: "With your patients cared for, you head home. Night falls sooner than you expected.",
    } },
    doctorThought("Hoy he visto a mucha gente con la mirada baja, atenta a algo pequeño entre las manos.", "Today I saw many people with their eyes lowered, intent on something small in their hands."),
    doctorThought("Ninguno ha levantado la vista cuando he pasado. Ni siquiera para toser.", "None of them looked up as I passed. Not even to cough."),
    doctorThought("Mañana tendré que preguntar qué sostienen. O a quién.", "Tomorrow I'll have to ask what they are holding. Or who from."),
  ],
};
