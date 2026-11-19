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
const { rectIntersectsPolygon } = at("src/game/collision.ts");
const { sceneForChapter, NIGHT_CHAPTER_ID } = at("src/game/world/nightScenes.ts");

const FEET = { offsetX: -6, offsetY: -19, width: 12, height: 12 };
const STEP = 2;
const feetBox = (x, y) => ({ x: x + FEET.offsetX, y: y + FEET.offsetY, width: FEET.width, height: FEET.height });
const overlap = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

// Walks the Doctor over a scene of DAY 4 (the night version, with Day 4's decor) from an arrival and answers
// whether his feet can touch a zone. Same box and grid as reachability.test.mjs.
function walker(sceneId, arrival) {
  const scene = sceneForChapter(WORLD_SCENES[sceneId], NIGHT_CHAPTER_ID);
  const world = getSceneWorld(scene.visual);
  const decor = resolveDecorInstances(getComposition(sceneId, "chapter-4")?.instances ?? [], getChapterInteractions("chapter-4"));
  const rects = [...scene.colliders, ...decor.colliders];
  const polys = scene.polygonColliders ?? [];
  const free = (x, y) => {
    const box = feetBox(x, y);
    if (box.x < 0 || box.y < 0 || box.x + box.width > world.width || box.y + box.height > world.height) return false;
    if (rects.some((r) => overlap(box, r))) return false;
    return !polys.some((p) => rectIntersectsPolygon(box, p));
  };
  const spawn = scene.arrivals[arrival];
  assert.ok(spawn, `${sceneId} has arrival ${arrival}`);
  const cols = Math.floor(world.width / STEP) + 1, rows = Math.floor(world.height / STEP) + 1;
  const seen = new Uint8Array(cols * rows);
  const sx = Math.round(spawn.x / STEP), sy = Math.round(spawn.y / STEP);
  assert.ok(free(sx * STEP, sy * STEP), `${sceneId}.${arrival} is a free spot`);
  const stack = [sy * cols + sx];
  seen[sy * cols + sx] = 1;
  while (stack.length) {
    const cur = stack.pop(), cx = cur % cols, cy = (cur - cx) / cols;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || seen[ny * cols + nx] || !free(nx * STEP, ny * STEP)) continue;
      seen[ny * cols + nx] = 1;
      stack.push(ny * cols + nx);
    }
  }
  const touches = (zone) => {
    for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
      if (seen[cy * cols + cx] && overlap(feetBox(cx * STEP, cy * STEP), zone)) return true;
    }
    return false;
  };
  return { scene, decor, touches };
}

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

test("Day 4, the cottage at night: from the forest arrival the Doctor reaches the Witch outside and the door of the house", () => {
  const w = walker("forest-cottage", "from-forest");
  const outside = [...w.decor.zoneInstanceIds].find(([, instance]) => instance === "forest-cottage-witch-conjuring-front-01");
  assert.ok(outside, "the Witch outside has a zone");
  assert.ok(w.touches(w.decor.zones.find((z) => z.id === outside[0])), "he can reach her");
  const door = w.scene.exits.find((e) => e.name === "to-forest-cottage-interior");
  assert.ok(door && w.touches(door.zone), "he can reach the door");
  assert.ok(!w.scene.exits.some((e) => e.name === "to-forest"), "no way back to the forest");
});

test("Day 4, inside the cottage: from the door the Doctor reaches the seated Witch, and there is no way out", () => {
  const w = walker("forest-cottage-interior", "from-forest-cottage");
  const seated = [...w.decor.zoneInstanceIds].find(([, instance]) => instance === "forest-cottage-interior-witch-tavern-sitting-01");
  assert.ok(seated, "the seated Witch has a zone");
  assert.ok(w.touches(w.decor.zones.find((z) => z.id === seated[0])), "he can reach her");
  assert.equal(w.scene.exits.length, 0);
});

console.log(`
${passed} tests passed`);
