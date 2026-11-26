// The errands panel (2026-11-27): an examined patient unfolds his treatment and the ingredients it still needs.
//   node tests/objectives-treatment.test.mjs
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
const { getObjectives } = at("src/game/objectives/objectives.ts");
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const stock = (pairs, capacity) => pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory(capacity));
const ctx = (inventory, storage) => ({ chapterId: "chapter-2", claimed: new Set(), inventory, storage });
const smith = (status, inventory, storage) =>
  getObjectives({ "chapter2-blacksmith": status }, "es", ctx(inventory, storage)).find((o) => o.id === "chapter2-blacksmith");

test("before the examination nothing of the treatment is shown (the diagnosis is not given away)", () => {
  assert.equal(smith("discovered", inv.createEmptyInventory()).treatment, undefined);
  assert.equal(smith("treated", inv.createEmptyInventory()).treatment, undefined);
});

test("an examined patient lists his preparations, ticked when carried", () => {
  const t = smith("examined", stock([["poultice", 1]])).treatment;
  assert.deepEqual(t.preparations.map((l) => [l.itemId, l.have]), [["poultice", true], ["medicinal-compress", false]]);
});

test("the ingredients are those still needed for what is not carried, ticked when the case + the chest hold enough", () => {
  const none = smith("examined", inv.createEmptyInventory()).treatment;
  assert.ok(none.ingredients.length > 0);
  assert.ok(none.ingredients.every((l) => l.have === false));
  const first = none.ingredients[0];
  const inChest = smith("examined", inv.createEmptyInventory(), stock([[first.itemId, first.quantity]], 10)).treatment;
  assert.equal(inChest.ingredients.find((l) => l.itemId === first.itemId).have, true, "the chest counts");
  // carrying both preparations: nothing left to make
  const ready = smith("examined", stock([["poultice", 1], ["medicinal-compress", 1]])).treatment;
  assert.deepEqual(ready.ingredients, []);
});

test("without the inventory (old callers) the panel stays as it was", () => {
  const o = getObjectives({ "chapter2-blacksmith": "examined" }, "es", { chapterId: "chapter-2", claimed: new Set() });
  assert.equal(o[0].treatment, undefined);
});

test("the panel unfolds one patient at a time, with a click on his line", () => {
  const panel = fs.readFileSync(path.join(root, "src/game/objectives/ObjectivesPanel.tsx"), "utf8");
  assert.ok(panel.includes("data-objective-treatment") && panel.includes("aria-expanded={unfolded === objective.id}"));
});

console.log(`\n${passed} tests passed`);
