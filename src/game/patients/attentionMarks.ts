import { getChapterInteractions } from "../compositions";
import { errandAskedFlag, NPC_TRADES } from "../dialogue/npcTrades";
import type { InventoryState } from "../inventory/inventory";
import {
  BAKER_HUSBAND_ID,
  CHAPTER1_PATIENT_NPC_INSTANCES,
  CHAPTER1_PATIENT_REWARDS,
  CHAPTER_PATIENT_MARKS,
  INJURED_MINER_ID,
  INJURED_MINER_INSTANCE_ID,
  TAVERN_PATIENT_ID,
  TAVERN_PATIENT_INSTANCE_ID,
  getAttentionInstanceIds,
} from "./chapter1Patients";
import { PATIENT_IDS_BY_CHAPTER } from "./chapterPatients";
import { getPatientStatus, type PatientCasesState } from "./patientCases";

// THE SYMBOLS OVER THE CHARACTERS (2026-11-27, Kilian), derived from the cases, the claimed flags and the inventory,
// never stored:
//   yellow "!"  a patient the Doctor has not examined yet; with a soft aura once examined, until he is treated.
//   blue "!"    somebody with a voluntary errand not asked yet; with the aura once asked, until it is delivered.
//   yellow "?"  somebody who has something for a patient's case (the bartender's jar, the farm woman's milk...).
//   blue "?"    somebody who has something for an errand (none today; the shape is ready).
export type AttentionKind = "patient" | "errand";
export type AttentionMarkSpec = { kind: AttentionKind; glyph: "!" | "?"; accepted: boolean };
export type AttentionMarks = ReadonlyMap<string, AttentionMarkSpec>;

// The person who stands for each patient of Day 1 (the baker for her husband, who lies in the bedroom scene).
const DAY1_PATIENT_INSTANCES: Readonly<Record<string, string>> = {
  [BAKER_HUSBAND_ID]: CHAPTER1_PATIENT_NPC_INSTANCES[BAKER_HUSBAND_ID],
  [TAVERN_PATIENT_ID]: TAVERN_PATIENT_INSTANCE_ID,
  [INJURED_MINER_ID]: INJURED_MINER_INSTANCE_ID,
};

function patientInstancesOf(chapterId: string): Record<string, string> {
  const day: Record<string, string> = chapterId === "chapter-1" ? { ...DAY1_PATIENT_INSTANCES } : {};
  for (const mark of CHAPTER_PATIENT_MARKS[chapterId] ?? []) day[mark.patientId] = mark.instanceId;
  return day;
}

export function getAttentionMarks(
  patients: PatientCasesState,
  claimed: ReadonlySet<string>,
  inventory: InventoryState,
  chapterId: string,
): AttentionMarks {
  const marks = new Map<string, AttentionMarkSpec>();
  const ofToday = new Set(PATIENT_IDS_BY_CHAPTER[chapterId] ?? []);
  const patientInstances = patientInstancesOf(chapterId);
  const allPatientInstances = new Set(Object.values(patientInstances));

  // Patients of the day.
  for (const [patientId, instanceId] of Object.entries(patientInstances)) {
    if (!ofToday.has(patientId)) continue;
    const status = getPatientStatus(patients, patientId);
    // The man on the tavern floor is pointed out by the bartender: unseen, he has no mark of his own.
    if (status === "hidden" && patientId === TAVERN_PATIENT_ID) continue;
    if (status === "hidden" || status === "discovered") {
      marks.set(instanceId, { kind: "patient", glyph: "!", accepted: false });
    } else if (status === "examined") {
      marks.set(instanceId, { kind: "patient", glyph: "!", accepted: true });
    } else if (CHAPTER1_PATIENT_REWARDS[patientId] && !claimed.has(CHAPTER1_PATIENT_REWARDS[patientId])) {
      // treated, and the family still has its thank-you for the Doctor
      marks.set(instanceId, { kind: "patient", glyph: "?", accepted: false });
    }
  }

  // Those who have something for a patient's case: the helpers of the old rule (getAttentionInstanceIds), without
  // the patients themselves, who follow the rule above.
  for (const instanceId of getAttentionInstanceIds(patients, claimed, inventory, chapterId)) {
    if (!allPatientInstances.has(instanceId) && !marks.has(instanceId)) {
      marks.set(instanceId, { kind: "patient", glyph: "?", accepted: false });
    }
  }

  // Voluntary errands: whoever asks for one, on the days his interaction exists.
  const interactions = getChapterInteractions(chapterId);
  for (const trade of Object.values(NPC_TRADES)) {
    if (!trade.ask || !trade.objective || claimed.has(trade.rewardId)) continue;
    if (trade.chapters && !trade.chapters.includes(chapterId)) continue;
    if (trade.requiresPatient && getPatientStatus(patients, trade.requiresPatient.patientId) !== trade.requiresPatient.status) continue;
    const accepted = claimed.has(errandAskedFlag(trade));
    for (const [instanceId, interaction] of Object.entries(interactions)) {
      if (interaction.interactionId === trade.interactionId && !marks.has(instanceId)) {
        marks.set(instanceId, { kind: "errand", glyph: "!", accepted });
      }
    }
  }

  return marks;
}
