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
  const demands = new Map<string, number>();
  const totals = new Map<string, number>();
  const ordered: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const byOutput = new Map(recipes.map(recipe => [recipe.output.itemId as string, recipe]));

  function visit(itemId: string) {
    if (visiting.has(itemId)) throw new Error(`Cyclic crafting recipe: ${itemId}`);
    if (visited.has(itemId)) return;
    visiting.add(itemId);
    for (const input of byOutput.get(itemId)?.inputs ?? []) visit(input.itemId);
    visiting.delete(itemId);
    visited.add(itemId);
    ordered.push(itemId);
  }
  for (const treatment of treatments) {
    addNeed(demands, treatment.itemId, treatment.quantity);
    visit(treatment.itemId);
  }

  // Process all parents before a shared ingredient, aggregating demand BEFORE
  // using its carried stock or rounding batches. No intermediate is counted twice.
  for (const itemId of [...ordered].reverse()) {
    const quantity = demands.get(itemId) ?? 0;
    const recipe = byOutput.get(itemId);
    if (!recipe) {
      if (quantity > 0) addNeed(totals, itemId, quantity);
      continue;
    }
    const shortfall = Math.max(0, quantity - countItem(inventory, itemId));
    const crafts = Math.ceil(shortfall / recipe.output.quantity);
    for (const input of recipe.inputs) {
      if (crafts > 0) addNeed(demands, input.itemId, input.quantity * crafts);
    }
  }
  // Preserve the original first-seen ingredient order for existing dialogue.
  return ordered.filter(itemId => totals.has(itemId)).map(itemId => ({
    itemId, quantity: totals.get(itemId)!,
  }));
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
