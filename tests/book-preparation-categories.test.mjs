// PREPARADOS by category (2026-11-27): every recipe has one, the leaves are grouped in order and say their category.
//   node tests/book-preparation-categories.test.mjs
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
const cats = at("src/game/book/preparationCategories.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { buildPreparationSpreads } = at("src/game/book/dynamicPages.ts");
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

test("every recipe's preparation has a category, and every category has a name in both languages", () => {
  for (const recipe of RECIPES) assert.ok(cats.PREPARATION_CATEGORY[recipe.output.itemId], recipe.output.itemId);
  for (const category of cats.PREPARATION_CATEGORY_ORDER) {
    assert.ok(cats.PREPARATION_CATEGORY_NAMES[category].es && cats.PREPARATION_CATEGORY_NAMES[category].en, category);
  }
});

test("the leaves are grouped by category, in the order of the categories", () => {
  const ctx = { language: "es", patients: {}, inventory: inv.createEmptyInventory(), knownRecipeIds: new Set(RECIPES.map((r) => r.id)) };
  const order = buildPreparationSpreads(ctx).flatMap((s) => s.texts.filter((t) => t.id.endsWith("-category")).map((t) => t.content[0]));
  const names = cats.PREPARATION_CATEGORY_ORDER.map((c) => cats.PREPARATION_CATEGORY_NAMES[c].es.toUpperCase());
  const ranks = order.map((name) => names.indexOf(name));
  assert.ok(ranks.every((r) => r >= 0));
  assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), "never goes back to an earlier category");
  assert.equal(order.length, RECIPES.length, "every leaf says its category");
});

test("a leaf says its category in English too", () => {
  const ctx = { language: "en", patients: {}, inventory: inv.createEmptyInventory(), knownRecipeIds: new Set(["fire.mint-infusion"]) };
  const label = buildPreparationSpreads(ctx)[0].texts.find((t) => t.id === "fire.mint-infusion-category").content[0];
  assert.equal(label, "INFUSIONS");
});

console.log(`\n${passed} tests passed`);
