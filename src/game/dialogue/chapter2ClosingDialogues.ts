import type { LocalizedConversation } from "./localizedConversation";
import { doctorThought } from "./doctorThought";

export const day2Closing: LocalizedConversation = {
  id: "chapter2.day2.closing", lines: [
    { speaker: "doctor", text: {
      es: "Con los pacientes atendidos, regresas a casa y te quedas un momento frente al fuego.",
      en: "With your patients cared for, you return home and linger a moment by the fire.",
    } },
    doctorThought("He pasado el día pidiendo a otros que descansen. Debería aplicarme el consejo.", "I've spent the day telling others to rest. I should take my own advice."),
    doctorThought("La muestra ha ayudado a elegir el tratamiento del agricultor. El origen del envenenamiento sigue sin estar claro.", "The sample helped me choose the farmer's treatment. The source of the poisoning is still unclear."),
    doctorThought("Ahora, la cena. Antes de que necesite otro fuego para calentarla.", "Now, supper. Before I need another fire to warm it up."),
  ],
};
