// The kitchen's cutting board: chop one ingredient (1 for 1), then cook with the chopped version.
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
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const { RECIPES, STATION_MAX_INPUTS } = at("src/game/crafting/recipes.ts");
const { ITEMS } = at("src/game/items/items.ts");
const { addItem, createEmptyInventory } = at("src/game/inventory/inventory.ts");
const cr = at("src/game/crafting/crafting.ts");
const { craftingCopy } = at("src/game/i18n/crafting.ts");
const { learnRecipesFromItems } = at("src/game/crafting/recipeDiscovery.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};
const stock = (pairs) => pairs.reduce((s, [id, q]) => addItem(s, id, q), createEmptyInventory());

test("the board chops ONE ingredient, 1 for 1: onion and mushroom (the pine mushroom no longer: 2026-11-16)", () => {
  assert.equal(STATION_MAX_INPUTS.chop, 1);
  const chopping = RECIPES.filter((r) => r.station === "chop");
  assert.deepEqual(chopping.map((r) => [r.inputs[0].itemId, r.output.itemId, r.output.quantity]), [
    ["onion", "chopped-onion", 1],
    ["mushroom", "chopped-mushroom", 1],
  ]);
  const made = cr.combine(stock([["onion", 1]]), "chop", ["onion"]);
  assert.equal(made.kind, "success");
  assert.equal(made.recipe.id, "chop.onion");
  assert.equal(cr.combine(stock([["mint", 1]]), "chop", ["mint"]).kind, "no-recipe");
});

test("the cooking recipes use the chopped / ground versions, so cooking the raw one does nothing", () => {
  const uses = (id) => RECIPES.find((r) => r.id === id).inputs.map((i) => i.itemId);
  assert.ok(uses("fire.mushroom-soup").includes("chopped-mushroom"));
  assert.ok(uses("fire.onion-syrup").includes("chopped-onion"));
  assert.ok(uses("fire.strong-broth").includes("chopped-onion"));
  assert.ok(uses("fire.balsamic-syrup").includes("crushed-garlic"));
  assert.equal(cr.combine(stock([["water", 1], ["salt", 1], ["mushroom", 1]]), "fire", ["water", "salt", "mushroom"]).kind, "no-recipe");
});

test("each new item has names in both languages and an icon file; the board has its picture", () => {
  for (const id of ["chopped-onion", "chopped-mushroom", "crushed-garlic"]) {
    assert.ok(ITEMS[id].name.es && ITEMS[id].name.en, id);
    assert.ok(fs.existsSync(path.join(root, "public", ITEMS[id].icon)), id);
    assert.ok(fs.existsSync(path.join(root, `public/game/ui/book/preparations/${id}.png`)), `${id} book page`);
  }
  assert.ok(fs.existsSync(path.join(root, "public/game/ui/cutting-board.png")));
  for (const lang of ["es", "en"]) {
    assert.ok(craftingCopy[lang].title.chop && craftingCopy[lang].action.chop);
    assert.ok(craftingCopy[lang].board.label && craftingCopy[lang].board.back);
  }
});

test("seeing an ingredient teaches its chopping or grinding recipe", () => {
  for (const [item, recipe] of [["onion", "chop.onion"], ["mushroom", "chop.mushroom"], ["garlic", "mortar.crushed-garlic"]]) {
    assert.ok(learnRecipesFromItems(new Set(), [item]).has(recipe), recipe);
  }
});

test("the kitchen opens the board and the board returns to the kitchen; Cook still waits 3 s, Chop does not", () => {
  const overlay = read("src/game/crafting/CraftingOverlay.tsx");
  assert.ok(overlay.includes("data-crafting-tab") && overlay.includes("onBackToKitchen") && overlay.includes("onOpenBoard")); // 2026-11-27: tabs Cook | Chop
  assert.ok(overlay.includes("{ fire: 3000 }"), "only the kitchen waits");
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(world.includes('setCraftingStation("chop")') && world.includes('setCraftingStation("fire")'));
});


// ---- the candle for the plaza statue (optional use of leftover coins)
{
  const { resolveStatueCandle, STATUE_CANDLE_REWARD_ID } = at("src/game/dialogue/statueCandle.ts");
  const { getShop } = at("src/game/shop/shops.ts");
  const facts = (pairs, claimed = []) => ({ patients: {}, inventory: stock(pairs), claimedRewards: new Set(claimed) });
  test("the statue takes a candle only when the Doctor carries one, once, and never by surprise", () => {
    assert.equal(resolveStatueCandle("world.plaza.statue", facts([]), "es", "x"), null, "no candle: the normal observation");
    assert.equal(resolveStatueCandle("world.plaza.well", facts([["candle", 1]]), "es", "x"), null, "only the statue");
    const done = resolveStatueCandle("world.plaza.statue", facts([["candle", 1]]), "es", "x");
    assert.deepEqual(done.effects, [
      { type: "take-item", itemId: "candle", quantity: 1 },
      { type: "claim-reward", rewardId: STATUE_CANDLE_REWARD_ID },
    ]);
    assert.ok(done.conversation.lines.length >= 2);
    assert.equal(resolveStatueCandle("world.plaza.statue", facts([["candle", 1]], [STATUE_CANDLE_REWARD_ID]), "es", "x"), null, "once");
    const en = resolveStatueCandle("world.plaza.statue", facts([["candle", 1]]), "en", "x");
    assert.equal(en.conversation.lines.length, done.conversation.lines.length);
  });
  test("the draper's stall no longer sells the candle (2026-11-18, out for now); the item and its icon stay", () => {
    const merchant = getShop("chapter1.market.draper");
    assert.equal(merchant.entries.find((e) => e.itemId === "candle"), undefined);
    assert.ok(fs.existsSync(path.join(root, "public/game/items/inventory-icons/candle.png")));
  });
}

console.log(`
${passed} tests passed`);
