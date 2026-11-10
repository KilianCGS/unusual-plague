// Day 1 can be completed with what the world offers: for the raw ingredients the
// three cases need (derived from their treatments and the recipes), the supply
// in chapter 1 (pick-ups placed in the scenes, NPC trades, the merchant, the
// baker's thank-you, the water source) covers the demand, and the coins cover
// the purchases. If a pick-up is removed or a price rises, this fails.
//   node tests/day1-solvable.test.mjs
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
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: "commonjs", target: "es2022", jsx: "react-jsx" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const c of [base + ".ts", path.join(base, "index.ts")]) if (fs.existsSync(c)) return load(c);
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const { CHAPTER1_PATIENTS, BAKER_SALT_REWARD, BAKER_HUSBAND_ID } = at("src/game/patients/chapter1Patients.ts");
const { PATIENT_PAYMENTS } = at("src/game/money/payments.ts");
const { getRequiredIngredients } = at("src/game/crafting/needs.ts");
const { createChapter1Inventory } = at("src/game/inventory/initialInventory.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { getComposition } = at("src/game/compositions/index.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { NPC_TRADES } = at("src/game/dialogue/npcTrades.ts");
const { GATHER_SOURCES } = at("src/game/dialogue/storyInteractions.ts");
const { MERCHANT_SHOP } = at("src/game/shop/shops.ts");
const { STARTING_COINS } = at("src/game/money/money.ts");

const add = (map, id, n) => map.set(id, (map.get(id) ?? 0) + n);

// ---- demand: raw ingredients of the three cases (the Doctor starts with nothing)
const demand = new Map();
for (const patient of Object.values(CHAPTER1_PATIENTS)) {
  for (const need of getRequiredIngredients(patient.requiredTreatments, createChapter1Inventory())) {
    add(demand, need.itemId, need.quantity);
  }
}

// ---- supply
const balance = new Map();
// pick-ups placed in the chapter-1 scenes
for (const sceneId of Object.keys(WORLD_SCENES)) {
  for (const instance of getComposition(sceneId, "chapter-1")?.instances ?? []) {
    const asset = getDecorAsset(instance.assetId);
    if (asset?.collectibleItemId) add(balance, asset.collectibleItemId, asset.collectibleQuantity ?? 1);
  }
}
// one-time NPC trades: what they give minus what they take
for (const trade of Object.values(NPC_TRADES)) {
  for (const g of trade.grants) add(balance, g.itemId, g.quantity);
  for (const c of trade.consumes) add(balance, c.itemId, -c.quantity);
}
// the baker's thank-you (an extra now: the merchant sells the salt too)
add(balance, BAKER_SALT_REWARD.itemId, BAKER_SALT_REWARD.quantity);
// the merchant sells cloth and salt (stock) for coins
const cloth = MERCHANT_SHOP.entries.find((e) => e.itemId === "cloth");
const salt = MERCHANT_SHOP.entries.find((e) => e.itemId === "salt");
add(balance, "cloth", cloth.stock);
add(balance, "salt", salt.stock);
// sources that refill while a need is open (the river)
const unlimited = new Set(Object.values(GATHER_SOURCES).map((s) => s.itemId));

const deficits = [];
for (const [itemId, needed] of demand) {
  if (unlimited.has(itemId)) continue;
  const have = balance.get(itemId) ?? 0;
  if (have < needed) deficits.push(`${itemId}: needs ${needed}, the world gives ${have}`);
}
// intermediate trade items (jar, oranges...) must never end below zero
for (const [itemId, have] of balance) {
  if (have < 0) deficits.push(`${itemId}: trades consume more than the world gives (${have})`);
}
assert.deepEqual(deficits, [], `Day 1 cannot be completed:\n- ${deficits.join("\n- ")}`);

// ---- money: the purchases of the day fit in the starting coins
const clothNeeded = demand.get("cloth") ?? 0;
const saltNeeded = demand.get("salt") ?? 0;
assert.ok(clothNeeded <= cloth.stock, "the merchant has enough cloth for Day 1");
assert.ok(saltNeeded <= salt.stock, "the merchant has enough salt for Day 1");
const spend = clothNeeded * cloth.price + saltNeeded * salt.price;
assert.ok(spend <= STARTING_COINS, `Day 1 purchases cost ${spend}, the Doctor starts with ${STARTING_COINS}`);
// and the three treatments pay more than they cost
const income = Object.keys(CHAPTER1_PATIENTS).reduce((sum, id) => sum + (PATIENT_PAYMENTS[id] ?? 0), 0);
assert.ok(income > spend, "Day 1 earns more than it spends");

// ---- no order is imposed any more: the salt of the tavern man's soup can be BOUGHT, so the
// tavern case never waits for the baker's thank-you
assert.ok(salt.stock >= saltNeeded, "salt is on sale in the plaza");
assert.ok(CHAPTER1_PATIENTS[BAKER_HUSBAND_ID], "the baker's husband case exists");

console.log("day1-solvable: ok");
console.log(`  demand: ${[...demand].map(([k, v]) => `${k} x${v}`).join(", ")}`);
console.log(`  coins: start ${STARTING_COINS}, purchases cost ${spend}, patients pay ${income}`);
