import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// The end of Day 1: what the narrative interlude says over the supper
// (doctor-eating) picture once the last case is done. The interlude shows no speaker, so the
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
      "Con los tres pacientes atendidos, regresas a casa para descansar. Ha sido un buen día.",
      "With all three patients cared for, you return home to rest. It has been a good day.",
    ),
    doctor(
      "Tres enfermos atendidos. Ningún milagro: solo trabajo, paciencia y buena compañía.",
      "Three patients seen to. No miracles: just work, patience and good company.",
    ),
    doctor(
      "La botica huele a hierbas y a humo. Huele a hogar.",
      "The apothecary smells of herbs and smoke. It smells like home.",
    ),
    doctor(
      "Mañana habrá más gente que me necesite. Y aquí estaré, con ganas.",
      "Tomorrow there will be more people who need me. And I'll be here, glad to help.",
    ),
  ],
};
