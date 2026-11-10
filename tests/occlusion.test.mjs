// Depth shapes (violet in /dev/collisions): parts of the background that cover
// the Doctor while his feet are above the shape's depth line.
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

function load(file) {
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: "commonjs", target: "es2022" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(js, file);
  return mod.exports;
}
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const { occlusionClipPath, occlusionZIndex } = load(path.join(root, "src/game/occlusion.ts"));
assert.equal(
  occlusionClipPath([
    { x: 10, y: 20 },
    { x: 110, y: 20 },
    { x: 60, y: 90 },
  ]),
  "polygon(10px 20px, 110px 20px, 60px 90px)",
);

// the depth line is read against the soles of the feet box (anchor - 7), the
// edge the red colliders stop: at a collider edge drawn on the line the Doctor
// is still behind
const FEET = { offsetX: -6, offsetY: -19, width: 12, height: 12 };
assert.equal(occlusionZIndex(442, FEET), 451); // 442 + 7 (anchor gap) + 2 (hand-drawn margin)
{
  const colliderTop = 441; // feet box bottom can reach it: anchor = 441 + 7
  const anchorAtLimit = colliderTop - (FEET.offsetY + FEET.height);
  assert.equal(anchorAtLimit, 448);
  assert.ok(Math.round(anchorAtLimit) < occlusionZIndex(442, FEET), "still behind at the collider");
  // a diagonal collider edge 0.7 below the hand-drawn line: still behind
  assert.ok(Math.round(442.7 + 7) < occlusionZIndex(442, FEET));
  // and clearly in front once he is well past the line (10 units)
  assert.ok(Math.round(442 + 10 + 7) > occlusionZIndex(442, FEET));
}

// the export of the tool
const { formatSceneExport } = load(path.join(root, "src/app/dev/collisions/geometry.ts"));
const names = { colliders: "aColliders", transitions: "aTransitions", spawns: "aSpawns" };
const base = { colliders: [], transitions: [], spawns: [] };
const plain = formatSceneExport(base, "a", names);
assert.ok(!plain.includes("OcclusionShape") && !plain.includes("PolygonCollider"));
const withDepth = formatSceneExport(
  {
    ...base,
    occluders: [{ depthY: 140, points: [{ x: 1, y: 2 }, { x: 30, y: 2 }, { x: 15, y: 120 }] }],
  },
  "a",
  { ...names, occluders: "aOccluders" },
);
assert.match(withDepth, /import type \{ OcclusionShape \} from "\.\.\/occlusion";/);
assert.match(withDepth, /export const aOccluders: OcclusionShape\[\] = \[/);
assert.match(
  withDepth,
  /\{ id: "a-depth-1", depthY: 140, points: \[\{ x: 1, y: 2 \}, \{ x: 30, y: 2 \}, \{ x: 15, y: 120 \}\] \},/,
);

// the game sorts the layer by its depth line, like a sprite at that y
const scene = read("src/game/world/ExteriorScene.tsx");
assert.match(scene, /scene\.occluders\?\.map/);
assert.match(scene, /zIndex: occlusionZIndex\(shape\.depthY, PROTAGONIST_FEET_HITBOX\)/);
assert.match(scene, /clipPath: occlusionClipPath\(shape\.points\)/);
// the Doctor sorts by his feet: behind the layer when player.y < depthY
assert.match(scene, /zIndex=\{Math\.round\(player\.y\)\}/);

// the tool has the violet kind and Undo
const page = read("src/app/dev/collisions/page.tsx");
assert.match(page, /kind: "occluder", label: "🟣 DEPTH"/);
assert.match(page, /Undo \(Ctrl\+Z\)/);
// zoom x1/x2/x4 and the select mode that draws nothing
assert.match(page, /const ZOOM_LEVELS = \[1, 2, 4\]/);
assert.match(page, /kind: "select", label: "⌖ SELECT"/);
assert.match(page, /mode === "select"/);

console.log("occlusion: ok");

// every scene sorts the Doctor by his feet: in the botica too, otherwise the
// decor with a z-index (the candle flames) is always drawn over him
const botica = read("src/game/apothecary/ApothecaryScene.tsx");
assert.match(botica, /zIndex=\{Math\.round\(player\.y\)\}/);
console.log("botica: the Doctor is sorted by his feet");
