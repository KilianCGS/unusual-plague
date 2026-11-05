// The end of Day 1: three cases treated in ANY order, the Doctor says it is
// enough (once), keeps exploring, and getting back to the Botica (walking or by
// fast travel) closes the day.
//   node tests/day1-closing.test.mjs
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
const day1 = at("src/game/patients/day1.ts");
const talk = at("src/game/dialogue/chapter1Day1Dialogues.ts");
const { localizeConversation } = at(
  "src/game/dialogue/localizedConversation.ts",
);
const { canFastTravel, FAST_TRAVEL_DESTINATION } = at(
  "src/game/world/fastTravel.ts",
);
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { NARRATIVE_ILLUSTRATIONS } = at("src/game/narrative/illustrations.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const IDS = [ch1.BAKER_HUSBAND_ID, ch1.TAVERN_PATIENT_ID, ch1.INJURED_MINER_ID];

// Treat a case with its REAL definition and its real treatments (what the
// treat effect does in the game).
function treat(patients, patientId) {
  const definition = ch1.CHAPTER1_PATIENTS[patientId];
  const withTreatments = definition.requiredTreatments.reduce(
    (state, { itemId, quantity }) => inv.addItem(state, itemId, quantity),
    inv.createEmptyInventory(),
  );
  const examined = pc.advancePatient(
    pc.advancePatient(patients, patientId, "discovered"),
    patientId,
    "examined",
  );
  const result = pc.treatPatient(examined, definition, withTreatments);

  assert.ok(result, `${patientId} can be treated`);

  return result.state;
}
const START = ch1.CHAPTER1_INITIAL_PATIENTS;
const permutations = (items) =>
  items.length <= 1
    ? [items]
    : items.flatMap((item, i) =>
        permutations([...items.slice(0, i), ...items.slice(i + 1)]).map(
          (rest) => [item, ...rest],
        ),
      );

// What GameWorld wires, as a tiny pure loop: each "tick" is a moment of plain
// play (control with the Doctor) in a scene.
function newGame() {
  return {
    patients: START,
    claimed: new Set(),
    sceneId: "plaza",
    log: [],
  };
}
function tick(game, { playing = true } = {}) {
  if (!playing) return game;
  if (day1.shouldAnnounceDay1WorkDone(game.patients, game.claimed)) {
    game.claimed = new Set([...game.claimed, day1.DAY1_WORK_DONE_ID]);
    game.log.push("remark");
  }
  if (
    day1.shouldCloseDay1({
      patients: game.patients,
      claimedRewards: game.claimed,
      sceneId: game.sceneId,
    })
  ) {
    game.log.push("closing");
    game.claimed = new Set([...game.claimed, day1.DAY1_COMPLETED_ID]); // the interlude ended
  }
  return game;
}
const arriveWalking = (game) => {
  const exit = WORLD_SCENES["apothecary-street"].exits.find(
    (e) => e.targetScene === "apothecary-interior",
  );
  game.sceneId = exit.targetScene;
  return tick(game);
};
const arriveByFastTravel = (game) => {
  game.sceneId = FAST_TRAVEL_DESTINATION.sceneId;
  return tick(game);
};

test("the three cases of the day are exactly the ones Chapter 1 defines, and the state is derived from them", () => {
  assert.deepEqual([...day1.DAY1_PATIENT_IDS].sort(), [...IDS].sort());
  assert.equal(day1.areAllDay1PatientsTreated(START), false);
  assert.equal(day1.getDay1Status(START, new Set()), "in-progress");
  let all = START;
  for (const id of IDS) all = treat(all, id);
  assert.equal(day1.areAllDay1PatientsTreated(all), true);
  assert.equal(day1.getDay1Status(all, new Set()), "work-done");
  assert.equal(
    day1.getDay1Status(all, new Set([day1.DAY1_COMPLETED_ID])),
    "completed",
  );
  // a hidden / undiscovered case is NOT treated
  assert.equal(
    day1.areAllDay1PatientsTreated({ [ch1.BAKER_HUSBAND_ID]: "treated" }),
    false,
  );
});

test("any incomplete combination (none, one, two cases) never ends the day", () => {
  const subsets = [[], ...IDS.map((id) => [id])];
  for (const a of IDS) for (const b of IDS) if (a < b) subsets.push([a, b]);
  assert.equal(subsets.length, 7);
  for (const subset of subsets) {
    const state = subset.reduce(treat, START);
    assert.equal(
      day1.areAllDay1PatientsTreated(state),
      false,
      subset.join("+"),
    );
    assert.equal(day1.shouldAnnounceDay1WorkDone(state, new Set()), false);
    const game = { ...newGame(), patients: state };
    arriveWalking(game);
    arriveByFastTravel(game);
    assert.deepEqual(game.log, [], `${subset.join("+")} never closes`);
    assert.equal(day1.getDay1Status(state, game.claimed), "in-progress");
  }
});

test("the order does not matter: all six orders end the same way", () => {
  const perms = permutations(IDS);
  assert.equal(perms.length, 6);
  for (const order of perms) {
    const game = newGame();
    order.forEach((id, i) => {
      game.patients = treat(game.patients, id);
      tick(game);
      // the remark appears only with the THIRD, whichever it is
      assert.equal(game.log.includes("remark"), i === 2, order.join(">"));
    });
    assert.deepEqual(game.log, ["remark"], order.join(">"));
    arriveWalking(game);
    assert.deepEqual(game.log, ["remark", "closing"], order.join(">"));
    assert.equal(day1.getDay1Status(game.patients, game.claimed), "completed");
  }
});

test("the Doctor's remark is said ONCE: later ticks, scene changes and trips never repeat it", () => {
  const game = newGame();
  for (const id of IDS) game.patients = treat(game.patients, id);
  tick(game);
  for (const scene of ["plaza", "forest", "tavern-interior", "plaza"]) {
    game.sceneId = scene;
    tick(game);
    tick(game);
  }
  assert.deepEqual(game.log, ["remark"]);
  // a re-render with the flag claimed asks for nothing
  assert.equal(
    day1.shouldAnnounceDay1WorkDone(game.patients, game.claimed),
    false,
  );
  // not while the Doctor has no control (dialogue, fade, interface)
  const busy = { ...newGame(), patients: IDS.reduce(treat, START) };
  tick(busy, { playing: false });
  assert.deepEqual(busy.log, []);
  tick(busy);
  assert.deepEqual(busy.log, ["remark"]);
});

test("nothing moves the Doctor when the third case is treated: no transition, no lock, no countdown", () => {
  const game = GameWorldSource();
  const remark = game.slice(
    game.indexOf("// 1) The third case was treated"),
    game.indexOf("// 2) Being in the Botica"),
  );
  assert.ok(remark.includes("shouldAnnounceDay1WorkDone"));
  assert.ok(remark.includes("claimFlag(DAY1_WORK_DONE_ID)"));
  assert.ok(remark.includes("startDialogue("));
  for (const forbidden of [
    "startTransition",
    "setWorld",
    "setTimeout",
    "setClosingActive",
  ]) {
    assert.ok(!remark.includes(forbidden), forbidden);
  }
  // the remark is flagged BEFORE it is said and reads the refs: no double effect
  assert.ok(remark.indexOf("claimFlag") < remark.indexOf("startDialogue"));
  assert.ok(remark.includes("claimedRewardsRef.current"));
});

test("after the remark the Doctor keeps full freedom: fast travel, Book, Map, Crafting and exploration are as before", () => {
  const base = {
    sceneId: "forest",
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
  assert.equal(canFastTravel(base), true, "fast travel stays on offer");
  // the day status takes no part in the rules of fast travel
  const rule = read("src/game/world/fastTravel.ts");
  assert.ok(!/day1|Day1|DAY1/.test(rule));
  // and the day never closes anywhere but at home
  const game = newGame();
  for (const id of IDS) game.patients = treat(game.patients, id);
  tick(game);
  for (const scene of [
    "forest",
    "mine-interior",
    "tavern-interior",
    "plaza",
    "doctor-room",
  ]) {
    game.sceneId = scene;
    tick(game);
  }
  assert.deepEqual(game.log, ["remark"]);
});

test("coming home on foot closes the day; the street door is the Botica's own arrival", () => {
  const game = newGame();
  for (const id of IDS) game.patients = treat(game.patients, id);
  tick(game);
  game.sceneId = "apothecary-street"; // walks to the Apothecary Street
  tick(game);
  assert.deepEqual(game.log, ["remark"]);
  arriveWalking(game);
  assert.deepEqual(game.log, ["remark", "closing"]);
  assert.equal(day1.getDay1Status(game.patients, game.claimed), "completed");
});

test("fast travel closes the day exactly like walking: both arrive at the same Botica and the code never asks how", () => {
  const walk = newGame();
  const fast = newGame();
  for (const g of [walk, fast]) {
    for (const id of IDS) g.patients = treat(g.patients, id);
    tick(g);
  }
  arriveWalking(walk);
  arriveByFastTravel(fast);
  assert.deepEqual(walk.log, fast.log);
  assert.deepEqual(fast.log, ["remark", "closing"]);
  assert.deepEqual([...walk.claimed].sort(), [...fast.claimed].sort());
  // the same arrival: scene and spawn
  const street = WORLD_SCENES["apothecary-street"].exits.find(
    (e) => e.targetScene === "apothecary-interior",
  );
  assert.equal(street.targetScene, FAST_TRAVEL_DESTINATION.sceneId);
  assert.equal(street.targetSpawn, FAST_TRAVEL_DESTINATION.spawnName);
  // the rule looks at the state and the scene only
  const src = read("src/game/patients/day1.ts");
  assert.ok(!/fast|travel/i.test(src.replace(/\/\/.*$/gm, "")));
  const game = GameWorldSource();
  const closing = game.slice(
    game.indexOf("// 2) Being in the Botica"),
    game.indexOf("const finishClosing"),
  );
  assert.ok(closing.includes("shouldCloseDay1"));
  assert.ok(closing.includes("world.sceneId"));
  assert.ok(!/fastTravel|handleFastTravel|caption/i.test(closing));
});

test("entering the Botica or fast travelling before the three are treated does not close the day, and fast travel keeps working", () => {
  for (const treated of [[], [IDS[0]], [IDS[0], IDS[1]], [IDS[2], IDS[1]]]) {
    const game = { ...newGame(), patients: treated.reduce(treat, START) };
    arriveWalking(game);
    arriveByFastTravel(game);
    assert.deepEqual(game.log, [], treated.join("+"));
  }
  // and the trip itself is unchanged by the day: still on offer outside home
  assert.equal(
    canFastTravel({
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
    }),
    true,
  );
});

test("the closing is the existing narrative interlude over the fireplace picture, and blocks the world like the opening", () => {
  assert.ok(NARRATIVE_ILLUSTRATIONS["doctor-fireplace"]);
  assert.ok(
    fs.existsSync(
      path.join(
        root,
        "public",
        NARRATIVE_ILLUSTRATIONS["doctor-fireplace"].src,
      ),
    ),
  );
  const game = GameWorldSource();
  assert.ok(game.includes('NARRATIVE_ILLUSTRATIONS["doctor-fireplace"]'));
  assert.ok(game.includes("<NarrativeInterlude"));
  assert.ok(game.includes("onFinished={finishClosing}"));
  // one flag marks the day as completed, once the interlude is over
  const finish = game.slice(
    game.indexOf("const finishClosing"),
    game.indexOf("const closingConversation"),
  );
  assert.ok(finish.includes("claimFlag(DAY1_COMPLETED_ID)"));
  assert.ok(finish.includes("setClosingActive(false)"));
  // it blocks movement and every interface exactly as the opening does
  assert.ok(
    game.includes("const interludeActive = openingActive || closingActive;"),
  );
  assert.ok(!/!openingActive &&/.test(game.replace(/!interludeActive/g, "")));
});

test("ES and EN: the remark and the closing, with no text written in GameWorld", () => {
  const es = localizeConversation(talk.day1WorkDone, "es", "doctor").lines.map(
    (l) => l.text,
  );
  const en = localizeConversation(talk.day1WorkDone, "en", "doctor").lines.map(
    (l) => l.text,
  );
  assert.deepEqual(es, [
    "Creo que por hoy ha sido suficiente.",
    "Debería volver a la botica.",
  ]);
  assert.deepEqual(en, [
    "I think that's enough for today.",
    "I should head back to the apothecary.",
  ]);
  for (const language of ["es", "en"]) {
    const closing = localizeConversation(talk.day1Closing, language, "doctor");
    assert.ok(closing.lines.length >= 2);
    assert.ok(
      closing.lines.every((l) => l.speaker === "doctor" && l.text.trim()),
    );
  }
  const game = GameWorldSource();
  assert.ok(
    !/Creo que por hoy|I think that's enough|Tres enfermos|Three patients seen/.test(
      game,
    ),
  );
});

test("the final state is Day 1 completed and nothing of Day 2 starts", () => {
  const game = newGame();
  for (const id of IDS) game.patients = treat(game.patients, id);
  tick(game);
  arriveWalking(game);
  assert.equal(day1.getDay1Status(game.patients, game.claimed), "completed");
  // closed once: later arrivals do not close it again
  arriveWalking(game);
  arriveByFastTravel(game);
  assert.deepEqual(game.log, ["remark", "closing"]);
  // no other chapter or day exists in the code or the new files
  const chapters = read("src/game/world/chapterStart.ts");
  assert.ok(!/chapter-2|day-2|day2/i.test(chapters));
  for (const file of [
    "src/game/patients/day1.ts",
    "src/game/dialogue/chapter1Day1Dialogues.ts",
  ]) {
    assert.ok(!/chapter-2|day-?2/i.test(read(file)), file);
  }
  // the cases themselves are untouched by the closing
  for (const id of IDS) {
    assert.equal(pc.getPatientStatus(game.patients, id), "treated");
  }
});

function GameWorldSource() {
  return read("src/game/world/GameWorld.tsx");
}

console.log(`\n${passed} tests passed`);
