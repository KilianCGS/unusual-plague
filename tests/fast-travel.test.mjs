// Fast travel to the apothecary: when it is on offer, where it lands, what it
// says, and that it only moves the Doctor.
//   node tests/fast-travel.test.mjs
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

const {
  canFastTravel,
  FAST_TRAVEL_DESTINATION,
  FAST_TRAVEL_HOME_SCENES,
  FAST_TRAVEL_CAPTION_MS,
} = at("src/game/world/fastTravel.ts");
const { fastTravelCopy } = at("src/game/i18n/fastTravel.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { rectsIntersect } = at("src/game/collision.ts");
const { isInventoryHudVisible } = at(
  "src/game/inventory/inventoryHudVisibility.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// Plain exploration in the Plaza.
const playing = {
  sceneId: "plaza",
  phase: "playing",
  openingActive: false,
  tutorialStep: "done",
  dialogueActive: false,
  bookOpen: false,
  mapVisible: false,
  storageOpen: false,
  craftingOpen: false,
  inNarrativeScene: false,
};
const with_ = (patch) => ({ ...playing, ...patch });

test("it is on offer during plain exploration outside the Botica, from anywhere", () => {
  assert.equal(canFastTravel(playing), true);
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    if (FAST_TRAVEL_HOME_SCENES.includes(sceneId)) continue;
    if (sceneId === "bakers-bedroom") continue; // narrative scene
    assert.equal(canFastTravel(with_({ sceneId })), true, sceneId);
  }
  // far routes in particular
  for (const sceneId of [
    "forest",
    "mine-interior",
    "mine-natural-cave",
    "mill-farmland",
  ]) {
    assert.equal(canFastTravel(with_({ sceneId })), true, sceneId);
  }
  // any tutorial step that is not the opening still allows exploration
  for (const tutorialStep of [
    "book",
    "map",
    "move",
    "chest-approach",
    "take-flask",
    "done",
  ]) {
    assert.equal(canFastTravel(with_({ tutorialStep })), true, tutorialStep);
  }
});

test("it is not on offer at home: the Botica and the Doctor's Room", () => {
  assert.deepEqual([...FAST_TRAVEL_HOME_SCENES].sort(), [
    "apothecary-interior",
    "doctor-room",
  ]);
  for (const sceneId of FAST_TRAVEL_HOME_SCENES) {
    assert.equal(canFastTravel(with_({ sceneId })), false, sceneId);
  }
});

test("it is blocked by a dialogue, the Book, the Map, the Storage and Crafting", () => {
  assert.equal(canFastTravel(with_({ dialogueActive: true })), false);
  assert.equal(canFastTravel(with_({ bookOpen: true })), false);
  assert.equal(canFastTravel(with_({ mapVisible: true })), false);
  assert.equal(canFastTravel(with_({ storageOpen: true })), false);
  assert.equal(canFastTravel(with_({ craftingOpen: true })), false);
});

test("it is blocked during any fade or transition, the opening and a narrative scene", () => {
  for (const phase of ["fading-out", "holding", "fading-in"]) {
    assert.equal(canFastTravel(with_({ phase })), false, phase);
  }
  assert.equal(canFastTravel(with_({ openingActive: true })), false);
  assert.equal(canFastTravel(with_({ tutorialStep: "intro" })), false);
  assert.equal(canFastTravel(with_({ inNarrativeScene: true })), false);
  assert.equal(
    canFastTravel(with_({ sceneId: "bakers-bedroom", inNarrativeScene: true })),
    false,
  );
});

test("a started trip takes the offer away by itself: pressing again during the transition cannot start a second one", () => {
  // the moment the trip starts the phase is no longer "playing"
  assert.equal(canFastTravel(playing), true);
  assert.equal(canFastTravel(with_({ phase: "fading-out" })), false);
  // and the transition itself ignores any start while it is not playing
  const game = read("src/game/world/GameWorld.tsx");
  const start = game.slice(
    game.indexOf("const startTransition"),
    game.indexOf("const handleExit"),
  );
  assert.ok(start.includes('phaseRef.current !== "playing"'));
  assert.ok(start.includes("return;"));
  const handler = game.slice(
    game.indexOf("const handleFastTravel"),
    game.indexOf("const handleExit"),
  );
  assert.ok(handler.includes("if (!fastTravelAvailable)"));
});

test("the destination is the Botica, on the arrival of its street door: free floor, facing the room", () => {
  assert.deepEqual(FAST_TRAVEL_DESTINATION, {
    sceneId: "apothecary-interior",
    spawnName: "from-apothecary-street",
  });
  const scene = WORLD_SCENES[FAST_TRAVEL_DESTINATION.sceneId];
  const arrival = scene.arrivals[FAST_TRAVEL_DESTINATION.spawnName];
  assert.ok(arrival, "the arrival exists");
  assert.deepEqual(arrival, { x: 240, y: 238, direction: "south" });
  // it is the very arrival a walk in from the Apothecary Street uses
  const street = WORLD_SCENES["apothecary-street"].exits.find(
    (exit) => exit.targetScene === "apothecary-interior",
  );
  assert.equal(street.targetSpawn, FAST_TRAVEL_DESTINATION.spawnName);
  // the feet stand on free floor
  const feet = { x: arrival.x - 6, y: arrival.y - 19, width: 12, height: 12 };
  for (const collider of scene.colliders) {
    assert.ok(!rectsIntersect(feet, collider), `touches ${collider.id}`);
  }
});

test("ES and EN: the action and the line over the black screen", () => {
  assert.equal(fastTravelCopy.es.label, "Viaje rápido a la botica");
  assert.equal(
    fastTravelCopy.es.caption,
    "Te diriges a la botica precipitadamente...",
  );
  assert.equal(fastTravelCopy.en.label, "Fast travel to the apothecary");
  assert.equal(
    fastTravelCopy.en.caption,
    "You make your way to the apothecary in a hurry...",
  );
  // GameWorld reads them from the language, nothing is written in the component
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("fastTravelCopy[language].label"));
  assert.ok(game.includes("fastTravelCopy[language].caption"));
  const component = read("src/game/ui/FastTravelButton.tsx");
  assert.ok(
    !/Viaje rápido|Fast travel|precipitadamente|in a hurry/.test(component),
  );
});

test("the trip reuses the scene fade: out, the line on black, the swap, in; the existing fade is unchanged", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(
    game.includes("const SCENE_FADE_MS = 450;"),
    "fade duration untouched",
  );
  assert.ok(
    game.includes("startTransition(\n      FAST_TRAVEL_DESTINATION.sceneId"),
  );
  // the line waits on black, then the world is swapped to the arrival
  assert.ok(game.includes('changePhase("holding")'));
  assert.ok(game.includes("FAST_TRAVEL_CAPTION_MS"));
  assert.ok(
    game.includes('phase === "fading-out" || phase === "holding" ? 1 : 0'),
  );
  assert.ok(
    FAST_TRAVEL_CAPTION_MS >= 1200 && FAST_TRAVEL_CAPTION_MS <= 2200,
    "readable, not a cutscene",
  );
  // the inventory bar stays hidden on the black screen of the trip
  assert.equal(
    isInventoryHudVisible({
      phase: "holding",
      openingActive: false,
      inNarrativeScene: false,
      tutorialDone: true,
      bookOpen: false,
      storageOpen: false,
      craftingOpen: false,
      mapVisible: false,
    }),
    false,
  );
});

test("it only moves the Doctor: no patient, reward, recipe, inventory or chapter state is touched", () => {
  const game = read("src/game/world/GameWorld.tsx");
  const from = game.indexOf("const fastTravelAvailable");
  const end = game.indexOf("}, [fastTravelAvailable, language, startTransition]);", from);
  assert.ok(end > from, "the fast-travel callback has an identifiable end");
  const handler = game.slice(from, end);
  for (const forbidden of [
    "setPatients",
    "setClaimedRewards",
    "setKnownRecipeIds",
    "setInventory",
    "setStorage",
    "setCollected",
    "applyStoryEffects",
    "startDialogue",
    "notifyTutorial",
  ]) {
    assert.ok(!handler.includes(forbidden), forbidden);
  }
  // the rule module knows nothing of the story
  const rule = read("src/game/world/fastTravel.ts");
  assert.ok(
    !/patient|reward|quest|chapter|story/i.test(rule.replace(/\/\/.*$/gm, "")),
  );
});

console.log(`\n${passed} tests passed`);
