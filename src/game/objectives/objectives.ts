import type { Language } from "../i18n/types";
import { BAKER_HUSBAND_ID, INJURED_MINER_ID, TAVERN_PATIENT_ID } from "../patients/chapter1Patients";
import { BLACKSMITH_DAY2_ID, FARMER_DAY2_ID, WOODCUTTER_DAY2_ID } from "../patients/chapter2Patients";
import { PATH_MINER_DAY3_ID, STONECUTTER_DAY3_ID, DUSTER_DAY3_ID, INSOMNIAC_DAY3_ID } from "../patients/chapter3Patients";
import { errandAskedFlag, NPC_TRADES } from "../dialogue/npcTrades";
import { getPatientStatus, type PatientCasesState } from "../patients/patientCases";

// THE ERRANDS PANEL: what the Doctor has pending, derived from the cases (never
// stored). A case becomes an errand the moment the Doctor knows about it (the
// case is "discovered": he has spoken with whoever asked) and is done once it
// is treated. Other kinds of errand (small favours) can be added as further
// sources of the same shape.
//
// Every text here is NEW and awaits Kilian's review.
export type Objective = { id: string; text: string; done: boolean };

export const PATIENT_OBJECTIVES: Readonly<Record<string, Record<Language, string>>> = {
  [BAKER_HUSBAND_ID]: { es: "Tratar al marido de la panadera", en: "Treat the baker's husband" },
  [TAVERN_PATIENT_ID]: { es: "Tratar al hombre de la taberna", en: "Treat the man in the tavern" },
  [INJURED_MINER_ID]: { es: "Tratar al minero herido", en: "Treat the injured miner" },
  [WOODCUTTER_DAY2_ID]: { es: "Tratar al leñador", en: "Treat the woodcutter" },
  [BLACKSMITH_DAY2_ID]: { es: "Tratar al herrero herido", en: "Treat the injured blacksmith" },
  [FARMER_DAY2_ID]: { es: "Tratar al agricultor del molino", en: "Treat the mill farmer" },
  [DUSTER_DAY3_ID]: { es: "Tratar a la mujer del plumero", en: "Treat the woman with the duster" },
  [PATH_MINER_DAY3_ID]: { es: "Tratar al minero de la cantera", en: "Treat the quarry miner" },
  [STONECUTTER_DAY3_ID]: { es: "Tratar al picapedrero de la cantera", en: "Treat the quarry stonecutter" },
  [INSOMNIAC_DAY3_ID]: { es: "Tratar al anciano del cántaro", en: "Treat the old man with the jug" },
};

// DAY 3 LEADS (2026-11-18): until the Doctor has met a patient of Day 3 the panel only says WHERE to look, as a
// rumour (guided, but nothing is marked on the map). Once met, the normal "Treat ..." line takes its place.
// NEW TEXT, awaiting Kilian's review.
export const DAY3_LEADS: Readonly<Record<string, Record<Language, string>>> = {
  [DUSTER_DAY3_ID]: { es: "Alguien tose sin parar en la calle de la panadería", en: "Someone is coughing nonstop on the bakery street" },
  [PATH_MINER_DAY3_ID]: { es: "Un hombre descansa en la cantera, cansado y sin sonreír", en: "A man rests at the quarry, tired and not smiling" },
  [STONECUTTER_DAY3_ID]: { es: "Un picapedrero se sostiene el brazo en la cantera", en: "A stonecutter is holding his arm at the quarry" },
  [INSOMNIAC_DAY3_ID]: { es: "El anciano del cántaro lleva noches sin dormir", en: "The old man with the jug has gone nights without sleep" },
};

export const objectivesCopy: Record<Language, { title: string; toggleHint: string }> = {
  es: { title: "Recados", toggleHint: "[R]" },
  en: { title: "Errands", toggleHint: "[R]" },
};

export function getObjectives(
  patients: PatientCasesState,
  language: Language,
  // Day 4 has no patients: its only errand is to see the Witch (2026-11-12).
  context?: { chapterId: string; claimed: ReadonlySet<string> },
): Objective[] {
  const errands = Object.entries(PATIENT_OBJECTIVES).flatMap(([patientId, text]) => {
    const status = getPatientStatus(patients, patientId);

    if (status === "hidden") {
      const lead = context?.chapterId === "chapter-3" ? DAY3_LEADS[patientId] : undefined;
      return lead ? [{ id: patientId, text: lead[language], done: false }] : [];
    }
    return [{ id: patientId, text: text[language], done: status === "treated" }];
  });

  // The voluntary errands the Doctor has been asked for (2026-11-15), pending or done.
  if (context) {
    for (const trade of Object.values(NPC_TRADES)) {
      if (trade.chapters && !trade.chapters.includes(context.chapterId)) continue;
      if (trade.objective && context.claimed.has(errandAskedFlag(trade))) {
        errands.push({ id: trade.rewardId, text: trade.objective[language], done: context.claimed.has(trade.rewardId) });
      }
    }
  }

  // 2026-11-20 (Kilian): Day 4 has NO errand ("go and see the Witch" is gone): it is a narrative day, the player is
  // meant to be surprised and to find the way by themself. The panel stays empty (and hidden) that night.

  return errands;
}
