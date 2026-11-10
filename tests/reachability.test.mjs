// Reachability of every played scene, with the REAL blockers: scene colliders,
// free-hand colliders, the NPCs standing there and the decor colliders of each
// chapter. The Doctor is walked as his 12x12 feet box over a 2-unit grid (4
// directions, like the game) from every arrival, and we check that:
//   - every arrival is a free spot (not inside a collider),
//   - every exit leads to an existing scene and arrival,
//   - from every arrival the Doctor can reach at least one exit (never trapped),
//   - every exit, interaction zone and pick-up of the scene is reachable from
//     some arrival of that scene.
//   node tests/reachability.test.mjs            (assertions)
//   REPORT=1 node tests/reachability.test.mjs   (prints each scene)
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
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: "commonjs", target: "es2022", jsx: "react-jsx" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const candidate of [base + ".ts", path.join(base, "index.ts")]) {
        if (fs.existsSync(candidate)) return load(candidate);
      }
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { getSceneWorld } = at("src/app/dev/scene/scenes.ts");
const { getComposition, getChapterInteractions } = at("src/game/compositions/index.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { getSceneNpcs } = at("src/game/npcs/sceneNpcs.ts");
const { getNpcColliders } = at("src/game/npcs/sceneNpc.ts");
const { getSceneInteractionZones } = at("src/game/interactions/sceneInteractions.ts");
const { rectIntersectsPolygon } = at("src/game/collision.ts");

// the Doctor's feet box relative to his anchor (PROTAGONIST_FEET_HITBOX)
const FEET = { offsetX: -6, offsetY: -19, width: 12, height: 12 };
const STEP = 2;
const CHAPTERS = ["chapter-1", "chapter-2"];
const REPORT = process.env.REPORT === "1";

function feetBox(x, y) {
  return { x: x + FEET.offsetX, y: y + FEET.offsetY, width: FEET.width, height: FEET.height };
}

function analyse(scene, chapterId) {
  // the botica is the only "interior" scene: ApothecaryScene draws it at a fixed
  // 480 x 293 with only ambient decor (no colliders, no chapter population)
  const world = scene.kind === "interior" ? { width: 480, height: 293 } : getSceneWorld(scene.visual);
  const decor =
    scene.kind === "interior"
      ? { colliders: [], zones: [], zoneItemIds: new Map() }
      : resolveDecorInstances(
          getComposition(scene.id, chapterId)?.instances ?? [],
          getChapterInteractions(chapterId),
        );
  const rects = [
    ...scene.colliders,
    ...getNpcColliders(getSceneNpcs(scene.id)),
    ...decor.colliders,
  ];
  // negative control (CONTROL=exit): wall off the first exit of every scene, which
  // MUST be reported; it proves this check is not vacuous
  if (process.env.CONTROL === "exit" && scene.exits[0]) {
    const z = scene.exits[0].zone;
    rects.push({ x: z.x - 40, y: z.y - 40, width: z.width + 80, height: z.height + 80 });
  }
  const polys = scene.polygonColliders ?? [];
  // cheap pre-filter: the rectangles/polygons whose neighbourhood a spot can touch
  const polyBoxes = polys.map((p) => {
    const xs = p.points.map((q) => q.x);
    const ys = p.points.map((q) => q.y);
    return { p, x0: Math.min(...xs) - 14, x1: Math.max(...xs) + 14, y0: Math.min(...ys) - 22, y1: Math.max(...ys) + 14 };
  });

  const free = (x, y) => {
    const box = feetBox(x, y);
    if (box.x < 0 || box.y < 0 || box.x + box.width > world.width || box.y + box.height > world.height) {
      return false;
    }
    for (const r of rects) {
      if (box.x < r.x + r.width && box.x + box.width > r.x && box.y < r.y + r.height && box.y + box.height > r.y) {
        return false;
      }
    }
    for (const b of polyBoxes) {
      if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1 && rectIntersectsPolygon(box, b.p)) {
        return false;
      }
    }
    return true;
  };

  const cols = Math.floor(world.width / STEP) + 1;
  const rows = Math.floor(world.height / STEP) + 1;

  function flood(spawn) {
    const seen = new Uint8Array(cols * rows);
    let sx = Math.round(spawn.x / STEP);
    let sy = Math.round(spawn.y / STEP);
    if (!free(sx * STEP, sy * STEP)) {
      let found = false;
      for (let r = 1; r <= 4 && !found; r += 1) {
        for (let dx = -r; dx <= r && !found; dx += 1) {
          for (let dy = -r; dy <= r && !found; dy += 1) {
            if (free((sx + dx) * STEP, (sy + dy) * STEP)) {
              sx += dx;
              sy += dy;
              found = true;
            }
          }
        }
      }
      if (!found) return seen;
    }
    const stack = [sy * cols + sx];
    seen[sy * cols + sx] = 1;
    while (stack.length) {
      const cur = stack.pop();
      const cx = cur % cols;
      const cy = (cur - cx) / cols;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const idx = ny * cols + nx;
        if (seen[idx] || !free(nx * STEP, ny * STEP)) continue;
        seen[idx] = 1;
        stack.push(idx);
      }
    }
    return seen;
  }

  // can the feet box overlap this zone from some visited spot?
  function touches(seen, zone) {
    const x0 = Math.max(0, Math.floor((zone.x - FEET.width - FEET.offsetX) / STEP));
    const x1 = Math.min(cols - 1, Math.ceil((zone.x + zone.width - FEET.offsetX) / STEP));
    const y0 = Math.max(0, Math.floor((zone.y - FEET.height - FEET.offsetY) / STEP));
    const y1 = Math.min(rows - 1, Math.ceil((zone.y + zone.height - FEET.offsetY) / STEP));
    for (let cy = y0; cy <= y1; cy += 1) {
      for (let cx = x0; cx <= x1; cx += 1) {
        if (!seen[cy * cols + cx]) continue;
        const b = feetBox(cx * STEP, cy * STEP);
        if (b.x < zone.x + zone.width && b.x + b.width > zone.x && b.y < zone.y + zone.height && b.y + b.height > zone.y) {
          return true;
        }
      }
    }
    return false;
  }

  const zones = [
    ...scene.exits.map((e) => ({ kind: "exit", id: e.name, zone: e.zone })),
    ...getSceneInteractionZones(scene.id).map((z) => ({ kind: "interaction", id: z.id, zone: z })),
    ...decor.zones.map((z) => ({ kind: decor.zoneItemIds.has(z.id) ? "pickup" : "decor-interaction", id: z.id, zone: z })),
  ];
  return { world, free, flood, touches, zones };
}

const problems = [];
const lines = [];

for (const scene of Object.values(WORLD_SCENES)) {
  if (scene.narrative) continue;
  const arrivals = Object.entries(scene.arrivals);
  if (arrivals.length === 0) continue;

  for (const chapterId of CHAPTERS) {
    const a = analyse(scene, chapterId);
    const reachedBy = new Map(); // zone id -> true
    const perArrival = [];

    for (const [name, spawn] of arrivals) {
      if (!a.free(spawn.x, spawn.y)) {
        problems.push(`${chapterId} ${scene.id}: arrival "${name}" (${spawn.x}, ${spawn.y}) is inside a collider`);
      }
      const seen = a.flood(spawn);
      let exits = 0;
      for (const target of a.zones) {
        if (a.touches(seen, target.zone)) {
          reachedBy.set(`${target.kind}:${target.id}`, true);
          if (target.kind === "exit") exits += 1;
        }
      }
      perArrival.push(`${name}: ${exits}/${scene.exits.length} exits`);
      if (scene.exits.length > 0 && exits === 0) {
        problems.push(`${chapterId} ${scene.id}: from arrival "${name}" no exit can be reached (the Doctor would be trapped)`);
      }
    }

    for (const target of a.zones) {
      if (!reachedBy.has(`${target.kind}:${target.id}`)) {
        problems.push(`${chapterId} ${scene.id}: ${target.kind} "${target.id}" cannot be reached from any arrival`);
      }
    }
    lines.push(`${chapterId} ${scene.id} · ${a.zones.length} targets · ${perArrival.join(" · ")}`);
  }

  // every exit must lead somewhere that exists
  for (const exit of scene.exits) {
    const target = WORLD_SCENES[exit.targetScene];
    if (!target) problems.push(`${scene.id}: exit "${exit.name}" leads to a missing scene "${exit.targetScene}"`);
    else if (!target.arrivals[exit.targetSpawn]) {
      problems.push(`${scene.id}: exit "${exit.name}" leads to a missing arrival "${exit.targetSpawn}" in ${exit.targetScene}`);
    }
  }
}

if (REPORT) console.log(lines.join("\n"));
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
}
assert.equal(problems.length, 0, `${problems.length} reachability problem(s) (see above)`);
console.log(`reachability: ok (${lines.length} scene/chapter pairs)`);
