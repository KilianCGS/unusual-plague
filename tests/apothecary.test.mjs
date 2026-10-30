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
    if (id.includes("useProtagonistController"))
      return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const geo = at("src/game/apothecary/apothecaryMainZoneGeometry.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const cr = at("src/game/crafting/crafting.ts");
const { STATION_MAX_INPUTS, RECIPES } = at("src/game/crafting/recipes.ts");
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);
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
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

const EXPECTED_COLLIDERS = [
  { id: "apothecary-main-zone-1", x: 281, y: 235, width: 189, height: 43 },
  { id: "apothecary-main-zone-2", x: 381, y: 212, width: 83, height: 19 },
  { id: "apothecary-main-zone-3", x: 416, y: 0, width: 64, height: 203 },
  { id: "apothecary-main-zone-4", x: 323, y: 1, width: 117, height: 84 },
  { id: "apothecary-main-zone-5", x: 265, y: 0, width: 83, height: 93 },
  { id: "apothecary-main-zone-6", x: 6, y: 0, width: 208, height: 91 },
  { id: "apothecary-main-zone-7", x: 17, y: 72, width: 97, height: 102 },
  { id: "apothecary-main-zone-8", x: 79, y: 198, width: 53, height: 49 },
  { id: "apothecary-main-zone-9", x: 11, y: 236, width: 189, height: 36 },
  { id: "apothecary-main-zone-10", x: 48, y: 172, width: 32, height: 48 },
  { id: "apothecary-main-zone-11", x: 394, y: 136, width: 25, height: 25 },
  { id: "apothecary-main-zone-12", x: 408, y: 155, width: 11, height: 21 },
  { id: "apothecary-main-zone-13", x: 410, y: 122, width: 15, height: 14 },
  { id: "apothecary-main-zone-14", x: 319, y: 92, width: 5, height: 18 },
  { id: "apothecary-main-zone-15", x: 325, y: 89, width: 91, height: 16 },
];

test("1. 15 colliders, exactly as drawn by hand", () => {
  assert.deepEqual(geo.apothecaryMainZoneColliders, EXPECTED_COLLIDERS);
  assert.equal(
    new Set(geo.apothecaryMainZoneColliders.map((c) => c.id)).size,
    15,
  );
});

test("2. exactly 2 transitions, as drawn", () => {
  assert.deepEqual(geo.apothecaryMainZoneTransitions, [
    {
      id: "apothecary-main-zone-transition-1",
      x: 201,
      y: 245,
      width: 80,
      height: 20,
    },
    {
      id: "apothecary-main-zone-transition-2",
      x: 214,
      y: 71,
      width: 51,
      height: 15,
    },
  ]);
});

test("3-5. exactly 2 spawns, both facing south, as drawn", () => {
  assert.deepEqual(geo.apothecaryMainZoneSpawns, [
    { id: "apothecary-main-zone-spawn-1", x: 240, y: 217, direction: "south" },
    { id: "apothecary-main-zone-spawn-2", x: 240, y: 109, direction: "south" },
  ]);
});

test("6-10. exactly 2 interaction zones: the stove (craft.fire) and the table (craft.manual), positions as drawn", () => {
  assert.equal(zones.length, 2);
  // the Doctor's Storage lives in his room: the Apothecary has crafting only
  assert.equal(zones, geo.apothecaryMainZoneInteractions);
  assert.deepEqual(zones, [
    {
      id: "apothecary-main-zone-interaction-1",
      x: 325,
      y: 106,
      width: 90,
      height: 17,
      interactionId: "craft.fire",
    },
    {
      id: "apothecary-main-zone-interaction-2",
      x: 116,
      y: 93,
      width: 16,
      height: 78,
      interactionId: "craft.manual",
    },
  ]);
  // the editor opens the same zones
  assert.equal(getSceneInteractionZones("apothecary-main-zone"), zones);
});

test("9. the two stations are apart and each has free floor for the Doctor to stand on", () => {
  assert.ok(!hit(zones[0], zones[1]));
  for (const zone of zones) {
    let free = 0;
    for (let x = zone.x; x <= zone.x + zone.width; x += 2) {
      for (let y = zone.y; y <= zone.y + zone.height + 20; y += 2) {
        const point = { x, y: y + 19 };
        if (
          hit(feet(point), zone) &&
          !geo.apothecaryMainZoneColliders.some((c) => hit(feet(point), c))
        ) {
          free += 1;
        }
      }
    }
    assert.ok(free > 0, `${zone.id} has free floor to stand on`);
  }
});

test("11-14. each interactionId opens its own station with the right capacity", () => {
  assert.equal(
    cr.CRAFT_STATION_BY_INTERACTION_ID[zones[0].interactionId],
    "fire",
  );
  assert.equal(
    cr.CRAFT_STATION_BY_INTERACTION_ID[zones[1].interactionId],
    "manual",
  );
  assert.equal(STATION_MAX_INPUTS.manual, 2);
  assert.equal(STATION_MAX_INPUTS.fire, 3);
  assert.equal(cr.createEmptySelection("manual").length, 2);
  assert.equal(cr.createEmptySelection("fire").length, 3);
});

test("15-16. the transitions keep their destinations: the bottom one to the street, the arch to the Doctor's Room", () => {
  const byName = Object.fromEntries(botica.exits.map((e) => [e.name, e]));
  assert.equal(botica.exits.length, 2);
  assert.deepEqual(
    byName["to-apothecary-street"].zone,
    geo.apothecaryMainZoneTransitions[0],
  );
  assert.equal(byName["to-apothecary-street"].targetScene, "apothecary-street");
  assert.equal(
    byName["to-apothecary-street"].targetSpawn,
    "from-apothecary-interior",
  );
  assert.deepEqual(
    byName["to-doctor-room"].zone,
    geo.apothecaryMainZoneTransitions[1],
  );
  assert.equal(byName["to-doctor-room"].targetScene, "doctor-room");
  assert.equal(
    byName["to-doctor-room"].targetSpawn,
    "from-apothecary-interior",
  );
});

test("17. the neighbouring scenes arrive at the right Botica spawns", () => {
  const [s1, s2] = geo.apothecaryMainZoneSpawns;
  // from the street: in front of the bottom exit (spawn-1); from the Doctor's
  // Room: below the arch (spawn-2); both facing south
  assert.deepEqual(botica.arrivals["from-apothecary-street"], {
    x: s1.x,
    y: s1.y,
    direction: s1.direction,
  });
  assert.deepEqual(botica.arrivals["from-doctor-room"], {
    x: s2.x,
    y: s2.y,
    direction: s2.direction,
  });
  assert.deepEqual(botica.arrivals.start, {
    x: s1.x,
    y: s1.y,
    direction: s1.direction,
  });
  const toBotica = (scene) =>
    WORLD_SCENES[scene].exits.find(
      (e) => e.targetScene === "apothecary-interior",
    );
  assert.equal(toBotica("doctor-room").targetSpawn, "from-doctor-room");
  assert.equal(
    toBotica("apothecary-street").targetSpawn,
    "from-apothecary-street",
  );
  for (const name of [
    toBotica("doctor-room").targetSpawn,
    toBotica("apothecary-street").targetSpawn,
  ]) {
    assert.ok(botica.arrivals[name], name);
  }
});

test("spawns and the start position are free floor and not on an exit (no transition loop)", () => {
  const points = [
    ...geo.apothecaryMainZoneSpawns,
    { id: "start", ...botica.arrivals.start },
  ];
  for (const p of points) {
    for (const c of geo.apothecaryMainZoneColliders)
      assert.ok(!hit(feet(p), c), `${p.id} inside ${c.id}`);
    for (const t of geo.apothecaryMainZoneTransitions)
      assert.ok(!hit(feet(p), t), `${p.id} on ${t.id}`);
  }
});

test("everything in the Botica is reachable on foot from either arrival (no trapped spawn, no unreachable exit or station)", () => {
  const W = 480;
  const H = 293;
  const free = (x, y) =>
    x >= 6 &&
    y >= 19 &&
    x <= W - 6 &&
    y <= H &&
    !geo.apothecaryMainZoneColliders.some((c) => hit(feet({ x, y }), c));
  const reach = (start) => {
    const seen = new Set([`${start.x},${start.y}`]);
    const queue = [[start.x, start.y]];
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const key = `${x + dx},${y + dy}`;
        if (!seen.has(key) && free(x + dx, y + dy)) {
          seen.add(key);
          queue.push([x + dx, y + dy]);
        }
      }
    }
    return [...seen].map((k) => k.split(",").map(Number));
  };
  for (const start of geo.apothecaryMainZoneSpawns) {
    const floor = reach(start);
    assert.ok(floor.length > 5000, "a meaningful walkable area");
    const canTouch = (rect) =>
      floor.some(([x, y]) => hit(feet({ x, y }), rect));
    for (const t of geo.apothecaryMainZoneTransitions)
      assert.ok(canTouch(t), `${t.id} from ${start.id}`);
    for (const z of geo.apothecaryMainZoneInteractions)
      assert.ok(canTouch(z), `${z.id} from ${start.id}`);
    for (const other of geo.apothecaryMainZoneSpawns)
      assert.ok(
        floor.some(([x, y]) => x === other.x && y === other.y),
        `${other.id} from ${start.id}`,
      );
  }
});

test("the Botica in play is the new one: its background, its 480x293 world, and no second runtime Botica", () => {
  const css = fs.readFileSync(
    path.join(root, "src/game/apothecary/ApothecaryScene.module.css"),
    "utf8",
  );
  const scene = fs.readFileSync(
    path.join(root, "src/game/apothecary/ApothecaryScene.tsx"),
    "utf8",
  );
  assert.ok(css.includes("apothecary-main-zone-background.png"));
  assert.ok(!css.includes("apothecary-background.png"));
  assert.ok(
    /SCENE_WIDTH = 480;/.test(scene) && /SCENE_HEIGHT = 293;/.test(scene),
  );
  assert.ok(css.includes("293px") && !css.includes("277px"));
  assert.ok(scene.includes("apothecaryMainZoneColliders"));
  // the background really is the unmodified 1606x979 image
  const png = fs.readFileSync(
    path.join(
      root,
      "public/game/areas/apothecary/apothecary-main-zone-background.png",
    ),
  );
  assert.equal(png.readUInt32BE(16), 1606);
  assert.equal(png.readUInt32BE(20), 979);
  // the old Botica geometry and background are gone, not kept in parallel
  assert.ok(
    !fs.existsSync(
      path.join(root, "src/game/apothecary/apothecaryInteriorGeometry.ts"),
    ),
  );
  assert.ok(
    !fs.existsSync(
      path.join(root, "public/game/areas/apothecary/apothecary-background.png"),
    ),
  );
  assert.deepEqual(
    Object.keys(WORLD_SCENES).filter((id) =>
      /apothecary-(interior|main)/.test(id),
    ),
    ["apothecary-interior"],
  );
});

test("18. the original four recipes are untouched (two patient recipes were added after them)", () => {
  assert.equal(RECIPES.length, 6);
  assert.deepEqual(
    RECIPES.slice(0, 4).map((r) => [
      r.id,
      r.station,
      r.inputs.map((i) => i.itemId + "x" + i.quantity).join("+"),
      r.output.itemId,
    ]),
    [
      [
        "manual.disinfected-bandage",
        "manual",
        "clothx1+alcoholx1",
        "disinfected-bandage",
      ],
      [
        "manual.medicinal-paste",
        "manual",
        "medicinal-herbx1+honeyx1",
        "medicinal-paste",
      ],
      [
        "manual.medicinal-ointment",
        "manual",
        "medicinal-pastex1+coalx1",
        "medicinal-ointment",
      ],
      [
        "fire.mushroom-soup",
        "fire",
        "waterx1+saltx1+mushroomx1",
        "mushroom-soup",
      ],
    ],
  );
});

test("20. crafting texts still exist in ES and EN for both stations", () => {
  for (const lang of ["es", "en"]) {
    assert.ok(craftingCopy[lang].title.manual && craftingCopy[lang].title.fire);
  }
});

console.log(`\n${passed} tests passed`);
