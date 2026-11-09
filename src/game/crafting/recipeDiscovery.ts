import { RECIPES, expandKnownRecipeIds } from "./recipes";

// Recognizable ingredients suggest preparations; water and empty vessels do
// not reveal the entire catalog. Knowledge survives spending/storing an item.
export const RECIPE_DISCOVERY_ITEMS: Readonly<Record<string, readonly string[]>> = {
  "medicinal-herb": ["fire.medicinal-infusion", "mortar.crushed-herb", "manual.medicinal-paste"],
  cloth: ["manual.cold-cloth", "manual.disinfected-bandage"],
  alcohol: ["manual.disinfected-bandage"],
  mushroom: ["fire.mushroom-soup"],
  milk: ["fire.milk-with-honey"],
  honey: ["manual.medicinal-paste", "fire.milk-with-honey"],
  coal: ["mortar.crushed-coal", "manual.charcoal-suspension", "manual.medicinal-ointment"],
  mint: ["fire.mint-infusion", "fire.balsamic-syrup"],
  garlic: ["fire.balsamic-syrup"],
  resin: ["fire.ointment-base", "manual.medicinal-compress"],
  "animal-fat": ["fire.ointment-base", "manual.medicinal-compress"],
  flour: ["manual.poultice"],
  orange: ["fire.citrus-drink"],
};

export function learnRecipesFromItems(
  known: ReadonlySet<string>, itemIds: readonly string[],
): ReadonlySet<string> {
  const next = new Set(known);
  for (const itemId of itemIds) {
    for (const id of RECIPE_DISCOVERY_ITEMS[itemId] ?? []) next.add(id);
    // Receiving or successfully crafting a preparation teaches its own recipe.
    const made = RECIPES.find(recipe => recipe.output.itemId === itemId);
    if (made) next.add(made.id);
  }
  const expanded = expandKnownRecipeIds(next);
  return expanded.size === known.size ? known : expanded;
}
