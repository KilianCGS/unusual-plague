import type { Language } from "../i18n/types";
import type { LocalizedConversation } from "./localizedConversation";
import { doctorThought } from "./doctorThought";

export const farmerAnalysisLabel: Record<Language, string> = {
  es: "Analizar muestra del agricultor", en: "Analyze the farmer's sample",
};
export const farmerAnalysisResult: LocalizedConversation = {
  id: "chapter2.farmer.analysis", lines: [
    { speaker: "doctor", text: { es: "He terminado de examinar la muestra y contrastarla con mis notas. Todo apunta a un envenenamiento.", en: "I've finished examining the sample and comparing it with my notes. Everything points to poisoning." } },
    { speaker: "doctor", text: { es: "Prepararé una suspensión de carbón y una infusión medicinal. La muestra no me dice quién o qué lo provocó.", en: "I'll prepare a charcoal suspension and a medicinal infusion. The sample doesn't tell me who or what caused it." } },
    { speaker: "doctor", text: { es: "El minero puede facilitarme carbón; en la granja encontraré hierbas. Dejaré las preparaciones anotadas en el Compendio.", en: "The miner can supply charcoal; I'll find herbs at the farm. I'll record the preparations in the Compendium." } },
  ].map(line => doctorThought(line.text.es, line.text.en)),
};
