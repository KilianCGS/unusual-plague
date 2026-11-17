// Day 4 is ambient (2026-11-17): what is placed in the Decorator chapter "artifacts" gets its interactions by itself.
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
const art = at("src/game/compositions/artifacts.interactions.ts");
const c4 = at("src/game/dialogue/chapter4Dialogues.ts");
const { resolveInteractionConversation } = at("src/game/dialogue/interactionDialogues.ts");
const { resolveStoryInteraction } = at("src/game/dialogue/storyInteractions.ts");
const idx = at("src/game/compositions/index.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const inst = (instanceId, assetId, scale = 1) => ({ instanceId, assetId, x: 100, y: 100, scale, flipX: false, colliderEnabled: false, zOffset: 0 });
const facts = () => ({ patients: {}, inventory: { capacity: 8, slots: Array(8).fill(null) }, claimedRewards: new Set() });

test("what is placed on Day 4 gets its interaction: poses with an artifact, the Witch in her cottage and the people awake", () => {
  const out = art.buildChapter4Interactions([
    { sceneId: "plaza", chapterId: "artifacts", instances: [inst("a", "baker-smartphone"), inst("b", "woman-sweeping-smartphone"), inst("c", "squirrel")] },
    { sceneId: "forest-cottage-interior", chapterId: "artifacts", instances: [inst("w", "witch-tavern-sitting"), inst("k", "witch-cat-sitting")] },
    { sceneId: "outskirts", chapterId: "artifacts", instances: [inst("f", "fisherman")] },
    { sceneId: "plaza", chapterId: "artifacts", instances: [inst("f2", "fisherman")] },
    { sceneId: "tavern-interior", chapterId: "artifacts", instances: [inst("t", "bartender")] },
  ]);
  assert.equal(out.a.interactionId, "chapter4.artifact.baker");
  assert.equal(out.b.interactionId, "chapter4.artifact.sweeper");
  assert.equal(out.c, undefined, "decoration stays mute");
  assert.equal(out.w.interactionId, c4.WITCH_FINAL_INTERACTION_ID);
  assert.equal(out.k, undefined, "her cat is not the Witch");
  assert.equal(out.f.interactionId, "chapter2.outskirts.fisherman");
  assert.equal(out.f2, undefined, "a fisherman far from the river has no Day 4 words");
  assert.equal(out.t.interactionId, "chapter2.tavern.bartender");
  assert.ok(out.a.zone.width > 0 && out.a.zone.height > 0);
});

test("every pose with an artifact has its own two Doctor thoughts, in both languages, and the same person always says the same", () => {
  for (const [base, slug] of Object.entries(art.ARTIFACT_SLUGS)) {
    const id = `${c4.ARTIFACT_PERSON_PREFIX}${slug}`;
    const own = c4.ARTIFACT_PERSON_THOUGHTS[slug];
    assert.equal(own.length, 2, base);
    for (const line of own) assert.ok(line.text.es.trim() && line.text.en.trim(), `${base} ES/EN`);
    const a = resolveStoryInteraction(id, facts(), "es", "p");
    const b = resolveStoryInteraction(id, facts(), "es", "p");
    assert.deepEqual(a.conversation.lines, b.conversation.lines);
    assert.equal(a.conversation.id, `chapter4.artifact.${slug}`);
    assert.equal(a.conversation.lines.length, 2);
  }
  assert.equal(new Set(Object.values(c4.ARTIFACT_PERSON_THOUGHTS).map((l) => l[0].text.es)).size, 8, "eight different people, eight different thoughts");
  // an unknown pose still gets a generic thought
  assert.equal(resolveStoryInteraction("chapter4.artifact.somebodyNew", facts(), "en", "p").conversation.lines.length, 1);
});

test("the people who are awake have night lines, and Day 4 has an interaction table of its own", () => {
  for (const id of ["chapter2.outskirts.fisherman", "chapter2.tavernStreet.elder", "chapter2.tavern.bartender", "chapter2.farm.woman"]) {
    const night = resolveInteractionConversation(id, "es", "p", "chapter-4");
    const day = resolveInteractionConversation(id, "es", "p", "chapter-2");
    assert.notDeepEqual(night.lines.map((l) => l.text), day.lines.map((l) => l.text), id);
  }
  assert.equal(typeof idx.getChapterInteractions("chapter-4"), "object");
});

console.log(`\n${passed} tests passed`);
