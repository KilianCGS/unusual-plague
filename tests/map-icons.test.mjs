// Copper coins: the purse, what patients pay, the shop and how it is wired.
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
    compilerOptions: { module: "commonjs", target: "es2022" },
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
    if (id.includes("useProtagonistController"))
      return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const { MAP_LOCATIONS, MAP_LINKS, SCENE_TO_MAP_LOCATION } = at("src/game/map/mapLocations.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};

test("every place on the map has a painted transparent icon and both names", () => {
  for (const place of MAP_LOCATIONS) {
    const file = path.join(root, `public/game/ui/map/${place.id}.png`);
    assert.ok(fs.existsSync(file), place.id);
    const png = fs.readFileSync(file);
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 512);
    assert.equal(png.readUInt32BE(20), 512);
    assert.equal(png[25], 6, `${place.id} has an alpha channel (RGBA)`);
    assert.ok(place.label.length > 0 && place.labelEn.length > 0, place.id);
  }
  // the two zones that are painted but not placed yet are ready for later
  for (const id of ["quarry", "forest-deep"]) {
    assert.ok(fs.existsSync(path.join(root, `public/game/ui/map/${id}.png`)), id);
  }
});

test("links and scenes only point at known places", () => {
  const ids = new Set(MAP_LOCATIONS.map((p) => p.id));
  for (const [a, b] of MAP_LINKS) assert.ok(ids.has(a) && ids.has(b), `${a}-${b}`);
  for (const place of Object.values(SCENE_TO_MAP_LOCATION)) assert.ok(ids.has(place), place);
});

test("the overlay draws the parchment and the painted icons (no book picture, no vector drawings)", () => {
  const overlay = read("src/game/map/MapOverlay.tsx");
  assert.ok(overlay.includes("/game/ui/map/"));
  assert.ok(!overlay.includes("medical-book-base"));
  assert.ok(!fs.existsSync(path.join(root, "src/game/map/mapIcons.tsx")));
  assert.ok(overlay.includes("language"));
});

console.log(`\n${passed} tests passed`);
