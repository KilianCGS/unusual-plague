// Tavern, Smithy and Bakery interiors re-authored on their new 1536x1024
// backgrounds: stable scene ids and interaction ids, new world scale, valid
// spawns, reachable NPCs and exits, and the Bakers Bedroom wiring untouched.
//   node tests/interiors-reauthoring.test.mjs
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

const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { DEV_SCENES } = at("src/app/dev/scene/scenes.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { chapter1Compositions } = at("src/game/compositions/chapter-1.ts");
const { chapter1Interactions } = at(
  "src/game/compositions/chapter-1.interactions.ts",
);
const { rectsIntersect, collidesWithScene } = at("src/game/collision.ts");
const { resolveInteractionConversation } = at(
  "src/game/dialogue/interactionDialogues.ts",
);
const { PATIENT_INTERACTION_IDS } = at(
  "src/game/dialogue/storyInteractions.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const WORLD_W = 576;
const WORLD_H = 384;
const feetRect = (x, y) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });

const ROOMS = {
  "tavern-interior": {
    file: "tavern-interior/tavern-interior-background.png",
    street: "tavern-street",
    arrival: "from-tavern-street",
    npcs: {
      "tavern-interior-bartender-01": "chapter1.tavern.bartender",
      "tavern-interior-tavern-patient-sick-01": "chapter1.tavern.sickPatient",
    },
  },
  "smithy-interior": {
    file: "smithy-interior/smithy-interior-background.png",
    street: "smithy-street",
    arrival: "from-smithy-street",
    npcs: { "smithy-interior-blacksmith-01": "chapter1.smithy.blacksmith" },
  },
  "bakery-interior": {
    file: "bakery-interior/bakery-interior-background.png",
    street: "bakery-street",
    arrival: "from-bakery-street",
    npcs: { "bakery-interior-baker-01": "chapter1.bakery.baker" },
  },
};

function pngSize(rel) {
  const b = fs.readFileSync(path.join(root, "public/game/areas", rel));
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

const composition = (id) => chapter1Compositions.find((c) => c.sceneId === id);

test("the three rooms keep their scene ids and use the new 1536x1024 art", () => {
  for (const [id, room] of Object.entries(ROOMS)) {
    assert.equal(WORLD_SCENES[id].id, id);
    assert.deepEqual(pngSize(room.file), { width: 1536, height: 1024 }, id);
    const v = WORLD_SCENES[id].visual;
    assert.equal(v.id, id);
    assert.equal(v.backgroundSrc, `/game/areas/${room.file}`);
    assert.equal(v.assetWidth, 1536);
    assert.equal(v.assetHeight, 1024);
    assert.equal(v.logicalUnitsPerAssetPixel, 0.375);
    assert.equal(v.protagonistScale, undefined, "Doctor at the normal size");
  }
  assert.equal(DEV_SCENES.filter((s) => /-v2$/.test(s.id)).length, 0);
});

test("logical world is 576x384 and the zoom shows the whole room (fixed camera)", () => {
  for (const id of Object.keys(ROOMS)) {
    const v = WORLD_SCENES[id].visual;
    assert.equal(v.assetWidth * v.logicalUnitsPerAssetPixel, WORLD_W);
    assert.equal(v.assetHeight * v.logicalUnitsPerAssetPixel, WORLD_H);
    // computeFrame = min(world, referenceViewport / zoom): the world wins.
    assert.ok(1161 / v.zoomMultiplier >= WORLD_W, id);
    assert.ok(602 / v.zoomMultiplier >= WORLD_H, id);
  }
});

test("every spawn is inside the room, on free floor, facing north, away from the exit", () => {
  for (const [id, room] of Object.entries(ROOMS)) {
    const s = WORLD_SCENES[id];
    const spawn = s.arrivals[room.arrival];
    assert.ok(spawn, `${id} arrival ${room.arrival}`);
    assert.equal(spawn.direction, "north");
    const r = feetRect(spawn.x, spawn.y);
    assert.ok(r.x >= 0 && r.y >= 0);
    assert.ok(r.x + r.width <= WORLD_W && r.y + r.height <= WORLD_H);
    assert.ok(!collidesWithScene(r, s.colliders), `${id} spawn in collision`);
    for (const exit of s.exits) {
      assert.ok(!rectsIntersect(r, exit.zone), `${id} spawns on its exit`);
    }
  }
});

test("each room keeps its single exit to the same street, and the doorway is open", () => {
  for (const [id, room] of Object.entries(ROOMS)) {
    const s = WORLD_SCENES[id];
    assert.equal(s.exits.length, 1);
    assert.equal(s.exits[0].targetScene, room.street);
    assert.ok(!collidesWithScene(s.exits[0].zone, s.colliders), id);
    assert.ok(WORLD_SCENES[room.street].arrivals[s.exits[0].targetSpawn], id);
  }
});

// Flood fill of the free floor with the Doctor's feet hitbox (2-unit steps).
function reachable(sceneId, extraColliders) {
  const s = WORLD_SCENES[sceneId];
  const colliders = [...s.colliders, ...extraColliders];
  const spawn = s.arrivals[ROOMS[sceneId].arrival];
  const key = (x, y) => `${x},${y}`;
  const seen = new Set([key(spawn.x, spawn.y)]);
  const stack = [[spawn.x, spawn.y]];
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (seen.has(key(nx, ny))) continue;
      const r = feetRect(nx, ny);
      if (r.x < 0 || r.y < 0) continue;
      if (r.x + r.width > WORLD_W || r.y + r.height > WORLD_H) continue;
      if (collidesWithScene(r, colliders)) continue;
      seen.add(key(nx, ny));
      stack.push([nx, ny]);
    }
  }
  return seen;
}

test("the exit and every NPC conversation are reachable from the spawn", () => {
  for (const [id, room] of Object.entries(ROOMS)) {
    const comp = composition(id);
    const npcColliders = [];
    for (const inst of comp.instances) {
      const asset = getDecorAsset(inst.assetId);
      if (inst.colliderEnabled && asset.defaultCollider) {
        const c = asset.defaultCollider;
        npcColliders.push({
          x: inst.x + c.offsetX * inst.scale,
          y: inst.y + c.offsetY * inst.scale,
          width: c.width * inst.scale,
          height: c.height * inst.scale,
        });
      }
    }
    const seen = reachable(id, npcColliders);
    const touches = (zone) =>
      [...seen].some((k) => {
        const [x, y] = k.split(",").map(Number);
        return rectsIntersect(feetRect(x, y), zone);
      });
    assert.ok(
      touches(WORLD_SCENES[id].exits[0].zone),
      `${id} exit unreachable`,
    );
    for (const instId of Object.keys(room.npcs)) {
      const inst = comp.instances.find((i) => i.instanceId === instId);
      const z = chapter1Interactions[instId].zone;
      assert.ok(
        touches({
          x: inst.x + z.offsetX,
          y: inst.y + z.offsetY,
          width: z.width,
          height: z.height,
        }),
        `${instId} cannot be talked to`,
      );
    }
  }
});

test("NPCs keep instance ids, assets and interaction ids; none stands inside a wall", () => {
  for (const [id, room] of Object.entries(ROOMS)) {
    const comp = composition(id);
    assert.deepEqual(
      comp.instances.map((i) => i.instanceId).sort(),
      Object.keys(room.npcs).sort(),
      `${id} instances`,
    );
    for (const inst of comp.instances) {
      assert.ok(getDecorAsset(inst.assetId), inst.assetId);
      assert.equal(
        chapter1Interactions[inst.instanceId].interactionId,
        room.npcs[inst.instanceId],
      );
      // The bartender stands behind the bar counter on purpose (as before).
      if (inst.instanceId !== "tavern-interior-bartender-01") {
        assert.ok(
          !collidesWithScene(
            feetRect(inst.x, inst.y),
            WORLD_SCENES[id].colliders,
          ),
          `${inst.instanceId} feet inside a collider`,
        );
      }
      assert.ok(
        inst.x > 0 && inst.x < WORLD_W && inst.y > 0 && inst.y < WORLD_H,
      );
    }
  }
  assert.deepEqual(
    composition("tavern-interior").instances.map((i) => i.assetId),
    ["bartender", "tavern-patient-sick"],
  );
  assert.equal(
    composition("smithy-interior").instances[0].assetId,
    "blacksmith",
  );
  assert.equal(composition("bakery-interior").instances[0].assetId, "baker");
});

test("their conversations still exist (no orphan interaction)", () => {
  for (const room of Object.values(ROOMS)) {
    for (const interactionId of Object.values(room.npcs)) {
      // Patient interactions (Baker, Tavern patient) run the patient flow;
      // everyone else has an ambient conversation.
      if (PATIENT_INTERACTION_IDS[interactionId]) continue;
      const c = resolveInteractionConversation(interactionId, "es", "x");
      assert.ok(c && c.lines.length > 0, interactionId);
    }
  }
});

test("Bakery still connects to the Bakers Bedroom; the bedroom itself is untouched", () => {
  const arrivals = WORLD_SCENES["bakery-interior"].arrivals;
  const back = arrivals["from-bakers-bedroom"];
  const door = arrivals["from-bakery-street"];
  assert.deepEqual({ x: back.x, y: back.y }, { x: door.x, y: door.y });
  assert.equal(back.direction, "south");
  const bedroom = DEV_SCENES.find((s) => s.id === "bakers-bedroom");
  assert.equal(bedroom.assetWidth, 400);
  assert.equal(bedroom.assetHeight, 224);
  assert.deepEqual(pngSize("bakers-bedroom/bakers-bedroom-background.png"), {
    width: 400,
    height: 224,
  });
  const husband = composition("bakers-bedroom").instances[0];
  assert.deepEqual(
    [husband.instanceId, husband.x, husband.y, husband.scale],
    ["bakers-bedroom-bakers-husband-sick-01", 156, 160, 0.97],
  );
});

test("final authored Baker and Blacksmith placements (Decorator exports), reachable with their own zones", () => {
  const baker = composition("bakery-interior").instances[0];
  assert.deepEqual(
    [baker.instanceId, baker.assetId, baker.x, baker.y, baker.scale],
    ["bakery-interior-baker-01", "baker", 320, 167, 0.8],
  );
  const smith = composition("smithy-interior").instances[0];
  assert.deepEqual(
    [smith.instanceId, smith.assetId, smith.x, smith.y, smith.scale],
    ["smithy-interior-blacksmith-01", "blacksmith", 411, 164, 0.99],
  );
  // The Blacksmith works behind the anvil: the Doctor talks to him from just
  // in front of the anvil block, on free floor.
  const scene = WORLD_SCENES["smithy-interior"];
  const anvil = scene.colliders
    .filter(
      (c) =>
        c.x <= smith.x &&
        c.x + c.width >= smith.x &&
        c.y >= smith.y - 10 &&
        c.y <= smith.y + 20,
    )
    .sort((a, b) => b.height - a.height)[0];
  assert.ok(anvil, "anvil block found under him");
  const z = chapter1Interactions[smith.instanceId].zone;
  const feetY = anvil.y + anvil.height + 19;
  const hitbox = { x: smith.x - 6, y: feetY - 19, width: 12, height: 12 };
  assert.ok(
    rectsIntersect(hitbox, {
      x: smith.x + z.offsetX,
      y: smith.y + z.offsetY,
      width: z.width,
      height: z.height,
    }),
  );
  assert.ok(!collidesWithScene(hitbox, scene.colliders));
  assert.ok(scene.exits[0].zone.y - smith.y > 80, "far from the door");
});

console.log(`
${passed} tests passed`);
