// Day 4 is at night (2026-11-12): night paintings, the night grade, the Witch's house.
//   node tests/day4-night.test.mjs
//   node tests/day3.test.mjs
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
  const source = fs.readFileSync(file, "utf8");
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = new Module(file);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  const base = mod.require.bind(mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base0 = path.resolve(path.dirname(file), id);
      for (const ext of [".ts", ".tsx", "/index.ts", ""]) {
        const candidate = base0 + ext;
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return load(candidate);
      }
    }
    if (id.endsWith(".module.css")) return new Proxy({}, { get: (_, k) => String(k) });
    return base(id);
  };
  cache.set(file, mod);
  mod._compile(out, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const { sceneForChapter, NIGHT_BACKGROUNDS, NIGHT_GRADE, NIGHT_CHAPTER_ID } = at("src/game/world/nightScenes.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { getLockedDoorNotice } = at("src/game/world/lockedDoors.ts");

test("Day 4 draws the eight scenes that have a night painting with it, and the files exist at the day size", () => {
  const sharpSizes = {
    outskirts: [1546, 1017],
    "apothecary-street": [1120, 1405],
    "bakery-street": [1168, 1346],
    "tavern-street": [1730, 909],
    "smithy-street": [1619, 971],
    forest: [1426, 1103],
    "forest-cottage": [1426, 1103],
    "doctor-room": [1254, 1254],
  };
  for (const [id, src] of Object.entries(NIGHT_BACKGROUNDS)) {
    const day = WORLD_SCENES[id];
    const night = sceneForChapter(day, NIGHT_CHAPTER_ID);
    assert.equal(night.visual.backgroundSrc, src, id);
    assert.equal(night.visual.backgroundFilter, undefined, `${id} has a painting, so no grade`);
    // everything but the picture is the day scene's: colliders, exits, arrivals, size
    assert.equal(night.colliders, day.colliders);
    assert.equal(night.exits, day.exits);
    assert.equal(night.visual.assetWidth, day.visual.assetWidth);
    const file = path.join(root, "public", src);
    assert.ok(fs.existsSync(file), src);
    const png = fs.readFileSync(file);
    assert.equal(png.readUInt32BE(16), sharpSizes[id][0], `${id} width`);
    assert.equal(png.readUInt32BE(20), sharpSizes[id][1], `${id} height`);
  }
});

test("a scene without a painting gets the night grade; other chapters and interiors are untouched", () => {
  const plaza = sceneForChapter(WORLD_SCENES.plaza, NIGHT_CHAPTER_ID);
  assert.equal(plaza.visual.backgroundSrc, WORLD_SCENES.plaza.visual.backgroundSrc);
  assert.equal(plaza.visual.backgroundFilter, NIGHT_GRADE);
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3"]) {
    assert.equal(sceneForChapter(WORLD_SCENES.plaza, chapter), WORLD_SCENES.plaza);
    assert.equal(sceneForChapter(WORLD_SCENES.outskirts, chapter), WORLD_SCENES.outskirts);
  }
  const interior = WORLD_SCENES["tavern-interior"];
  assert.equal(sceneForChapter(interior, NIGHT_CHAPTER_ID), interior);
});

test("the Witch's house opens only on Day 4", () => {
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3"]) {
    assert.ok(getLockedDoorNotice("forest-cottage", "forest-cottage-interior", chapter, "es"), chapter);
  }
  assert.equal(getLockedDoorNotice("forest-cottage", "forest-cottage-interior", "chapter-4", "es"), null);
});

test("the Witch's last conversation needs the feather (which is not spent) and happens once; the people absorbed in artifacts only get a thought", () => {
  const inv = at("src/game/inventory/inventory.ts");
  const story = at("src/game/dialogue/storyInteractions.ts");
  const c4 = at("src/game/dialogue/chapter4Dialogues.ts");
  const facts = (pairs, claimed = []) => ({
    patients: {},
    inventory: pairs.reduce((st, [id, q]) => inv.addItem(st, id, q), inv.createEmptyInventory()),
    claimedRewards: new Set(claimed),
  });
  const talk = (id, f) => story.resolveStoryInteraction(id, f, "es", "w");
  // without the feather: a thought, nothing recorded
  const without = talk(c4.WITCH_FINAL_INTERACTION_ID, facts([["water", 1]]));
  assert.equal(without.conversation.id, "chapter4.witch.noFeather");
  assert.deepEqual(without.effects, []);
  // with it: the final conversation, only the memory is claimed (the feather stays)
  const final = talk(c4.WITCH_FINAL_INTERACTION_ID, facts([["black-feather", 1]]));
  assert.equal(final.conversation.id, "chapter4.witch.final");
  assert.deepEqual(final.effects, [{ type: "claim-reward", rewardId: c4.WITCH_FINAL_ID }]);
  assert.ok(final.conversation.lines.length >= 12);
  // after it: a farewell
  const farewell = talk(c4.WITCH_FINAL_INTERACTION_ID, facts([["black-feather", 1]], [c4.WITCH_FINAL_ID]));
  assert.equal(farewell.conversation.id, "chapter4.witch.farewell");
  // a person with an artifact: one fixed thought, no effects, always the same
  const a = talk("chapter4.artifact.baker", facts([]));
  const b = talk("chapter4.artifact.baker", facts([]));
  assert.equal(a.conversation.id, b.conversation.id);
  assert.deepEqual(a.effects, []);
  assert.equal(a.conversation.lines.length, 1);
  assert.match(a.conversation.lines[0].text, /^\(.+\)$/);
});

test("the errands panel shows 'see the Witch' on Day 4 and ticks it when she has spoken", () => {
  const { getObjectives } = at("src/game/objectives/objectives.ts");
  const c4 = at("src/game/dialogue/chapter4Dialogues.ts");
  assert.equal(getObjectives({}, "es").length, 0);
  assert.equal(getObjectives({}, "es", { chapterId: "chapter-3", claimed: new Set() }).length, 0);
  const pending = getObjectives({}, "es", { chapterId: "chapter-4", claimed: new Set() });
  assert.deepEqual(pending.map((o) => [o.text, o.done]), [["Ir a ver a la bruja", false]]);
  const done = getObjectives({}, "en", { chapterId: "chapter-4", claimed: new Set([c4.WITCH_FINAL_ID]) });
  assert.deepEqual(done.map((o) => [o.text, o.done]), [["Go and see the Witch", true]]);
});

test("the end card says The end in both languages and the ending picture exists at its size", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { EndCard } = at("src/game/ui/EndCard.tsx");
  assert.ok(renderToStaticMarkup(React.createElement(EndCard, { language: "es" })).includes("FIN"));
  assert.ok(renderToStaticMarkup(React.createElement(EndCard, { language: "en" })).includes("The end"));
  const { NARRATIVE_ILLUSTRATIONS } = at("src/game/narrative/illustrations.ts");
  const picture = NARRATIVE_ILLUSTRATIONS["doctor-writing-night"];
  const png = fs.readFileSync(path.join(root, "public", picture.src));
  assert.equal(png.readUInt32BE(16), picture.width);
  assert.equal(png.readUInt32BE(20), picture.height);
});

console.log(`
${passed} tests passed`);

// The Botica has its own night painting (2026-11-13), the same size as the day one.
{
  const ns = at("src/game/world/nightScenes.ts");
  const file = path.join(root, "public", ns.APOTHECARY_NIGHT_BACKGROUND);
  assert.ok(fs.existsSync(file), ns.APOTHECARY_NIGHT_BACKGROUND);
  const png = fs.readFileSync(file);
  const day = fs.readFileSync(path.join(root, "public/game/areas/apothecary/apothecary-main-zone-background.png"));
  assert.equal(png.readUInt32BE(16), day.readUInt32BE(16));
  assert.equal(png.readUInt32BE(20), day.readUInt32BE(20));
  const game = fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8");
  assert.ok(game.includes("backgroundSrc={chapterId === NIGHT_CHAPTER_ID ? APOTHECARY_NIGHT_BACKGROUND : undefined}"));
  console.log("ok - the Botica night painting exists at the day size and Day 4 uses it");
}
