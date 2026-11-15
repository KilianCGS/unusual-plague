// Day 1 on paper: can a player who never wasted a coin finish the three cases?
// For every raw ingredient the three Day 1 treatments need, there must be a SOURCE (something to
// pick up in the Day 1 world, a free NPC trade, the water, or the merchant), and the merchant's
// part must fit the Doctor's starting coins. A data check, not a played game.
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
      for (const candidate of [base + ".ts", path.join(base, "index.ts")]) if (fs.existsSync(candidate)) return load(candidate);
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    if (id.includes("useProtagonistController")) return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const { getRequiredIngredients } = at("src/game/crafting/needs.ts");
const { createEmptyInventory } = at("src/game/inventory/inventory.ts");
const { CHAPTER1_PATIENTS } = at("src/game/patients/chapter1Patients.ts");
const { NPC_TRADES } = at("src/game/dialogue/npcTrades.ts");
const { GATHER_SOURCES } = at("src/game/dialogue/storyInteractions.ts");
const { MERCHANT_SHOP, shopForChapter } = at("src/game/shop/shops.ts");
const { STARTING_COINS } = at("src/game/money/money.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { getComposition } = at("src/game/compositions/index.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");

const needs = Object.values(CHAPTER1_PATIENTS).flatMap((p) => p.requiredTreatments);
const raw = getRequiredIngredients(needs, createEmptyInventory());

// what the Day 1 world lets you pick up (decor collectibles, by item, with quantity)
const pickups = new Map();
for (const sceneId of Object.keys(WORLD_SCENES)) {
  const composition = getComposition(sceneId, "chapter-1");
  for (const instance of composition?.instances ?? []) {
    const asset = getDecorAsset(instance.assetId);
    if (asset?.collectibleItemId) {
      pickups.set(asset.collectibleItemId, (pickups.get(asset.collectibleItemId) ?? 0) + (asset.collectibleQuantity ?? 1));
    }
  }
}
const gathered = new Set(Object.values(GATHER_SOURCES).map((g) => g.itemId));
const granted = new Map();
for (const trade of Object.values(NPC_TRADES)) for (const g of trade.grants) granted.set(g.itemId, (granted.get(g.itemId) ?? 0) + g.quantity);
const shop = new Map(shopForChapter(MERCHANT_SHOP, "chapter-1").entries.map((e) => [e.itemId, e]));

test("every raw ingredient of the three Day 1 cases has a source in the Day 1 world", () => {
  assert.ok(raw.length > 0);
  for (const need of raw) {
    const fromWorld = (pickups.get(need.itemId) ?? 0) + (granted.get(need.itemId) ?? 0) + (gathered.has(need.itemId) ? 99 : 0);
    const fromShop = shop.get(need.itemId)?.stock ?? 0;
    assert.ok(fromWorld + fromShop >= need.quantity, `${need.itemId} x${need.quantity}: world ${fromWorld}, shop ${fromShop}`);
  }
});

test("what has to be bought at the merchant fits the starting coins (never blocked by money)", () => {
  let cost = 0;
  for (const need of raw) {
    const fromWorld = (pickups.get(need.itemId) ?? 0) + (granted.get(need.itemId) ?? 0) + (gathered.has(need.itemId) ? 99 : 0);
    const toBuy = Math.max(0, need.quantity - fromWorld);
    if (toBuy > 0) cost += toBuy * shop.get(need.itemId).price;
  }
  assert.ok(cost <= STARTING_COINS, `to buy: ${cost} coins, starting coins: ${STARTING_COINS}`);
  console.log(`  (Day 1 shopping: ${cost} of ${STARTING_COINS} coins)`);
});

test("nothing the merchant sells on Day 1 is a trap: every item on sale is used by some Day 1 recipe", () => {
  const needed = new Set(raw.map((n) => n.itemId));
  for (const id of shop.keys()) assert.ok(needed.has(id), `${id} is on sale on Day 1 but no case needs it`);
});

console.log(`\n${passed} tests passed`);
