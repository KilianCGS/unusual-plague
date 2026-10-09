import type { ItemId } from "../items/items";

// Crafting V1 data. A recipe consumes item ids and produces an item id; it does
// not care where an input came from (the world, an NPC, another recipe), so a
// crafted item can be the input of the next recipe without any special case.
//
// Two stations share this one model. The station only decides which recipes
// are valid there and how many ingredients can be placed:
//   manual  the work table: mixing, grinding, soaking, wrapping...  (2 inputs)
//   fire    the hearth: boiling, cooking, infusing, reducing...     (3 inputs)
export type CraftStation = "manual" | "fire";

export const STATION_MAX_INPUTS: Record<CraftStation, number> = {
  manual: 2,
  fire: 3,
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
    id: "manual.medicinal-paste",
    station: "manual",
    inputs: [
      { itemId: "medicinal-herb", quantity: 1 },
      { itemId: "honey", quantity: 1 },
    ],
    output: { itemId: "medicinal-paste", quantity: 1 },
  },
  {
    // Uses the output of the previous recipe: Medicinal paste is just an item.
    id: "manual.medicinal-ointment",
    station: "manual",
    inputs: [
      { itemId: "medicinal-paste", quantity: 1 },
      { itemId: "coal", quantity: 1 },
    ],
    output: { itemId: "medicinal-ointment", quantity: 1 },
  },
  {
    id: "fire.mushroom-soup",
    station: "fire",
    inputs: [
      { itemId: "water", quantity: 1 },
      { itemId: "salt", quantity: 1 },
      { itemId: "mushroom", quantity: 1 },
    ],
    output: { itemId: "mushroom-soup", quantity: 1 },
  },
];
