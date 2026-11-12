// The end of Day 1 (approved design): the three cases are treated in ANY order;
// when the LAST treatment's conversation is over the day closes by itself (one
// narrative sequence over the fireplace picture) and Day 2 begins in the
// Doctor's Room. There is no "go home" step.
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
const { getChapterStart, getNextChapterId } = at(
  "src/game/world/chapterStart.ts",
);
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { NARRATIVE_ILLUSTRATIONS } = at("src/game/narrative/illustrations.ts");
const { getComposition } = at("src/game/compositions/index.ts");

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

// What GameWorld wires, as a tiny pure loop. A treatment happens at the START
// of its conversation (patients change, the dialogue opens); the day may close
// only at a later "tick" of plain play, once nothing is open.
function newGame() {
  return {
    patients: START,
    claimed: new Set(),
    chapterId: "chapter-1",
    sceneId: "plaza",
    dialogueOpen: false,
    log: [],
  };
}
function treatAndTalk(game, id) {
  game.patients = treat(game.patients, id);
  game.dialogueOpen = true; // the treatment conversation is on screen
  return game;
}
function closeDialogue(game) {
  game.dialogueOpen = false;
  return game;
}
function tick(game, { playing = true } = {}) {
  if (!playing || game.dialogueOpen) return game;
  if (
    getNextChapterId(game.chapterId) !== null &&
    day1.shouldCloseDay1(game.patients, game.claimed)
  ) {
    game.claimed = new Set([...game.claimed, day1.DAY1_COMPLETED_ID]); // flagged first
    game.log.push("closing");
    // the closing swaps the world while the picture covers it
    const next = getNextChapterId(game.chapterId);
    const start = getChapterStart(next);
    game.chapterId = next;
    game.sceneId = start.sceneId;
    game.log.push(`start:${next}`);
  }
  return game;
}

test("the three cases of the day are exactly the ones Chapter 1 defines, and the state is derived from them", () => {
  assert.deepEqual([...day1.DAY1_PATIENT_IDS].sort(), [...IDS].sort());
  assert.equal(day1.areAllDay1PatientsTreated(START), false);
  assert.equal(day1.getDay1Status(new Set()), "in-progress");
  let all = START;
  for (const id of IDS) all = treat(all, id);
  assert.equal(day1.areAllDay1PatientsTreated(all), true);
  assert.equal(
    day1.getDay1Status(new Set([day1.DAY1_COMPLETED_ID])),
    "completed",
  );
  // a hidden / undiscovered case is NOT treated
  assert.equal(
    day1.areAllDay1PatientsTreated({ [ch1.BAKER_HUSBAND_ID]: "treated" }),
    false,
  );
});

test("any incomplete combination (none, one, two cases) never closes the day", () => {
  const subsets = [[], ...IDS.map((id) => [id])];
  for (const a of IDS) for (const b of IDS) if (a < b) subsets.push([a, b]);
  assert.equal(subsets.length, 7);
  for (const subset of subsets) {
    const state = subset.reduce(treat, START);
    assert.equal(
      day1.shouldCloseDay1(state, new Set()),
      false,
      subset.join("+"),
    );
    const game = { ...newGame(), patients: state };
    tick(game);
    assert.deepEqual(game.log, [], `${subset.join("+")} never closes`);
    assert.equal(game.chapterId, "chapter-1");
  }
});

test("the order does not matter: all six orders close the day the same way, only with the third", () => {
  const perms = permutations(IDS);
  assert.equal(perms.length, 6);
  for (const order of perms) {
    const game = newGame();
    order.forEach((id, i) => {
      treatAndTalk(game, id);
      closeDialogue(game);
      tick(game);
      assert.equal(game.log.includes("closing"), i === 2, order.join(">"));
    });
    assert.deepEqual(game.log, ["closing", "start:chapter-2"], order.join(">"));
    assert.equal(game.chapterId, "chapter-2");
  }
});

test("the closing waits for the whole conversation of the last case: nothing happens while it is open", () => {
  const game = newGame();
  game.patients = IDS.slice(0, 2).reduce(treat, START);
  treatAndTalk(game, IDS[2]); // all treated, the thank-you is still being said
  tick(game);
  tick(game);
  assert.deepEqual(game.log, [], "still in the conversation");
  tick(game, { playing: false }); // a fade or an interface
  assert.deepEqual(game.log, []);
  closeDialogue(game); // the last line (and its effects) is over
  tick(game);
  assert.deepEqual(game.log, ["closing", "start:chapter-2"]);

  // and in the game it only fires at a moment of plain play, not over another flow
  const source = read("src/game/world/GameWorld.tsx");
  const trigger = source.slice(
    source.indexOf("const closingChapterAvailable"),
    source.indexOf("const closingChapterAvailable") + 900,
  );
  assert.ok(trigger.includes("isPlaying &&"));
  assert.ok(trigger.includes('phaseRef.current === "playing"'));
  assert.ok(trigger.includes("afterDialogueRef.current === null"));
  assert.ok(trigger.includes("shouldCloseDay1(patientsRef.current"));
  // declared after the effect that runs the after-dialogue steps
  assert.ok(
    source.indexOf("const closingChapterAvailable") >
      source.indexOf(
        "}, [dialogue.active, startTransition, finishExamination]",
      ),
  );
});

test("it fires ONCE: the flag is claimed before the closing starts and Day 2 never reuses it", () => {
  const game = newGame();
  for (const id of IDS) treatAndTalk(game, id);
  closeDialogue(game);
  tick(game);
  for (let i = 0; i < 5; i++) tick(game);
  assert.deepEqual(game.log, ["closing", "start:chapter-2"]);
  assert.equal(day1.getDay1Status(game.claimed), "completed");
  // even back in chapter-1 terms, a re-render with the flag asks for nothing
  assert.equal(day1.shouldCloseDay1(game.patients, game.claimed), false);
  // and Day 2 leads on to Day 3 (the Day 1 rule only runs in chapter-1, so it never starts again)
  assert.equal(getNextChapterId("chapter-2"), "chapter-3");
  const source = read("src/game/world/GameWorld.tsx");
  const trigger = source.slice(
    source.indexOf("const closingChapterAvailable"),
    source.indexOf("const closingChapterAvailable") + 900,
  );
  assert.ok(
    trigger.indexOf("claimFlag(DAY1_COMPLETED_ID)") <
      trigger.indexOf("setClosingActive(true)"),
  );
  assert.ok(trigger.includes("claimedRewardsRef.current"));
});

test("there is no 'go home' step any more: no work-done remark, no arrival condition, fast travel is unrelated to the closing", () => {
  const dayCode = read("src/game/patients/day1.ts").replace(/\/\/.*$/gm, "");
  assert.ok(
    !/WORK_DONE|workDone|sceneId|apothecary|Fast|travel/i.test(dayCode),
  );
  assert.equal(talk.day1WorkDone, undefined);
  const source = read("src/game/world/GameWorld.tsx");
  assert.ok(
    !/day1WorkDone|DAY1_WORK_DONE|shouldAnnounceDay1WorkDone/.test(source),
  );
  assert.ok(!/DAY1_HOME_SCENE|world\.sceneId,\s*\n?\s*\}\)/.test(source));
  const rule = read("src/game/world/fastTravel.ts");
  assert.ok(!/day1|Day1|DAY1/.test(rule));
});

test("the closing is ONE sequence: the existing supper interlude whose first line is the caption", () => {
  assert.ok(NARRATIVE_ILLUSTRATIONS["doctor-eating"]);
  assert.ok(
    fs.existsSync(
      path.join(
        root,
        "public",
        NARRATIVE_ILLUSTRATIONS["doctor-eating"].src,
      ),
    ),
  );
  const source = read("src/game/world/GameWorld.tsx");
  assert.equal((source.match(/<NarrativeInterlude/g) ?? []).length, 2); // opening + closing
  assert.ok(source.includes('NARRATIVE_ILLUSTRATIONS["doctor-eating"]'));
  assert.match(source, /closingChapter === "chapter-2"\s*\? NARRATIVE_ILLUSTRATIONS\["doctor-fireplace"\]\s*: NARRATIVE_ILLUSTRATIONS\["doctor-eating"\]/);
  assert.ok(source.includes('closingChapter === "chapter-3"'));
  assert.ok(source.includes("onCovered={startNextChapter}"));
  assert.ok(source.includes("onFinished={finishClosing}"));
  // blocks movement and every interface exactly as the opening does
  assert.ok(
    source.includes("const interludeActive = openingActive || closingActive || endVisible;"),
  );
  // the caption is the first line of the closing; there is no second fade/message
  const es = localizeConversation(talk.day1Closing, "es", "doctor").lines;
  const en = localizeConversation(talk.day1Closing, "en", "doctor").lines;
  assert.equal(
    es[0].text,
    "Con los pacientes atendidos, regresas a casa para descansar.",
  );
  assert.equal(
    en[0].text,
    "With your patients cared for, you return home to rest.",
  );
  assert.ok(es.length >= 2 && es.length === en.length);
  assert.ok(!/regresas a casa|return home to rest/.test(source));
  // the interlude tells its owner when the picture covers the game
  const interlude = read("src/game/narrative/NarrativeInterlude.tsx");
  assert.ok(interlude.includes("onCovered?: () => void"));
  assert.ok(interlude.includes('phase !== "fade-in" && !coveredRef.current'));
});

test("Day 2 begins in the Doctor's Room on an EXISTING spawn, with no opening, and the story keeps everything of Day 1", () => {
  assert.equal(getNextChapterId("chapter-1"), "chapter-2");
  const start = getChapterStart("chapter-2");
  assert.equal(start.sceneId, "doctor-room");
  assert.equal(
    start.opening,
    undefined,
    "Day 1's introduction is not repeated",
  );
  assert.ok(
    WORLD_SCENES[start.sceneId].arrivals[start.spawnName],
    "the spawn exists in the scene",
  );
  // the same existing spawn Day 1 starts on
  assert.equal(start.spawnName, getChapterStart("chapter-1").spawnName);
  assert.equal(start.sceneId, getChapterStart("chapter-1").sceneId);
  // the active chapter is state now, and the swap touches only chapter + world
  const source = read("src/game/world/GameWorld.tsx");
  assert.ok(source.includes("const [chapterId, setChapterId] = useState("));
  const swap = source.slice(
    source.indexOf("const startNextChapter"),
    source.indexOf("const finishClosing"),
  );
  assert.ok(swap.includes("setChapterId(nextChapterId)"));
  assert.ok(swap.includes("setWorld("));
  assert.ok(swap.includes("chapterAdvancedRef"));
  for (const forbidden of [
    "setInventory",
    "setStorage",
    "setKnownRecipeIds",
    "setPatients",
    "setClaimedRewards",
    "setCollected",
    "claimFlag",
  ]) {
    assert.ok(!swap.includes(forbidden), `${forbidden} is not reset`);
  }
  // no saving and no daily reset were added
  assert.ok(!/localStorage|sessionStorage/.test(source));
  // the opening runs once per session and reads the initial chapter only
  assert.ok(
    source.includes("resolveChapterIntro(INITIAL_CHAPTER_ID, language)"),
  );
});

test("chapter-2 composition: the runtime has its slot; nothing is invented or copied from Day 1", () => {
  const slot = read("src/game/compositions/chapter-2.ts");
  assert.ok(slot.includes("export const chapter2Compositions"));
  // the slot is either still the pending placeholder or Kilian's real export
  assert.ok(slot.includes("PENDING EXPORT") || slot.includes("Exported from"));
  const index = read("src/game/compositions/index.ts");
  assert.ok(index.includes("...chapter2Compositions"));
  // nothing of chapter-1 is read for chapter-2
  for (const scene of ["plaza", "apothecary-street", "doctor-room"]) {
    const day2 = getComposition(scene, "chapter-2");
    assert.ok(
      !day2 || day2.instances.every((i) => !/chapter-1/.test(i.instanceId)),
      scene,
    );
    if (getComposition(scene, "chapter-1")) {
      assert.notEqual(getComposition(scene, "chapter-1"), day2);
    }
  }
  // no chapter-2 interactions or story were invented
  assert.ok(
    !/chapter-2/.test(read("src/game/compositions/chapter-1.interactions.ts")),
  );
});

test("ES and EN: the closing lines come from the data, with no text written in GameWorld", () => {
  for (const language of ["es", "en"]) {
    const closing = localizeConversation(talk.day1Closing, language, "doctor");
    assert.ok(closing.lines.length >= 2);
    assert.ok(closing.lines.every((l) => l.text.trim()));
  }
  const source = read("src/game/world/GameWorld.tsx");
  assert.ok(
    !/Tres enfermos|Three patients seen|Con los pacientes/.test(source),
  );
});

test("the cases are untouched by the closing and nothing else of Day 2 starts", () => {
  const game = newGame();
  for (const id of IDS) treatAndTalk(game, id);
  closeDialogue(game);
  tick(game);
  for (const id of IDS) {
    assert.equal(pc.getPatientStatus(game.patients, id), "treated");
  }
  // Day 3 exists since 2026-11-12: it has its own closing rule, and the Day 1 rule
  // (closingChapterAvailable) still only runs in chapter-1
  const source = read("src/game/world/GameWorld.tsx");
  assert.ok(source.includes('const closingChapterAvailable = chapterId === "chapter-1"'));
  // Day 4 closes the game with its own rule and an end card
  assert.ok(source.includes("<EndCard"));
});

console.log(`\n${passed} tests passed`);
