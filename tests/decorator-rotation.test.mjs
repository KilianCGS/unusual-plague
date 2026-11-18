// "Rotate 45" in the Decorator (2026-11-18): `rotation` on a placed instance, next to flipX.
// Run: node tests/decorator-rotation.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const load = (rel, deps = {}) => {
  const js = ts.transpileModule(read(rel), {
    compilerOptions: { module: "commonjs", target: "es2022" },
  }).outputText;
  const mod = new Module(rel);
  mod.paths = Module._nodeModulePaths(root);
  mod.require = (id) =>
    Object.entries(deps).find(([key]) => id.includes(key))?.[1] ?? require(id);
  mod._compile(js, path.join(root, `${path.basename(rel)}.cjs`));
  return mod.exports;
};

const assets = load("src/game/decor/decorAssets.ts", {
  useProtagonistController: { PROTAGONIST_FEET_HITBOX: {} },
});
const composition = load("src/app/dev/decorator/composition.ts", {
  decorAssets: assets,
});

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const npc = assets.DECOR_ASSETS.find((a) => a.defaultCollider && a.sprite);
const make = (extra = {}) => ({
  instanceId: "s-npc-01",
  assetId: npc.id,
  x: 400,
  y: 500,
  scale: 1.17,
  flipX: false,
  colliderEnabled: true,
  zOffset: 0,
  ...extra,
});
const exported = (instance) =>
  composition.formatComposition({
    sceneId: "s",
    chapterId: "chapter-1",
    instances: [instance],
  });


test("export writes rotation only when the instance is turned, right after flipX", () => {
  assert.ok(!/rotation/.test(exported(make())), "no rotation, nothing written");
  assert.ok(!/rotation/.test(exported(make({ rotation: 0 }))));
  const text = exported(make({ flipX: true, rotation: 135 }));
  assert.ok(/"?rotation"?:\s*135/.test(text));
  assert.ok(text.indexOf("flipX") < text.indexOf("rotation") && text.indexOf("rotation") < text.indexOf("colliderEnabled"));
});

test("the Decorator has a Rotate 45 button that adds 45 degrees each press (and a reset), and the sprite draws it", () => {
  const app = read("src/app/dev/decorator/DecoratorApp.tsx");
  assert.ok(/data-testid="rotate-45"/.test(app));
  assert.ok(/\(selected\.rotation \?\? 0\) \+ 45\) % 360/.test(app));
  assert.ok(/rotation: undefined/.test(app));
  const sprite = read("src/game/decor/DecorSprite.tsx");
  assert.ok(/rotate\(\$\{instance\.rotation\}deg\)/.test(sprite));
  assert.ok(/rotation\?: number/.test(read("src/game/decor/decorTypes.ts")));
});

console.log(`\n${passed} tests passed`);
