// Population-batch check for the `cow` decor asset. Run: node tests/cow-asset.test.mjs
// Loads the REAL decorAssets.ts (getInstanceCollider included) and inspects the
// runtime PNGs.
import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const sharp = require("sharp");

// Transpile decorAssets.ts; its only runtime import (the protagonist hook) is
// stubbed, the collision import is type-only.
const src = fs.readFileSync(path.join(root, "src/app/dev/decorator/decorAssets.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText;
const mod = new Module("decorAssets");
mod.paths = Module._nodeModulePaths(root);
mod.require = (id) => (id.includes("useProtagonistController") ? { PROTAGONIST_FEET_HITBOX: {} } : require(id));
mod._compile(js, path.join(root, "decorAssets.cjs"));
const { DECOR_ASSETS, getDecorAsset, getInstanceCollider } = mod.exports;

let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log("ok -", name); };

const readFrame = async (rel) => {
  const { data, info } = await sharp(path.join(root, "public", rel)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};
const bottomRow = (f) => { for (let y = f.h - 1; y >= 0; y--) for (let x = 0; x < f.w; x++) if (f.data[(y * f.w + x) * 4 + 3] > 0) return y; return -1; };

const cow = getDecorAsset("cow");
const frames = await Promise.all(cow.sprite.frames.map(readFrame));
const inst = (o = {}) => ({ instanceId: "t", assetId: "cow", x: 200, y: 300, scale: 1, flipX: false, colliderEnabled: true, zOffset: 0, ...o });

await test("registered once, category animals", () => {
  assert.equal(DECOR_ASSETS.filter((a) => a.id === "cow").length, 1);
  assert.equal(cow.category, "animals");
});
await test("frames / fps / loop / anchor / scale", () => {
  assert.equal(cow.sprite.frames.length, 4);
  assert.equal(cow.sprite.fps, 4);
  assert.equal(cow.sprite.loop, true);
  assert.deepEqual(cow.anchor, { x: 0.5, y: 1 });
  assert.equal(cow.defaultScale, 1);
});
await test("every frame exists with declared dimensions", () => {
  for (const f of frames) { assert.equal(f.w, cow.sprite.frameWidth); assert.equal(f.h, cow.sprite.frameHeight); }
});
await test("feet stable: hooves/lower legs (y>=45, x>=18) identical, bottom row constant", () => {
  const w = frames[0].w;
  for (const f of frames) {
    assert.equal(bottomRow(f), bottomRow(frames[0]));
    for (let y = 45; y < f.h; y++) for (let x = 18; x < w; x++) for (let k = 0; k < 4; k++)
      assert.equal(f.data[(y * w + x) * 4 + k], frames[0].data[(y * w + x) * 4 + k], `pixel ${x},${y}`);
  }
});
await test("frames animate (not all identical)", () => {
  assert.ok(frames.slice(1).every((f) => !f.data.equals(frames[0].data)));
});
await test("collider: bigger than sheep, inside the frame, ends on the hooves", () => {
  const c = cow.defaultCollider, s = getDecorAsset("sheep").defaultCollider;
  assert.ok(c.width > s.width && c.height >= s.height);
  const ax = cow.sprite.frameWidth * cow.anchor.x, ay = cow.sprite.frameHeight * cow.anchor.y;
  assert.ok(ax + c.offsetX >= 0 && ax + c.offsetX + c.width <= cow.sprite.frameWidth);
  assert.equal(ay + c.offsetY + c.height - 1, bottomRow(frames[0]));
  // Excludes the tail (x<18) and the head/muzzle (x>62) that move.
  assert.ok(ax + c.offsetX >= 18 && ax + c.offsetX + c.width <= 63);
});
await test("frame 0 is the approved cow-v2 design (cropped, unchanged)", async () => {
  const { data, info } = await sharp(path.join(root, "art/population-batch-7/cow-v2.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, frames[0].w);
  assert.ok(data.subarray(0, frames[0].data.length).equals(frames[0].data));
});
await test("no 5th duplicate frame shipped; all 4 frames distinct", () => {
  const h = frames.map((f) => f.data.toString("base64"));
  assert.equal(new Set(h).size, 4);
});
await test("Size 0.8 / 1.0 / 1.2: anchor fixed, collider and sprite scale about it", () => {
  const c = cow.defaultCollider;
  for (const scale of [0.8, 1, 1.2]) {
    const r = getInstanceCollider(inst({ scale }), cow);
    assert.ok(Math.abs(r.width - c.width * scale) < 1e-9);
    assert.ok(Math.abs(r.height - c.height * scale) < 1e-9);
    assert.ok(Math.abs(r.x - (200 + c.offsetX * scale)) < 1e-9);
    // bottom edge = anchor.y - (gap between hooves and frame bottom) * scale
    const gap = -(c.offsetY + c.height);
    assert.ok(Math.abs(r.y + r.height - (300 - gap * scale)) < 1e-9);
  }
});
await test("flipX mirrors the collider around the anchor (same size, mirrored x)", () => {
  for (const scale of [0.8, 1, 1.2]) {
    const a = getInstanceCollider(inst({ scale }), cow), b = getInstanceCollider(inst({ scale, flipX: true }), cow);
    assert.equal(a.width, b.width); assert.equal(a.y, b.y);
    assert.ok(Math.abs((a.x - 200) + (b.x + b.width - 200)) < 1e-9);
  }
});
await test("colliderEnabled=false yields no collider", () => {
  assert.equal(getInstanceCollider(inst({ colliderEnabled: false }), cow), null);
});
await test("visual mass: cow > sheep > dog/cat/chicken", async () => {
  const mass = async (id) => { let n = 0; const f = await readFrame(`game/npcs/${id}/idle/0.png`); for (let i = 3; i < f.data.length; i += 4) if (f.data[i] > 0) n++; return n; };
  const m = { cow: await mass("cow"), sheep: await mass("sheep"), dog: await mass("dog"), cat: await mass("cat"), chicken: await mass("chicken") };
  console.log("   opaque px:", JSON.stringify(m));
  assert.ok(m.cow > m.sheep && m.sheep > m.dog && m.sheep > m.chicken && m.sheep > m.cat);
});

console.log(`\n${passed} tests passed`);
