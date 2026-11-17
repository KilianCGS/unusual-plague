import type { ItemId } from "../items/items";

// Crafting V1 data. A recipe consumes item ids and produces an item id; it does
// not care where an input came from (the world, an NPC, another recipe), so a
// crafted item can be the input of the next recipe without any special case.
//
// Two stations share this one model. The station only decides which recipes
// are valid there and how many ingredients can be placed:
//   manual  the work table: mixing, soaking, wrapping...            (2 inputs)
//   fire    the hearth: boiling, cooking, infusing, reducing...     (3 inputs)
//   chop    the cutting board of the kitchen: CHOPPING one ingredient (1 input)
//   mortar  the mortar on the work table: GRINDING one ingredient   (1 input)
//           (the mortar is never consumed: it is a fixture of the table)
export type CraftStation = "manual" | "fire" | "mortar" | "chop";

export const STATION_MAX_INPUTS: Record<CraftStation, number> = {
  manual: 2,
  fire: 3,
  mortar: 1,
  chop: 1,
};

// Inputs carry a quantity (a future recipe may need "herb x2"), so they are a
// list of { itemId, quantity }, never a set.
export type RecipeIngredient = {
  itemId: ItemId;
  quantity: number;
};

export type Recipe = {
  id: string;
  station: CraftStation;
  inputs: RecipeIngredient[];
  output: RecipeIngredient;
};

export const RECIPES: Recipe[] = [
  {
    id: "manual.disinfected-bandage",
    station: "manual",
    inputs: [
      { itemId: "cloth", quantity: 1 },
      { itemId: "alcohol", quantity: 1 },
    ],
    output: { itemId: "disinfected-bandage", quantity: 1 },
  },
  {
    // The herb is ground in the mortar first, then bound with honey.
    id: "manual.medicinal-paste",
    station: "manual",
    inputs: [
      { itemId: "crushed-herb", quantity: 1 },
      { itemId: "honey", quantity: 1 },
    ],
    output: { itemId: "medicinal-paste", quantity: 1 },
  },
  {
    // Herb + ground coal, mixed by hand. (Medicinal paste above is not a step
    // of this one.)
    id: "manual.medicinal-ointment",
    station: "manual",
    // 2026-11-16 (Kilian): the herb is ground in the mortar too, like the coal.
    inputs: [
      { itemId: "crushed-herb", quantity: 1 },
      { itemId: "crushed-coal", quantity: 1 },
    ],
    output: { itemId: "medicinal-ointment", quantity: 1 },
  },
  {
    id: "fire.mushroom-soup",
    station: "fire",
    inputs: [
      { itemId: "water", quantity: 1 },
      { itemId: "salt", quantity: 1 },
      { itemId: "chopped-mushroom", quantity: 1 },
    ],
    output: { itemId: "mushroom-soup", quantity: 1 },
  },
  {
    id: "fire.milk-with-honey",
    station: "fire",
    inputs: [
      { itemId: "milk", quantity: 1 },
      { itemId: "honey", quantity: 1 },
    ],
    output: { itemId: "milk-with-honey", quantity: 1 },
  },
  {
    id: "fire.medicinal-infusion",
    station: "fire",
    inputs: [
      { itemId: "water", quantity: 1 },
      { itemId: "medicinal-herb", quantity: 1 },
    ],
    output: { itemId: "medicinal-infusion", quantity: 1 },
  },
  {
    id: "manual.cold-cloth",
    station: "manual",
    inputs: [
      { itemId: "water", quantity: 1 },
      { itemId: "cloth", quantity: 1 },
    ],
    output: { itemId: "cold-cloth", quantity: 1 },
  },
  {
    id: "fire.mint-infusion",
    station: "fire",
    inputs: [{ itemId: "water", quantity: 1 }, { itemId: "mint", quantity: 1 }],
    output: { itemId: "mint-infusion", quantity: 1 },
  },
  {
    // 2026-11-17 (Kilian): the base the balsamic syrup is built on (instead of the mint infusion).
    id: "fire.syrup",
    station: "fire",
    inputs: [{ itemId: "water", quantity: 1 }, { itemId: "sugar", quantity: 1 }],
    output: { itemId: "syrup", quantity: 1 },
  },
  {
    id: "fire.balsamic-syrup",
    station: "fire",
    inputs: [{ itemId: "syrup", quantity: 1 }, { itemId: "honey", quantity: 1 }, { itemId: "crushed-garlic", quantity: 1 }],
    output: { itemId: "balsamic-syrup", quantity: 1 },
  },
  {
    id: "fire.ointment-base",
    station: "fire",
    inputs: [{ itemId: "animal-fat", quantity: 1 }, { itemId: "resin", quantity: 1 }],
    output: { itemId: "ointment-base", quantity: 1 },
  },
  {
    id: "manual.poultice",
    station: "manual",
    inputs: [{ itemId: "medicinal-paste", quantity: 1 }, { itemId: "flour", quantity: 1 }],
    output: { itemId: "poultice", quantity: 1 },
  },
  {
    id: "manual.medicinal-compress",
    station: "manual",
    inputs: [{ itemId: "ointment-base", quantity: 1 }, { itemId: "cloth", quantity: 1 }],
    output: { itemId: "medicinal-compress", quantity: 1 },
  },
  {
    id: "mortar.crushed-coal",
    station: "mortar",
    inputs: [{ itemId: "coal", quantity: 1 }],
    output: { itemId: "crushed-coal", quantity: 1 },
  },
  {
    id: "mortar.crushed-herb",
    station: "mortar",
    inputs: [{ itemId: "medicinal-herb", quantity: 1 }],
    output: { itemId: "crushed-herb", quantity: 1 },
  },
  {
    id: "mortar.crushed-garlic",
    station: "mortar",
    inputs: [{ itemId: "garlic", quantity: 1 }],
    output: { itemId: "crushed-garlic", quantity: 1 },
  },
  // The cutting board of the kitchen: one ingredient in, its chopped version out (1 for 1).
  {
    id: "chop.onion",
    station: "chop",
    inputs: [{ itemId: "onion", quantity: 1 }],
    output: { itemId: "chopped-onion", quantity: 1 },
  },
  {
    id: "chop.mushroom",
    station: "chop",
    inputs: [{ itemId: "mushroom", quantity: 1 }],
    output: { itemId: "chopped-mushroom", quantity: 1 },
  },
  {
    id: "manual.charcoal-suspension",
    station: "manual",
    inputs: [{ itemId: "crushed-coal", quantity: 1 }, { itemId: "water", quantity: 1 }],
    output: { itemId: "charcoal-suspension", quantity: 1 },
  },
  {
    id: "fire.citrus-drink",
    station: "fire",
    // 2026-11-13: sugar added: it is bought from the merchant (money has to be NEEDED)
    inputs: [{ itemId: "orange", quantity: 1 }, { itemId: "water", quantity: 1 }, { itemId: "sugar", quantity: 1 }],
    output: { itemId: "citrus-drink", quantity: 1 },
  },
  // 2026-11-11: the cooking-medicinal family. The patients keep their own
  // treatments; these feed the errands of the quarry and the glade and are sold
  // for coins. All at the fire (3 inputs at most).
  {
    id: "fire.bone-broth",
    station: "fire",
    inputs: [{ itemId: "bone", quantity: 1 }, { itemId: "water", quantity: 1 }, { itemId: "salt", quantity: 1 }],
    output: { itemId: "bone-broth", quantity: 1 },
  },
  {
    id: "fire.onion-syrup",
    station: "fire",
    inputs: [{ itemId: "chopped-onion", quantity: 1 }, { itemId: "sugar", quantity: 1 }],
    output: { itemId: "onion-syrup", quantity: 1 },
  },
  {
    id: "fire.rehydration-drink",
    station: "fire",
    inputs: [{ itemId: "water", quantity: 1 }, { itemId: "sugar", quantity: 1 }, { itemId: "salt", quantity: 1 }],
    output: { itemId: "rehydration-drink", quantity: 1 },
  },
  {
    id: "fire.strong-broth",
    station: "fire",
    inputs: [{ itemId: "chopped-onion", quantity: 1 }, { itemId: "bone", quantity: 1 }, { itemId: "water", quantity: 1 }],
    output: { itemId: "strong-broth", quantity: 1 },
  },
];

// Knowing a final preparation also reveals the steps needed to make its inputs.
export function expandKnownRecipeIds(
  known: ReadonlySet<string>, recipes: readonly Recipe[] = RECIPES,
): ReadonlySet<string> {
  const expanded = new Set(known);
  function visit(recipe: Recipe) {
    for (const input of recipe.inputs) {
      const dependency = recipes.find(r => r.output.itemId === input.itemId);
      if (dependency && !expanded.has(dependency.id)) {
        expanded.add(dependency.id);
        visit(dependency);
      }
    }
  }
  for (const recipe of recipes) if (known.has(recipe.id)) visit(recipe);
  return expanded;
}
