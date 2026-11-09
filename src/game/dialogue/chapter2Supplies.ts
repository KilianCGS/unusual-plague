import type { Language } from "../i18n/types";
import { addItem } from "../inventory/inventory";
import { getItemName } from "../items/items";
import { getChapter2PatientDefinitions } from "../patients/farmerInvestigation";
import { getActiveMissingIngredients } from "../patients/patientNeeds";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { doctorThought as thought } from "./doctorThought";
import { localizeConversation, type LocalizedLine } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// Supplies for known, untreated Day 2 needs. No Day 1 reward flags, placements
// or case-order requirements. Further supplies are possible only if needed.
export const CHAPTER2_SUPPLIES: Readonly<Record<string, readonly string[]>> = {
  // Where the rest of Day 2's materials come from (Kilian, 2026-11-09):
  //   orange, cloth  -> left over from Day 1 (farm woman needs ONE orange, the
  //                     merchant hands over two scraps of cloth);
  //   medicinal herb -> picked in the forest and/or left over from Day 1
  //                     (surplus is welcome: it gives the chest a use);
  //   mint           -> picked in the forest cottage (placed by Kilian);
  //   flour          -> the baker's sack (see resolveFlourSack);
  //   honey          -> the beekeeper again (see resolveBeekeeperHoney);
  //   animal fat     -> the woodcutter's thank-you gift.
  "chapter2.mill.neighbour": ["resin"],
  "chapter2.mine.recoveringMiner": ["coal"],
};

export const FLOUR_SACK_INTERACTION_ID = "chapter2.bakery.flourSack";
export const BEEKEEPER_INTERACTION_ID = "chapter2.mill.beekeeper";
// Where the "!" over the baker's sack is drawn (the top of the rectangle Kilian
// painted for it: x227 y84 12x10 in bakery-interior; centred, bottom edge).
export const FLOUR_SACK_MARK = { sceneId: "bakery-interior", x: 233, y: 94 } as const;
// Claimed when the baker has told the Doctor he may take flour from her sack.
export const FLOUR_OFFERED_ID = "chapter2.bakery.flourOffered";

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

// The baker's flour sack (an environment zone painted by Kilian). The Doctor
// only helps himself after the baker has said so, and only while the known
// Day 2 cases still lack flour.
export function resolveFlourSack(
  facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome {
  const local = (lines: LocalizedLine[], id: string) =>
    localizeConversation({ id: `${FLOUR_SACK_INTERACTION_ID}.${id}`, lines }, language, subjectId);
  if (!facts.claimedRewards?.has(FLOUR_OFFERED_ID)) {
    return { conversation: local([thought("Un saco de harina. Mejor preguntar a la panadera antes de servirme.", "A sack of flour. I'd better ask the baker before helping myself.")], "ask"), effects: [] };
  }
  const need = missingNeed(facts.patients, facts.claimedRewards, facts.inventory, "flour");
  if (!need) {
    return { conversation: local([thought("Ahora mismo no necesito harina.", "I don't need any flour right now.")], "none"), effects: [] };
  }
  if (!addItem(facts.inventory, "flour", need.quantity)) {
    return { conversation: local([thought("No puedo llevar más cosas. Haré sitio y volveré al saco.", "I can't carry anything else. I'll make room and come back to the sack.")], "noRoom"), effects: [] };
  }
  return {
    conversation: local([
      thought("La panadera dijo que podía. Cojo la harina necesaria.", "The baker said I could. I'll take the flour I need."),
    ], "take"),
    effects: [{ type: "give-item", itemId: "flour", quantity: need.quantity }],
  };
}

function missingNeed(
  patients: StoryFacts["patients"], claimed: ReadonlySet<string> | undefined, inventory: StoryFacts["inventory"], itemId: string,
) {
  return getActiveMissingIngredients(patients, getChapter2PatientDefinitions(claimed), inventory)
    .find(n => n.itemId === itemId);
}

// The "!" over the sack shows while the baker has allowed it and flour is
// still missing for a known case.
export function shouldMarkFlourSack(
  patients: StoryFacts["patients"], claimed: ReadonlySet<string>, inventory: StoryFacts["inventory"],
): boolean {
  return claimed.has(FLOUR_OFFERED_ID) && missingNeed(patients, claimed, inventory, "flour") !== undefined;
}

// The beekeeper again (Day 1 gave him a one-time reward; this is a separate
// supply while honey is needed): honey with a wink at his sweet tooth.
export function resolveBeekeeperHoney(
  facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome {
  const local = (lines: LocalizedLine[], id: string) =>
    localizeConversation({ id: `${BEEKEEPER_INTERACTION_ID}.${id}`, lines }, language, subjectId);
  const npc = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
  const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
  const need = missingNeed(facts.patients, facts.claimedRewards, facts.inventory, "honey");
  if (!need) {
    return { conversation: local([
      npc("Hoy no le pido nada, Doctor, y usted a mí tampoco. Las abejas lo agradecen.", "I'm not asking you for anything today, Doctor, and you're not asking me. The bees appreciate it."),
    ], "none"), effects: [] };
  }
  if (!addItem(facts.inventory, "honey", need.quantity)) {
    return { conversation: local([
      npc("Tengo la miel, pero lleva usted las manos llenas. Haga sitio y vuelva.", "I have the honey, but your hands are full. Make some room and come back."),
    ], "noRoom"), effects: [] };
  }
  return {
    conversation: local([
      doctor("¿Le queda algo de miel?", "Would you have any honey left?"),
      npc("Siempre me pide miel para curar a alguien. Con usted, nunca sé si es medicina o capricho.", "You always ask me for honey to cure somebody. With you I never know whether it's medicine or a craving."),
      doctor("Es para una cataplasma. Tiene mi palabra de que no la pruebo.", "It's for a poultice. You have my word I won't taste it."),
      npc("Eso mismo diría un goloso. Tome, y deje un poco en el frasco.", "That's exactly what a sweet tooth would say. Here, and leave a little in the jar."),
    ], "give"),
    effects: [{ type: "give-item", itemId: "honey", quantity: need.quantity }],
  };
}
