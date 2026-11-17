// The book (Compendium) is what gives the player the clues, so what it says must match what the cases ask for (2026-11-17).
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
const { AILMENTS } = at("src/game/book/ailments.ts");
const { AILMENTS_EN } = at("src/game/book/ailmentsEn.ts");
const { getPatientDefinitions } = at("src/game/patients/patientRegistry.ts");
const { getItemName } = at("src/game/items/items.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const flat = (parts) => norm(parts.map((p) => (typeof p === "string" ? p : p.emphasis)).join(""));

test("every treatment a case asks for is named in the book entry of its ailment, in Spanish and in English", () => {
  const problems = [];
  for (const [id, def] of Object.entries(getPatientDefinitions())) {
    if (!def.requiredTreatments?.length) continue;
    const key = def.ailmentId === "suspected-poisoning" ? "poisoning" : def.ailmentId;
    const es = AILMENTS.find((a) => a.id === key);
    if (!es) { problems.push(`${id}: no ailment ${key}`); continue; }
    const esText = flat(es.treatment);
    const enText = flat(AILMENTS_EN[key].treatment);
    for (const t of def.requiredTreatments) {
      if (!esText.includes(norm(getItemName(t.itemId, "es")))) problems.push(`${id}: "${getItemName(t.itemId, "es")}" missing from the ES book (${key})`);
      if (!enText.includes(norm(getItemName(t.itemId, "en")))) problems.push(`${id}: "${getItemName(t.itemId, "en")}" missing from the EN book (${key})`);
    }
  }
  assert.deepEqual(problems, []);
});

console.log(`
${passed} tests passed`);
