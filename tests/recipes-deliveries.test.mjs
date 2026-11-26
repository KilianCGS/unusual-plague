// Recipes and deliveries of 2026-11-27: onion syrup from the base syrup, the hydrating drink, one flask per use of
// the river (three flasks), the baker's flour and sugar in hand, the Witch's leech at the end of her words.
//   node tests/recipes-deliveries.test.mjs
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
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const c of [base + ".ts", path.join(base, "index.ts")]) if (fs.existsSync(c)) return load(c);
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    if (id.includes("useProtagonistController")) return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { getItemName } = at("src/game/items/items.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const ch2 = at("src/game/dialogue/chapter2StoryInteractions.ts");
const inv = at("src/game/inventory/inventory.ts");
const { createChapter1Storage } = at("src/game/inventory/initialInventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const stock = (pairs, capacity) => pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory(capacity));

test("the onion syrup is the base syrup cooked with chopped onion", () => {
  const recipe = RECIPES.find((r) => r.id === "fire.onion-syrup");
  assert.deepEqual(recipe.inputs.map((i) => i.itemId).sort(), ["chopped-onion", "syrup"]);
  assert.equal(recipe.station, "fire");
});

test("the drink is the hydrating drink in both languages", () => {
  assert.equal(getItemName("rehydration-drink", "es"), "Bebida hidratante");
  assert.equal(getItemName("rehydration-drink", "en"), "Hydrating drink");
});

test("the Doctor starts with three flasks; each use of the river fills one, needed or not", () => {
  assert.equal(inv.countItem(createChapter1Storage(), "empty-flask"), 3);
  const out = story.resolveStoryInteraction("gather.water", { patients: {}, inventory: stock([["empty-flask", 3]]), claimedRewards: new Set() }, "es", "river");
  assert.deepEqual(out.effects, [
    { type: "take-item", itemId: "empty-flask", quantity: 1 },
    { type: "give-item", itemId: "water", quantity: 1 },
  ]);
});

test("the baker's first talk of Day 2 puts flour and sugar in his hands; a full bag keeps the old offer", () => {
  const room = ch2.resolveChapter2StoryInteraction("chapter2.bakery.baker", { patients: {}, inventory: inv.createEmptyInventory(), claimedRewards: new Set() }, "es", "b");
  assert.ok(room.effects.some((e) => e.type === "give-item" && e.itemId === "flour"));
  assert.ok(room.effects.some((e) => e.type === "give-item" && e.itemId === "sugar"));
  assert.ok(room.conversation.lines.some((l) => l.text.includes("azúcar")));
  const full = stock(Array.from({ length: 15 }, (_, n) => [`x${n}`, 1]));
  const noRoom = ch2.resolveChapter2StoryInteraction("chapter2.bakery.baker", { patients: {}, inventory: full, claimedRewards: new Set() }, "es", "b");
  assert.ok(!noRoom.effects.some((e) => e.type === "give-item"));
  assert.ok(noRoom.effects.some((e) => e.type === "claim-reward"));
});

test("the Witch hands over the leech when she has finished talking", () => {
  const out = ch2.resolveChapter2StoryInteraction("chapter2.cave.witch", { patients: {}, inventory: inv.createEmptyInventory(), claimedRewards: new Set() }, "es", "w");
  assert.equal(out.effectsAtEnd, true);
  assert.ok(out.effects.some((e) => e.type === "give-item" && e.itemId === "leech"));
  const game = fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8");
  assert.ok(game.includes("pendingEffectsRef.current = outcome.effectsAtEnd ? outcome.effects : null"));
  assert.ok(game.includes("applyStoryEffects(pendingEffects)"));
});

console.log(`\n${passed} tests passed`);
