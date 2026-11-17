// The Witch sitting on the glade log, seen from behind (2026-11-16): a registered, static Decorator asset.
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
const inv = at("src/game/inventory/inventory.ts");
const assets = at("src/game/decor/decorAssets.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

test("the sitting-from-behind Witch is a static 96x96 Decorator asset, with no collider and no interaction yet", () => {
  const witch = assets.getDecorAsset("witch-sitting-back");
  assert.ok(witch, "registered");
  assert.equal(witch.category, "people");
  assert.equal(witch.sprite.frames.length, 1);
  assert.equal(witch.defaultCollider, undefined);
  const file = fs.readFileSync(path.join(root, "public", witch.sprite.frames[0]));
  assert.deepEqual([file.readUInt32BE(16), file.readUInt32BE(20)], [96, 96]);
  assert.ok(witch.anchor.x > 0.4 && witch.anchor.x < 0.6 && witch.anchor.y > 0.8 && witch.anchor.y < 0.95, "anchored at her seat");
});

console.log(`\n${passed} tests passed`);
