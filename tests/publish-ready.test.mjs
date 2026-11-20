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


const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

test("publishing (2026-11-20): link preview, credits in both languages, dev pages hidden in production, device notice, saved notice, final music credited", () => {
  const layout = read("src/app/layout.tsx");
  assert.ok(layout.includes("openGraph") && layout.includes("/og.png") && layout.includes("summary_large_image") && layout.includes("NEXT_PUBLIC_SITE_URL"));
  assert.ok(!layout.includes("point-and-click"), "the description no longer says point-and-click");
  const og = fs.readFileSync(path.join(root, "public/og.png"));
  assert.deepEqual([og.readUInt32BE(16), og.readUInt32BE(20)], [1200, 630]);
  const title = at("src/game/i18n/titleScreen.ts").titleScreenCopy;
  for (const lang of ["es", "en"]) {
    const credits = title[lang].aboutPanel.credits.join(" ");
    assert.ok(title[lang].aboutPanel.creditsTitle && title[lang].aboutPanel.credits.length === 3, lang);
    assert.ok(credits.includes("OFL") && credits.includes("Musopen") && credits.includes("Paul Pitman"), `${lang}: fonts and the final music are credited`);
  }
  const dev = read("src/app/dev/layout.tsx");
  assert.ok(dev.includes('NODE_ENV === "production"') && dev.includes("NEXT_PUBLIC_SHOW_DEV"));
  const { isLikelyWithoutKeyboard } = at("src/game/ui/DeviceNotice.tsx");
  assert.equal(isLikelyWithoutKeyboard(true, true, 390), true, "a phone");
  assert.equal(isLikelyWithoutKeyboard(true, true, 1024), true, "a tablet");
  assert.equal(isLikelyWithoutKeyboard(false, false, 1440), false, "a desktop");
  assert.equal(isLikelyWithoutKeyboard(false, false, 500), true, "a very narrow window");
  assert.ok(read("src/app/page.tsx").includes("<DeviceNotice"));
  const copy = at("src/game/i18n/saveCopy.ts").saveCopy;
  assert.equal(copy.es.saved, "Partida guardada.");
  assert.equal(copy.en.saved, "Game saved.");
  assert.ok(read("src/game/world/GameWorld.tsx").includes("saveCopy[language].saved"));
});

test("the final music is the public-domain recording (Ogg) and the unlicensed mp3 is no longer shipped", () => {
  const { SOUNDS } = at("src/game/audio/soundManifest.ts");
  assert.equal(SOUNDS["music.end"].src, "/game/audio/music/endgame.ogg");
  const file = fs.readFileSync(path.join(root, "public/game/audio/music/endgame.ogg"));
  assert.equal(file.slice(0, 4).toString(), "OggS", "a real Ogg file");
  assert.ok(!fs.existsSync(path.join(root, "public/game/audio/music/endgame.mp3")));
});

console.log(`
${passed} tests passed`);
