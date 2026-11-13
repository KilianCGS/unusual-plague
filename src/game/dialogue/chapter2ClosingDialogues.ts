import type { LocalizedConversation } from "./localizedConversation";
import { doctorThought } from "./doctorThought";

export const day2Closing: LocalizedConversation = {
  id: "chapter2.day2.closing", lines: [
    { speaker: "doctor", text: {
      es: "Con los pacientes atendidos, regresas a casa y te quedas un momento frente al fuego.",
      en: "With your patients cared for, you return home and linger a moment by the fire.",
    } },
    doctorThought("He pasado el día pidiendo a otros que descansen. Esta noche sí voy a aplicarme el consejo, y con gusto.", "I've spent the day telling others to rest. Tonight I'll take my own advice, and gladly."),
    doctorThought("La muestra ha ayudado a elegir el tratamiento del agricultor. El origen del envenenamiento sigue sin estar claro, pero iremos paso a paso.", "The sample helped me choose the farmer's treatment. The source of the poisoning is still unclear, but we'll take it step by step."),
    doctorThought("Ahora, la cena. Antes de que necesite otro fuego para calentarla. Qué bien sabe el final de un día de trabajo.", "Now, supper. Before I need another fire to warm it up. How good the end of a working day tastes."),
  ],
};
