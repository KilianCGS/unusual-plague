// The Compendium (2026-11-27): the index of PREPARADOS says what can be made and where; a patient's treatment opens
// its recipe, and "← Patient" goes back.
//   node tests/book-index-links.test.mjs
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
const pages = at("src/game/book/dynamicPages.ts");
const { buildBookSections } = at("src/game/book/bookPages.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { bookCopy } = at("src/game/i18n/book.ts");
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const stock = (pairs, capacity) => pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory(capacity));
const POULTICE = RECIPES.find((r) => r.id === "manual.poultice");

test("availability counts the DIRECT ingredients: case, chest, or missing", () => {
  assert.equal(pages.recipeAvailability(POULTICE, stock([["medicinal-paste", 1], ["flour", 1]])), "ready");
  assert.equal(pages.recipeAvailability(POULTICE, stock([["medicinal-paste", 1]]), stock([["flour", 1]], 10)), "chest");
  // the paste's own ingredients do not make the paste: it is missing
  assert.equal(pages.recipeAvailability(POULTICE, stock([["crushed-herb", 1], ["honey", 1], ["flour", 1]])), "missing");
  // quantities count, adding case and chest
  const ointmentBase = RECIPES.find((r) => r.id === "fire.ointment-base");
  assert.equal(pages.recipeAvailability(ointmentBase, stock([["animal-fat", 1]]), stock([["resin", 1]], 10)), "chest");
});

test("each line of the index (2026-11-26): just the name, green when it can be made (case or chest), plain ink otherwise; a link; the station", () => {
  const ctx = { language: "es", patients: {}, inventory: stock([["medicinal-paste", 1]]), storage: stock([["flour", 1]], 10), knownRecipeIds: new Set(RECIPES.map((r) => r.id)) };
  const index = pages.buildPreparationSpreads(ctx)[0];
  const line = index.texts.find((t) => t.id === "index-poultice");
  assert.ok(!/^[✓✗]/.test(line.content[0]), "no mark before the name");
  assert.ok(line.tone === "good" && line.link, "the flour waits in the chest: still green");
  const station = index.texts.find((t) => t.id === "index-poultice-station");
  assert.equal(station.content[0], bookCopy.es.stations.manual);
  assert.equal(station.align, "right");
  assert.ok(!index.texts.some((t) => t.id === "index-legend"), "the colour key is no longer on the page");
  const missing = index.texts.find((t) => t.id === "index-strong-broth");
  assert.ok(!/^[✓✗]/.test(missing.content[0]) && missing.tone === undefined && missing.link, "missing: plain ink, still a link");
});

test("with the 24 recipes known the index still ends on the page, in both languages", () => {
  for (const language of ["es", "en"]) {
    const index = pages.buildPreparationSpreads({ language, patients: {}, inventory: inv.createEmptyInventory(), knownRecipeIds: new Set(RECIPES.map((r) => r.id)) })[0];
    const lowest = Math.max(...index.texts.map((t) => t.y));
    assert.ok(lowest + 14 <= 358, `${language}: ends at ${lowest + 14}`);
    assert.equal(index.texts.filter((t) => t.link).length, 24);
  }
});

test("a patient's treatment links to its recipe page in PREPARADOS (only known recipes)", () => {
  const ctx = { language: "es", patients: { "chapter2-blacksmith": "examined" }, inventory: inv.createEmptyInventory(), knownRecipeIds: new Set(["manual.poultice", "manual.medicinal-compress"]), chapterId: "chapter-2" };
  const sections = buildBookSections(ctx);
  const sheet = sections.find((s) => s.id === "patients").spreads[0];
  const links = sheet.texts.filter((t) => t.link).map((t) => t.link);
  assert.equal(links.length, 2);
  const preparations = sections.find((s) => s.id === "preparations").spreads;
  for (const link of links) {
    const [section, spread] = link.split(":");
    assert.equal(section, "preparations");
    assert.ok(preparations.some((s) => s.id === spread), link);
  }
  // an unknown recipe stays plain text
  const unknown = buildBookSections({ ...ctx, knownRecipeIds: new Set() }).find((s) => s.id === "patients").spreads[0];
  assert.equal(unknown.texts.filter((t) => t.link).length, 0);
});

test("the book jumps between tabs on such a link and offers \"← Patient\" back, in both languages", () => {
  const overlay = read("src/game/book/BookOverlay.tsx");
  assert.ok(overlay.includes('target.includes(":")') && overlay.includes("data-book-return") && overlay.includes("setReturnTo(null)"));
  assert.equal(bookCopy.es.backToPatient, "← Paciente");
  assert.equal(bookCopy.en.backToPatient, "← Patient");
});

test("the index's colour key is a plate under the book, shown only on the index, in both languages", () => {
  const overlay = read("src/game/book/BookOverlay.tsx");
  assert.ok(overlay.includes("spread.id === PREPARATION_INDEX_ID") && overlay.includes("data-book-index-hint") && overlay.includes("copy.indexLegend"));
  assert.ok(bookCopy.es.indexLegend.includes("baúl") && bookCopy.en.indexLegend.includes("chest"));
});

console.log(`\n${passed} tests passed`);
