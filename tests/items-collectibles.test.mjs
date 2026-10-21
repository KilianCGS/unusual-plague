// Items, inventory operations and world collectibles: pure logic, checked
// against the real source files.
//   node tests/items-collectibles.test.mjs
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

const inv = at("src/game/inventory/inventory.ts");
const { ITEMS, getItemName } = at("src/game/items/items.ts");
const { itemFeedbackCopy } = at("src/game/i18n/items.ts");
const col = at("src/game/collectibles/collectibles.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { getComposition } = at("src/game/compositions/index.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const HERB = "medicinal-herb";
const types = (n) => Array.from({ length: n }, (_, i) => `item-${i + 1}`);
const fill = (ids) =>
  ids.reduce((state, id) => inv.addItem(state, id), inv.createEmptyInventory());

test("1. the inventory starts with 6 empty slots", () => {
  const state = inv.createEmptyInventory();
  assert.equal(state.slots.length, 6);
  assert.equal(state.capacity, 6);
  assert.equal(inv.countOccupiedSlots(state), 0);
});

test("2. adding to an empty inventory takes one slot (the first empty one)", () => {
  const next = inv.addItem(inv.createEmptyInventory(), HERB);
  assert.deepEqual(next.slots[0], { itemId: HERB, quantity: 1 });
  assert.equal(inv.countOccupiedSlots(next), 1);
});

test("3. the same item grows the stack and does not take another slot", () => {
  let state = inv.addItem(inv.createEmptyInventory(), HERB);
  state = inv.addItem(state, HERB);
  assert.equal(inv.countOccupiedSlots(state), 1);
  assert.equal(inv.countItem(state, HERB), 2);
  assert.equal(state.slots[0].quantity, 2);
  assert.ok(inv.isValidInventory(state));
});

test("4. different item types take different slots", () => {
  const state = fill(["a", "b", "c"]);
  assert.deepEqual(
    state.slots.slice(0, 3).map((s) => s.itemId),
    ["a", "b", "c"],
  );
  assert.equal(inv.countOccupiedSlots(state), 3);
});

test("5. six different types fill the inventory", () => {
  const state = fill(types(6));
  assert.equal(inv.countOccupiedSlots(state), 6);
  assert.ok(inv.isValidInventory(state));
});

test("6. a 7th type cannot be added", () => {
  const full = fill(types(6));
  assert.equal(inv.canAddItem(full, "item-7"), false);
  assert.equal(inv.addItem(full, "item-7"), null);
});

test("7. a full inventory still accepts more of a type it already holds", () => {
  const full = fill([HERB, ...types(5)]);
  assert.equal(inv.countOccupiedSlots(full), 6);
  assert.equal(inv.canAddItem(full, HERB), true);
  const more = inv.addItem(full, HERB, 2);
  assert.equal(inv.countItem(more, HERB), 3);
  assert.equal(inv.countOccupiedSlots(more), 6);
});

test("8. addItem is immutable", () => {
  const before = inv.addItem(inv.createEmptyInventory(), HERB);
  const snapshot = JSON.stringify(before);
  const slotsRef = before.slots;
  const slot0Ref = before.slots[0];
  const after = inv.addItem(before, HERB);
  assert.equal(JSON.stringify(before), snapshot);
  assert.equal(before.slots, slotsRef);
  assert.equal(before.slots[0], slot0Ref);
  assert.notEqual(after, before);
  assert.notEqual(after.slots, before.slots);
  assert.notEqual(after.slots[0], before.slots[0]);
  // a failed add leaves the state alone too
  const full = fill(types(6));
  const fullSnapshot = JSON.stringify(full);
  inv.addItem(full, "item-7");
  assert.equal(JSON.stringify(full), fullSnapshot);
});

test("addItem rejects non-positive or fractional quantities", () => {
  const empty = inv.createEmptyInventory();
  for (const q of [0, -1, 1.5, NaN])
    assert.equal(inv.addItem(empty, HERB, q), null);
});

test("9. a picked-up instance is identified by its instanceId (immutably)", () => {
  const none = col.NO_COLLECTED;
  const one = col.markCollected(none, "forest-medicinal-herb-dev-01");
  assert.equal(col.isCollected(one, "forest-medicinal-herb-dev-01"), true);
  assert.equal(col.isCollected(one, "forest-medicinal-herb-02"), false);
  assert.equal(col.isCollected(none, "forest-medicinal-herb-dev-01"), false);
  assert.notEqual(one, none);
});

test("10. itemId and instanceId are not confused: two instances, one item, one stack", () => {
  let collected = col.NO_COLLECTED;
  let state = inv.createEmptyInventory();
  for (const instanceId of ["forest-herb-01", "forest-herb-02"]) {
    state = inv.addItem(state, HERB);
    collected = col.markCollected(collected, instanceId);
  }
  assert.equal(inv.countItem(state, HERB), 2); // inventory groups by itemId
  assert.equal(inv.countOccupiedSlots(state), 1);
  assert.equal(collected.size, 2); // the world remembers by instanceId
  assert.equal(col.isCollected(collected, HERB), false); // an item id is not an instance id
  assert.equal(inv.countItem(state, "forest-herb-01"), 0);
});

test("11. texts exist in ES and EN", () => {
  assert.equal(getItemName(HERB, "es"), "Hierba medicinal");
  assert.equal(getItemName(HERB, "en"), "Medicinal herb");
  assert.equal(
    itemFeedbackCopy.es.obtained + getItemName(HERB, "es"),
    "Has obtenido: Hierba medicinal",
  );
  assert.equal(
    itemFeedbackCopy.en.obtained + getItemName(HERB, "en"),
    "Obtained: Medicinal herb",
  );
  assert.equal(
    itemFeedbackCopy.es.inventoryFull,
    "No tengo espacio para llevar esto.",
  );
  assert.equal(
    itemFeedbackCopy.en.inventoryFull,
    "I don't have room to carry this.",
  );
  for (const item of Object.values(ITEMS))
    assert.ok(item.name.es && item.name.en);
});

test("the collectible asset gives a catalog item", () => {
  const asset = getDecorAsset("medicinal-herb-dev");
  assert.equal(asset.collectibleItemId, HERB);
  assert.ok(ITEMS[asset.collectibleItemId]);
});

test("the forest herb: has a zone and gives the item until it is collected, then vanishes", () => {
  const forest = getComposition("forest", "chapter-1");
  const herb = forest.instances.find(
    (i) => i.instanceId === "forest-medicinal-herb-dev-01",
  );
  assert.ok(herb, "the herb is placed in the forest");
  assert.ok(forest.instances.length > 1, "the forest keeps its own population");

  const before = resolveDecorInstances(forest.instances, {}, col.NO_COLLECTED);
  assert.ok(
    before.sprites.some((s) => s.instance.instanceId === herb.instanceId),
  );
  const zone = before.zones.find((z) => z.id === `${herb.instanceId}-zone`);
  assert.equal(zone.interactionId, "collect.medicinal-herb");
  assert.equal(before.zoneItemIds.get(zone.id), HERB);
  assert.equal(before.zoneInstanceIds.get(zone.id), herb.instanceId);

  const after = resolveDecorInstances(
    forest.instances,
    {},
    col.markCollected(col.NO_COLLECTED, herb.instanceId),
  );
  assert.ok(
    !after.sprites.some((s) => s.instance.instanceId === herb.instanceId),
  );
  assert.ok(!after.zones.some((z) => z.id === `${herb.instanceId}-zone`));
  assert.ok(!after.colliders.some((c) => c.id.startsWith(herb.instanceId)));
  // everything else in the scene is untouched
  assert.equal(after.sprites.length, before.sprites.length - 1);
});

console.log(`\n${passed} tests passed`);
