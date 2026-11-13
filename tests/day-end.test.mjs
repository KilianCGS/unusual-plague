// The end of a day (2026-11-13): the last case is treated > the Doctor says he should rest (once) >
// a sign asks him to go to the Botica and the fast travel is off > in the Botica the day closes.
//   node tests/day-end.test.mjs
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
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const candidate of [base + ".ts", path.join(base, "index.ts")]) if (fs.existsSync(candidate)) return load(candidate);
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    if (id.includes("useProtagonistController")) return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const de = at("src/game/world/dayEnd.ts");
const { canFastTravel } = at("src/game/world/fastTravel.ts");
const { dayEndCopy } = at("src/game/i18n/dayEnd.ts");
const { CHAPTER1_PATIENTS } = at("src/game/patients/chapter1Patients.ts");
const { CHAPTER2_PATIENTS } = at("src/game/patients/chapter2Patients.ts");
const { CHAPTER3_PATIENTS } = at("src/game/patients/chapter3Patients.ts");
const { DAY1_COMPLETED_ID } = at("src/game/patients/day1.ts");

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log("ok -", name); };

const allTreated = (cases) => Object.fromEntries(Object.keys(cases).map((id) => [id, "treated"]));
const oneLeft = (cases) => ({ ...allTreated(cases), [Object.keys(cases)[0]]: "examined" });
const DAYS = [["chapter-1", CHAPTER1_PATIENTS], ["chapter-2", CHAPTER2_PATIENTS], ["chapter-3", CHAPTER3_PATIENTS]];

test("the Doctor announces the end of the day only when the LAST case is treated, and only once", () => {
  for (const [chapter, cases] of DAYS) {
    assert.equal(de.shouldAnnounceDayEnd(chapter, oneLeft(cases), new Set()), false, chapter);
    assert.equal(de.shouldAnnounceDayEnd(chapter, allTreated(cases), new Set()), true, chapter);
    const flag = de.DAY_WIND_DOWN_FLAGS[chapter];
    assert.ok(flag);
    assert.equal(de.shouldAnnounceDayEnd(chapter, allTreated(cases), new Set([flag])), false, "once");
  }
  assert.equal(de.shouldAnnounceDayEnd("chapter-4", {}, new Set()), false, "Day 4 ends with the Witch");
});

test("the day closes only AFTER he said it and ONLY inside the Botica or his room", () => {
  for (const [chapter, cases] of DAYS) {
    const flag = de.DAY_WIND_DOWN_FLAGS[chapter];
    const treated = allTreated(cases);
    assert.equal(de.shouldCloseDayNow(chapter, treated, new Set(), "apothecary-interior"), false, "he has not said it yet");
    assert.equal(de.shouldCloseDayNow(chapter, treated, new Set([flag]), "plaza"), false, "out in the street");
    assert.equal(de.shouldCloseDayNow(chapter, treated, new Set([flag]), "forest"), false);
    assert.equal(de.shouldCloseDayNow(chapter, treated, new Set([flag]), "apothecary-interior"), true, chapter);
    assert.equal(de.shouldCloseDayNow(chapter, treated, new Set([flag]), "doctor-room"), true);
    assert.equal(de.shouldCloseDayNow(chapter, oneLeft(cases), new Set([flag]), "apothecary-interior"), false, "a case is missing");
  }
});

test("once the day is closed (its completed flag) nothing asks for it again and the sign goes", () => {
  const treated = allTreated(CHAPTER1_PATIENTS);
  const flags = new Set([de.DAY_WIND_DOWN_FLAGS["chapter-1"], DAY1_COMPLETED_ID]);
  assert.equal(de.isDayWindingDown("chapter-1", treated, flags), false);
  assert.equal(de.shouldCloseDayNow("chapter-1", treated, flags, "apothecary-interior"), false);
});

test("the fast travel is off while the day is over, and the rule stays free of story words", () => {
  const base = { sceneId: "plaza", phase: "playing", openingActive: false, tutorialStep: "done", dialogueActive: false, bookOpen: false, mapVisible: false, storageOpen: false, craftingOpen: false, inNarrativeScene: false };
  assert.equal(canFastTravel(base), true);
  assert.equal(canFastTravel({ ...base, dayOver: true }), false);
  assert.ok(!/patient|reward|quest|chapter|story/i.test(read("src/game/world/fastTravel.ts").replace(/\/\/.*$/gm, "")));
});

test("the thoughts and the sign exist in both languages, one thought per day", () => {
  for (const lang of ["es", "en"]) {
    assert.ok(dayEndCopy[lang].sign.trim());
    for (const [chapter] of DAYS) assert.ok(dayEndCopy[lang].thoughts[chapter]?.trim(), `${lang}/${chapter}`);
  }
  assert.equal(dayEndCopy.es.sign, "Ve a la botica");
  assert.equal(dayEndCopy.es.thoughts["chapter-1"], "Creo que por hoy he hecho un buen trabajo. Debería descansar.");
});

test("GameWorld wires it: thought, sign instead of the fast travel, closing at home", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes("shouldAnnounceDayEnd(chapterId"));
  assert.ok(game.includes("shouldCloseDayNow(chapterId"));
  assert.ok(game.includes("<DayEndSign"));
  assert.ok(game.includes("dayOver,")); // fed to the fast travel rule
  assert.ok(game.includes("doctorThought(line"));
});

console.log(`\n${passed} tests passed`);
