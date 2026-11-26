// The symbols over the characters (2026-11-27): yellow / blue, ! / ?, and the aura once accepted.
//   node tests/attention-marks.test.mjs
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
const { getAttentionMarks } = at("src/game/patients/attentionMarks.ts");
const { NPC_TRADES, errandAskedFlag } = at("src/game/dialogue/npcTrades.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const empty = () => inv.createEmptyInventory();
const SMITH = "smithy-interior-blacksmith-day2-hurt-hand-01";

test("a patient: yellow ! until examined, with the aura once examined, gone once treated", () => {
  assert.deepEqual(getAttentionMarks({}, new Set(), empty(), "chapter-2").get(SMITH), { kind: "patient", glyph: "!", accepted: false });
  assert.deepEqual(getAttentionMarks({ "chapter2-blacksmith": "examined" }, new Set(), empty(), "chapter-2").get(SMITH), { kind: "patient", glyph: "!", accepted: true });
  assert.equal(getAttentionMarks({ "chapter2-blacksmith": "treated" }, new Set(), empty(), "chapter-2").get(SMITH), undefined);
});

test("whoever has something for a patient's case gets a yellow ?", () => {
  // Day 1: the tavern case not noticed yet, the bartender knows about it
  const marks = getAttentionMarks({}, new Set(), empty(), "chapter-1");
  assert.deepEqual(marks.get(ch1.TAVERN_BARTENDER_INSTANCE_ID), { kind: "patient", glyph: "?", accepted: false });
  assert.equal(marks.get(ch1.TAVERN_PATIENT_INSTANCE_ID), undefined, "the man on the floor is pointed out by the bartender");
});

test("an errand: blue ! before it is asked, with the aura once asked, gone once delivered", () => {
  const trade = Object.values(NPC_TRADES).find((t) => t.interactionId === "chapter2.tavernStreet.sitting");
  const offered = getAttentionMarks({}, new Set(), empty(), "chapter-2");
  const errandMarks = [...offered.values()].filter((m) => m.kind === "errand");
  assert.ok(errandMarks.length > 0 && errandMarks.every((m) => m.glyph === "!" && !m.accepted));
  const asked = getAttentionMarks({}, new Set([errandAskedFlag(trade)]), empty(), "chapter-2");
  assert.ok([...asked.values()].some((m) => m.kind === "errand" && m.accepted));
  const done = getAttentionMarks({}, new Set([errandAskedFlag(trade), trade.rewardId]), empty(), "chapter-2");
  assert.equal([...done.values()].filter((m) => m.kind === "errand" && m.accepted).length, 0);
});

test("the scene draws the symbol it is given, 25% smaller, with the aura class when accepted", () => {
  const scene = fs.readFileSync(path.join(root, "src/game/world/ExteriorScene.tsx"), "utf8");
  assert.ok(scene.includes("attentionMarks?.get(instance.instanceId)") && scene.includes("accepted={mark.accepted}"));
  const css = fs.readFileSync(path.join(root, "src/game/ui/AttentionMark.module.css"), "utf8");
  assert.ok(css.includes("width: 9px") && css.includes("height: 18px") && css.includes(".accepted"));
});

console.log(`\n${passed} tests passed`);
