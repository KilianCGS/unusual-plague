// "I don't need that right now": the crafting interface only makes preparations
// the known cases still need; locked doors; "?" over pick-ups; Day 2 placements.
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

const { getCraftingTargets } = at("src/game/crafting/needs.ts");
const { addItem, createEmptyInventory } = at("src/game/inventory/inventory.ts");
const { craftingCopy } = at("src/game/i18n/crafting.ts");
const { getLockedDoorNotice, LOCKED_DOORS } = at("src/game/world/lockedDoors.ts");
const { chapter2Compositions } = at("src/game/compositions/chapter-2.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { newWorldChapter1Compositions } = at("src/game/new-world-map/newWorldCompositions.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};
const stock = (pairs) => pairs.reduce((s, [id, q]) => addItem(s, id, q), createEmptyInventory());

test("with no examined case nothing is craftable", () => {
  assert.equal(getCraftingTargets([], createEmptyInventory()).size, 0);
});

test("the blacksmith's cures and their intermediates are targets, other recipes are not", () => {
  const needs = [{ itemId: "poultice", quantity: 1 }, { itemId: "medicinal-compress", quantity: 1 }];
  const targets = getCraftingTargets(needs, createEmptyInventory());
  for (const id of ["poultice", "medicinal-paste", "medicinal-compress", "ointment-base"])
    assert.ok(targets.has(id), id);
  for (const id of ["citrus-drink", "cold-cloth", "mint-infusion", "charcoal-suspension"])
    assert.ok(!targets.has(id), `${id} is not needed`);
});

test("a preparation already carried is no longer a target; its ingredients stop being craftable too", () => {
  const needs = [{ itemId: "poultice", quantity: 1 }];
  const carrying = getCraftingTargets(needs, stock([["poultice", 1]]));
  assert.equal(carrying.size, 0, "extra poultices are refused");
  const withPaste = getCraftingTargets(needs, stock([["medicinal-paste", 1]]));
  assert.ok(withPaste.has("poultice"));
  assert.ok(!withPaste.has("medicinal-paste"), "the paste is already made");
});

test("the guard is wired: overlay refuses, copy exists in both languages, /dev/crafting stays free", () => {
  assert.equal(craftingCopy.es.notNeeded, "(Eso no lo necesito ahora.)");
  assert.equal(craftingCopy.en.notNeeded, "(I don't need that right now.)");
  const overlay = read("src/game/crafting/CraftingOverlay.tsx");
  assert.ok(/craftableOutputs\s*&&\s*!craftableOutputs\.has\(result\.recipe\.output\.itemId\)/.test(overlay));
  assert.ok(overlay.indexOf('setMessage("not-needed")') < overlay.indexOf("onInventoryChange(result.inventory)"),
    "the refusal comes before anything is consumed");
  assert.ok(read("src/game/world/GameWorld.tsx").includes("craftableOutputs={craftableOutputs}"));
  assert.ok(!read("src/app/dev/crafting/page.tsx").includes("craftableOutputs"));
});

test("the Witch's house is shut in every chapter, with an ES/EN notice, and only that door", () => {
  assert.equal(LOCKED_DOORS.length, 1);
  for (const chapter of ["chapter-1", "chapter-2"]) {
    assert.equal(getLockedDoorNotice("forest-cottage", "forest-cottage-interior", chapter, "es"), "No debería colarme aquí sin permiso.");
    assert.equal(getLockedDoorNotice("forest-cottage", "forest-cottage-interior", chapter, "en"), "I shouldn't sneak in here without permission.");
  }
  assert.equal(getLockedDoorNotice("forest-cottage", "forest", "chapter-2", "es"), null);
  assert.equal(getLockedDoorNotice("forest-cottage-interior", "forest-cottage", "chapter-2", "es"), null);
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.indexOf("getLockedDoorNotice(") < game.indexOf("startTransition(\n          exit.targetScene"));
});

test("every world pick-up shows a \"?\" and news characters keep the \"!\"", () => {
  const scene = read("src/game/world/ExteriorScene.tsx");
  assert.ok(scene.includes("asset.collectibleItemId"));
  assert.ok(scene.includes('kind="item"'));
  assert.ok(read("src/game/ui/AttentionMark.tsx").includes('kind === "item" ? "?" : "!"'));
});

test("Kilian's Day 2 placements: mint at the cottage, herb in the forest (own id), beekeeper at the mill", () => {
  const find = (sceneId) => chapter2Compositions.find((c) => c.sceneId === sceneId).instances;
  const mint = find("forest-cottage").find((i) => i.instanceId === "forest-cottage-mint-world-01");
  assert.deepEqual([mint.assetId, mint.x, mint.y, mint.scale], ["mint-world", 995, 644, 0.75]);
  assert.equal(getDecorAsset("mint-world").collectibleItemId, "mint");
  const herb = find("forest").find((i) => i.instanceId === "forest-medicinal-herb-dev-02");
  assert.deepEqual([herb.assetId, herb.x, herb.y, herb.scale], ["medicinal-herb-pile", 544, 364, 0.94]);
  assert.equal(getDecorAsset("medicinal-herb-pile").collectibleItemId, "medicinal-herb");
  assert.equal(getDecorAsset("medicinal-herb-pile").collectibleQuantity, 2, "one pile = the two herbs Day 2 needs");
  assert.equal(getDecorAsset("medicinal-herb-dev").collectibleQuantity, undefined, "Day 1 herb still gives one");
  const plazaTable = newWorldChapter1Compositions.find((c) => c.sceneId === "plaza").instances.find((i) => i.instanceId === "plaza-merchant-table-01");
  assert.deepEqual([plazaTable.assetId, plazaTable.x, plazaTable.y, plazaTable.scale, plazaTable.flipX], ["merchant-table-draper", 1133, 421, 1.08, true]);
  assert.deepEqual(getDecorAsset("merchant-table-draper").defaultCollider, getDecorAsset("merchant-table").defaultCollider);
  const day1Ids = new Set(newWorldChapter1Compositions.flatMap((c) => c.instances.map((i) => i.instanceId)));
  assert.ok(!day1Ids.has(herb.instanceId), "a Day 2 pick-up never reuses a Day 1 id");
  const bee = find("mill-farmland").find((i) => i.instanceId === "mill-farmland-beekeeper-01");
  assert.deepEqual([bee.assetId, bee.x, bee.y, bee.colliderEnabled], ["beekeeper", 2008, 876, true]);
});

test("Day 1 plaza: the humble merchant replaces the luxurious one and keeps his conversation", () => {
  const plaza = newWorldChapter1Compositions.find((c) => c.sceneId === "plaza").instances;
  const merchant = plaza.find((i) => i.assetId === "merchant-humble");
  assert.deepEqual([merchant.instanceId, merchant.x, merchant.y, merchant.flipX, merchant.colliderEnabled],
    ["plaza-merchant-humble-01", 1187, 417, true, false]);
  assert.ok(!plaza.some((i) => i.assetId === "merchant"));
  const { chapter1Interactions } = at("src/game/compositions/chapter-1.interactions.ts");
  assert.equal(chapter1Interactions["plaza-merchant-humble-01"].interactionId, "chapter1.plaza.merchant");
  assert.equal(chapter1Interactions["plaza-merchant-01"], undefined);
});

console.log(`\n${passed} tests passed`);
