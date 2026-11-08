import type { Language } from "../i18n/types";
import { addItem } from "../inventory/inventory";
import { getItemName } from "../items/items";
import { getChapter2PatientDefinitions } from "../patients/farmerInvestigation";
import { getActiveMissingIngredients } from "../patients/patientNeeds";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { localizeConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// Supplies for known, untreated Day 2 needs. No Day 1 reward flags, placements
// or case-order requirements. Further supplies are possible only if needed.
export const CHAPTER2_SUPPLIES: Readonly<Record<string, readonly string[]>> = {
  "chapter2.farm.woman": ["orange", "mint", "medicinal-herb", "animal-fat"],
  "chapter2.bakery.baker": ["flour", "honey"],
  "chapter2.mill.neighbour": ["resin", "cloth"],
  "chapter2.mine.recoveringMiner": ["coal"],
};

export function resolveChapter2Supplies(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const provides = CHAPTER2_SUPPLIES[interactionId];
  if (!provides) return null;
  const needs = getActiveMissingIngredients(facts.patients, getChapter2PatientDefinitions(facts.claimedRewards), facts.inventory)
    .filter(need => provides.includes(need.itemId));
  if (!needs.length) return null;
  let carried = facts.inventory;
  for (const need of needs) {
    const next = addItem(carried, need.itemId, need.quantity);
    if (!next) {
      return {
        conversation: localizeConversation({ id: `${interactionId}.supplies.noRoom`, lines: [
          { speaker: "subject", text: { es: "Tengo lo que busca, pero no va a poder llevarlo todo así.", en: "I have what you're looking for, but you won't be able to carry it all like that." } },
          { speaker: "doctor", text: { es: "Haré sitio y volveré. Guárdemelo, por favor.", en: "I'll make room and return. Please keep it for me." } },
        ] }, language, subjectId), effects: [],
      };
    }
    carried = next;
  }
  const list = (lang: Language) => needs.map(n => `${getItemName(n.itemId, lang)} ×${n.quantity}`).join(", ");
  return {
    conversation: localizeConversation({ id: `${interactionId}.supplies`, lines: [
      ...chapter2AmbientDialogues[interactionId].lines,
      { speaker: "doctor", text: { es: `Para atender a mis pacientes necesito: ${list("es")}.`, en: `To care for my patients, I need: ${list("en")}.` } },
      { speaker: "subject", text: { es: "Lléveselo. Si puede servir para ayudarlos, mejor que dejarlo guardado.", en: "Take it. If it can help them, that's better than leaving it stored away." } },
      { speaker: "doctor", text: { es: "Gracias. Llevo anotado lo que hace falta; no pediré más de lo necesario.", en: "Thank you. I've noted what's needed; I won't ask for more than necessary." } },
    ] }, language, subjectId),
    effects: needs.map(need => ({ type: "give-item", itemId: need.itemId, quantity: need.quantity })),
  };
}
