import type { LocalizedConversation } from "./localizedConversation";

// What the Doctor says to himself when Chapter 1 begins: an ordinary morning
// in which he only knows that the baker has asked him to visit her husband.
// Played once per game session by GameWorld; the tutorial starts when it ends.
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

export const chapter1Intro: LocalizedConversation = {
  id: "chapter1.intro.doctorMorning",
  lines: [
    doctor("Otro día.", "Another day."),
    doctor(
      "La ciudad parece tranquila. Últimamente eso ya es motivo suficiente para estar agradecido.",
      "The town seems quiet. Lately, that's reason enough to be grateful.",
    ),
    doctor(
      "La panadera ha pedido que pase a verla. Al parecer, su marido no se encuentra bien.",
      "The baker has asked me to stop by. Her husband, it seems, is not well.",
    ),
    doctor(
      "No parecía demasiado preocupada cuando dejó el aviso.",
      "She didn't sound too worried when she left word.",
    ),
    doctor(
      "Aunque la gente tiene una curiosa tendencia a restarle importancia a sus problemas hasta que me toca examinarlos.",
      "Then again, people have a curious habit of downplaying their troubles until I'm the one examining them.",
    ),
    doctor(
      "Será mejor que revise mis notas antes de salir.",
      "I should check my notes before I leave.",
    ),
    doctor(
      "Me llevaré un frasco vacío, por si necesito recoger alguna muestra.",
      "I'll take an empty flask, in case I need to collect a sample.",
    ),
  ],
};
