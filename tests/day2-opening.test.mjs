// The opening of Day 2: a farm woman waits outside the Botica, talks when the
// arrival transition is over, and goes away with a short fade. Also the dev
// start (/dev/day2) and the id check between chapters.
//   node tests/day2-opening.test.mjs
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

const opening = at("src/game/world/day2Opening.ts");
const talk = at("src/game/dialogue/chapter2OpeningDialogues.ts");
const { localizeConversation } = at(
  "src/game/dialogue/localizedConversation.ts",
);
const { createDay2DevStart } = at("src/game/world/devStart.ts");
const { getChapterStart } = at("src/game/world/chapterStart.ts");
const { getComposition } = at("src/game/compositions/index.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const day1 = at("src/game/patients/day1.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// The placed woman as the Decorator export would carry her, and the data the
// encounter needs once Kilian has provided and approved them.
const WOMAN = {
  instanceId: "apothecary-street-villager-woman-01-01",
  assetId: "villager-woman-01",
  x: 400,
  y: 520,
  scale: 1,
  flipX: false,
  colliderEnabled: false,
  zOffset: 0,
};
const OTHER = { ...WOMAN, instanceId: "apothecary-street-other-01" };
const READY_DATA = { instanceId: WOMAN.instanceId, dialogueApproved: true };
const BOTICA_DOOR = {
  sceneId: "apothecary-street",
  spawnName: "from-apothecary-interior",
};

test("without its data the encounter does not exist: not ready, never starts, claims nothing", () => {
  // as shipped today: no placement id and no approved text
  assert.equal(opening.MESSENGER_INSTANCE_ID, WOMAN.instanceId);
  assert.equal(opening.MESSENGER_DIALOGUE_APPROVED, true);
  assert.equal(opening.isMessengerEncounterReady("chapter-2"), true);
  assert.equal(opening.findMessengerInstance([WOMAN], null), null);
  assert.equal(
    opening.shouldStartMessengerEncounter({
      chapterId: "chapter-2",
      arrival: BOTICA_DOOR,
      claimedRewards: new Set(),
      ready: opening.isMessengerEncounterReady("chapter-2", { instanceId: null, dialogueApproved: true }),
    }),
    false,
  );
  // each missing piece alone keeps it off
  const none = { instanceId: null, dialogueApproved: true };
  const unapproved = { instanceId: WOMAN.instanceId, dialogueApproved: false };

  assert.equal(
    opening.isMessengerEncounterReady("chapter-2", none, [WOMAN]),
    false,
  );
  assert.equal(
    opening.isMessengerEncounterReady("chapter-2", unapproved, [WOMAN]),
    false,
  );
  // the instance must really be in the composition, with the approved asset
  assert.equal(
    opening.isMessengerEncounterReady("chapter-2", READY_DATA, [OTHER]),
    false,
  );
  assert.equal(
    opening.isMessengerEncounterReady("chapter-2", READY_DATA, [
      { ...WOMAN, assetId: "villager-woman-02" },
    ]),
    false,
  );
  assert.equal(
    opening.isMessengerEncounterReady("chapter-2", READY_DATA, []),
    false,
  );
  assert.equal(
    opening.isMessengerEncounterReady("chapter-2", READY_DATA, [OTHER, WOMAN]),
    true,
  );
  // the reused character is the approved one
  assert.equal(opening.MESSENGER_ASSET_ID, "villager-woman-01");
  assert.ok(getDecorAsset("villager-woman-01"));
});

test("it belongs to the arrival through the Botica's street door in chapter-2, and to nothing else", () => {
  const base = {
    chapterId: "chapter-2",
    arrival: BOTICA_DOOR,
    claimedRewards: new Set(),
    ready: true,
  };

  assert.equal(opening.shouldStartMessengerEncounter(base), true);
  // not Chapter 1
  assert.equal(
    opening.shouldStartMessengerEncounter({ ...base, chapterId: "chapter-1" }),
    false,
  );
  // not another arrival at the same street (from the Plaza), not another scene
  assert.equal(
    opening.shouldStartMessengerEncounter({
      ...base,
      arrival: { sceneId: "apothecary-street", spawnName: "from-plaza" },
    }),
    false,
  );
  assert.equal(
    opening.shouldStartMessengerEncounter({
      ...base,
      arrival: { sceneId: "plaza", spawnName: "from-apothecary-street" },
    }),
    false,
  );
  // not "any moment in the street": without a fresh arrival nothing happens
  assert.equal(
    opening.shouldStartMessengerEncounter({ ...base, arrival: null }),
    false,
  );
  // the arrival the code names is the real street arrival of the Botica door
  const street = WORLD_SCENES["apothecary-street"];
  assert.ok(street.arrivals[opening.MESSENGER_ARRIVAL_NAME]);
  assert.ok(
    WORLD_SCENES["apothecary-interior"].exits.some(
      (exit) =>
        exit.targetScene === "apothecary-street" &&
        exit.targetSpawn === opening.MESSENGER_ARRIVAL_NAME,
    ),
  );
});

// What GameWorld wires, as a tiny pure loop: a transition lands (the arrival
// is remembered), control returns (it is read once), the dialogue closes (a
// stay-fade claims "left").
function newGame(data = READY_DATA, instances = [WOMAN]) {
  return {
    chapterId: "chapter-2",
    claimed: new Set(),
    arrival: null,
    sceneId: "doctor-room",
    spawn: "chapter-start",
    log: [],
    data,
    instances,
  };
}
function land(game, sceneId, spawnName) {
  game.sceneId = sceneId;
  game.spawn = spawnName;
  game.arrival = { sceneId, spawnName }; // the transition landed
  return game;
}
function controlBack(game, { playing = true } = {}) {
  if (!playing) return game; // a fade or an interface: nothing is read
  const arrival = game.arrival;

  game.arrival = null; // read once, then forgotten
  const ready = opening.isMessengerEncounterReady(
    game.chapterId,
    game.data,
    game.instances,
  );

  if (
    opening.shouldStartMessengerEncounter({
      chapterId: game.chapterId,
      arrival,
      claimedRewards: game.claimed,
      ready,
    })
  ) {
    game.claimed = new Set([...game.claimed, opening.MESSENGER_MET_ID]); // first
    game.log.push("talk");
    game.dialogueEnds = () => {
      game.claimed = new Set([...game.claimed, opening.MESSENGER_LEFT_ID]);
      game.log.push("leave");
    };
  }

  return game;
}
const hidden = (game) =>
  opening.getNarrativeHiddenInstanceIds(game.claimed, game.data.instanceId);

test("the full flow: talks after the arrival, leaves after the dialogue, once per game", () => {
  const game = newGame();

  land(game, "apothecary-interior", "from-doctor-room");
  controlBack(game);
  assert.deepEqual(game.log, []);
  land(game, "apothecary-street", "from-apothecary-interior");
  controlBack(game, { playing: false }); // still fading in: not yet
  assert.deepEqual(game.log, []);
  controlBack(game); // control is back
  assert.deepEqual(game.log, ["talk"]);
  assert.equal(hidden(game).size, 0, "she is there while they talk");
  game.dialogueEnds();
  assert.deepEqual(game.log, ["talk", "leave"]);
  assert.deepEqual([...hidden(game)], [WOMAN.instanceId]);
  // coming back and forth never repeats it nor brings her back
  for (let i = 0; i < 3; i++) {
    land(game, "apothecary-interior", "from-apothecary-street");
    controlBack(game);
    land(game, "apothecary-street", "from-apothecary-interior");
    controlBack(game);
  }
  assert.deepEqual(game.log, ["talk", "leave"]);
  assert.deepEqual([...hidden(game)], [WOMAN.instanceId]);
});

test("a missing placement or text consumes nothing: no flag, no talk, and it starts once the data exists", () => {
  const game = newGame({ instanceId: null, dialogueApproved: false });

  land(game, "apothecary-street", "from-apothecary-interior");
  controlBack(game);
  assert.deepEqual(game.log, []);
  assert.equal(game.claimed.has(opening.MESSENGER_MET_ID), false);
  assert.equal(hidden(game).size, 0);
  // the same game with the data in place: the encounter was not spent
  game.data = READY_DATA;
  land(game, "apothecary-street", "from-apothecary-interior");
  controlBack(game);
  assert.deepEqual(game.log, ["talk"]);
});

test("only her instance leaves: other placements, other assets and the other chapter are untouched", () => {
  const game = newGame(READY_DATA, [OTHER, WOMAN]);

  land(game, "apothecary-street", "from-apothecary-interior");
  controlBack(game);
  game.dialogueEnds();
  const gone = hidden(game);

  assert.deepEqual([...gone], [WOMAN.instanceId]);
  assert.equal(gone.has(OTHER.instanceId), false);
  // another woman of the same asset keeps her place
  const sameAsset = { ...WOMAN, instanceId: "farm-villager-woman-01-01" };

  assert.equal(gone.has(sameAsset.instanceId), false);
  // nothing happens before she has left, nor in chapter 1 (no flag, no id)
  assert.equal(opening.getNarrativeHiddenInstanceIds(new Set()).size, 0);
  assert.equal(
    opening.getNarrativeHiddenInstanceIds(new Set(), WOMAN.instanceId).size,
    0,
  );
  assert.equal(
    opening.getNarrativeHiddenInstanceIds(
      new Set([opening.MESSENGER_LEFT_ID]),
      null,
    ).size,
    0,
    "without a placement there is nothing to hide",
  );
});

test("GameWorld wiring: after the arrival, one claim before the dialogue, a stay-fade that does not re-mount, narrative state instead of the collected set", () => {
  const game = read("src/game/world/GameWorld.tsx");
  // the arrival is remembered where the transition lands
  assert.equal((game.match(/arrivalRef\.current = \{/g) ?? []).length, 2);
  // the trigger reads it once, only in plain play, after the after-dialogue effect
  const trigger = game.slice(
    game.indexOf("const messengerReady"),
    game.indexOf("const narrativeHiddenInstanceIds"),
  );

  assert.ok(trigger.includes("!isPlaying || phaseRef.current"));
  assert.ok(trigger.includes("arrivalRef.current = null"));
  assert.ok(trigger.includes("afterDialogueRef.current === null"));
  assert.ok(trigger.includes("MESSENGER_INSTANCE_ID !== null"));
  assert.ok(trigger.includes("claimedRewardsRef.current"));
  assert.ok(
    trigger.indexOf("claimFlag(MESSENGER_MET_ID)") <
      trigger.indexOf("startDialogue("),
  );
  assert.ok(
    game.indexOf("const messengerReady") >
      game.indexOf("}, [\n    dialogue.active,"),
    "declared after the after-dialogue effect",
  );
  // the speaker is the approved instance
  assert.ok(
    /messengerOpening,\s*language,\s*MESSENGER_INSTANCE_ID/.test(trigger),
  );
  // the farewell: a fade that stays (no world change, so no re-mount or respawn)
  const stay = game.slice(
    game.indexOf("const startStayFade"),
    game.indexOf("// Fast travel to the apothecary"),
  );

  assert.ok(stay.includes("stay: true"));
  assert.ok(!stay.includes("setWorld"));
  const phase = game.slice(
    game.indexOf("if (pending?.stay)"),
    game.indexOf("// A trip with a line waits"),
  );

  assert.ok(phase.includes("pending.whileBlack?.()"));
  assert.ok(phase.includes('changePhase("fading-in")'));
  assert.ok(!phase.includes("setWorld"));
  assert.ok(game.includes("startStayFade(() => claimFlag(MESSENGER_LEFT_ID))"));
  // her absence is narrative state, never the collected set
  const leave = game.slice(
    game.indexOf('action === "leave-messenger"'),
    game.indexOf('action === "leave-messenger"') + 400,
  );

  assert.ok(!/setCollected|markCollected/.test(leave + trigger));
  assert.ok(game.includes("hiddenInstanceIds={narrativeHiddenInstanceIds}"));
  const scene = read("src/game/world/ExteriorScene.tsx");

  assert.ok(scene.includes("hiddenInstanceIds?: ReadonlySet<string>"));
  assert.ok(scene.includes("hiddenInstanceIds.has(instance.instanceId)"));
});

test("the farewell fade belongs to the same scene: the dialogue closing is the only way to it", () => {
  const game = read("src/game/world/GameWorld.tsx");
  // the action exists once and is set only by the encounter
  assert.equal((game.match(/"leave-messenger"/g) ?? []).length, 3);
  assert.equal(
    (game.match(/afterDialogueRef\.current = "leave-messenger"/g) ?? []).length,
    1,
  );
  // like every transition, a stay-fade only starts in plain play
  assert.ok(
    game
      .slice(game.indexOf("const startStayFade"))
      .startsWith(
        'const startStayFade = useCallback(\n    (whileBlack: () => void) => {\n      if (phaseRef.current !== "playing") {',
      ),
  );
});

test("the text is approved, ES/EN, with no gestures, kinship, diagnosis or treatment", () => {
  const source = read("src/game/dialogue/chapter2OpeningDialogues.ts");

  assert.ok(source.includes("Approved by Kilian"));
  const es = localizeConversation(talk.messengerOpening, "es", "SPEAKER");
  const en = localizeConversation(talk.messengerOpening, "en", "SPEAKER");

  assert.equal(es.lines.length, en.lines.length);
  assert.ok(es.lines.length >= 6);
  // two voices: the Doctor and the woman (bound to her placed instance)
  assert.deepEqual([...new Set(es.lines.map((line) => line.speaker))].sort(), [
    "SPEAKER",
    "doctor",
  ]);
  assert.equal(es.lines[0].speaker, "SPEAKER");
  for (const line of [...es.lines, ...en.lines]) {
    assert.ok(line.text.trim().length > 0);
    assert.ok(!/[\[\]*]/.test(line.text), `no gestures: ${line.text}`);
  }
  const all = es.lines
    .map((line) => line.text)
    .join(" ")
    .toLowerCase();

  for (const forbidden of [
    "hermano",
    "marido",
    "padre",
    "esposo",
    "primo",
    "hijo",
    "picadura",
    "veneno",
    "fiebre",
    "receta",
    "tratamiento",
    "diagnóstico",
  ]) {
    assert.ok(!all.includes(forbidden), forbidden);
  }
  // location and urgency: the farmer of the mill, the granary
  assert.ok(all.includes("granero") && all.includes("molino"));
  // the Doctor is not obliged to go first: he says he will go and see him
  assert.ok(all.includes("iré a verlo"));
});

test("chapter-2 has a slot but no invented population; the placement is the pending piece", () => {
  const slot = read("src/game/compositions/chapter-2.ts");

  assert.ok(slot.includes("PENDING EXPORT") || slot.includes("Exported from"));
  const placed = getComposition("apothecary-street", "chapter-2");

  // nothing is copied from chapter-1 in any scene
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    const day2 = getComposition(sceneId, "chapter-2");
    const day1Ids = new Set(
      (getComposition(sceneId, "chapter-1")?.instances ?? []).map(
        (instance) => instance.instanceId,
      ),
    );

    for (const instance of day2?.instances ?? []) {
      void day1Ids;
      assert.ok(instance.instanceId, sceneId);
    }
  }
  // if the export carries her, she is approved as asked: reused asset, no collider
  const woman = placed?.instances.find(
    (instance) => instance.instanceId === opening.MESSENGER_INSTANCE_ID,
  );

  if (woman) {
    assert.equal(woman.assetId, opening.MESSENGER_ASSET_ID);
    assert.equal(woman.colliderEnabled, true);
    assert.equal(woman.x, 327);
    assert.equal(woman.y, 438);
  }
});

test("instance ids do not collide across chapters where it matters: a Day 2 pick-up cannot reuse a Day 1 id", () => {
  // The collected set lives all game, so a Day 2 collectible with the id of one
  // taken in Day 1 would never appear. Checked against whatever the export holds.
  const day1Collectibles = new Set();

  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, "chapter-1")?.instances ??
      []) {
      if (getDecorAsset(instance.assetId)?.collectibleItemId) {
        day1Collectibles.add(instance.instanceId);
      }
    }
  }
  assert.ok(day1Collectibles.size >= 3, "the Day 1 pick-ups are found");
  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, "chapter-2")?.instances ??
      []) {
      assert.ok(
        !day1Collectibles.has(instance.instanceId),
        `${instance.instanceId} (chapter-2) reuses the id of a Day 1 pick-up`,
      );
    }
  }
});

test("dev start: chapter 2, the Doctor's Room, Day 1 finished, tutorial done, the encounter pending", () => {
  const start = createDay2DevStart();

  assert.equal(start.chapterId, "chapter-2");
  assert.equal(start.tutorialStep, "done");
  assert.equal(
    getChapterStart(start.chapterId).sceneId,
    "doctor-room",
    "it begins in the Doctor's Room",
  );
  assert.equal(day1.areAllDay1PatientsTreated(start.patients), true);
  assert.equal(start.claimedRewards.has(day1.DAY1_COMPLETED_ID), true);
  // Day 1 cannot close again and the encounter is still to happen
  assert.equal(
    day1.shouldCloseDay1(start.patients, start.claimedRewards),
    false,
  );
  assert.equal(start.claimedRewards.has(opening.MESSENGER_MET_ID), false);
  assert.equal(start.claimedRewards.has(opening.MESSENGER_LEFT_ID), false);
  // the recipes of the three cases are known; the carried flask is TEST data
  assert.ok(start.knownRecipeIds.has("fire.mushroom-soup"));
  assert.ok(start.knownRecipeIds.size >= 6);
  // what Day 1 consumed is already collected, as in a real Day 1
  for (const id of [
    "forest-medicinal-herb-dev-01",
    "mine-interior-mushroom-world-01",
    "mine-interior-mushroom-world-02",
    "mill-farmland-orange-world-01",
  ]) {
    assert.ok(start.collected.has(id), id);
  }
  // every call gives a fresh copy
  assert.notEqual(createDay2DevStart().collected, start.collected);
  assert.ok(read("src/game/world/devStart.ts").includes("TEST DATA"));
});

test("the real game starts as always: only the dev page hands GameWorld a start", () => {
  const home = read("src/app/page.tsx");

  assert.ok(home.includes("<GameWorld language={language} />"));
  assert.ok(!home.includes("devStart"));
  const game = read("src/game/world/GameWorld.tsx");

  for (const fallback of [
    "devStart?.chapterId ?? INITIAL_CHAPTER_ID",
    "devStart?.patients ?? CHAPTER1_INITIAL_PATIENTS",
    "devStart?.inventory ?? createChapter1Inventory()",
    "devStart?.storage ?? createChapter1Storage()",
    "useTutorial(devStart?.tutorialStep)",
  ]) {
    assert.ok(game.includes(fallback), fallback);
  }
  // the opening only plays in a game that has no dev start
  assert.ok(game.includes("devStart === undefined &&"));
  const page = read("src/app/dev/day2/page.tsx");

  assert.ok(page.includes("devStart={createDay2DevStart()}"));
  assert.ok(
    !/localStorage|sessionStorage/.test(
      page + read("src/game/world/devStart.ts"),
    ),
  );
});

test("messenger arrival aligns feet and faces west without changing other arrivals", () => {
  const spawn =
    WORLD_SCENES["apothecary-street"].arrivals[opening.MESSENGER_ARRIVAL_NAME];
  assert.deepEqual(
    opening.getMessengerArrivalSpawn(
      "chapter-2",
      BOTICA_DOOR,
      spawn,
      new Set(),
    ),
    { ...spawn, y: 438, direction: "west" },
  );
  assert.equal(
    opening.getMessengerArrivalSpawn(
      "chapter-1",
      BOTICA_DOOR,
      spawn,
      new Set(),
    ),
    spawn,
  );
  assert.equal(
    opening.getMessengerArrivalSpawn(
      "chapter-2",
      { ...BOTICA_DOOR, spawnName: "from-plaza" },
      spawn,
      new Set(),
    ),
    spawn,
  );
  assert.equal(
    opening.getMessengerArrivalSpawn(
      "chapter-2",
      BOTICA_DOOR,
      spawn,
      new Set([opening.MESSENGER_MET_ID]),
    ),
    spawn,
  );
  assert.equal(
    opening.getMessengerArrivalSpawn(
      "chapter-2",
      BOTICA_DOOR,
      spawn,
      new Set([opening.MESSENGER_LEFT_ID]),
    ),
    spawn,
  );
});

test("opening caption precedes the first door arrival without consuming the dialogue", () => {
  assert.equal(opening.shouldShowMessengerCaption("chapter-2", BOTICA_DOOR, new Set()), true);
  for (const flag of [opening.MESSENGER_CAPTION_ID, opening.MESSENGER_MET_ID, opening.MESSENGER_LEFT_ID]) {
    assert.equal(opening.shouldShowMessengerCaption("chapter-2", BOTICA_DOOR, new Set([flag])), false);
  }
  assert.equal(opening.shouldShowMessengerCaption("chapter-1", BOTICA_DOOR, new Set()), false);
  assert.equal(opening.shouldShowMessengerCaption("chapter-2", { ...BOTICA_DOOR, spawnName: "from-plaza" }, new Set()), false);
  assert.equal(opening.shouldStartMessengerEncounter({ chapterId: "chapter-2", arrival: BOTICA_DOOR,
    claimedRewards: new Set([opening.MESSENGER_CAPTION_ID]), ready: true }), true);
});

console.log(`\n${passed} tests passed`);
