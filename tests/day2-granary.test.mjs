// Granary conversations, examination and investigation.
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

const { resolveStoryInteraction } = at("src/game/dialogue/storyInteractions.ts");
const { FARMER_DAY2_ID, CHAPTER2_PATIENTS } = at("src/game/patients/chapter2Patients.ts");
const { createEmptyInventory, addItem } = at("src/game/inventory/inventory.ts");
const { advancePatient, isTreatable, treatPatient } = at("src/game/patients/patientCases.ts");
const { buildPatientSpreads } = at("src/game/book/dynamicPages.ts");
const { getComposition, getChapterInteractions } = at("src/game/compositions/index.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { collidesWithScene, getHitboxRect, rectsIntersect } = at("src/game/collision.ts");
const { findAvailableInteraction } = at("src/game/interactions/interactionZone.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`ok - ${name}`); };
const fresh = () => ({ patients: {}, inventory: createEmptyInventory(), claimedRewards: new Set() });
const resolve = (id, facts, language = "es") => resolveStoryInteraction(`chapter2.granary.${id}`, facts, language, "SPEAKER");
function apply(facts, outcome) {
  for (const effect of outcome.effects) {
    if (effect.type === "claim-reward") facts.claimedRewards.add(effect.rewardId);
    if (effect.type === "advance-patient") facts.patients = advancePatient(facts.patients, effect.patientId, effect.to);
  }
}

test("the carer introduces the case once, without auto-examining or granting items", () => {
  const facts = fresh(); const first = resolve("carer", facts);
  assert.equal(first.conversation.id, "chapter2.granary.carer.first");
  apply(facts, first);
  assert.equal(facts.patients[FARMER_DAY2_ID], "discovered");
  const next = resolve("carer", facts);
  assert.equal(next.conversation.id, "chapter2.granary.carer.beforeExam");
  assert.deepEqual(next.effects, []);
});

test("the farmer can be examined first; knowledge advances only when dialogue closes", () => {
  for (const status of [undefined, "discovered"]) {
    const facts = fresh(); if (status) facts.patients = { [FARMER_DAY2_ID]: status };
    const outcome = resolve("farmer", facts);
    assert.equal(outcome.after, "examine-in-place");
    assert.equal(outcome.patientId, FARMER_DAY2_ID);
    assert.deepEqual(outcome.effects, []);
    let patients = advancePatient(facts.patients, outcome.patientId, "discovered");
    patients = advancePatient(patients, outcome.patientId, "examined");
    facts.patients = patients;
    assert.equal(resolve("farmer", facts).conversation.id, "chapter2.granary.farmer.waiting");
    apply(facts, resolve("carer", facts));
    assert.equal(resolve("carer", facts).conversation.id, "chapter2.granary.carer.afterExam");
  }
});

test("an existing leech changes repeat conversation without consuming it or fabricating a sample", () => {
  const facts = fresh(); facts.patients = { [FARMER_DAY2_ID]: "examined" };
  facts.inventory = addItem(facts.inventory, "leech", 1);
  assert.ok(facts.inventory);
  const result = resolve("farmer", facts);
  assert.equal(result.conversation.id, "chapter2.granary.farmer.leechKnown");
  assert.deepEqual(result.effects, []);
});

test("an unresolved investigation cannot be treated for free; its Book page records the next step", () => {
  const facts = fresh(); facts.patients = { [FARMER_DAY2_ID]: "examined" };
  const definition = CHAPTER2_PATIENTS[FARMER_DAY2_ID];
  assert.equal(isTreatable(facts.patients, definition, facts.inventory), false);
  assert.equal(treatPatient(facts.patients, definition, facts.inventory), null);
  for (const language of ["es", "en"]) {
    const spreads = buildPatientSpreads({ ...facts, language, knownRecipeIds: new Set() });
    assert.equal(spreads.length, 1);
    const investigation = spreads[0].texts.find(t => t.id.endsWith("-investigation"));
    assert.equal(investigation.content[0], definition.investigation[language]);
    assert.ok(!spreads[0].texts.some(t => t.id.endsWith("-treated")));
    assert.ok(!JSON.stringify(spreads).includes("suspected-poisoning"));
  }
});

test("all conversation branches have ES/EN parity, bound speakers and substantial content", () => {
  const factsList = [fresh(), { ...fresh(), patients: { [FARMER_DAY2_ID]: "examined" } }];
  const first = resolve("carer", factsList[0]); apply(factsList[0], first);
  factsList.push(fresh());
  for (const facts of factsList) for (const id of ["carer", "farmer"]) {
    const es = resolve(id, facts, "es").conversation;
    const en = resolve(id, facts, "en").conversation;
    assert.equal(es.lines.length, en.lines.length);
    assert.ok(es.lines.length >= 3);
    for (const line of [...es.lines, ...en.lines]) {
      assert.ok(["doctor", "SPEAKER"].includes(line.speaker));
      assert.ok(line.text.trim().length > 0);
    }
  }
  assert.equal(resolve("unknown", fresh()), null);
});

test("both conversations are independently reachable from the authored door with real colliders", () => {
  const scene = WORLD_SCENES["granary-interior"];
  const decor = resolveDecorInstances(getComposition(scene.id, "chapter-2").instances, getChapterInteractions("chapter-2"));
  const blockers = [...scene.colliders, ...decor.colliders];
  const feet = { offsetX: -6, offsetY: -19, width: 12, height: 12 };
  const spawn = scene.arrivals["from-mill-farmland"];
  const queue = [[spawn.x, spawn.y]]; const seen = new Set(); const reachable = new Set();
  for (let i = 0; i < queue.length; i++) {
    const [x,y] = queue[i]; const key = `${x},${y}`;
    if (seen.has(key) || x < 6 || y < 19 || x > 445 || y > 445) continue;
    seen.add(key);
    const box = getHitboxRect(x,y,feet);
    if (collidesWithScene(box, blockers) || scene.exits.some(e => rectsIntersect(box,e.zone))) continue;
    const interaction = findAvailableInteraction(decor.zones, box, "north");
    if (interaction) reachable.add(interaction.interactionId);
    for (const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]) queue.push([x+dx,y+dy]);
  }
  assert.ok(reachable.has("chapter2.granary.farmer"), "farmer is reachable without the carer's zone stealing priority");
  assert.ok(reachable.has("chapter2.granary.carer"), "carer is reachable independently");
});

console.log(`\n${passed} tests passed`);

