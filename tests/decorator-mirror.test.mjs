// "Mirror" in the Decorator IS `flipX` on a placed instance (no second concept).
// Run: node tests/decorator-mirror.test.mjs
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

test("a new placement defaults to not mirrored", () => {
  const app = read("src/app/dev/decorator/DecoratorApp.tsx");
  assert.ok(/scale: asset\.defaultScale \?\? 1,\s*flipX: false,/.test(app));
});

test("the Decorator shows a Mirror checkbox bound to flipX of the selected instance", () => {
  const app = read("src/app/dev/decorator/DecoratorApp.tsx");
  assert.ok(
    /Mirror \(flipX\)\s*<input\s*type="checkbox"\s*checked=\{selected\.flipX\}/.test(
      app,
    ),
  );
  assert.ok(
    /updateInstance\(selected\.instanceId, \{\s*flipX: event\.target\.checked/.test(
      app,
    ),
  );
});

test("export keeps flipX true and false, next to scale", () => {
  assert.ok(/"?flipX"?:\s*true/.test(exported(make({ flipX: true }))));
  assert.ok(/"?flipX"?:\s*false/.test(exported(make({ flipX: false }))));
  assert.ok(/"?scale"?:\s*1\.17/.test(exported(make({ flipX: true }))));
});

test("old instances without the property load as not mirrored", () => {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  const old = make();
  delete old.flipX;
  composition.saveInstances("s", "chapter-1", [old]);
  const [loaded] = composition.loadInstances("s", "chapter-1", []);
  assert.equal(loaded.flipX, false);
  composition.saveInstances("s", "chapter-1", [make({ flipX: true })]);
  assert.equal(composition.loadInstances("s", "chapter-1", [])[0].flipX, true);
  delete globalThis.window;
});

test("duplicating instances keeps flipX", () => {
  const [copy] = composition.cloneInstances([make({ flipX: true })]);
  assert.equal(copy.flipX, true);
});

test("preview and runtime share ONE sprite: scaleX negative around the anchor, scale kept, position untouched", () => {
  const sprite = read("src/game/decor/DecorSprite.tsx");
  assert.ok(
    sprite.includes("instance.flipX ? -instance.scale : instance.scale"),
  );
  assert.ok(sprite.includes("transformOrigin"));
  assert.ok(/left: instance\.x,\s*top: instance\.y/.test(sprite));
  const app = read("src/app/dev/decorator/DecoratorApp.tsx");
  const world = read("src/game/world/ExteriorScene.tsx");
  assert.ok(app.includes("<DecorSprite") && world.includes("<DecorSprite"));
});

test("mirroring moves neither the anchor nor the scale: the box mirrors around the anchor point", () => {
  const sprite = require("typescript").transpileModule(
    read("src/game/decor/DecorSprite.tsx"),
    {
      compilerOptions: {
        module: "commonjs",
        jsx: "react-jsx",
        target: "es2022",
      },
    },
  ).outputText;
  const mod = new Module("ds");
  mod.paths = Module._nodeModulePaths(root);
  mod.require = (id) =>
    id.includes("decorAssets") || id.includes("decorTypes")
      ? assets
      : require(id);
  mod._compile(sprite, path.join(root, "ds.cjs"));
  const a = mod.exports.getSpriteBox(npc, make());
  const b = mod.exports.getSpriteBox(npc, make({ flipX: true }));
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
  assert.equal(a.y, b.y);
  const ax = npc.anchor.x;
  assert.ok(Math.abs(a.x + ax * a.width - 400) < 1e-9, "anchor stays on x");
  assert.ok(
    Math.abs(b.x + (1 - ax) * b.width - 400) < 1e-9,
    "anchor stays on x mirrored",
  );
});

test("flipping changes nothing but the flag: x, y, scale, z, collider switch, asset and id", () => {
  const before = make();
  const after = { ...before, flipX: true };
  for (const key of Object.keys(before).filter((k) => k !== "flipX")) {
    assert.deepEqual(after[key], before[key], key);
  }
  const c1 = assets.getInstanceCollider(before, npc);
  const c2 = assets.getInstanceCollider(after, npc);
  assert.equal(c1.width, c2.width);
  assert.equal(c1.height, c2.height);
  assert.equal(c1.y, c2.y);
  assert.equal(c1.id, c2.id);
});

console.log(`\n${passed} tests passed`);
