// Crafting V2: the overlay as first rendered (server-side, no browser), and
// source-level checks of the behaviour that needs clicks (the selection state
// machine itself is covered in crafting.test.mjs, in pure logic).
//   node tests/crafting-ui.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: {
      module: "commonjs",
      target: "es2022",
      jsx: "react-jsx",
    },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    // CSS modules: every class name is its own key.
    if (id.endsWith(".css")) {
      const classes = new Proxy(
        {},
        { get: (_, key) => (key === "default" ? classes : String(key)) },
      );
      return classes;
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

const inv = at("src/game/inventory/inventory.ts");
const { CraftingOverlay } = at("src/game/crafting/CraftingOverlay.tsx");
const { craftingCopy } = at("src/game/i18n/crafting.ts");
const { getItemName } = at("src/game/items/items.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const h = React.createElement;
const html = (element) => renderToStaticMarkup(element);
const count = (text, needle) => text.split(needle).length - 1;
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

function stock(entries) {
  return entries.reduce(
    (state, [id, n]) => inv.addItem(state, id, n),
    inv.createEmptyInventory(),
  );
}
const render = (station, inventory, language = "es") =>
  html(
    h(CraftingOverlay, {
      station,
      inventory,
      language,
      onInventoryChange: () => {},
      onClose: () => {},
    }),
  );
const SAMPLE = stock([
  ["water", 3],
  ["cloth", 1],
  ["medicinal-paste", 2],
]);

test("manual shows 2 ingredient slots and the counter 0/2; fire shows 3 and 0/3", () => {
  const manual = render("manual", SAMPLE);
  assert.equal(count(manual, "data-selection-slot"), 2);
  assert.ok(manual.includes("INGREDIENTES 0/2"));
  assert.ok(manual.includes('data-crafting-station="manual"'));
  const fire = render("fire", SAMPLE);
  assert.equal(count(fire, "data-selection-slot"), 3);
  assert.ok(fire.includes("INGREDIENTES 0/3"));
  assert.ok(fire.includes('data-crafting-station="fire"'));
  assert.ok(render("manual", SAMPLE, "en").includes("INGREDIENTS 0/2"));
});

test("the header and the button name the action of the station, and the button starts disabled", () => {
  for (const [language, copy] of Object.entries(craftingCopy)) {
    for (const station of ["manual", "fire"]) {
      const markup = render(station, SAMPLE, language);
      assert.ok(markup.includes(`>${copy.title[station]}</h2>`));
      assert.ok(markup.includes(`>${copy.action[station]}</button>`));
      // nothing selected yet: COMBINE needs at least two units
      assert.match(
        markup,
        /<button[^>]*disabled=""[^>]*data-crafting-combine|<button[^>]*data-crafting-combine[^>]*disabled=""/,
      );
    }
  }
  assert.equal(craftingCopy.es.action.manual, "PREPARAR");
  assert.equal(craftingCopy.es.action.fire, "COCINAR");
});

test("the Doctor's inventory: the 6 carried slots in order, with quantities and hover labels", () => {
  const markup = render("manual", SAMPLE);
  assert.ok(markup.includes(">INVENTARIO DEL DOCTOR</h3>"));
  assert.equal(count(markup, "data-inventory-slot"), 6);
  assert.deepEqual(
    [...markup.matchAll(/data-inventory-slot[^>]*data-item-id="([^"]*)"/g)].map(
      (x) => x[1],
    ),
    SAMPLE.slots.filter(Boolean).map((slot) => slot.itemId),
  );
  // three occupied slots carry their own label "Name ×quantity"; the native title is gone
  assert.equal(count(markup, "data-slot-tooltip"), 3);
  assert.ok(markup.includes(`>${getItemName("water", "es")} ×3</span>`));
  assert.equal(count(markup, "title="), 0);
  // empty inventory slots cannot be clicked: 3 empty + 2 empty ingredient
  // slots + the action button (nothing selected yet) = 6 disabled buttons
  assert.equal(count(markup, 'disabled=""'), 6);
});

test("an item without an icon (Medicinal paste) falls back to its readable name", () => {
  const markup = render("manual", stock([["medicinal-paste", 2]]));
  assert.ok(!markup.includes("data-item-icon"));
  assert.ok(markup.includes(`>${getItemName("medicinal-paste", "es")}</span>`));
  const withIcon = render("manual", stock([["water", 1]]));
  assert.equal(count(withIcon, "data-item-icon"), 1);
});

test("the inventory is drawn from the real state: a different stock shows different numbers", () => {
  const markup = render("fire", stock([["water", 5]]));
  assert.ok(markup.includes("×5"));
  assert.equal(count(markup, "data-slot-tooltip"), 1);
});

test("source: derived quantities, limit feedback, no-space feedback and no timers", () => {
  const source = read("src/game/crafting/CraftingOverlay.tsx");
  // the numbers are the real stock minus the selection (never a mutation)
  assert.ok(source.includes("availableUnits(inventory, selection"));
  assert.ok(!/setTimeout|setInterval/.test(source));
  // the three feedback lines, picked from the result of combine()
  assert.ok(
    source.includes("copy.noRecipe") && source.includes("copy.noSpace"),
  );
  assert.ok(source.includes("copy.limitReached"));
  assert.ok(source.includes("setMessage(result.kind)"));
  // the selection changing clears the line
  assert.ok(source.includes("setMessage(null)"));
  // the success modal shows the quantity
  assert.ok(source.includes("created.quantity"));
  // crafting never reads which recipes the Doctor knows
  assert.ok(!/knownRecipe/.test(source.replace(/\/\/.*$/gm, "")));
  // the result goes through the same inventory callback, once, on success only
  assert.equal(count(source, "onInventoryChange("), 1);
});

test("source: the hover label is the shared one (no copy of it in Crafting)", () => {
  const source = read("src/game/crafting/CraftingOverlay.tsx");
  assert.ok(source.includes("InventorySlotTooltip"));
  assert.ok(
    !/\.tooltip/.test(read("src/game/crafting/CraftingOverlay.module.css")),
  );
  assert.ok(!/title=\{/.test(source));
});

test("success modal and old texts: no obsolete references remain", () => {
  const source = read("src/game/crafting/CraftingOverlay.tsx");
  assert.ok(!/Q, I and TAB/.test(source));
  assert.ok(
    !/does not exist in the world yet/.test(
      read("src/app/dev/crafting/page.tsx"),
    ),
  );
});

console.log(`
${passed} tests passed`);
