// Free-hand (polygon) colliders: the red shapes drawn in /dev/collisions.
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

function load(file) {
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: "commonjs", target: "es2022" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(js, file);
  return mod.exports;
}

const { collidesWithScene, rectIntersectsPolygon } = load(
  path.join(root, "src/game/collision.ts"),
);

const rect = (x, y, width, height) => ({ x, y, width, height });
const poly = (...pts) => ({
  id: "p",
  points: pts.map(([x, y]) => ({ x, y })),
});

// a right triangle with the right angle at (0,0): legs 100 long, hypotenuse
// from (100,0) to (0,100)
const triangle = poly([0, 0], [100, 0], [0, 100]);

assert.equal(rectIntersectsPolygon(rect(10, 10, 12, 12), triangle), true, "inside");
assert.equal(
  rectIntersectsPolygon(rect(70, 70, 12, 12), triangle),
  false,
  "inside the bounding box but beyond the diagonal: free",
);
assert.equal(
  rectIntersectsPolygon(rect(46, 46, 12, 12), triangle),
  true,
  "straddling the diagonal",
);
assert.equal(rectIntersectsPolygon(rect(200, 200, 12, 12), triangle), false, "far");
assert.equal(
  rectIntersectsPolygon(rect(-12, 0, 12, 12), triangle),
  false,
  "touching an edge is not a collision",
);
assert.equal(
  rectIntersectsPolygon(rect(-20, -20, 200, 200), triangle),
  true,
  "polygon fully inside the rectangle",
);
assert.equal(
  rectIntersectsPolygon(rect(40, 40, 4, 4), poly([0, 0], [10, 10])),
  false,
  "fewer than 3 points never collides",
);

// concave "L": a corner pocket must stay free
const ell = poly([0, 0], [100, 0], [100, 30], [30, 30], [30, 100], [0, 100]);
assert.equal(rectIntersectsPolygon(rect(50, 50, 12, 12), ell), false, "pocket of the L");
assert.equal(rectIntersectsPolygon(rect(10, 60, 12, 12), ell), true, "leg of the L");
assert.equal(rectIntersectsPolygon(rect(60, 10, 12, 12), ell), true, "arm of the L");

// vertex order does not matter
const reversed = poly([0, 100], [100, 0], [0, 0]);
assert.equal(rectIntersectsPolygon(rect(10, 10, 12, 12), reversed), true);
assert.equal(rectIntersectsPolygon(rect(70, 70, 12, 12), reversed), false);

// collidesWithScene: rectangles keep working and polygons add to them
const wall = { id: "w", x: 300, y: 300, width: 20, height: 20 };
assert.equal(collidesWithScene(rect(305, 305, 4, 4), [wall]), true);
assert.equal(collidesWithScene(rect(305, 305, 4, 4), [wall], [triangle]), true);
assert.equal(collidesWithScene(rect(10, 10, 4, 4), [wall]), false, "no polygons passed");
assert.equal(collidesWithScene(rect(10, 10, 4, 4), [wall], [triangle]), true);
assert.equal(collidesWithScene(rect(500, 500, 4, 4), [wall], [triangle]), false);

// wiring
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
assert.match(read("src/game/protagonist/useProtagonistController.ts"), /polygonColliders/);
assert.match(read("src/game/world/ExteriorScene.tsx"), /polygonColliders: scene\.polygonColliders/);

console.log("polygon-colliders: ok");
