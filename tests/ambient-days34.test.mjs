// Days 3 and 4: the people say their own ambient lines; the run to the north is lighter.
//   node tests/ambient-days34.test.mjs
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
    if (id.includes("useProtagonistController")) return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const amb = at("src/game/dialogue/chapter34AmbientDialogues.ts");
const { resolveInteractionConversation } = at("src/game/dialogue/interactionDialogues.ts");
const run = at("src/game/protagonist/protagonistRun.ts");

test("every Day 3 / Day 4 ambient conversation has ES and EN, at least two voices and an id of its day", () => {
  for (const [table, prefix] of [[amb.chapter3AmbientDialogues, "chapter3."], [amb.chapter4AmbientDialogues, "chapter4."]]) {
    assert.ok(Object.keys(table).length >= 4);
    for (const [id, conversation] of Object.entries(table)) {
      assert.ok(id.startsWith(prefix), id);
      assert.equal(conversation.id, id);
      const speakers = new Set(conversation.lines.map((l) => l.speaker));
      assert.ok(speakers.has("subject") && speakers.has("doctor"), id);
      for (const line of conversation.lines) assert.ok(line.text.es.trim() && line.text.en.trim(), id);
    }
  }
});

test("the same person says different things on each day, and Day 1/2 are untouched", () => {
  const id = "chapter2.bakeryStreet.man";
  const d2 = resolveInteractionConversation(id, "es", "p", "chapter-2");
  const d2none = resolveInteractionConversation(id, "es", "p");
  const d3 = resolveInteractionConversation(id, "es", "p", "chapter-3");
  assert.deepEqual(d2, d2none, "Day 2 keeps its own lines");
  assert.notDeepEqual(d3.lines.map((l) => l.text), d2.lines.map((l) => l.text));
  assert.match(d3.lines[0].text, /turno del pan a medias/);
  assert.equal(d3.lines[0].speaker, "p", "the subject is the person who was talked to");
  // Day 4: only the people who are awake have a night version; the others keep what they had
  const night = resolveInteractionConversation("chapter2.outskirts.fisherman", "en", "f", "chapter-4");
  assert.match(night.lines[0].text, /moon/);
  const unchanged = resolveInteractionConversation("chapter2.bakeryStreet.man", "es", "p", "chapter-4");
  assert.deepEqual(unchanged, d2);
});

test("the run to the north is lighter: longer frames (720 ms a stride) and a smaller bob", () => {
  assert.equal(run.PROTAGONIST_RUN_NORTH_FRAME_DURATION * run.PROTAGONIST_RUN_FRAME_COUNTS.north, 720);
  assert.equal(run.getFrameDuration(true, 12, 120, "north"), 60);
  assert.equal(run.getFrameDuration(true, 12, 120, "east"), 45, "the east run keeps its pace");
  assert.equal(run.getFrameDuration(true, 8, 120, "south"), 60);
  const peak = (dir) => Math.max(...Array.from({ length: 12 }, (_, f) => -run.getMovementBob(dir, true, true, f)));
  assert.ok(peak("north") < peak("east"));
});

console.log(`\n${passed} tests passed`);
