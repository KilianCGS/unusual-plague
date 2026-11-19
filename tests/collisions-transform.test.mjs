import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ts = createRequire(import.meta.url)("typescript");
const src = fs.readFileSync(path.join(root, "src/app/dev/collisions/transform.ts"), "utf8");
const mod = { exports: {} };
new Function("module", "exports", "require", ts.transpileModule(src, { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText)(mod, mod.exports, () => ({}));
const { transformScene, SHAPE_KINDS } = mod.exports;
let passed = 0;
const test = (n, f) => { f(); passed++; console.log("ok -", n); };
const data = () => ({
  colliders: [{ editorId: "a", x: 100, y: 200, width: 40, height: 20 }, { editorId: "b", x: 900, y: 200, width: 40, height: 20 }],
  transitions: [{ editorId: "t", x: 1391, y: 588, width: 35, height: 115 }],
  interactions: [],
  polygons: [{ editorId: "p", points: [{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 20, y: 30 }] }],
  occluders: [{ editorId: "o", points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }], depthY: 50 }],
  stepZones: [], spawns: [{ editorId: "s", x: 500, y: 500, direction: "south" }],
});
const all = new Set(SHAPE_KINDS);
const move = (o) => transformScene(data(), { dx: 0, dy: 0, sx: 1, sy: 1, kinds: all, region: null, ...o });

test("moving everything shifts every kind, depth lines included", () => {
  const r = move({ dx: -64, dy: 10 });
  assert.deepEqual([r.colliders[0].x, r.colliders[0].y, r.colliders[0].width], [36, 210, 40]);
  assert.equal(r.transitions[0].x, 1327);
  assert.deepEqual(r.polygons[0].points[0], { x: -54, y: 20 });
  assert.equal(r.occluders[0].depthY, 60);
  assert.deepEqual([r.spawns[0].x, r.spawns[0].y, r.spawns[0].direction], [436, 510, "south"]);
});
test("a region and a kind filter leave the rest untouched", () => {
  const r = move({ dx: 5, region: { x1: 800, y1: 0, x2: 2000, y2: 2000 }, kinds: new Set(["collider"]) });
  assert.equal(r.colliders[0].x, 100);
  assert.equal(r.colliders[1].x, 905);
  assert.equal(r.transitions[0].x, 1391, "other kinds are not touched");
});
test("scaling keeps sizes in step and never collapses a shape", () => {
  const r = move({ sx: 0.5, sy: 2 });
  assert.deepEqual([r.colliders[0].x, r.colliders[0].y, r.colliders[0].width, r.colliders[0].height], [50, 400, 20, 40]);
  assert.ok(move({ sx: 0.001 }).colliders[0].width >= 1);
});
test("it never mutates the input", () => {
  const d = data(); transformScene(d, { dx: 9, dy: 9, sx: 1, sy: 1, kinds: all, region: null });
  assert.equal(d.colliders[0].x, 100);
});
console.log(`\n${passed} tests passed`);
