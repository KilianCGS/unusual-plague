// DAYS 2 AND 3 PLAYED BY A SCRIPT (2026-11-16): a player who does everything, in order, using the REAL game
// functions (the story resolvers, the shop's buy effects with their daily caps, the crafting combine at each
// station) and never gets stuck. It plays Day 2 as the day2-playthrough does (three cases and the four
// errands, with the seamstress's backpack), keeps what the Doctor would carry, then plays Day 3: the Witch of
// the glade (a bone, a herb and a mint, then the omen for a pine mushroom), the woman with the duster, the path
// miner and the stonecutter on the quarry bench. It is NOT a browser test: it proves the DATA lets Day 3 be
// finished from what Day 2 leaves, and it lists exactly which people Day 3 still needs placed.
//   node tests/day3-playthrough.test.mjs
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
const ch3p = at("src/game/patients/chapter3Patients.ts");
const { getPatientPayment } = at("src/game/money/payments.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { combine } = at("src/game/crafting/crafting.ts");
const shops = at("src/game/shop/shops.ts");
const money = at("src/game/money/money.ts");
const { getComposition, getChapterInteractions } = at("src/game/compositions/index.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { shouldCloseDay2 } = at("src/game/patients/day2.ts");
const { shouldCloseDay3 } = at("src/game/patients/day3.ts");
const { GATHER_SOURCES } = at("src/game/dialogue/storyInteractions.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// ---- the state, moved by the real effects ---------------------------------------------------------
let CH = "chapter-2"; // the day being played
const WOODCUTTER = ch2p.WOODCUTTER_DAY2_ID, BLACKSMITH = ch2p.BLACKSMITH_DAY2_ID, FARMER = ch2p.FARMER_DAY2_ID;
const DUSTER = ch3p.DUSTER_DAY3_ID, PATH_MINER = ch3p.PATH_MINER_DAY3_ID, STONECUTTER = ch3p.STONECUTTER_DAY3_ID;
const state = { inventory: inv.createEmptyInventory(), coins: 12, claimed: new Set(), patients: {}, picked: new Set(), log: [] };
// what Day 1 leaves (as in the Day 2 script): two oranges and a scrap of cloth; its pick-ups are gone
for (const [id, q] of [["empty-flask", 2], ["orange", 2], ["cloth", 1]]) state.inventory = inv.addItem(state.inventory, id, q); // (two flasks since 2026-11-16)
state.picked.add("forest-medicinal-herb-dev-01");

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
    } else if (e.type === "grow-inventory") state.inventory = inv.growInventory(state.inventory, e.slots);
    else if (e.type === "give-coins") state.coins += e.amount;
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

// ---- where things are, on the day being played -----------------------------------------------------
function placedIn(interactionId, chapter = CH) {
  const interactions = getChapterInteractions(chapter);
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, chapter)?.instances ?? []) {
      if (interactions[instance.instanceId]?.interactionId === interactionId) return sceneId;
    }
  }
  return null;
}
function pickUp(itemId) {
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, CH)?.instances ?? []) {
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
  const seller = shops.shopSelling(itemId, CH);
  assert.ok(seller, `${itemId} is not on sale on ${CH}`);
  const shop = shops.shopForChapter(seller, CH); // (with the daily cap applied)
  const entry = shop.entries.find((e) => e.itemId === itemId);
  assert.ok(shops.unitsLeft(state.claimed, shop, entry) > 0, `${itemId} is sold out on ${CH} (cap ${entry.stock})`);
  assert.ok(placedIn(seller.interactionId), `${seller.interactionId} is placed on ${CH}`);
  apply(shops.buyEffects(state.claimed, shop, entry), `buy ${itemId}`);
}
const SUPPLIERS = {
  honey: ["chapter2.mill.beekeeper"],
  resin: ["chapter2.mill.neighbour"],
  coal: ["chapter2.mine.recoveringMiner"],
  alcohol: ["chapter2.tavern.bartender"],
  flour: ["chapter2.bakery.baker", "chapter2.bakery.flourSack"],
};
// ONE more unit of an item: a gathered / bought / given one, or a crafted one (its ingredients first)
function acquire(itemId) {
  // the river: one empty flask per unit of water (they come back as the water is used)
  if (itemId === "water") return void apply([{ type: "take-item", itemId: "empty-flask", quantity: 1 }, { type: "give-item", itemId, quantity: 1 }], "water");
  if (SUPPLIERS[itemId]) {
    const before = count(itemId);
    for (const id of SUPPLIERS[itemId]) {
      assert.ok(placedIn(id) || id.endsWith("flourSack"), `${id} (supplier of ${itemId}) is not placed on ${CH}`);
      talk(id);
      if (count(itemId) > before) return;
    }
    assert.fail(`no supplier gave ${itemId}`);
  }
  if (shops.shopSelling(itemId, CH)) return buy(itemId);
  assert.ok(pickUp(itemId), `${itemId} cannot be found anywhere on ${CH}`);
}
// what is already promised to a patient (a finished treatment) is not available as an ingredient
let reserved = {};
const free = (itemId) => count(itemId) - (reserved[itemId] ?? 0);
function produce(itemId) {
  const recipe = RECIPES.find((r) => r.output.itemId === itemId);
  if (!recipe) return acquire(itemId);
  for (const input of recipe.inputs) ensure(input.itemId, input.quantity);
  const result = combine(state.inventory, recipe.station, recipe.inputs.map((i) => i.itemId));
  assert.equal(result.kind, "success", `crafting ${itemId} at ${recipe.station}: ${result.kind}`);
  state.inventory = result.inventory;
}
function ensure(itemId, quantity = 1) {
  while (free(itemId) < quantity) produce(itemId);
}
function examine(patientId) {
  state.patients = cases.advancePatient(cases.advancePatient(state.patients, patientId, "discovered"), patientId, "examined");
  if (patientId === FARMER) state.claimed = new Set([...state.claimed, farmer.FARMER_SAMPLE_ID, farmer.FARMER_ANALYSIS_ID]);
}
function cure(patientId, talkId) {
  examine(patientId);
  reserved = {};
  for (const t of definitions()[patientId].requiredTreatments) {
    ensure(t.itemId, t.quantity);
    reserved[t.itemId] = (reserved[t.itemId] ?? 0) + t.quantity;
  }
  talk(talkId, `cure ${patientId}`);
  reserved = {};
  assert.equal(cases.getPatientStatus(state.patients, patientId), "treated", `${patientId} is treated`);
}

// ================================================================== DAY 2 ===============================
test("Day 2: the seamstress's backpack (one more slot), then the three cases", () => {
  assert.equal(state.inventory.capacity, 8);
  talk("chapter2.apothecaryStreet.seamstress", "backpack");
  assert.equal(state.inventory.capacity, 9, "the backpack adds a slot");
  cure(WOODCUTTER, "chapter2.forest.woodcutter");
  cure(BLACKSMITH, "chapter2.smithy.blacksmith");
  cure(FARMER, "chapter2.granary.farmer");
  assert.ok(shouldCloseDay2(state.patients, state.claimed));
});

test("Day 2: the four voluntary errands (ask, make, deliver, get paid)", () => {
  const errands = Object.values(trades.NPC_TRADES).filter((t) => t.ask && (!t.chapters || t.chapters.includes("chapter-2")));
  assert.equal(errands.length, 4);
  for (const errand of errands) {
    talk(errand.interactionId, `ask ${errand.interactionId}`);
    reserved = {};
    for (const c of errand.consumes) ensure(c.itemId, c.quantity);
    talk(errand.interactionId, `deliver ${errand.interactionId}`);
    assert.ok(state.claimed.has(errand.rewardId), `${errand.interactionId} paid`);
  }
  assert.ok(state.coins >= 0);
});

// ================================================================== DAY 3 ===============================
const DAY3_PEOPLE = {
  [DUSTER]: "chapter3.apothecaryStreet.duster",
  [PATH_MINER]: "chapter3.mountainPath.miner",
  [STONECUTTER]: "chapter3.quarry.stonecutter",
};
const WITCH = "chapter3.glade.witch";

test("Day 3 placements: the stonecutter on the quarry bench is placed (Kilian: the same man of the bench); the Witch (glade log) is placed too; the rest are still to place", () => {
  // the people Day 3 still needs and nobody has placed yet: an exact list, so placing one fails here and this
  // list gets updated (the test then asks for its place in the walkthrough)
  const pending = [...Object.values(DAY3_PEOPLE), WITCH].filter((id) => !placedIn(id, "chapter-3")).sort();
  assert.deepEqual(pending, ["chapter3.apothecaryStreet.duster", "chapter3.mountainPath.miner"]);
  assert.equal(placedIn("chapter3.quarry.stonecutter", "chapter-3"), "quarry");
  assert.equal(placedIn(WITCH, "chapter-3"), "forest-glade");
  // the spear knight in front of the mine is the guard who says the way is shut
  assert.equal(placedIn("chapter3.mountainPath.guard", "chapter-3"), "mountain-path");
  console.log(`  (still to place for Day 3: ${pending.join(", ")})`);
});

test("Day 3: the Witch gives the bone, a herb and a mint (once); the omen costs a pine mushroom (once)", () => {
  CH = "chapter-3";
  const before = { bone: count("bone"), herb: count("medicinal-herb"), mint: count("mint") };
  talk(WITCH, "witch gifts");
  assert.equal(count("bone"), before.bone + 1);
  assert.equal(count("medicinal-herb"), before.herb + 1);
  assert.equal(count("mint"), before.mint + 1);
  // a second talk gives nothing more of the gifts; the omen needs the pine mushroom
  talk(WITCH, "witch without a mushroom");
  assert.ok(!state.claimed.has("chapter3.witch.omen"), "no omen without the mushroom");
  assert.ok(pickUp("pine-mushroom"), "a pine mushroom can still be found in the glade (Day 1 pick-ups carry over)");
  talk(WITCH, "witch omen");
  assert.ok(state.claimed.has("chapter3.witch.omen"));
  assert.equal(count("pine-mushroom"), 0, "the mushroom is the price");
});

test("Day 3: the woman with the duster (mint infusion + balsamic syrup), the path miner (citrus drink + bone broth), the stonecutter (bandage + poultice)", () => {
  cure(DUSTER, DAY3_PEOPLE[DUSTER]);
  cure(PATH_MINER, DAY3_PEOPLE[PATH_MINER]);
  cure(STONECUTTER, DAY3_PEOPLE[STONECUTTER]);
});

test("Day 3 can be closed: all three cases treated, nobody stuck, the purse never went negative", () => {
  assert.ok(shouldCloseDay3(state.patients, state.claimed));
  assert.ok(state.coins >= 0);
  console.log(`  (Day 3 finished with ${state.coins} coins; bag: ${state.inventory.slots.filter(Boolean).map((s) => `${s.itemId}x${s.quantity}`).join(" ") || "empty"})`);
});

console.log(`\n${passed} tests passed`);
