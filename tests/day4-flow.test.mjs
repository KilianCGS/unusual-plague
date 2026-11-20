// Day 4 is at night (2026-11-12): night paintings, the night grade, the Witch's house.
//   node tests/day4-night.test.mjs
//   node tests/day3.test.mjs
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
  const source = fs.readFileSync(file, "utf8");
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = new Module(file);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  const base = mod.require.bind(mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base0 = path.resolve(path.dirname(file), id);
      for (const ext of [".ts", ".tsx", "/index.ts", ""]) {
        const candidate = base0 + ext;
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return load(candidate);
      }
    }
    if (id.endsWith(".module.css")) return new Proxy({}, { get: (_, k) => String(k) });
    return base(id);
  };
  cache.set(file, mod);
  mod._compile(out, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};


const comps = at("src/game/compositions/index.ts");
const c4 = at("src/game/dialogue/chapter4Dialogues.ts");
const inv = at("src/game/inventory/inventory.ts");
const story = at("src/game/dialogue/storyInteractions.ts");
const facts = (pairs, claimed = []) => ({
  patients: {}, inventory: pairs.reduce((st, [id, q]) => inv.addItem(st, id, q), inv.createEmptyInventory()), claimedRewards: new Set(claimed),
});
const talk = (id, f) => story.resolveStoryInteraction(id, f, "es", "w");

test("Day 4 places the Witch outside (facing us) and inside (seated, with cat and ravens); each reaches its own conversation", () => {
  const interactions = comps.getChapterInteractions("chapter-4");
  const outside = comps.getComposition("forest-cottage", "chapter-4").instances.find((i) => i.assetId === "witch-conjuring-front");
  const inside = comps.getComposition("forest-cottage-interior", "chapter-4").instances;
  assert.ok(outside, "the Witch outside is placed");
  assert.equal(interactions[outside.instanceId].interactionId, c4.WITCH_OUTSIDE_INTERACTION_ID);
  assert.equal(outside.instanceId, c4.WITCH_OUTSIDE_INSTANCE_ID);
  const seated = inside.find((i) => i.assetId === "witch-tavern-sitting");
  assert.equal(interactions[seated.instanceId].interactionId, c4.WITCH_FINAL_INTERACTION_ID);
  assert.deepEqual(inside.filter((i) => i.assetId.startsWith("witch-crow")).map((i) => interactions[i.instanceId]), [undefined, undefined, undefined], "ravens and cat do not talk");
  assert.ok(inside.some((i) => i.assetId === "witch-cat-sitting"));
});

test("outside: with the feather she asks him in (claimed once) and then leaves; without it he is told to look for it", () => {
  const without = talk(c4.WITCH_OUTSIDE_INTERACTION_ID, facts([]));
  assert.deepEqual(without.effects, []);
  const first = talk(c4.WITCH_OUTSIDE_INTERACTION_ID, facts([["black-feather", 1]]));
  assert.equal(first.conversation.id, "chapter4.witch.outside");
  assert.deepEqual(first.effects, [{ type: "claim-reward", rewardId: c4.WITCH_OUTSIDE_ID }]);
  assert.deepEqual(talk(c4.WITCH_OUTSIDE_INTERACTION_ID, facts([["black-feather", 1]], [c4.WITCH_OUTSIDE_ID])).effects, []);
  assert.ok(first.conversation.lines.some((l) => /casa|inside/i.test(l.text)), "she tells him to go in");
  assert.deepEqual([...c4.getDay4HiddenInstanceIds(false)], []);
  assert.deepEqual([...c4.getDay4HiddenInstanceIds(true)], [c4.WITCH_OUTSIDE_INSTANCE_ID]);
});

test("the last conversation mentions what protects him, still only needs the feather and is not spent", () => {
  const final = talk(c4.WITCH_FINAL_INTERACTION_ID, facts([["black-feather", 1]]));
  assert.equal(final.conversation.id, "chapter4.witch.final");
  assert.ok(final.conversation.lines.some((l) => /hechizo|spell/i.test(l.text)));
  assert.deepEqual(final.effects, [{ type: "claim-reward", rewardId: c4.WITCH_FINAL_ID }]);
});

test("the end card shows the epilogue about the artifacts before the end, in both languages", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { EndCard } = at("src/game/ui/EndCard.tsx");
  const es = renderToStaticMarkup(React.createElement(EndCard, { language: "es" }));
  const en = renderToStaticMarkup(React.createElement(EndCard, { language: "en" }));
  assert.ok(es.indexOf("nadie quiere curarse") !== -1 && es.indexOf("nadie quiere curarse") < es.indexOf("FIN"));
  assert.ok(en.indexOf("nobody wants to be cured") !== -1 && en.indexOf("nobody wants to be cured") < en.indexOf("The end"));
});

test("Day 4 begins with the Doctor puzzled by a light and a noise, and every villager answers with silence", () => {
  assert.ok(c4.day4Wake.lines.length >= 3);
  assert.ok(c4.day4Wake.lines.every((l) => /^\(.+\)$/.test(l.text.es) && /^\(.+\)$/.test(l.text.en)), "all thoughts, ES and EN");
  assert.ok(c4.day4Wake.lines.some((l) => /luz/.test(l.text.es)) && c4.day4Wake.lines.some((l) => /zumbido|ruido/.test(l.text.es)));
  const game = fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8");
  assert.ok(game.includes("DAY4_WAKE_ID") && game.includes('world.sceneId !== "doctor-room"'));
  for (const slug of ["baker", "child", "fainted", "somebody"]) {
    const out = talk(`chapter4.artifact.${slug}`, facts([]));
    const [greet, silence] = out.conversation.lines;
    assert.doesNotMatch(greet.text, /^\(/);
    assert.match(silence.text, /^\(.+\)$/);
    assert.deepEqual(out.effects, []);
  }
});

test("two small sounds with what already exists (2026-11-20): something new in the errands panel, and the Witch vanishing", () => {
  const sounds = at("src/game/audio/soundManifest.ts").SOUND_IDS;
  const panel = fs.readFileSync(path.join(root, "src/game/objectives/ObjectivesPanel.tsx"), "utf8");
  const game = fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8");
  assert.ok(sounds.includes("ui.bookTab") && sounds.includes("craft.recipeCrafted"));
  assert.ok(panel.includes('playSound("ui.bookTab")'), "the panel makes a sound when something new appears");
  assert.match(game, /playSound\("craft\.recipeCrafted"\);\s+startStayFade/, "a chime as the Witch vanishes");
});

console.log(`
${passed} tests passed`);
