import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// The end of Day 1: what the narrative interlude says over the fireplace
// picture once the last case is done. The interlude shows no speaker, so the
// first line is the narrator's caption (second person) and the rest is the
// Doctor thinking, in the first person. One sequence, one fade.
const doctor = (es: string, en: string): LocalizedLine => ({
  speaker: "doctor",
  text: { es, en },
});

export const day1Closing: LocalizedConversation = {
  id: "chapter1.day1.closing",
  lines: [
    // The caption of the closing: the narrator, not the Doctor.
    doctor(
      "Con los pacientes atendidos, regresas a casa para descansar.",
      "With your patients cared for, you return home to rest.",
    ),
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
