// The "!" over the patients of Days 2 and 3 (2026-11-25): the same rule as Day 1 (not examined, or examined and the
// treatments in hand), only for the day's own cases.
//   node tests/day23-attention.test.mjs
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
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const inv = at("src/game/inventory/inventory.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");

const SMITH = "smithy-interior-blacksmith-day2-hurt-hand-01";
const WOOD = "forest-woodcutter-day2-tired-01";
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; console.log(`ok - ${name}`); };

test("Day 2: the blacksmith and the woodcutter show the \"!\" until examined", () => {
  const marks = ch1.getAttentionInstanceIds({}, new Set(), inv.createEmptyInventory(), "chapter-2");
  assert.ok(marks.has(SMITH));
  assert.ok(marks.has(WOOD));
});

test("Day 2: once examined the mark waits for the two treatments in hand; treated, it goes", () => {
  const empty = inv.createEmptyInventory();
  const examined = { "chapter2-blacksmith": "examined" };
  assert.ok(!ch1.getAttentionInstanceIds(examined, new Set(), empty, "chapter-2").has(SMITH));
  let full = empty;
  for (const itemId of ["poultice", "medicinal-compress"]) full = inv.addItem(full, itemId, 1);
  assert.ok(ch1.getAttentionInstanceIds(examined, new Set(), full, "chapter-2").has(SMITH));
  assert.ok(!ch1.getAttentionInstanceIds({ "chapter2-blacksmith": "treated" }, new Set(), full, "chapter-2").has(SMITH));
});

test("Day 3 patients are not marked on Day 2, nor Day 2 ones on Day 1", () => {
  const day2 = ch1.getAttentionInstanceIds({}, new Set(), inv.createEmptyInventory(), "chapter-2");
  assert.ok(!day2.has("tavern-street-elderly-man-with-jug-01"));
  const day1 = ch1.getAttentionInstanceIds({}, new Set(), inv.createEmptyInventory(), "chapter-1");
  assert.ok(!day1.has(SMITH) && !day1.has(WOOD));
  const day3 = ch1.getAttentionInstanceIds({}, new Set(), inv.createEmptyInventory(), "chapter-3");
  assert.ok(day3.has("tavern-street-elderly-man-with-jug-01"));
});

console.log(`\n${passed} tests passed`);
