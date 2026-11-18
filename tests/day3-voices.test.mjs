// Day 3: nobody who is placed is mute any more (2026-11-18, Kilian: give a voice to the people who had none).
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
const idx = at("src/game/compositions/index.ts");
const assets = at("src/game/decor/decorAssets.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const amb = at("src/game/dialogue/chapter34AmbientDialogues.ts");
const { resolveInteractionConversation } = at("src/game/dialogue/interactionDialogues.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

test("on Day 3 every person who is placed has an interaction (no mute people left)", () => {
  const interactions = idx.getChapterInteractions("chapter-3");
  const mute = [];
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const i of idx.getComposition(sceneId, "chapter-3")?.instances ?? []) {
      const a = assets.getDecorAsset(i.assetId);
      if (a?.category === "people" && !interactions[i.instanceId]) mute.push(`${sceneId}:${i.instanceId}`);
    }
  }
  assert.deepEqual(mute, []);
});

test("the 19 new Day 3 conversations have ES and EN, both voices and three lines, and each one belongs to a placed person", () => {
  const table = amb.chapter3PeopleDialogues;
  assert.equal(Object.keys(table).length, 19);
  const placed = new Set(Object.values(idx.getChapterInteractions("chapter-3")).map((i) => i.interactionId));
  for (const [id, conversation] of Object.entries(table)) {
    assert.equal(conversation.id, id);
    assert.ok(placed.has(id), `${id} is placed`);
    assert.equal(conversation.lines.length, 3, id);
    const speakers = new Set(conversation.lines.map((l) => l.speaker));
    assert.ok(speakers.has("subject") && speakers.has("doctor"), id);
    for (const line of conversation.lines) assert.ok(line.text.es.trim() && line.text.en.trim(), id);
    const resolved = resolveInteractionConversation(id, "en", "p", "chapter-3");
    assert.equal(resolved.lines.length, 3, `${id} resolves in the game`);
  }
});

console.log(`
${passed} tests passed`);
