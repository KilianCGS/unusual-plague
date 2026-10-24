// New world map (src/game/new-world-map): the redrawn exterior scenes, the new
// Forest <-> Casita del bosque link, and the old world kept as the default.
//   node tests/new-world-map.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

// One independent module graph per world: NEXT_PUBLIC_WORLD is read when
// worldVariant.ts is first loaded.
function makeLoader(worldValue) {
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
    const previous = process.env.NEXT_PUBLIC_WORLD;
    if (worldValue === undefined) delete process.env.NEXT_PUBLIC_WORLD;
    else process.env.NEXT_PUBLIC_WORLD = worldValue;
    try {
      mod._compile(js, file);
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_WORLD;
      else process.env.NEXT_PUBLIC_WORLD = previous;
    }
    return mod.exports;
  }
  return (rel) => load(path.join(root, rel));
}

const newWorld = makeLoader("new");
const oldWorld = makeLoader(undefined);

const { WORLD_SCENES } = newWorld("src/game/world/worldScenes.ts");
const OLD = oldWorld("src/game/world/worldScenes.ts").WORLD_SCENES;
const { NEW_WORLD_SCENE_IDS } = newWorld(
  "src/game/new-world-map/worldVariant.ts",
);
const { rectsIntersect, collidesWithScene } = newWorld("src/game/collision.ts");
const { getSceneWorld } = newWorld("src/app/dev/scene/scenes.ts");
const { SCENE_TO_MAP_LOCATION, MAP_LINKS, MAP_LOCATIONS } = newWorld(
  "src/game/map/mapLocations.ts",
);
const OLD_MAP = oldWorld("src/game/map/mapLocations.ts");
const { getComposition } = newWorld("src/game/compositions/index.ts");
const OLD_COMPOSITIONS = oldWorld("src/game/compositions/index.ts");
const OLD_INTERACTIONS = oldWorld(
  "src/game/compositions/chapter-1.interactions.ts",
).chapter1Interactions;
const { getSceneInteractionZones } = newWorld(
  "src/game/interactions/sceneInteractions.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const feetRect = (x, y) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
const NEW_IDS = [...NEW_WORLD_SCENE_IDS];
// The hand-made Decorator export differs from the old lists in exactly this:
const EXPECTED_ADDED = [
  "tavern-street-villager-woman-01-01",
  "forest-resin-world-01",
  "forest-medicinal-herb-dev-02",
  "mill-farmland-orange-world-02",
];
const EXPECTED_REMOVED = [
  "tavern-street-villager-woman-02-01",
  "mill-farmland-farmer-old-01",
  "mill-farmland-villager-young-01",
];
// Instances whose hand-placed anchor lies inside a static collider rectangle.
const KNOWN_ANCHOR_OVERLAPS = [
  "apothecary-street-woman-sweeping-01",
  "tavern-street-villager-woman-01-01",
  "outskirts-fisherman-01",
  "outskirts-woman-washing-clothes-01",
  "forest-medicinal-herb-dev-01",
  "mill-farmland-beekeeper-01",
  "mill-farmland-farmer-hoeing-01",
  "smithy-street-child-wooden-sword-01",
  "smithy-street-villager-sitting-01",
  "mill-farmland-orange-world-02",
];
const size = (scene) => getSceneWorld(scene.visual);

function pngSize(publicPath) {
  const b = fs.readFileSync(path.join(root, "public", publicPath));
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

test("the eleven redrawn scenes keep their ids and use their own new background", () => {
  assert.equal(NEW_IDS.length, 11);
  for (const id of NEW_IDS) {
    const scene = WORLD_SCENES[id];
    assert.equal(scene.id, id);
    assert.equal(scene.kind, "exterior");
    const v = scene.visual;
    assert.ok(v.backgroundSrc.startsWith("/game/new-world-map/"), id);
    // the logical world is the real image size times the scene scale: nothing
    // is stretched (one scale for both axes)
    assert.deepEqual(pngSize(v.backgroundSrc), {
      width: v.assetWidth,
      height: v.assetHeight,
    });
    assert.ok(v.logicalUnitsPerAssetPixel > 0);
    // the old world still draws the old art for the same scene (not the cottage)
    if (id !== "forest-cottage") {
      assert.ok(!OLD[id].visual.backgroundSrc.includes("new-world-map"), id);
    }
  }
});

test("every exit points to a real scene and a real arrival, and the way back exists", () => {
  for (const id of NEW_IDS) {
    for (const exit of WORLD_SCENES[id].exits) {
      const target = WORLD_SCENES[exit.targetScene];
      assert.ok(target, `${id} -> ${exit.targetScene}`);
      assert.ok(
        target.arrivals[exit.targetSpawn],
        `${id}:${exit.name} -> ${exit.targetScene}.${exit.targetSpawn}`,
      );
      assert.ok(
        target.exits.some((back) => back.targetScene === id),
        `${exit.targetScene} has no way back to ${id}`,
      );
    }
  }
});

test("the topology of the old world is kept, plus Forest <-> Casita del bosque", () => {
  const targets = (scenes, id) =>
    scenes[id].exits.map((e) => e.targetScene).sort();

  for (const id of NEW_IDS.filter((x) => x !== "forest-cottage")) {
    const expected = targets(OLD, id);

    if (id === "forest") expected.push("forest-cottage");

    assert.deepEqual(targets(WORLD_SCENES, id), expected.sort(), id);
  }

  assert.deepEqual(targets(WORLD_SCENES, "forest-cottage"), ["forest"]);
  assert.equal(
    WORLD_SCENES.forest.exits.find((e) => e.targetScene === "forest-cottage")
      .targetSpawn,
    "from-forest",
  );
  assert.ok(WORLD_SCENES["forest-cottage"].arrivals["from-forest"]);
  assert.ok(WORLD_SCENES.forest.arrivals["from-forest-cottage"]);
  // the cottage is SOUTH of the Forest: its exit is at the bottom of the
  // Forest and its arrival is at the top of the cottage
  const forestHeight = size(WORLD_SCENES.forest).height;
  const toCottage = WORLD_SCENES.forest.exits.find(
    (e) => e.targetScene === "forest-cottage",
  ).zone;
  assert.ok(toCottage.y + toCottage.height >= forestHeight - 1);
  assert.ok(WORLD_SCENES["forest-cottage"].arrivals["from-forest"].y < 150);
  assert.equal(
    WORLD_SCENES["forest-cottage"].arrivals["from-forest"].direction,
    "south",
  );
  assert.equal(
    WORLD_SCENES.forest.arrivals["from-forest-cottage"].direction,
    "north",
  );
});

test("every arrival is inside the world, on free floor, away from every exit zone", () => {
  for (const id of NEW_IDS) {
    const scene = WORLD_SCENES[id];
    const world = size(scene);

    for (const [name, spawn] of Object.entries(scene.arrivals)) {
      const r = feetRect(spawn.x, spawn.y);
      assert.ok(r.x >= 0 && r.y >= 0, `${id}.${name}`);
      assert.ok(
        r.x + r.width <= world.width && r.y + r.height <= world.height,
        `${id}.${name} outside the world`,
      );
      assert.ok(
        !collidesWithScene(r, scene.colliders),
        `${id}.${name} in collision`,
      );
      assert.ok(
        ["north", "south", "east", "west"].includes(spawn.direction),
        `${id}.${name}`,
      );

      for (const exit of scene.exits) {
        assert.ok(
          !rectsIntersect(r, exit.zone),
          `${id}.${name} spawns on the exit ${exit.name}`,
        );
      }
    }
  }
});

test("every exit zone is inside the world and not buried in a collider", () => {
  for (const id of NEW_IDS) {
    const scene = WORLD_SCENES[id];
    const world = size(scene);

    for (const exit of scene.exits) {
      const z = exit.zone;
      assert.ok(
        z.x >= 0 &&
          z.y >= 0 &&
          z.x + z.width <= world.width &&
          z.y + z.height <= world.height,
        `${id}:${exit.name} outside the world`,
      );
      // a zone may touch a collider edge (doors), but must have free floor
      const cover = scene.colliders.reduce(
        (sum, c) =>
          rectsIntersect(z, c)
            ? sum +
              (Math.min(z.x + z.width, c.x + c.width) - Math.max(z.x, c.x)) *
                (Math.min(z.y + z.height, c.y + c.height) - Math.max(z.y, c.y))
            : sum,
        0,
      );
      assert.ok(
        cover < z.width * z.height * 0.75,
        `${id}:${exit.name} mostly blocked`,
      );
    }
  }
});

// Flood fill of the floor with the Doctor's feet hitbox.
function reachable(scene, from) {
  const world = size(scene);
  const STEP = 4;
  const key = (x, y) => y * 10000 + x;
  const seen = new Set([key(from.x, from.y)]);
  const stack = [[from.x, from.y]];
  const hits = [];

  while (stack.length) {
    const [x, y] = stack.pop();
    hits.push([x, y]);

    for (const [dx, dy] of [
      [STEP, 0],
      [-STEP, 0],
      [0, STEP],
      [0, -STEP],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (seen.has(key(nx, ny))) continue;
      const r = feetRect(nx, ny);
      if (r.x < 0 || r.y < 0) continue;
      if (r.x + r.width > world.width || r.y + r.height > world.height)
        continue;
      if (collidesWithScene(r, scene.colliders)) continue;
      seen.add(key(nx, ny));
      stack.push([nx, ny]);
    }
  }

  return hits;
}

test("from every arrival the Doctor can reach every exit of the scene (nobody is trapped)", () => {
  for (const id of NEW_IDS) {
    const scene = WORLD_SCENES[id];

    for (const [name, spawn] of Object.entries(scene.arrivals)) {
      const floor = reachable(scene, spawn);

      for (const exit of scene.exits) {
        assert.ok(
          floor.some(([x, y]) => rectsIntersect(feetRect(x, y), exit.zone)),
          `${id}.${name} cannot reach ${exit.name}`,
        );
      }
    }
  }
});

test("the Casita del bosque is fully walkable from its entrance and has no NPC or quest", () => {
  const scene = WORLD_SCENES["forest-cottage"];
  const floor = reachable(scene, scene.arrivals["from-forest"]);

  assert.ok(floor.length > 400, "a meaningful walkable area");
  assert.equal(scene.visual.label, "Casita del bosque");
  assert.equal(getComposition("forest-cottage", "chapter-1"), undefined);
  assert.deepEqual(getSceneInteractionZones("forest-cottage"), []);
});

test("the water interaction survives in the new Outskirts, on reachable floor", () => {
  const zones = getSceneInteractionZones("outskirts");
  assert.equal(zones.length, 1);
  assert.equal(zones[0].interactionId, "gather.water");
  const scene = WORLD_SCENES.outskirts;
  const floor = reachable(scene, scene.arrivals["from-tavern-street"]);
  assert.ok(floor.some(([x, y]) => rectsIntersect(feetRect(x, y), zones[0])));
});

test("the new world population: same instances as the old one, valid assets, kept interactions, forest-cottage empty", () => {
  const { getChapterInteractions } = newWorld("src/game/compositions/index.ts");
  const { getDecorAsset } = newWorld("src/game/decor/decorAssets.ts");
  const { resolveDecorInstances } = newWorld("src/game/decor/decorRuntime.ts");
  const interactions = getChapterInteractions("chapter-1");
  let total = 0;

  for (const id of NEW_IDS) {
    const fresh = getComposition(id, "chapter-1");
    const before = OLD_COMPOSITIONS.getComposition(id, "chapter-1");

    if (id === "forest-cottage") {
      assert.equal(fresh, undefined, "the cottage stays empty");
      continue;
    }

    // Same assets, flipX and collider flag as the old world for every instance
    // that exists there; the hand-made export differs from the old lists only
    // where EXPECTED_ADDED / EXPECTED_REMOVED say so.
    const oldById = new Map(before.instances.map((i) => [i.instanceId, i]));

    for (const i of fresh.instances) {
      const was = oldById.get(i.instanceId);

      if (was) {
        assert.deepEqual(
          [i.assetId, i.flipX, i.colliderEnabled],
          [was.assetId, was.flipX, was.colliderEnabled],
          i.instanceId,
        );
      } else {
        assert.ok(
          EXPECTED_ADDED.includes(i.instanceId),
          `unexpected new ${i.instanceId}`,
        );
      }
    }

    assert.deepEqual(
      before.instances
        .map((i) => i.instanceId)
        .filter((x) => !fresh.instances.some((i) => i.instanceId === x))
        .sort(),
      EXPECTED_REMOVED.filter((x) => x.startsWith(id)).sort(),
      `${id}: instances not placed in the new world`,
    );

    const scene = WORLD_SCENES[id];
    const world = size(scene);
    const decor = resolveDecorInstances(fresh.instances, interactions);
    assert.equal(
      decor.sprites.length,
      fresh.instances.length,
      `${id}: every asset exists`,
    );

    for (const instance of fresh.instances) {
      total++;
      assert.ok(getDecorAsset(instance.assetId), instance.assetId);
      assert.ok(
        instance.x > 0 && instance.x < world.width,
        instance.instanceId,
      );
      assert.ok(
        instance.y > 0 && instance.y < world.height,
        instance.instanceId,
      );
      // Hand-placed anchors may sit on a static collider (beside a building,
      // a fence...); those are the author's choice and are listed, so a NEW
      // overlap shows up as a failure.
      assert.equal(
        collidesWithScene(feetRect(instance.x, instance.y), scene.colliders),
        KNOWN_ANCHOR_OVERLAPS.includes(instance.instanceId),
        `${instance.instanceId}: anchor on a static collider differs from the known list`,
      );
    }

    // placed things never cover an exit or an arrival
    for (const collider of decor.colliders) {
      for (const exit of scene.exits) {
        assert.ok(
          !rectsIntersect(collider, exit.zone),
          `${collider.id} blocks ${exit.name}`,
        );
      }
      for (const [name, spawn] of Object.entries(scene.arrivals)) {
        assert.ok(
          !rectsIntersect(collider, feetRect(spawn.x, spawn.y)),
          `${collider.id} on ${id}.${name}`,
        );
      }
    }

    // and with them in place every exit is still reachable from every arrival
    const withDecor = {
      ...scene,
      colliders: [...scene.colliders, ...decor.colliders],
    };

    for (const [name, spawn] of Object.entries(scene.arrivals)) {
      const floor = reachable(withDecor, spawn);

      for (const exit of scene.exits) {
        assert.ok(
          floor.some(([x, y]) => rectsIntersect(feetRect(x, y), exit.zone)),
          `${id}.${name} cannot reach ${exit.name} with the population placed`,
        );
      }
    }

    // the river bank zone stays reachable
    for (const zone of getSceneInteractionZones(id)) {
      const floor = reachable(withDecor, Object.values(scene.arrivals)[0]);
      assert.ok(
        floor.some(([x, y]) => rectsIntersect(feetRect(x, y), zone)),
        `${id} ${zone.id}`,
      );
    }
  }

  assert.equal(total, 33);

  // interactions are keyed by instanceId and untouched: every interactive
  // instance of the old world is still interactive here
  for (const id of NEW_IDS.filter((x) => x !== "forest-cottage")) {
    for (const instance of getComposition(id, "chapter-1").instances) {
      assert.equal(
        interactions[instance.instanceId]?.interactionId,
        OLD_INTERACTIONS[instance.instanceId]?.interactionId,
      );
    }
  }

  // interiors keep their populations
  for (const id of [
    "bakery-interior",
    "smithy-interior",
    "tavern-interior",
    "bakers-bedroom",
    "mine-interior",
  ]) {
    assert.deepEqual(
      getComposition(id, "chapter-1").instances,
      OLD_COMPOSITIONS.getComposition(id, "chapter-1").instances,
      id,
    );
  }
});

test("the map shows the Casita del bosque south of the Forest (new world only)", () => {
  assert.equal(SCENE_TO_MAP_LOCATION["forest-cottage"], "cottage");
  const forest = MAP_LOCATIONS.find((l) => l.id === "forest");
  const cottage = MAP_LOCATIONS.find((l) => l.id === "cottage");
  assert.equal(cottage.label, "CASITA");
  assert.equal(cottage.x, forest.x);
  assert.ok(cottage.y > forest.y);
  assert.ok(MAP_LINKS.some(([a, b]) => a === "forest" && b === "cottage"));
  assert.equal(
    OLD_MAP.MAP_LOCATIONS.some((l) => l.id === "cottage"),
    false,
  );
  assert.equal(OLD_MAP.MAP_LINKS.length, MAP_LINKS.length - 1);
});

test("the old world is the default and is untouched", () => {
  // the old forest has one exit and the old plaza keeps its old colliders
  assert.deepEqual(
    OLD.forest.exits.map((e) => e.targetScene),
    ["outskirts"],
  );
  assert.equal(
    OLD.plaza.visual.backgroundSrc,
    "/game/areas/plaza/plaza-background.png",
  );
  assert.ok(
    OLD_COMPOSITIONS.getComposition("plaza", "chapter-1").instances.length > 0,
  );
  assert.ok(
    OLD_COMPOSITIONS.getComposition("mill-farmland", "chapter-1").instances
      .length > 0,
  );
  // nothing in the old world links to the cottage
  for (const scene of Object.values(OLD)) {
    assert.ok(
      !scene.exits.some((e) => e.targetScene === "forest-cottage"),
      scene.id,
    );
  }
});

test("Mountain Path <-> Mine Interior <-> Mine Natural Cave: wired to the hand-drawn zones, both ways, spawns clear and reachable", () => {
  const mine = WORLD_SCENES["mine-interior"];
  const cave = WORLD_SCENES["mine-natural-cave"];
  const to = (scene, target) =>
    scene.exits.find((e) => e.targetScene === target);

  // the south door of the mine (bottom of the room) leads to the Mountain
  // Path, the arch up on the right leads to the cave
  assert.ok(to(mine, "mountain-path").zone.y > size(mine).height * 0.8);
  assert.ok(to(mine, "mine-natural-cave").zone.y < size(mine).height * 0.4);
  assert.deepEqual(
    mine.exits.map((e) => e.zone.x).sort((a, b) => a - b),
    [266, 473],
  );
  assert.equal(to(cave, "mine-interior").zone.x, 67);

  for (const [scene, target] of [
    [mine, "mountain-path"],
    [mine, "mine-natural-cave"],
    [cave, "mine-interior"],
    [WORLD_SCENES["mountain-path"], "mine-interior"],
  ]) {
    const exit = to(scene, target);
    assert.ok(
      WORLD_SCENES[target].arrivals[exit.targetSpawn],
      `${scene.id} -> ${target}`,
    );
    assert.ok(to(WORLD_SCENES[target], scene.id), `${target} leads back`);
  }

  // every arrival is inside the world, free, and every exit can be walked to
  for (const scene of [mine, cave]) {
    const world = size(scene);

    for (const [name, spawn] of Object.entries(scene.arrivals)) {
      const r = feetRect(spawn.x, spawn.y);
      assert.ok(
        r.x >= 0 &&
          r.y >= 0 &&
          r.x + r.width <= world.width &&
          r.y + r.height <= world.height,
        `${scene.id}.${name} outside the world`,
      );
      assert.ok(
        !collidesWithScene(r, scene.colliders),
        `${scene.id}.${name} in collision`,
      );
      const floor = reachable(scene, spawn);

      for (const exit of scene.exits) {
        assert.ok(
          !rectsIntersect(r, exit.zone),
          `${scene.id}.${name} on an exit`,
        );
        assert.ok(
          floor.some(([x, y]) => rectsIntersect(feetRect(x, y), exit.zone)),
          `${scene.id}.${name} cannot reach ${exit.name}`,
        );
      }
    }
  }
});

test("the Decorator export is applied literally (x, y, scale, flipX, colliderEnabled, zOffset)", () => {
  const pins = {
    plaza: {
      "plaza-cat-01": [1194, 782, 1, true],
      "plaza-merchant-cart-01": [1141, 376, 1.28, true],
    },
    farm: {
      "farm-cow-01": [908, 353, 2, true],
      "farm-sheep-01": [326, 444, 1.25, true],
    },
    forest: {
      "forest-villager-sitting-01": [1012, 913, 1.14, true],
      "forest-medicinal-herb-dev-01": [414, 816, 1.15, false],
      "forest-resin-world-01": [572, 188, 1, false],
      "forest-medicinal-herb-dev-02": [772, 661, 0.98, false],
    },
    "mill-farmland": {
      "mill-farmland-beekeeper-01": [1909, 850, 1.08, true],
      "mill-farmland-orange-world-01": [860, 483, 1, false],
      "mill-farmland-orange-world-02": [1844, 872, 1, false],
    },
    "tavern-street": {
      "tavern-street-fruit-vegetable-seller-stall-01": [187, 446, 1.49, true],
      "tavern-street-villager-woman-01-01": [462, 403, 1, true],
    },
  };

  for (const [sceneId, byId] of Object.entries(pins)) {
    for (const [instanceId, [x, y, scale, collider]] of Object.entries(byId)) {
      const i = getComposition(sceneId, "chapter-1").instances.find(
        (c) => c.instanceId === instanceId,
      );
      assert.deepEqual(
        [i.x, i.y, i.scale, i.flipX, i.colliderEnabled, i.zOffset],
        [x, y, scale, false, collider, 0],
        instanceId,
      );
    }
  }
});

test("interactions of instances the export no longer places stay in the table, unused (to be reconnected later)", () => {
  const { getChapterInteractions } = newWorld("src/game/compositions/index.ts");
  const table = getChapterInteractions("chapter-1");

  for (const instanceId of EXPECTED_REMOVED) {
    assert.ok(table[instanceId], `${instanceId} keeps its interaction`);
  }
});

test("nothing sits outside a scene's logical world: every spawn is inside, every collider and transition touches it", () => {
  const camel = (id) => id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const geometryFiles = [
    ...NEW_IDS.map((id) => ({
      id,
      file: `src/game/new-world-map/geometry/${camel(id)}Geometry.ts`,
      prefix: camel(id),
    })),
    {
      id: "mine-interior",
      file: "src/game/mine-interior/mineInteriorGeometry.ts",
      prefix: "mineInterior",
    },
    {
      id: "mine-natural-cave",
      file: "src/game/mine-natural-cave/mineNaturalCaveGeometry.ts",
      prefix: "mineNaturalCave",
    },
  ];

  for (const { id, file, prefix } of geometryFiles) {
    const mod = newWorld(file);
    const world = size(WORLD_SCENES[id]);
    const label = `${id} (${world.width}x${world.height})`;
    const touches = (r) =>
      r.x < world.width &&
      r.y < world.height &&
      r.x + r.width > 0 &&
      r.y + r.height > 0;

    for (const s of mod[`${prefix}Spawns`]) {
      assert.ok(
        s.x >= 0 && s.y >= 0 && s.x <= world.width && s.y <= world.height,
        `${label}: ${s.id} is outside the world`,
      );
    }

    for (const r of [
      ...mod[`${prefix}Colliders`],
      ...mod[`${prefix}Transitions`],
    ]) {
      assert.ok(
        touches(r),
        `${label}: ${r.id} is completely outside the world`,
      );
    }
  }
});

console.log(`\n${passed} tests passed`);
