// The ambient life sprites (2026-11-18): bee, butterfly, pigeon, bat, fireflies, fish shadows and the river current.
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
const assets = at("src/game/decor/decorAssets.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };
const png = (url) => { const f = fs.readFileSync(path.join(root, "public", url)); return [f.readUInt32BE(16), f.readUInt32BE(20)]; };

const LIFE = [
  ["butterfly", "animals", [24, 24]], ["bee", "animals", [24, 24]], ["pigeon", "animals", [32, 32]], ["pigeon-turned", "animals", [32, 32]], ["bee-swarm", "animals", [32, 32]], ["bat", "animals", [32, 32]],
  ["fireflies", "ambient", [32, 32]], ["fish-shadow-horizontal", "ambient", [32, 16]],
  ["fish-shadow-vertical", "ambient", [16, 32]], ["river-current", "ambient", [64, 32]],
];

test("the ten ambient life sprites are registered, animated, with real frames of their size, and without collider or interaction", () => {
  for (const [id, category, size] of LIFE) {
    const a = assets.getDecorAsset(id);
    assert.ok(a, id);
    assert.equal(a.category, category, id);
    assert.ok(new Set(a.sprite.frames).size >= 4, `${id} moves`);
    assert.deepEqual([a.sprite.frameWidth, a.sprite.frameHeight], size, id);
    for (const f of new Set(a.sprite.frames)) assert.deepEqual(png(f), size, `${id} ${f}`);
    assert.equal(a.defaultCollider, undefined, id);
  }
});

const art = at("src/game/compositions/artifacts.interactions.ts");
const c4 = at("src/game/dialogue/chapter4Dialogues.ts");
const NEW_DAY4 = ["child-sitting", "child-sitting-legs", "fainted-man", "fainted-woman", "old-man-stool", "old-man-bench", "man-tankard-bust", "woman-jug-bust"];

test("the new Day 4 smartphone poses (child, fainted, old man, someone with a tankard) are registered, animated and have thoughts of the Doctor", () => {
  for (const base of NEW_DAY4) {
    const a = assets.getDecorAsset(`${base}-smartphone`);
    assert.ok(a, base);
    assert.equal(a.category, "people");
    assert.deepEqual([a.sprite.frameWidth, a.sprite.frameHeight], [96, 96]);
    assert.equal(new Set(a.sprite.frames).size, 9, base);
    for (const f of new Set(a.sprite.frames)) assert.deepEqual(png(f), [96, 96], `${base} ${f}`);
    assert.equal(a.defaultCollider, undefined, base);
    const slug = art.ARTIFACT_SLUGS[base];
    assert.ok(slug && c4.ARTIFACT_PERSON_THOUGHTS[slug]?.length === 2, `${base} has its thoughts`);
  }
});

console.log(`\n${passed} tests passed`);
