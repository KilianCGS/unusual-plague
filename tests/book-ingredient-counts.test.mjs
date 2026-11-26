// INGREDIENTES (2026-11-27): the number inside each painted circle is what the Doctor has, case + chest, green or red.
//   node tests/book-ingredient-counts.test.mjs
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
const { buildBookSections } = at("src/game/book/bookPages.ts");
const { INGREDIENT_CIRCLES } = at("src/game/book/ingredientCircles.ts");
const { ITEMS } = at("src/game/items/items.ts");
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const stock = (pairs, capacity) => pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory(capacity));
const counts = (language, inventory, storage) => {
  const section = buildBookSections({ language, patients: {}, inventory, storage, knownRecipeIds: new Set() }).find((s) => s.id === "ingredients");
  return Object.fromEntries(section.spreads.flatMap((s) => s.texts).map((t) => [t.id.replace("ingredient-count-", ""), { n: t.content[0], tone: t.tone }]));
};

test("every circle names a real item, 20 per language, each item once", () => {
  for (const language of ["es", "en"]) {
    const ids = INGREDIENT_CIRCLES[language].flat().map((c) => c.itemId);
    assert.equal(ids.length, 20);
    assert.equal(new Set(ids).size, 20);
    for (const id of ids) assert.ok(ITEMS[id], id);
  }
  // the same ingredient sits on the same spread in both languages
  assert.deepEqual(INGREDIENT_CIRCLES.es.map((p) => p.map((c) => c.itemId)), INGREDIENT_CIRCLES.en.map((p) => p.map((c) => c.itemId)));
});

test("the count adds the case and the chest; green above zero, red at zero", () => {
  const c = counts("es", stock([["salt", 2], ["water", 1]]), stock([["salt", 3]], 10));
  assert.deepEqual(c.salt, { n: "5", tone: "good" });
  assert.deepEqual(c.water, { n: "1", tone: "good" });
  assert.deepEqual(c.leech, { n: "0", tone: "bad" });
  // without the chest only what he carries counts
  assert.equal(counts("en", stock([["salt", 2]]), undefined).salt.n, "2");
});

test("the number is centred on its circle", () => {
  const section = buildBookSections({ language: "es", patients: {}, inventory: inv.createEmptyInventory(), knownRecipeIds: new Set() }).find((s) => s.id === "ingredients");
  const circle = INGREDIENT_CIRCLES.es[0][0];
  const text = section.spreads[0].texts.find((t) => t.id === `ingredient-count-${circle.itemId}`);
  assert.equal(text.x + text.width / 2, circle.x);
  assert.equal(text.align, "center");
});

test("the game passes the chest to the book", () => {
  assert.ok(fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8").includes("chapterId, storage }}"));
});

console.log(`\n${passed} tests passed`);
