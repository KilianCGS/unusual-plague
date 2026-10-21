// World authoring pass: Beekeeper and Farmer (hoeing) registered, the authored
// Tavern Street / Mine / Forest compositions, the larger Doctor Room chest zone,
// the generic collectible path for a placed Mushroom, and nothing of Patient 2.
//   node tests/world-authoring.test.mjs
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

const { DECOR_ASSETS, getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { getComposition } = at("src/game/compositions/index.ts");
const { chapter1Compositions } = at("src/game/compositions/chapter-1.ts");
const { chapter1Interactions } = at(
  "src/game/compositions/chapter-1.interactions.ts",
);
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const col = at("src/game/collectibles/collectibles.ts");
const inv = at("src/game/inventory/inventory.ts");
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);
const { findAvailableInteraction } = at(
  "src/game/interactions/interactionZone.ts",
);
const { tavernStreetSellerZone } = at(
  "src/game/tavern-street/tavernStreetGeometry.ts",
);
const { STORAGE_INTERACTION_ID, doctorRoomStorageInteractions } = at(
  "src/game/storage/storage.ts",
);
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { resolveInteractionConversation } = at(
  "src/game/dialogue/interactionDialogues.ts",
);
const ch1 = at("src/game/patients/chapter1Patients.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { GATHER_SOURCES, NPC_PROVIDES } = at(
  "src/game/dialogue/storyInteractions.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const pngSize = (publicPath) => {
  const file = path.join(root, "public", publicPath);
  assert.ok(fs.existsSync(file), `missing ${publicPath}`);
  const header = fs.readFileSync(file).subarray(0, 24);
  assert.equal(header.subarray(1, 4).toString(), "PNG", publicPath);
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
};
const feetAt = (x, y) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
const placed = (sceneId) => getComposition(sceneId, "chapter-1").instances;
const ALL_PLACED = chapter1Compositions.flatMap((c) => c.instances);

test("Beekeeper and Farmer (hoeing) are registered in the Decorator, with real frames, calm fps and a feet anchor", () => {
  const spec = {
    beekeeper: { dir: "beekeeper", fps: 3 },
    "farmer-hoeing": { dir: "farmer-hoeing", fps: 4 },
  };
  for (const [id, s] of Object.entries(spec)) {
    const asset = getDecorAsset(id);
    assert.ok(asset, id);
    assert.equal(asset.category, "people", id);
    assert.deepEqual(
      asset.sprite.frames,
      [0, 1, 2, 3].map((i) => `/game/npcs/${s.dir}/idle/${i}.png`),
      id,
    );
    for (const frame of asset.sprite.frames) {
      assert.deepEqual(
        pngSize(frame),
        { width: 96, height: 96 },
        `${id} ${frame}`,
      );
    }
    assert.equal(asset.sprite.frameWidth, 96);
    assert.equal(asset.sprite.frameHeight, 96);
    assert.equal(asset.sprite.fps, s.fps, id);
    assert.equal(asset.sprite.loop, true);
    assert.deepEqual(asset.anchor, { x: 0.5, y: 1 }); // bottom-centre, like the other 96x96 NPCs
    assert.equal(asset.defaultScale, 1);
    // a body collider like the other working NPCs, inside the frame
    const c = asset.defaultCollider;
    assert.ok(c && c.width > 0 && c.height > 0, id);
    assert.ok(c.offsetX >= -48 && c.offsetX + c.width <= 48, id);
    assert.ok(c.offsetY >= -96 && c.offsetY + c.height <= 0, id);
    // no gameplay attached
    assert.equal(asset.collectibleItemId, undefined, id);
    // placed only by hand in Mill Farmland (see that test), never by code
    assert.ok(
      ALL_PLACED.filter((i) => i.assetId === id).every((i) =>
        i.instanceId.startsWith("mill-farmland-"),
      ),
      `${id} placed only in Mill Farmland`,
    );
    assert.ok(
      !getDecorAsset(`${id}-smartphone`),
      `${id} has no smartphone variant`,
    );
  }
  // listed under people in the Decorator library
  const people = DECOR_ASSETS.filter((a) => a.category === "people").map(
    (a) => a.id,
  );
  assert.ok(people.includes("beekeeper") && people.includes("farmer-hoeing"));
});

test("Tavern Street: the pre-existing woman and man, plus the authored fruit seller beside the Tavern", () => {
  assert.deepEqual(placed("tavern-street"), [
    {
      instanceId: "tavern-street-villager-woman-02-01",
      assetId: "villager-woman-02",
      x: 345,
      y: 312,
      scale: 1,
      flipX: false,
      colliderEnabled: true,
      zOffset: 0,
    },
    {
      instanceId: "tavern-street-villager-man-01-01",
      assetId: "villager-man-01",
      x: 547,
      y: 339,
      scale: 1,
      flipX: false,
      colliderEnabled: true,
      zOffset: 0,
    },
    {
      instanceId: "tavern-street-fruit-vegetable-seller-stall-01",
      assetId: "fruit-vegetable-seller-stall",
      x: 158,
      y: 334,
      scale: 1.29,
      flipX: false,
      colliderEnabled: true,
      zOffset: 0,
    },
  ]);
  // the woman was never replaced by the seller: her interaction and ES/EN
  // dialogue are intact
  assert.equal(
    chapter1Interactions["tavern-street-villager-woman-02-01"].interactionId,
    "chapter1.tavernStreet.woman",
  );
  const es = resolveInteractionConversation(
    "chapter1.tavernStreet.woman",
    "es",
    "x",
  );
  const en = resolveInteractionConversation(
    "chapter1.tavernStreet.woman",
    "en",
    "x",
  );
  assert.equal(
    es.lines[0].text,
    "Anoche juré que no volvería a entrar en esa taberna.",
  );
  assert.equal(
    en.lines[0].text,
    "Last night I swore I'd never set foot in that tavern again.",
  );
});

test("Mill Farmland: the authored Beekeeper, Farmer (hoeing) and Orange, with no gameplay of their own", () => {
  const by = (id) => placed("mill-farmland").find((i) => i.instanceId === id);
  const pin = (id, assetId, x, y, scale, colliderEnabled) =>
    assert.deepEqual(by(id), {
      instanceId: id,
      assetId,
      x,
      y,
      scale,
      flipX: false,
      colliderEnabled,
      zOffset: 0,
    });
  pin("mill-farmland-beekeeper-01", "beekeeper", 1190, 555, 1.08, true);
  pin("mill-farmland-farmer-hoeing-01", "farmer-hoeing", 1226, 428, 1.17, true);
  pin("mill-farmland-orange-world-01", "orange-world", 860, 483, 1, false);
  // no dialogue or interaction for the two NPCs, and the Orange is collected by
  // the generic path only (the asset's collectibleItemId)
  for (const id of [
    "mill-farmland-beekeeper-01",
    "mill-farmland-farmer-hoeing-01",
  ]) {
    assert.equal(chapter1Interactions[id], undefined, id);
  }
  assert.equal(getDecorAsset("orange-world").collectibleItemId, "orange");
});

test("the seller's authored interaction rectangle is kept but INACTIVE: no [E] prompt that does nothing", () => {
  assert.deepEqual(tavernStreetSellerZone, {
    id: "tavern-street-interaction-1",
    x: 280,
    y: 299,
    width: 119,
    height: 27,
    interactionId: "",
  });
  // not registered for the scene, and the stall has no instance interaction
  assert.deepEqual(getSceneInteractionZones("tavern-street"), []);
  assert.equal(
    chapter1Interactions["tavern-street-fruit-vegetable-seller-stall-01"],
    undefined,
  );
  const resolved = resolveDecorInstances(
    placed("tavern-street"),
    chapter1Interactions,
    col.NO_COLLECTED,
  );
  assert.ok(
    !resolved.zones.some((z) => z.id.includes("fruit-vegetable-seller")),
  );
  // standing in the authored rectangle gives no interaction at all
  const inside = feetAt(
    tavernStreetSellerZone.x + 60,
    tavernStreetSellerZone.y + 25,
  );
  const available = findAvailableInteraction(
    [
      ...getSceneInteractionZones("tavern-street"),
      ...resolved.zones.filter((z) => z.id.includes("seller")),
    ],
    inside,
    "north",
  );
  assert.equal(available, null);
  // the registry does not hold any zone with an empty id anywhere
  for (const scene of Object.keys(WORLD_SCENES)) {
    for (const zone of getSceneInteractionZones(scene))
      assert.notEqual(zone.interactionId, "", scene);
  }
});

test("Doctor Room chest: the larger authored rectangle replaces the old one; the id and behaviour are unchanged", () => {
  assert.equal(STORAGE_INTERACTION_ID, "storage.doctor-room");
  assert.deepEqual(doctorRoomStorageInteractions, [
    {
      id: "doctor-room-interaction-1",
      x: 211,
      y: 212,
      width: 23,
      height: 46,
      interactionId: "storage.doctor-room",
    },
  ]);
  assert.equal(doctorRoomStorageInteractions[0].requiredDirection, undefined); // any facing
  assert.deepEqual(
    getSceneInteractionZones("doctor-room"),
    doctorRoomStorageInteractions,
  );
  // the old rectangle (x228, w9, h47) is no longer anywhere
  assert.ok(
    !getSceneInteractionZones("doctor-room").some(
      (z) => z.x === 228 || z.width === 9,
    ),
  );
  assert.ok(
    !/x: 228,\s*y: 212,\s*width: 9/.test(read("src/game/storage/storage.ts")),
  );
  // more forgiving: the Doctor reaches it from further west, but not from the start spawn
  const zones = getSceneInteractionZones("doctor-room");
  assert.equal(
    findAvailableInteraction(zones, feetAt(215, 240), "south")?.interactionId,
    "storage.doctor-room",
  );
  assert.equal(
    findAvailableInteraction(zones, feetAt(224, 240), "west")?.interactionId,
    "storage.doctor-room",
  );
  assert.equal(
    findAvailableInteraction(zones, feetAt(173, 168), "south"),
    null,
  );
  // the tutorial and the Storage still target that same id; the Apothecary arrival is untouched
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("availableInteractionId === STORAGE_INTERACTION_ID"));
  assert.ok(game.includes("interactionId === STORAGE_INTERACTION_ID"));
  assert.deepEqual(
    WORLD_SCENES["apothecary-interior"].arrivals["from-doctor-room"],
    { x: 444, y: 147, direction: "south" },
  );
});

test("Mine Interior: exactly the authored miner and Mushroom; Natural Cave has no Mushroom", () => {
  assert.deepEqual(placed("mine-interior"), [
    {
      instanceId: "mine-interior-injured-miner-01",
      assetId: "injured-miner",
      x: 141,
      y: 305,
      scale: 0.72,
      flipX: false,
      colliderEnabled: false,
      zOffset: 0,
    },
    {
      instanceId: "mine-interior-mushroom-world-01",
      assetId: "mushroom-world",
      x: 407,
      y: 241,
      scale: 0.86,
      flipX: false,
      colliderEnabled: false,
      zOffset: 1,
    },
  ]);
  const cave = getComposition("mine-natural-cave", "chapter-1");
  assert.ok(
    !(cave?.instances ?? []).some((i) => i.assetId === "mushroom-world"),
  );
});

test("Forest: exactly the authored woodcutter, sitting villager and Medicinal herb (no second herb)", () => {
  assert.deepEqual(placed("forest"), [
    {
      instanceId: "forest-woodcutter-01",
      assetId: "woodcutter",
      x: 306,
      y: 220,
      scale: 1,
      flipX: false,
      colliderEnabled: true,
      zOffset: 0,
    },
    {
      instanceId: "forest-villager-sitting-01",
      assetId: "villager-sitting",
      x: 688,
      y: 742,
      scale: 1.14,
      flipX: false,
      colliderEnabled: true,
      zOffset: 0,
    },
    {
      instanceId: "forest-medicinal-herb-dev-01",
      assetId: "medicinal-herb-dev",
      x: 414,
      y: 816,
      scale: 1.15,
      flipX: false,
      colliderEnabled: false,
      zOffset: 0,
    },
  ]);
  // the old DEV placement file is gone, so the herb exists only once
  assert.ok(
    !fs.existsSync(
      path.join(root, "src/game/compositions/chapter-1.collectibles.ts"),
    ),
  );
  assert.equal(
    placed("forest").filter((i) => i.assetId === "medicinal-herb-dev").length,
    1,
  );
});

test("generic collectibles: a placed Mushroom is collectible exactly like the Herb, through the same code, with no authored zone", () => {
  const collectible = (sceneId, instanceId, itemId) => {
    const before = resolveDecorInstances(
      placed(sceneId),
      chapter1Interactions,
      col.NO_COLLECTED,
    );
    const zone = before.zones.find((z) => z.id === `${instanceId}-zone`);
    assert.ok(zone, `${instanceId} has a zone derived from its sprite`);
    assert.equal(zone.interactionId, col.collectInteractionId(itemId));
    assert.equal(before.zoneItemIds.get(zone.id), itemId);
    assert.equal(before.zoneInstanceIds.get(zone.id), instanceId);
    // the Doctor next to it gets the prompt, standing on the ground in front of it
    const instance = placed(sceneId).find((i) => i.instanceId === instanceId);
    assert.equal(
      findAvailableInteraction(
        [zone],
        feetAt(instance.x, instance.y + 5),
        "north",
      )?.interactionId,
      `collect.${itemId}`,
    );
    // collected: gone from sprites and zones (session state)
    const after = resolveDecorInstances(
      placed(sceneId),
      chapter1Interactions,
      col.markCollected(col.NO_COLLECTED, instanceId),
    );
    assert.ok(!after.sprites.some((s) => s.instance.instanceId === instanceId));
    assert.ok(!after.zones.some((z) => z.id === zone.id));
  };
  collectible("mine-interior", "mine-interior-mushroom-world-01", "mushroom");
  collectible("forest", "forest-medicinal-herb-dev-01", "medicinal-herb");
  // both assets name their item; nothing else is needed
  assert.equal(getDecorAsset("mushroom-world").collectibleItemId, "mushroom");
  assert.equal(
    getDecorAsset("medicinal-herb-dev").collectibleItemId,
    "medicinal-herb",
  );
  // no resource-specific collection code anywhere in the runtime
  for (const file of [
    "src/game/world/GameWorld.tsx",
    "src/game/decor/decorRuntime.ts",
    "src/game/collectibles/collectibles.ts",
  ]) {
    assert.ok(
      !/mushroom|medicinal-herb/i.test(read(file)),
      `${file} has no per-resource logic`,
    );
  }
});

test("collecting respects the inventory: with room it adds the item; when full the item stays in the world", () => {
  const empty = inv.createEmptyInventory();
  const added = inv.addItem(empty, "mushroom", 1);
  assert.equal(inv.countItem(added, "mushroom"), 1);
  const full = ["a", "b", "c", "d", "e", "f"].reduce(
    (state, id) => inv.addItem(state, id, 1),
    empty,
  );
  assert.equal(inv.canAddItem(full, "mushroom"), false);
  assert.equal(inv.addItem(full, "mushroom", 1), null);
  // GameWorld's pick-up: only adds and marks collected if canAddItem; otherwise the "no room" notice
  const game = read("src/game/world/GameWorld.tsx");
  const pickup = game.slice(
    game.indexOf("// A collectible: pick it up if it fits"),
    game.indexOf("// Interactions whose result depends on the story"),
  );
  assert.ok(/canAddItem\(inventoryRef\.current, source\.itemId\)/.test(pickup));
  assert.ok(pickup.indexOf("markCollected") > pickup.indexOf("canAddItem"));
  assert.ok(pickup.includes("copy.inventoryFull"));
  // a stack already carried still takes more even when the pocket is full
  const fullWithMushroom = ["mushroom", "b", "c", "d", "e", "f"].reduce(
    (state, id) => inv.addItem(state, id, 1),
    empty,
  );
  assert.equal(
    inv.countItem(inv.addItem(fullWithMushroom, "mushroom", 1), "mushroom"),
    2,
  );
});

test("this pass adds no Patient 2, no Honey or Milk acquisition, no new recipe and no NPC behaviour", () => {
  assert.deepEqual(Object.keys(ch1.CHAPTER1_PATIENTS), [ch1.BAKER_HUSBAND_ID]);
  assert.equal(RECIPES.length, 6);
  assert.deepEqual(Object.keys(GATHER_SOURCES), ["gather.water"]);
  assert.deepEqual(NPC_PROVIDES, { "chapter1.plaza.merchant": ["cloth"] });
  for (const asset of DECOR_ASSETS) {
    assert.ok(
      !["honey", "milk"].includes(asset.collectibleItemId),
      `${asset.id} gives no honey/milk`,
    );
  }
  // the two new NPCs and the seller have no interaction, dialogue or placement by code
  // (the Beekeeper and Farmer are placed in Mill Farmland, with no behaviour)
  for (const [instanceId, entry] of Object.entries(chapter1Interactions)) {
    assert.ok(
      !/beekeeper|farmer-hoeing|fruit-vegetable/.test(instanceId),
      instanceId,
    );
    assert.ok(
      !/honey|milk|beekeeper|seller/i.test(entry.interactionId),
      entry.interactionId,
    );
  }
});

console.log(`\n${passed} tests passed`);
