// Pure logic of the tutorial state machine and the inventory model, checked
// against the real source files.
//   node tests/tutorial-inventory.test.mjs
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
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const { advanceTutorial, INITIAL_TUTORIAL_STEP } = at("src/game/tutorial/tutorialFlow.ts");
const { tutorialCopy } = at("src/game/i18n/tutorial.ts");
const { inventoryCopy } = at("src/game/i18n/inventory.ts");
const inv = at("src/game/inventory/inventory.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const ALL_EVENTS = ["intro-finished", "book-opened", "map-opened", "player-moved", "interaction-started"];
const ORDER = [
  ["intro", "intro-finished", "book"],
  ["book", "book-opened", "map"],
  ["map", "map-opened", "move"],
  ["move", "player-moved", "interact"],
  ["interact", "interaction-started", "done"],
];

test("the tutorial starts at the monologue", () => {
  assert.equal(INITIAL_TUTORIAL_STEP, "intro");
});

test("steps go intro > book > map > move > interact > done, each by its own event", () => {
  let step = INITIAL_TUTORIAL_STEP;
  for (const [from, event, to] of ORDER) {
    assert.equal(step, from);
    step = advanceTutorial(step, event);
    assert.equal(step, to);
  }
});

test("any other event does not advance a step", () => {
  for (const [from, own] of ORDER) {
    for (const event of ALL_EVENTS.filter((e) => e !== own)) {
      assert.equal(advanceTutorial(from, event), from, `${from} ignores ${event}`);
    }
  }
});

test("interaction only completes the LAST step (an early E does nothing)", () => {
  for (const step of ["intro", "book", "map", "move"]) {
    assert.equal(advanceTutorial(step, "interaction-started"), step);
  }
  assert.equal(advanceTutorial("interact", "interaction-started"), "done");
});

test("events fired early are not remembered (movement before its step is lost)", () => {
  let step = advanceTutorial("book", "player-moved");
  assert.equal(step, "book");
  step = advanceTutorial(advanceTutorial(step, "book-opened"), "map-opened");
  assert.equal(step, "move"); // still has to move for real
});

test("done is final", () => {
  for (const event of ALL_EVENTS) assert.equal(advanceTutorial("done", event), "done");
});

test("every hint step has ES and EN copy with its key", () => {
  const keys = { book: "Q", map: "TAB", move: "WASD", interact: "E" };
  for (const lang of ["es", "en"]) {
    for (const [step, key] of Object.entries(keys)) {
      const copy = tutorialCopy[lang][step];
      assert.ok(copy.body.trim());
      assert.ok(copy.title.some((p) => typeof p === "object" && p.key === key), `${lang}/${step}`);
    }
  }
  assert.ok(inventoryCopy.es.title && inventoryCopy.en.title);
});

test("inventory: capacity is 6 and the initial state is empty", () => {
  assert.equal(inv.INVENTORY_CAPACITY, 6);
  const state = inv.createEmptyInventory();
  assert.equal(state.capacity, 6);
  assert.equal(state.slots.length, 6);
  assert.ok(state.slots.every((slot) => slot === null));
  assert.equal(inv.countOccupiedSlots(state), 0);
  assert.ok(inv.isValidInventory(state));
});

test("inventory model supports quantities and rejects impossible states", () => {
  const state = inv.createEmptyInventory();
  state.slots[0] = { itemId: "example", quantity: 3 };
  assert.ok(inv.isValidInventory(state));
  assert.equal(inv.countOccupiedSlots(state), 1);
  // more slots than capacity
  assert.ok(!inv.isValidInventory({ capacity: 6, slots: [...state.slots, { itemId: "x", quantity: 1 }] }));
  // empty or fractional quantities
  assert.ok(!inv.isValidInventory({ ...state, slots: state.slots.map((s, i) => (i === 1 ? { itemId: "x", quantity: 0 } : s)) }));
  assert.ok(!inv.isValidInventory({ ...state, slots: state.slots.map((s, i) => (i === 1 ? { itemId: "x", quantity: 1.5 } : s)) }));
});

test("each inventory is independent (no shared slots array)", () => {
  const a = inv.createEmptyInventory();
  const b = inv.createEmptyInventory();
  a.slots[0] = { itemId: "x", quantity: 1 };
  assert.equal(b.slots[0], null);
});

console.log(`\n${passed} tests passed`);
