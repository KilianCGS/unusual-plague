// The Apothecary interior: its hand-drawn geometry (colliders, transitions,
// spawns, interactions) and how the world graph and the crafting stations use
// it. Real source files, no mocks.
//   node tests/apothecary.test.mjs
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
    if (id.includes("useProtagonistController")) return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const geo = at("src/game/apothecary/apothecaryInteriorGeometry.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const cr = at("src/game/crafting/crafting.ts");
const { STATION_MAX_INPUTS, RECIPES } = at("src/game/crafting/recipes.ts");
const { getSceneInteractionZones } = at("src/game/interactions/sceneInteractions.ts");
const { craftingCopy } = at("src/game/i18n/crafting.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const botica = WORLD_SCENES["apothecary-interior"];
const zones = getSceneInteractionZones("apothecary-interior");
const feet = ({ x, y }) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
const hit = (a, b) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

test("1. 23 colliders, exactly as drawn", () => {
  assert.equal(geo.apothecaryInteriorColliders.length, 23);
  assert.deepEqual(geo.apothecaryInteriorColliders[0], { id: "apothecary-interior-1", x: 392, y: 0, width: 17, height: 134 });
  assert.deepEqual(geo.apothecaryInteriorColliders[10], { id: "apothecary-interior-11", x: 48, y: 87, width: 31, height: 7 });
  assert.deepEqual(geo.apothecaryInteriorColliders[22], { id: "apothecary-interior-23", x: 272, y: 243, width: 156, height: 25 });
  assert.equal(new Set(geo.apothecaryInteriorColliders.map((c) => c.id)).size, 23);
});

test("2. exactly 2 transitions", () => {
  assert.deepEqual(geo.apothecaryInteriorTransitions, [
    { id: "apothecary-interior-transition-1", x: 426, y: 81, width: 34, height: 39 },
    { id: "apothecary-interior-transition-2", x: 200, y: 246, width: 72, height: 23 },
  ]);
});

test("3-5. exactly 2 spawns: spawn-1 faces north, spawn-2 faces south", () => {
  assert.equal(geo.apothecaryInteriorSpawns.length, 2);
  assert.deepEqual(geo.apothecaryInteriorSpawns[0], { id: "apothecary-interior-spawn-1", x: 444, y: 147, direction: "north" });
  assert.deepEqual(geo.apothecaryInteriorSpawns[1], { id: "apothecary-interior-spawn-2", x: 235, y: 219, direction: "south" });
});

test("6-10. exactly 3 interaction zones: two for the table, one for the stove", () => {
  assert.equal(zones.length, 3);
  assert.equal(zones, geo.apothecaryInteriorInteractions);
  assert.deepEqual(zones.map((z) => [z.id, z.interactionId]), [
    ["apothecary-interior-interaction-1", "craft.manual"],
    ["apothecary-interior-interaction-2", "craft.manual"],
    ["apothecary-interior-interaction-3", "craft.fire"],
  ]);
  assert.deepEqual(zones[0], { id: "apothecary-interior-interaction-1", x: 99, y: 173, width: 22, height: 36, interactionId: "craft.manual" });
  assert.deepEqual(zones[1], { id: "apothecary-interior-interaction-2", x: 98, y: 107, width: 21, height: 43, interactionId: "craft.manual" });
  assert.deepEqual(zones[2], { id: "apothecary-interior-interaction-3", x: 315, y: 95, width: 74, height: 7, interactionId: "craft.fire" });
});

test("9. the two table zones stay physically separate (never merged)", () => {
  assert.ok(!hit(zones[0], zones[1]), "zone 1 (y173-209) and zone 2 (y107-150) do not overlap");
  assert.ok(zones[1].y + zones[1].height < zones[0].y, "there is floor between them (the stool)");
});

test("11-14. each interactionId opens its own station with the right capacity", () => {
  assert.equal(cr.CRAFT_STATION_BY_INTERACTION_ID[zones[0].interactionId], "manual");
  assert.equal(cr.CRAFT_STATION_BY_INTERACTION_ID[zones[1].interactionId], "manual");
  assert.equal(cr.CRAFT_STATION_BY_INTERACTION_ID[zones[2].interactionId], "fire");
  assert.equal(STATION_MAX_INPUTS.manual, 2);
  assert.equal(STATION_MAX_INPUTS.fire, 3);
  assert.equal(cr.createEmptySelection("manual").length, 2);
  assert.equal(cr.createEmptySelection("fire").length, 3);
});

test("15-16. the transitions keep their destinations", () => {
  const byName = Object.fromEntries(botica.exits.map((e) => [e.name, e]));
  assert.equal(botica.exits.length, 2);
  assert.deepEqual(byName["to-doctor-room"].zone, geo.apothecaryInteriorTransitions[0]);
  assert.equal(byName["to-doctor-room"].targetScene, "doctor-room");
  assert.equal(byName["to-doctor-room"].targetSpawn, "from-apothecary-interior");
  assert.deepEqual(byName["to-apothecary-street"].zone, geo.apothecaryInteriorTransitions[1]);
  assert.equal(byName["to-apothecary-street"].targetScene, "apothecary-street");
  assert.equal(byName["to-apothecary-street"].targetSpawn, "from-apothecary-interior");
});

test("17. the neighbouring scenes arrive at the right Botica spawns", () => {
  const [s1, s2] = geo.apothecaryInteriorSpawns;
  // from the Doctor room: the right-hand door side (spawn-1); from the street: in front of the bottom exit (spawn-2)
  assert.deepEqual(botica.arrivals["from-doctor-room"], { x: s1.x, y: s1.y, direction: s1.direction });
  assert.deepEqual(botica.arrivals["from-apothecary-street"], { x: s2.x, y: s2.y, direction: s2.direction });
  const toBotica = (scene) => WORLD_SCENES[scene].exits.find((e) => e.targetScene === "apothecary-interior");
  assert.equal(toBotica("doctor-room").targetSpawn, "from-doctor-room");
  assert.equal(toBotica("apothecary-street").targetSpawn, "from-apothecary-street");
  for (const name of [toBotica("doctor-room").targetSpawn, toBotica("apothecary-street").targetSpawn]) {
    assert.ok(botica.arrivals[name], name);
  }
});

test("spawns and the start position are free floor and not on an exit (no transition loop)", () => {
  const points = [...geo.apothecaryInteriorSpawns, { id: "start", ...botica.arrivals.start }];
  for (const p of points) {
    for (const c of geo.apothecaryInteriorColliders) assert.ok(!hit(feet(p), c), `${p.id} inside ${c.id}`);
    for (const t of geo.apothecaryInteriorTransitions) assert.ok(!hit(feet(p), t), `${p.id} on ${t.id}`);
  }
});

test("18. the recipes are untouched", () => {
  assert.deepEqual(
    RECIPES.map((r) => [r.id, r.station, r.inputs.map((i) => i.itemId + "x" + i.quantity).join("+"), r.output.itemId]),
    [
      ["manual.disinfected-bandage", "manual", "clothx1+alcoholx1", "disinfected-bandage"],
      ["manual.medicinal-paste", "manual", "medicinal-herbx1+honeyx1", "medicinal-paste"],
      ["manual.medicinal-ointment", "manual", "medicinal-pastex1+coalx1", "medicinal-ointment"],
      ["fire.mushroom-soup", "fire", "waterx1+saltx1+mushroomx1", "mushroom-soup"],
    ],
  );
});

test("20. crafting texts still exist in ES and EN for both stations", () => {
  for (const lang of ["es", "en"]) {
    assert.ok(craftingCopy[lang].title.manual && craftingCopy[lang].title.fire);
  }
});

console.log(`\n${passed} tests passed`);
