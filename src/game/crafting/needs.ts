import { countItem, type InventoryState } from "../inventory/inventory";
import { RECIPES, type Recipe } from "./recipes";

// What is still missing to make the prepared items a patient needs. It is all
// derived: required treatments > the recipes that make them > the recipes'
// inputs > the quantities the Doctor already carries. Nothing is stored.

export type ItemNeed = { itemId: string; quantity: number };

function addNeed(needs: Map<string, number>, itemId: string, quantity: number) {
  needs.set(itemId, (needs.get(itemId) ?? 0) + quantity);
}

// The ingredients (item ids with TOTAL quantities, summed over every recipe
// that is needed) for the treatments the Doctor does not carry yet. A
// treatment he already holds needs no ingredients.
export function getRequiredIngredients(
  treatments: readonly ItemNeed[],
  inventory: InventoryState,
  recipes: readonly Recipe[] = RECIPES,
): ItemNeed[] {
  const totals = new Map<string, number>();

  for (const { itemId, quantity } of treatments) {
    const shortfall = Math.max(0, quantity - countItem(inventory, itemId));
    const recipe = recipes.find(({ output }) => output.itemId === itemId);

    if (!recipe || shortfall === 0) {
      continue;
    }

    // Each craft makes `output.quantity`; round up to whole crafts.
    const crafts = Math.ceil(shortfall / recipe.output.quantity);

    for (const input of recipe.inputs) {
      addNeed(totals, input.itemId, input.quantity * crafts);
    }
  }

  return [...totals].map(([itemId, quantity]) => ({ itemId, quantity }));
}

// The ingredients the Doctor still lacks, with the MISSING quantity: needed
// minus carried. Water x2 needed with Water x1 carried is Water x1 missing.
export function getMissingIngredients(
  treatments: readonly ItemNeed[],
  inventory: InventoryState,
  recipes: readonly Recipe[] = RECIPES,
): ItemNeed[] {
  return getRequiredIngredients(treatments, inventory, recipes)
    .map(({ itemId, quantity }) => ({
      itemId,
      quantity: quantity - countItem(inventory, itemId),
    }))
    .filter(({ quantity }) => quantity > 0);
}
