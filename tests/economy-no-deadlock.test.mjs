// The economy has no dead ends: in ANY order of buying, curing and doing the optional errand, the
// player can still finish Days 1-3. "Money must be both left over and missing, but the player must
// never get stuck by doing things in a different order" (Kilian, 2026-11-15).
// Model: only what the merchant sells is tracked (everything else is free in the world). A state is
// (what was bought, who is cured, errand done); money and what is held follow from those.
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
const { getPatientDefinitions } = at("src/game/patients/patientRegistry.ts");
const { PATIENT_PAYMENTS } = at("src/game/money/payments.ts");
const { MERCHANT_SHOP, PRODUCE_STALL, DRAPER_STALL, BUTCHER_STALL, stockForChapter } = at("src/game/shop/shops.ts");
const { STARTING_COINS } = at("src/game/money/money.ts");
const { FARMER_SAMPLE_ID, FARMER_ANALYSIS_ID } = at("src/game/patients/farmerInvestigation.ts");
const { NPC_TRADES } = at("src/game/dialogue/npcTrades.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");

const definitions = getPatientDefinitions(new Set([FARMER_SAMPLE_ID, FARMER_ANALYSIS_ID]));
const DAYS = [
  ["baker-husband", "tavern-patient", "injured-miner"],
  ["chapter2-woodcutter", "chapter2-blacksmith", "chapter2-farmer"],
  ["chapter3-duster", "chapter3-path-miner", "chapter3-stonecutter", "chapter3-insomniac"],
];
const CHAPTERS = ["chapter-1", "chapter-2", "chapter-3"];
// The FINAL market (2026-11-16): the plaza merchant sells only sugar and salt; the three stalls of the
// market street sell the rest. (Until the stalls are placed the plaza still lists cloth, onion, bone,
// garlic and candle too; the model ignores them so it does not count that stock twice.) Oranges and animal fat are
// left out: the fat is a free gift of the woodcutter. The oranges (Mill branches removed on 2026-11-16) are BOUGHT.
const PLAZA_FINAL = MERCHANT_SHOP.entries.filter((e) => ["salt", "sugar"].includes(e.itemId));
const STALLS = [PRODUCE_STALL, DRAPER_STALL, BUTCHER_STALL].flatMap((s) => s.entries).filter((e) => e.itemId !== "animal-fat");
const shopItems = [...PLAZA_FINAL, ...STALLS].map((e) => ({ ...e, day: e.fromChapter ? CHAPTERS.indexOf(e.fromChapter) : 0 }));
const shopIds = new Set(shopItems.map((e) => e.itemId));

// the items of the shop each patient needs (the rest of the ingredients are free in the world)
const patientIds = DAYS.flat();
const need = Object.fromEntries(patientIds.map((id) => {
  const def = definitions[id];
  assert.ok(def, `unknown patient ${id}`);
  const raw = getRequiredIngredients(def.requiredTreatments, createEmptyInventory());
  return [id, raw.filter((n) => shopIds.has(n.itemId)).map((n) => [n.itemId, n.quantity])];
}));
// the tavern case gets its milk from the farm woman for ONE orange (2026-11-16: the Mill oranges are gone,
// so that orange is bought at the market stall like the others)
need["tavern-patient"].push(["orange", 1]);
// the voluntary errands (from Day 2, once each): the quarry broth and the Day 2 neighbours'.
// Each one: what it needs from the shop, what it pays in coins, what it hands over besides.
const ERRANDS = Object.values(NPC_TRADES).filter((t) => t.ask).map((t) => ({
  id: t.rewardId,
  // the day index an errand starts on: its chapter, or Day 2 (index 1) when it has none
  fromDay: t.chapters ? CHAPTERS.indexOf(t.chapters[0]) : 1,
  coins: t.payCoins ?? 0,
  grants: t.grants.map((g) => [g.itemId, g.quantity]),
  raw: getRequiredIngredients(t.consumes, createEmptyInventory()).filter((n) => shopIds.has(n.itemId)).map((n) => [n.itemId, n.quantity]),
}));

test("the model reads the real data: every patient pays, and what each one needs from the shop", () => {
  for (const id of patientIds) assert.ok(PATIENT_PAYMENTS[id] > 0, id);
  assert.deepEqual(Object.fromEntries(Object.entries(need).filter(([, v]) => v.length)), {
    "baker-husband": [["cloth", 1]],
    "tavern-patient": [["salt", 1], ["orange", 1]], // + the orange of the farm woman's trade (milk)
    "injured-miner": [["cloth", 1]],
    "chapter2-blacksmith": [["cloth", 1]],
    "chapter2-woodcutter": [["orange", 1], ["sugar", 1]],
    "chapter3-duster": [["sugar", 1], ["garlic", 1]], // 2026-11-17: the base syrup takes a sugar
    "chapter3-path-miner": [["orange", 1], ["sugar", 1], ["bone", 1], ["salt", 1]],
    "chapter3-stonecutter": [["cloth", 1]],
  });
  assert.equal(ERRANDS.length, 7, "the Day 1 fisherman + the quarry broth + the three Day 2 errands + the two Day 3 ones");
  const quarry = ERRANDS.find((e) => e.id === "chapter2.quarry.miner.broth");
  assert.deepEqual(quarry.raw.sort(), [["bone", 1], ["salt", 1]].sort());
  assert.ok(RECIPES.length > 0);
});

const ITEMS = shopItems.map((e) => e.itemId);
function key(s) { return `${s.bought.join(",")}|${[...s.cured].sort().join(",")}|${s.errands}`; }
function derived(s) {
  // what is held and the coins follow from what was bought and who was cured
  const held = Object.fromEntries(ITEMS.map((id, i) => [id, s.bought[i]]));
  let coins = STARTING_COINS;
  s.bought.forEach((n, i) => { coins -= n * shopItems[i].price; });
  for (const id of s.cured) {
    coins += PATIENT_PAYMENTS[id];
    for (const [item, qty] of need[id]) held[item] -= qty;
    // the baker's thank-you once her husband is cured: Salt x1 (free)
    if (id === "baker-husband") held.salt += 1;
  }
  // the Witch of the glade gives a bone on Day 3 (free, once): modelled from the moment Day 2 is over
  if (DAYS[1].every((id) => s.cured.has(id))) held.bone += 1;
  // the baker's sugar (2026-11-16): one, on the first Day 2 talk after the flour offer; modelled from the
  // moment her husband is cured
  if (s.cured.has("baker-husband")) held.sugar += 1;
  ERRANDS.forEach((e, i) => {
    if (!(s.errands & (1 << i))) return;
    coins += e.coins;
    for (const [item, qty] of e.raw) held[item] -= qty;
    for (const [item, qty] of e.grants) if (item in held) held[item] += qty;
  });
  return { held, coins };
}
const dayOf = (cured) => DAYS.findIndex((day) => !day.every((id) => cured.has(id))); // -1 = all done

const memo = new Map();
let visited = 0;
const deadEnds = [];
function canFinish(s) {
  const k = key(s);
  if (memo.has(k)) return memo.get(k);
  memo.set(k, false); // (no cycles: every move only adds)
  visited++;
  const { held, coins } = derived(s);
  const day = dayOf(s.cured);
  if (day === -1) { memo.set(k, true); return true; }
  let ok = false;
  const moves = [];
  // buy something the merchant has by now
  shopItems.forEach((e, i) => {
    // (the daily cap: what can have been bought by today, see ShopEntry.capByChapter)
    if (e.day <= day && s.bought[i] < stockForChapter(e, CHAPTERS[day]) && coins >= e.price) {
      const bought = [...s.bought]; bought[i]++;
      moves.push({ ...s, bought });
    }
  });
  // cure a patient of the current day whose shop items are in hand
  for (const id of DAYS[day]) {
    if (!s.cured.has(id) && need[id].every(([item, qty]) => held[item] >= qty)) moves.push({ ...s, cured: new Set([...s.cured, id]) });
  }
  // the optional errands, from Day 2
  ERRANDS.forEach((e, i) => {
    if (day >= e.fromDay && !(s.errands & (1 << i)) && e.raw.every(([item, qty]) => held[item] >= qty)) moves.push({ ...s, errands: s.errands | (1 << i) });
  });
  for (const m of moves) { if (canFinish(m)) ok = true; }
  memo.set(k, ok);
  if (!ok && deadEnds.length < 5) deadEnds.push({ bought: Object.fromEntries(ITEMS.map((id, i) => [id, s.bought[i]])), cured: [...s.cured], coins });
  return ok;
}

test("from the very start, the player can always finish Days 1-3 in any order of buying, curing and the errand", () => {
  const start = { bought: ITEMS.map(() => 0), cured: new Set(), errands: 0 };
  assert.ok(canFinish(start));
  // every state that can be reached must still be able to finish: no purchase makes it impossible
  const stuck = [...memo.entries()].filter(([, v]) => !v);
  assert.equal(stuck.length, 0, `dead ends found, e.g. ${JSON.stringify(deadEnds[0])}`);
  console.log(`  (${visited} states checked, no dead end)`);
});

// ---- the ingredients the merchant does NOT sell (2026-11-15) ----------------------------------
// The model above only tracks the merchant. This ledger covers everything else for Days 1-3: how
// much the three days' cases need (and what the NPC trades eat) against what the game can give, so
// a gap like "Day 3 has no honey" fails here instead of in a played game.
// Supply = collectible instances (ids persist between days: each is picked once), one-time NPC
// trades, the Witch's gifts, and the REPEATABLE suppliers (they hand over what a known case lacks).
const { getComposition } = at("src/game/compositions/index.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { GATHER_SOURCES } = at("src/game/dialogue/storyInteractions.ts");
const { CHAPTER2_SUPPLIES, supplyDefinitions } = at("src/game/dialogue/chapter2Supplies.ts");
const { WITCH_GLADE_GIFTS } = at("src/game/dialogue/chapter3WitchDialogues.ts");

test("Days 1-3: every ingredient the merchant does not sell has enough sources", () => {
  const demand = new Map();
  const add = (map, id, n) => map.set(id, (map.get(id) ?? 0) + n);
  for (const id of patientIds) {
    for (const n of getRequiredIngredients(definitions[id].requiredTreatments, createEmptyInventory())) {
      if (!shopIds.has(n.itemId)) add(demand, n.itemId, n.quantity);
    }
  }
  // what the one-time trades take (the farm woman's orange and jar, the Witch's mushroom)
  for (const [key, trade] of Object.entries(NPC_TRADES)) {
    if (NPC_TRADES[key].ask) continue; // errands are paid in preparations, not raw
    // (what a stall sells is covered by the model above: the farm woman's orange is BOUGHT)
    for (const c of trade.consumes) if (!shopIds.has(c.itemId)) add(demand, c.itemId, c.quantity);
  }
  const supply = new Map();
  const seen = new Set();
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3"]) {
    for (const sceneId of Object.keys(WORLD_SCENES)) {
      for (const instance of getComposition(sceneId, chapter)?.instances ?? []) {
        const asset = getDecorAsset(instance.assetId);
        if (asset?.collectibleItemId && !seen.has(instance.instanceId)) {
          seen.add(instance.instanceId);
          add(supply, asset.collectibleItemId, asset.collectibleQuantity ?? 1);
        }
      }
    }
  }
  for (const [key, trade] of Object.entries(NPC_TRADES)) if (key !== "chapter2.quarry.miner") for (const g of trade.grants) add(supply, g.itemId, g.quantity);
  for (const gift of WITCH_GLADE_GIFTS) add(supply, gift.itemId, gift.quantity);
  // repeatable suppliers: they give what a known Day 2 or Day 3 case lacks (supplyDefinitions covers both)
  const repeatable = new Set([...Object.values(CHAPTER2_SUPPLIES).flat(), "honey", "flour", "animal-fat"]);
  const gathered = new Set(Object.values(GATHER_SOURCES).map((g) => g.itemId));
  const gaps = [];
  for (const [item, qty] of demand) {
    if (gathered.has(item) || repeatable.has(item)) continue;
    if ((supply.get(item) ?? 0) < qty) gaps.push(`${item}: needs ${qty}, the game gives ${supply.get(item) ?? 0}`);
  }
  assert.deepEqual(gaps, []);
});

test("the repeatable suppliers cover the cases of Day 3 too (honey, flour and alcohol)", () => {
  const covered = Object.keys(supplyDefinitions(new Set()));
  for (const id of DAYS[2]) assert.ok(covered.includes(id), `${id} is covered by the suppliers`);
  assert.ok(CHAPTER2_SUPPLIES["chapter2.tavern.bartender"].includes("alcohol"));
  const sources = fs.readFileSync(path.join(root, "src/game/dialogue/chapter2Supplies.ts"), "utf8");
  assert.ok(sources.includes('"chapter2.bakery.flourSack"') && sources.includes("honey"));
});

test("what the Doctor leaves on the ground on Day 1 is still there on Days 2 and 3, in the same place", () => {
  let checked = 0;
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, "chapter-1")?.instances ?? []) {
      if (!getDecorAsset(instance.assetId)?.collectibleItemId) continue;
      for (const chapter of ["chapter-2", "chapter-3"]) {
        const later = getComposition(sceneId, chapter)?.instances.find((i) => i.instanceId === instance.instanceId);
        assert.ok(later, `${instance.instanceId} is missing in ${chapter}`);
        assert.deepEqual([later.x, later.y, later.assetId], [instance.x, instance.y, instance.assetId]);
      }
      checked++;
    }
  }
  assert.ok(checked >= 3, "the Day 1 pick-ups are found");
});

console.log(`
${passed} tests passed`);
