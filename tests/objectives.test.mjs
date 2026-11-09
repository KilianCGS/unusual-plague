// Copper coins: the purse, what patients pay, the shop and how it is wired.
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
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
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
    if (id.includes("useProtagonistController"))
      return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const { getObjectives, PATIENT_OBJECTIVES } = at("src/game/objectives/objectives.ts");
const { CHAPTER1_PATIENTS } = at("src/game/patients/chapter1Patients.ts");
const { CHAPTER2_PATIENTS } = at("src/game/patients/chapter2Patients.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};

test("nothing is pending until the Doctor knows about a case", () => {
  assert.deepEqual(getObjectives({}, "es"), []);
});

test("a discovered case is an open errand, a treated one is done", () => {
  const open = getObjectives({ "baker-husband": "discovered" }, "es");
  assert.deepEqual(open, [{ id: "baker-husband", text: "Tratar al marido de la panadera", done: false }]);
  const examined = getObjectives({ "baker-husband": "examined" }, "en");
  assert.deepEqual(examined, [{ id: "baker-husband", text: "Treat the baker's husband", done: false }]);
  const done = getObjectives({ "baker-husband": "treated", "tavern-patient": "discovered" }, "es");
  assert.deepEqual(done.map((o) => [o.id, o.done]), [["baker-husband", true], ["tavern-patient", false]]);
});

test("every case of Days 1 and 2 has an errand text in both languages", () => {
  for (const id of [...Object.keys(CHAPTER1_PATIENTS), ...Object.keys(CHAPTER2_PATIENTS)]) {
    assert.ok(PATIENT_OBJECTIVES[id]?.es && PATIENT_OBJECTIVES[id]?.en, id);
  }
});

test("wiring: the panel is derived (not stored), mounted with the HUD, folds with R and ticks then leaves", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("getObjectives(patients, language)"));
  assert.ok(game.includes("<ObjectivesPanel"));
  const panel = read("src/game/objectives/ObjectivesPanel.tsx");
  assert.ok(panel.includes('event.key === "r"'));
  assert.ok(panel.includes("DONE_VISIBLE_MS"));
  assert.ok(/\{objective\.done \? "✓" : ""\}/.test(panel));
});

console.log(`\n${passed} tests passed`);
