// Inventory V2: 6-slot carried inventory, the Apothecary storage (complete-stack
// transfers, atomic), the Empty flask as an ordinary item, and the recipe shapes
// crafting supports. Pure logic against the real source files.
//   node tests/storage.test.mjs
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
const st = at("src/game/storage/storage.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const cr = at("src/game/crafting/crafting.ts");
const pc = at("src/game/patients/patientCases.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { createChapter1Inventory, createChapter1Storage } = at(
  "src/game/inventory/initialInventory.ts",
);
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const stock = (pairs, base = inv.createEmptyInventory()) =>
  pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), base);
const storageOf = (pairs) => stock(pairs, st.createEmptyStorage());
const snap = (x) => JSON.stringify(x);

test("A. the Doctor's inventory holds 6 item types; the storage has its own generous capacity", () => {
  assert.equal(inv.INVENTORY_CAPACITY, 6);
  assert.equal(inv.createEmptyInventory().slots.length, 6);
  assert.equal(createChapter1Inventory().capacity, 6);
  assert.equal(st.createEmptyStorage().capacity, st.STORAGE_CAPACITY);
  assert.ok(st.STORAGE_CAPACITY > inv.INVENTORY_CAPACITY);
  assert.ok(inv.isValidInventory(st.createEmptyStorage()));
});

test("B. Doctor > Storage moves the whole stack and keeps its quantity", () => {
  const doctor = stock([
    ["water", 3],
    ["cloth", 1],
  ]);
  const storage = st.createEmptyStorage();
  const out = st.transferStack(doctor, storage, "water");
  assert.equal(inv.countItem(out.source, "water"), 0);
  assert.equal(inv.countItem(out.destination, "water"), 3);
  assert.equal(inv.countItem(out.source, "cloth"), 1); // the rest is untouched
  assert.equal(inv.countOccupiedSlots(out.source), 1); // the slot is free again
  assert.ok(
    inv.isValidInventory(out.source) && inv.isValidInventory(out.destination),
  );
  // the inputs were not mutated
  assert.equal(inv.countItem(doctor, "water"), 3);
  assert.equal(inv.countItem(storage, "water"), 0);
});

test("C. Storage > Doctor moves the whole stack and keeps its quantity", () => {
  const doctor = inv.createEmptyInventory();
  const storage = storageOf([["salt", 4]]);
  const out = st.transferStack(storage, doctor, "salt");
  assert.equal(inv.countItem(out.source, "salt"), 0);
  assert.equal(inv.countItem(out.destination, "salt"), 4);
});

test("D. a destination that already holds the item merges quantities without a second slot", () => {
  const doctor = stock([["water", 2]]);
  const storage = storageOf([["water", 3]]);
  const out = st.transferStack(doctor, storage, "water");
  assert.equal(inv.countItem(out.destination, "water"), 5);
  assert.equal(inv.countOccupiedSlots(out.destination), 1);
  assert.equal(inv.countOccupiedSlots(out.source), 0);
});

test("E. a full Doctor inventory refuses a NEW type from storage, atomically", () => {
  const doctor = stock(["a", "b", "c", "d", "e", "f"].map((id) => [id, 1]));
  const storage = storageOf([["water", 2]]);
  const [d0, s0] = [snap(doctor), snap(storage)];
  assert.equal(inv.countOccupiedSlots(doctor), 6);
  assert.equal(st.transferStack(storage, doctor, "water"), null);
  assert.equal(snap(doctor), d0);
  assert.equal(snap(storage), s0);
  // an item the source does not hold is not a transfer either
  assert.equal(st.transferStack(storage, doctor, "nothing"), null);
});

test("F. a full Doctor inventory still receives more of a type it already carries", () => {
  const doctor = stock(["water", "b", "c", "d", "e", "f"].map((id) => [id, 1]));
  const storage = storageOf([["water", 2]]);
  const out = st.transferStack(storage, doctor, "water");
  assert.ok(out);
  assert.equal(inv.countItem(out.destination, "water"), 3);
  assert.equal(inv.countOccupiedSlots(out.destination), 6);
});

test("G/H. the Empty flask is an ordinary item: it can be retrieved from the chest and stored again", () => {
  const doctor = createChapter1Inventory();
  const chest = createChapter1Storage();
  assert.equal(inv.countItem(doctor, "empty-flask"), 0);
  assert.equal(inv.countItem(chest, "empty-flask"), 1);
  // retrieve it (the normal full-stack transfer, nothing special)
  const taken = st.transferStack(chest, doctor, "empty-flask");
  assert.equal(inv.countItem(taken.destination, "empty-flask"), 1);
  assert.equal(inv.countItem(taken.source, "empty-flask"), 0);
  // ...and put it back
  const stored = st.transferStack(
    taken.destination,
    taken.source,
    "empty-flask",
  );
  assert.equal(inv.countItem(stored.destination, "empty-flask"), 1);
  assert.equal(inv.countItem(stored.source, "empty-flask"), 0);
});

test("exactly ONE initial Empty flask exists across the carried inventory and the Storage", () => {
  const total = (a, b) =>
    inv.countItem(a, "empty-flask") + inv.countItem(b, "empty-flask");
  const doctor = createChapter1Inventory();
  const chest = createChapter1Storage();
  assert.equal(total(doctor, chest), 1);
  // taking it never duplicates it
  const taken = st.transferStack(chest, doctor, "empty-flask");
  assert.equal(total(taken.destination, taken.source), 1);
  assert.equal(chest.capacity, st.STORAGE_CAPACITY);
  assert.equal(st.STORAGE_CAPACITY, 24);
});

test("I/J. gather.water needs the flask CARRIED (not stored) and never consumes it", () => {
  const examined = { [ch1.BAKER_HUSBAND_ID]: "examined" };
  const decide = (inventory) =>
    story.getGatherDecision("gather.water", { patients: examined, inventory });

  // at the start of the game the flask is still in the chest
  const start = createChapter1Inventory();
  const chest = createChapter1Storage();
  assert.equal(decide(start), "no-container");
  const refusal = story.resolveStoryInteraction(
    "gather.water",
    { patients: examined, inventory: start },
    "en",
    "river",
  );
  assert.deepEqual(refusal.effects, []);
  assert.equal(refusal.notice, "I need a container to collect water.");

  // once it is taken out, water can be gathered and the flask stays
  const taken = st.transferStack(chest, start, "empty-flask");
  assert.equal(decide(taken.destination), "gather");
  const gathered = inv.addItem(taken.destination, "water", 1);
  assert.equal(decide(gathered), "gather");
  assert.equal(inv.countItem(gathered, "empty-flask"), 1);

  // left in the chest again: the Doctor carries none
  const left = st.transferStack(taken.destination, taken.source, "empty-flask");
  assert.equal(decide(left.source), "no-container");
});

test("storage is not crafting stock: a recipe only sees the carried inventory", () => {
  const bandage = RECIPES.find((r) => r.id === "manual.disinfected-bandage");
  const doctor = stock([["cloth", 1]]);
  const storage = storageOf([["alcohol", 1]]);
  assert.equal(cr.canCraft(doctor, bandage), false); // alcohol is still in storage
  const moved = st.transferStack(storage, doctor, "alcohol");
  assert.equal(cr.canCraft(moved.destination, bandage), true);
});

test("the Doctor's Storage is reached ONLY from the chest in his room: exact zone, any facing, no Apothecary access", () => {
  assert.equal(st.STORAGE_INTERACTION_ID, "storage.doctor-room");
  assert.deepEqual(st.doctorRoomStorageInteractions, [
    {
      id: "doctor-room-interaction-1",
      x: 211,
      y: 212,
      width: 23,
      height: 46,
      interactionId: "storage.doctor-room",
    },
  ]);
  assert.equal(
    st.doctorRoomStorageInteractions[0].requiredDirection,
    undefined,
  );
  assert.deepEqual(
    getSceneInteractionZones("doctor-room"),
    st.doctorRoomStorageInteractions,
  );

  // the Apothecary keeps only its three crafting zones
  const zones = getSceneInteractionZones("apothecary-interior");
  assert.deepEqual(
    zones.map((z) => z.interactionId),
    ["craft.manual", "craft.manual", "craft.fire"],
  );
  for (const zone of zones)
    assert.notEqual(zone.interactionId, "storage.apothecary");
  assert.equal(st.apothecaryStorageInteractions, undefined);

  // a zone, not a collider
  const { doctorRoomColliders } = at(
    "src/game/doctor-room/doctorRoomGeometry.ts",
  );
  assert.ok(
    !doctorRoomColliders.some(
      (c) => c.x === 211 && c.y === 212 && c.width === 23 && c.height === 46,
    ),
  );
});

test("crafting shapes for the first days: generic 2- and 3-input recipes on both stations", () => {
  const ing = (...ids) => ids.map((itemId) => ({ itemId, quantity: 1 }));
  const out = (station, ...ids) =>
    cr.findMatchingRecipe(station, ing(...ids))?.output.itemId;

  assert.equal(out("manual", "water", "cloth"), "cold-cloth");
  assert.equal(out("manual", "cloth", "alcohol"), "disinfected-bandage");
  assert.equal(out("fire", "water", "medicinal-herb"), "medicinal-infusion");
  assert.equal(out("fire", "water", "mushroom", "salt"), "mushroom-soup");

  // a future Milk + Honey recipe is just data: no change in the crafting code
  const milkHoney = {
    id: "manual.milk-honey",
    station: "manual",
    inputs: [
      { itemId: "milk", quantity: 1 },
      { itemId: "honey", quantity: 1 },
    ],
    output: { itemId: "honeyed-milk", quantity: 1 },
  };
  assert.equal(
    cr.findMatchingRecipe("manual", ing("honey", "milk"), [milkHoney]).id,
    "manual.milk-honey",
  );
  assert.ok(
    cr.canCraft(
      stock([
        ["milk", 1],
        ["honey", 1],
      ]),
      milkHoney,
    ),
  );
});

test("K. the baker's husband stays completable within 6 slots (gather > craft > treat)", () => {
  const def = ch1.CHAPTER1_PATIENTS[ch1.BAKER_HUSBAND_ID];
  const recipe = (id) => RECIPES.find((r) => r.id === id);
  // the flask is taken out of the chest first (it starts there)
  let doctor = st.transferStack(
    createChapter1Storage(),
    createChapter1Inventory(),
    "empty-flask",
  ).destination;
  // gather 2 water, 1 herb, 1 cloth: flask + water + herb + cloth = 4 types
  doctor = stock(
    [
      ["water", 2],
      ["medicinal-herb", 1],
      ["cloth", 1],
    ],
    doctor,
  );
  assert.ok(inv.countOccupiedSlots(doctor) <= 6);
  // cold cloth and infusion: at most 5 types at any moment
  doctor = cr.craft(doctor, recipe("manual.cold-cloth"));
  assert.ok(doctor && inv.countOccupiedSlots(doctor) <= 6);
  doctor = cr.craft(doctor, recipe("fire.medicinal-infusion"));
  assert.ok(doctor && inv.countOccupiedSlots(doctor) <= 6);
  const state = { [ch1.BAKER_HUSBAND_ID]: "examined" };
  assert.ok(pc.isTreatable(state, def, doctor));
  const treated = pc.treatPatient(state, def, doctor);
  assert.equal(
    pc.getPatientStatus(treated.state, ch1.BAKER_HUSBAND_ID),
    "treated",
  );
  assert.equal(inv.countItem(treated.inventory, "empty-flask"), 1); // never consumed
});

console.log(`\n${passed} tests passed`);
