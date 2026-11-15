// The voluntary errands of Day 2 (2026-11-15): three townspeople ask for a preparation no case needs and
// pay for it; the first conversation is the request, then a reminder, then the delivery, then the
// character goes back to his ordinary lines. What was asked counts as "needed" for the crafting gate.
//   node tests/chapter2-errands.test.mjs
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
const errands = at("src/game/dialogue/chapter2Errands.ts");
const { getCraftingTargets } = at("src/game/crafting/needs.ts");
const { getObjectives } = at("src/game/objectives/objectives.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { MERCHANT_SHOP } = at("src/game/shop/shops.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const facts = (pairs, claimed = []) => ({
  patients: {},
  inventory: pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory()),
  claimedRewards: new Set(claimed),
});
const talk = (id, f) => story.resolveStoryInteraction(id, f, "es", "x");

const CASES = [
  { id: errands.ELDER_INTERACTION_ID, flag: errands.ELDER_SYRUP_REWARD_ID, item: "onion-syrup", coins: 9, grants: [], key: "elder" },
  { id: errands.BAKERY_NEIGHBOUR_INTERACTION_ID, flag: errands.BAKERY_BROTH_REWARD_ID, item: "strong-broth", coins: 2, grants: [{ itemId: "sugar", quantity: 1 }], key: "bakery" },
  { id: errands.SEATED_MAN_INTERACTION_ID, flag: errands.SEATED_MAN_DRINK_REWARD_ID, item: "rehydration-drink", coins: 9, grants: [], key: "seated" },
];

test("the first conversation asks for the item and notes the errand; nothing is taken", () => {
  for (const c of CASES) {
    const out = talk(c.id, facts([]));
    assert.equal(out.conversation.id, `chapter2.errand.${c.key}.ask`, c.id);
    assert.deepEqual(out.effects, [{ type: "claim-reward", rewardId: `${c.flag}.asked` }], c.id);
  }
});

test("once asked, a short reminder; with the item it is taken, paid and marked done", () => {
  for (const c of CASES) {
    const reminder = talk(c.id, facts([], [`${c.flag}.asked`]));
    assert.equal(reminder.conversation.id, `chapter2.errand.${c.key}.reminder`, c.id);
    assert.deepEqual(reminder.effects, []);
    const ready = talk(c.id, facts([[c.item, 1]], [`${c.flag}.asked`]));
    assert.equal(ready.conversation.id, `chapter2.errand.${c.key}.ready`, c.id);
    assert.deepEqual(ready.effects, [
      { type: "take-item", itemId: c.item, quantity: 1 },
      ...c.grants.map((g) => ({ type: "give-item", ...g })),
      { type: "give-coins", amount: c.coins },
      { type: "claim-reward", rewardId: c.flag },
    ]);
  }
});

test("a done errand hands the character back to his ordinary lines (no story outcome)", () => {
  for (const c of CASES) {
    assert.equal(talk(c.id, facts([[c.item, 1]], [c.flag, `${c.flag}.asked`])), null, c.id);
  }
});

test("only what was asked (and not yet delivered) counts as needed: the crafting gate opens for it", () => {
  assert.deepEqual(trades.getActiveErrandNeeds(new Set()), []);
  const asked = new Set([`${errands.ELDER_SYRUP_REWARD_ID}.asked`]);
  assert.deepEqual(trades.getActiveErrandNeeds(asked), [{ itemId: "onion-syrup", quantity: 1 }]);
  assert.deepEqual(trades.getActiveErrandNeeds(new Set([...asked, errands.ELDER_SYRUP_REWARD_ID])), []);
  const targets = getCraftingTargets(trades.getActiveErrandNeeds(asked), inv.createEmptyInventory());
  assert.ok(targets.has("onion-syrup") && targets.has("chopped-onion"));
  // the quarry broth is an errand too now: it was impossible to craft before it was asked for
  const quarry = new Set(["chapter2.quarry.miner.broth.asked"]);
  assert.ok(getCraftingTargets(trades.getActiveErrandNeeds(quarry), inv.createEmptyInventory()).has("bone-broth"));
});

test("the errands panel lists what was asked, ticked when delivered", () => {
  assert.deepEqual(getObjectives({}, "es", { chapterId: "chapter-2", claimed: new Set() }), []);
  const asked = new Set([`${errands.BAKERY_BROTH_REWARD_ID}.asked`]);
  const open = getObjectives({}, "es", { chapterId: "chapter-2", claimed: asked });
  assert.deepEqual(open.map((o) => [o.text, o.done]), [["Llevar caldo fuerte a la vecina de la panadería", false]]);
  const done = getObjectives({}, "en", { chapterId: "chapter-2", claimed: new Set([...asked, errands.BAKERY_BROTH_REWARD_ID]) });
  assert.deepEqual(done.map((o) => o.done), [true]);
});

test("every errand preparation has a recipe, the shop sells its ingredients from Day 2, and texts exist in ES and EN", () => {
  const byOut = new Map(RECIPES.map((r) => [r.output.itemId, r]));
  for (const c of CASES) assert.ok(byOut.has(c.item), c.item);
  const sold = new Set(MERCHANT_SHOP.entries.filter((e) => e.fromChapter === "chapter-2" || !e.fromChapter).map((e) => e.itemId));
  for (const id of ["onion", "sugar", "bone", "salt"]) assert.ok(sold.has(id), `${id} is sold by Day 2`);
  for (const c of CASES) {
    const trade = trades.NPC_TRADES[c.id];
    for (const conv of [trade.ask, trade.ready, trade.missing.all]) {
      assert.ok(conv.lines.length > 0);
      for (const line of conv.lines) assert.ok(line.text.es && line.text.en, `${conv.id} has both languages`);
    }
    assert.ok(trade.objective.es && trade.objective.en);
  }
});

console.log(`\n${passed} tests passed`);
