// Witch (at the bar of the tavern) and Patient 3 (the injured miner): states,
// atomic trades, the order-independence of the whole thing and the
// reachability of everything involved.
//   node tests/witch-patient3.test.mjs
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
const { getActiveMissingIngredients } = at("src/game/patients/patientNeeds.ts");
const cr = at("src/game/crafting/crafting.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const witchTalk = at("src/game/dialogue/chapter1WitchDialogues.ts");
const p3Talk = at("src/game/dialogue/chapter1Patient3Dialogues.ts");
const { AILMENTS } = at("src/game/book/ailments.ts");
const book = at("src/game/book/bookPages.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { getComposition, getChapterInteractions } = at(
  "src/game/compositions/index.ts",
);
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { rectsIntersect } = at("src/game/collision.ts");
const { chapter1AmbientDialogues } = at(
  "src/game/dialogue/chapter1Dialogues.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const MINER = "chapter1.mine.injuredMiner";
const WITCH = "chapter1.tavern.witch";
const BARTENDER = "chapter1.tavern.bartender";
const MOUNTAIN = "chapter1.mountainPath.miner";
const MERCHANT = "chapter1.plaza.merchant";
const P3 = ch1.INJURED_MINER_ID;
const P3DEF = ch1.CHAPTER1_PATIENTS[P3];

const stock = (pairs) =>
  pairs.reduce(
    (s, [id, q]) => inv.addItem(s, id, q),
    inv.createEmptyInventory(),
  );
const count = (f, id) => inv.countItem(f.inventory, id);
// patient states: Patient 1 and 2 as given, Patient 3 as given
const world = ({
  p1 = "discovered",
  p2,
  p3,
  pairs = [],
  claimed = [],
} = {}) => ({
  patients: {
    [ch1.BAKER_HUSBAND_ID]: p1,
    ...(p2 ? { [ch1.TAVERN_PATIENT_ID]: p2 } : {}),
    ...(p3 ? { [P3]: p3 } : {}),
  },
  inventory: stock(pairs),
  claimedRewards: new Set(claimed),
});
const talk = (id, f, language = "es") =>
  story.resolveStoryInteraction(id, f, language, "subject");
const lines = (outcome) => outcome.conversation.lines.map((l) => l.text);

// What GameWorld does with an outcome: the effects together or not at all, and
// the examination when its conversation ends.
function apply(f, outcome) {
  let inventory = f.inventory;
  let patients = f.patients;
  let claimed = new Set(f.claimedRewards);

  for (const e of outcome.effects) {
    if (e.type === "give-item")
      inventory = inv.addItem(inventory, e.itemId, e.quantity);
    else if (e.type === "take-item")
      inventory = inv.removeItem(inventory, e.itemId, e.quantity);
    else if (e.type === "claim-reward")
      claimed = new Set([...claimed, e.rewardId]);
    else if (e.type === "advance-patient")
      patients = pc.advancePatient(patients, e.patientId, e.to);
    else if (e.type === "treat") {
      const result = pc.treatPatient(
        patients,
        ch1.CHAPTER1_PATIENTS[e.patientId],
        inventory,
      );
      if (!result) return null;
      patients = result.state;
      inventory = result.inventory;
    }
    if (!inventory) return null;
  }

  let next = { patients, inventory, claimedRewards: claimed };

  if (outcome.after === "examine-in-place") {
    const noticed = pc.advancePatient(
      next.patients,
      outcome.patientId,
      "discovered",
    );
    next = {
      ...next,
      patients: pc.advancePatient(noticed, outcome.patientId, "examined"),
    };
  }

  return next;
}
// A conversation, then its effects.
const go = (id, f, language) => {
  const outcome = talk(id, f, language);
  const next = apply(f, outcome);
  assert.ok(next, `${id}: effects applied`);
  return { outcome, next };
};
const crowded = (extra = []) =>
  stock([
    ["cloth", 1],
    ["salt", 1],
    ["water", 1],
    ["orange", 1],
    ...extra,
  ]);

// =============================================================== WITCH
test("Witch 1. first talk without Mushroom: the whole conversation, the favour is asked, nothing is traded", () => {
  witchTalk.pickWitchQuote(-1);
  const first = talk(WITCH, world());
  assert.equal(first.conversation.id, "chapter1.tavern.witch.first");
  assert.deepEqual(first.effects, [
    { type: "claim-reward", rewardId: ch1.WITCH_MET_ID },
  ]);
  const es = lines(first);
  assert.equal(es[0], "Tienes peor cara que la última vez.");
  assert.equal(es[1], "Llevo una máscara.");
  assert.ok(es.includes("Voy por la segunda jarra."));
  assert.ok(
    es.includes(
      "Si acabas pasando por la mina, tráeme uno de esos hongos que crecen dentro.",
    ),
  );
  assert.equal(
    es.at(-1),
    "Empiezas a entender cómo funcionan nuestras conversaciones.",
  );
  assert.ok(es.length >= 24, "a substantial conversation, not a 3-line one");
  // the speakers: Witch is "subject" (the bubble follows her), the Doctor himself
  assert.equal(first.conversation.lines[0].speaker, "subject");
  assert.equal(first.conversation.lines[1].speaker, "doctor");
});

test("Witch 2. first talk already carrying a Mushroom: she is annoyed and the swap happens in that same conversation", () => {
  const f = world({ pairs: [["mushroom", 1]] });
  const first = talk(WITCH, f);
  assert.equal(
    first.conversation.id,
    "chapter1.tavern.witch.firstWithMushroom",
  );
  assert.deepEqual(first.effects, [
    { type: "claim-reward", rewardId: ch1.WITCH_MET_ID },
    { type: "take-item", itemId: "mushroom", quantity: 1 },
    { type: "give-item", itemId: "medicinal-herb", quantity: 1 },
    { type: "give-item", itemId: "black-feather", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.WITCH_HERB_REWARD_ID },
  ]);
  const es = lines(first);
  const ask = es.indexOf(
    "Si acabas pasando por la mina, tráeme uno de esos hongos que crecen dentro.",
  );
  assert.equal(es[ask + 1], "¿Uno de estos?");
  assert.equal(es[ask + 5], "¿Estar preparado?");
  assert.equal(es[ask + 6], "Arruinarme el misterio.");
  assert.equal(es[ask + 7], "Tu hongo.");
  assert.ok(!es.includes("Quiero un hongo."), "no 'what for' branch");
  const done = apply(f, first);
  assert.equal(count(done, "mushroom"), 0);
  assert.equal(count(done, "medicinal-herb"), 1);
  assert.ok(done.claimedRewards.has(ch1.WITCH_HERB_REWARD_ID));
});

test("Witch 3. waiting: one short reminder, then small talk; the long conversation never comes back", () => {
  let f = world();
  ({ next: f } = go(WITCH, f)); // she asks
  const waiting = talk(WITCH, f);
  assert.equal(waiting.conversation.id, "chapter1.tavern.witch.waiting");
  assert.deepEqual(lines(waiting), [
    "¿Mi hongo?",
    "Todavía no.",
    "Qué decepción tan manejable.",
  ]);
  f = apply(f, waiting);
  for (let i = 0; i < 12; i++) {
    const again = talk(WITCH, f);
    assert.match(again.conversation.id, /^chapter1\.tavern\.witch\.quote\./);
    assert.deepEqual(again.effects, []);
  }
});

test("Witch 4. the swap: exactly Mushroom x1 for Medicinal herb x1, once, never repeated", () => {
  let f = world({
    pairs: [
      ["mushroom", 2],
      ["water", 1],
    ],
  });
  ({ next: f } = go(WITCH, { ...f, inventory: stock([["water", 1]]) })); // asks (no mushroom)
  f = {
    ...f,
    inventory: stock([
      ["mushroom", 2],
      ["water", 1],
    ]),
  };
  const trade = talk(WITCH, f);
  assert.equal(trade.conversation.id, "chapter1.tavern.witch.trade");
  assert.deepEqual(trade.effects, [
    { type: "take-item", itemId: "mushroom", quantity: 1 },
    { type: "give-item", itemId: "medicinal-herb", quantity: 1 },
    { type: "give-item", itemId: "black-feather", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.WITCH_HERB_REWARD_ID },
  ]);
  const es = lines(trade);
  assert.equal(es[0], "Tu hongo.");
  // the herb scene ends with "Demasiado tarde." and the feather lines follow
  const late = es.indexOf("Demasiado tarde.");
  assert.equal(es[late + 1], "Y esto.");
  assert.equal(es.at(-1), "Es lo mismo.");
  const done = apply(f, trade);
  assert.equal(count(done, "mushroom"), 1, "only one mushroom is taken");
  assert.equal(count(done, "medicinal-herb"), 1, "exactly one herb");
  assert.equal(count(done, "water"), 1, "nothing else is touched");
  // never twice, even with another mushroom in the bag
  const again = talk(WITCH, done);
  assert.match(again.conversation.id, /quote\./);
  assert.deepEqual(again.effects, []);
});

test("Witch 5. atomic: a swap that does not fit changes nothing and is retried later", () => {
  // Mushroom x2 plus five other stacks: the herb has no slot and paying one
  // mushroom frees none
  const full = crowded([["mushroom", 2], ["coal", 1]]);
  assert.equal(inv.countOccupiedSlots(full), 6);
  let f = { ...world(), inventory: full };
  const blocked = talk(WITCH, {
    ...f,
    claimedRewards: new Set([ch1.WITCH_MET_ID]),
  });
  assert.equal(blocked.conversation.id, "chapter1.tavern.witch.tradeNoRoom");
  assert.deepEqual(blocked.effects, []);
  // the very first talk with a full bag: told, remembered, nothing taken
  const first = talk(WITCH, f);
  assert.equal(
    first.conversation.id,
    "chapter1.tavern.witch.firstWithMushroomNoRoom",
  );
  assert.deepEqual(first.effects, [
    { type: "claim-reward", rewardId: ch1.WITCH_MET_ID },
  ]);
  f = apply(f, first);
  assert.equal(count(f, "mushroom"), 2);
  assert.ok(
    !f.claimedRewards.has(ch1.WITCH_HERB_REWARD_ID),
    "not marked as done",
  );
  // with room (two free slots: the herb and the black feather), the retry is the plain trade
  f = { ...f, inventory: inv.removeItem(inv.removeItem(f.inventory, "salt", 1), "water", 1) };
  const retry = talk(WITCH, f);
  assert.equal(retry.conversation.id, "chapter1.tavern.witch.trade");
  assert.equal(count(apply(f, retry), "medicinal-herb"), 1);
  // a single mushroom in a full bag: paying frees its own slot, but she now gives TWO
  // things (the herb and the black feather), so one more free slot is needed
  const singleFull = {
    ...world({ claimed: [ch1.WITCH_MET_ID] }),
    inventory: crowded([["mushroom", 1], ["coal", 1]]),
  };
  assert.equal(
    talk(WITCH, singleFull).conversation.id,
    "chapter1.tavern.witch.tradeNoRoom",
  );
  const single = {
    ...singleFull,
    inventory: inv.removeItem(singleFull.inventory, "salt", 1),
  };
  const ok = talk(WITCH, single);
  assert.equal(ok.conversation.id, "chapter1.tavern.witch.trade");
  const swapped = apply(single, ok);
  assert.equal(count(swapped, "mushroom"), 0);
  assert.equal(count(swapped, "medicinal-herb"), 1);
});

test("Witch 6. small talk: 8 exchanges, never the same twice in a row, all of them reachable", () => {
  assert.equal(witchTalk.WITCH_QUOTES.length, 8);
  for (let last = -1; last < 8; last++) {
    for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
      const index = witchTalk.pickWitchQuote(last, () => r);
      assert.ok(index >= 0 && index < 8);
      assert.notEqual(index, last);
    }
  }
  const seen = new Set();
  for (let last = -1, i = 0; i < 400; i++) {
    last = witchTalk.pickWitchQuote(last);
    seen.add(last);
  }
  assert.equal(seen.size, 8);
  // through the resolver: after the swap it is only small talk, never repeated at once
  story.resetWitchQuoteHistory();
  const f = world({ claimed: [ch1.WITCH_MET_ID, ch1.WITCH_HERB_REWARD_ID] });
  let previous = null;
  for (let i = 0; i < 60; i++) {
    const id = talk(WITCH, f).conversation.id;
    assert.notEqual(id, previous);
    previous = id;
  }
  const first = witchTalk.WITCH_QUOTES[0].lines.map((l) => l.text.es);
  assert.deepEqual(first, [
    "¿Siempre estás donde menos espero encontrarte?",
    "Eso dice más de tus expectativas que de mí.",
  ]);
  assert.deepEqual(
    witchTalk.WITCH_QUOTES[7].lines.map((l) => l.text.es),
    ["¿No tienes ningún sitio al que ir?", "Sí.", "¿Y?", "Estoy aquí."],
  );
});

test("Witch 7. ES and EN on every line, and the English is its own writing", () => {
  const all = [
    witchTalk.witchFirst,
    witchTalk.witchFirstWithMushroom,
    witchTalk.witchFirstWithMushroomNoRoom,
    witchTalk.witchWaiting,
    witchTalk.witchTrade,
    witchTalk.witchTradeNoRoom,
    ...witchTalk.WITCH_QUOTES,
    p3Talk.injuredMinerExam,
    p3Talk.injuredMinerWaiting,
    p3Talk.injuredMinerCure,
    p3Talk.injuredMinerAfter,
    p3Talk.bartenderAlcoholReady,
    p3Talk.bartenderAlcoholNoRoom,
    p3Talk.mountainMinerCoalReady,
    p3Talk.mountainMinerCoalNoRoom,
    p3Talk.mountainMinerCoalDone,
  ];
  for (const c of all) {
    for (const line of c.lines) {
      assert.ok(["doctor", "subject"].includes(line.speaker), c.id);
      assert.ok(line.text.es.trim() && line.text.en.trim(), c.id);
    }
  }
  assert.equal(
    lines(talk(WITCH, world(), "en"))[0],
    "You look worse than last time.",
  );
  assert.equal(lines(talk(WITCH, world(), "en"))[1], "I'm wearing a mask.");
  assert.ok(
    lines(talk(WITCH, world({ pairs: [["mushroom", 1]] }), "en")).includes(
      "Too late.",
    ),
  );
});

test("Witch 8. Witch never depends on a case: the same talk with any state of Patients 1, 2 and 3", () => {
  const ids = new Set();
  for (const p1 of ["discovered", "examined", "treated"])
    for (const p2 of [undefined, "hidden", "examined", "treated"])
      for (const p3 of [undefined, "examined", "treated"])
        ids.add(talk(WITCH, world({ p1, p2, p3 })).conversation.id);
  assert.deepEqual([...ids], ["chapter1.tavern.witch.first"]);
  // nor does the herb: a swap before any case is examined is a normal one
  const f = world({ claimed: [ch1.WITCH_MET_ID], pairs: [["mushroom", 1]] });
  assert.equal(count(apply(f, talk(WITCH, f)), "medicinal-herb"), 1);
  // Witch is a fixed spot with no "!" and her cat has no interaction at all
  for (const status of [undefined, "examined", "treated"]) {
    const ids2 = ch1.getAttentionInstanceIds(
      world({ p3: status }).patients,
      new Set(),
      stock([["mushroom", 1]]),
    );
    assert.ok(!ids2.has(ch1.WITCH_INSTANCE_ID));
  }
  assert.equal(
    getChapterInteractions("chapter-1")["tavern-interior-witch-cat-sitting-01"],
    undefined,
  );
  assert.ok(chapter1AmbientDialogues[WITCH], "an ambient fallback exists");
});

// ======================================================= MUSHROOMS (the mine)
test("Mushrooms. two independent collectibles of Mushroom x1: the same resource, each gone on its own", () => {
  const composition = getComposition("mine-interior", "chapter-1");
  const find = (id) => composition.instances.find((i) => i.instanceId === id);
  const a = find("mine-interior-mushroom-world-02");
  const b = find("mine-interior-mushroom-world-01");
  assert.deepEqual(
    [a.assetId, a.x, a.y, a.scale],
    ["mushroom-world", 365, 108, 0.75],
  );
  assert.deepEqual(
    [b.assetId, b.x, b.y, b.scale],
    ["mushroom-world", 430, 238, 0.75],
  );
  assert.equal(a.assetId, b.assetId, "no 'witch mushroom' vs 'soup mushroom'");
  const asset = getDecorAsset("mushroom-world");
  assert.equal(asset.collectibleItemId, "mushroom");
  assert.equal(asset.collectibleQuantity ?? 1, 1);
  const interactions = getChapterInteractions("chapter-1");
  const both = resolveDecorInstances(composition.instances, interactions);
  const zones = both.zones.filter(
    (z) => z.interactionId === "collect.mushroom",
  );
  assert.equal(zones.length, 2);
  assert.deepEqual(
    zones.map((z) => both.zoneInstanceIds.get(z.id)).sort(),
    [a.instanceId, b.instanceId].sort(),
  );
  for (const z of zones) assert.equal(both.zoneItemQuantities.get(z.id), 1);
  // picking one up only removes that one
  const one = resolveDecorInstances(
    composition.instances,
    interactions,
    new Set([a.instanceId]),
  );
  assert.equal(
    one.zones.filter((z) => z.interactionId === "collect.mushroom").length,
    1,
  );
  assert.ok(one.sprites.some((s) => s.instance.instanceId === b.instanceId));
  assert.ok(!one.sprites.some((s) => s.instance.instanceId === a.instanceId));
  // two pickups stack in ONE slot: Mushroom x2
  const two = inv.addItem(
    inv.addItem(inv.createEmptyInventory(), "mushroom", 1),
    "mushroom",
    1,
  );
  assert.equal(inv.countItem(two, "mushroom"), 2);
  assert.equal(inv.countOccupiedSlots(two), 1);
  // the injured miner stands exactly where it was authored
  const miner = find("mine-interior-injured-miner-01");
  assert.deepEqual(
    [miner.assetId, miner.x, miner.y, miner.scale],
    ["injured-miner", 148, 263, 0.72],
  );
  assert.equal(miner.colliderEnabled, false);
});

// ============================================================ PATIENT 3
test("P3 1. the injured miner is there from the start: examined where he sits, with no other case needed", () => {
  const initial = world({ p1: "discovered" }); // the real start of the chapter
  const first = talk(MINER, initial);
  assert.equal(first.conversation.id, "chapter1.mine.injuredMiner.exam");
  assert.equal(first.after, "examine-in-place");
  assert.equal(first.patientId, P3);
  assert.deepEqual(first.effects, []);
  const es = lines(first);
  assert.equal(es[0], "Ah... despacio. La pierna.");
  assert.ok(es.includes("La zona está roja, hinchada y supura. El dolor no ha remitido."));
  assert.ok(!es.includes("La herida está infectada."), "the examination leaves diagnosis to the player");
  assert.equal(es.at(-1), "Intentaré colaborar.");
  // the same with any state of the other cases, in any order
  for (const p1 of ["discovered", "examined", "treated"])
    for (const p2 of [undefined, "hidden", "discovered", "examined", "treated"])
      assert.equal(
        talk(MINER, world({ p1, p2 })).conversation.id,
        "chapter1.mine.injuredMiner.exam",
      );
  const done = apply(initial, first);
  assert.equal(pc.getPatientStatus(done.patients, P3), "examined");
  assert.equal(
    pc.getPatientStatus(done.patients, ch1.BAKER_HUSBAND_ID),
    "discovered",
    "Patient 1 untouched",
  );
  assert.equal(
    pc.getPatientStatus(done.patients, ch1.TAVERN_PATIENT_ID),
    "hidden",
    "Patient 2 untouched",
  );
});

test("P3 2. infected-wound, both treatments and their recipes are revealed", () => {
  assert.equal(P3DEF.ailmentId, "infected-wound");
  assert.ok(AILMENTS.some((a) => a.id === "infected-wound"));
  assert.deepEqual(P3DEF.requiredTreatments, [
    { itemId: "disinfected-bandage", quantity: 1 },
    { itemId: "medicinal-ointment", quantity: 1 },
  ]);
  assert.deepEqual(P3DEF.revealsRecipeIds, [
    "manual.disinfected-bandage",
    "manual.medicinal-ointment",
  ]);
  assert.equal(P3DEF.examination, "in-place");
  const game = fs.readFileSync(
    path.join(root, "src/game/world/GameWorld.tsx"),
    "utf8",
  );
  assert.ok(game.includes("definition.revealsRecipeIds"));
  // the Book: the patient, the ailment and BOTH preparations (herb + coal, no paste)
  const text = (language) =>
    book
      .buildBookSections({
        language,
        patients: world({ p3: "examined" }).patients,
        inventory: stock([]),
        knownRecipeIds: new Set(P3DEF.revealsRecipeIds),
      })
      .flatMap((s) => s.spreads)
      .flatMap((s) => s.texts ?? [])
      .map((t) => t.content.join(""))
      .join(" | ")
      .toUpperCase();
  assert.ok(text("es").includes("MINERO HERIDO"));
  assert.ok(text("es").includes("VENDAJE DESINFECTADO"));
  assert.ok(text("es").includes("UNGÜENTO MEDICINAL"));
  assert.ok(text("es").includes("HIERBA MEDICINAL"));
  assert.ok(text("es").includes("CARBÓN"));
  assert.ok(!text("es").includes("PASTA MEDICINAL"));
  assert.ok(text("en").includes("INJURED MINER"));
  assert.ok(text("en").includes("DISINFECTED BANDAGE"));
  assert.ok(text("en").includes("MEDICINAL HERB"));
  assert.ok(!text("en").includes("MEDICINAL PASTE"));
});

test("P3 3. recipes: ointment = Medicinal herb + Crushed coal (manual); bandage = Cloth + Alcohol; the paste stays but no case needs it", () => {
  const recipe = (id) => RECIPES.find((r) => r.id === id);
  const ointment = recipe("manual.medicinal-ointment");
  assert.equal(ointment.station, "manual");
  assert.deepEqual(ointment.inputs, [
    { itemId: "medicinal-herb", quantity: 1 },
    { itemId: "crushed-coal", quantity: 1 },
  ]);
  assert.deepEqual(ointment.output, {
    itemId: "medicinal-ointment",
    quantity: 1,
  });
  const bandage = recipe("manual.disinfected-bandage");
  assert.equal(bandage.station, "manual");
  assert.deepEqual(bandage.inputs, [
    { itemId: "cloth", quantity: 1 },
    { itemId: "alcohol", quantity: 1 },
  ]);
  assert.ok(recipe("manual.medicinal-paste"), "kept, unused");
  for (const def of Object.values(ch1.CHAPTER1_PATIENTS)) {
    assert.ok(
      !def.requiredTreatments.some((t) => t.itemId === "medicinal-paste"),
    );
    assert.ok(!def.revealsRecipeIds.includes("manual.medicinal-paste"));
  }
  // really craftable
  const ground = cr.combine(stock([["coal", 1]]), "mortar", ["coal"]);
  assert.equal(ground.kind, "success");
  const made = cr.combine(
    inv.addItem(ground.inventory, "medicinal-herb", 1),
    "manual",
    ["crushed-coal", "medicinal-herb"],
  );
  assert.equal(made.kind, "success");
  assert.equal(made.recipe.output.itemId, "medicinal-ointment");
  const wrapped = cr.combine(
    stock([
      ["cloth", 1],
      ["alcohol", 1],
    ]),
    "manual",
    ["alcohol", "cloth"],
  );
  assert.equal(wrapped.kind, "success");
  assert.equal(wrapped.recipe.output.itemId, "disinfected-bandage");
});

test("P3 4. Cloth: the merchant sells it (one coin each, three in stock), whatever Patient 1 did", () => {
  const needs = (f) =>
    getActiveMissingIngredients(f.patients, ch1.CHAPTER1_PATIENTS, f.inventory)
      .map((n) => `${n.itemId}x${n.quantity}`)
      .sort();
  assert.deepEqual(needs(world({ p3: "examined" })), [
    "alcoholx1",
    "clothx1",
    "coalx1",
    "medicinal-herbx1",
  ]);
  // he no longer gives it through the story: the counter is a shop
  for (const p1 of [undefined, "discovered", "examined", "treated"]) {
    assert.equal(talk(MERCHANT, world({ p1, p3: "examined" })), null, String(p1));
  }
  const shops = at("src/game/shop/shops.ts");
  const money = at("src/game/money/money.ts");
  const shop = shops.getShop(MERCHANT);
  const cloth = shop.entries[0];
  // buying is all or nothing: the coin goes only with the cloth
  let claimed = new Set();
  let coins = money.STARTING_COINS;
  let inventory = world({ p3: "examined" }).inventory;
  for (let i = 1; i <= 3; i++) {
    assert.equal(shops.unitsLeft(claimed, shop, cloth), 4 - i);
    const effects = shops.buyEffects(claimed, shop, cloth);
    assert.deepEqual(effects.map((e) => e.type), ["take-coins", "give-item", "claim-reward"]);
    coins = money.spendCoins(coins, cloth.price);
    inventory = inv.addItem(inventory, "cloth", 1);
    claimed = new Set([...claimed, effects[2].rewardId]);
  }
  assert.equal(shops.unitsLeft(claimed, shop, cloth), 0, "sold out after three");
  assert.equal(coins, money.STARTING_COINS - 3, "three cloths cost three of the starting coins");
  assert.equal(inv.countItem(inventory, "cloth"), 3, "two now, one left over for Day 2");
  // with nothing left, a purchase that cannot be paid takes nothing
  assert.equal(money.spendCoins(0, cloth.price), null, "no coins, nothing is spent");
});

test("P3 5. Alcohol: the bartender gives it once the miner is examined, first of all, once, atomically", () => {
  // not before
  for (const p3 of [undefined, "discovered"]) {
    const outcome = talk(BARTENDER, world({ p3 }));
    assert.ok(!outcome.effects.some((e) => e.itemId === "alcohol"));
    assert.ok(!outcome.conversation.id.endsWith("alcohol"));
  }
  const f = world({ p3: "examined" });
  const alcohol = talk(BARTENDER, f);
  assert.equal(alcohol.conversation.id, "chapter1.tavern.bartender.alcohol");
  assert.deepEqual(alcohol.effects, [
    { type: "give-item", itemId: "alcohol", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.BARTENDER_ALCOHOL_REWARD_ID },
  ]);
  const es = lines(alcohol);
  assert.equal(es[0], "Necesito algo de alcohol. Cuanto más fuerte, mejor.");
  assert.equal(es.at(-1), "Nada. Pero si el minero pregunta, era del barato.");
  const done = apply(f, alcohol);
  assert.equal(count(done, "alcohol"), 1);
  // it does not touch Patient 2: his own conversation comes next
  const next = talk(BARTENDER, done);
  assert.equal(next.conversation.id, "chapter1.tavern.bartender.intro");
  assert.ok(!next.effects.some((e) => e.itemId === "alcohol"), "never twice");
  // a full bag: nothing is given, nothing is claimed, and it is retried
  const full = { ...f, inventory: crowded([["mushroom", 1], ["coal", 1]]) };
  const blocked = talk(BARTENDER, full);
  assert.equal(
    blocked.conversation.id,
    "chapter1.tavern.bartender.alcoholNoRoom",
  );
  assert.deepEqual(blocked.effects, []);
  const roomy = {
    ...full,
    inventory: inv.removeItem(full.inventory, "salt", 1),
  };
  assert.equal(
    talk(BARTENDER, roomy).conversation.id,
    "chapter1.tavern.bartender.alcohol",
  );
});

test("P3 6. Coal: the Mountain Path miner is only ambient until the case is examined, then gives it once", () => {
  for (const p3 of [undefined, "discovered"]) {
    assert.equal(talk(MOUNTAIN, world({ p3 })), null, "ambient, no quest");
  }
  const ambient = chapter1AmbientDialogues[MOUNTAIN].lines
    .map((l) => l.text.es)
    .join(" ");
  assert.ok(
    !/compañero|dentro|herid/i.test(ambient),
    "he sends nobody anywhere",
  );
  assert.equal(
    chapter1AmbientDialogues[MOUNTAIN].lines[0].text.es,
    "Si viene buscando trabajo, ha elegido mal la ropa.",
  );
  const f = world({ p3: "examined" });
  const coal = talk(MOUNTAIN, f);
  assert.equal(coal.conversation.id, "chapter1.mountainPath.miner.coal");
  assert.deepEqual(coal.effects, [
    { type: "give-item", itemId: "coal", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.MOUNTAIN_MINER_COAL_REWARD_ID },
  ]);
  assert.equal(
    lines(coal)[0],
    "Tu compañero de la mina se ha hecho una herida bastante fea.",
  );
  const done = apply(f, coal);
  assert.equal(count(done, "coal"), 1);
  const again = talk(MOUNTAIN, done);
  assert.equal(again.conversation.id, "chapter1.mountainPath.miner.coalDone");
  assert.deepEqual(again.effects, []);
  const full = { ...f, inventory: crowded([["mushroom", 1], ["alcohol", 1]]) };
  const blocked = talk(MOUNTAIN, full);
  assert.equal(
    blocked.conversation.id,
    "chapter1.mountainPath.miner.coalNoRoom",
  );
  assert.deepEqual(blocked.effects, []);
  assert.ok(
    !apply(full, blocked).claimedRewards.has(ch1.MOUNTAIN_MINER_COAL_REWARD_ID),
  );
});

test("P3 7. treatment: both preparations or nothing, consumed together, once; then a short persistent talk", () => {
  const examined = world({ p3: "examined" });
  const waiting = talk(MINER, examined);
  assert.equal(waiting.conversation.id, "chapter1.mine.injuredMiner.waiting");
  assert.deepEqual(waiting.effects, []);
  for (const pairs of [
    [["disinfected-bandage", 1]],
    [["medicinal-ointment", 1]],
  ]) {
    const one = talk(MINER, { ...examined, inventory: stock(pairs) });
    assert.equal(one.conversation.id, "chapter1.mine.injuredMiner.waiting");
    assert.deepEqual(one.effects, []);
  }
  const both = {
    ...examined,
    inventory: stock([
      ["disinfected-bandage", 1],
      ["medicinal-ointment", 1],
      ["water", 1],
    ]),
  };
  const cure = talk(MINER, both);
  assert.equal(cure.conversation.id, "chapter1.mine.injuredMiner.cure");
  assert.deepEqual(cure.effects, [{ type: "treat", patientId: P3 }]);
  assert.equal(
    lines(cure)[0],
    "Voy a limpiar la herida primero. Esto va a escocer.",
  );
  const treated = apply(both, cure);
  assert.equal(pc.getPatientStatus(treated.patients, P3), "treated");
  assert.equal(count(treated, "disinfected-bandage"), 0);
  assert.equal(count(treated, "medicinal-ointment"), 0);
  assert.equal(count(treated, "water"), 1, "nothing else is touched");
  // no second treatment, no reward
  assert.equal(
    pc.treatPatient(
      treated.patients,
      P3DEF,
      stock([
        ["disinfected-bandage", 1],
        ["medicinal-ointment", 1],
      ]),
    ),
    null,
  );
  assert.equal(ch1.CHAPTER1_PATIENT_REWARDS[P3], undefined);
  const after = talk(MINER, {
    ...treated,
    inventory: stock([
      ["disinfected-bandage", 1],
      ["medicinal-ointment", 1],
    ]),
  });
  assert.equal(after.conversation.id, "chapter1.mine.injuredMiner.after");
  assert.deepEqual(after.effects, []);
  assert.equal(lines(after)[0], "La pierna está bastante mejor.");
});

test('P3 8. the "!": the miner until he is examined and again when both preparations are ready; the givers only while they owe something', () => {
  const ids = (p3, pairs = [], claimed = []) =>
    // (Patient 2 is closed: its own "!" are not what this is about)
    new Set(
      ch1.getAttentionInstanceIds(
        world({ p2: "treated", p3 }).patients,
        new Set(claimed),
        stock(pairs),
      ),
    );
  const MINERI = ch1.INJURED_MINER_INSTANCE_ID;
  assert.ok(ids(undefined).has(MINERI));
  assert.ok(ids("discovered").has(MINERI));
  const examined = ids("examined");
  assert.ok(
    !examined.has(MINERI),
    "examined: no more '!' until he can be treated",
  );
  assert.ok(examined.has(ch1.TAVERN_BARTENDER_INSTANCE_ID), "alcohol pending");
  assert.ok(examined.has(ch1.MOUNTAIN_MINER_INSTANCE_ID), "coal pending");
  assert.ok(
    ids("examined", [], [ch1.BARTENDER_ALCOHOL_REWARD_ID]).has(
      ch1.MOUNTAIN_MINER_INSTANCE_ID,
    ),
  );
  assert.ok(
    !ids(
      "examined",
      [],
      [ch1.BARTENDER_ALCOHOL_REWARD_ID, ch1.MOUNTAIN_MINER_COAL_REWARD_ID],
    ).has(ch1.MOUNTAIN_MINER_INSTANCE_ID),
  );
  assert.ok(
    !ids("examined", [], [ch1.BARTENDER_ALCOHOL_REWARD_ID]).has(
      ch1.TAVERN_BARTENDER_INSTANCE_ID,
    ),
  );
  assert.ok(
    ids("examined", [
      ["disinfected-bandage", 1],
      ["medicinal-ointment", 1],
    ]).has(MINERI),
    "ready to treat",
  );
  const treated = ids("treated", [["disinfected-bandage", 1]]);
  assert.ok(!treated.has(MINERI));
  assert.ok(!treated.has(ch1.MOUNTAIN_MINER_INSTANCE_ID));
  assert.ok(!treated.has(ch1.WITCH_INSTANCE_ID));
});

// ================================================== ORDER INDEPENDENCE
test("Route A (the suggested order): Witch asks > mine > Mushroom > Witch gives the herb > the whole of Patient 3", () => {
  let f = world();
  ({ next: f } = go(WITCH, f)); // asks for the mushroom
  assert.ok(f.claimedRewards.has(ch1.WITCH_MET_ID));
  f = { ...f, inventory: inv.addItem(f.inventory, "mushroom", 1) }; // picks one up in the mine
  ({ next: f } = go(WITCH, f)); // the swap
  assert.equal(count(f, "medicinal-herb"), 1);
  ({ next: f } = go(MINER, f)); // examined
  f = { ...f, inventory: inv.addItem(f.inventory, "cloth", 2) }; // bought at the merchant (one coin each)
  ({ next: f } = go(BARTENDER, f)); // alcohol
  ({ next: f } = go(MOUNTAIN, f)); // coal
  for (const id of ["cloth", "alcohol", "medicinal-herb", "coal"])
    assert.equal(count(f, id), id === "cloth" ? 2 : 1, id); // two scraps: one is Day 2's
  const bandage = cr.combine(f.inventory, "manual", ["cloth", "alcohol"]);
  const ground = cr.combine(bandage.inventory, "mortar", ["coal"]);
  const ointment = cr.combine(ground.inventory, "manual", [
    "medicinal-herb",
    "crushed-coal",
  ]);
  f = { ...f, inventory: ointment.inventory };
  const { outcome, next } = go(MINER, f);
  assert.equal(outcome.conversation.id, "chapter1.mine.injuredMiner.cure");
  assert.equal(pc.getPatientStatus(next.patients, P3), "treated");
  assert.equal(
    pc.getPatientStatus(next.patients, ch1.BAKER_HUSBAND_ID),
    "discovered",
    "Patient 1 was never needed",
  );
});

test("Route B (the explorer): Mushroom first > Patient 3 > Witch for the first time settles the favour on the spot", () => {
  let f = world({ pairs: [["mushroom", 1]] });
  ({ next: f } = go(MINER, f));
  assert.equal(pc.getPatientStatus(f.patients, P3), "examined");
  const { outcome, next } = go(WITCH, f);
  assert.equal(
    outcome.conversation.id,
    "chapter1.tavern.witch.firstWithMushroom",
  );
  assert.equal(count(next, "medicinal-herb"), 1);
  assert.equal(count(next, "mushroom"), 0);
  assert.equal(talk(WITCH, next).effects.length, 0);
});

test("Route C (the collector): both Mushrooms first > one for the soup, one for Witch", () => {
  let f = world({
    pairs: [
      ["mushroom", 1],
      ["mushroom", 1],
      ["water", 1],
      ["salt", 1],
    ],
  });
  assert.equal(count(f, "mushroom"), 2);
  // one goes into the soup (Patient 2's recipe), whenever he likes
  const soup = cr.combine(f.inventory, "fire", ["water", "salt", "mushroom"]);
  assert.equal(soup.kind, "success");
  f = { ...f, inventory: soup.inventory };
  assert.equal(count(f, "mushroom"), 1);
  const { next } = go(WITCH, f);
  assert.equal(count(next, "mushroom"), 0);
  assert.equal(count(next, "medicinal-herb"), 1);
  assert.equal(count(next, "mushroom-soup"), 1);
  // or the other way round: Witch first, then the soup
  const g = apply(
    world({
      pairs: [
        ["mushroom", 2],
        ["water", 1],
        ["salt", 1],
      ],
    }),
    talk(
      WITCH,
      world({
        pairs: [
          ["mushroom", 2],
          ["water", 1],
          ["salt", 1],
        ],
      }),
    ),
  );
  assert.equal(count(g, "mushroom"), 1);
  assert.equal(
    cr.combine(g.inventory, "fire", ["water", "salt", "mushroom"]).kind,
    "success",
  );
});

test("Route D: Patient 3 before Patient 1 (and before Patient 2) is examined and treated all the same", () => {
  let f = world({ p1: "discovered" });
  assert.equal(
    pc.getPatientStatus(f.patients, ch1.BAKER_HUSBAND_ID),
    "discovered",
  );
  ({ next: f } = go(MINER, f));
  f = {
    ...f,
    inventory: stock([
      ["disinfected-bandage", 1],
      ["medicinal-ointment", 1],
    ]),
  };
  ({ next: f } = go(MINER, f));
  assert.equal(pc.getPatientStatus(f.patients, P3), "treated");
  assert.equal(
    pc.getPatientStatus(f.patients, ch1.BAKER_HUSBAND_ID),
    "discovered",
  );
  assert.equal(
    pc.getPatientStatus(f.patients, ch1.TAVERN_PATIENT_ID),
    "hidden",
  );
  // and no gate on patient completion exists in the new resolvers
  const src = fs.readFileSync(
    path.join(root, "src/game/dialogue/storyInteractions.ts"),
    "utf8",
  );
  const witchPart = src.slice(
    src.indexOf("function resolveWitch"),
    src.indexOf("function resolveStoryInteraction") > 0
      ? src.indexOf("// The man on the tavern floor")
      : undefined,
  );
  assert.ok(!/BAKER_HUSBAND_ID|"treated"/.test(witchPart));
});

// ================================================== ASSETS / RUNTIME
test("Witch and her cat are placed exactly as authored and animate with the existing sprite player", () => {
  const tavern = getComposition("tavern-interior", "chapter-1").instances;
  const w = tavern.find(
    (i) => i.instanceId === "tavern-interior-witch-tavern-sitting-01",
  );
  const c = tavern.find(
    (i) => i.instanceId === "tavern-interior-witch-cat-sitting-01",
  );
  assert.deepEqual(w, {
    instanceId: "tavern-interior-witch-tavern-sitting-01",
    assetId: "witch-tavern-sitting",
    x: 246,
    y: 175,
    scale: 1,
    flipX: false,
    colliderEnabled: false,
    zOffset: 0,
  });
  assert.deepEqual(c, {
    instanceId: "tavern-interior-witch-cat-sitting-01",
    assetId: "witch-cat-sitting",
    x: 272,
    y: 130,
    scale: 0.77,
    flipX: false,
    colliderEnabled: false,
    zOffset: 0,
  });
  for (const id of ["witch-tavern-sitting", "witch-cat-sitting"]) {
    const asset = getDecorAsset(id);
    assert.equal(asset.sprite.frames.length, 4);
    assert.ok(
      asset.sprite.fps > 1.7 && asset.sprite.fps < 1.9,
      "~550 ms per frame",
    );
    assert.equal(asset.sprite.loop, true);
    assert.equal(asset.defaultCollider, undefined);
    for (const frame of asset.sprite.frames) {
      assert.ok(fs.existsSync(path.join(root, "public", frame)), frame);
    }
  }
  // the loop 0 > 1 > 2 > 1 is in the files themselves
  const bytes = (p) => fs.readFileSync(path.join(root, "public", p));
  const f = getDecorAsset("witch-tavern-sitting").sprite.frames;
  assert.ok(bytes(f[1]).equals(bytes(f[3])));
  assert.ok(!bytes(f[0]).equals(bytes(f[1])));
  assert.ok(
    getDecorAsset("witch-cat-sitting").sprite.frames[0].includes(
      "sit-idle/east",
    ),
  );
  // the interaction is the Witch's alone
  const interactions = getChapterInteractions("chapter-1");
  assert.equal(interactions[w.instanceId].interactionId, WITCH);
  const resolved = resolveDecorInstances(tavern, interactions);
  assert.equal(
    resolved.colliders.filter((x) => /witch/.test(x.id ?? "")).length,
    0,
  );
  assert.equal(
    resolved.zones.filter((z) => z.interactionId === WITCH).length,
    1,
  );
});

// ================================================== REACHABILITY
const feet = ({ x, y }) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
function reachability(sceneId, arrivalName) {
  const scene = WORLD_SCENES[sceneId];
  const composition = getComposition(sceneId, "chapter-1");
  const resolved = resolveDecorInstances(
    composition?.instances ?? [],
    getChapterInteractions("chapter-1"),
  );
  const W = Math.round(
    scene.visual.assetWidth * scene.visual.logicalUnitsPerAssetPixel,
  );
  const H = Math.round(
    scene.visual.assetHeight * scene.visual.logicalUnitsPerAssetPixel,
  );
  const colliders = [...scene.colliders, ...resolved.colliders];
  const free = (x, y) =>
    x >= 6 &&
    y >= 19 &&
    x <= W &&
    y <= H &&
    !colliders.some((c) => rectsIntersect(feet({ x, y }), c));
  const arrival = scene.arrivals[arrivalName];
  const seen = new Set([`${arrival.x},${arrival.y}`]);
  const queue = [[arrival.x, arrival.y]];
  while (queue.length) {
    const [x, y] = queue.pop();
    for (const [dx, dy] of [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ]) {
      const key = `${x + dx},${y + dy}`;
      if (!seen.has(key) && free(x + dx, y + dy)) {
        seen.add(key);
        queue.push([x + dx, y + dy]);
      }
    }
  }
  const cells = [...seen].map((k) => k.split(",").map(Number));
  return {
    resolved,
    reaches: (zone) =>
      cells.some(([x, y]) => rectsIntersect(feet({ x, y }), zone)),
  };
}

test("everything involved can be reached on foot, with the coordinates as authored", () => {
  const check = (sceneId, arrival, interactionIds) => {
    const { resolved, reaches } = reachability(sceneId, arrival);
    for (const interactionId of interactionIds) {
      const zones = resolved.zones.filter(
        (z) => z.interactionId === interactionId,
      );
      assert.ok(zones.length > 0, `${sceneId}: ${interactionId} has a zone`);
      assert.ok(zones.every(reaches), `${sceneId}: ${interactionId} reachable`);
    }
    return resolved;
  };
  check("tavern-interior", "from-tavern-street", [
    WITCH,
    BARTENDER,
    "chapter1.tavern.sickPatient",
  ]);
  const mine = check("mine-interior", "from-mountain-path", [
    MINER,
    "collect.mushroom",
  ]);
  assert.equal(
    mine.zones.filter((z) => z.interactionId === "collect.mushroom").length,
    2,
  );
  check("mine-interior", "from-mine-natural-cave", [MINER, "collect.mushroom"]);
  check("mountain-path", "from-smithy-street", [MOUNTAIN]);
});

console.log(`\n${passed} tests passed`);
