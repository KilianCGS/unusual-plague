import type { LocalizedConversation } from "./localizedConversation";
import { doctorThought } from "./doctorThought";

// The closing of Day 3 (2026-11-12). NEW text, awaiting Kilian's review.
export const day3Closing: LocalizedConversation = {
  id: "chapter3.day3.closing", lines: [
    { speaker: "doctor", text: {
      es: "Con los pacientes atendidos, vuelves a casa. Anochece antes de lo que esperabas, y te metes en la cama con un libro.",
      en: "With your patients cared for, you head home. Night falls sooner than you expected, and you climb into bed with a book.",
    } },
    doctorThought("Hoy he visto a mucha gente con la mirada baja, atenta a algo pequeño entre las manos.", "Today I saw many people with their eyes lowered, intent on something small in their hands."),
    doctorThought("Ninguno ha levantado la vista cuando he pasado. Ni siquiera para toser.", "None of them looked up as I passed. Not even to cough."),
    // 2026-11-18 (Kilian's idea, wording awaiting his review): a strange noise and an odd light, from the bed.
    { speaker: "doctor", text: {
      es: "Un ruido sordo llega de lejos, como si algo grande cayera del cielo. Por la ventana pasa una luz que no es de la luna, y se apaga.",
      en: "A dull thud comes from far away, as if something big had fallen from the sky. A light that isn't the moon's passes the window, and goes out.",
    } },
    doctorThought("Algo ha cambiado de sitio. Mañana lo miraré con calma: todo se aclara.", "Something has changed place. Tomorrow I'll look at it calmly: everything becomes clear."),
  ],
};
