// Doctor's Run: the run itself (speeds, sprites, west mirror, the Space key) and
// the Doctor's run remarks (the 5 s rule, the cooldown, the shuffle bag).
// Pure logic against the real source files; nothing here depends on real chance.
//   node tests/doctors-run.test.mjs
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
    compilerOptions: { module: "commonjs", target: "es2022", jsx: "react-jsx" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    // CSS modules: every class name is its own key.
    if (id.endsWith(".css")) {
      return new Proxy({}, { get: (_, key) => String(key) });
    }

    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const candidate of [
        base + ".ts",
        base + ".tsx",
        path.join(base, "index.ts"),
      ]) {
        if (fs.existsSync(candidate)) return load(candidate);
      }
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const run = at("src/game/protagonist/protagonistRun.ts");
const { createRunInput } = at("src/game/protagonist/runInput.ts");
const bag = at("src/game/bark/shuffleBag.ts");
const barks = at("src/game/bark/runBarks.ts");
const { runBarkLines } = at("src/game/i18n/runBarks.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// A small deterministic generator (mulberry32): same seed, same sequence.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- RUN

test("walk is 160 units/s at 120 ms per frame (4 frames); run is 240 (+50%) at 60 ms per frame (8 frames)", () => {
  assert.equal(run.PROTAGONIST_WALK_SPEED, 160);
  assert.equal(run.PROTAGONIST_RUN_SPEED, 240);
  assert.equal(run.PROTAGONIST_RUN_SPEED / run.PROTAGONIST_WALK_SPEED, 1.5);
  assert.equal(run.PROTAGONIST_WALK_FRAME_DURATION, 120);
  assert.equal(run.PROTAGONIST_RUN_FRAME_DURATION, 60);
  assert.equal(run.PROTAGONIST_RUN_FRAME_COUNT, 8);
  // the run cycle lasts as long as the walk cycle (8 x 60 = 4 x 120 = 480 ms)
  assert.equal(
    run.PROTAGONIST_RUN_FRAME_COUNT * run.PROTAGONIST_RUN_FRAME_DURATION,
    480,
  );
  // a slow frame can never move the Doctor further than his 12px feet hitbox
  assert.equal(run.MAX_FRAME_DELTA_SECONDS, 1 / 30);
  assert.ok(run.PROTAGONIST_RUN_SPEED * run.MAX_FRAME_DELTA_SECONDS < 12);
  // the controller uses these (its walk default is the walk constant)
  const controller = read("src/game/protagonist/useProtagonistController.ts");
  assert.ok(
    controller.includes("DEFAULT_PLAYER_SPEED = PROTAGONIST_WALK_SPEED"),
  );
  assert.ok(controller.includes("PROTAGONIST_RUN_SPEED"));
  assert.ok(controller.includes("MAX_FRAME_DELTA_SECONDS"));
});

test("south, north and east run with their own frames; west runs with the east ones, mirrored", () => {
  for (const direction of ["south", "north", "east"]) {
    for (let frame = 0; frame < 8; frame++) {
      assert.deepEqual(run.getRunSprite(direction, frame), {
        src: `/game/characters/protagonist/run/${direction}/${frame}.png`,
        mirrored: false,
      });
    }
  }
  for (let frame = 0; frame < 8; frame++) {
    assert.deepEqual(run.getRunSprite("west", frame), {
      src: `/game/characters/protagonist/run/east/${frame}.png`,
      mirrored: true,
    });
  }
  // the 24 real frames exist; west has none of its own
  for (const direction of ["south", "north", "east"]) {
    for (let frame = 0; frame < 8; frame++) {
      assert.ok(
        fs.existsSync(
          path.join(
            root,
            "public/game/characters/protagonist/run",
            direction,
            `${frame}.png`,
          ),
        ),
      );
    }
  }
  assert.ok(
    !fs.existsSync(
      path.join(root, "public/game/characters/protagonist/run/west"),
    ),
  );
  assert.equal(Object.keys(run.PROTAGONIST_RUN_SPRITES).length, 3);
});

test("the 24 run frames are 96x96 RGBA PNGs, and the old 4-frame set is gone (no 8.png)", () => {
  for (const direction of ["south", "north", "east"]) {
    for (let frame = 0; frame < 8; frame++) {
      const png = fs.readFileSync(
        path.join(
          root,
          "public/game/characters/protagonist/run",
          direction,
          `${frame}.png`,
        ),
      );
      assert.equal(png.readUInt32BE(16), 96);
      assert.equal(png.readUInt32BE(20), 96);
      assert.equal(png[25], 6, "RGBA");
    }
    assert.ok(
      !fs.existsSync(
        path.join(
          root,
          "public/game/characters/protagonist/run",
          direction,
          "8.png",
        ),
      ),
    );
  }
});

test("walking is untouched: 4 frames per direction at 120 ms", () => {
  const controller = read("src/game/protagonist/useProtagonistController.ts");
  for (const direction of ["south", "north", "east", "west"]) {
    for (let frame = 0; frame < 4; frame++) {
      assert.ok(
        fs.existsSync(
          path.join(
            root,
            `public/game/characters/protagonist/walk/${direction}/${frame}.png`,
          ),
        ),
      );
      assert.ok(
        controller.includes(`/walk/${direction}/${frame}.png`),
        `${direction} ${frame}`,
      );
    }
    assert.ok(
      !controller.includes(`/walk/${direction}/4.png`),
      "walk has no 5th frame",
    );
  }
  assert.ok(
    controller.includes(
      "DEFAULT_WALK_FRAME_DURATION = PROTAGONIST_WALK_FRAME_DURATION",
    ),
  );
});

test("switching between walking (4 frames) and running (8) keeps the phase and never reads a missing frame", () => {
  const controller = read("src/game/protagonist/useProtagonistController.ts");
  // the run frame count is the run constant, never a hard-coded 4
  assert.ok(controller.includes("PROTAGONIST_RUN_FRAME_COUNT"));
  assert.ok(controller.includes("currentPlayer.frame * 2"));
  assert.ok(controller.includes("Math.floor(currentPlayer.frame / 2)"));
  assert.ok(controller.includes("% frameCount"));
  assert.ok(!/% 4/.test(controller));
  // the same mapping as a pure check: every walk frame maps inside the run cycle and back
  for (let walkFrame = 0; walkFrame < 4; walkFrame++) {
    const asRun = walkFrame * 2;
    assert.ok(asRun < run.PROTAGONIST_RUN_FRAME_COUNT);
    assert.equal(Math.floor(asRun / 2), walkFrame);
  }
  for (let runFrame = 0; runFrame < 8; runFrame++) {
    assert.ok(Math.floor(runFrame / 2) < 4);
  }
});

test("idle | walk | run", () => {
  assert.equal(run.getMovementState(false, false), "idle");
  assert.equal(run.getMovementState(true, false), "walk");
  assert.equal(run.getMovementState(true, true), "run");
});

test("the run key: a fresh Space press arms it only while the game takes input", () => {
  const key = createRunInput();
  // input off (dialogue, interface, fade...): Space is not the run's
  assert.equal(key.keyDown(false), false);
  assert.equal(key.isArmed(), false);
  key.setEnabled(true);
  assert.equal(
    key.keyDown(false),
    true,
    "the run takes the key (preventDefault)",
  );
  assert.equal(key.isArmed(), true);
  key.keyUp();
  assert.equal(key.isArmed(), false, "releasing Space goes back to walking");
});

test("the run key: auto-repeat never re-arms, and losing input disarms", () => {
  const key = createRunInput();
  key.setEnabled(true);
  key.keyDown(false);
  key.keyUp();
  // a repeat (key still physically held after it was disarmed) does not arm
  assert.equal(key.keyDown(true), true);
  assert.equal(key.isArmed(), false);
  key.keyDown(false);
  assert.equal(key.isArmed(), true);
  // a dialogue / interface / fade starts: input off disarms
  key.setEnabled(false);
  assert.equal(key.isArmed(), false);
  // input back while Space is still held: only repeats arrive, nothing arms
  key.setEnabled(true);
  key.keyDown(true);
  key.keyDown(true);
  assert.equal(key.isArmed(), false);
  key.reset();
  assert.equal(key.isArmed(), false);
});

test("closing a dialogue while holding Space does not start a run", () => {
  const key = createRunInput();
  key.setEnabled(false); // the dialogue is open
  key.keyDown(false); // the Space that closes its last line
  key.setEnabled(true); // input comes back
  for (let i = 0; i < 5; i++) key.keyDown(true); // the key is still held
  assert.equal(key.isArmed(), false);
  key.keyUp();
  key.keyDown(false); // a deliberate new press
  assert.equal(key.isArmed(), true);
});

test("a transition keeps the run intent: still holding Space when control returns, the run resumes with no new press", () => {
  const key = createRunInput();
  key.setEnabled(true);
  key.keyDown(false); // running, Space held
  assert.equal(key.isArmed(), true);
  key.beginTransition(); // the fade starts
  key.setEnabled(false); // the old scene reports no input
  assert.equal(key.isArmed(), false, "no running while the screen fades");
  key.setEnabled(false); // the new scene mounts, also with no input
  key.keyDown(true); // the key repeats while held (ignored)
  key.endTransition(true); // control returns
  key.setEnabled(true);
  assert.equal(key.isArmed(), true, "the run comes back by itself");
});

test("a transition does not keep an intent that was not there: a Space held only for a dialogue never runs", () => {
  const key = createRunInput();
  key.setEnabled(true);
  // a dialogue opens (no transition): input off, the run intent is dropped
  key.setEnabled(false);
  key.keyDown(false); // the Space that advances / closes the dialogue
  key.setEnabled(true);
  assert.equal(key.isArmed(), false);
  // ...and then a scene change while that same Space is still held
  key.beginTransition();
  key.setEnabled(false);
  key.setEnabled(false);
  key.endTransition(true);
  key.setEnabled(true);
  assert.equal(key.isArmed(), false, "holding Space is not an intent to run");
});

test("releasing Space during a transition cancels the intent", () => {
  const key = createRunInput();
  key.setEnabled(true);
  key.keyDown(false);
  key.beginTransition();
  key.setEnabled(false);
  key.keyUp(); // released while the screen is black
  key.endTransition(true);
  key.setEnabled(true);
  assert.equal(key.isArmed(), false);
  // pressing it again after control returns arms it as usual
  key.keyDown(false);
  assert.equal(key.isArmed(), true);
});

test("the run intent is only given back when control really returns (not into a dialogue, not after a reset)", () => {
  const key = createRunInput();
  key.setEnabled(true);
  key.keyDown(false);
  key.beginTransition();
  key.setEnabled(false);
  // the transition ends but a dialogue starts on arrival: input is not back
  key.endTransition(false);
  key.setEnabled(true); // the dialogue closes later
  assert.equal(key.isArmed(), false);
  // losing the window while the screen fades drops it too
  const other = createRunInput();
  other.setEnabled(true);
  other.keyDown(false);
  other.beginTransition();
  other.setEnabled(false);
  other.reset();
  other.endTransition(true);
  other.setEnabled(true);
  assert.equal(other.isArmed(), false);
});

test("normal interfaces (Book, Map, Storage, Crafting) never turn Space into a run", () => {
  const key = createRunInput();
  key.setEnabled(true);
  key.setEnabled(false); // an interface opens: no transition mark
  assert.equal(key.keyDown(false), false, "Space stays with the interface");
  assert.equal(key.keyDown(true), false);
  key.setEnabled(true); // it closes with Space still held
  assert.equal(key.isArmed(), false);
});

test("GameWorld marks the scene changes for the run key (and only those)", () => {
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(world.includes("input.run?.beginTransition()"));
  assert.ok(world.includes("input.run?.endTransition(isPlaying)"));
  assert.ok(
    /useLayoutEffect\(\(\) => \{\s*if \(phase === "playing"\)/.test(world),
  );
});

test("Space alone does not move the Doctor; running changes only speed and animation", () => {
  const controller = read(
    "src/game/protagonist/useProtagonistController.ts",
  ).replace(/\/\/.*$/gm, "");
  // the run needs an active direction
  assert.ok(/activeDirection !== undefined &&/.test(controller));
  // the speed is only ever used to move along that direction
  assert.equal(controller.split("speed * deltaTime").length - 1, 1);
  const moveBlock = controller.slice(
    controller.indexOf("if (activeDirection) {"),
    controller.indexOf(
      "} else {",
      controller.indexOf("if (activeDirection) {"),
    ),
  );
  assert.ok(moveBlock.includes("speed * deltaTime"));
  // physics is the same code for walking and running
  assert.ok(
    moveBlock.includes("getHitboxRect(proposedX, proposedY, feetHitbox)") ||
      /getHitboxRect\(\s*proposedX,\s*proposedY,\s*feetHitbox,?\s*\)/.test(
        moveBlock,
      ),
  );
  assert.ok(
    moveBlock.includes("collidesWithScene(proposedFeetHitbox, sceneColliders)"),
  );
  assert.ok(
    !/isRunning|running/.test(
      moveBlock.split("const isBlocked")[0].split("speed * deltaTime")[1] ?? "",
    ),
  );
  // the feet hitbox did not change
  const { PROTAGONIST_FEET_HITBOX } = at(
    "src/game/protagonist/useProtagonistController.ts",
  );
  assert.deepEqual(PROTAGONIST_FEET_HITBOX, {
    offsetX: -6,
    offsetY: -19,
    width: 12,
    height: 12,
  });
});

test("the west mirror is visual only: it flips the image around its centre and moves nothing", () => {
  const sprite = read("src/game/protagonist/ProtagonistSprite.tsx");
  assert.ok(sprite.includes("scaleX(-1)"));
  assert.ok(sprite.includes('transformOrigin: "50% 100%"'));
  // x / y of the anchor are untouched by it
  assert.ok(/left: x,\s*top: y/.test(sprite));
  // both scenes pass it, from the controller
  for (const file of [
    "src/game/world/ExteriorScene.tsx",
    "src/game/apothecary/ApothecaryScene.tsx",
  ]) {
    const source = read(file);
    assert.ok(source.includes("mirrored={spriteMirrored}"), file);
    assert.ok(
      source.includes("useReportRunning(player.isRunning, onRunningChange)"),
      file,
    );
  }
});

test("the 24 run frames are preloaded (3 x 8), and nothing is preloaded for west", () => {
  const source = read("src/game/protagonist/protagonistRun.ts");
  assert.ok(source.includes("export function preloadRunSprites"));
  assert.ok(
    read("src/game/protagonist/useProtagonistController.ts").includes(
      "preloadRunSprites()",
    ),
  );
  assert.equal(
    Object.values(run.PROTAGONIST_RUN_SPRITES).reduce(
      (n, list) => n + list.length,
      0,
    ),
    24,
  );
  for (const list of Object.values(run.PROTAGONIST_RUN_SPRITES)) {
    assert.equal(list.length, 8);
  }
});

// ---------------------------------------------------------------- SHUFFLE BAG

function drawAll(random, size, count, startBag) {
  let current = startBag ?? bag.createShuffleBag(size, random);
  const out = [];
  for (let i = 0; i < count; i++) {
    const drawn = bag.drawFromBag(current, size, random);
    out.push(drawn.index);
    current = drawn.bag;
  }
  return out;
}

test("shuffle bag: no phrase repeats until all of them were said", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const first = drawAll(seeded(seed), 15, 15);
    assert.equal(new Set(first).size, 15, `seed ${seed}`);
    assert.deepEqual(
      [...first].sort((a, b) => a - b),
      Array.from({ length: 15 }, (_, i) => i),
    );
  }
});

test("shuffle bag: it refills when empty, and a new round never starts with the last phrase", () => {
  for (let seed = 1; seed <= 300; seed++) {
    const random = seeded(seed);
    const draws = drawAll(random, 15, 15 * 4);
    for (let round = 0; round < 4; round++) {
      const slice = draws.slice(round * 15, round * 15 + 15);
      assert.equal(new Set(slice).size, 15, `seed ${seed} round ${round}`);
    }
    for (let i = 15; i < draws.length; i += 15) {
      assert.notEqual(draws[i], draws[i - 1], `seed ${seed} at ${i}`);
    }
  }
});

test("shuffle bag: same randomness, same order; it never mutates what it is given", () => {
  assert.deepEqual(drawAll(seeded(7), 15, 15), drawAll(seeded(7), 15, 15));
  assert.notDeepEqual(drawAll(seeded(7), 15, 15), drawAll(seeded(8), 15, 15));
  const original = bag.createShuffleBag(5, seeded(3));
  const snapshot = JSON.stringify(original);
  bag.drawFromBag(original, 5, seeded(3));
  assert.equal(JSON.stringify(original), snapshot);
  // a bag of one phrase still works (it cannot avoid repeating)
  assert.deepEqual(drawAll(seeded(1), 1, 3), [0, 0, 0]);
});

// ---------------------------------------------------------------- RUN BARKS

const COUNT = runBarkLines.es.length;
const step = (
  tracker,
  seconds,
  running = true,
  visible = false,
  random = seeded(1),
) => barks.advanceRunBark(tracker, seconds, running, visible, COUNT, random);
// runs `seconds` of running in 0.1 s steps, collecting every phrase emitted
function runFor(tracker, seconds, random = seeded(1)) {
  const said = [];
  let current = tracker;
  for (let t = 0; t < Math.round(seconds * 10); t++) {
    const result = step(current, 0.1, true, false, random);
    current = result.tracker;
    if (result.phraseIndex !== null) said.push(result.phraseIndex);
  }
  return { tracker: current, said };
}

test("run barks: 15 phrases in both languages, in the specified order", () => {
  assert.equal(runBarkLines.es.length, 15);
  assert.equal(runBarkLines.en.length, 15);
  assert.equal(
    runBarkLines.es[0],
    "Creo que hoy ya he hecho bastante ejercicio.",
  );
  assert.equal(runBarkLines.es[11], "Soy médico. No atleta.");
  assert.equal(runBarkLines.es[14], "Insisto: caminar sigue disponible.");
  for (const lang of ["es", "en"]) {
    assert.equal(new Set(runBarkLines[lang]).size, 15);
    assert.ok(runBarkLines[lang].every((line) => line.trim().length > 0));
  }
});

test("run barks: nothing before 5 s of continuous running, a remark right after", () => {
  const tracker = barks.createRunBarkTracker(COUNT, seeded(1));
  assert.equal(barks.RUN_BARK_AFTER_SECONDS, 5);
  const before = runFor(tracker, 4.9);
  assert.deepEqual(before.said, []);
  const after = runFor(before.tracker, 0.2);
  assert.equal(after.said.length, 1);
  assert.ok(after.said[0] >= 0 && after.said[0] < COUNT);
});

test("run barks: stopping before 5 s starts the count over (the phrases used are not reset)", () => {
  let tracker = barks.createRunBarkTracker(COUNT, seeded(1));
  tracker = runFor(tracker, 4).tracker;
  assert.ok(tracker.continuousSeconds > 3.9);
  tracker = step(tracker, 0.1, false).tracker; // stopped
  assert.equal(tracker.continuousSeconds, 0);
  // 4 more seconds is still not enough...
  const again = runFor(tracker, 4);
  assert.deepEqual(again.said, []);
  // ...but 1.1 more makes it 5.1 of continuous running
  assert.equal(runFor(again.tracker, 1.1).said.length, 1);
  // the bag is untouched by stopping
  assert.deepEqual(
    step(barks.createRunBarkTracker(COUNT, seeded(1)), 0.1, false).tracker.bag,
    barks.createRunBarkTracker(COUNT, seeded(1)).bag,
  );
});

test("run barks: 30 s of RUNNING between remarks, and the cooldown only counts while running", () => {
  assert.equal(barks.RUN_BARK_COOLDOWN_SECONDS, 30);
  const first = runFor(barks.createRunBarkTracker(COUNT, seeded(1)), 5.1);
  assert.equal(first.said.length, 1);
  // 10 s more: nothing (cooldown 30 - 10 left)
  const soon = runFor(first.tracker, 10);
  assert.deepEqual(soon.said, []);
  // stopping for any real time spends none of it: a stopped step changes no cooldown
  const stopped = step(soon.tracker, 100, false).tracker;
  assert.equal(stopped.cooldownSeconds, soon.tracker.cooldownSeconds);
  // running again: the cooldown that was left (~20 s) is still pending
  assert.ok(stopped.cooldownSeconds > 19 && stopped.cooldownSeconds < 21);
  const early = runFor(stopped, 15);
  assert.deepEqual(early.said, [], "still on cooldown after the stop");
  // after the rest of the cooldown AND 5 s of continuous running: the next one
  const next = runFor(early.tracker, 6);
  assert.equal(next.said.length, 1);
});

test("run barks: only one is visible at a time", () => {
  let tracker = barks.createRunBarkTracker(COUNT, seeded(1));
  tracker = runFor(tracker, 5.1).tracker;
  // keep running far past the cooldown while a remark is still on screen
  let current = tracker;
  let said = 0;
  for (let t = 0; t < 400; t++) {
    const result = step(current, 0.1, true, true); // visible = true
    current = result.tracker;
    if (result.phraseIndex !== null) said++;
  }
  assert.equal(said, 0);
});

test("run barks: the whole bag comes out before any phrase repeats (across stops and remarks)", () => {
  let tracker = barks.createRunBarkTracker(COUNT, seeded(5));
  const random = seeded(5);
  const said = [];
  while (said.length < COUNT * 2) {
    // run a while, stop, run again: stopping never loses or repeats a phrase
    tracker = step(tracker, 0.1, false, false, random).tracker;
    const result = runFor(tracker, 36, random);
    tracker = result.tracker;
    said.push(...result.said);
  }
  assert.equal(new Set(said.slice(0, COUNT)).size, COUNT);
  assert.equal(new Set(said.slice(COUNT, COUNT * 2)).size, COUNT);
  assert.notEqual(
    said[COUNT],
    said[COUNT - 1],
    "the new round does not start with the last phrase",
  );
});

test("run barks: they go away the moment plain play stops (dialogue, interface, narrative, fade)", () => {
  assert.equal(barks.visibleRunBarkIndex(3, true), 3);
  assert.equal(barks.visibleRunBarkIndex(3, false), null);
  assert.equal(barks.visibleRunBarkIndex(null, true), null);
  // GameWorld enables them exactly while the Doctor can move (isPlaying covers
  // the fade, the dialogue, the opening, the Book, the Map, Storage, Crafting
  // and the narrative scenes)
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(
    world.includes(
      "useRunBark({ running: doctorRunning, enabled: isPlaying })",
    ),
  );
  assert.ok(
    /const isPlaying =\s*phase === "playing" &&[\s\S]*?!inNarrativeScene;/.test(
      world,
    ),
  );
  const hook = read("src/game/bark/useRunBark.ts");
  assert.ok(hook.includes("if (!enabled && phraseIndex !== null)"));
});

test("a remark is not a conversation: it takes no input and blocks nothing", () => {
  const hook = read("src/game/bark/useRunBark.ts");
  const view = read("src/game/bark/PlayerBark.tsx");
  const css = read("src/game/bark/PlayerBark.module.css");
  // it is drawn and removed by CSS: no timers, no keys, no game phase
  for (const source of [hook, view]) {
    assert.ok(!/setTimeout|setInterval/.test(source));
    assert.ok(
      !/addEventListener|useDialogue|changePhase|inputEnabled/.test(source),
    );
  }
  assert.ok(/pointer-events:\s*none/.test(css));
  assert.ok(/animation:\s*bark-life/.test(css));
  // the lifetime is 3 s (2.5-3.5 s)
  const { BARK_SECONDS } = at("src/game/bark/PlayerBark.tsx");
  assert.ok(BARK_SECONDS >= 2.5 && BARK_SECONDS <= 3.5);
  // GameWorld draws it in the scene overlay layer and never opens a dialogue
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(world.includes("{renderRunBark(context)}"));
  assert.ok(!/dialogue\.start\([^)]*runBark/.test(world));
  // the scenes only REPORT whether the Doctor runs
  assert.equal(world.split("onRunningChange={setDoctorRunning}").length - 1, 2);
});

console.log(`\n${passed} tests passed`);
