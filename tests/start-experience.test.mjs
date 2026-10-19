// Start Experience V2: a new game begins with the Doctor-writing interlude, then
// the Doctor's Room, then the event-driven Tutorial V2. Pure state and data.
//   node tests/start-experience.test.mjs
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

const { getChapterStart } = at("src/game/world/chapterStart.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { doctorRoomColliders, doctorRoomTransitions, doctorRoomSpawns } = at(
  "src/game/doctor-room/doctorRoomGeometry.ts",
);
const { rectsIntersect } = at("src/game/collision.ts");
const flow = at("src/game/narrative/interludeFlow.ts");
const { NARRATIVE_ILLUSTRATIONS } = at("src/game/narrative/illustrations.ts");
const { advanceTutorial, INITIAL_TUTORIAL_STEP } = at(
  "src/game/tutorial/tutorialFlow.ts",
);
const { tutorialCopy } = at("src/game/i18n/tutorial.ts");
const { narrativeCopy } = at("src/game/i18n/narrative.ts");
const { resolveChapterIntro } = at("src/game/dialogue/interactionDialogues.ts");
const { createChapter1Inventory, createChapter1Storage } = at(
  "src/game/inventory/initialInventory.ts",
);
const { transferStack, STORAGE_INTERACTION_ID, doctorRoomStorageInteractions } =
  at("src/game/storage/storage.ts");
const { getSceneInteractionZones } = at(
  "src/game/interactions/sceneInteractions.ts",
);
const { findAvailableInteraction } = at(
  "src/game/interactions/interactionZone.ts",
);
const inv = at("src/game/inventory/inventory.ts");
const { buildBookSections } = at("src/game/book/bookPages.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const feet = ({ x, y }) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });

test("a fresh Chapter 1 begins with the writing interlude, then the Doctor's Room", () => {
  const start = getChapterStart("chapter-1");
  assert.equal(start.sceneId, "doctor-room");
  assert.equal(start.spawnName, "chapter-start");
  assert.equal(start.opening.illustration, "doctor-writing");
  assert.throws(() => getChapterStart("no-such-chapter"));
  // the start scene and arrival really exist
  assert.ok(WORLD_SCENES[start.sceneId].arrivals[start.spawnName]);
  // nothing else in the game still claims to be "the" start
  assert.ok(
    !/START_SCENE|START_SPAWN/.test(read("src/game/world/GameWorld.tsx")),
  );
  assert.ok(
    !/START_SCENE|START_SPAWN/.test(read("src/game/world/worldScenes.ts")),
  );
});

test("the Doctor starts beside the bed, facing south, clear of furniture and the exit", () => {
  const arrival = WORLD_SCENES["doctor-room"].arrivals["chapter-start"];
  const spawn1 = doctorRoomSpawns.find((s) => s.id === "doctor-room-spawn-1");
  assert.deepEqual(arrival, { x: spawn1.x, y: spawn1.y, direction: "south" });
  assert.equal(arrival.direction, "south");
  for (const collider of doctorRoomColliders) {
    assert.ok(
      !rectsIntersect(feet(arrival), collider),
      `touches ${collider.id}`,
    );
  }
  for (const zone of doctorRoomTransitions) {
    assert.ok(!rectsIntersect(feet(arrival), zone), "not on the exit");
  }
  // the walk-in arrival from the Apothecary and the exit are unchanged
  assert.deepEqual(
    WORLD_SCENES["doctor-room"].arrivals["from-apothecary-interior"],
    {
      x: 144,
      y: 264,
      direction: "north",
    },
  );
  const exit = WORLD_SCENES["doctor-room"].exits[0];
  assert.equal(exit.targetScene, "apothecary-interior");
  assert.equal(exit.targetSpawn, "from-doctor-room");
  assert.ok(WORLD_SCENES["apothecary-interior"].arrivals["from-doctor-room"]);
});

test("leaving the Doctor's Room: the Doctor arrives in the Apothecary at the approved spot, facing SOUTH", () => {
  const { apothecaryInteriorSpawns } = at(
    "src/game/apothecary/apothecaryInteriorGeometry.ts",
  );
  const arrivals = WORLD_SCENES["apothecary-interior"].arrivals;
  const painted = apothecaryInteriorSpawns.find(
    (spawn) => spawn.id === "apothecary-interior-spawn-1",
  );
  // the exit really leads to this arrival
  const exit = WORLD_SCENES["doctor-room"].exits[0];
  assert.equal(exit.targetScene, "apothecary-interior");
  assert.equal(arrivals[exit.targetSpawn], arrivals["from-doctor-room"]);
  // same coordinates as before, now facing south
  assert.deepEqual(arrivals["from-doctor-room"], {
    x: 444,
    y: 147,
    direction: "south",
  });
  assert.equal(arrivals["from-doctor-room"].x, painted.x);
  assert.equal(arrivals["from-doctor-room"].y, painted.y);
  // the painted spawn record and the other arrivals are untouched
  assert.equal(painted.direction, "north");
  assert.deepEqual(arrivals["from-apothecary-street"], {
    x: 235,
    y: 219,
    direction: "south",
  });
  // nothing in the scene overrides the arrival's facing
  assert.ok(
    read("src/game/apothecary/ApothecaryScene.tsx").includes(
      "initialDirection: spawn.direction",
    ),
  );
});

test("the opening uses the writing illustration only; the other two stay available, unused", () => {
  for (const [id, illustration] of Object.entries(NARRATIVE_ILLUSTRATIONS)) {
    const file = path.join(root, "public", illustration.src);
    assert.ok(fs.existsSync(file), id);
    const header = fs.readFileSync(file).subarray(0, 24);
    assert.equal(header.subarray(1, 4).toString(), "PNG");
    assert.equal(header.readUInt32BE(16), illustration.width, id);
    assert.equal(header.readUInt32BE(20), illustration.height, id);
  }
  assert.deepEqual(Object.keys(NARRATIVE_ILLUSTRATIONS).sort(), [
    "doctor-eating",
    "doctor-fireplace",
    "doctor-writing",
  ]);
  const gameWorld = read("src/game/world/GameWorld.tsx");
  assert.ok(!/doctor-eating|doctor-fireplace/.test(gameWorld));
  assert.ok(
    !/doctor-eating|doctor-fireplace/.test(
      read("src/game/world/chapterStart.ts"),
    ),
  );
});

test("the opening monologue is the approved Chapter 1 intro, in both languages", () => {
  const es = resolveChapterIntro("chapter-1", "es");
  const en = resolveChapterIntro("chapter-1", "en");
  assert.equal(es.lines.length, 7);
  assert.equal(en.lines.length, 7);
  assert.equal(es.lines[0].text, "Otro día.");
  assert.ok(es.lines.at(-1).text.includes("frasco vacío"));
  assert.ok(en.lines.at(-1).text.toLowerCase().includes("flask"));
  for (const line of [...es.lines, ...en.lines]) assert.ok(line.text.trim());
  // the hints under the text are localized
  for (const lang of ["es", "en"]) {
    assert.ok(narrativeCopy[lang].continue && narrativeCopy[lang].skip);
  }
  assert.ok(narrativeCopy.es.skip.startsWith("ESC"));
});

test("interlude: the phases run fade-in > reading > fade-out > reveal > done", () => {
  let phase = flow.INITIAL_INTERLUDE_PHASE;
  assert.equal(phase, "fade-in");
  for (const [event, next] of [
    ["illustration-visible", "reading"],
    ["text-finished", "fade-out"],
    ["faded-out", "reveal"],
    ["revealed", "done"],
  ]) {
    phase = flow.advanceInterlude(phase, event);
    assert.equal(phase, next);
  }
  assert.equal(flow.advanceInterlude("done", "skip"), "done");
});

test("interlude: text cannot finish before it starts; Esc skips from fade-in or reading only, never twice", () => {
  assert.equal(flow.advanceInterlude("fade-in", "text-finished"), "fade-in");
  assert.equal(flow.advanceInterlude("fade-in", "skip"), "fade-out");
  assert.equal(flow.advanceInterlude("reading", "skip"), "fade-out");
  assert.equal(flow.canSkipInterlude("fade-in"), true);
  assert.equal(flow.canSkipInterlude("reading"), true);
  for (const phase of ["fade-out", "reveal", "done"]) {
    assert.equal(flow.canSkipInterlude(phase), false, phase);
    assert.equal(flow.advanceInterlude(phase, "skip"), phase, phase);
  }
  // a skipped interlude still ends in "done" (so the tutorial still starts)
  let phase = flow.advanceInterlude("reading", "skip");
  for (const event of ["faded-out", "revealed"])
    phase = flow.advanceInterlude(phase, event);
  assert.equal(phase, "done");
});

test("gameplay is blocked while the opening runs, and its end starts the tutorial", () => {
  const source = read("src/game/world/GameWorld.tsx");
  // both the controls and every interface check the opening
  const canOpen = source.slice(
    source.indexOf("const canOpenInterface ="),
    source.indexOf("const mapVisible"),
  );
  const playing = source.slice(
    source.indexOf("const isPlaying ="),
    source.indexOf("useBookHotkeys({"),
  );
  assert.ok(canOpen.includes("!openingActive"));
  assert.ok(playing.includes("!openingActive"));
  assert.ok(source.includes('notifyTutorial("intro-finished")'));
  // the old world-space monologue is gone
  assert.ok(!/introPlayedRef|introActiveRef|INTRO_DELAY_MS/.test(source));
  // the tutorial waits for the opening
  assert.equal(INITIAL_TUTORIAL_STEP, "intro");
  assert.equal(advanceTutorial("intro", "book-opened"), "intro");
  assert.equal(advanceTutorial("intro", "player-moved"), "intro");
});

test("a new game: no Empty flask in the pocket, ONE in the Storage chest", () => {
  const pocket = createChapter1Inventory();
  const chest = createChapter1Storage();
  assert.equal(pocket.capacity, 6);
  assert.equal(chest.capacity, 24);
  assert.equal(inv.countItem(pocket, "empty-flask"), 0);
  assert.equal(inv.countOccupiedSlots(pocket), 0);
  assert.equal(inv.countItem(chest, "empty-flask"), 1);
  assert.equal(inv.countOccupiedSlots(chest), 1);
  // exactly one between the two
  assert.equal(
    inv.countItem(pocket, "empty-flask") + inv.countItem(chest, "empty-flask"),
    1,
  );
  // taking it is the normal transfer, nothing special
  const taken = transferStack(chest, pocket, "empty-flask");
  assert.equal(inv.countItem(taken.destination, "empty-flask"), 1);
  assert.equal(inv.countItem(taken.source, "empty-flask"), 0);
});

test("Tutorial V2: open book > page > tab > close > map > move > approach chest > open it > take flask > done", () => {
  const sequence = [
    ["intro-finished", "book"],
    ["book-opened", "book-page"],
    ["book-page-changed", "book-tab"],
    ["book-tab-changed", "book-close"],
    ["book-closed", "map"],
    ["map-opened", "move"],
    ["player-moved", "chest-approach"],
    ["chest-in-range", "chest-interact"],
    ["chest-opened", "take-flask"],
    ["flask-taken", "done"],
  ];
  let step = INITIAL_TUTORIAL_STEP;
  for (const [event, next] of sequence) {
    step = advanceTutorial(step, event);
    assert.equal(step, next, event);
  }
  assert.equal(advanceTutorial("done", "book-opened"), "done");
});

test("opening the book is NOT enough: the page must really change, then the tab, then it must close", () => {
  assert.equal(advanceTutorial("book-page", "book-opened"), "book-page");
  assert.equal(advanceTutorial("book-page", "book-tab-changed"), "book-page"); // out of order
  assert.equal(advanceTutorial("book-page", "book-closed"), "book-page");
  assert.equal(advanceTutorial("book-page", "book-page-changed"), "book-tab");
  assert.equal(advanceTutorial("book-tab", "book-page-changed"), "book-tab");
  assert.equal(advanceTutorial("book-tab", "book-closed"), "book-tab");
  assert.equal(advanceTutorial("book-tab", "book-tab-changed"), "book-close");
  assert.equal(advanceTutorial("book-close", "map-opened"), "book-close");
  assert.equal(advanceTutorial("book-close", "book-closed"), "map");
});

test("map and movement only count at their own step; the chest is only approached AFTER moving", () => {
  assert.equal(advanceTutorial("map", "player-moved"), "map");
  assert.equal(advanceTutorial("map", "map-opened"), "move");
  assert.equal(advanceTutorial("move", "chest-in-range"), "move");
  assert.equal(advanceTutorial("move", "player-moved"), "chest-approach");
  // unrelated movement does not skip the approach: only entering the chest's zone does
  assert.equal(
    advanceTutorial("chest-approach", "player-moved"),
    "chest-approach",
  );
  assert.equal(
    advanceTutorial("chest-approach", "chest-in-range"),
    "chest-interact",
  );
});

test("chest steps: a random E or another interaction cannot open it; only the chest's Storage counts", () => {
  // E presses and other interactions produce no tutorial event; only the
  // Storage opening does, and only at the right step
  assert.equal(
    advanceTutorial("chest-interact", "player-moved"),
    "chest-interact",
  );
  assert.equal(
    advanceTutorial("chest-approach", "chest-opened"),
    "chest-approach",
  );
  assert.equal(advanceTutorial("chest-interact", "chest-opened"), "take-flask");
  // walking away from the chest goes back to approaching it
  assert.equal(
    advanceTutorial("chest-interact", "chest-out-of-range"),
    "chest-approach",
  );
  assert.equal(
    advanceTutorial("chest-approach", "chest-in-range"),
    "chest-interact",
  );
});

test("merely opening the Storage, or closing it without the flask, does not finish the tutorial", () => {
  let step = advanceTutorial("chest-interact", "chest-opened");
  assert.equal(step, "take-flask"); // opening is NOT completion
  step = advanceTutorial(step, "storage-closed");
  assert.equal(step, "chest-interact"); // back to "open it"; Book/Map/movement are not repeated
  step = advanceTutorial(step, "chest-opened");
  assert.equal(step, "take-flask");
  assert.equal(advanceTutorial(step, "flask-taken"), "done");
  // closing the Storage AFTER taking the flask changes nothing
  assert.equal(advanceTutorial("done", "storage-closed"), "done");
});

test("the flask is what counts: another item, a failed transfer or no change never completes it", () => {
  const chest = createChapter1Storage();
  const pocket = createChapter1Inventory();
  const carries = (inventory) => inv.countItem(inventory, "empty-flask") > 0;

  // another item moving does not give the flask
  const other = transferStack(inv.addItem(chest, "water", 2), pocket, "water");
  assert.equal(carries(other.destination), false);

  // a failed transfer (pocket full of OTHER things) leaves the pocket untouched
  const full = ["a", "b", "c", "d", "e", "f"].reduce(
    (state, id) => inv.addItem(state, id, 1),
    pocket,
  );
  assert.equal(transferStack(chest, full, "empty-flask"), null);
  assert.equal(carries(full), false);

  // the real transfer is what completes it
  const taken = transferStack(chest, pocket, "empty-flask");
  assert.equal(carries(taken.destination), true);
  assert.equal(advanceTutorial("take-flask", "flask-taken"), "done");

  // GameWorld derives that event from the carried inventory, not from the click
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(/countItem\(inventory, "empty-flask"\) > 0/.test(game));
  assert.ok(game.includes('notifyTutorial("flask-taken")'));
});

test("a flask taken before the tutorial got there finishes the chest steps (nothing left to teach)", () => {
  for (const step of ["chest-approach", "chest-interact", "take-flask"]) {
    assert.equal(advanceTutorial(step, "flask-taken"), "done", step);
  }
  for (const step of [
    "intro",
    "book",
    "book-page",
    "book-tab",
    "book-close",
    "map",
    "move",
  ]) {
    assert.equal(advanceTutorial(step, "flask-taken"), step, step);
  }
});

test("the chest: proximity comes from the real interaction zone; opening reports the Storage", () => {
  const [zone] = doctorRoomStorageInteractions;
  assert.equal(zone.interactionId, STORAGE_INTERACTION_ID);
  assert.deepEqual(getSceneInteractionZones("doctor-room"), [zone]);
  const zones = getSceneInteractionZones("doctor-room");
  // standing on the zone makes the interaction available; standing away does not
  const feetAt = (x, y) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
  const near = findAvailableInteraction(
    zones,
    feetAt(zone.x + 4, zone.y + 40),
    "west",
  );
  const far = findAvailableInteraction(zones, feetAt(173, 168), "south");
  assert.equal(near?.interactionId, "storage.doctor-room");
  assert.equal(far, null);
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("availableInteractionId === STORAGE_INTERACTION_ID"));
  assert.ok(
    game.includes('"chest-in-range"') && game.includes('"chest-out-of-range"'),
  );
  assert.ok(
    game.includes('notifyTutorial("chest-opened")') &&
      game.includes('notifyTutorial("storage-closed")'),
  );
  // the scenes report WHICH interaction is available
  for (const file of [
    "src/game/world/ExteriorScene.tsx",
    "src/game/apothecary/ApothecaryScene.tsx",
  ]) {
    assert.ok(
      read(file).includes(
        "onInteractionAvailable?: (interactionId: string | null) => void;",
      ),
      file,
    );
  }
});

test("the take-flask hint is drawn over the open Storage; no other hint is", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes('storageOpen && tutorialStep === "take-flask"'));
  assert.ok(/\(!storageOpen \|\| hintOverStorage\)/.test(game));
  assert.ok(game.includes("aboveOverlays={hintOverBook || hintOverStorage}"));
});

test("movement is a real event: only reported when the Doctor really changed position", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(read("src/game/protagonist/usePlayerMoved.ts").length > 0);
  assert.ok(game.includes('notifyTutorial("player-moved")'));
  // the old generic "an interaction started" event is gone
  assert.ok(!game.includes("interaction-started"));
  assert.ok(
    !read("src/game/tutorial/tutorialFlow.ts").includes("interaction-started"),
  );
});

test("the Book edge case: PACIENTES has one page at the start, so the tutorial opens it on a multi-page section the Doctor knows", () => {
  const sections = buildBookSections({
    language: "es",
    patients: ch1.CHAPTER1_INITIAL_PATIENTS,
    inventory: createChapter1Inventory(),
    knownRecipeIds: new Set(),
  });
  const bySection = Object.fromEntries(
    sections.map((s) => [s.id, s.spreads.length]),
  );
  assert.equal(bySection.patients, 1);
  assert.ok(bySection.ingredients > 1);
  assert.equal(sections[0].id, "patients"); // the default section is unchanged
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(
    /initialSectionId=\{[\s\S]*"ingredients"[\s\S]*undefined/.test(game),
  );
  // the book reports real navigation and supports the arrows it advertises
  const book = read("src/game/book/BookOverlay.tsx");
  assert.ok(book.includes("onPageChange") && book.includes("onSectionChange"));
  assert.ok(book.includes('"ArrowLeft"') && book.includes('"ArrowRight"'));
  assert.ok(game.includes('notifyTutorial("book-page-changed")'));
  assert.ok(game.includes('notifyTutorial("book-tab-changed")'));
  assert.ok(game.includes('notifyTutorial("book-closed")'));
});

test("every tutorial hint exists in both languages and only names keys that do something", () => {
  for (const lang of ["es", "en"]) {
    for (const step of [
      "book",
      "book-page",
      "book-tab",
      "book-close",
      "map",
      "move",
      "chest-approach",
      "chest-interact",
      "take-flask",
    ]) {
      const copy = tutorialCopy[lang][step];
      assert.ok(
        copy && copy.title.length && copy.body.trim(),
        `${lang}/${step}`,
      );
    }
    const keys = (step) =>
      tutorialCopy[lang][step].title
        .filter((p) => typeof p === "object")
        .map((p) => p.key);
    assert.deepEqual(keys("book-page"), ["←", "→"]);
    assert.deepEqual(keys("book-close"), ["Q", "Esc"]);
    assert.deepEqual(keys("chest-interact"), ["E"]);
    // no hint advertises drag and drop
    for (const step of ["chest-approach", "chest-interact", "take-flask"]) {
      const text = JSON.stringify(tutorialCopy[lang][step]).toLowerCase();
      assert.ok(!/drag|arrastr/.test(text), `${lang}/${step}`);
    }
  }
});

test("starting the game unlocks nothing: only the baker's husband is known, no recipes, no other patient", () => {
  assert.deepEqual(Object.keys(ch1.CHAPTER1_INITIAL_PATIENTS), [
    ch1.BAKER_HUSBAND_ID,
  ]);
  assert.equal(
    ch1.CHAPTER1_INITIAL_PATIENTS[ch1.BAKER_HUSBAND_ID],
    "discovered",
  );
  assert.deepEqual(Object.keys(ch1.CHAPTER1_PATIENTS), [ch1.BAKER_HUSBAND_ID]);
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(
    /useState<ReadonlySet<string>>\(\s*new Set\(\)/.test(game),
    "no recipe is known at the start",
  );
});

console.log(`\n${passed} tests passed`);
