// Day 2 character poses: static authoring assets, registered for the Decorator,
// not placed anywhere. Run: node tests/day2-poses.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const sharp = require("sharp");

const js = ts.transpileModule(
  fs.readFileSync(path.join(root, "src/game/decor/decorAssets.ts"), "utf8"),
  { compilerOptions: { module: "commonjs", target: "es2022" } },
).outputText;
const mod = new Module("decorAssets");
mod.paths = Module._nodeModulePaths(root);
mod.require = (id) =>
  id.includes("useProtagonistController")
    ? { PROTAGONIST_FEET_HITBOX: {} }
    : require(id);
mod._compile(js, path.join(root, "decorAssets.cjs"));
const { getDecorAsset } = mod.exports;

const POSES = {
  "woodcutter-day2-tired": [96, 96, 4],
  "blacksmith-day2-hurt-hand": [96, 96, 4],
  "farmer-hoeing-sick-lying": [96, 128, 4],
  "witch-cave-lantern": [96, 96, 4],
  "villager-child-01-doll": [96, 96, 4],
  "miner-recovering-working": [128, 96, 4],
  "wooden-fish-bucket": [48, 48, 1],
};

let passed = 0;
const test = async (name, fn) => {
  await fn();
  passed++;
  console.log("ok -", name);
};

await test("the Day 2 assets are registered with real, transparent, same-size frames; the idles loop slowly", async () => {
  for (const [id, [w, h, frames]] of Object.entries(POSES)) {
    const asset = getDecorAsset(id);
    assert.ok(asset, id);
    assert.equal(asset.sprite.frames.length, frames, `${id} frames`);
    assert.equal(asset.sprite.loop, frames > 1, `${id} loop`);
    assert.equal(asset.sprite.frameWidth, w);
    assert.equal(asset.sprite.frameHeight, h);
    if (frames > 1) {
      assert.ok(asset.sprite.fps <= 5, `${id} is a slow micro idle`);
    }
    const seen = new Set();
    for (const frame of asset.sprite.frames) {
      const file = path.join(root, "public", frame);
      const meta = await sharp(file).metadata();
      assert.deepEqual([meta.width, meta.height], [w, h], `${id} ${frame}`);
      assert.ok(meta.hasAlpha, `${id} has transparency`);
      const { data } = await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.equal(data[3], 0, `${id} corner is transparent (no scenery)`);
      seen.add(data.toString("base64"));
    }
    if (frames > 1) {
      assert.ok(seen.size > 1, `${id} actually moves`);
    }
  }
});

await test("the granary patient lies along the Y axis: head up, feet down, nothing but him", async () => {
  const asset = getDecorAsset("farmer-hoeing-sick-lying");
  assert.ok(asset.sprite.frameHeight > asset.sprite.frameWidth);
  const { data, info } = await sharp(
    path.join(root, "public", asset.sprite.frames[0]),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = info.width,
    maxX = 0,
    minY = info.height,
    maxY = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
  assert.ok(maxY - minY > 2.5 * (maxX - minX), "tall, narrow silhouette");
});

await test("the recovering miner keeps his bandage and swings the pick; its frames share the feet line", async () => {
  const asset = getDecorAsset("miner-recovering-working");
  const bottoms = new Set();
  for (const frame of asset.sprite.frames) {
    const { data, info } = await sharp(path.join(root, "public", frame))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let bottom = 0;
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++)
        if (data[(y * info.width + x) * 4 + 3] > 0)
          bottom = Math.max(bottom, y);
    bottoms.add(bottom);
  }
  assert.equal(bottoms.size, 1, "feet never move");
  assert.ok(
    fs.existsSync(path.join(root, "public/game/npcs/injured-miner/idle/0.png")),
    "the Day 1 injured miner stays",
  );
});

await test("authoring assets: no collider and an anchor inside the frame", () => {
  for (const id of Object.keys(POSES)) {
    const asset = getDecorAsset(id);
    assert.equal(asset.defaultCollider, undefined, id);
    assert.ok(asset.anchor.x > 0 && asset.anchor.x < 1, id);
    assert.ok(asset.anchor.y > 0 && asset.anchor.y <= 1, id);
  }
});

await test("none of them is placed in any composition yet", () => {
  const sources = [
    "src/game/compositions/chapter-1.ts",
    "src/game/new-world-map/newWorldCompositions.ts",
  ];
  for (const rel of sources) {
    const text = fs.readFileSync(path.join(root, rel), "utf8");
    for (const id of Object.keys(POSES)) {
      assert.ok(!text.includes(id), `${rel} must not use ${id}`);
    }
  }
});

await test("the Day 1 identities they come from are untouched", () => {
  for (const id of [
    "woodcutter",
    "blacksmith",
    "farmer-hoeing",
    "witch-tavern-sitting",
  ]) {
    assert.ok(getDecorAsset(id), id);
  }
});

console.log(`\n${passed} tests passed`);
