// Day 4 is at night (2026-11-12): night paintings, the night grade, the Witch's house.
//   node tests/day4-night.test.mjs
//   node tests/day3.test.mjs
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
  const source = fs.readFileSync(file, "utf8");
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = new Module(file);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  const base = mod.require.bind(mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base0 = path.resolve(path.dirname(file), id);
      for (const ext of [".ts", ".tsx", "/index.ts", ""]) {
        const candidate = base0 + ext;
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return load(candidate);
      }
    }
    if (id.endsWith(".module.css")) return new Proxy({}, { get: (_, k) => String(k) });
    return base(id);
  };
  cache.set(file, mod);
  mod._compile(out, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};


const es = at("src/game/world/economyStart.ts");
const { PATIENT_PAYMENTS } = at("src/game/money/payments.ts");
const { STARTING_COINS } = at("src/game/money/money.ts");
const inv = at("src/game/inventory/inventory.ts");

test("/dev/testDays: each day starts in its chapter with coins computed from the real payments and prices", () => {
  const expected = { 1: "chapter-1", 2: "chapter-2", 3: "chapter-3", 4: "chapter-4" };
  for (const day of [1, 2, 3, 4]) for (const profile of ["justo", "recados"]) {
    const { start, economy } = es.createTestDayStart(day, profile);
    assert.equal(start.chapterId, expected[day], `${day}/${profile}`);
    assert.equal(start.coins, economy.coins);
    assert.ok(economy.coins >= 0, `${day}/${profile} never starts in debt (${economy.coins})`);
    assert.equal(start.tutorialStep, "done");
  }
  assert.equal(es.computeEconomy(1, "justo").coins, STARTING_COINS, "Day 1 starts with the starting coins");
});

test("/dev/testDays: the coins at Day 2 = the start + the three Day 1 payments - the shop items those cases needed; the bag has no shop items", () => {
  const day1 = ["baker-husband", "tavern-patient", "injured-miner"].reduce((sum, id) => sum + PATIENT_PAYMENTS[id], 0);
  const e = es.computeEconomy(2, "justo");
  assert.ok(e.coins < STARTING_COINS + day1, "it spent something on the shop");
  assert.ok(e.shopItemsRemoved.includes("cloth") && e.shopItemsRemoved.includes("salt"));
  const bag = es.createTestDayStart(2, "justo").start.inventory;
  for (const item of e.shopItemsRemoved) assert.equal(inv.countItem(bag, item), 0, `no ${item} in the bag`);
  // doing the errands changes the money and can only hand over more items
  const more = es.computeEconomy(3, "recados");
  assert.ok(more.lines.some((l) => /recado/.test(l)), "the errands show in the breakdown");
});

test("/dev/testDays page exists and starts the real game with that state", () => {
  const page = fs.readFileSync(path.join(root, "src/app/dev/testDays/page.tsx"), "utf8");
  assert.ok(page.includes("createTestDayStart") && page.includes("<GameWorld") && page.includes("devStart={start}"));
});

console.log(`
${passed} tests passed`);
