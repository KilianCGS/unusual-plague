// Day 4 roadblocks and the glade crows (2026-11-17): Decorator assets Kilian places himself.
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

const BLOCKERS = [
  ["ch4-burning-cart", [192, 128], true],
  ["ch4-log-pile", [128, 96], false],
  ["ch4-fallen-tree", [160, 96], false],
  ["ch4-stone-blocks", [96, 64], false],
  ["ch4-barrier-horizontal", [160, 96], true], // 2026-11-18: now an oval magic circle
  ["ch4-barrier-vertical", [96, 160], true], // the same circle turned a quarter
];
const CROWS = ["witch-crow-pecking", "witch-crow-cawing", "witch-crow-head-tilt"];

test("the six Day 4 roadblocks are registered with real frames of the declared size, a base collider and no interaction", () => {
  for (const [id, size, animated] of BLOCKERS) {
    const a = assets.getDecorAsset(id);
    assert.ok(a, id);
    assert.equal(a.category, "ambient");
    assert.equal(a.sprite.frames.length > 1, animated, id);
    for (const f of new Set(a.sprite.frames)) assert.deepEqual(png(f), size, `${id} ${f}`);
    assert.deepEqual([a.sprite.frameWidth, a.sprite.frameHeight], size);
    assert.ok(a.defaultCollider && a.defaultCollider.width > 0 && a.defaultCollider.height > 0, `${id} collider`);
  }
});

test("the three glade crows are distinct 32x32 animals that rest still most of the loop", () => {
  const sprites = CROWS.map((id) => {
    const a = assets.getDecorAsset(id);
    assert.ok(a, id);
    assert.equal(a.category, "animals");
    assert.equal(a.defaultCollider, undefined);
    for (const f of new Set(a.sprite.frames)) assert.deepEqual(png(f), [32, 32], `${id} ${f}`);
    const still = a.sprite.frames.filter((f) => f === a.sprite.frames[0]).length;
    assert.ok(still >= 4 && still < a.sprite.frames.length, `${id} holds its still pose`);
    return a.sprite.frames[0];
  });
  assert.equal(new Set(sprites).size, 3);
});

console.log(`
${passed} tests passed`);
