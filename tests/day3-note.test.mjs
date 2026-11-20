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
const assets = at("src/game/decor/decorAssets.ts");
const notes = at("src/game/dialogue/chapter3Notes.ts");

const png = (rel) => { const f = fs.readFileSync(path.join(root, "public", rel)); return [f.readUInt32BE(16), f.readUInt32BE(20)]; };

test("the Day 3 note: a pick-up scroll in front of the Botica, on the spot of Kilian's interaction zone, only on Day 3", () => {
  const asset = assets.getDecorAsset("note-scroll");
  assert.ok(asset && asset.collectibleItemId === notes.DAY3_BOTICA_NOTE && asset.collectibleItemId.startsWith(notes.NOTE_PREFIX));
  assert.deepEqual(png(asset.sprite.frames[0]), [asset.sprite.frameWidth, asset.sprite.frameHeight]);
  const here = comps.getComposition("apothecary-street", "chapter-3").instances.find((i) => i.assetId === "note-scroll");
  assert.ok(here, "placed on Day 3");
  // the bottom centre of the zone x429 y389 27x26
  assert.deepEqual([here.x, here.y], [442, 415]);
  for (const chapter of ["chapter-1", "chapter-2", "chapter-4"]) {
    assert.ok(!(comps.getComposition("apothecary-street", chapter)?.instances ?? []).some((i) => i.assetId === "note-scroll"), `not on ${chapter}`);
  }
});

test("reading it: the Doctor reads that the mine is shut and a stonecutter is unwell, in ES and EN, and it gives no item", () => {
  const note = notes.getNoteConversation(notes.DAY3_BOTICA_NOTE);
  assert.ok(note && note.lines.length >= 3);
  const es = note.lines.map((l) => l.text.es).join(" ");
  const en = note.lines.map((l) => l.text.en).join(" ");
  assert.match(es, /mina/); assert.match(es, /picapedrero|cantera/);
  assert.match(en, /mine/i); assert.match(en, /stonecutter|quarry/i);
  assert.ok(note.lines.every((l) => l.speaker === "doctor"));
  const game = fs.readFileSync(path.join(root, "src/game/world/GameWorld.tsx"), "utf8");
  assert.ok(game.includes("NOTE_PREFIX") && game.includes("getNoteConversation"), "GameWorld reads notes instead of picking them up");
  // the note is not an item: it is not in the item catalogue
  assert.equal(at("src/game/items/items.ts").ITEMS?.[notes.DAY3_BOTICA_NOTE], undefined);
});

console.log(`
${passed} tests passed`);
