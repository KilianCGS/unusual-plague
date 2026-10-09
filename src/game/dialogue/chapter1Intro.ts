import type { LocalizedConversation } from "./localizedConversation";

// What the Doctor says to himself when Chapter 1 begins: an ordinary morning
// in an established routine, with a dry hint that it will not stay that way.
// Played once per game session by GameWorld; the tutorial starts when it ends.
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

export const chapter1Intro: LocalizedConversation = {
  id: "chapter1.intro.doctorMorning",
  lines: [
    doctor("Otra mañana.", "Another morning."),
    doctor(
      "La ciudad parece tranquila. Últimamente eso ya es motivo suficiente para estar agradecido.",
      "The town seems quiet. Lately, that's reason enough to be grateful.",
    ),
    doctor(
      "Tres pacientes esperan hoy. Nada fuera de lo habitual, por lo que parece.",
      "Three patients are waiting today. Nothing out of the ordinary, by the sound of it.",
    ),
    doctor(
      "Una visita en la panadería, un enfermo en la taberna... y un minero que necesita que le eche un vistazo.",
      "A visit to the bakery, a sick man at the tavern... and a miner who needs me to take a look at him.",
    ),
    doctor("Podría haber sido peor.", "It could have been worse."),
    doctor(
      "Aunque llevo suficiente tiempo haciendo esto como para saber que decir eso suele ser una mala idea.",
      "Though I've been doing this long enough to know that saying that is usually a bad idea.",
    ),
    doctor(
      "Será mejor que revise mis notas antes de salir.",
      "I should check my notes before I leave.",
    ),
  ],
};
