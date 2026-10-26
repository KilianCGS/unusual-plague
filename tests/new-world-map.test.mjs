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

// One module graph. The new world is the only world: nothing reads an
// environment variable any more.
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
const newWorld = (rel) => load(path.join(root, rel));

const { WORLD_SCENES } = newWorld("src/game/world/worldScenes.ts");
// The legacy exterior tables (kept in the repository, no longer played): the
// source of the topology the new world must keep.
const OLD = newWorld("src/game/world/worldScenes.ts").OLD_WORLD_SCENES;
const { NEW_WORLD_SCENE_IDS } = newWorld(
  "src/game/new-world-map/worldVariant.ts",
);
const { rectsIntersect, collidesWithScene } = newWorld("src/game/collision.ts");
const { getSceneWorld } = newWorld("src/app/dev/scene/scenes.ts");
const { SCENE_TO_MAP_LOCATION, MAP_LINKS, MAP_LOCATIONS } = newWorld(
  "src/game/map/mapLocations.ts",
);
const { getComposition } = newWorld("src/game/compositions/index.ts");
// The legacy placements of chapter-1.ts (the interiors still use them).
const LEGACY_COMPOSITIONS = newWorld(
  "src/game/compositions/chapter-1.ts",
).chapter1Compositions;
const OLD_COMPOSITIONS = {
  getComposition: (sceneId, chapterId) =>
    LEGACY_COMPOSITIONS.find(
      (c) => c.sceneId === sceneId && c.chapterId === chapterId,
    ),
};
const OLD_INTERACTIONS = newWorld(
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
  "mill-farmland-orange-world-02",
];
const EXPECTED_REMOVED = [
  "tavern-street-villager-woman-02-01",
  "mill-farmland-farmer-old-01",
  "mill-farmland-villager-young-01",
];
// Every interactive thing placed in the new world can be reached on foot.
const KNOWN_UNREACHABLE_ZONES = [];
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

  assert.deepEqual(targets(WORLD_SCENES, "forest-cottage"), [
    "forest",
    "forest-cottage-interior",
  ]);
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
  assert.ok(toCottage.y > forestHeight * 0.9);
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
  const unreachableZones = [];

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

    // The gameplay property: an interactive thing (a character with an
    // interaction, or a collectible) is usable when SOME walkable position of
    // the Doctor's feet overlaps its interaction zone (that is what the [E]
    // prompt tests), whatever the anchor of its sprite touches. Zones come
    // from the same resolver the game uses (collectibles: sprite box + reach).
    const floor = reachable(withDecor, Object.values(scene.arrivals)[0]);
    const usable = (zone) =>
      floor.some(([x, y]) => rectsIntersect(feetRect(x, y), zone));

    for (const zone of decor.zones) {
      if (!usable(zone)) unreachableZones.push(zone.id);
    }

    // scene-level zones too (the river bank)
    for (const zone of getSceneInteractionZones(id)) {
      assert.ok(usable(zone), `${id} ${zone.id}`);
    }
  }

  // Interactive things whose zone no walkable position reaches TODAY (the
  // placement and the geometry are both hand-made; to be fixed by hand). An
  // exact list: a new gap fails, and so does one that gets fixed (update it).
  assert.deepEqual(unreachableZones.sort(), KNOWN_UNREACHABLE_ZONES);

  assert.equal(total, 32);

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

test("the map shows the Casita del bosque south of the Forest", () => {
  assert.equal(SCENE_TO_MAP_LOCATION["forest-cottage"], "cottage");
  const forest = MAP_LOCATIONS.find((l) => l.id === "forest");
  const cottage = MAP_LOCATIONS.find((l) => l.id === "cottage");
  assert.equal(cottage.label, "CASITA");
  assert.equal(cottage.x, forest.x);
  assert.ok(cottage.y > forest.y);
  assert.ok(MAP_LINKS.some(([a, b]) => a === "forest" && b === "cottage"));
});

test("the new world is the only world: nothing selects a world through an environment variable", () => {
  // the played table is the new one: new backgrounds, the Forest leads to the cottage
  assert.equal(
    WORLD_SCENES.plaza.visual.backgroundSrc,
    "/game/new-world-map/plaza-background.png",
  );
  assert.deepEqual(WORLD_SCENES.forest.exits.map((e) => e.targetScene).sort(), [
    "forest-cottage",
    "outskirts",
  ]);
  assert.ok(WORLD_SCENES["forest-cottage-interior"]);

  // the legacy tables are still there, untouched and unplayed
  assert.deepEqual(
    OLD.forest.exits.map((e) => e.targetScene),
    ["outskirts"],
  );
  assert.ok(
    OLD_COMPOSITIONS.getComposition("plaza", "chapter-1").instances.length > 0,
  );

  // no code reads NEXT_PUBLIC_WORLD
  const readers = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) walk(full);
      else if (/[.](ts|tsx)$/.test(entry.name)) {
        const code = fs
          .readFileSync(full, "utf8")
          .split(String.fromCharCode(10))
          .filter((line) => !line.trim().startsWith("//"))
          .join(String.fromCharCode(10));

        if (code.includes("NEXT_PUBLIC_WORLD")) readers.push(full);
      }
    }
  };
  walk(path.join(root, "src"));
  assert.deepEqual(readers, []);
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
      "forest-resin-world-01": [576, 189, 1, false],
      "forest-medicinal-herb-dev-01": [771, 664, 1.25, false],
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
      id: "forest-cottage-interior",
      file: "src/game/forest-cottage-interior/forestCottageInteriorGeometry.ts",
      prefix: "forestCottageInterior",
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

test("Forest <-> Forest Cottage <-> Forest Cottage Interior: wired both ways to the hand-drawn zones, spawns clear, door and way out reachable", () => {
  const forest = WORLD_SCENES.forest;
  const cottage = WORLD_SCENES["forest-cottage"];
  const inside = WORLD_SCENES["forest-cottage-interior"];
  const exitTo = (scene, name) => scene.exits.find((e) => e.name === name);

  // the exact zones and spawns used by each hop
  assert.equal(exitTo(forest, "to-forest-cottage").zone.x, 696); // forest-transition-2
  assert.equal(exitTo(forest, "to-forest-cottage").targetSpawn, "from-forest");
  assert.deepEqual(cottage.arrivals["from-forest"], {
    x: 690,
    y: 100,
    direction: "south",
  }); // forest-cottage-spawn-1
  assert.equal(exitTo(cottage, "to-forest").zone.x, 650); // forest-cottage-transition-1
  assert.equal(exitTo(cottage, "to-forest").targetSpawn, "from-forest-cottage");

  assert.equal(exitTo(cottage, "to-forest-cottage-interior").zone.x, 311); // forest-cottage-transition-2
  assert.equal(
    exitTo(cottage, "to-forest-cottage-interior").targetSpawn,
    "from-forest-cottage",
  );
  assert.deepEqual(inside.arrivals["from-forest-cottage"], {
    x: 256,
    y: 307,
    direction: "south",
  }); // forest-cottage-interior-spawn-1
  assert.equal(exitTo(inside, "to-forest-cottage").zone.x, 224); // interior transition-1
  assert.equal(
    exitTo(inside, "to-forest-cottage").targetSpawn,
    "from-forest-cottage-interior",
  );
  assert.deepEqual(cottage.arrivals["from-forest-cottage-interior"], {
    x: 353,
    y: 597,
    direction: "south",
  }); // forest-cottage-spawn-2

  assert.equal(cottage.colliders.length, 25);
  assert.equal(inside.colliders.length, 11);
  assert.equal(inside.exits.length, 1);
  assert.equal(
    getComposition("forest-cottage-interior", "chapter-1"),
    undefined,
  );
  assert.deepEqual(getSceneInteractionZones("forest-cottage-interior"), []);

  for (const scene of [cottage, inside]) {
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

console.log(`\n${passed} tests passed`);
