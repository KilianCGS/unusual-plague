// Crafting limited by the DAY (2026-11-16, Kilian): the Doctor may prepare what the day's cases need even before meeting them; anything beyond that is refused ("not needed" / "already have enough").
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
const needs = at("src/game/patients/patientNeeds.ts");
const crafting = at("src/game/crafting/needs.ts");
const registry = at("src/game/patients/patientRegistry.ts");
const inv = at("src/game/inventory/inventory.ts");
const copy = at("src/game/i18n/crafting.ts").craftingCopy;
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};
const defs = registry.getPatientDefinitions(new Set());
const ids = (list) => list.map((n) => `${n.itemId}x${n.quantity}`).sort();
const targets = (state, chapter, pairs = []) => {
  const treatments = needs.getChapterTreatments(state, defs, chapter);
  const inventory = pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory());
  return { treatments, craftable: crafting.getCraftingTargets(treatments, inventory), needed: crafting.getCraftingTargets(treatments, inv.createEmptyInventory()) };
};

test("Day 1: the cold cloth can be made BEFORE meeting the baker's husband (no case examined yet)", () => {
  const { treatments, craftable } = targets({}, "chapter-1");
  assert.deepEqual(ids(treatments), ["cold-clothx1", "disinfected-bandagex1", "medicinal-infusionx1", "medicinal-ointmentx1", "milk-with-honeyx1", "mushroom-soupx1"]);
  assert.ok(craftable.has("cold-cloth"));
  // preparations that no Day 1 case needs are refused ("not needed")
  assert.ok(!craftable.has("poultice") && !craftable.has("bone-broth"));
});

test("a second cold cloth is refused with its own message: the day needs it, but he already has it", () => {
  const { craftable, needed } = targets({}, "chapter-1", [["cold-cloth", 1]]);
  assert.ok(!craftable.has("cold-cloth"), "one is enough: the baker's husband needs one");
  assert.ok(needed.has("cold-cloth"), "the day does call for it, so the message is 'enough', not 'not needed'");
  const overlay = read("src/game/crafting/CraftingOverlay.tsx");
  assert.ok(overlay.includes('neededOutputs?.has(result.recipe.output.itemId) ? "enough" : "not-needed"'));
  assert.ok(read("src/game/world/GameWorld.tsx").includes("neededOutputs={neededOutputs}"));
  for (const lang of ["es", "en"]) {
    assert.ok(copy[lang].alreadyEnough && copy[lang].notNeeded && copy[lang].alreadyEnough !== copy[lang].notNeeded);
  }
});

test("a treated case stops counting, and each day only counts its own cases", () => {
  const treated = { "baker-husband": "treated" };
  assert.ok(!ids(needs.getChapterTreatments(treated, defs, "chapter-1")).includes("cold-clothx1"));
  const day2 = ids(needs.getChapterTreatments({}, defs, "chapter-2"));
  assert.ok(!day2.includes("cold-clothx1") && day2.length > 0);
  assert.deepEqual(needs.getChapterTreatments({}, defs, "chapter-4"), []);
  // the voluntary errands still count only once asked (unchanged)
  assert.ok(read("src/game/world/GameWorld.tsx").includes("getActiveErrandNeeds(claimedRewards, chapterId)"));
});

console.log(`\n${passed} tests passed`);
