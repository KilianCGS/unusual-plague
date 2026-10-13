import { getMissingIngredients, type ItemNeed } from "../crafting/needs";
import type { InventoryState } from "../inventory/inventory";
import {
  getPatientStatus,
  type PatientCaseDefinition,
  type PatientCasesState,
} from "./patientCases";

// What the Doctor currently needs for the patients he has EXAMINED and not yet
// treated. Derived from the cases and the inventory; no counters are stored.
export function getActiveTreatments(
  state: PatientCasesState,
  definitions: Readonly<Record<string, PatientCaseDefinition>>,
): ItemNeed[] {
  const totals = new Map<string, number>();

  for (const definition of Object.values(definitions)) {
    if (getPatientStatus(state, definition.id) !== "examined") {
      continue;
    }

    for (const { itemId, quantity } of definition.requiredTreatments) {
      totals.set(itemId, (totals.get(itemId) ?? 0) + quantity);
    }
  }

  return [...totals].map(([itemId, quantity]) => ({ itemId, quantity }));
}

// The ingredients still missing for those treatments.
export function getActiveMissingIngredients(
  state: PatientCasesState,
  definitions: Readonly<Record<string, PatientCaseDefinition>>,
  inventory: InventoryState,
): ItemNeed[] {
  return getMissingIngredients(
    getActiveTreatments(state, definitions),
    inventory,
  );
}

// Same question for ONE patient, used right after examining him (when his
// status is examined, the two coincide while he is the only open case).
export function getPatientMissingIngredients(
  definition: PatientCaseDefinition,
  inventory: InventoryState,
): ItemNeed[] {
  return getMissingIngredients(definition.requiredTreatments, inventory);
}
