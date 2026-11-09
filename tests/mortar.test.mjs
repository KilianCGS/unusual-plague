// Copper coins: the purse, what patients pay, the shop and how it is wired.
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
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const { getMissingIngredients } = at("src/game/crafting/needs.ts");
const { RECIPES, STATION_MAX_INPUTS } = at("src/game/crafting/recipes.ts");
const { addItem, createEmptyInventory } = at("src/game/inventory/inventory.ts");
const cr = at("src/game/crafting/crafting.ts");
const { craftingCopy } = at("src/game/i18n/crafting.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};
const stock = (pairs) => pairs.reduce((s, [id, q]) => addItem(s, id, q), createEmptyInventory());
const total = (treatments, inventory) =>
  getMissingIngredients(treatments, inventory).reduce((n, need) => n + need.quantity, 0);

test("the mortar grinds ONE ingredient: coal and herb, nothing else, and it is never consumed", () => {
  assert.equal(STATION_MAX_INPUTS.mortar, 1);
  const grinding = RECIPES.filter((r) => r.station === "mortar");
  assert.deepEqual(grinding.map((r) => [r.inputs[0].itemId, r.output.itemId]), [
    ["coal", "crushed-coal"],
    ["medicinal-herb", "crushed-herb"],
  ]);
  for (const r of grinding) assert.equal(r.inputs.length, 1);
  assert.equal(cr.combine(stock([["mint", 1]]), "mortar", ["mint"]).kind, "no-recipe");
  // no inventory item stands for the mortar
  assert.ok(!RECIPES.some((r) => r.inputs.some((i) => i.itemId === "mortar")));
});

test("the paste is crushed herb + honey and the ointment is herb + crushed coal", () => {
  const byId = (id) => RECIPES.find((r) => r.id === id);
  assert.deepEqual(byId("manual.medicinal-paste").inputs.map((i) => i.itemId), ["crushed-herb", "honey"]);
  assert.deepEqual(byId("manual.medicinal-ointment").inputs.map((i) => i.itemId), ["medicinal-herb", "crushed-coal"]);
});

test("needs see through the mortar: a cure that needs paste asks for herb and honey, never crushed herb", () => {
  const missing = getMissingIngredients([{ itemId: "poultice", quantity: 1 }], createEmptyInventory());
  assert.deepEqual(missing.map((m) => m.itemId).sort(), ["flour", "honey", "medicinal-herb"]);
  const wound = getMissingIngredients([{ itemId: "medicinal-ointment", quantity: 1 }], createEmptyInventory());
  assert.deepEqual(wound.map((m) => m.itemId).sort(), ["coal", "medicinal-herb"]);
});

test("the guard: grinding the herb another cure needs whole leaves the cases shorter, so it is refused", () => {
  // a poultice (herb ground) AND an ointment (herb whole) both want herbs
  const treatments = [
    { itemId: "poultice", quantity: 1 },
    { itemId: "medicinal-ointment", quantity: 1 },
  ];
  const two = stock([["medicinal-herb", 2], ["honey", 1], ["flour", 1], ["coal", 1]]);
  const afterOne = cr.combine(two, "mortar", ["medicinal-herb"]);
  assert.equal(afterOne.kind, "success");
  assert.ok(total(treatments, afterOne.inventory) <= total(treatments, two), "the first grind is fine");
  const afterTwo = cr.combine(afterOne.inventory, "mortar", ["medicinal-herb"]);
  assert.equal(afterTwo.kind, "success");
  assert.ok(
    total(treatments, afterTwo.inventory) > total(treatments, afterOne.inventory),
    "the second grind would leave the ointment without its herb",
  );
});

test("wiring: the mortar button opens the grinding view, the guard and copy exist in both languages", () => {
  const overlay = read("src/game/crafting/CraftingOverlay.tsx");
  assert.ok(overlay.includes("data-crafting-mortar"));
  assert.ok(overlay.includes("onOpenMortar"));
  assert.ok(overlay.includes('setMessage("needed-elsewhere")'));
  assert.ok(overlay.indexOf('setMessage("needed-elsewhere")') < overlay.indexOf("onInventoryChange(result.inventory)"));
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes('setCraftingStation("mortar")'));
  assert.ok(game.includes("activeTreatments={activeTreatments}"));
  for (const lang of ["es", "en"]) {
    assert.ok(craftingCopy[lang].mortar.label.length > 0);
    assert.ok(craftingCopy[lang].neededElsewhere.length > 0);
    assert.ok(craftingCopy[lang].title.mortar.length > 0);
  }
  assert.equal(craftingCopy.es.mortar.label, "Triturar");
  assert.ok(fs.existsSync(path.join(root, "public/game/ui/mortar.png")));
  assert.ok(fs.existsSync(path.join(root, "public/game/items/prepared-icons/crushed-herb.png")));
});

console.log(`\n${passed} tests passed`);
