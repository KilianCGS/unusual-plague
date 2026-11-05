import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// The end of Day 1: what the Doctor says when the work is done, and the
// reflection that closes the day once he is home. All of it is the Doctor
// speaking; neither uses "subject".
const doctor = (es: string, en: string): LocalizedLine => ({
  speaker: "doctor",
  text: { es, en },
});

// The third patient was treated (whichever it was): said once, in the world,
// and then the Doctor is free to keep walking.
export const day1WorkDone: LocalizedConversation = {
  id: "chapter1.day1.workDone",
  lines: [
    doctor(
      "Creo que por hoy ha sido suficiente.",
      "I think that's enough for today.",
    ),
    doctor(
      "Debería volver a la botica.",
      "I should head back to the apothecary.",
    ),
  ],
};

// Home again: the closing of the day, over the fireplace picture.
export const day1Closing: LocalizedConversation = {
  id: "chapter1.day1.closing",
  lines: [
    doctor(
      "Tres enfermos atendidos. Ningún milagro, solo trabajo.",
      "Three patients seen to. No miracles, just work.",
    ),
    doctor(
      "La botica huele a hierbas y a humo. Casi resulta agradable.",
      "The apothecary smells of herbs and smoke. It's almost pleasant.",
    ),
    doctor(
      "Mañana habrá más gente que necesite algo.",
      "Tomorrow there will be more people who need something.",
    ),
  ],
};
