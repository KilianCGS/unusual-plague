// Saved game (2026-11-18): the text round trip, validation, and what a loaded game starts with.
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
const at = (rel) => load(path.join(root, rel));
const save = at("src/game/save/saveGame.ts");
const inv = at("src/game/inventory/inventory.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const state = {
  chapterId: "chapter-3",
  patients: { "baker-husband": "treated", "chapter2-woodcutter": "treated" },
  claimedRewards: new Set(["chapter1.day1.completed", "chapter2.errand.elderSyrup"]),
  knownRecipeIds: new Set(["fire.mint-infusion"]),
  inventory: inv.addItem(inv.createEmptyInventory(), "cloth", 2),
  storage: inv.createEmptyInventory(),
  collected: new Set(["forest-medicinal-herb-01"]),
  coins: 17,
};

test("a save survives the text round trip (accents and all) and starts the game on the right day", () => {
  const original = save.createSave(state);
  const text = save.saveToText(original);
  assert.ok(text.startsWith("UP1:"));
  const back = save.saveFromText(`  ${text}\n`);
  assert.deepEqual(back, original);
  const start = save.toDevStart(back);
  assert.equal(start.chapterId, "chapter-3");
  assert.equal(start.coins, 17);
  assert.equal(start.tutorialStep, "done");
  assert.equal(start.scene, undefined, "he wakes in the Doctor's room (the chapter's start)");
  assert.deepEqual([...start.claimedRewards].sort(), [...state.claimedRewards].sort());
  assert.equal(inv.countItem(start.inventory, "cloth"), 2);
  assert.ok(start.collected.has("forest-medicinal-herb-01"));
});

test("broken, foreign or tampered texts are refused", () => {
  const good = save.createSave(state);
  const text = save.saveToText(good);
  for (const bad of ["", "hello", "UP1:", "UP1:!!!", text.slice(0, -6), "UP2:" + text.slice(4)]) assert.equal(save.saveFromText(bad), null, bad);
  const enc = (o) => "UP1:" + Buffer.from(JSON.stringify(o)).toString("base64");
  assert.equal(save.saveFromText(enc({ ...good, chapterId: "chapter-1" })), null, "Day 1 is never saved");
  assert.equal(save.saveFromText(enc({ ...good, coins: -4 })), null);
  assert.equal(save.saveFromText(enc({ ...good, version: 9 })), null);
  assert.equal(save.saveFromText(enc({ ...good, inventory: { capacity: 3, slots: [null] } })), null);
  assert.equal(save.saveFromText(enc({ ...good, claimedRewards: [1] })), null);
});

test("the game autosaves when a day begins, only when asked to, and the title can continue", () => {
  const game = fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8");
  assert.ok(game.includes("if (!autosave) return;") && game.includes("writeSave("));
  const page = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
  assert.ok(page.includes("autosave") && page.includes("resume={loadedStart}") && page.includes("readSave()"));
  for (const dev of ["day2", "day3", "day4"]) {
    assert.ok(!fs.readFileSync(path.join(root, `src/app/dev/${dev}/page.tsx`), "utf8").includes("autosave"), `${dev} dev page never overwrites the save`);
  }
});

console.log(`\n${passed} tests passed`);
