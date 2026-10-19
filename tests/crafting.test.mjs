// Crafting V1: recipes, matching, selection and the transactional craft, plus
// the stations of the real game. Pure logic against the real source files.
//   node tests/crafting.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: "commonjs", target: "es2022" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const candidate of [base + ".ts", path.join(base, "index.ts")]) {
        if (fs.existsSync(candidate)) return load(candidate);
      }
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    if (id.includes("useProtagonistController"))
      return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const inv = at("src/game/inventory/inventory.ts");
const cr = at("src/game/crafting/crafting.ts");
const { RECIPES, STATION_MAX_INPUTS } = at("src/game/crafting/recipes.ts");
const { craftingCopy } = at("src/game/i18n/crafting.ts");
const { ITEMS, getItemName } = at("src/game/items/items.ts");
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);
const { chapter1Interactions } = at(
  "src/game/compositions/chapter-1.interactions.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const ing = (...ids) => ids.map((itemId) => ({ itemId, quantity: 1 }));
const stock = (pairs) =>
  pairs.reduce(
    (state, [id, q]) => inv.addItem(state, id, q),
    inv.createEmptyInventory(),
  );
const recipeById = (id) => RECIPES.find((r) => r.id === id);
const permutations = (list) =>
  list.length <= 1
    ? [list]
    : list.flatMap((x, i) =>
        permutations([...list.slice(0, i), ...list.slice(i + 1)]).map((p) => [
          x,
          ...p,
        ]),
      );

test("the V1 recipes and the two patient recipes exist with the right stations and sizes", () => {
  assert.equal(RECIPES.length, 6);
  assert.deepEqual(STATION_MAX_INPUTS, { manual: 2, fire: 3 });
  assert.equal(recipeById("manual.disinfected-bandage").inputs.length, 2);
  assert.equal(recipeById("fire.mushroom-soup").inputs.length, 3);
  for (const recipe of RECIPES) {
    assert.ok(recipe.inputs.length <= STATION_MAX_INPUTS[recipe.station]);
    for (const { itemId } of [...recipe.inputs, recipe.output])
      assert.ok(ITEMS[itemId], `${itemId} is in the catalog`);
  }
});

test("1. manual matching", () => {
  assert.equal(
    cr.findMatchingRecipe("manual", ing("cloth", "alcohol")).id,
    "manual.disinfected-bandage",
  );
  assert.equal(
    cr.findMatchingRecipe("manual", ing("medicinal-herb", "honey")).id,
    "manual.medicinal-paste",
  );
});

test("2. fire matching", () => {
  assert.equal(
    cr.findMatchingRecipe("fire", ing("water", "salt", "mushroom")).id,
    "fire.mushroom-soup",
  );
});

test("3. the reverse order finds the same recipe", () => {
  assert.equal(
    cr.findMatchingRecipe("manual", ing("alcohol", "cloth")).id,
    "manual.disinfected-bandage",
  );
});

test("4. every permutation of 3 inputs finds the same recipe", () => {
  const all = permutations(["water", "salt", "mushroom"]);
  assert.equal(all.length, 6);
  for (const order of all)
    assert.equal(
      cr.findMatchingRecipe("fire", ing(...order)).id,
      "fire.mushroom-soup",
    );
});

test("5. the same inputs in the wrong station find nothing", () => {
  assert.equal(cr.findMatchingRecipe("fire", ing("cloth", "alcohol")), null);
  assert.equal(
    cr.findMatchingRecipe("manual", ing("water", "salt", "mushroom")),
    null,
  );
});

test("6. an unknown combination finds nothing", () => {
  assert.equal(cr.findMatchingRecipe("manual", ing("cloth", "honey")), null);
  assert.equal(
    cr.findMatchingRecipe("fire", ing("water", "salt", "coal")),
    null,
  );
});

test("7. quantities are part of the matching", () => {
  // two of one input is not the recipe of one + one
  assert.equal(
    cr.findMatchingRecipe("manual", [{ itemId: "cloth", quantity: 2 }]),
    null,
  );
  assert.equal(
    cr.findMatchingRecipe("manual", [
      { itemId: "cloth", quantity: 2 },
      { itemId: "alcohol", quantity: 1 },
    ]),
    null,
  );
  // a recipe that needs "herb x2" (custom list, not shipped) matches only with 2
  const custom = [
    {
      id: "t",
      station: "manual",
      inputs: [{ itemId: "medicinal-herb", quantity: 2 }],
      output: { itemId: "medicinal-paste", quantity: 1 },
    },
  ];
  assert.equal(
    cr.findMatchingRecipe(
      "manual",
      [{ itemId: "medicinal-herb", quantity: 1 }],
      custom,
    ),
    null,
  );
  assert.equal(
    cr.findMatchingRecipe(
      "manual",
      [{ itemId: "medicinal-herb", quantity: 2 }],
      custom,
    ).id,
    "t",
  );
  // a selection of two single units counts as quantity 2
  assert.deepEqual(
    cr.selectionToIngredients(["medicinal-herb", "medicinal-herb"]),
    [{ itemId: "medicinal-herb", quantity: 2 }],
  );
});

test("8. cannot craft without the quantities", () => {
  const bandage = recipeById("manual.disinfected-bandage");
  assert.equal(cr.canCraft(stock([["cloth", 1]]), bandage), false);
  assert.equal(cr.craft(stock([["cloth", 1]]), bandage), null);
  assert.equal(
    cr.canCraft(
      stock([
        ["cloth", 1],
        ["alcohol", 1],
      ]),
      bandage,
    ),
    true,
  );
  // custom recipe needing two units fails with one
  const two = {
    id: "t",
    station: "manual",
    inputs: [{ itemId: "cloth", quantity: 2 }],
    output: { itemId: "alcohol", quantity: 1 },
  };
  assert.equal(cr.craft(stock([["cloth", 1]]), two), null);
});

test("9. craft consumes the right inputs", () => {
  const start = stock([
    ["cloth", 2],
    ["alcohol", 1],
    ["honey", 1],
  ]);
  const after = cr.craft(start, recipeById("manual.disinfected-bandage"));
  assert.equal(inv.countItem(after, "cloth"), 1);
  assert.equal(inv.countItem(after, "alcohol"), 0);
  assert.equal(inv.countItem(after, "honey"), 1); // untouched
});

test("10. craft produces the output", () => {
  const after = cr.craft(
    stock([
      ["cloth", 1],
      ["alcohol", 1],
    ]),
    recipeById("manual.disinfected-bandage"),
  );
  assert.equal(inv.countItem(after, "disinfected-bandage"), 1);
  assert.equal(inv.countOccupiedSlots(after), 1); // both inputs gone, one output
  assert.ok(inv.isValidInventory(after));
});

test("11. an output the Doctor already has grows its stack", () => {
  const start = stock([
    ["cloth", 1],
    ["alcohol", 1],
    ["disinfected-bandage", 1],
  ]);
  const after = cr.craft(start, recipeById("manual.disinfected-bandage"));
  assert.equal(inv.countItem(after, "disinfected-bandage"), 2);
  assert.equal(inv.countOccupiedSlots(after), 1);
});

test("12. craft is immutable", () => {
  const start = stock([
    ["cloth", 2],
    ["alcohol", 1],
  ]);
  const snapshot = JSON.stringify(start);
  const slots = start.slots;
  const after = cr.craft(start, recipeById("manual.disinfected-bandage"));
  assert.equal(JSON.stringify(start), snapshot);
  assert.equal(start.slots, slots);
  assert.notEqual(after, start);
});

test("13. a failed craft leaves the inventory untouched (all or nothing)", () => {
  const bandage = recipeById("manual.disinfected-bandage");
  // missing the second input: the first must not be consumed either
  const partial = stock([["cloth", 1]]);
  const snapshot = JSON.stringify(partial);
  assert.equal(cr.craft(partial, bandage), null);
  assert.equal(JSON.stringify(partial), snapshot);
  // output cannot fit: 6 slots full of other types, inputs are 1 slot each...
  const filler = Array.from({ length: 4 }, (_, i) => [`filler-${i}`, 1]);
  const full = stock([["cloth", 1], ["alcohol", 1], ...filler]); // 6 slots
  // ...consuming both inputs frees two slots, so the output DOES fit
  assert.ok(cr.craft(full, bandage));
  // a recipe whose inputs stay in their slots and whose output is a new type cannot fit
  const stays = {
    id: "t",
    station: "manual",
    inputs: [{ itemId: "cloth", quantity: 1 }],
    output: { itemId: "coal", quantity: 1 },
  };
  const fullStays = stock([
    ["cloth", 2],
    ...Array.from({ length: 5 }, (_, i) => [`filler-${i}`, 1]),
  ]);
  const fullSnapshot = JSON.stringify(fullStays);
  assert.equal(cr.craft(fullStays, stays), null);
  assert.equal(JSON.stringify(fullStays), fullSnapshot);
  // and combine reports it as "no recipe" without changing anything
  assert.equal(
    cr.combine(fullStays, "manual", ["cloth", "cloth"], [stays]).kind,
    "no-recipe",
  );
});

test("14. the chained recipe works with no special logic", () => {
  let state = stock([
    ["medicinal-herb", 1],
    ["honey", 1],
    ["coal", 1],
  ]);
  let result = cr.combine(state, "manual", ["medicinal-herb", "honey"]);
  assert.equal(result.kind, "success");
  assert.equal(result.recipe.output.itemId, "medicinal-paste");
  state = result.inventory;
  assert.deepEqual(
    state.slots
      .filter(Boolean)
      .map((s) => s.itemId)
      .sort(),
    ["coal", "medicinal-paste"],
  );
  result = cr.combine(state, "manual", ["coal", "medicinal-paste"]); // any order
  assert.equal(result.kind, "success");
  assert.equal(result.recipe.output.itemId, "medicinal-ointment");
  assert.deepEqual(result.inventory.slots.filter(Boolean), [
    { itemId: "medicinal-ointment", quantity: 1 },
  ]);
});

test("combine: fire recipe, wrong station and unknown mix never change the inventory", () => {
  const state = stock([
    ["water", 1],
    ["salt", 1],
    ["mushroom", 1],
    ["cloth", 1],
    ["alcohol", 1],
    ["honey", 1],
  ]);
  const snapshot = JSON.stringify(state);
  const soup = cr.combine(state, "fire", ["mushroom", "water", "salt"]);
  assert.equal(soup.kind, "success");
  assert.equal(inv.countItem(soup.inventory, "mushroom-soup"), 1);
  assert.equal(
    cr.combine(state, "fire", ["cloth", "alcohol", null]).kind,
    "no-recipe",
  );
  assert.equal(
    cr.combine(state, "manual", ["cloth", "honey"]).kind,
    "no-recipe",
  );
  assert.equal(JSON.stringify(state), snapshot);
});

test("15. manual selection holds at most 2", () => {
  const state = stock([
    ["cloth", 3],
    ["alcohol", 3],
  ]);
  let sel = cr.createEmptySelection("manual");
  assert.equal(sel.length, 2);
  sel = cr.selectItem(state, sel, "cloth");
  sel = cr.selectItem(state, sel, "alcohol");
  const full = cr.selectItem(state, sel, "cloth"); // no free slot: nothing replaced
  assert.deepEqual(full, ["cloth", "alcohol"]);
  assert.equal(full, sel);
});

test("16. fire selection holds at most 3", () => {
  const state = stock([
    ["water", 1],
    ["salt", 1],
    ["mushroom", 1],
    ["cloth", 1],
  ]);
  let sel = cr.createEmptySelection("fire");
  assert.equal(sel.length, 3);
  for (const id of ["water", "salt", "mushroom", "cloth"])
    sel = cr.selectItem(state, sel, id);
  assert.deepEqual(sel, ["water", "salt", "mushroom"]);
});

test("17. cannot select more units than the inventory holds", () => {
  const state = stock([
    ["cloth", 1],
    ["alcohol", 1],
  ]);
  let sel = cr.createEmptySelection("manual");
  sel = cr.selectItem(state, sel, "cloth");
  assert.equal(cr.canSelectItem(state, sel, "cloth"), false);
  sel = cr.selectItem(state, sel, "cloth"); // second unit does not exist
  assert.deepEqual(sel, ["cloth", null]);
  assert.equal(cr.selectItem(state, sel, "honey"), sel); // not in inventory at all
  // with two units, two can be selected
  const two = stock([["medicinal-herb", 2]]);
  let s2 = cr.selectItem(
    two,
    cr.createEmptySelection("manual"),
    "medicinal-herb",
  );
  s2 = cr.selectItem(two, s2, "medicinal-herb");
  assert.deepEqual(s2, ["medicinal-herb", "medicinal-herb"]);
});

test("COMBINE is enabled once at least two units are selected (capacity is a maximum)", () => {
  assert.equal(cr.canAttemptCombine([null, null]), false);
  assert.equal(cr.canAttemptCombine(["cloth", null]), false);
  assert.equal(cr.canAttemptCombine(["cloth", "honey"]), true); // enabled even without a recipe
  assert.equal(cr.canAttemptCombine(["water", null, null]), false);
  assert.equal(cr.canAttemptCombine(["water", "salt", null]), true); // a 2-input recipe in the 3-slot stove
  assert.equal(cr.canAttemptCombine(["water", "salt", "mushroom"]), true);
});

test("18. deselecting removes one unit and does not touch the inventory", () => {
  const state = stock([
    ["cloth", 1],
    ["honey", 1],
  ]);
  const snapshot = JSON.stringify(state);
  let sel = cr.selectItem(
    state,
    cr.selectItem(state, cr.createEmptySelection("manual"), "cloth"),
    "honey",
  );
  sel = cr.deselectSlot(sel, 0);
  assert.deepEqual(sel, [null, "honey"]);
  assert.equal(JSON.stringify(state), snapshot);
  // the freed slot is reused first
  assert.deepEqual(cr.selectItem(state, sel, "cloth"), ["cloth", "honey"]);
});

test("19. selecting and clearing the selection never touches the inventory", () => {
  const state = stock([
    ["cloth", 1],
    ["alcohol", 1],
  ]);
  const snapshot = JSON.stringify(state);
  const slots = state.slots;
  let sel = cr.selectItem(state, cr.createEmptySelection("manual"), "cloth");
  sel = cr.selectItem(state, sel, "alcohol");
  cr.canAttemptCombine(sel);
  cr.combine(state, "fire", sel); // a failed attempt
  const cleared = cr.createEmptySelection("manual"); // what closing does
  assert.deepEqual(cleared, [null, null]);
  assert.equal(JSON.stringify(state), snapshot);
  assert.equal(state.slots, slots);
});

test("20. every visible crafting text exists in ES and EN", () => {
  for (const lang of ["es", "en"]) {
    const c = craftingCopy[lang];
    for (const text of [
      c.title.manual,
      c.title.fire,
      c.inventoryHeading,
      c.combine,
      c.close,
      c.noRecipe,
      c.created,
      c.closeModal,
    ]) {
      assert.ok(typeof text === "string" && text.trim());
    }
  }
  assert.equal(
    craftingCopy.es.noRecipe,
    "Estos ingredientes no parecen combinar bien aquí.",
  );
  assert.equal(
    craftingCopy.en.noRecipe,
    "These ingredients don't seem to combine well here.",
  );
  assert.equal(craftingCopy.es.combine, "COMBINAR");
  assert.equal(craftingCopy.en.combine, "COMBINE");
  for (const recipe of RECIPES) {
    for (const { itemId } of [...recipe.inputs, recipe.output]) {
      assert.ok(
        getItemName(itemId, "es") !== itemId &&
          getItemName(itemId, "en") !== itemId,
      );
    }
  }
  assert.equal(
    getItemName("disinfected-bandage", "es"),
    "Vendaje desinfectado",
  );
  assert.equal(getItemName("medicinal-ointment", "en"), "Medicinal ointment");
});

test("21. craft.manual and craft.fire are the two stations of the game, each with its own station", () => {
  assert.equal(cr.CRAFT_STATION_BY_INTERACTION_ID["craft.manual"], "manual");
  assert.equal(cr.CRAFT_STATION_BY_INTERACTION_ID["craft.fire"], "fire");
  assert.deepEqual(Object.keys(cr.CRAFT_STATION_BY_INTERACTION_ID).sort(), ["craft.fire", "craft.manual"]);
});

test("22. the Apothecary places them: two table zones and one stove zone (details in apothecary.test.mjs)", () => {
  const ids = getSceneInteractionZones("apothecary-interior").map((z) => z.interactionId);
  // the crafting zones, unchanged, followed by the storage chest (not a station)
  assert.deepEqual(ids, ["craft.manual", "craft.manual", "craft.fire", "storage.apothecary"]);
  assert.ok(!Object.values(chapter1Interactions).some((i) => i.interactionId.startsWith("craft.")));
});

console.log(`\n${passed} tests passed`);
