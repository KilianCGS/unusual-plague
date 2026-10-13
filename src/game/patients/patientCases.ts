import {
  countItem,
  removeItem,
  type InventoryState,
} from "../inventory/inventory";
import type { Language } from "../i18n/types";

// PATIENT CASES. A case is the story state of one person who needs the Doctor.
// It is deliberately small: it stores ONE thing, the status. Everything else
// (can he be treated now? which boxes are ticked? does the baker show "!"?) is
// derived from the status and the inventory, never stored.
//
// Separate things that must not be mixed:
//   patient case id   "baker-husband"            this file (the story of the case)
//   ailment           "common-fever"             general medical knowledge (Book)
//   character         the baker, the husband     who they are
//   placed instance   "bakery-interior-baker-01" a sprite put in a scene
//   interactionId     "chapter1.bakery.baker"    what an interaction zone means
export type PatientStatus = "hidden" | "discovered" | "examined" | "treated";

// A treatment is a prepared item the patient needs, with a quantity.
export type TreatmentRequirement = {
  itemId: string;
  quantity: number;
};

export type PatientCaseDefinition = {
  id: string;
  name: Record<Language, string>;
  // The ailment of the Book (src/game/book/ailments.ts) the Doctor diagnoses.
  ailmentId: string;
  // What the case says on its Book page, per status of knowledge.
  discovered: Record<Language, string>;
  observation: Record<Language, string>;
  requiredTreatments: TreatmentRequirement[];
  // Recipes (ids of src/game/crafting/recipes.ts) that examining the patient
  // makes visible in the PREPARADOS tab.
  revealsRecipeIds: string[];
};

// Only the cases that are not hidden are stored: a missing entry IS hidden.
export type PatientCasesState = Readonly<Record<string, PatientStatus>>;

export const NO_PATIENT_CASES: PatientCasesState = {};

export function getPatientStatus(
  state: PatientCasesState,
  patientId: string,
): PatientStatus {
  return state[patientId] ?? "hidden";
}

// The only legal moves: hidden > discovered > examined > treated.
const NEXT_STATUS: Record<PatientStatus, PatientStatus | null> = {
  hidden: "discovered",
  discovered: "examined",
  examined: "treated",
  treated: null,
};

export function canAdvancePatient(
  state: PatientCasesState,
  patientId: string,
  to: PatientStatus,
): boolean {
  return NEXT_STATUS[getPatientStatus(state, patientId)] === to;
}

// Returns the state with the patient moved to `to`, or the SAME state when that
// is not the next step (an invalid move changes nothing).
export function advancePatient(
  state: PatientCasesState,
  patientId: string,
  to: PatientStatus,
): PatientCasesState {
  return canAdvancePatient(state, patientId, to)
    ? { ...state, [patientId]: to }
    : state;
}

// The cases that appear in PACIENTES, in the order the state lists them.
export function getVisiblePatientIds(state: PatientCasesState): string[] {
  return Object.keys(state).filter(
    (patientId) => getPatientStatus(state, patientId) !== "hidden",
  );
}

// DERIVED: whether the Doctor carries the prepared items this patient needs.
export function hasRequiredTreatments(
  definition: PatientCaseDefinition,
  inventory: InventoryState,
): boolean {
  return definition.requiredTreatments.every(
    ({ itemId, quantity }) => countItem(inventory, itemId) >= quantity,
  );
}

// DERIVED: the patient can be treated right now. There is no stored
// "ready to treat" status.
export function isTreatable(
  state: PatientCasesState,
  definition: PatientCaseDefinition,
  inventory: InventoryState,
): boolean {
  return (
    getPatientStatus(state, definition.id) === "examined" &&
    hasRequiredTreatments(definition, inventory)
  );
}

export type TreatmentResult = {
  state: PatientCasesState;
  inventory: InventoryState;
};

// Delivers the treatment: consumes EXACTLY the required items and marks the
// case treated, or does nothing at all. It works on copies and only returns
// them when every removal worked, so a missing second item can never leave the
// first one consumed.
export function treatPatient(
  state: PatientCasesState,
  definition: PatientCaseDefinition,
  inventory: InventoryState,
): TreatmentResult | null {
  if (!isTreatable(state, definition, inventory)) {
    return null;
  }

  let next: InventoryState | null = inventory;

  for (const { itemId, quantity } of definition.requiredTreatments) {
    next = next ? removeItem(next, itemId, quantity) : null;
  }

  return next
    ? {
        state: advancePatient(state, definition.id, "treated"),
        inventory: next,
      }
    : null;
}
