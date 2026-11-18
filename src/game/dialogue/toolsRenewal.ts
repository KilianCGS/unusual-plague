import type { Language } from "../i18n/types";
import { CHAPTER3_PATIENTS } from "../patients/chapter3Patients";
import { DAY2_COMPLETED_ID } from "../patients/day2";
import { getPatientStatus } from "../patients/patientCases";
import { localizeConversation, type LocalizedConversation, type LocalizedLine } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// RENEWING THE DOCTOR'S TOOLS (2026-11-18, Kilian): a narrative way to spend what is left over. On Day 3, when the
// Doctor first uses the work table or the stove he remarks that his tools are very worn (GameWorld says it once,
// TOOLS_NOTICED_ID); the blacksmith (healthy now) sharpens and renews them for TOOLS_PRICE coins, once. It is only
// offered after the day's three cases are treated, so the money can never be needed for a case (the economy test
// cannot be deadlocked by it). NEW TEXT, awaiting Kilian's review.
export const TOOLS_PRICE = 15;
export const TOOLS_NOTICED_ID = "chapter3.tools.noticed";
export const TOOLS_RENEWED_ID = "chapter3.tools.renewed";
export const TOOLS_SMITH_INTERACTION_ID = "chapter2.smithy.blacksmith";

const smith = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });

const OFFER: LocalizedConversation = {
  id: "chapter3.smithy.tools.renew",
  lines: [
    doctor("Herrero, mis herramientas están muy melladas: el cuchillo ya no corta y el mortero tiene más muescas que una moneda vieja.", "Smith, my tools are very worn: the knife no longer cuts and the mortar has more nicks than an old coin."),
    smith(`Se las dejo como nuevas. Son ${TOOLS_PRICE} monedas; no es avaricia, es el carbón.`, `I'll leave them like new. That's ${TOOLS_PRICE} coins; it's not greed, it's the charcoal.`),
    doctor("Es un precio justo por cortar sin hacer fuerza. Hecho.", "That's a fair price for cutting without force. Done."),
    smith("Mañana el cuchillo cortará solo. Y ahora a descansar, que se le nota.", "Tomorrow the knife will cut by itself. And now get some rest, it shows."),
  ],
};

const NOT_ENOUGH: LocalizedConversation = {
  id: "chapter3.smithy.tools.notEnough",
  lines: [
    doctor("Mis herramientas están muy melladas, herrero.", "My tools are very worn, smith."),
    smith(`Se las afilo por ${TOOLS_PRICE} monedas. Cuando las tenga, vuelva: el yunque no se mueve.`, `I'll sharpen them for ${TOOLS_PRICE} coins. Come back when you have them: the anvil isn't going anywhere.`),
    doctor("Volveré. Con monedas y con ganas.", "I'll be back. With coins and with enthusiasm."),
  ],
};

export function resolveToolsRenewal(
  interactionId: string,
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  if (interactionId !== TOOLS_SMITH_INTERACTION_ID) return null;
  const claimed = facts.claimedRewards ?? new Set<string>();
  if (claimed.has(TOOLS_RENEWED_ID)) return null;
  // Day 3 only (Day 2 is closed) and only once its three cases are treated.
  if (!claimed.has(DAY2_COMPLETED_ID)) return null;
  const done = Object.keys(CHAPTER3_PATIENTS).every((id) => getPatientStatus(facts.patients, id) === "treated");
  if (!done) return null;
  if ((facts.coins ?? 0) < TOOLS_PRICE) {
    return { conversation: localizeConversation(NOT_ENOUGH, language, subjectId), effects: [] };
  }
  return {
    conversation: localizeConversation(OFFER, language, subjectId),
    effects: [
      { type: "take-coins", amount: TOOLS_PRICE },
      { type: "claim-reward", rewardId: TOOLS_RENEWED_ID },
    ],
  };
}

// What the Doctor says, once, after using the work table or the stove on Day 3.
// DAY 3 OPENING THOUGHT (2026-11-18): said once, as a thought over the Doctor, the first time he is out of the
// Botica on Day 3. NEW TEXT, awaiting Kilian's review.
export const day3OpeningCopy: Record<Language, string> = {
  es: "Cada día el pueblo parece un poco más cansado. Empezaré por preguntar a quien me mire.",
  en: "Each day the village looks a little more tired. I'll start by asking whoever looks back at me.",
};

export const toolsNoticeCopy: Record<Language, string> = {
  es: "Mis herramientas están muy melladas... El herrero sabrá afilarlas cuando acabe la jornada.",
  en: "My tools are very worn... The blacksmith will know how to sharpen them once the day's work is done.",
};
