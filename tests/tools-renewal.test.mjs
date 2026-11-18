// The blacksmith renews the Doctor's tools for coins, once, only after the day's three cases (2026-11-18).
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
const tools = at("src/game/dialogue/toolsRenewal.ts");
const { resolveStoryInteraction } = at("src/game/dialogue/storyInteractions.ts");
const { CHAPTER3_PATIENTS } = at("src/game/patients/chapter3Patients.ts");
const { DAY2_COMPLETED_ID } = at("src/game/patients/day2.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const treated = Object.fromEntries(Object.keys(CHAPTER3_PATIENTS).map((id) => [id, "treated"]));
const facts = (patients, coins, claimed = [DAY2_COMPLETED_ID]) => ({ patients, coins, inventory: { capacity: 8, slots: Array(8).fill(null) }, claimedRewards: new Set(claimed) });
const talk = (f, lang = "es") => resolveStoryInteraction(tools.TOOLS_SMITH_INTERACTION_ID, f, lang, "smith");

test("the blacksmith offers the renewal only after the three Day 3 cases are treated, and never on other days", () => {
  assert.equal(tools.TOOLS_PRICE, 15);
  const before = talk(facts({}, 50));
  assert.ok(!before || !String(before.conversation?.id).startsWith("chapter3.smithy.tools"), "not before the cases");
  const noDay2 = talk(facts(treated, 50, []));
  assert.ok(!noDay2 || !String(noDay2.conversation?.id).startsWith("chapter3.smithy.tools"), "not before Day 3");
});

test("with the coins he takes them and renews the tools once; without them he says what it costs and takes nothing", () => {
  const rich = talk(facts(treated, 40));
  assert.equal(rich.conversation.id, "chapter3.smithy.tools.renew");
  assert.deepEqual(rich.effects, [{ type: "take-coins", amount: 15 }, { type: "claim-reward", rewardId: tools.TOOLS_RENEWED_ID }]);
  assert.equal(rich.conversation.lines[0].text.includes("melladas"), true);
  const poor = talk(facts(treated, 14));
  assert.equal(poor.conversation.id, "chapter3.smithy.tools.notEnough");
  assert.deepEqual(poor.effects, []);
  const done = talk(facts(treated, 40, [DAY2_COMPLETED_ID, tools.TOOLS_RENEWED_ID]));
  assert.ok(!done || !String(done.conversation?.id).startsWith("chapter3.smithy.tools"), "only once");
  const en = talk(facts(treated, 40), "en");
  assert.ok(en.conversation.lines[0].text.includes("worn"));
  assert.ok(tools.toolsNoticeCopy.es.includes("melladas") && tools.toolsNoticeCopy.en.includes("worn"));
});

console.log(`\n${passed} tests passed`);
