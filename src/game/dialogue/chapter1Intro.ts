import type { LocalizedConversation } from "./localizedConversation";

// What the Doctor says to himself when Chapter 1 begins: an ordinary morning
// in an established routine (nothing about the plague, no controls, no
// exposition). Played once per game session by GameWorld.
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

export const chapter1Intro: LocalizedConversation = {
  id: "chapter1.intro.doctorMorning",
  lines: [
    doctor("Otra mañana.", "Another morning."),
    doctor(
      "Tres pacientes esperan hoy. Será mejor no hacerles esperar más de la cuenta.",
      "Three patients are waiting today. Better not keep them waiting longer than necessary.",
    ),
    doctor(
      "Primero debería revisar mis notas.",
      "I should check my notes first.",
    ),
  ],
};
