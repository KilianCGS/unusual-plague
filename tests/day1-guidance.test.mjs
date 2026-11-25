// Day 1 guidance (2026-11-15, Kilian): the bartender calls the Doctor over right after the stomach
// patient's examination and sends him to her sister at the farm; the farm woman smells the orange if
// he already carries it; the cooking wait is 3 s; the Doctor carries 8 things.
//   node tests/day1-guidance.test.mjs
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
const inv = at("src/game/inventory/inventory.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const tavern = at("src/game/dialogue/chapter1TavernDialogues.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const facts = (pairs, claimed = [], status = "examined") => ({
  patients: { [ch1.TAVERN_PATIENT_ID]: status },
  inventory: pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory()),
  claimedRewards: new Set(claimed),
});
const FARM = "chapter1.farm.woman";

test("the bartender calls the Doctor over once, right after the examination, and gives the jar pointing to her sister", () => {
  assert.equal(tavern.bartenderCall.lines.length, 1);
  assert.equal(tavern.bartenderCall.lines[0].text.es, "Doctor, venga aquí.");
  assert.equal(tavern.bartenderCall.lines[0].text.en, "Doctor, come over here.");
  // the call is wired at the end of the examination, once (a claimed flag), spoken by her instance
  const world = read("src/game/world/GameWorld.tsx");
  const end = world.slice(world.indexOf("const finishExamination"), world.indexOf("const beginDiagnosis"));
  assert.ok(end.includes("BARTENDER_CALL_ID") && end.includes("claimFlag(BARTENDER_CALL_ID)"));
  assert.ok(end.includes("bartenderCall") && end.includes("BARTENDER_INSTANCE_ID"));
  // then talking to her gives the jar with the new line
  const out = story.resolveStoryInteraction("chapter1.tavern.bartender", facts([]), "es", "b");
  assert.equal(out.conversation.id, "chapter1.tavern.bartender.jar");
  assert.ok(out.conversation.lines[0].text.includes("hermana"));
  assert.ok(out.effects.some((e) => e.type === "give-item" && e.itemId === "empty-jar"));
});

test("the farm woman: with the orange already in his bag she smells it and offers the deal herself", () => {
  const talk = (pairs) => story.resolveStoryInteraction(FARM, facts(pairs), "es", "f");
  assert.equal(talk([]).conversation.id, "chapter1.farm.woman.intro");
  assert.equal(talk([["empty-jar", 1]]).conversation.id, "chapter1.farm.woman.introWithJar");
  const withOrange = talk([["orange", 1]]);
  assert.equal(withOrange.conversation.id, "chapter1.farm.woman.introWithOrange");
  assert.ok(withOrange.conversation.lines.some((l) => l.text.includes("naranja encima")));
  assert.equal(talk([["orange", 1], ["empty-jar", 1]]).conversation.id, "chapter1.farm.woman.introWithJarWithOrange");
  // once, whatever he carries: it is noted with the intro flag
  assert.deepEqual(withOrange.effects, [{ type: "claim-reward", rewardId: ch1.FARM_WOMAN_INTRO_ID }]);
  // English exists for the new lines
  const en = story.resolveStoryInteraction(FARM, facts([["orange", 1]]), "en", "f");
  assert.ok(en.conversation.lines.some((l) => /orange/.test(l.text)));
});

test("cooking waits 3 seconds, and the Doctor carries 8 things", () => {
  assert.ok(read("src/game/crafting/CraftingOverlay.tsx").includes("{ fire: 3000 }"));
  assert.equal(inv.INVENTORY_CAPACITY, 15);
  assert.equal(inv.createEmptyInventory().slots.length, 15);
});

test("the miner points to the quarry camp after his examination; the camp's coal giver is the stonecutter resting on the ground", () => {
  const p3 = at("src/game/dialogue/chapter1Patient3Dialogues.ts");
  assert.equal(p3.injuredMinerCoalHint.lines.length, 2);
  assert.ok(p3.injuredMinerCoalHint.lines[0].text.es.includes("campamento de la cantera"));
  assert.ok(p3.injuredMinerCoalHint.lines[0].text.en.includes("quarry camp"));
  const world = read("src/game/world/GameWorld.tsx");
  const end = world.slice(world.indexOf("const finishExamination"), world.indexOf("const beginDiagnosis"));
  assert.ok(end.includes("INJURED_MINER_COAL_CALL_ID") && end.includes("injuredMinerCoalHint"));
  // the coal giver keeps his id but is drawn as the resting stonecutter
  const comp = read("src/game/new-world-map/newWorldCompositions.ts");
  const at1 = comp.indexOf('instanceId: "quarry-stonecutter-resting-01"');
  assert.ok(comp.slice(at1, at1 + 400).includes('assetId: "stonecutter-resting"'));
  for (let i = 0; i < 5; i++) assert.ok(fs.existsSync(path.join(root, `public/game/npcs/stonecutter-resting/idle/${i}.png`)));
});

test("the apothecary street and the farm have the new backgrounds with the world kept the same size, and the map links them", () => {
  const png = (rel) => { const b = fs.readFileSync(path.join(root, "public", rel)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
  assert.deepEqual(png("game/new-world-map/apothecary-street-background.png"), [1120, 1404]);
  assert.deepEqual(png("game/new-world-map/farm-background.png"), [1624, 969]);
  const visuals = read("src/game/new-world-map/newWorldVisuals.ts");
  assert.ok(visuals.includes("assetWidth: 1624") && visuals.includes("logicalUnitsPerAssetPixel: 1.1703"));
  const { MAP_LINKS } = at("src/game/map/mapLocations.ts");
  // the road to the farm goes THROUGH the market street (Codex put it on the map, 2026-11-16)
  assert.ok(MAP_LINKS.some(([a, b]) => a === "pharmacy" && b === "market"));
  assert.ok(MAP_LINKS.some(([a, b]) => a === "market" && b === "farm"));
});

test("the day closes at the bed: a centred glowing sign sends him to his room, 'Sleep' floats over the bed, no modal; the ointment grinds the herb too", () => {
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(world.includes("setSleepRequested(true)") && world.includes("worldLabels") && world.includes("bedZoneExists"));
  assert.ok(!world.includes("RestPrompt") && !fs.existsSync(path.join(root, "src/game/ui/RestPrompt.tsx")));
  const css = read("src/game/ui/DayEndSign.module.css");
  assert.ok(css.includes("left: 50%") && css.includes("sign-aura"));
  const { dayEndCopy } = at("src/game/i18n/dayEnd.ts");
  assert.equal(dayEndCopy.es.sign, "Ve a tu habitación");
  assert.equal(dayEndCopy.en.sign, "Go to your room");
  const { RECIPES } = at("src/game/crafting/recipes.ts");
  assert.deepEqual(RECIPES.find((r) => r.id === "manual.medicinal-ointment").inputs.map((i) => i.itemId), ["crushed-herb", "crushed-coal"]);
});

console.log(`\n${passed} tests passed`);
