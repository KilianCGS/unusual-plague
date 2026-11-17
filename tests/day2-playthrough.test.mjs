// DAY 2 PLAYED BY A SCRIPT (2026-11-16): a player who does everything, in order, using the REAL game
// functions - the story resolvers (talk to people, suppliers, errand givers), the shop's buy effects,
// the crafting combine at each station - and never gets stuck. It starts from what Day 1 leaves
// (two oranges, a scrap of cloth, 12 coins), cures the three patients, does the four voluntary errands
// and checks that the day can close. It is not a browser test: it proves the DATA lets the day be
// finished and that every person / supplier / shop the flow needs is really placed in Day 2.
//   node tests/day2-playthrough.test.mjs
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

const inv = at("src/game/inventory/inventory.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const trades = at("src/game/dialogue/npcTrades.ts");
const cases = at("src/game/patients/patientCases.ts");
const registry = at("src/game/patients/patientRegistry.ts");
const farmer = at("src/game/patients/farmerInvestigation.ts");
const ch2p = at("src/game/patients/chapter2Patients.ts");
const { getPatientPayment } = at("src/game/money/payments.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { combine } = at("src/game/crafting/crafting.ts");
const shops = at("src/game/shop/shops.ts");
const money = at("src/game/money/money.ts");
const { getComposition, getChapterInteractions } = at("src/game/compositions/index.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { shouldCloseDay2 } = at("src/game/patients/day2.ts");
const { GATHER_SOURCES } = at("src/game/dialogue/storyInteractions.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// ---- the day's state, moved by the real effects -------------------------------------------------
const WOODCUTTER = ch2p.WOODCUTTER_DAY2_ID, BLACKSMITH = ch2p.BLACKSMITH_DAY2_ID, FARMER = ch2p.FARMER_DAY2_ID;
const state = {
  inventory: inv.createEmptyInventory(),
  coins: 12,
  claimed: new Set(),
  patients: {},
  picked: new Set(),
  log: [],
};
for (const [id, q] of [["orange", 2], ["cloth", 1]]) state.inventory = inv.addItem(state.inventory, id, q);
// Day 1 is over: its pickups are gone (the oranges and herb), the rest of the world is as Day 2 finds it
const DAY1_USED = new Set(["forest-medicinal-herb-dev-01"]); // (the Mill oranges were removed on 2026-11-16: they are bought)
for (const id of DAY1_USED) state.picked.add(id);

const facts = () => ({ patients: state.patients, inventory: state.inventory, claimedRewards: state.claimed });
const definitions = () => registry.getPatientDefinitions(state.claimed);

function apply(effects, label) {
  for (const e of effects) {
    if (e.type === "give-item") {
      const next = inv.addItem(state.inventory, e.itemId, e.quantity);
      assert.ok(next, `${label}: no room for ${e.itemId}`);
      state.inventory = next;
    } else if (e.type === "take-item") {
      const next = inv.removeItem(state.inventory, e.itemId, e.quantity);
      assert.ok(next, `${label}: ${e.itemId} missing`);
      state.inventory = next;
    } else if (e.type === "give-coins") state.coins += e.amount;
    else if (e.type === "take-coins") {
      const next = money.spendCoins(state.coins, e.amount);
      assert.notEqual(next, null, `${label}: cannot afford ${e.amount}`);
      state.coins = next;
    } else if (e.type === "claim-reward") state.claimed = new Set([...state.claimed, e.rewardId]);
    else if (e.type === "advance-patient") state.patients = cases.advancePatient(state.patients, e.patientId, e.to);
    else if (e.type === "treat") {
      const def = definitions()[e.patientId];
      const done = cases.treatPatient(state.patients, def, state.inventory);
      assert.ok(done, `${label}: ${e.patientId} cannot be treated with what is carried`);
      state.patients = done.state;
      state.inventory = done.inventory;
      state.coins += getPatientPayment(e.patientId);
    }
  }
}
const talk = (id, label = id) => {
  const out = story.resolveStoryInteraction(id, facts(), "es", "x");
  state.log.push(`${label}: ${out?.conversation?.id ?? "(ambient)"}`);
  if (out) apply(out.effects, label);
  return out;
};
const count = (id) => inv.countItem(state.inventory, id);

// ---- what the Doctor can do about an ingredient --------------------------------------------------
function placedInDay2(interactionId) {
  const interactions = getChapterInteractions("chapter-2");
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, "chapter-2")?.instances ?? []) {
      if (interactions[instance.instanceId]?.interactionId === interactionId) return sceneId;
    }
  }
  return null;
}
function pickUp(itemId) {
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, "chapter-2")?.instances ?? []) {
      const asset = getDecorAsset(instance.assetId);
      if (asset?.collectibleItemId === itemId && !state.picked.has(instance.instanceId)) {
        state.picked.add(instance.instanceId);
        apply([{ type: "give-item", itemId, quantity: asset.collectibleQuantity ?? 1 }], `pick ${itemId} @ ${sceneId}`);
        return true;
      }
    }
  }
  return false;
}
function buy(itemId) {
  // 2026-11-16: the plaza merchant sells sugar and salt; the market street stalls the rest
  const seller = shops.shopSelling(itemId, "chapter-2");
  assert.ok(seller, `${itemId} is not on sale on Day 2`);
  const shop = shops.shopForChapter(seller, "chapter-2");
  const entry = shop.entries.find((e) => e.itemId === itemId);
  assert.ok(shops.unitsLeft(state.claimed, shop, entry) > 0, `${itemId} is sold out`);
  assert.ok(placedInDay2(seller.interactionId), `${seller.interactionId} is placed in Day 2`);
  apply(shops.buyEffects(state.claimed, shop, entry), `buy ${itemId}`);
}
const SUPPLIERS = {
  honey: ["chapter2.mill.beekeeper"],
  resin: ["chapter2.mill.neighbour"],
  coal: ["chapter2.mine.recoveringMiner"],
  // the baker must say the sack is free first, then the sack gives flour
  flour: ["chapter2.bakery.baker", "chapter2.bakery.flourSack"],
};
function acquire(itemId) {
  if (count(itemId) > 0) return;
  if (itemId === "water") { assert.ok(Object.values(GATHER_SOURCES).some((g) => g.itemId === "water")); return void apply([{ type: "give-item", itemId, quantity: 1 }], "water"); }
  if (SUPPLIERS[itemId]) {
    for (const id of SUPPLIERS[itemId]) {
      assert.ok(placedInDay2(id) || id.endsWith("flourSack"), `${id} (supplier of ${itemId}) is not placed in Day 2`);
      talk(id);
      if (count(itemId) > 0) return;
    }
    assert.fail(`no supplier gave ${itemId}`);
  }
  if (shops.shopSelling(itemId, "chapter-2")) return buy(itemId);
  assert.ok(pickUp(itemId), `${itemId} cannot be found anywhere on Day 2`);
}
// make an item with the real recipes and stations (ingredients first)
function make(itemId) {
  if (count(itemId) > 0) return;
  const recipe = RECIPES.find((r) => r.output.itemId === itemId);
  if (!recipe) return acquire(itemId);
  for (const input of recipe.inputs) make(input.itemId);
  const result = combine(state.inventory, recipe.station, recipe.inputs.map((i) => i.itemId));
  assert.equal(result.kind, "success", `crafting ${itemId} at ${recipe.station}: ${result.kind}`);
  state.inventory = result.inventory;
}
function examine(patientId) {
  state.patients = cases.advancePatient(cases.advancePatient(state.patients, patientId, "discovered"), patientId, "examined");
  if (patientId === FARMER) state.claimed = new Set([...state.claimed, farmer.FARMER_SAMPLE_ID, farmer.FARMER_ANALYSIS_ID]);
}
function cure(patientId, talkId) {
  examine(patientId);
  for (const t of definitions()[patientId].requiredTreatments) make(t.itemId);
  talk(talkId, `cure ${patientId}`);
  assert.equal(cases.getPatientStatus(state.patients, patientId), "treated", `${patientId} is treated`);
}

test("Day 2 has everyone and everything its flow needs placed: patients, suppliers, the merchant, the errand givers", () => {
  for (const id of [
    "chapter2.forest.woodcutter", "chapter2.smithy.blacksmith", "chapter2.granary.farmer",
    "chapter2.mill.neighbour", "chapter2.mine.recoveringMiner", "chapter2.bakery.baker", "chapter2.mill.beekeeper",
    "chapter1.plaza.merchant", "chapter2.quarry.miner", "chapter2.tavernStreet.elder", "chapter2.bakeryStreet.woman", "chapter2.tavernStreet.sitting",
  ]) assert.ok(placedInDay2(id), `${id} is not placed in Day 2`);
});

test("the woodcutter: citrus drink + mint infusion, from the oranges, the shop (sugar), the river and the cottage mint", () => {
  cure(WOODCUTTER, "chapter2.forest.woodcutter");
  assert.equal(count("animal-fat"), 1, "his thank-you gift (animal fat) is in the bag");
});

test("the blacksmith: poultice + compress, from herb, honey, flour (the baker and her sack), fat, resin and cloth", () => {
  cure(BLACKSMITH, "chapter2.smithy.blacksmith");
});

test("the farmer: charcoal suspension + infusion, from the miner's coal, water and a herb", () => {
  cure(FARMER, "chapter2.granary.farmer");
});

test("the four voluntary errands: ask, make, deliver, get paid (the quarry broth, onion syrup, strong broth, rehydration drink)", () => {
  const errands = Object.values(trades.NPC_TRADES).filter((t) => t.ask && (!t.chapters || t.chapters.includes("chapter-2")));
  assert.equal(errands.length, 4);
  for (const errand of errands) {
    const before = state.coins;
    talk(errand.interactionId, `ask ${errand.interactionId}`);
    assert.ok(state.claimed.has(`${errand.rewardId}.asked`), `${errand.interactionId} noted the request`);
    // asking makes it craftable: the "needed" gate opens for it
    const needed = trades.getActiveErrandNeeds(state.claimed, "chapter-2").map((n) => n.itemId);
    assert.ok(needed.includes(errand.consumes[0].itemId));
    for (const c of errand.consumes) make(c.itemId);
    talk(errand.interactionId, `deliver ${errand.interactionId}`);
    assert.ok(state.claimed.has(errand.rewardId), `${errand.interactionId} paid`);
    assert.ok(state.coins >= before - 20);
  }
});

test("the day can be closed: all three cases treated, nobody stuck, the purse never went negative", () => {
  assert.ok(shouldCloseDay2(state.patients, state.claimed));
  assert.ok(state.coins >= 0);
  console.log(`  (Day 2 finished with ${state.coins} coins; bag: ${state.inventory.slots.filter(Boolean).map((s) => `${s.itemId}x${s.quantity}`).join(" ") || "empty"})`);
});

console.log(`\n${passed} tests passed`);
