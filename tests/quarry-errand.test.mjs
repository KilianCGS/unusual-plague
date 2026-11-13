// The quarry errand (2026-11-11): a bone broth for eight coins.
//   node tests/quarry-errand.test.mjs
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

const story = at("src/game/dialogue/storyInteractions.ts");
const trades = at("src/game/dialogue/npcTrades.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const QUARRY = "chapter2.quarry.miner";
const facts = (pairs, claimed = []) => ({
  patients: {},
  inventory: pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory()),
  claimedRewards: new Set(claimed),
});
const talk = (f) => story.resolveStoryInteraction(QUARRY, f, "es", "m");

test("the quarry miner asks for a bone broth while the Doctor has none, and takes nothing", () => {
  const out = talk(facts([["bone", 1]]));
  assert.equal(out.conversation.id, "chapter2.quarry.miner.ask");
  assert.deepEqual(out.effects, []);
});

test("with the bone broth: it is taken, eight coins are paid, and the errand is marked done", () => {
  const out = talk(facts([["bone-broth", 1], ["water", 1]]));
  assert.equal(out.conversation.id, "chapter2.quarry.miner.ready");
  assert.deepEqual(out.effects, [
    { type: "take-item", itemId: "bone-broth", quantity: 1 },
    { type: "give-coins", amount: 8 },
    { type: "claim-reward", rewardId: trades.QUARRY_BROTH_REWARD_ID },
  ]);
});

test("a full bag does not matter (nothing is received but coins) and it never repeats", () => {
  const full = facts([["cloth", 1], ["salt", 1], ["water", 1], ["orange", 1], ["coal", 1], ["bone-broth", 1]]);
  assert.equal(inv.countOccupiedSlots(full.inventory), 6);
  assert.equal(talk(full).conversation.id, "chapter2.quarry.miner.ready");
  const done = talk(facts([["bone-broth", 1]], [trades.QUARRY_BROTH_REWARD_ID]));
  assert.equal(done.conversation.id, "chapter2.quarry.miner.done");
  assert.deepEqual(done.effects, []);
});

test("the broth is made at the fire from a bone, water and salt (and the merchant sells the bone from Day 2)", () => {
  const { RECIPES } = at("src/game/crafting/recipes.ts");
  const recipe = RECIPES.find((r) => r.output.itemId === "bone-broth");
  assert.equal(recipe.station, "fire");
  assert.deepEqual(recipe.inputs.map((i) => i.itemId).sort(), ["bone", "salt", "water"]);
  const shops = at("src/game/shop/shops.ts");
  const day1 = shops.shopForChapter(shops.getShop("chapter1.plaza.merchant"), "chapter-1").entries.map((e) => e.itemId);
  const day2 = shops.shopForChapter(shops.getShop("chapter1.plaza.merchant"), "chapter-2").entries.map((e) => e.itemId);
  assert.ok(!day1.includes("bone") && day2.includes("bone"));
});

console.log(`
${passed} tests passed`);
