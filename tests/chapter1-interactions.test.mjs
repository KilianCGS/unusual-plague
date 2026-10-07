// Chapter 1 ambient interactions + tavern transition geometry, checked against
// the REAL data files (transpiled on the fly, no mocks).
//   node tests/chapter1-interactions.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

// Minimal TS loader: resolves relative imports to .ts files recursively.
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
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const { chapter1Compositions } = at("src/game/compositions/chapter-1.ts");
const { chapter1Interactions } = at(
  "src/game/compositions/chapter-1.interactions.ts",
);
const { getComposition, getChapterInteractions } = at(
  "src/game/compositions/index.ts",
);
const { chapter1AmbientDialogues } = at("src/game/dialogue/chapter1Dialogues.ts");
const { resolveInteractionConversation, resolveChapterIntro } = at(
  "src/game/dialogue/interactionDialogues.ts",
);
const { getSceneNpcs } = at("src/game/npcs/sceneNpcs.ts");
const { getSceneInteractionZones } = at("src/game/interactions/sceneInteractions.ts");
const smithyInterior = at("src/game/smithy-interior/smithyInteriorGeometry.ts");
const { withInteractions, resolveDecorInstances } = at(
  "src/game/decor/decorRuntime.ts",
);
const tavernInterior = at("src/game/tavern-interior/tavernInteriorGeometry.ts");
const tavernStreet = at("src/game/tavern-street/tavernStreetGeometry.ts");

const feet = ({ x, y }) => ({ x: x - 6, y: y - 19, width: 12, height: 12 });
const hit = (a, b) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

const instances = chapter1Compositions.flatMap((c) => c.instances);
const byId = new Map(instances.map((i) => [i.instanceId, i]));

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const NOT_INTERACTABLE = [
  "farm-cow-01",
  "farm-chicken-01",
  "farm-chicken-02",
  "plaza-merchant-cart-01",
  "plaza-merchant-table-01",
  // The baker is pending (narrative logic about her sick husband).
  "bakery-interior-baker-01",
];

test("26 interactable instances, all of them real chapter-1 instances", () => {
  const ids = Object.keys(chapter1Interactions);
  assert.equal(ids.length, 26);
  for (const id of ids) assert.ok(byId.has(id), `${id} is not in chapter-1.ts`);
});

test("cow, chickens, merchant cart/table and the baker have no interaction", () => {
  for (const id of NOT_INTERACTABLE) {
    assert.ok(byId.has(id), `${id} should exist in chapter-1.ts`);
    assert.equal(chapter1Interactions[id], undefined, id);
  }
});

test("interactionIds are stable names, unique per instance, never coordinates", () => {
  const ids = Object.values(chapter1Interactions).map((i) => i.interactionId);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^chapter1\.[A-Za-z]+\.[A-Za-z]+(\.\d+)?$/);
});

test("zones are sane rectangles relative to the anchor", () => {
  for (const [id, { zone }] of Object.entries(chapter1Interactions)) {
    assert.ok(zone.width > 0 && zone.height > 0, id);
    assert.ok(zone.offsetX < 0 && zone.offsetX + zone.width > 0, `${id}: spans the anchor in x`);
    assert.ok(zone.offsetY < 0 && zone.offsetY + zone.height > 0, `${id}: spans the anchor in y`);
  }
});

test("every interaction has a conversation with ES and EN text on every line", () => {
  for (const { interactionId } of Object.values(chapter1Interactions)) {
    const conversation = chapter1AmbientDialogues[interactionId];
    assert.ok(conversation, `no conversation for ${interactionId}`);
    assert.ok(conversation.lines.length >= 1);
    for (const line of conversation.lines) {
      assert.ok(["doctor", "subject"].includes(line.speaker));
      assert.ok(line.text.es.trim() && line.text.en.trim(), interactionId);
    }
  }
  assert.equal(
    Object.keys(chapter1AmbientDialogues).length,
    Object.keys(chapter1Interactions).length,
    "no orphan conversations",
  );
});

test("language switches the text; 'subject' binds to the instance, not to a position", () => {
  const es = resolveInteractionConversation("chapter1.plaza.merchant", "es", "plaza-merchant-01");
  const en = resolveInteractionConversation("chapter1.plaza.merchant", "en", "plaza-merchant-01");
  assert.equal(es.lines[0].text, "Amuletos contra la mala suerte. Garantía de tres días.");
  assert.equal(en.lines[0].text, "Charms against bad luck. Three-day guarantee.");
  assert.deepEqual(es.lines.map((l) => l.speaker), ["plaza-merchant-01", "doctor", "plaza-merchant-01"]);
  assert.equal(resolveInteractionConversation("nobody.home", "es", "x"), null);
});

test("sheep share content but keep their own interactionId and speaker", () => {
  for (const n of ["01", "02", "03"]) {
    const c = resolveInteractionConversation(`chapter1.farm.sheep.${n}`, "en", `farm-sheep-${n}`);
    assert.deepEqual(c.lines, [{ speaker: `farm-sheep-${n}`, text: "Baaah." }]);
  }
});

test("zones follow the instance: moving an NPC moves its zone, same interactionId", () => {
  const woodcutter = byId.get("forest-woodcutter-01");
  const moved = { ...woodcutter, x: woodcutter.x + 100, y: woodcutter.y - 40 };
  const a = resolveDecorInstances([woodcutter], chapter1Interactions).zones[0];
  const b = resolveDecorInstances([moved], chapter1Interactions).zones[0];
  assert.equal(a.interactionId, b.interactionId);
  assert.equal(b.x - a.x, 100);
  assert.equal(b.y - a.y, -40);
});

test("an interaction authored in the Decorator wins over the table", () => {
  const own = { interactionId: "custom.id", zone: { offsetX: -1, offsetY: -1, width: 2, height: 2 } };
  const [merged] = withInteractions([{ ...byId.get("farm-dog-01"), interaction: own }], chapter1Interactions);
  assert.equal(merged.interaction.interactionId, "custom.id");
});

test("COPY CHAPTER output cannot erase interactions: the table is a separate file", () => {
  assert.ok(instances.every((i) => i.interaction === undefined), "chapter-1.ts carries no interaction data");
  assert.equal(getChapterInteractions("chapter-1"), chapter1Interactions);
  assert.ok(getComposition("plaza", "chapter-1"));
  assert.equal(getComposition("plaza", "chapter-2"), undefined);
});

test("blacksmith: the Doctor can interact from south of the anvil", () => {
  const smith = byId.get("smithy-interior-blacksmith-01");
  const { zone } = chapter1Interactions[smith.instanceId];
  const anvil = smithyInterior.smithyInteriorColliders.find((c) => c.id === "smithy-interior-8");
  const feetY = anvil.y + anvil.height + 19; // closest the feet can get, below the anvil
  const hitbox = { x: smith.x - 6, y: feetY - 19, width: 12, height: 12 };
  const rect = { x: smith.x + zone.offsetX, y: smith.y + zone.offsetY, width: zone.width, height: zone.height };
  assert.ok(hit(hitbox, rect));
});

test("washerwoman and injured miner conversations", () => {
  const w = resolveInteractionConversation("chapter1.outskirts.washingWoman", "es", "w");
  assert.deepEqual(w.lines.map((l) => l.speaker), ["w", "doctor", "w"]);
  assert.equal(w.lines[0].text, "Doctor, con esa ropa negra debe de ser imposible saber cuándo está sucia.");
  const m = resolveInteractionConversation("chapter1.mine.injuredMiner", "en", "m");
  assert.deepEqual(m.lines.map((l) => l.speaker), ["m", "doctor", "doctor"]);
  assert.equal(m.lines[2].text, "Hold on. I'll be back soon with something to treat it.");
});

test("chapter 1 opening monologue: three Doctor lines, ES and EN", () => {
  for (const lang of ["es", "en"]) {
    const intro = resolveChapterIntro("chapter-1", lang);
    assert.equal(intro.lines.length, 3);
    assert.ok(intro.lines.every((l) => l.speaker === "doctor" && l.text.trim()));
  }
  assert.equal(resolveChapterIntro("chapter-1", "en").lines[0].text, "Another morning.");
  assert.equal(resolveChapterIntro("chapter-9", "es"), null);
});

test("the old pilot villager and its Plaza interaction zones are gone", () => {
  assert.deepEqual(getSceneNpcs("plaza"), []);
  assert.deepEqual(getSceneInteractionZones("plaza"), []);
});

// --- Tavern transition geometry -------------------------------------------

test("tavern interior spawn is free: no collider, not on the exit (no loop)", () => {
  const spawn = tavernInterior.tavernInteriorSpawns[0];
  for (const c of tavernInterior.tavernInteriorColliders) assert.ok(!hit(feet(spawn), c), c.id);
  for (const t of tavernInterior.tavernInteriorTransitions) assert.ok(!hit(feet(spawn), t), t.id);
});

test("tavern street spawn-3 is free and outside its own door zone (no loop)", () => {
  const spawn = tavernStreet.tavernStreetSpawns.find((s) => s.id === "tavern-street-spawn-3");
  for (const c of tavernStreet.tavernStreetColliders) assert.ok(!hit(feet(spawn), c), c.id);
  const door = tavernStreet.tavernStreetTransitions.find((t) => t.id === "tavern-street-transition-3");
  assert.ok(!hit(feet(spawn), door));
});

test("the doorway is open: the exit zone touches no collider", () => {
  const [exit] = tavernInterior.tavernInteriorTransitions;
  for (const c of tavernInterior.tavernInteriorColliders) assert.ok(!hit(exit, c), c.id);
});

console.log(`\n${passed} tests passed`);
