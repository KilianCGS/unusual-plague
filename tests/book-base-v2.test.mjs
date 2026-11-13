// Medical Book V2: PACIENTES, DOLENCIAS and PREPARADOS share ONE empty base
// (the same in every language); the painted INGREDIENTES spreads take none.
//   node tests/book-base-v2.test.mjs
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

const {
  buildBookSections,
  BOOK_SECTIONS,
  BOOK_WIDTH,
  BOOK_HEIGHT,
  BOOK_BASE_V2_SRC,
  PLAIN_BASE_LAYER,
} = at("src/game/book/bookPages.ts");
const ch1 = at("src/game/patients/chapter1Patients.ts");
const { AILMENTS } = at("src/game/book/ailments.ts");
const inv = at("src/game/inventory/inventory.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const BASE = "/game/ui/book/medical-book-base-v2.png";
const context = (language, patients, known = []) => ({
  language,
  patients,
  inventory: inv.createEmptyInventory(),
  knownRecipeIds: new Set(known),
});
const ALL_KNOWN = [
  "fire.medicinal-infusion",
  "manual.cold-cloth",
  "fire.mushroom-soup",
  "manual.disinfected-bandage",
  "manual.medicinal-ointment",
];
const ALL_PATIENTS = {
  [ch1.BAKER_HUSBAND_ID]: "examined",
  [ch1.TAVERN_PATIENT_ID]: "treated",
  [ch1.INJURED_MINER_ID]: "examined",
};
const sections = (language) =>
  Object.fromEntries(
    buildBookSections(context(language, ALL_PATIENTS, ALL_KNOWN)).map((s) => [
      s.id,
      s,
    ]),
  );
const baseOf = (spread) => spread.layers.filter((l) => l.src === BASE);

test("the V2 base exists, is the full 1.79 spread and is drawn at the book size", () => {
  const file = path.join(root, "public", BASE);
  assert.ok(fs.existsSync(file));
  const buffer = fs.readFileSync(file);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  assert.ok(width >= 1600 && height >= 900, `${width}x${height}`);
  assert.ok(Math.abs(width / height - BOOK_WIDTH / BOOK_HEIGHT) < 0.005);
  assert.equal(BOOK_BASE_V2_SRC, BASE);
  assert.deepEqual(
    [
      PLAIN_BASE_LAYER.x,
      PLAIN_BASE_LAYER.y,
      PLAIN_BASE_LAYER.width,
      PLAIN_BASE_LAYER.height,
    ],
    [0, 0, BOOK_WIDTH, BOOK_HEIGHT],
  );
  // smooth, never pixel-art nearest-neighbour, never cropped
  assert.equal(PLAIN_BASE_LAYER.smooth, true);
});

test("PACIENTES, DOLENCIAS and PREPARADOS draw on the V2 base; INGREDIENTES gets none", () => {
  for (const language of ["es", "en"]) {
    const s = sections(language);
    for (const id of ["patients", "ailments", "preparations"]) {
      assert.ok(s[id].spreads.length >= 1, `${language} ${id}`);
      for (const spread of s[id].spreads) {
        assert.equal(baseOf(spread).length, 1, `${language} ${spread.id}`);
        assert.equal(
          spread.layers[0].src,
          BASE,
          "the base is the bottom layer",
        );
      }
    }
    for (const spread of s.ingredients.spreads) {
      assert.equal(
        baseOf(spread).length,
        0,
        "no base behind the painted pages",
      );
      assert.equal(spread.layers.length, 1);
      assert.ok(spread.layers[0].src.includes(`/ingredients/${language}/`));
    }
  }
  // the empty states (no patients, no recipes) use it too
  const empty = buildBookSections(context("es", {}));
  assert.equal(empty[0].spreads[0].layers[0].src, BASE);
  assert.equal(empty[3].spreads[0].layers[0].src, BASE);
  assert.equal(BOOK_SECTIONS[0].spreads[0].layers[0].src, BASE);
});

test("one single base for every language and every section: the React text is what changes", () => {
  const bases = new Set();
  for (const language of ["es", "en"]) {
    const s = sections(language);
    for (const id of ["patients", "ailments", "preparations"])
      for (const spread of s[id].spreads) bases.add(spread.layers[0].src);
  }
  assert.deepEqual([...bases], [BASE]);
  const files = fs.readdirSync(path.join(root, "public/game/ui/book"));
  assert.deepEqual(files.sort(), [
    "ailments",
    "ingredients",
    "medical-book-base-v2.png",
    "preparations",
  ]);
  // the text IS dynamic and in the chosen language
  const text = (language, id) =>
    sections(language)
      [id].spreads.flatMap((x) => x.texts ?? [])
      .map((t) => t.content.join(""))
      .join(" | ");
  assert.ok(text("es", "patients").includes("Minero herido"));
  assert.ok(text("en", "patients").includes("The injured miner"));
  assert.ok(text("es", "preparations").includes("Hierba medicinal + Carbón triturado"));
  assert.ok(text("en", "preparations").includes("Medicinal herb + Crushed coal"));
});

test("the content stays dynamic and grows by itself: pages follow the patients, ailments and recipes", () => {
  const onlyBaker = buildBookSections(
    context("es", { [ch1.BAKER_HUSBAND_ID]: "discovered" }),
  );
  const all = buildBookSections(context("es", ALL_PATIENTS, ALL_KNOWN));
  assert.ok(all[0].spreads.length > onlyBaker[0].spreads.length);
  assert.equal(all[0].spreads.length, 3, "one spread per known patient");
  assert.ok(all[3].spreads.length >= 2, "recipes have individual illustrated spreads");
  assert.equal(
    all[1].spreads.length,
    AILMENTS.length,
    "one spread per ailment",
  );
  // recipes that are not known do not appear
  const none = buildBookSections(context("es", ALL_PATIENTS, []));
  assert.equal(none[3].spreads.length, 1);
  // the layout is not tied to the current patients: it reads the data
  const src = read("src/game/book/dynamicPages.ts");
  assert.ok(
    src.includes("CHAPTER1_PATIENTS") || src.includes("getVisiblePatientIds"),
  );
  assert.ok(!/baker-husband|tavern-patient|injured-miner/.test(src));
});

test("the overlay draws the base smooth and keeps the outer size of the book on every tab", () => {
  const css = read("src/game/book/BookOverlay.module.css");
  assert.ok(/\.smooth\s*\{\s*image-rendering:\s*auto;/.test(css));
  assert.ok(!/object-fit:\s*cover/.test(css));
  assert.ok(!/filter\s*:/.test(css));
  const overlay = read("src/game/book/BookOverlay.tsx");
  assert.ok(overlay.includes("layer.smooth ? styles.smooth"));
  // one stage for every section: its size comes from the book, not the section
  assert.ok(/BOOK_WIDTH/.test(overlay) && /BOOK_HEIGHT/.test(overlay));
  // the page text uses the handwritten font the project already ships
  assert.ok(css.includes("Patrick Hand"));
  assert.ok(
    fs.existsSync(
      path.join(root, "public/fonts/patrick-hand/PatrickHand-Regular.ttf"),
    ),
  );
});

test("the old bases are gone and nothing at runtime points at them", () => {
  for (const old of ["book-base.png", "book-base-plain.png"]) {
    assert.ok(!fs.existsSync(path.join(root, "public/game/ui/book", old)), old);
  }
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : [p];
    });
  for (const file of [
    ...walk(path.join(root, "src")),
    ...walk(path.join(root, "tests")),
  ]) {
    if (/book-base-v2\.test\.mjs$/.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    assert.ok(!/book-base\.png|book-base-plain/.test(text), file);
    assert.ok(!text.includes("AILMENT_BASE_LAYER"), file);
  }
  // the source art stays under art/
  assert.ok(
    fs.existsSync(path.join(root, "art/medical-book/medical-book-base.png")),
  );
});

test("the tutorial Book is untouched: it still opens on INGREDIENTES, which keeps several pages", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(
    /initialSectionId=\{[\s\S]*"ingredients"[\s\S]*undefined/.test(game),
  );
  const book = read("src/game/book/BookOverlay.tsx");
  assert.ok(book.includes("onPageChange") && book.includes("onSectionChange"));
  assert.equal(sections("es").ingredients.spreads.length, 4);
  assert.equal(sections("en").ingredients.spreads.length, 4);
});

test("all twenty-two preparations occupy one localized leaf each, two per opening", () => {
  const { RECIPES } = at("src/game/crafting/recipes.ts");
  const known = RECIPES.map(recipe => recipe.id);
  for (const language of ["es", "en"]) {
    const preparations = buildBookSections(context(language, {}, known))[3];
    assert.equal(preparations.spreads.length, 11);
    preparations.spreads.forEach((spread, index) => {
      const recipes = RECIPES.slice(index * 2, index * 2 + 2);
      assert.equal(spread.layers.length, 1 + recipes.length);
      recipes.forEach((recipe, side) => {
        const illustration = spread.layers[side + 1];
        assert.equal(illustration.src, `/game/ui/book/preparations/${recipe.output.itemId}.png`);
        assert.equal(illustration.fit, "contain");
        assert.equal(illustration.smooth, true);
        assert.equal(illustration.blend, "multiply");
        assert.ok(illustration.alt.length > 0);
        const png = fs.readFileSync(path.join(root, "public", illustration.src));
        assert.equal(png.subarray(1, 4).toString(), "PNG");
        assert.ok(png.readUInt32BE(16) >= 512 && png.readUInt32BE(20) >= 512);
        const blocks = spread.texts.filter(block => block.id.startsWith(recipe.id + "-"));
        assert.ok(blocks.every(block => side === 0 ? block.x < 344 : block.x > 344));
        const title = blocks.find(block => block.id.endsWith("-name"));
        const description = blocks.find(block => block.id.endsWith("-description"));
        const use = blocks.find(block => block.id.endsWith("-use"));
        assert.ok(illustration.y + illustration.height <= title.y);
        assert.ok(title.y < description.y && description.y < use.y);
        assert.ok(description.content[0].length > 20 && use.content[0].length > 20);
        assert.ok(blocks.some(block => block.id.endsWith("-inputs")));
        assert.ok(blocks.some(block => block.id.endsWith("-station")));
        assert.ok(blocks.some(block => block.id.endsWith("-availability")));
      });
    });
    assert.ok(preparations.spreads.at(-1).texts.some(block => block.x > 344),
      "the sixteenth recipe fills the final leaf");
  }
});

test("preparation descriptions cover the catalog and indications follow existing game treatments", () => {
  const { RECIPES } = at("src/game/crafting/recipes.ts");
  const { PREPARATION_DESCRIPTIONS, getPreparationUse } = at("src/game/book/preparations.ts");
  for (const language of ["es", "en"]) {
    for (const recipe of RECIPES) {
      assert.ok(PREPARATION_DESCRIPTIONS[recipe.output.itemId][language].length > 20);
      assert.ok(getPreparationUse(recipe.output.itemId, language).length > 20);
    }
  }
  assert.match(getPreparationUse("medicinal-infusion", "es"), /Fiebre común.*Envenenamiento/);
  assert.match(getPreparationUse("mint-infusion", "en"), /Exhaustion/);
  assert.match(getPreparationUse("medicinal-paste", "es"), /intermedio.*Cataplasma/);
  assert.match(getPreparationUse("crushed-coal", "en"), /Intermediate.*Charcoal suspension/);
  // Day 3 (2026-11-12): the sweeper's chest cough uses it, so its indication is now recorded
  assert.match(getPreparationUse("balsamic-syrup", "es"), /Tos del pecho/);
  assert.match(getPreparationUse("bone-broth", "es"), /Escorbuto/);
});

console.log(`\n${passed} tests passed`);
