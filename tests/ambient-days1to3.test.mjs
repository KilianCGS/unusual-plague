// Ambient life of Days 1 to 3 (2026-11-18): fish shadows, butterflies and bats are in chapters 1-3 and not in Day 4.
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
const layer = at("src/game/compositions/days-1-3-environment.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

test("fish shadows, butterflies and bats are in Days 1, 2 and 3 and not in Day 4; bees and river currents are in every day", () => {
  const has = (scene, chapter, asset) => (idx.getComposition(scene, chapter)?.instances ?? []).filter((i) => i.assetId === asset).length;
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3"]) {
    assert.equal(has("outskirts", chapter, "fish-shadow-horizontal"), 1, chapter);
    assert.equal(has("outskirts", chapter, "fish-shadow-vertical"), 1, chapter);
    assert.equal(has("forest", chapter, "butterfly"), 2, chapter);
    assert.equal(has("forest-glade", chapter, "butterfly"), 3, chapter);
    assert.equal(has("mine-natural-cave", chapter, "bat"), 2, chapter);
    assert.equal(has("mill-farmland", chapter, "fireflies"), 12, chapter);
  }
  assert.equal(has("outskirts", "chapter-4", "fish-shadow-horizontal"), 0);
  assert.equal(has("forest", "chapter-4", "butterfly"), 0);
  assert.equal(has("mine-natural-cave", "chapter-4", "bat"), 0);
  assert.equal(has("mill-farmland", "chapter-4", "fireflies"), 0);
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3", "chapter-4"]) {
    assert.equal(has("outskirts", chapter, "river-current"), 5, chapter);
    assert.equal(has("mill-farmland", chapter, "bee-swarm"), 4, chapter);
    assert.equal(has("forest", chapter, "bee-swarm"), 1, chapter);
  }
  assert.deepEqual(layer.getDays1To3EnvironmentInstances("outskirts", "chapter-4"), []);
});

test("the Days 1-3 layer is plain ambient life: no collider, no interaction, real assets", () => {
  const assets = at("src/game/decor/decorAssets.ts");
  for (const c of layer.days1To3EnvironmentCompositions) {
    for (const i of c.instances) {
      assert.ok(assets.getDecorAsset(i.assetId), i.assetId);
      assert.equal(i.colliderEnabled, false);
      assert.equal(i.interaction, undefined);
    }
  }
});

console.log(`\n${passed} tests passed`);
