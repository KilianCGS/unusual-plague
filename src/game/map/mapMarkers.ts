import { errandAskedFlag, NPC_TRADES } from "../dialogue/npcTrades";
import { getPatientStatus, type PatientCasesState } from "../patients/patientCases";
import type { MapLocationId } from "./mapLocations";

// WHAT THE MAP MARKS (2026-11-26, Kilian): a yellow "!" over each place where a patient waits for the Doctor,
// a blue one over each place where somebody has asked him for an errand, one symbol per patient or errand.
// Derived from the cases and the claimed flags (never stored), like the errands panel. A case the Doctor has not met
// (hidden: Day 3 only gives a rumour in the panel) is NOT marked: the map never reveals what the story has not shown.
export type MapMarkers = Partial<Record<MapLocationId, { patients: number; errands: number }>>;

// Where each patient is found.
export const PATIENT_MAP_LOCATION: Readonly<Record<string, MapLocationId>> = {
  "baker-husband": "bakery",
  "tavern-patient": "tavern",
  "injured-miner": "mine",
  "chapter2-woodcutter": "forest",
  "chapter2-blacksmith": "smithy",
  "chapter2-farmer": "mill",
  "chapter3-duster": "bakery",
  "chapter3-path-miner": "quarry",
  "chapter3-stonecutter": "quarry",
  "chapter3-insomniac": "tavern",
};

// Where each voluntary errand is delivered (the person who asked for it).
export const ERRAND_MAP_LOCATION: Readonly<Record<string, MapLocationId>> = {
  "chapter1.outskirts.fisherman": "river",
  "chapter2.tavernStreet.elder": "tavern",
  "chapter2.bakeryStreet.woman": "bakery",
  "chapter2.tavernStreet.sitting": "tavern",
  "chapter2.quarry.miner": "quarry",
  "chapter3.smithyStreet.carpenter": "smithy",
  "chapter3.plaza.elderMan": "plaza",
};

export function getMapMarkers(
  patients: PatientCasesState,
  claimed: ReadonlySet<string>,
  chapterId: string,
): MapMarkers {
  const markers: MapMarkers = {};
  const add = (location: MapLocationId, kind: "patients" | "errands") => {
    const entry = markers[location] ?? { patients: 0, errands: 0 };
    entry[kind] += 1;
    markers[location] = entry;
  };

  // A patient the Doctor knows about and has not treated yet.
  for (const [patientId, location] of Object.entries(PATIENT_MAP_LOCATION)) {
    const status = getPatientStatus(patients, patientId);
    if (status === "discovered" || status === "examined") add(location, "patients");
  }

  // An errand somebody asked for and the Doctor has not delivered.
  for (const trade of Object.values(NPC_TRADES)) {
    if (!trade.objective) continue;
    if (trade.chapters && !trade.chapters.includes(chapterId)) continue;
    if (!claimed.has(errandAskedFlag(trade)) || claimed.has(trade.rewardId)) continue;
    const location = ERRAND_MAP_LOCATION[trade.interactionId];
    if (location) add(location, "errands");
  }

  return markers;
}
