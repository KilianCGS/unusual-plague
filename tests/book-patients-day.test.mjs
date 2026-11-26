// The Compendium (2026-11-26): the order of the tabs, only the day's patients, the treated ones last and in green.
//   node tests/book-patients-day.test.mjs
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
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const ctx = (patients, chapterId, language = "es") => ({ language, patients, inventory: inv.createEmptyInventory(), knownRecipeIds: new Set(), chapterId });
const names = (sections) => sections.find((s) => s.id === "patients").spreads.map((s) => s.id);

test("the tabs are Pacientes first, then Ingredientes, Preparados, Dolencias (the order the tutorial teaches the rest)", () => {
  assert.deepEqual(buildBookSections(ctx({}, "chapter-1")).map((s) => s.id), ["patients", "ingredients", "preparations", "ailments"]);
  assert.deepEqual(buildBookSections(ctx({}, "chapter-1", "en")).map((s) => s.id), ["patients", "ingredients", "preparations", "ailments"]);
});

test("PACIENTES shows only the patients of the day being played", () => {
  const patients = { "baker-husband": "treated", "chapter2-woodcutter": "discovered", "chapter2-blacksmith": "examined" };
  assert.deepEqual(names(buildBookSections(ctx(patients, "chapter-2"))).sort(), ["patient-chapter2-blacksmith", "patient-chapter2-woodcutter"]);
  assert.deepEqual(names(buildBookSections(ctx(patients, "chapter-1"))), ["patient-baker-husband"]);
  assert.deepEqual(names(buildBookSections(ctx(patients, "chapter-4"))), ["patients-empty"], "Day 4 has no patients");
  // without a day nothing is filtered (the old behaviour)
  assert.equal(names(buildBookSections(ctx(patients, undefined))).length, 3);
});

test("the treated patients come last and their name and mark are green; the others are not", () => {
  const patients = { "chapter2-woodcutter": "treated", "chapter2-blacksmith": "examined", "chapter2-farmer": "discovered" };
  const spreads = buildBookSections(ctx(patients, "chapter-2")).find((s) => s.id === "patients").spreads;
  assert.deepEqual(spreads.map((s) => s.id), ["patient-chapter2-blacksmith", "patient-chapter2-farmer", "patient-chapter2-woodcutter"]);
  const tone = (spread, suffix) => spread.texts.find((t) => t.id.endsWith(suffix))?.tone;
  assert.equal(tone(spreads[2], "-name"), "good");
  assert.equal(tone(spreads[2], "-treated"), "good");
  assert.equal(tone(spreads[0], "-name"), undefined);
  assert.equal(tone(spreads[1], "-name"), undefined);
  assert.ok(read("src/game/book/BookOverlay.module.css").includes(".good"));
});

test("the game passes the day to the book", () => {
  assert.ok(read("src/game/world/GameWorld.tsx").includes("diagnosisPatientId: diagnosis?.patientId, chapterId"));
});

console.log(`
${passed} tests passed`);
