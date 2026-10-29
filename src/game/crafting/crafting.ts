import {
  addItem,
  countItem,
  removeItem,
  type InventoryState,
} from "../inventory/inventory";
import {
  RECIPES,
  STATION_MAX_INPUTS,
  type CraftStation,
  type Recipe,
  type RecipeIngredient,
} from "./recipes";

// Pure crafting logic: no React, no UI. Nothing here mutates its arguments.

// ---------------------------------------------------------------------------
// Selection: the ingredients the player has CHOSEN but not yet used. One entry
// per unit and one entry per station slot (null = empty slot). Choosing never
// touches the inventory; only a successful craft does.
// ---------------------------------------------------------------------------
export type CraftSelection = (string | null)[];

export function createEmptySelection(station: CraftStation): CraftSelection {
  return Array.from({ length: STATION_MAX_INPUTS[station] }, () => null);
}

function countSelected(selection: CraftSelection, itemId: string): number {
  return selection.filter((selected) => selected === itemId).length;
}

// How many units of an item are still free to select: what the inventory holds
// minus what is already selected. Derived on the fly for display; the
// inventory itself never changes until a craft succeeds.
export function availableUnits(
  inventory: InventoryState,
  selection: CraftSelection,
  itemId: string,
): number {
  return countItem(inventory, itemId) - countSelected(selection, itemId);
}

// Whether one more unit of this item can be selected: there is a free slot and
// the inventory really holds more units than are already selected.
export function canSelectItem(
  inventory: InventoryState,
  selection: CraftSelection,
  itemId: string,
): boolean {
  return (
    selection.some((selected) => selected === null) &&
    countSelected(selection, itemId) < countItem(inventory, itemId)
  );
}

// Adds ONE unit to the first free slot. When it cannot be added (stations full
// or not enough units) the same selection is returned: nothing is replaced.
export function selectItem(
  inventory: InventoryState,
  selection: CraftSelection,
  itemId: string,
): CraftSelection {
  if (!canSelectItem(inventory, selection, itemId)) {
    return selection;
  }

  const target = selection.findIndex((selected) => selected === null);

  return selection.map((selected, index) =>
    index === target ? itemId : selected,
  );
}

// Removes ONE unit: the one in that slot.
export function deselectSlot(
  selection: CraftSelection,
  slotIndex: number,
): CraftSelection {
  return selection.map((selected, index) =>
    index === slotIndex ? null : selected,
  );
}

// A station's capacity is the MOST units that can be selected (manual 2, fire
// 3), not how many a recipe needs: a fire recipe may use only two. COMBINE can
// be pressed once at least MIN_COMBINE_INPUTS units are selected. That only
// means "there are enough ingredients to try", not that a recipe exists.
export const MIN_COMBINE_INPUTS = 2;

export function canAttemptCombine(selection: CraftSelection): boolean {
  return (
    selection.filter((selected) => selected !== null).length >=
    MIN_COMBINE_INPUTS
  );
}

// The selection as ingredients with quantities (order is lost on purpose).
export function selectionToIngredients(
  selection: CraftSelection,
): RecipeIngredient[] {
  const counts = new Map<string, number>();

  for (const selected of selection) {
    if (selected !== null) {
      counts.set(selected, (counts.get(selected) ?? 0) + 1);
    }
  }

  return [...counts].map(([itemId, quantity]) => ({
    itemId: itemId as RecipeIngredient["itemId"],
    quantity,
  }));
}

// ---------------------------------------------------------------------------
// Matching: same station and the same ingredients with the same quantities, in
// ANY order. No per-recipe code and no permutations stored.
// ---------------------------------------------------------------------------
function sameIngredients(
  a: readonly RecipeIngredient[],
  b: readonly RecipeIngredient[],
): boolean {
  const totals = (list: readonly RecipeIngredient[]) => {
    const map = new Map<string, number>();

    for (const { itemId, quantity } of list) {
      map.set(itemId, (map.get(itemId) ?? 0) + quantity);
    }

    return map;
  };
  const left = totals(a);
  const right = totals(b);

  return (
    left.size === right.size &&
    [...left].every(([itemId, quantity]) => right.get(itemId) === quantity)
  );
}

export function findMatchingRecipe(
  station: CraftStation,
  ingredients: readonly RecipeIngredient[],
  recipes: readonly Recipe[] = RECIPES,
): Recipe | null {
  return (
    recipes.find(
      (recipe) =>
        recipe.station === station &&
        sameIngredients(recipe.inputs, ingredients),
    ) ?? null
  );
}

// ---------------------------------------------------------------------------
// Crafting is a transaction: it either happens completely or not at all.
// ---------------------------------------------------------------------------

// Returns the inventory after consuming the inputs and adding the output, or
// null when the inputs are missing or the output would not fit. The inventory
// that was passed in is never modified, so a failure leaves nothing consumed.
export function craft(
  inventory: InventoryState,
  recipe: Recipe,
): InventoryState | null {
  let next: InventoryState | null = inventory;

  for (const { itemId, quantity } of recipe.inputs) {
    next = next ? removeItem(next, itemId, quantity) : null;
  }

  // Inputs are consumed first on the working copy, so the space they free can
  // hold the output.
  return next
    ? addItem(next, recipe.output.itemId, recipe.output.quantity)
    : null;
}

export function canCraft(inventory: InventoryState, recipe: Recipe): boolean {
  return craft(inventory, recipe) !== null;
}

// Whether the inventory holds every input of the recipe, whatever room the
// output would need.
function hasIngredients(inventory: InventoryState, recipe: Recipe): boolean {
  return recipe.inputs.every(
    ({ itemId, quantity }) => countItem(inventory, itemId) >= quantity,
  );
}

export type CombineResult =
  | { kind: "success"; inventory: InventoryState; recipe: Recipe }
  // The recipe exists and the ingredients are there, but the output does not
  // fit even after the inputs are consumed. Nothing is consumed.
  | { kind: "no-space"; recipe: Recipe }
  | { kind: "no-recipe" };

// What COMBINE does: look for a recipe of this station for the selected
// ingredients and craft it. No recipe, a recipe of another station or missing
// units is "no-recipe"; a valid recipe whose output has no room is "no-space".
// Neither changes anything.
//
// Crafting does not check which recipes the Doctor KNOWS (knownRecipeIds only
// feeds the Book's PREPARADOS tab): any valid combination can be made, learned
// or not. That is deliberate for now.
export function combine(
  inventory: InventoryState,
  station: CraftStation,
  selection: CraftSelection,
  recipes: readonly Recipe[] = RECIPES,
): CombineResult {
  const recipe = findMatchingRecipe(
    station,
    selectionToIngredients(selection),
    recipes,
  );

  if (!recipe) {
    return { kind: "no-recipe" };
  }

  const next = craft(inventory, recipe);

  if (next) {
    return { kind: "success", inventory: next, recipe };
  }

  return hasIngredients(inventory, recipe)
    ? { kind: "no-space", recipe }
    : { kind: "no-recipe" };
}

// The only interactionIds that open a crafting station. A station exists in
// the world when its interactionId is listed here AND at least one zone with
// that id is placed in a scene (several zones may share an id: the work table
// has two). Both stations are in the Apothecary: the work table on the left
// and the stove at the top right.
export const CRAFT_STATION_BY_INTERACTION_ID: Record<string, CraftStation> = {
  "craft.manual": "manual",
  "craft.fire": "fire",
};
