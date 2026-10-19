// Patient Cases V1 (the baker's husband): case states, derived treatment, the
// Book pages, the patient recipes, missing-ingredient hints, the contextual
// merchant, the baker's flow and the "!" indicator. Behaviour, against the
// real source files.
//   node tests/patients.test.mjs
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

const inv = at("src/game/inventory/inventory.ts");
const pc = at("src/game/patients/patientCases.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");
const needs = at("src/game/crafting/needs.ts");
const cr = at("src/game/crafting/crafting.ts");
const { STATION_MAX_INPUTS } = at("src/game/crafting/recipes.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const book = at("src/game/book/bookPages.ts");
const { getItemName, getItem } = at("src/game/items/items.ts");
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { SCENE_TO_MAP_LOCATION } = at("src/game/map/mapLocations.ts");
const { chapter1Interactions } = at(
  "src/game/compositions/chapter-1.interactions.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const HUSBAND = ch1.BAKER_HUSBAND_ID;
const DEF = ch1.CHAPTER1_PATIENTS[HUSBAND];
const stock = (pairs) =>
  pairs.reduce(
    (s, [id, q]) => inv.addItem(s, id, q),
    inv.createEmptyInventory(),
  );
const withStatus = (status) =>
  status === "hidden" ? {} : { [HUSBAND]: status };
const facts = (status, pairs = []) => ({
  patients: withStatus(status),
  inventory: stock(pairs),
});
const BAKER = "chapter1.bakery.baker";
const MERCHANT = "chapter1.plaza.merchant";
const bookContext = (status, pairs = [], language = "es") => ({
  language,
  patients: withStatus(status),
  inventory: stock(pairs),
  knownRecipeIds: new Set(
    status === "examined" || status === "treated" ? DEF.revealsRecipeIds : [],
  ),
});
const patientTexts = (status, pairs, language) =>
  book
    .buildBookSections(bookContext(status, pairs, language))[0]
    .spreads.flatMap((s) => s.texts ?? [])
    .map((t) => t.content.join(""));

// ---------------------------------------------------------------- PATIENT CASE
test("the baker's husband starts DISCOVERED in chapter 1", () => {
  assert.equal(
    pc.getPatientStatus(ch1.CHAPTER1_INITIAL_PATIENTS, HUSBAND),
    "discovered",
  );
  assert.deepEqual(Object.keys(ch1.CHAPTER1_INITIAL_PATIENTS), [HUSBAND]); // no tavern patient, no miner
});

test("HIDDEN cases are not in PACIENTES; DISCOVERED cases are", () => {
  assert.deepEqual(pc.getVisiblePatientIds({}), []);
  assert.deepEqual(pc.getVisiblePatientIds({ [HUSBAND]: "discovered" }), [
    HUSBAND,
  ]);
  assert.ok(
    patientTexts("hidden").some((t) => t.includes("Todavía no hay pacientes")),
  );
  assert.ok(!patientTexts("hidden").some((t) => t.includes("MARIDO")));
  assert.ok(
    patientTexts("discovered").some((t) => t.includes("MARIDO DE LA PANADERA")),
  );
});

test("DISCOVERED shows no diagnosis or treatment; EXAMINED shows them; TREATED is completed", () => {
  const discovered = patientTexts("discovered");
  assert.ok(
    discovered.some((t) => t.includes("La panadera ha solicitado una visita")),
  );
  assert.ok(
    !discovered.some(
      (t) => t.includes("Fiebre común") || t.includes("TRATAMIENTO"),
    ),
  );
  const examined = patientTexts("examined");
  assert.ok(examined.includes("Fiebre común"));
  assert.ok(examined.includes("TRATAMIENTO"));
  assert.ok(examined.some((t) => t.includes("Infusión medicinal")));
  assert.ok(examined.some((t) => t.includes("Paño frío")));
  assert.ok(patientTexts("treated").includes("✓ TRATADO"));
  assert.ok(!examined.includes("✓ TRATADO"));
});

test("valid state moves: hidden > discovered > examined > treated, nothing else", () => {
  let s = {};
  assert.equal(pc.advancePatient(s, HUSBAND, "examined"), s); // cannot skip
  s = pc.advancePatient(s, HUSBAND, "discovered");
  assert.equal(pc.getPatientStatus(s, HUSBAND), "discovered");
  assert.equal(pc.advancePatient(s, HUSBAND, "treated"), s); // cannot skip
  assert.equal(pc.advancePatient(s, HUSBAND, "hidden"), s); // cannot go back
  s = pc.advancePatient(s, HUSBAND, "examined");
  s = pc.advancePatient(s, HUSBAND, "treated");
  assert.equal(pc.getPatientStatus(s, HUSBAND), "treated");
  assert.equal(pc.advancePatient(s, HUSBAND, "examined"), s);
});

// --------------------------------------------------------- DERIVED TREATMENT
test("treatable only when EXAMINED and carrying both preparations (never stored)", () => {
  const can = (status, pairs) =>
    pc.isTreatable(withStatus(status), DEF, stock(pairs));
  assert.equal(can("examined", []), false);
  assert.equal(can("examined", [["medicinal-infusion", 1]]), false);
  assert.equal(can("examined", [["cold-cloth", 1]]), false);
  assert.equal(
    can("examined", [
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    true,
  );
  // the items alone are not enough: the case has to be examined
  assert.equal(
    can("discovered", [
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    false,
  );
  assert.equal(
    can("treated", [
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    false,
  );
  // no "ready to treat" status exists, and the stored state only holds statuses
  assert.deepEqual(
    ["hidden", "discovered", "examined", "treated"].filter((s) =>
      /ready/i.test(s),
    ),
    [],
  );
  assert.ok(
    Object.values(
      pc.advancePatient({ [HUSBAND]: "discovered" }, HUSBAND, "examined"),
    ).every((v) => typeof v === "string"),
  );
});

// --------------------------------------------------------------- PATIENT BOOK
test("the ticks follow the inventory and revert when a preparation disappears", () => {
  const ticks = (pairs) =>
    patientTexts("examined", pairs).filter((t) => /^[☐☑]/.test(t));
  assert.deepEqual(ticks([]), ["☐ Infusión medicinal", "☐ Paño frío"]);
  assert.deepEqual(ticks([["medicinal-infusion", 1]]), [
    "☑ Infusión medicinal",
    "☐ Paño frío",
  ]);
  assert.deepEqual(
    ticks([
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    ["☑ Infusión medicinal", "☑ Paño frío"],
  );
  // the Doctor loses the infusion before delivering: the box is empty again
  const before = stock([
    ["medicinal-infusion", 1],
    ["cold-cloth", 1],
  ]);
  const after = inv.removeItem(before, "medicinal-infusion", 1);
  assert.deepEqual(
    book
      .buildBookSections({ ...bookContext("examined"), inventory: after })[0]
      .spreads[0].texts.map((t) => t.content.join(""))
      .filter((t) => /^[☐☑]/.test(t)),
    ["☐ Infusión medicinal", "☑ Paño frío"],
  );
});

test("a TREATED case shows the final state whatever the inventory holds", () => {
  const t = patientTexts("treated", []);
  assert.deepEqual(
    t.filter((x) => /^[☐☑]/.test(x)),
    ["☑ Infusión medicinal", "☑ Paño frío"],
  );
  assert.ok(t.includes("✓ TRATADO"));
});

test("PACIENTES and PREPARADOS exist in English too", () => {
  const en = patientTexts("examined", [], "en");
  assert.ok(
    en.includes("THE BAKER'S HUSBAND") &&
      en.includes("Common fever") &&
      en.includes("TREATMENT"),
  );
  assert.ok(
    en.includes("☐ Medicinal infusion") && en.includes("☐ Cold compress"),
  );
  assert.ok(patientTexts("treated", [], "en").includes("✓ TREATED"));
});

test("PREPARADOS shows only the revealed recipes, with ingredients and station", () => {
  const texts = (status, lang = "es") =>
    book
      .buildBookSections(bookContext(status, [], lang))[3]
      .spreads.flatMap((s) => s.texts ?? [])
      .map((t) => t.content.join(""));
  assert.ok(
    texts("discovered").some((t) => t.includes("Todavía no hay recetas")),
  );
  const known = texts("examined");
  assert.ok(
    known.includes("INFUSIÓN MEDICINAL") && known.includes("PAÑO FRÍO"),
  );
  assert.ok(
    known.includes("Agua + Hierba medicinal") && known.includes("Agua + Tela"),
  );
  assert.ok(
    known.includes("Estación: Cocina") && known.includes("Estación: Mesa"),
  );
  // not the technical recipes the Doctor has not been shown
  assert.ok(!known.some((t) => t.includes("VENDAJE") || t.includes("SOPA")));
  const en = texts("examined", "en");
  assert.ok(
    en.includes("Station: Stove") && en.includes("Station: Work table"),
  );
});

// --------------------------------------------------------------------- RECIPES
test("Water + Medicinal herb -> Medicinal infusion on the FIRE station, any order", () => {
  const ing = (...ids) => ids.map((itemId) => ({ itemId, quantity: 1 }));
  assert.equal(
    cr.findMatchingRecipe("fire", ing("water", "medicinal-herb")).output.itemId,
    "medicinal-infusion",
  );
  assert.equal(
    cr.findMatchingRecipe("fire", ing("medicinal-herb", "water")).output.itemId,
    "medicinal-infusion",
  );
  assert.equal(
    cr.findMatchingRecipe("manual", ing("water", "medicinal-herb")),
    null,
  ); // wrong station
});

test("Water + Cloth -> Cold compress on the MANUAL station, any order", () => {
  const ing = (...ids) => ids.map((itemId) => ({ itemId, quantity: 1 }));
  assert.equal(
    cr.findMatchingRecipe("manual", ing("water", "cloth")).output.itemId,
    "cold-cloth",
  );
  assert.equal(
    cr.findMatchingRecipe("manual", ing("cloth", "water")).output.itemId,
    "cold-cloth",
  );
  assert.equal(cr.findMatchingRecipe("fire", ing("water", "cloth")), null);
});

test("a station's capacity is a MAXIMUM: the stove runs 2-input and 3-input recipes", () => {
  assert.equal(STATION_MAX_INPUTS.fire, 3);
  const state = stock([
    ["water", 1],
    ["medicinal-herb", 1],
    ["salt", 1],
    ["mushroom", 1],
  ]);
  // two selected units are enough to try, and the 2-input recipe works
  let two = cr.selectItem(
    state,
    cr.selectItem(state, cr.createEmptySelection("fire"), "water"),
    "medicinal-herb",
  );
  assert.equal(cr.canAttemptCombine(two), true);
  const infusion = cr.combine(state, "fire", two);
  assert.equal(infusion.kind, "success");
  assert.equal(inv.countItem(infusion.inventory, "medicinal-infusion"), 1);
  // the existing 3-input recipe still works
  assert.equal(
    cr.combine(state, "fire", ["mushroom", "water", "salt"]).recipe.id,
    "fire.mushroom-soup",
  );
  // one unit is not enough to try
  assert.equal(cr.canAttemptCombine(["water", null, null]), false);
});

test("the two patient recipes produce ordinary items", () => {
  for (const id of ["medicinal-infusion", "cold-cloth"]) {
    assert.ok(getItem(id));
    assert.ok(getItemName(id, "es") && getItemName(id, "en"));
  }
  assert.equal(getItemName("cold-cloth", "es"), "Paño frío");
  assert.equal(getItemName("medicinal-infusion", "es"), "Infusión medicinal");
});

// ----------------------------------------------------------- MISSING INGREDIENTS
const missingFor = (pairs) =>
  needs.getMissingIngredients(DEF.requiredTreatments, stock(pairs));
const asObject = (list) =>
  Object.fromEntries(list.map((n) => [n.itemId, n.quantity]));

test("empty inventory: Water x2, Medicinal herb x1 and Cloth x1 are missing", () => {
  assert.deepEqual(asObject(missingFor([])), {
    water: 2,
    "medicinal-herb": 1,
    cloth: 1,
  });
});

test("quantities, not presence: Water x1 still misses one; Water x2 misses none", () => {
  assert.deepEqual(asObject(missingFor([["water", 1]])), {
    water: 1,
    "medicinal-herb": 1,
    cloth: 1,
  });
  assert.deepEqual(asObject(missingFor([["water", 2]])), {
    "medicinal-herb": 1,
    cloth: 1,
  });
  assert.ok(!("water" in asObject(missingFor([["water", 3]]))));
});

test("ingredients already carried generate no hint; a full inventory generates none", () => {
  assert.deepEqual(
    asObject(
      missingFor([
        ["water", 2],
        ["medicinal-herb", 1],
      ]),
    ),
    { cloth: 1 },
  );
  assert.deepEqual(
    missingFor([
      ["water", 2],
      ["medicinal-herb", 1],
      ["cloth", 1],
    ]),
    [],
  );
  // a preparation already made needs no ingredients
  assert.deepEqual(asObject(missingFor([["medicinal-infusion", 1]])), {
    water: 1,
    cloth: 1,
  });
  assert.deepEqual(
    missingFor([
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    [],
  );
});

test("the needs come from treatments > recipes > inputs, not from the case (pure derivation)", () => {
  const custom = [
    {
      id: "t",
      station: "manual",
      inputs: [{ itemId: "salt", quantity: 3 }],
      output: { itemId: "coal", quantity: 1 },
    },
  ];
  assert.deepEqual(
    asObject(
      needs.getMissingIngredients(
        [{ itemId: "coal", quantity: 2 }],
        inv.createEmptyInventory(),
        custom,
      ),
    ),
    { salt: 6 },
  );
  assert.deepEqual(
    needs.getMissingIngredients([], inv.createEmptyInventory()),
    [],
  );
});

test("the Doctor's hints: one natural line per missing ingredient, in ES and EN", () => {
  const lines = (pairs, lang) =>
    (
      story.buildMissingIngredientConversation(missingFor(pairs), lang)
        ?.lines ?? []
    ).map((l) => l.text);
  assert.deepEqual(lines([], "es"), [
    "Debería recoger algo de agua del río.",
    "Hace tiempo que no recojo hierbas medicinales. Encontraré algunas en el bosque.",
    "Necesitaré tela limpia. Quizá el mercader tenga.",
  ]);
  assert.equal(lines([], "en").length, 3);
  assert.deepEqual(lines([["water", 1]], "es").length, 3); // Water x1: still missing
  assert.equal(lines([["water", 2]], "es").length, 2);
  assert.deepEqual(
    lines(
      [
        ["water", 2],
        ["medicinal-herb", 1],
        ["cloth", 1],
      ],
      "es",
    ),
    [],
  );
  assert.equal(story.buildMissingIngredientConversation([], "es"), null);
  assert.ok(
    story
      .buildMissingIngredientConversation(missingFor([]), "es")
      .lines.every((l) => l.speaker === "doctor"),
  );
});

// ---------------------------------------------------------------------- MERCHANT
test("the merchant offers Cloth only for a KNOWN need he can cover", () => {
  // before the Doctor knows the need: the narrative dialogue (no story outcome)
  assert.equal(
    story.resolveStoryInteraction(MERCHANT, facts("discovered"), "es", "m"),
    null,
  );
  assert.equal(
    story.resolveStoryInteraction(MERCHANT, facts("hidden"), "es", "m"),
    null,
  );
  // known need and the Doctor lacks cloth: he gives one
  const offer = story.resolveStoryInteraction(
    MERCHANT,
    facts("examined"),
    "es",
    "m",
  );
  assert.deepEqual(offer.effects, [
    { type: "give-item", itemId: "cloth", quantity: 1 },
  ]);
  assert.equal(offer.conversation.lines[0].speaker, "doctor");
  // with enough cloth he does not hand out more
  assert.equal(
    story.resolveStoryInteraction(
      MERCHANT,
      facts("examined", [["cloth", 1]]),
      "es",
      "m",
    ),
    null,
  );
  // the need is covered by a finished compress too
  assert.equal(
    story.resolveStoryInteraction(
      MERCHANT,
      facts("examined", [["cold-cloth", 1]]),
      "es",
      "m",
    ),
    null,
  );
  // after the treatment there is no need left
  assert.equal(
    story.resolveStoryInteraction(MERCHANT, facts("treated"), "es", "m"),
    null,
  );
});

test("the merchant's pickup is generic (cloth is just what he provides)", () => {
  assert.deepEqual(story.NPC_PROVIDES[MERCHANT], ["cloth"]);
  assert.ok(!(MERCHANT in story.PATIENT_INTERACTION_IDS));
});

// ------------------------------------------------------------------------ WATER
test("water: the river gives one unit per use, only with the flask and while a known need lacks water", () => {
  const FLASK = [["empty-flask", 1]];
  const decide = (status, pairs) =>
    story.getGatherDecision("gather.water", facts(status, pairs));
  const water = (status, pairs) =>
    story.resolveStoryInteraction("gather.water", facts(status, pairs), "es", "river");

  // the zone is the one painted by hand, untouched
  assert.deepEqual(getSceneInteractionZones("outskirts").map(({ interactionId, x, y, width, height }) => ({ interactionId, x, y, width, height })), [
    { interactionId: "gather.water", x: 427, y: 522, width: 35, height: 66 },
  ]);
  assert.equal(story.getGatherDecision("craft.fire", facts("examined", FLASK)), null);

  // no known need (discovered / hidden): nothing to gather
  assert.equal(decide("discovered", FLASK), "not-needed");
  assert.equal(decide("hidden", FLASK), "not-needed");
  assert.deepEqual(water("discovered", FLASK).effects, []);

  // no flask: no water, even with a need
  assert.equal(decide("examined", []), "no-container");
  assert.deepEqual(water("examined", []).effects, []);
  assert.ok(water("examined", []).notice.includes("recipiente"));
  assert.equal(water("examined", []).conversation, null);

  // need Water x2: E #1 and E #2 give water, E #3 does not
  const give = { type: "give-item", itemId: "water", quantity: 1 };
  let state = stock(FLASK);
  for (const expected of [1, 2]) {
    const out = story.resolveStoryInteraction("gather.water", { patients: withStatus("examined"), inventory: state }, "es", "river");
    assert.deepEqual(out.effects, [give]);
    assert.equal(out.conversation, null);
    state = inv.addItem(state, "water", 1);
    assert.equal(inv.countItem(state, "water"), expected);
  }
  const third = story.resolveStoryInteraction("gather.water", { patients: withStatus("examined"), inventory: state }, "es", "river");
  assert.deepEqual(third.effects, []);
  assert.ok(third.notice.includes("suficiente"));
  assert.equal(story.resolveStoryInteraction("gather.water", { patients: withStatus("examined"), inventory: state }, "en", "river").notice, "I already have enough water.");

  // the flask is never consumed and nothing is stored: it is just there
  assert.equal(inv.countItem(state, "empty-flask"), 1);
  assert.equal(story.GATHER_SOURCES["gather.water"].requires, "empty-flask");

  // a future open case that needs more water re-enables the river by itself
  // (nothing was stored about the river)
  ch1.CHAPTER1_PATIENTS["test.second"] = {
    id: "test.second",
    requiredTreatments: [{ itemId: "medicinal-infusion", quantity: 1 }],
  };
  try {
    const both = { [HUSBAND]: "examined", "test.second": "examined" };
    assert.equal(
      story.getGatherDecision("gather.water", { patients: both, inventory: state }),
      "gather", // Water x2 carried, x3 now needed
    );
    assert.equal(
      story.getGatherDecision("gather.water", { patients: { [HUSBAND]: "examined" }, inventory: state }),
      "not-needed",
    );
  } finally {
    delete ch1.CHAPTER1_PATIENTS["test.second"];
  }
  // and spending the water elsewhere makes it useful again
  assert.equal(
    story.getGatherDecision("gather.water", { patients: withStatus("examined"), inventory: stock(FLASK) }),
    "gather",
  );
});

// ------------------------------------------------------------------------- BAKER
test("baker: DISCOVERED > the invitation, which leads to the examination", () => {
  const out = story.resolveStoryInteraction(
    BAKER,
    facts("discovered"),
    "es",
    "baker",
  );
  assert.equal(out.after, "go-to-examination");
  assert.deepEqual(out.effects, []);
  assert.equal(out.conversation.lines[0].speaker, "baker"); // the subject is the baker
  assert.equal(out.conversation.id, "chapter1.bakery.baker.intro");
});

test("baker: EXAMINED without the preparations > waiting dialogue; no effects", () => {
  for (const pairs of [[], [["medicinal-infusion", 1]], [["cold-cloth", 1]]]) {
    const out = story.resolveStoryInteraction(
      BAKER,
      facts("examined", pairs),
      "es",
      "baker",
    );
    assert.equal(out.conversation.id, "chapter1.bakery.baker.waiting");
    assert.deepEqual(out.effects, []);
    assert.equal(out.after, undefined);
  }
});

test("baker: EXAMINED with both preparations > delivery that consumes exactly both and treats", () => {
  const start = stock([
    ["medicinal-infusion", 1],
    ["cold-cloth", 1],
    ["honey", 1],
  ]);
  const out = story.resolveStoryInteraction(
    BAKER,
    { patients: withStatus("examined"), inventory: start },
    "es",
    "baker",
  );
  assert.equal(out.conversation.id, "chapter1.bakery.baker.delivery");
  assert.deepEqual(out.effects, [{ type: "treat", patientId: HUSBAND }]);
  const result = pc.treatPatient(withStatus("examined"), DEF, start);
  assert.equal(pc.getPatientStatus(result.state, HUSBAND), "treated");
  assert.equal(inv.countItem(result.inventory, "medicinal-infusion"), 0);
  assert.equal(inv.countItem(result.inventory, "cold-cloth"), 0);
  assert.equal(inv.countItem(result.inventory, "honey"), 1); // anything else untouched
  // extra copies are not eaten
  const extra = pc.treatPatient(
    withStatus("examined"),
    DEF,
    stock([
      ["medicinal-infusion", 2],
      ["cold-cloth", 3],
    ]),
  );
  assert.equal(inv.countItem(extra.inventory, "medicinal-infusion"), 1);
  assert.equal(inv.countItem(extra.inventory, "cold-cloth"), 2);
});

test("baker: a failed delivery consumes nothing (no partial treatment)", () => {
  for (const pairs of [[], [["medicinal-infusion", 1]], [["cold-cloth", 1]]]) {
    const start = stock(pairs);
    const snapshot = JSON.stringify(start);
    const state = withStatus("examined");
    assert.equal(pc.treatPatient(state, DEF, start), null);
    assert.equal(JSON.stringify(start), snapshot);
    assert.equal(pc.getPatientStatus(state, HUSBAND), "examined");
  }
  // wrong status: nothing happens either
  const full = stock([
    ["medicinal-infusion", 1],
    ["cold-cloth", 1],
  ]);
  assert.equal(pc.treatPatient(withStatus("discovered"), DEF, full), null);
  assert.equal(pc.treatPatient(withStatus("treated"), DEF, full), null);
});

test("baker: TREATED > the later dialogue, no scene, no consumption", () => {
  const out = story.resolveStoryInteraction(
    BAKER,
    facts("treated", [
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    "es",
    "baker",
  );
  assert.equal(out.conversation.id, "chapter1.bakery.baker.after");
  assert.deepEqual(out.effects, []);
  assert.equal(out.after, undefined);
});

test("baker and husband dialogues exist in ES and EN", () => {
  for (const lang of ["es", "en"]) {
    const exam = story.getExaminationConversation(HUSBAND, lang);
    assert.ok(exam.lines.length >= 5);
    assert.ok(exam.lines.every((l) => l.text.trim()));
    assert.ok(
      exam.lines.some((l) => l.speaker === ch1.BAKER_HUSBAND_INSTANCE_ID),
    );
    assert.ok(exam.lines.some((l) => l.speaker === "doctor"));
    for (const status of ["discovered", "examined", "treated"]) {
      assert.ok(
        story.resolveStoryInteraction(BAKER, facts(status), lang, "b")
          .conversation.lines.length >= 2,
      );
    }
  }
});

// ---------------------------------------------------------- ATTENTION INDICATOR
test('the "!" is derived from the case: baker while DISCOVERED only, never stored', () => {
  const ids = (status) => [...ch1.getAttentionInstanceIds(withStatus(status))];
  assert.deepEqual(ids("discovered"), ["bakery-interior-baker-01"]);
  assert.deepEqual(ids("examined"), []);
  assert.deepEqual(ids("treated"), []);
  assert.deepEqual(ids("hidden"), []);
  assert.deepEqual(
    [...ch1.getAttentionInstanceIds(ch1.CHAPTER1_INITIAL_PATIENTS)],
    ["bakery-interior-baker-01"],
  );
  // the baker is a real placed character with an interaction
  assert.equal(
    chapter1Interactions["bakery-interior-baker-01"].interactionId,
    BAKER,
  );
});

// ----------------------------------------------------------------- BAKERS BEDROOM
test("the Baker's Bedroom is a narrative scene: no exits, no door, no place of its own", () => {
  const bedroom = WORLD_SCENES["bakers-bedroom"];
  assert.deepEqual(bedroom.exits, []);
  for (const [id, scene] of Object.entries(WORLD_SCENES)) {
    assert.ok(
      !scene.exits.some((e) => e.targetScene === "bakers-bedroom"),
      `${id} must not lead to the bedroom`,
    );
  }
  // narrative microscene: nobody spawns there, nothing is controlled
  assert.equal(bedroom.narrative, true);
  assert.deepEqual(bedroom.arrivals, {});
  assert.equal(SCENE_TO_MAP_LOCATION["bakers-bedroom"], "bakery");
  assert.ok(WORLD_SCENES["bakery-interior"].arrivals["from-bakers-bedroom"]);
  // a microscene: nothing to collide with or walk through
  assert.deepEqual(bedroom.colliders, []);
});

test("Bakers Bedroom microscene: three placed pictures, each one a speaker with its own anchor", () => {
  const { getComposition } = at("src/game/compositions/index.ts");
  const { getDecorAsset, DOCTOR_NARRATIVE_ASSET_ID } = at(
    "src/game/decor/decorAssets.ts",
  );
  const composition = getComposition("bakers-bedroom", "chapter-1");
  const ids = composition.instances.map((i) => i.instanceId);

  // husband (bed included), baker and Doctor are all placed instances; no spawn file exists
  assert.ok(ids.includes(ch1.BAKER_HUSBAND_INSTANCE_ID));
  assert.ok(ids.includes(ch1.BAKER_BEDROOM_INSTANCE_ID));
  assert.ok(
    composition.instances.some((i) => i.assetId === DOCTOR_NARRATIVE_ASSET_ID),
  );
  assert.ok(!fs.existsSync(path.join(root, "src/game/bakers-bedroom")));
  assert.equal(getDecorAsset("baker-standing").sprite.frames.length, 1);
  assert.equal(getDecorAsset("baker").sprite.frames.length, 4); // the kneading baker is untouched

  // the examination uses all three speakers: husband, baker (her own instance) and Doctor
  for (const lang of ["es", "en"]) {
    const speakers = new Set(
      story
        .getExaminationConversation(HUSBAND, lang)
        .lines.map((l) => l.speaker),
    );
    assert.ok(speakers.has(ch1.BAKER_HUSBAND_INSTANCE_ID));
    assert.ok(speakers.has(ch1.BAKER_BEDROOM_INSTANCE_ID));
    assert.ok(speakers.has("doctor"));
    for (const speaker of speakers)
      assert.ok(speaker === "doctor" || ids.includes(speaker), speaker);
  }
});

test("the narrative Doctor is the exact frame the game draws standing still facing south", () => {
  const { getDecorAsset, DOCTOR_NARRATIVE_ASSET_ID } = at(
    "src/game/decor/decorAssets.ts",
  );
  const asset = getDecorAsset(DOCTOR_NARRATIVE_ASSET_ID);
  const controller = fs.readFileSync(
    path.join(root, "src/game/protagonist/useProtagonistController.ts"),
    "utf8",
  );
  // useProtagonistController: idle sprite of each direction (south, not walking)
  assert.ok(
    controller.includes('south: "/game/characters/protagonist/idle/south.png"'),
  );
  assert.deepEqual(asset.sprite.frames, [
    "/game/characters/protagonist/idle/south.png",
  ]);
  assert.equal(asset.sprite.fps, 0); // no animation
  assert.deepEqual(
    [asset.sprite.frameWidth, asset.sprite.frameHeight],
    [96, 96],
  ); // SPRITE_SIZE
  assert.deepEqual(asset.anchor, { x: 0.5, y: 1 }); // feet, like ProtagonistSprite
  assert.equal(asset.category, "narrative");
  assert.equal(asset.defaultCollider, undefined);
});

test("the standing baker uses the hand-adjusted PNG exactly, and its size in the world is separate from its resolution", () => {
  const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
  const file = fs.readFileSync(
    path.join(root, "public/game/npcs/baker-standing/static.png"),
  );
  const source = fs.readFileSync(
    path.join(root, "art/population-batch-8/baker-standing-source-114x257.png"),
  );
  assert.equal(file.readUInt32BE(16), 114); // PNG header: width, as delivered
  assert.equal(file.readUInt32BE(20), 257); // height, as delivered
  assert.ok(file.equals(source)); // byte for byte the source copy
  assert.ok(
    !fs.existsSync(
      path.join(
        root,
        "art/population-batch-8/baker-standing-source-1024x1536.png",
      ),
    ),
  );
  // drawn at 0.3 world units per image pixel: the size is data, the pixels are untouched
  const { sprite } = getDecorAsset("baker-standing");
  assert.ok(Math.abs(sprite.frameWidth / 114 - 0.3) < 0.001);
  assert.ok(Math.abs(sprite.frameHeight / 257 - 0.3) < 0.001);
});

test("Bakers Bedroom: ONE source of truth, the composition exported from the Decorator, exactly", () => {
  const { getComposition } = at("src/game/compositions/index.ts");
  const { chapter1Compositions } = at("src/game/compositions/chapter-1.ts");
  const composition = getComposition("bakers-bedroom", "chapter-1");
  const exported = chapter1Compositions.filter(
    (c) => c.sceneId === "bakers-bedroom",
  );

  // chapter-1.ts holds it once, and nothing else adds instances to that scene
  assert.equal(exported.length, 1);
  assert.equal(composition.instances.length, 3);
  assert.deepEqual(composition.instances, exported[0].instances);
  assert.ok(
    !fs.existsSync(
      path.join(root, "src/game/compositions/chapter-1.bedroom.ts"),
    ),
  );
  assert.ok(!fs.existsSync(path.join(root, "src/game/bakers-bedroom")));
  const indexSource = fs.readFileSync(
    path.join(root, "src/game/compositions/index.ts"),
    "utf8",
  );
  assert.ok(!/bedroom/i.test(indexSource));

  // the three instances, positions and scales as exported
  assert.deepEqual(composition.instances, [
    {
      instanceId: "bakers-bedroom-bakers-husband-sick-01",
      assetId: "bakers-husband-sick",
      x: 156,
      y: 160,
      scale: 0.97,
      flipX: false,
      colliderEnabled: false,
      zOffset: 0,
    },
    {
      instanceId: "bakers-bedroom-doctor-narrative-01",
      assetId: "doctor-narrative",
      x: 182,
      y: 150,
      scale: 0.95,
      flipX: false,
      colliderEnabled: false,
      zOffset: 0,
    },
    {
      instanceId: "bakers-bedroom-baker-standing-01",
      assetId: "baker-standing",
      x: 149,
      y: 155,
      scale: 1.14,
      flipX: false,
      colliderEnabled: false,
      zOffset: 0,
    },
  ]);
  // the dialogue speakers are exactly those instances
  assert.equal(
    ch1.BAKER_HUSBAND_INSTANCE_ID,
    "bakers-bedroom-bakers-husband-sick-01",
  );
  assert.equal(
    ch1.BAKER_BEDROOM_INSTANCE_ID,
    "bakers-bedroom-baker-standing-01",
  );
});

test("the Doctor starts Chapter 1 with an Empty flask x1 in an ordinary slot", () => {
  const initial = at(
    "src/game/inventory/initialInventory.ts",
  ).createChapter1Inventory();
  assert.equal(initial.capacity, 6);
  assert.equal(initial.slots.length, 6);
  assert.deepEqual(initial.slots[0], { itemId: "empty-flask", quantity: 1 });
  assert.equal(inv.countOccupiedSlots(initial), 1);
  assert.ok(inv.isValidInventory(initial));
  assert.equal(getItemName("empty-flask", "es"), "Frasco vacío");
  assert.equal(getItemName("empty-flask", "en"), "Empty flask");
  // a normal item: no hint, no special treatment in the needs
  assert.equal(getItem("empty-flask").sourceHint, undefined);
  assert.deepEqual(
    asObject(needs.getMissingIngredients(DEF.requiredTreatments, initial)),
    { water: 2, "medicinal-herb": 1, cloth: 1 },
  );
  // two sessions never share an inventory
  const other = at(
    "src/game/inventory/initialInventory.ts",
  ).createChapter1Inventory();
  other.slots[1] = { itemId: "water", quantity: 1 };
  assert.equal(initial.slots[1], null);
});

test("only the baker's husband is known at the start: PACIENTES lists just him, and only the baker has the '!'", () => {
  assert.deepEqual(Object.keys(ch1.CHAPTER1_INITIAL_PATIENTS), [HUSBAND]);
  assert.deepEqual(pc.getVisiblePatientIds(ch1.CHAPTER1_INITIAL_PATIENTS), [
    HUSBAND,
  ]);
  assert.deepEqual(
    [...ch1.getAttentionInstanceIds(ch1.CHAPTER1_INITIAL_PATIENTS)],
    ["bakery-interior-baker-01"],
  );
  const texts = book
    .buildBookSections({
      language: "es",
      patients: ch1.CHAPTER1_INITIAL_PATIENTS,
      inventory: inv.createEmptyInventory(),
      knownRecipeIds: new Set(),
    })[0]
    .spreads.flatMap((s) => s.texts ?? [])
    .map((t) => t.content.join(""));
  assert.deepEqual(texts, [
    "MARIDO DE LA PANADERA",
    "La panadera ha solicitado una visita. Su marido no se encuentra bien.",
  ]);
});

test("the visit moves discovered > examined, and examining reveals the two recipes (pure steps)", () => {
  const examined = pc.advancePatient(
    ch1.CHAPTER1_INITIAL_PATIENTS,
    HUSBAND,
    "examined",
  );
  assert.equal(pc.getPatientStatus(examined, HUSBAND), "examined");
  assert.deepEqual(DEF.revealsRecipeIds, [
    "fire.medicinal-infusion",
    "manual.cold-cloth",
  ]);
  // the Doctor's thoughts after the visit with only the flask in his pocket
  const flask = at(
    "src/game/inventory/initialInventory.ts",
  ).createChapter1Inventory();
  const thoughts = story.buildMissingIngredientConversation(
    needs.getMissingIngredients(DEF.requiredTreatments, flask),
    "es",
  );
  assert.equal(thoughts.lines.length, 3);
});

test("dialogue placement: only the sick husband speaks from below; returning from the bedroom faces south, nothing else changes", () => {
  const { DECOR_ASSETS } = at("src/game/decor/decorAssets.ts");
  const below = DECOR_ASSETS.filter((a) => a.dialoguePlacement === "below").map((a) => a.id);
  assert.deepEqual(below, ["bakers-husband-sick"]);

  const arrivals = WORLD_SCENES["bakery-interior"].arrivals;
  assert.equal(arrivals["from-bakers-bedroom"].direction, "south");
  // same floor spot as the door, only the direction differs
  assert.equal(arrivals["from-bakers-bedroom"].x, arrivals["from-bakery-street"].x);
  assert.equal(arrivals["from-bakers-bedroom"].y, arrivals["from-bakery-street"].y);
  assert.notEqual(arrivals["from-bakery-street"].direction, "south");
});

console.log(`\n${passed} tests passed`);
