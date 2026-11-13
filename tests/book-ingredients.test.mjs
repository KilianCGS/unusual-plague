// INGREDIENTES of the Medical Book: four complete hand-painted spreads per
// language, chosen by the game's language.
//   node tests/book-ingredients.test.mjs
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

const { buildBookSections, BOOK_SECTIONS, BOOK_WIDTH, BOOK_HEIGHT } = at(
  "src/game/book/bookPages.ts",
);
const { bookCopy } = at("src/game/i18n/book.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const context = (language) => ({
  language,
  patients: ch1.CHAPTER1_INITIAL_PATIENTS,
  inventory: { capacity: 6, slots: Array(6).fill(null) },
  knownRecipeIds: new Set(),
});
const ingredients = (language) =>
  buildBookSections(context(language)).find((s) => s.id === "ingredients");
const publicFile = (src) => path.join(root, "public", src);
const pngSize = (file) => {
  const buffer = fs.readFileSync(file);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const PATHS = (language) =>
  [1, 2, 3, 4].map(
    (n) => `/game/ui/book/ingredients/${language}/ingredients-0${n}.png`,
  );

test("INGREDIENTES has exactly 4 spreads, one complete image each, in both languages", () => {
  for (const language of ["es", "en"]) {
    const section = ingredients(language);
    assert.equal(section.spreads.length, 4, language);
    section.spreads.forEach((spread, index) => {
      assert.equal(spread.id, `ingredients-${index + 1}`);
      assert.equal(spread.layers.length, 1, "one full-size layer");
      assert.equal(spread.texts, undefined, "no text drawn over the image");
      const [layer] = spread.layers;
      assert.deepEqual(
        [layer.x, layer.y, layer.width, layer.height],
        [0, 0, BOOK_WIDTH, BOOK_HEIGHT],
        "the whole book area, never a crop",
      );
      assert.equal(layer.smooth, true);
    });
  }
});

test("ES uses the four Spanish images and EN the four English ones, in the same order", () => {
  assert.deepEqual(
    ingredients("es").spreads.map((s) => s.layers[0].src),
    PATHS("es"),
  );
  assert.deepEqual(
    ingredients("en").spreads.map((s) => s.layers[0].src),
    PATHS("en"),
  );
  for (let i = 0; i < 4; i++) {
    assert.equal(
      ingredients("es").spreads[i].layers[0].src.replace("/es/", "/en/"),
      ingredients("en").spreads[i].layers[0].src,
    );
  }
});

test("changing the language keeps the page: the same spread index resolves to the other language image", () => {
  const es = ingredients("es").spreads;
  const en = ingredients("en").spreads;
  for (let page = 0; page < 4; page++) {
    assert.equal(es[page].id, en[page].id);
    assert.ok(es[page].layers[0].src.includes("/es/"));
    assert.ok(en[page].layers[0].src.includes("/en/"));
  }
  // The overlay rebuilds its sections from the context on every render and keeps
  // its section and page state, so the page survives a language change.
  const overlay = read("src/game/book/BookOverlay.tsx");
  assert.ok(overlay.includes("buildBookSections(context)"));
  assert.ok(overlay.includes("useState(0)"));
});

test("the eight images exist, keep the book aspect ratio and are all different", () => {
  const seen = new Set();
  for (const language of ["es", "en"]) {
    for (const src of PATHS(language)) {
      const file = publicFile(src);
      assert.ok(fs.existsSync(file), src);
      const { width, height } = pngSize(file);
      assert.ok(width >= 1600 && height >= 900, `${src} ${width}x${height}`);
      assert.ok(
        Math.abs(width / height - BOOK_WIDTH / BOOK_HEIGHT) < 0.005,
        `${src} keeps the book aspect ratio`,
      );
      seen.add(fs.readFileSync(file).toString("base64"));
    }
    assert.equal(
      fs.readdirSync(publicFile(`/game/ui/book/ingredients/${language}`))
        .length,
      4,
    );
  }
  assert.equal(seen.size, 8);
});

test("the layers are drawn complete and smooth: no cover/crop and no pixel-art scaling for these pictures", () => {
  const css = read("src/game/book/BookOverlay.module.css");
  assert.ok(/\.smooth\s*\{\s*image-rendering:\s*auto;/.test(css));
  assert.ok(!/object-fit:\s*cover/.test(css));
  assert.ok(!/filter\s*:/.test(css), "no filter over the book art");
  const overlay = read("src/game/book/BookOverlay.tsx");
  assert.ok(overlay.includes("layer.smooth ? styles.smooth"));
  assert.ok(overlay.includes('alt={layer.alt ?? ""}'));
});

test("accessible names: one short description per spread and language, not the page text", () => {
  for (const language of ["es", "en"]) {
    const alts = bookCopy[language].ingredientSpreadAlts;
    assert.equal(alts.length, 4);
    ingredients(language).spreads.forEach((spread, i) => {
      assert.equal(spread.layers[0].alt, alts[i]);
      assert.ok(alts[i].length < 70, "short");
    });
  }
  assert.equal(
    bookCopy.es.ingredientSpreadAlts[0],
    "Ingredientes: leche, hierba medicinal, hongo y agua",
  );
  assert.equal(
    bookCopy.en.ingredientSpreadAlts[0],
    "Ingredients: milk, medicinal herb, mushroom and water",
  );
  assert.equal(
    bookCopy.en.ingredientSpreadAlts[3],
    "Ingredients: animal fat, garlic, salt and leech",
  );
});

test("the old spreads are gone and nothing at runtime points at them", () => {
  assert.ok(!fs.existsSync(publicFile("/game/ui/book/resources")));
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const p = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(p) : [p];
    });
  for (const file of [
    ...walk(path.join(root, "src")),
    ...walk(path.join(root, "tests")),
  ]) {
    if (/book-ingredients\.test\.mjs$/.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    assert.ok(!text.includes("resources-spread"), file);
    assert.ok(!text.includes("ui/book/resources"), file);
  }
  assert.equal(
    BOOK_SECTIONS.find((s) => s.id === "ingredients").spreads.length,
    4,
  );
});

test("the other tabs and the tutorial Book are untouched", () => {
  const es = buildBookSections(context("es"));
  assert.deepEqual(
    es.map((s) => s.id),
    ["patients", "ailments", "ingredients", "preparations"],
  );
  assert.deepEqual(
    es.map((s) => s.label),
    ["Pacientes", "Dolencias", "Ingredientes", "Preparados"],
  );
  const en = buildBookSections(context("en"));
  assert.deepEqual(
    en.map((s) => s.label),
    ["Patients", "Ailments", "Ingredients", "Remedies"],
  );
  // PACIENTES and PREPARADOS stay text pages built from the game state;
  // DOLENCIAS keeps its two layers, with smooth ink illustrations on parchment.
  assert.ok(es[0].spreads[0].texts.length > 0);
  assert.ok(es[3].spreads[0].texts.length > 0);
  assert.ok(
    es[1].spreads.every(
      (s) => s.layers.length === 2 && s.layers[0].smooth && s.layers[1].smooth
        && s.layers[1].fit === "contain" && s.layers[1].blend === "multiply",
    ),
  );
  // the tutorial still opens the Book on INGREDIENTES (several pages to turn)
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(
    /initialSectionId=\{[\s\S]*"ingredients"[\s\S]*undefined/.test(game),
  );
  assert.ok(es[2].spreads.length > 1);
});

console.log(`\n${passed} tests passed`);
