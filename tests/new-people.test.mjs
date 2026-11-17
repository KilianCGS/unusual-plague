// The new people (2026-11-16): ten PixelLab characters imported as animated Decorator assets, ready to place.
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

const IDS = [
  "elderly-man-seated", "elderly-woman-seated", "boy-spinning-top", "girl-jump-rope", "carpenter-workbench",
  "knight-spear-shield", "acolyte-bell", "praying-old-woman-back", "praying-man-side", "praying-young-woman",
];

test("the ten new people are registered once, as people, with every frame on disk and the same size", () => {
  const all = assets.DECOR_ASSETS.map((a) => a.id);
  assert.equal(new Set(all).size, all.length, "no duplicate asset ids");
  for (const id of IDS) {
    const a = assets.getDecorAsset(id);
    assert.ok(a, `${id} is registered`);
    assert.equal(a.category, "people");
    assert.equal(a.defaultCollider, undefined, `${id} has no collider until placed`);
    assert.ok(a.sprite.frames.length >= 9 && a.sprite.fps > 0 && a.sprite.loop);
    for (const f of a.sprite.frames) {
      const file = fs.readFileSync(path.join(root, "public", f));
      assert.deepEqual([file.readUInt32BE(16), file.readUInt32BE(20)], [a.sprite.frameWidth, a.sprite.frameHeight], `${id} ${f}`);
    }
    // the anchor is the feet of the figure: inside the frame, in the lower part
    assert.ok(a.anchor.x > 0.3 && a.anchor.x < 0.7 && a.anchor.y > 0.6 && a.anchor.y <= 1, `${id} anchor ${JSON.stringify(a.anchor)}`);
    assert.ok(a.headHeight > 30 && a.headHeight < 100, `${id} head height`);
  }
});

console.log(`\n${passed} tests passed`);
