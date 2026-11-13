// Key bindings: presets, rebinding rules, validation of what is stored, and that every
// key handler of the game asks the bindings instead of a fixed key (2026-11-13).
//   node tests/controls.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

function load(file) {
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(js, file);
  return mod.exports;
}
const kb = load(path.join(root, "src/game/controls/keybindings.ts"));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

test("the default is WASD with the arrows as the alternative, E, Space, Q, Tab and R", () => {
  const b = kb.defaultBindings();
  assert.deepEqual(b.up, ["w", "ArrowUp"]);
  assert.deepEqual(b.left, ["a", "ArrowLeft"]);
  assert.deepEqual(b.interact, ["e"]);
  assert.deepEqual(b.run, ["Space"]);
  assert.deepEqual(b.book, ["q"]);
  assert.deepEqual(b.map, ["Tab"]);
  assert.deepEqual(b.objectives, ["r"]);
  assert.equal(kb.presetOf(b), "wasd");
});

test("every preset gives each action its slots, with no key used twice", () => {
  for (const [id, preset] of Object.entries(kb.PRESETS)) {
    const all = [];
    for (const action of kb.CONTROL_ACTIONS) {
      assert.equal(preset[action].length, kb.SLOTS_PER_ACTION[action], `${id}/${action}`);
      all.push(...preset[action]);
    }
    assert.equal(new Set(all).size, all.length, `${id} repeats a key`);
    assert.ok(all.every((k) => kb.isAssignable(k)), `${id} uses a reserved key`);
  }
});

test("keys are normalised to what the keycap shows", () => {
  assert.equal(kb.normalizeKey("W"), "w");
  assert.equal(kb.normalizeKey(" "), "Space");
  assert.equal(kb.normalizeKey("ArrowUp"), "ArrowUp");
  assert.ok(kb.matchesAction(kb.defaultBindings(), "book", "Q"));
  assert.ok(kb.matchesAction(kb.defaultBindings(), "run", " "));
  assert.ok(!kb.matchesAction(kb.defaultBindings(), "book", "e"));
});

test("Escape and Enter can never be assigned; an unusable key changes nothing", () => {
  const b = kb.defaultBindings();
  assert.equal(kb.assignKey(b, "interact", 0, "Escape"), b);
  assert.equal(kb.assignKey(b, "interact", 0, "Enter"), b);
  assert.equal(kb.assignKey(b, "interact", 0, "Dead"), b);
  assert.equal(kb.assignKey(b, "interact", 5, "x"), b);
});

test("assigning a free key replaces the old one; assigning a used key SWAPS, never leaves a hole", () => {
  const b = kb.defaultBindings();
  const f = kb.assignKey(b, "interact", 0, "F");
  assert.deepEqual(f.interact, ["f"]);
  assert.deepEqual(b.interact, ["e"]); // the original is untouched
  const swapped = kb.assignKey(b, "book", 0, "e"); // E was Interact
  assert.deepEqual(swapped.book, ["e"]);
  assert.deepEqual(swapped.interact, ["q"]);
  // the main and the alternative key of a direction swap as well
  const s2 = kb.assignKey(b, "up", 0, "ArrowUp");
  assert.deepEqual(s2.up, ["ArrowUp", "w"]);
  // after any sequence of changes no key is repeated
  let x = b;
  for (const [a, slot, key] of [["run", 0, "q"], ["map", 0, "r"], ["left", 1, "d"], ["down", 0, "Shift"]]) {
    x = kb.assignKey(x, a, slot, key);
  }
  const all = kb.CONTROL_ACTIONS.flatMap((a) => x[a]);
  assert.equal(new Set(all).size, all.length);
  assert.equal(kb.presetOf(x), null);
});

test("what comes from storage is validated: anything odd falls back to the default", () => {
  const good = JSON.parse(JSON.stringify(kb.PRESETS.zqsd));
  assert.deepEqual(kb.sanitizeBindings(good), kb.PRESETS.zqsd);
  const dflt = kb.defaultBindings();
  assert.deepEqual(kb.sanitizeBindings(null), dflt);
  assert.deepEqual(kb.sanitizeBindings("x"), dflt);
  assert.deepEqual(kb.sanitizeBindings({ ...good, up: ["w"] }), dflt); // wrong slot count
  assert.deepEqual(kb.sanitizeBindings({ ...good, interact: ["z"] }), dflt); // repeated key
  assert.deepEqual(kb.sanitizeBindings({ ...good, interact: ["Escape"] }), dflt); // reserved
  assert.deepEqual(kb.sanitizeBindings({ ...good, interact: ["E"] }), dflt); // not normalised
});

test("keys are written on the keycap as the player would read them", () => {
  assert.equal(kb.keyLabel("Space", "es"), "ESPACIO");
  assert.equal(kb.keyLabel("Space", "en"), "SPACE");
  assert.equal(kb.keyLabel("w", "es"), "W");
  assert.equal(kb.keyLabel("ArrowLeft", "en"), "←");
});

test("every handler reads the bindings; no fixed movement / book / map / interact / objectives key is left", () => {
  const checks = [
    ["src/game/protagonist/useDirectionInput.ts", ['matchesAction(getBindings(), "run"', "directionOfKey(getBindings()"]],
    ["src/game/book/useBookHotkeys.ts", ['matchesAction(getBindings(), "book"']],
    ["src/game/map/useMapHold.ts", ['matchesAction(getBindings(), "map"']],
    ["src/game/interactions/useInteraction.ts", ['matchesAction(getBindings(), "interact"']],
    ["src/game/objectives/ObjectivesPanel.tsx", ['matchesAction(getBindings(), "objectives"']],
  ];
  for (const [file, needles] of checks) {
    const src = read(file);
    for (const needle of needles) assert.ok(src.includes(needle), `${file}: ${needle}`);
  }
  assert.ok(!/event\.key === "(q|Q|e|E|r|R|Tab)"/.test(read("src/game/book/useBookHotkeys.ts") + read("src/game/map/useMapHold.ts") + read("src/game/interactions/useInteraction.ts")));
  assert.ok(!/directionKeys\b/.test(read("src/game/protagonist/useDirectionInput.ts")));
});

test("the controls screen and the pause menu exist, are reachable and block the Doctor", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("<PauseMenu") && game.includes("<ControlsPanel"));
  assert.ok(game.includes("!pauseOpen"));
  assert.ok(read("src/app/page.tsx").includes("<ControlsPanel"));
  assert.ok(read("src/app/page.tsx").includes('onQuit={() => transitionToPhase("title")}'));
  // the pause only opens in plain play, never over another interface
  assert.ok(/const canPause = isPlaying;/.test(game));
  // texts exist in both languages for every action
  const copy = load(path.join(root, "src/game/i18n/controls.ts")).controlsCopy;
  for (const lang of ["es", "en"]) {
    for (const action of kb.CONTROL_ACTIONS) assert.ok(copy[lang].actionNames[action], `${lang}/${action}`);
    for (const preset of Object.keys(kb.PRESETS)) assert.ok(copy[lang].presetNames[preset], `${lang}/${preset}`);
    assert.ok(copy[lang].pause.quitWarning && copy[lang].pause.resume);
  }
});

console.log(`\n${passed} tests passed`);
