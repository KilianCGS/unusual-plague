// Day 3 (2026-11-12): three patients (chest cough, scurvy, fracture), their dialogues, the
// closing rule, the chapter chain and whether every treatment can be made from what the
// world gives.
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

const inv = at("src/game/inventory/inventory.ts");
const p3 = at("src/game/patients/chapter3Patients.ts");
const dialogues = at("src/game/dialogue/chapter3PatientDialogues.ts");
const day3 = at("src/game/patients/day3.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { AILMENTS } = at("src/game/book/ailments.ts");
const { getDiagnosisOptions, DIAGNOSIS_SYMPTOMS, checkDiagnosis } = at("src/game/patients/diagnosis.ts");
const { getPatientDefinitions } = at("src/game/patients/patientRegistry.ts");
const { getObjectives } = at("src/game/objectives/objectives.ts");
const { getPatientPayment } = at("src/game/money/payments.ts");
const { getNextChapterId, getChapterStart } = at("src/game/world/chapterStart.ts");
const { day3Closing } = at("src/game/dialogue/chapter3ClosingDialogues.ts");
const story = at("src/game/dialogue/storyInteractions.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const stock = (pairs) =>
  pairs.reduce((s, [id, q]) => inv.addItem(s, id, q), inv.createEmptyInventory());
const facts = (patients, pairs = [], claimed = []) => ({
  patients,
  inventory: stock(pairs),
  claimedRewards: new Set(claimed),
});
const IDS = Object.keys(p3.CHAPTER3_PATIENTS);

test("three patients with a known ailment each, a registry entry, symptoms, objective and payment", () => {
  assert.equal(IDS.length, 3);
  const definitions = getPatientDefinitions();
  for (const id of IDS) {
    const definition = p3.CHAPTER3_PATIENTS[id];
    assert.ok(AILMENTS.some((a) => a.id === definition.ailmentId), id);
    assert.ok(definitions[id], `${id} is in the registry`);
    for (const language of ["es", "en"]) {
      assert.ok(DIAGNOSIS_SYMPTOMS[id][language].length > 20, `${id} symptoms ${language}`);
      assert.ok(definition.name[language].length > 0);
    }
    assert.ok(getPatientPayment(id) > 0, `${id} pays`);
    assert.equal(getObjectives({ [id]: "discovered" }, "es").length, 1, `${id} is an errand once known`);
    // the right answer of the diagnosis is the case's ailment
    assert.equal(checkDiagnosis(id, definition.ailmentId), "correct");
    assert.equal(checkDiagnosis(id, "poisoning"), "retry");
  }
  assert.deepEqual(
    IDS.map((id) => p3.CHAPTER3_PATIENTS[id].ailmentId).sort(),
    ["chest-cough", "fracture", "scurvy"],
  );
});

test("the diagnosis offers every ailment of the Compendium (ten), in both languages", () => {
  assert.equal(AILMENTS.length, 10);
  for (const language of ["es", "en"]) assert.equal(getDiagnosisOptions(language).length, 10);
});

test("every treatment is a recipe output and each recipe is revealed by the case that needs it", () => {
  for (const id of IDS) {
    const definition = p3.CHAPTER3_PATIENTS[id];
    for (const treatment of definition.requiredTreatments) {
      const recipe = RECIPES.find((r) => r.output.itemId === treatment.itemId);
      assert.ok(recipe, `${treatment.itemId} has a recipe`);
      assert.ok(definition.revealsRecipeIds.includes(recipe.id), `${id} reveals ${recipe.id}`);
    }
  }
});

test("each treatment can be made from what the world gives (shop, collectibles, trades, water)", () => {
  const { MERCHANT_SHOP } = at("src/game/shop/shops.ts");
  const { NPC_TRADES } = at("src/game/dialogue/npcTrades.ts");
  const { DECOR_ASSETS } = at("src/game/decor/decorAssets.ts");
  const { getComposition } = at("src/game/compositions/index.ts");
  const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
  const raw = new Set(["water"]);
  for (const entry of MERCHANT_SHOP.entries) raw.add(entry.itemId);
  for (const trade of Object.values(NPC_TRADES)) for (const g of trade.grants) raw.add(g.itemId);
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3"]) {
    for (const sceneId of Object.keys(WORLD_SCENES)) {
      for (const instance of getComposition(sceneId, chapter)?.instances ?? []) {
        const item = DECOR_ASSETS.find((a) => a.id === instance.assetId)?.collectibleItemId;
        if (item) raw.add(item);
      }
    }
  }
  // gifts and supplies that are not trades (the baker salt, the woodcutter fat, the Witch bone, the baker flour sack, which gives what a case needs)
  for (const gift of ["salt", "animal-fat", "leech", "bone", "flour"]) raw.add(gift);
  const canMake = (itemId, seen = new Set()) => {
    if (raw.has(itemId)) return true;
    if (seen.has(itemId)) return false;
    const recipe = RECIPES.find((r) => r.output.itemId === itemId);
    return !!recipe && recipe.inputs.every((i) => canMake(i.itemId, new Set([...seen, itemId])));
  };
  for (const id of IDS) {
    for (const treatment of p3.CHAPTER3_PATIENTS[id].requiredTreatments) {
      assert.ok(canMake(treatment.itemId), `${id}: ${treatment.itemId} cannot be made (raw: ${[...raw].sort().join(", ")})`);
    }
  }
});

test("each person: examined in place, then treated when the preparations are carried, then small talk", () => {
  const people = Object.entries(dialogues.CHAPTER3_PATIENT_INTERACTIONS);
  assert.equal(people.length, 3);
  for (const [interactionId, id] of people) {
    const definition = p3.CHAPTER3_PATIENTS[id];
    const exam = story.resolveStoryInteraction(interactionId, facts({}), "es", "x");
    assert.equal(exam.after, "examine-in-place");
    assert.equal(exam.patientId, id);
    assert.ok(exam.conversation.lines.length >= 5);
    // examined but without the preparations: waits, takes nothing
    const waiting = story.resolveStoryInteraction(interactionId, facts({ [id]: "examined" }), "es", "x");
    assert.deepEqual(waiting.effects, []);
    assert.match(waiting.conversation.id, /waiting$/);
    // with them: treated
    const pairs = definition.requiredTreatments.map((t) => [t.itemId, t.quantity]);
    const cure = story.resolveStoryInteraction(interactionId, facts({ [id]: "examined" }, pairs), "en", "x");
    assert.deepEqual(cure.effects, [{ type: "treat", patientId: id }]);
    assert.match(cure.conversation.id, /cure$/);
    const after = story.resolveStoryInteraction(interactionId, facts({ [id]: "treated" }), "es", "x");
    assert.match(after.conversation.id, /after$/);
  }
});

test("Day 3 closes by itself when the last case is treated, once", () => {
  const none = {};
  const some = { [IDS[0]]: "treated", [IDS[1]]: "treated", [IDS[2]]: "examined" };
  const all = Object.fromEntries(IDS.map((id) => [id, "treated"]));
  assert.equal(day3.shouldCloseDay3(none, new Set()), false);
  assert.equal(day3.shouldCloseDay3(some, new Set()), false);
  assert.equal(day3.shouldCloseDay3(all, new Set()), true);
  assert.equal(day3.shouldCloseDay3(all, new Set([day3.DAY3_COMPLETED_ID])), false);
});

test("the chapter chain goes 1 -> 2 -> 3 -> 4, every one starting in the Doctor's Room", () => {
  assert.equal(getNextChapterId("chapter-1"), "chapter-2");
  assert.equal(getNextChapterId("chapter-2"), "chapter-3");
  assert.equal(getNextChapterId("chapter-3"), "chapter-4");
  assert.equal(getNextChapterId("chapter-4"), null);
  for (const chapter of ["chapter-3", "chapter-4"]) assert.equal(getChapterStart(chapter).sceneId, "doctor-room");
});

test("the Day 3 closing is a short bilingual reflection with the Doctor's thoughts in brackets", () => {
  assert.equal(day3Closing.lines.length, 4);
  for (const line of day3Closing.lines) {
    assert.ok(line.text.es.length > 10 && line.text.en.length > 10);
  }
});

test("Day 3 inherits the population and the interactions of Day 2", () => {
  const { getComposition, getChapterInteractions } = at("src/game/compositions/index.ts");
  const day2 = getComposition("plaza", "chapter-2");
  const day3Composition = getComposition("plaza", "chapter-3");
  assert.ok(day2 && day3Composition);
  assert.equal(day3Composition.chapterId, "chapter-3");
  assert.equal(day3Composition.instances.length >= day2.instances.length, true);
  const i2 = getChapterInteractions("chapter-2");
  const i3 = getChapterInteractions("chapter-3");
  for (const key of Object.keys(i2)) assert.ok(i3[key], `${key} is kept in Day 3`);
});

test("the Witch of the glade: a bone once, then a bad omen for a pine mushroom once, then a farewell", () => {
  const W = "chapter3.glade.witch";
  const w = at("src/game/dialogue/chapter3WitchDialogues.ts");
  const talk = (pairs, claimed = []) => story.resolveStoryInteraction(W, facts({}, pairs, claimed), "es", "w");
  // first visit: the bone
  const first = talk([]);
  assert.equal(first.conversation.id, "chapter3.glade.witch.bone");
  assert.deepEqual(first.effects, [
    { type: "give-item", itemId: "bone", quantity: 1 },
    { type: "claim-reward", rewardId: w.WITCH_BONE_REWARD_ID },
  ]);
  // a full bag: told, nothing given and nothing recorded
  const full = talk([["cloth", 1], ["salt", 1], ["water", 1], ["orange", 1], ["coal", 1], ["honey", 1]]);
  assert.equal(full.conversation.id, "chapter3.glade.witch.boneNoRoom");
  assert.deepEqual(full.effects, []);
  // after the bone, without the mushroom: the price is named
  const noMushroom = talk([], [w.WITCH_BONE_REWARD_ID]);
  assert.equal(noMushroom.conversation.id, "chapter3.glade.witch.noMushroom");
  assert.deepEqual(noMushroom.effects, []);
  // with the mushroom: the omen, the mushroom is paid, once
  const omen = talk([["pine-mushroom", 1]], [w.WITCH_BONE_REWARD_ID]);
  assert.equal(omen.conversation.id, "chapter3.glade.witch.omen");
  assert.deepEqual(omen.effects, [
    { type: "take-item", itemId: "pine-mushroom", quantity: 1 },
    { type: "claim-reward", rewardId: w.WITCH_OMEN_REWARD_ID },
  ]);
  const text = omen.conversation.lines.map((l) => l.text);
  assert.ok(text.includes("Ven a verme cuando todo se haya apagado. Y trae la pluma."));
  const done = talk([["pine-mushroom", 1]], [w.WITCH_BONE_REWARD_ID, w.WITCH_OMEN_REWARD_ID]);
  assert.equal(done.conversation.id, "chapter3.glade.witch.farewell");
  assert.deepEqual(done.effects, []);
});

console.log(`\n${passed} tests passed`);
