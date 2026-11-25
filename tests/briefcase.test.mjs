// The Doctor's open case (2026-11-25): 15 places in 3 rows of 5, reordered by moving one place's contents to another.
//   node tests/briefcase.test.mjs
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
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const c of [base + ".ts", path.join(base, "index.ts")]) if (fs.existsSync(c)) return load(c);
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const inv = load(path.join(root, "src/game/inventory/inventory.ts"));
const st = load(path.join(root, "src/game/storage/storage.ts"));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const sample = () => inv.addItem(inv.addItem(inv.createEmptyInventory(), "salt", 3), "cloth", 1);

test("the case has 15 places (3 rows of 5) and the chest 10 (2 rows of 5)", () => {
  assert.equal(inv.INVENTORY_CAPACITY, 15);
  assert.equal(inv.INVENTORY_COLUMNS, 5);
  assert.equal(inv.INVENTORY_CAPACITY / inv.INVENTORY_COLUMNS, 3);
  assert.equal(st.STORAGE_CAPACITY, 10);
});

test("moving a place into an empty one moves it, into an occupied one swaps; nothing is lost", () => {
  const start = sample();
  const moved = inv.moveSlot(start, 0, 7);
  assert.equal(moved.slots[0], null);
  assert.deepEqual(moved.slots[7], { itemId: "salt", quantity: 3 });
  assert.equal(inv.countItem(moved, "salt"), 3);
  const swapped = inv.moveSlot(start, 0, 1);
  assert.deepEqual(swapped.slots[0], { itemId: "cloth", quantity: 1 });
  assert.deepEqual(swapped.slots[1], { itemId: "salt", quantity: 3 });
  assert.equal(inv.countOccupiedSlots(swapped), 2);
});

test("a move that is not a move changes nothing (same place, out of range) and never mutates", () => {
  const start = sample();
  const before = JSON.stringify(start);
  assert.equal(inv.moveSlot(start, 2, 2), start);
  assert.equal(inv.moveSlot(start, -1, 3), start);
  assert.equal(inv.moveSlot(start, 0, 15), start);
  assert.equal(inv.moveSlot(start, 0.5, 3), start);
  inv.moveSlot(start, 0, 4);
  assert.equal(JSON.stringify(start), before);
});

test("the quantities and the crafting count do not depend on the order of the places", () => {
  const shuffled = inv.moveSlot(inv.moveSlot(sample(), 0, 14), 1, 9);
  assert.equal(inv.countItem(shuffled, "salt"), 3);
  assert.equal(inv.countItem(shuffled, "cloth"), 1);
  assert.ok(inv.isValidInventory(shuffled));
});

test("the overlay draws 5 columns x 3 rows over the case picture, with drag and click moves, and closes with Esc", () => {
  const css = read("src/game/inventory/BriefcaseOverlay.module.css");
  assert.ok(css.includes("repeat(5, 1fr)") && css.includes("repeat(3, 1fr)"));
  assert.ok(css.includes("/game/ui/briefcase/briefcase.png"));
  const tsx = read("src/game/inventory/BriefcaseOverlay.tsx");
  assert.ok(tsx.includes("draggable={slot !== null}") && tsx.includes("onDrop") && tsx.includes('event.key === "Escape"'));
  assert.ok(!/moveSlot|addItem|removeItem/.test(tsx.replace(/\/\/.*$/gm, "")), "the overlay owns no inventory rule");
});

console.log(`\n${passed} tests passed`);
