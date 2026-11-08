import type { LocalizedConversation } from "./localizedConversation";

// DAY 2 OPENING: the farm woman who waits for the Doctor outside the Botica.
//
// Approved by Kilian on 2026-11-08. Subject resolves to her placed instance.
// No diagnosis, cause, kinship, recipe or treatment is established here.
const woman = (es: string, en: string) => ({
  speaker: "subject",
  text: { es, en },
});
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

export const messengerOpening: LocalizedConversation = {
  id: "chapter2.opening.farmWoman",
  lines: [
    woman(
      "Doctor. Menos mal que lo encuentro.",
      "Doctor. Thank goodness I found you.",
    ),
    doctor(
      "Buenos días. ¿Qué ocurre?",
      "Good morning. What's the matter?",
    ),
    woman(
      "Vengo del molino. El agricultor está muy mal.",
      "I've come from the mill. The farmer's in a bad way.",
    ),
    doctor("¿Qué le ha notado?", "What have you noticed?"),
    woman(
      "Esta mañana no ha querido ni el pan. No es propio de él.",
      "He wouldn't even touch his bread this morning. That's not like him.",
    ),
    doctor(
      "Será mejor que lo examine. ¿Dónde está?",
      "I'd better examine him. Where is he?",
    ),
    woman(
      "En el granero. Lo hemos tumbado allí.",
      "In the granary. We've laid him down in there.",
    ),
    doctor("Iré a verlo.", "I'll go and see him."),
    woman(
      "Gracias, Doctor. Le esperamos.",
      "Thank you, Doctor. We'll be waiting.",
    ),
  ],
};
