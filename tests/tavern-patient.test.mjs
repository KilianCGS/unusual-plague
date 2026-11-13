// Patient 2 (the man on the tavern floor): the case, the in-place examination,
// the two recipes, the Empty jar, the orange group, the trades (milk, honey,
// jar), the treatment, the "!" and the reachability of everything involved.
//   node tests/tavern-patient.test.mjs
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

const inv = at("src/game/inventory/inventory.ts");
const pc = at("src/game/patients/patientCases.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");
const cr = at("src/game/crafting/crafting.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const { NPC_TRADES } = at("src/game/dialogue/npcTrades.ts");
const { getItem, getItemName } = at("src/game/items/items.ts");
const { AILMENTS } = at("src/game/book/ailments.ts");
const book = at("src/game/book/bookPages.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { getComposition, getChapterInteractions } = at(
  "src/game/compositions/index.ts",
);
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);
const { rectsIntersect } = at("src/game/collision.ts");
const { findAvailableInteraction } = at(
  "src/game/interactions/interactionZone.ts",
);
const { collectBarkCopy } = at("src/game/i18n/items.ts");
const { chapter1AmbientDialogues } = at(
  "src/game/dialogue/chapter1Dialogues.ts",
);

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const P2 = ch1.TAVERN_PATIENT_ID;
const DEF = ch1.CHAPTER1_PATIENTS[P2];
const BARTENDER = "chapter1.tavern.bartender";
const PATIENT = "chapter1.tavern.sickPatient";
const FARM = "chapter1.farm.woman";
const BEE = "chapter1.mill.beekeeper";
const stock = (pairs) =>
  pairs.reduce(
    (s, [id, q]) => inv.addItem(s, id, q),
    inv.createEmptyInventory(),
  );
const state = (status, baker = "treated") => ({
  [ch1.BAKER_HUSBAND_ID]: baker,
  ...(status === "hidden" ? {} : { [P2]: status }),
});
const facts = (status, pairs = [], claimed = []) => ({
  patients: state(status),
  inventory: stock(pairs),
  claimedRewards: new Set(claimed),
});
const talk = (id, f, language = "es") =>
  story.resolveStoryInteraction(id, f, language, "subject");

// What GameWorld.applyStoryEffects does, all or nothing, on plain data.
function apply(f, effects) {
  let inventory = f.inventory;
  let patients = f.patients;
  let claimed = new Set(f.claimedRewards);

  for (const effect of effects) {
    if (effect.type === "give-item") {
      inventory = inv.addItem(inventory, effect.itemId, effect.quantity);
    } else if (effect.type === "take-item") {
      inventory = inv.removeItem(inventory, effect.itemId, effect.quantity);
    } else if (effect.type === "claim-reward") {
      claimed = new Set([...claimed, effect.rewardId]);
    } else if (effect.type === "advance-patient") {
      patients = pc.advancePatient(patients, effect.patientId, effect.to);
    } else if (effect.type === "treat") {
      const result = pc.treatPatient(
        patients,
        ch1.CHAPTER1_PATIENTS[effect.patientId],
        inventory,
      );
      if (!result) return null;
      patients = result.state;
      inventory = result.inventory;
    }
    if (!inventory) return null;
  }

  return { patients, inventory, claimedRewards: claimed };
}
const count = (f, id) => inv.countItem(f.inventory, id);

// ------------------------------------------------------------ THE CASE
test("1-2. Patient 2 exists as a normal case: stomach ailment, both treatments, starts hidden", () => {
  assert.equal(P2, "tavern-patient");
  assert.ok(DEF);
  assert.equal(DEF.ailmentId, "stomach-ailment");
  assert.ok(AILMENTS.some((a) => a.id === "stomach-ailment"));
  assert.deepEqual(DEF.requiredTreatments, [
    { itemId: "mushroom-soup", quantity: 1 },
    { itemId: "milk-with-honey", quantity: 1 },
  ]);
  assert.equal(DEF.examination, "in-place");
  assert.equal(
    ch1.CHAPTER1_PATIENTS[ch1.BAKER_HUSBAND_ID].examination,
    undefined,
    "Patient 1 keeps the narrative examination (the default)",
  );
  assert.equal(
    pc.getPatientStatus(ch1.CHAPTER1_INITIAL_PATIENTS, P2),
    "hidden",
  );
  assert.deepEqual(pc.getVisiblePatientIds(ch1.CHAPTER1_INITIAL_PATIENTS), [
    ch1.BAKER_HUSBAND_ID,
  ]);
  // the ambient sprite is still the placed instance (asset and place unchanged)
  const tavern = getComposition("tavern-interior", "chapter-1");
  const placed = tavern.instances.find(
    (i) => i.instanceId === ch1.TAVERN_PATIENT_INSTANCE_ID,
  );
  assert.equal(placed.assetId, "tavern-patient-sick");
  assert.deepEqual([placed.x, placed.y], [375, 180]);
});

test("3-5. the bartender introduces the case, then follows it; the patient is examined IN PLACE", () => {
  // the bartender: noticing the case only moves it to discovered
  const intro = talk(BARTENDER, facts("hidden"));
  assert.equal(intro.conversation.id, "chapter1.tavern.bartender.intro");
  assert.deepEqual(intro.effects, [
    { type: "advance-patient", patientId: P2, to: "discovered" },
  ]);
  const noticed = apply(facts("hidden"), intro.effects);
  assert.equal(pc.getPatientStatus(noticed.patients, P2), "discovered");
  assert.equal(
    talk(BARTENDER, facts("discovered")).conversation.id,
    "chapter1.tavern.bartender.waiting",
  );
  assert.equal(
    talk(BARTENDER, facts("examined", [], [ch1.TAVERN_JAR_REWARD_ID]))
      .conversation.id,
    "chapter1.tavern.bartender.during",
  );
  assert.equal(
    talk(BARTENDER, facts("treated")).conversation.id,
    "chapter1.tavern.bartender.after",
  );
  // the bartender never receives anything; after the intro his only effect is
  // handing over the jar (see test 11)
  for (const status of ["discovered", "examined", "treated"]) {
    const effects = talk(
      BARTENDER,
      facts(status, [], [ch1.TAVERN_JAR_REWARD_ID]),
    ).effects;
    assert.deepEqual(effects, []);
  }

  // the patient: examined where he lies, even if nobody pointed him out
  for (const status of ["hidden", "discovered"]) {
    const exam = talk(PATIENT, facts(status));
    assert.equal(exam.conversation.id, "chapter1.tavern.sickPatient.exam");
    assert.equal(exam.after, "examine-in-place");
    assert.equal(exam.patientId, P2);
    assert.deepEqual(exam.effects, []);
  }
  // no scene change: the in-place examination never starts a transition
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes('definition.examination === "in-place"'));
  assert.ok(/inPlace\s*\?\s*null/.test(game), "no thoughts, no way back");
  assert.ok(/else if \(!inPlace\)/.test(game), "transition only if narrative");
  assert.ok(game.includes("examiningPatientRef"));
  // ... and the examination moves a case that was never announced
  assert.ok(game.includes('"discovered"') && game.includes('"examined"'));
});

test("5-6. examining reveals BOTH recipes through revealsRecipeIds, nothing globally", () => {
  assert.deepEqual(DEF.revealsRecipeIds, [
    "fire.mushroom-soup",
    "fire.milk-with-honey",
  ]);
  for (const id of DEF.revealsRecipeIds)
    assert.ok(
      RECIPES.some((r) => r.id === id),
      id,
    );
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("definition.revealsRecipeIds"));
  // the Book shows both once known, and the patient with the stomach ailment
  const context = (language) => ({
    language,
    patients: state("examined"),
    inventory: stock([]),
    knownRecipeIds: new Set(DEF.revealsRecipeIds),
  });
  const texts = (language) =>
    book
      .buildBookSections(context(language))
      .flatMap((section) => section.spreads)
      .flatMap((spread) => spread.texts ?? [])
      .map((t) => t.content.join(""))
      .join(" | ")
      .toUpperCase();
  assert.ok(texts("es").includes("SOPA LIGERA"));
  assert.ok(texts("es").includes("LECHE CON MIEL"));
  assert.ok(texts("en").includes("LIGHT SOUP"));
  assert.ok(texts("en").includes("MILK WITH HONEY"));
  assert.ok(!texts("es").includes("SOPA DE HONGOS"));
  assert.ok(texts("es").includes(DEF.name.es.toUpperCase()));
});

// ------------------------------------------------------------ RECIPES / ITEMS
test("7-9. the soup keeps its ids but is shown as Sopa ligera / Light soup; Milk with honey is a real fire recipe", () => {
  assert.equal(getItemName("mushroom-soup", "es"), "Sopa ligera");
  assert.equal(getItemName("mushroom-soup", "en"), "Light soup");
  assert.equal(getItem("mushroom-soup").id, "mushroom-soup");
  assert.equal(
    RECIPES.filter((r) => r.output.itemId === "mushroom-soup").length,
    1,
  );
  const soup = RECIPES.find((r) => r.id === "fire.mushroom-soup");
  assert.equal(soup.station, "fire");
  assert.deepEqual(
    soup.inputs.map((i) => [i.itemId, i.quantity]),
    [
      ["water", 1],
      ["salt", 1],
      ["mushroom", 1],
    ],
  );
  const milk = RECIPES.find((r) => r.id === "fire.milk-with-honey");
  assert.equal(milk.station, "fire");
  assert.deepEqual(
    milk.inputs.map((i) => [i.itemId, i.quantity]),
    [
      ["milk", 1],
      ["honey", 1],
    ],
  );
  assert.deepEqual(milk.output, { itemId: "milk-with-honey", quantity: 1 });
  assert.equal(getItemName("milk-with-honey", "es"), "Leche con miel");
  assert.equal(getItemName("milk-with-honey", "en"), "Milk with honey");
  // no visible "Sopa de hongos" / "Mushroom soup" is left in the game
  for (const file of [
    "src/game/items/items.ts",
    "src/game/book/ailments.ts",
    "src/game/i18n/items.ts",
    "src/game/dialogue/chapter1TavernDialogues.ts",
  ]) {
    assert.ok(!/Sopa de hongos|Mushroom soup/.test(read(file)), file);
  }
});

test("crafting Milk with honey: right station, consumes both, adds the result, nothing lost on failure", () => {
  const milkRecipe = RECIPES.find((r) => r.id === "fire.milk-with-honey");
  const ingredients = [
    { itemId: "milk", quantity: 1 },
    { itemId: "honey", quantity: 1 },
  ];
  assert.equal(cr.findMatchingRecipe("fire", ingredients)?.id, milkRecipe.id);
  assert.equal(cr.findMatchingRecipe("manual", ingredients), null);
  const before = stock([
    ["milk", 1],
    ["honey", 1],
  ]);
  const made = cr.combine(before, "fire", ["milk", "honey", null]);
  assert.equal(made.kind, "success");
  assert.equal(inv.countItem(made.inventory, "milk"), 0);
  assert.equal(inv.countItem(made.inventory, "honey"), 0);
  assert.equal(inv.countItem(made.inventory, "milk-with-honey"), 1);
  // a full pocket is not a problem: the two inputs free their slots
  const full = stock([
    ["milk", 1],
    ["honey", 1],
    ["cloth", 1],
    ["salt", 1],
    ["coal", 1],
  ]);
  assert.equal(
    cr.combine(full, "fire", ["milk", "honey", null]).kind,
    "success",
  );
  // a missing ingredient consumes nothing
  const lacking = stock([["milk", 1]]);
  assert.equal(
    cr.combine(lacking, "fire", ["milk", "honey", null]).kind,
    "no-recipe",
  );
  assert.equal(inv.countItem(lacking, "milk"), 1);
});

test("10. the Empty jar is a normal catalog item with its existing icon", () => {
  const jar = getItem("empty-jar");
  assert.equal(jar.name.es, "Jarra vacía");
  assert.equal(jar.name.en, "Empty jar");
  assert.equal(jar.container, undefined, "no special container mechanic");
  assert.equal(jar.icon, "/game/items/inventory-icons/empty-jar.png");
  assert.ok(fs.existsSync(path.join(root, "public", jar.icon)));
});

// ------------------------------------------------------------ THE JAR
test("11. the BARTENDER hands over the jar: not before the examination, once, nothing lost with a full pocket", () => {
  // before the examination he only introduces / follows the case: no jar
  for (const status of ["hidden", "discovered"]) {
    const outcome = talk(BARTENDER, facts(status));
    assert.ok(
      !outcome.effects.some((e) => e.type === "give-item"),
      `${status}: no jar`,
    );
  }
  // after the examination: the jar, with the conversation of the milk
  const first = talk(BARTENDER, facts("examined"));
  assert.equal(first.conversation.id, "chapter1.tavern.bartender.jar");
  assert.deepEqual(first.effects, [
    { type: "give-item", itemId: "empty-jar", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.TAVERN_JAR_REWARD_ID },
  ]);
  const done = apply(facts("examined"), first.effects);
  assert.equal(count(done, "empty-jar"), 1);
  // never again: his usual "during" conversation, no second jar (even if the
  // first one was already traded away)
  const again = talk(BARTENDER, { ...done, inventory: stock([]) });
  assert.equal(again.conversation.id, "chapter1.tavern.bartender.during");
  assert.deepEqual(again.effects, []);
  // a full pocket: nothing is given, nothing is claimed
  const crowded = facts("examined", [
    ["cloth", 1],
    ["salt", 1],
    ["alcohol", 1],
    ["water", 1],
    ["mushroom", 1],
    ["orange", 1],
  ]);
  const blocked = talk(BARTENDER, crowded);
  assert.equal(blocked.conversation.id, "chapter1.tavern.bartender.jarNoRoom");
  assert.deepEqual(blocked.effects, []);
  // ... and it can be retried once there is room
  const retried = talk(BARTENDER, {
    ...crowded,
    inventory: inv.removeItem(crowded.inventory, "cloth", 1),
  });
  assert.equal(retried.conversation.id, "chapter1.tavern.bartender.jar");
  assert.equal(retried.effects.length, 2);
  // after the treatment: the closing conversation, no jar
  const closing = talk(BARTENDER, facts("treated"));
  assert.equal(closing.conversation.id, "chapter1.tavern.bartender.after");
  assert.deepEqual(closing.effects, []);
});

test("11b. there is NO physical jar: no take.empty-jar anywhere, no tavern interaction zone, no tavern interactions file", () => {
  assert.deepEqual(getSceneInteractionZones("tavern-interior"), []);
  assert.ok(
    !fs.existsSync(
      path.join(root, "src/game/tavern-interior/tavernInteriorInteractions.ts"),
    ),
  );
  for (const file of [
    "src/game/dialogue/npcTrades.ts",
    "src/game/dialogue/storyInteractions.ts",
    "src/game/interactions/sceneInteractions.ts",
    "src/game/tavern-interior/tavernInteriorGeometry.ts",
    "src/game/compositions/chapter-1.interactions.ts",
  ]) {
    assert.ok(!read(file).includes("take.empty-jar"), file);
  }
  assert.equal(talk("take.empty-jar", facts("examined")), null);
  assert.equal(NPC_TRADES["take.empty-jar"], undefined);
});

// ------------------------------------------------------------ ORANGES
test("12-15. ONE orange branch gives Orange x3 in one slot; the second branch stays as decoration", () => {
  const collectible = getDecorAsset("orange-world");
  assert.equal(collectible.collectibleItemId, "orange");
  assert.equal(collectible.collectibleQuantity, 3);
  const ambient = getDecorAsset("orange-world-ambient");
  assert.equal(ambient.collectibleItemId, undefined);
  assert.deepEqual(ambient.sprite, collectible.sprite, "same art");
  const composition = getComposition("mill-farmland", "chapter-1");
  const one = composition.instances.find(
    (i) => i.instanceId === "mill-farmland-orange-world-01",
  );
  const two = composition.instances.find(
    (i) => i.instanceId === "mill-farmland-orange-world-02",
  );
  assert.equal(one.assetId, "orange-world");
  assert.deepEqual([one.x, one.y], [860, 483], "the group stays where it was");
  assert.equal(two.assetId, "orange-world-ambient");
  assert.deepEqual([two.x, two.y], [1844, 872], "and so does the other branch");
  const resolved = resolveDecorInstances(
    composition.instances,
    getChapterInteractions("chapter-1"),
  );
  // both are still DRAWN, only one can be picked up, and it gives three
  assert.ok(
    resolved.sprites.some((s) => s.instance.instanceId === two.instanceId),
  );
  const orangeZones = resolved.zones.filter(
    (z) => z.interactionId === "collect.orange",
  );
  assert.equal(orangeZones.length, 1);
  assert.equal(resolved.zoneInstanceIds.get(orangeZones[0].id), one.instanceId);
  assert.equal(resolved.zoneItemQuantities.get(orangeZones[0].id), 3);
  // after the pick-up the group is gone and nothing else gives oranges
  const collected = resolveDecorInstances(
    composition.instances,
    getChapterInteractions("chapter-1"),
    new Set([one.instanceId]),
  );
  assert.equal(
    collected.zones.filter((z) => z.interactionId === "collect.orange").length,
    0,
  );
  // one slot
  const got = inv.addItem(inv.createEmptyInventory(), "orange", 3);
  assert.equal(inv.countOccupiedSlots(got), 1);
  assert.equal(inv.countItem(got, "orange"), 3);
  // the pick-up path uses the quantity and gives the group's remark
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("source.quantity ?? 1"));
  assert.ok(game.includes("collectBarkCopy"));
  assert.equal(
    collectBarkCopy.es.orange,
    "Tres de una vez. Me ahorro unas palabras con el agricultor.",
  );
  assert.equal(
    collectBarkCopy.en.orange,
    "Three at once. Saves me a few words with the farmer.",
  );
  // the other collectibles still give one
  for (const asset of ["mushroom-world", "medicinal-herb-dev"]) {
    assert.equal(getDecorAsset(asset).collectibleQuantity, undefined, asset);
  }
});

test("12b. the orange group goes through the REAL runtime path: sprite -> collectible zone -> [E] available -> item and quantity -> collected -> gone", () => {
  const composition = getComposition("mill-farmland", "chapter-1");
  const interactions = getChapterInteractions("chapter-1");
  const resolved = resolveDecorInstances(composition.instances, interactions);
  const scene = WORLD_SCENES["mill-farmland"];
  const one = "mill-farmland-orange-world-01";
  const two = "mill-farmland-orange-world-02";
  // the visible sprites, both, with the authored positions
  const sprite = (id) =>
    resolved.sprites.find((s) => s.instance.instanceId === id);
  assert.deepEqual(
    [sprite(one).instance.x, sprite(one).instance.y],
    [860, 483],
  );
  assert.deepEqual(
    [sprite(two).instance.x, sprite(two).instance.y],
    [1844, 872],
  );
  assert.equal(sprite(one).asset.collectibleItemId, "orange");
  assert.equal(sprite(two).asset.collectibleItemId, undefined);
  // the scene builds its zones exactly like ExteriorScene: scene zones, then decor
  const zones = [
    ...getSceneInteractionZones("mill-farmland"),
    ...resolved.zones,
  ];
  const feet = (x, y) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
  const colliders = [...scene.colliders, ...resolved.colliders];
  const standable = (x, y) =>
    !colliders.some((c) => rectsIntersect(feet(x, y), c));
  // the Doctor standing on / around the sprite of the main group gets [E] ...
  const spots = [
    [860, 500],
    [847, 501],
    [840, 470],
    [900, 530],
  ].filter(([x, y]) => standable(x, y));
  assert.ok(spots.length >= 3, "he can really stand there");
  for (const [x, y] of spots) {
    const zone = findAvailableInteraction(zones, feet(x, y), "south");
    assert.equal(zone?.interactionId, "collect.orange", `${x},${y}`);
    assert.equal(resolved.zoneInstanceIds.get(zone.id), one);
    // what the scene reports to GameWorld on E: the item and the quantity
    assert.equal(resolved.zoneItemIds.get(zone.id), "orange");
    assert.equal(resolved.zoneItemQuantities.get(zone.id), 3);
  }
  // ... and around the ambient branch he gets nothing
  for (const [x, y] of [
    [1844, 880],
    [1830, 872],
    [1860, 860],
  ]) {
    // (the beekeeper's own zone may reach there: it is not an orange)
    assert.notEqual(
      findAvailableInteraction(zones, feet(x, y), "south")?.interactionId,
      "collect.orange",
    );
  }
  assert.ok(
    !resolved.zones.some((z) => resolved.zoneInstanceIds.get(z.id) === two),
  );
  // one pick-up: it is gone, the ambient branch stays drawn, nothing else gives oranges
  const afterPick = resolveDecorInstances(
    composition.instances,
    interactions,
    new Set([one]),
  );
  assert.ok(!afterPick.sprites.some((s) => s.instance.instanceId === one));
  assert.ok(afterPick.sprites.some((s) => s.instance.instanceId === two));
  assert.equal(
    findAvailableInteraction(
      [...getSceneInteractionZones("mill-farmland"), ...afterPick.zones],
      feet(860, 500),
      "south",
    ),
    null,
  );
  // GameWorld is what turns the zone report into the pick-up: quantity, one slot, bark
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("if (source.itemId && source.instanceId)"));
  assert.ok(game.includes("source.quantity ?? 1"));
  assert.ok(game.includes("markCollected(current, source.instanceId!)"));
});

const farmFacts = (pairs, claimed = []) =>
  facts("examined", pairs, [ch1.FARM_WOMAN_INTRO_ID, ...claimed]);

test("16a. the farm woman PRESENTS the deal first: ambient before the examination, then one introduction, then the contextual trade", () => {
  const INTRO = ch1.FARM_WOMAN_INTRO_ID;
  // before the examination: her ambient talk, no introduction
  for (const status of ["hidden", "discovered"]) {
    assert.equal(talk(FARM, facts(status)), null);
  }
  const lines = (outcome) => outcome.conversation.lines.map((l) => l.text);
  // first relevant conversation: the introduction, whatever he carries
  for (const pairs of [
    [],
    [["orange", 1]],
    [
      ["orange", 1],
      ["empty-jar", 1],
    ],
  ]) {
    const first = talk(FARM, facts("examined", pairs));
    assert.match(first.conversation.id, /^chapter1\.farm\.woman\.intro/);
    assert.deepEqual(
      first.effects,
      [{ type: "claim-reward", rewardId: INTRO }],
      "it only remembers that she spoke: nothing is traded",
    );
  }
  // without the jar she says he needs a container; with it she recognises it
  const empty = talk(FARM, facts("examined"));
  assert.equal(empty.conversation.id, "chapter1.farm.woman.intro");
  assert.deepEqual(lines(empty), [
    "Necesito un poco de leche para un enfermo, si puede ser.",
    "Puedo darle un poco, claro. Si va hacia los frutales, tráigame una naranja: llevo todo el día soñando con una.",
    "Y necesitará algo donde llevársela.",
  ]);
  const withJar = talk(FARM, facts("examined", [["empty-jar", 1]]));
  assert.equal(withJar.conversation.id, "chapter1.farm.woman.introWithJar");
  assert.equal(lines(withJar)[2], "Esa jarra servirá para llevársela.");
  assert.ok(
    !lines(withJar).some((t) => /algo donde|buscar/.test(t)),
    "she never asks for a container he is already carrying",
  );
  const en = talk(FARM, facts("examined"), "en");
  assert.equal(
    en.conversation.lines[0].text,
    "I need a little milk for a sick man, if possible.",
  );
  assert.equal(
    talk(FARM, facts("examined", [["empty-jar", 1]]), "en").conversation
      .lines[2].text,
    "That jar will do to carry it.",
  );
  // the flag is the memory: applied once, the introduction never comes back
  const met = apply(facts("examined", [["empty-jar", 1]]), withJar.effects);
  assert.ok(met.claimedRewards.has(INTRO));
  assert.equal(count(met, "empty-jar"), 1, "the jar is not taken");
  assert.equal(
    talk(FARM, met).conversation.id,
    "chapter1.farm.woman.missingOranges",
  );
  // after the introduction: missing both / jar / oranges / ready
  const after = (pairs) => talk(FARM, farmFacts(pairs)).conversation.id;
  assert.equal(after([]), "chapter1.farm.woman.missing");
  assert.equal(after([["orange", 1]]), "chapter1.farm.woman.missingJar");
  assert.equal(after([["empty-jar", 1]]), "chapter1.farm.woman.missingOranges");
  assert.equal(
    after([
      ["orange", 1],
      ["empty-jar", 1],
    ]),
    "chapter1.farm.woman.ready",
  );
  // her reminder does not repeat the Doctor's request
  assert.ok(
    talk(FARM, farmFacts([])).conversation.lines.every(
      (l) => !/Necesito/.test(l.text),
    ),
  );
  // trade done: the later conversation, and it does not repeat the introduction
  const done = talk(FARM, farmFacts([], [ch1.FARM_MILK_REWARD_ID]));
  assert.equal(done.conversation.id, "chapter1.farm.woman.done");
  assert.deepEqual(done.effects, []);
  // the introduction state is session-claimed like the other one-shot flags
  assert.ok(!NPC_TRADES[FARM].rewardId.includes("Intro"));
});

// ------------------------------------------------------------ THE FARM WOMAN
test("16-18. the farm woman trades Orange x1 + Empty jar for Milk x1: exact, atomic, once", () => {
  // before the case is examined she is only the ambient farm woman
  assert.equal(talk(FARM, facts("hidden")), null);
  assert.equal(talk(FARM, facts("discovered")), null);
  assert.ok(chapter1AmbientDialogues[FARM], "her ambient conversation stays");

  const ids = (pairs) => talk(FARM, farmFacts(pairs)).conversation.id;
  assert.equal(ids([]), "chapter1.farm.woman.missing");
  assert.equal(ids([["orange", 1]]), "chapter1.farm.woman.missingJar");
  assert.equal(ids([["empty-jar", 1]]), "chapter1.farm.woman.missingOranges");
  for (const pairs of [[], [["orange", 1]], [["empty-jar", 1]]]) {
    assert.deepEqual(talk(FARM, farmFacts(pairs)).effects, []);
  }

  const have = farmFacts([
    ["orange", 1],
    ["empty-jar", 1],
    ["water", 1],
  ]);
  const ready = talk(FARM, have);
  assert.equal(ready.conversation.id, "chapter1.farm.woman.ready");
  assert.deepEqual(ready.effects, [
    { type: "take-item", itemId: "orange", quantity: 1 },
    { type: "take-item", itemId: "empty-jar", quantity: 1 },
    { type: "give-item", itemId: "milk", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.FARM_MILK_REWARD_ID },
  ]);
  const traded = apply(have, ready.effects);
  assert.equal(count(traded, "orange"), 0);
  assert.equal(count(traded, "empty-jar"), 0);
  assert.equal(count(traded, "milk"), 1);
  assert.equal(count(traded, "water"), 1, "nothing else is touched");
  // never twice: even with a second set of goods she gives nothing more
  const richer = {
    ...traded,
    inventory: stock([
      ["orange", 1],
      ["empty-jar", 1],
    ]),
  };
  const second = talk(FARM, richer);
  assert.equal(second.conversation.id, "chapter1.farm.woman.done");
  assert.deepEqual(second.effects, []);
  // extra oranges are not taken: only exactly one
  const spare = talk(
    FARM,
    farmFacts([
      ["orange", 4],
      ["empty-jar", 1],
    ]),
  );
  assert.equal(
    apply(
      farmFacts([
        ["orange", 4],
        ["empty-jar", 1],
      ]),
      spare.effects,
    ).inventory.slots.find((s) => s?.itemId === "orange").quantity,
    3,
  );
});

test("the generic trade is ATOMIC: no room means no payment taken and nothing marked as done", () => {
  // a trade whose goods need a NEW slot while the payment does not free one
  const trade = {
    interactionId: "test.trade",
    rewardId: "test.reward",
    consumes: [{ itemId: "orange", quantity: 1 }],
    grants: [{ itemId: "milk", quantity: 1 }],
    ready: { id: "t.ready", lines: [] },
    noRoom: { id: "t.noRoom", lines: [] },
  };
  const crowded = {
    patients: state("examined"),
    inventory: stock([
      ["orange", 2], // stays after paying one
      ["cloth", 1],
      ["salt", 1],
      ["coal", 1],
      ["alcohol", 1],
      ["mushroom", 1],
    ]),
    claimedRewards: new Set(),
  };
  const blocked = story.resolveTrade(trade, crowded, "es", "s");
  assert.equal(blocked.conversation.id, "t.noRoom");
  assert.deepEqual(blocked.effects, [], "nothing is taken");
  // the same trade with one more free slot goes through; payment first
  const roomy = {
    ...crowded,
    inventory: inv.removeItem(crowded.inventory, "cloth", 1),
  };
  const ok = story.resolveTrade(trade, roomy, "es", "s");
  assert.deepEqual(
    ok.effects.map((e) => e.type),
    ["take-item", "give-item", "claim-reward"],
  );
  // and when the payment itself frees the slot (the real milk trade), it fits
  const pocket = {
    patients: state("examined"),
    inventory: stock([
      ["orange", 1],
      ["empty-jar", 1],
      ["cloth", 1],
      ["salt", 1],
      ["coal", 1],
      ["mushroom", 1],
    ]),
    claimedRewards: new Set([ch1.FARM_WOMAN_INTRO_ID]),
  };
  assert.equal(inv.canAddItem(pocket.inventory, "milk"), false);
  const milk = talk(FARM, pocket);
  assert.equal(milk.conversation.id, "chapter1.farm.woman.ready");
  assert.equal(count(apply(pocket, milk.effects), "milk"), 1);
  // GameWorld applies the effects on copies and commits only at the end
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("all or nothing"));
  assert.ok(/if \(!removed\) \{\s*return false;/.test(game));
});

// ------------------------------------------------------------ THE BEEKEEPER
test("19-20. the beekeeper gives Honey x1 once, only while the case is examined; a full pocket loses nothing", () => {
  assert.equal(talk(BEE, facts("hidden")), null);
  assert.ok(chapter1AmbientDialogues[BEE], "ambient before the case");
  const ready = talk(BEE, facts("examined"));
  assert.equal(ready.conversation.id, "chapter1.mill.beekeeper.ready");
  assert.deepEqual(ready.effects, [
    { type: "give-item", itemId: "honey", quantity: 1 },
    { type: "claim-reward", rewardId: ch1.BEEKEEPER_HONEY_REWARD_ID },
  ]);
  const done = apply(facts("examined"), ready.effects);
  assert.equal(count(done, "honey"), 1);
  assert.equal(inv.countOccupiedSlots(done.inventory), 1);
  const again = talk(BEE, done);
  assert.equal(again.conversation.id, "chapter1.mill.beekeeper.done");
  assert.deepEqual(again.effects, []);
  // inventory full: not delivered, not claimed, comes back with room
  const crowded = facts("examined", [
    ["cloth", 1],
    ["salt", 1],
    ["coal", 1],
    ["alcohol", 1],
    ["mushroom", 1],
    ["orange", 1],
  ]);
  const blocked = talk(BEE, crowded);
  assert.equal(blocked.conversation.id, "chapter1.mill.beekeeper.noRoom");
  assert.deepEqual(blocked.effects, []);
  const retry = talk(BEE, {
    ...crowded,
    inventory: inv.removeItem(crowded.inventory, "salt", 1),
  });
  assert.equal(retry.conversation.id, "chapter1.mill.beekeeper.ready");
  // the interaction is the one the Decorator table names
  assert.equal(
    getChapterInteractions("chapter-1")["mill-farmland-beekeeper-01"]
      .interactionId,
    BEE,
  );
});

test("the trades are independent: any order works after the examination", () => {
  let f = facts("examined", [
    ["empty-jar", 1],
    ["orange", 1],
  ]);
  f = apply(f, talk(BEE, f).effects);
  f = apply(f, talk(FARM, f).effects); // she introduces the deal first
  f = apply(f, talk(FARM, f).effects);
  assert.equal(count(f, "honey"), 1);
  assert.equal(count(f, "milk"), 1);
  // honey first and milk first give the same result
  let g = facts("examined", [
    ["empty-jar", 1],
    ["orange", 1],
  ]);
  g = apply(g, talk(FARM, g).effects); // the introduction
  g = apply(g, talk(FARM, g).effects);
  g = apply(g, talk(BEE, g).effects);
  assert.deepEqual(
    [count(g, "honey"), count(g, "milk")],
    [count(f, "honey"), count(f, "milk")],
  );
});

// ------------------------------------------------------------ TREATMENT
test("21-24. he is treated only with BOTH preparations; both are consumed; once", () => {
  const waiting = (pairs) => talk(PATIENT, facts("examined", pairs));
  const bothMissing = waiting([]);
  assert.equal(
    bothMissing.conversation.id,
    "chapter1.tavern.sickPatient.waiting.all",
  );
  assert.equal(
    waiting([["mushroom-soup", 1]]).conversation.id,
    "chapter1.tavern.sickPatient.waiting.milk",
  );
  assert.equal(
    waiting([["milk-with-honey", 1]]).conversation.id,
    "chapter1.tavern.sickPatient.waiting.soup",
  );
  for (const pairs of [[], [["mushroom-soup", 1]], [["milk-with-honey", 1]]]) {
    assert.deepEqual(waiting(pairs).effects, []);
    assert.equal(pc.isTreatable(state("examined"), DEF, stock(pairs)), false);
  }
  const both = facts("examined", [
    ["mushroom-soup", 1],
    ["milk-with-honey", 1],
    ["water", 1],
  ]);
  const cure = talk(PATIENT, both);
  assert.equal(cure.conversation.id, "chapter1.tavern.sickPatient.cure");
  assert.deepEqual(cure.effects, [{ type: "treat", patientId: P2 }]);
  const treated = apply(both, cure.effects);
  assert.equal(pc.getPatientStatus(treated.patients, P2), "treated");
  assert.equal(count(treated, "mushroom-soup"), 0);
  assert.equal(count(treated, "milk-with-honey"), 0);
  assert.equal(count(treated, "water"), 1, "nothing else is consumed");
  // no second treatment, a different conversation, and nothing is consumed
  const spare = {
    ...treated,
    inventory: stock([
      ["mushroom-soup", 1],
      ["milk-with-honey", 1],
    ]),
  };
  const after = talk(PATIENT, spare);
  assert.equal(after.conversation.id, "chapter1.tavern.sickPatient.after");
  assert.deepEqual(after.effects, []);
  assert.equal(pc.treatPatient(spare.patients, DEF, spare.inventory), null);
  // no material reward is invented
  assert.equal(ch1.CHAPTER1_PATIENT_REWARDS[P2], undefined);
});

// ------------------------------------------------------------ ATTENTION
test('25. the "!" follows what can progress and then goes away', () => {
  const ids = (status, pairs = [], claimed = []) =>
    [
      ...ch1.getAttentionInstanceIds(
        state(status),
        // (the baker's thank-you was received: no "!" on her)
        new Set([
          ...claimed,
          ch1.BAKER_SALT_REWARD_ID,
          // carrying the jar means the bartender already handed it over
          ...(pairs.some(([id]) => id === "empty-jar")
            ? [ch1.TAVERN_JAR_REWARD_ID]
            : []),
        ]),
        stock(pairs),
      ),
    ]
      // (the injured miner's markers belong to Patient 3: patient3.test.mjs)
      .filter(
        (id) =>
          id !== ch1.INJURED_MINER_INSTANCE_ID &&
          id !== ch1.MOUNTAIN_MINER_INSTANCE_ID,
      )
      .sort();
  const BART = ch1.TAVERN_BARTENDER_INSTANCE_ID;
  const MAN = ch1.TAVERN_PATIENT_INSTANCE_ID;
  const WOMAN = ch1.FARM_WOMAN_INSTANCE_ID;
  const BEEK = ch1.BEEKEEPER_INSTANCE_ID;
  assert.deepEqual(ids("hidden"), [BART]);
  assert.deepEqual(ids("discovered"), [MAN]);
  // examined: the bartender still has the jar and the beekeeper the honey; the
  // man waits for both preparations
  assert.deepEqual(ids("examined"), [BART, BEEK].sort());
  assert.deepEqual(
    ids("examined", [
      ["orange", 1],
      ["empty-jar", 1],
    ]),
    [WOMAN, BEEK].sort(),
  );
  assert.deepEqual(
    ids("examined", [["empty-jar", 1]]),
    [BEEK],
    "the jar alone is not enough: she also wants the orange",
  );
  assert.deepEqual(
    ids("examined", [
      ["mushroom-soup", 1],
      ["milk-with-honey", 1],
    ]),
    [MAN, BART, BEEK].sort(),
  );
  assert.deepEqual(
    ids("examined", [["mushroom-soup", 1]]),
    [BART, BEEK].sort(),
  );
  // the jar handed over: the bartender's "!" is gone
  assert.deepEqual(ids("examined", [], [ch1.TAVERN_JAR_REWARD_ID]), [BEEK]);
  // honey delivered, milk traded: each "!" is gone
  assert.deepEqual(
    ids(
      "examined",
      [
        ["orange", 1],
        ["empty-jar", 1],
      ],
      [ch1.BEEKEEPER_HONEY_REWARD_ID],
    ),
    [WOMAN],
  );
  assert.deepEqual(
    ids(
      "examined",
      [
        ["orange", 1],
        ["empty-jar", 1],
      ],
      [ch1.BEEKEEPER_HONEY_REWARD_ID, ch1.FARM_MILK_REWARD_ID],
    ),
    [],
  );
  // treated: nothing on the tavern case at all
  assert.deepEqual(ids("treated"), []);
  // Patient 1 is unchanged: the baker's "!" while discovered
  const baker = ch1.getAttentionInstanceIds(
    { [ch1.BAKER_HUSBAND_ID]: "discovered", [P2]: "treated" },
    new Set(),
    stock([]),
  );
  // (the injured miner has his own "!" while he is not examined: Patient 3)
  assert.deepEqual(
    [...baker].filter((id) => id !== ch1.INJURED_MINER_INSTANCE_ID),
    ["bakery-interior-baker-01"],
  );
  // the world draws these ids as they are: the placed instances
  for (const [scene, id] of [
    ["tavern-interior", BART],
    ["tavern-interior", MAN],
    ["farm", WOMAN],
    ["mill-farmland", BEEK],
  ]) {
    assert.ok(
      getComposition(scene, "chapter-1").instances.some(
        (i) => i.instanceId === id,
      ),
      id,
    );
  }
});

test("26. Patient 1 is intact: same intro, same narrative examination, same delivery and Salt", () => {
  const BAKER = "chapter1.bakery.baker";
  const f = (status, pairs = [], claimed = []) => ({
    patients: { [ch1.BAKER_HUSBAND_ID]: status },
    inventory: stock(pairs),
    claimedRewards: new Set(claimed),
  });
  const intro = story.resolveStoryInteraction(
    BAKER,
    f("discovered"),
    "es",
    "b",
  );
  assert.equal(intro.conversation.id, "chapter1.bakery.baker.intro");
  assert.equal(intro.after, "go-to-examination");
  assert.equal(intro.patientId, ch1.BAKER_HUSBAND_ID);
  assert.equal(
    story.getExaminationConversation(ch1.BAKER_HUSBAND_ID, "es").id,
    "chapter1.bakery.husband.exam",
  );
  assert.equal(story.getExaminationConversation(P2, "es"), null);
  const delivery = story.resolveStoryInteraction(
    BAKER,
    f("examined", [
      ["medicinal-infusion", 1],
      ["cold-cloth", 1],
    ]),
    "es",
    "b",
  );
  assert.equal(
    delivery.conversation.id,
    "chapter1.bakery.baker.deliveryWithReward",
  );
  assert.deepEqual(
    delivery.effects.map((e) => e.type),
    ["treat", "give-item", "claim-reward"],
  );
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes('startTransition("bakers-bedroom", "narrative")'));
  assert.ok(game.includes('"leave-bedroom"'));
  assert.ok(
    /useRef<string>\(BAKER_HUSBAND_ID\)/.test(game),
    "the examination target defaults to the baker's husband",
  );
});

// ------------------------------------------------------------ REACHABILITY
const feet = ({ x, y }) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });

function reachability(sceneId) {
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
  const arrival = Object.values(scene.arrivals)[0];
  const step = 3;
  const seen = new Set([`${arrival.x},${arrival.y}`]);
  const queue = [[arrival.x, arrival.y]];
  while (queue.length) {
    const [x, y] = queue.pop();
    for (const [dx, dy] of [
      [step, 0],
      [-step, 0],
      [0, step],
      [0, -step],
    ]) {
      const key = `${x + dx},${y + dy}`;
      if (!seen.has(key) && free(x + dx, y + dy)) {
        seen.add(key);
        queue.push([x + dx, y + dy]);
      }
    }
  }
  const cells = [...seen].map((k) => k.split(",").map(Number));
  const reaches = (zone) =>
    cells.some(([x, y]) => rectsIntersect(feet({ x, y }), zone));
  return { scene, resolved, reaches };
}

test("24. everything Patient 2 needs can be reached on foot, and the circuit has no broken exits", () => {
  const needs = {
    "tavern-interior": [BARTENDER, PATIENT],
    "mill-farmland": ["collect.orange", BEE],
    farm: [FARM],
    "mine-interior": ["collect.mushroom"],
    outskirts: ["gather.water"],
  };
  for (const [sceneId, interactionIds] of Object.entries(needs)) {
    const { scene, resolved, reaches } = reachability(sceneId);
    const zones = [...resolved.zones, ...getSceneInteractionZones(sceneId)];
    for (const interactionId of interactionIds) {
      const found = zones.filter((z) => z.interactionId === interactionId);
      assert.ok(found.length >= 1, `${sceneId}: ${interactionId} has a zone`);
      assert.ok(
        found.some(reaches),
        `${sceneId}: ${interactionId} is reachable`,
      );
    }
    for (const exit of scene.exits) {
      assert.ok(reaches(exit.zone), `${sceneId}: exit ${exit.name} reachable`);
      const target = WORLD_SCENES[exit.targetScene];
      assert.ok(target, `${exit.targetScene} exists`);
      assert.ok(
        target.arrivals[exit.targetSpawn],
        `${exit.targetSpawn} exists`,
      );
    }
  }
  // the tavern circuit: tavern <-> tavern street <-> outskirts <-> farm <-> mill farmland
  const path = [
    ["tavern-interior", "tavern-street"],
    ["tavern-street", "outskirts"],
    ["outskirts", "farm"],
    ["farm", "mill-farmland"],
    ["mill-farmland", "farm"],
    ["farm", "outskirts"],
    ["outskirts", "tavern-street"],
    ["tavern-street", "tavern-interior"],
  ];
  for (const [from, to] of path) {
    assert.ok(
      WORLD_SCENES[from].exits.some((e) => e.targetScene === to),
      `${from} -> ${to}`,
    );
  }
});

console.log(`\n${passed} tests passed`);
