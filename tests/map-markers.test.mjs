// The map (2026-11-26): opened with its key, the new engravings, and the yellow / blue symbols of what waits in each place.
//   node tests/map-markers.test.mjs
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
    if (id.includes("useProtagonistController")) return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const markersMod = at("src/game/map/mapMarkers.ts");
const { MAP_LOCATIONS } = at("src/game/map/mapLocations.ts");
const { NPC_TRADES, errandAskedFlag } = at("src/game/dialogue/npcTrades.ts");
const { PATIENT_OBJECTIVES } = at("src/game/objectives/objectives.ts");

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

test("a patient the Doctor knows and has not treated gets a yellow symbol over their place; hidden and treated ones none", () => {
  const m = markersMod.getMapMarkers({ "chapter2-blacksmith": "discovered", "chapter2-woodcutter": "examined", "chapter2-farmer": "treated" }, new Set(), "chapter-2");
  assert.deepEqual(m.smithy, { patients: 1, errands: 0 });
  assert.deepEqual(m.forest, { patients: 1, errands: 0 });
  assert.equal(m.mill, undefined, "treated: no symbol");
  assert.equal(markersMod.getMapMarkers({}, new Set(), "chapter-3").quarry, undefined, "a case not met yet is never marked (Day 3 gives only a rumour)");
});

test("two patients in one place give two symbols", () => {
  const m = markersMod.getMapMarkers({ "chapter3-path-miner": "discovered", "chapter3-stonecutter": "discovered" }, new Set(), "chapter-3");
  assert.equal(m.quarry.patients, 2);
});

test("an errand somebody asked for and not delivered gets a blue symbol; delivered or not asked, none", () => {
  const trade = Object.values(NPC_TRADES).find((t) => t.interactionId === "chapter2.tavernStreet.sitting");
  const asked = new Set([errandAskedFlag(trade)]);
  assert.deepEqual(markersMod.getMapMarkers({}, asked, "chapter-2").tavern, { patients: 0, errands: 1 });
  assert.equal(markersMod.getMapMarkers({}, new Set([errandAskedFlag(trade), trade.rewardId]), "chapter-2").tavern, undefined);
  assert.equal(markersMod.getMapMarkers({}, new Set(), "chapter-2").tavern, undefined);
  // the same chapter filter as the errands panel applies (a trade limited to some days is marked only on those)
});

test("every patient and every errand of the errands panel has a place on the map", () => {
  const ids = new Set(MAP_LOCATIONS.map((p) => p.id));
  for (const patientId of Object.keys(PATIENT_OBJECTIVES)) assert.ok(ids.has(markersMod.PATIENT_MAP_LOCATION[patientId]), patientId);
  for (const trade of Object.values(NPC_TRADES)) if (trade.objective) assert.ok(ids.has(markersMod.ERRAND_MAP_LOCATION[trade.interactionId]), trade.interactionId);
});

test("the map uses the new engravings, one per place, 512 x 512 with alpha", () => {
  for (const place of MAP_LOCATIONS) {
    const file = path.join(root, `public/game/ui/map/${place.id}NewMap.png`);
    assert.ok(fs.existsSync(file), place.id);
    const png = fs.readFileSync(file);
    assert.equal(png.readUInt32BE(16), 512);
    assert.equal(png.readUInt32BE(20), 512);
    assert.equal(png[25], 6, `${place.id} has an alpha channel`);
  }
  const overlay = read("src/game/map/MapOverlay.tsx");
  assert.ok(overlay.includes("NewMap.png") && overlay.includes("ICON_BOX") && overlay.includes("data-map-symbol") && overlay.includes("data-map-legend"));
});

test("the map is toggled by its key from the bindings (M by default), Esc closes it", () => {
  const hook = read("src/game/map/useMapToggle.ts");
  assert.ok(hook.includes('matchesAction(getBindings(), "map"') && hook.includes('"Escape"'));
  assert.ok(!/["']m["']|["']M["']/.test(hook.replace(/\/\/.*$/gm, "")), "no fixed letter in the handler");
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("useMapToggle(") && !game.includes("useMapHold"));
});

console.log(`\n${passed} tests passed`);
