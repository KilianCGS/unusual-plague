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

test("Day 4 draws the six scenes that have a night painting with it, and the files exist at the day size", () => {
  const sharpSizes = {
    outskirts: [1546, 1017],
    "apothecary-street": [1120, 1405],
    "bakery-street": [1168, 1346],
    "tavern-street": [1730, 909],
    "smithy-street": [1619, 971],
    forest: [1426, 1103],
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

console.log(`
${passed} tests passed`);
