import { AILMENTS } from "../book/ailments";
import { ailmentNames } from "../i18n/book";
import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import { getPatientDefinitions } from "./patientRegistry";
import type { Conversation } from "../dialogue/dialogueTypes";

export type DiagnosisSession = { patientId: string; stage: "choose" | "review" | "confirm" | "book" };

export const DIAGNOSIS_SYMPTOMS: Record<string, Record<Language, string>> = {
  "baker-husband": {
    es: "Frente muy caliente, escalofríos, pulso rápido, sudor y dolor de cabeza desde hace dos noches.",
    en: "Very hot forehead, chills, a quick pulse, sweating and a headache for two nights.",
  },
  "tavern-patient": {
    es: "Dolor de vientre, náuseas, pesadez y falta de apetito después de beber en exceso.",
    en: "Stomach pain, nausea, heaviness and loss of appetite after drinking too much.",
  },
  "injured-miner": {
    es: "Herida en la pierna de hace varios días, con dolor persistente, hinchazón, enrojecimiento y supuración.",
    en: "A leg wound several days old, with persistent pain, swelling, redness and discharge.",
  },
  "chapter2-woodcutter": {
    es: "Debilidad, sed y mareo tras trabajar sin pausas. Apenas ha bebido y todavía no ha comido.",
    en: "Weakness, thirst and dizziness after working without breaks. He has barely drunk and has not eaten.",
  },
  "chapter2-blacksmith": {
    es: "Herida en la mano de hace unos días. La zona está roja, hinchada y cada vez más dolorosa.",
    en: "A hand wound from a few days ago. The area is red, swollen and increasingly painful.",
  },
  // Day 3 (2026-11-12): NEW text, awaiting Kilian's review.
  "chapter3-duster": {
    es: "Un silbido al respirar y una tos seca que no cede, peor al caer la tarde. Se cansa al subir escaleras y dice que viene de un trabajo polvoriento.",
    en: "A whistle when she breathes and a dry cough that will not ease, worse as evening falls. She tires on the stairs and says it comes from dusty work.",
  },
  "chapter3-path-miner": {
    es: "Está agotado y le duele la boca al masticar. Un arañazo viejo sigue abierto y su plato es siempre el mismo.",
    en: "He is worn out and his mouth hurts when he chews. An old scratch is still open and his plate is always the same.",
  },
  "chapter3-stonecutter": {
    es: "No puede girar el antebrazo y el codo está hinchado, de otro color, con la forma cambiada. Lo sostiene con la otra mano.",
    en: "He cannot turn his forearm and the elbow is swollen, discoloured and the wrong shape. He holds it with his other hand.",
  },
  "chapter3-insomniac": {
    es: "Ojeras, mal humor por cualquier cosa y dolor de cabeza. Cabecea de día, pero asegura que de noche no logra dormir.",
    en: "Dark circles, a short temper over nothing and a headache. He nods off by day, yet swears he cannot sleep at night.",
  },
  "chapter2-farmer": {
    es: "Debilidad repentina, sudor frío, náuseas y falta de apetito. Hace poco trabajaba con normalidad.",
    en: "Sudden weakness, cold sweats, nausea and loss of appetite. Until recently he was working normally.",
  },
};

export function getDiagnosisOptions(language: Language) {
  return AILMENTS.map(ailment => ({ id: ailment.id, label: ailmentNames[ailment.id]?.[language] ?? ailment.name }));
}

export function checkDiagnosis(patientId: string, choice: string): "correct" | "retry" | "invalid" {
  const definition = getPatientDefinitions()[patientId];
  if (!definition || !DIAGNOSIS_SYMPTOMS[patientId] || !AILMENTS.some(a => a.id === choice)) return "invalid";
  const expected = definition.ailmentId === "suspected-poisoning" ? "poisoning" : definition.ailmentId;
  return choice === expected ? "correct" : "retry";
}

export function diagnosisConversation(patientId: string, language: Language, correct: boolean): Conversation {
  const definition = getPatientDefinitions()[patientId];
  const symptoms = DIAGNOSIS_SYMPTOMS[patientId][language];
  const es = language === "es";
  const thought = (text: string) => ({ speaker: "doctor", text: `(${text})` });
  if (!correct) return {
    id: `diagnosis.${patientId}.review`,
    lines: [
      thought(es ? "Esa explicación no termina de encajar. Repasemos lo que he observado." : "That explanation does not quite fit. Let me review what I observed."),
      thought(symptoms),
      thought(es ? "¿Qué dolencia reúne estos síntomas? Puedo contrastarlos con el Compendio." : "Which ailment fits these symptoms? I can compare them with the Compendium."),
    ],
  };
  const investigating = definition.investigation !== undefined;
  const name = ailmentNames[investigating ? "poisoning" : definition.ailmentId][language];
  return {
    id: `diagnosis.${patientId}.accepted`,
    lines: investigating ? [
      thought(es ? `La sospecha de ${name.toLowerCase()} encaja. Aún necesito una muestra para continuar la investigación.` : `Suspected ${name.toLowerCase()} fits. I still need a sample to continue the investigation.`),
    ] : [
      thought(es ? `Los síntomas encajan con ${name.toLowerCase()}. Dejaré el diagnóstico anotado.` : `The symptoms fit ${name.toLowerCase()}. I will record the diagnosis.`),
      { speaker: "doctor", text: es
        ? `Voy a preparar ${definition.requiredTreatments.map(t => getItemName(t.itemId, language).toLowerCase()).join(" y ")}. Hasta entonces, descanse.`
        : `I will prepare ${definition.requiredTreatments.map(t => getItemName(t.itemId, language).toLowerCase()).join(" and ")}. Rest in the meantime.` },
    ],
  };
}
