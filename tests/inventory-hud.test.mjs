// Inventory V2, part 1: the HUD bar of the 6 carried slots and the shared slot
// visual. Server-renders the real components to static HTML (no browser) and
// checks the pure visibility rule.
//   node tests/inventory-hud.test.mjs
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
const { InventoryHud } = at("src/game/inventory/InventoryHud.tsx");
const { isInventoryHudVisible } = at(
  "src/game/inventory/inventoryHudVisibility.ts",
);
const { StorageOverlay } = at("src/game/storage/StorageOverlay.tsx");
const { CraftingOverlay } = at("src/game/crafting/CraftingOverlay.tsx");
const { formatObtainedNotice } = at("src/game/i18n/items.ts");
const { getItemName } = at("src/game/items/items.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

const HERB = "medicinal-herb";
const WATER = "water";
const html = (element) => renderToStaticMarkup(element);
const h = React.createElement;
const count = (text, needle) => text.split(needle).length - 1;
// herb x3, water x1, four empty slots
function sampleInventory() {
  let state = inv.createEmptyInventory();
  state = inv.addItem(state, HERB, 3);
  state = inv.addItem(state, WATER, 1);
  return state;
}

test("the HUD draws exactly the 6 slots of the carried inventory", () => {
  const markup = html(
    h(InventoryHud, { inventory: sampleInventory(), language: "es" }),
  );
  assert.equal(count(markup, "data-inventory-slot"), 6);
  assert.equal(inv.INVENTORY_CAPACITY, 6);
  assert.ok(markup.includes("data-inventory-hud"));
});

test("occupied slots show their icon, in the inventory's order", () => {
  const markup = html(
    h(InventoryHud, { inventory: sampleInventory(), language: "es" }),
  );
  assert.equal(count(markup, "data-item-icon="), 2);
  assert.ok(
    markup.indexOf(`data-item-icon="${HERB}"`) <
      markup.indexOf(`data-item-icon="${WATER}"`),
  );
  assert.ok(markup.includes(`/game/items/inventory-icons/medicinal-herb.png`));
  // name for the label / aria-label comes from the item catalog
  assert.ok(markup.includes(`>${getItemName(HERB, "es")} ×3</span>`));
  assert.ok(markup.includes(`aria-label="${getItemName(HERB, "es")} x3"`));
  const en = html(
    h(InventoryHud, { inventory: sampleInventory(), language: "en" }),
  );
  assert.ok(en.includes(`aria-label="${getItemName(HERB, "en")} x3"`));
});

test("quantity is drawn only when there is more than one unit; empty slots are marked empty", () => {
  // the hover label always carries the quantity; this checks the slot itself
  const markup = html(
    h(InventoryHud, { inventory: sampleInventory(), language: "es" }),
  ).replace(/<span[^>]*data-slot-tooltip[^>]*>.*?<\/span>/g, "");
  assert.equal(count(markup, "×3"), 1);
  assert.equal(count(markup, "×1"), 0, "a single unit shows no number");
  assert.equal(count(markup, 'data-empty="true"'), 4);
  assert.equal(count(markup, 'data-empty="false"'), 2);
  // an empty inventory: six empty slots, nothing else
  const empty = html(
    h(InventoryHud, { inventory: inv.createEmptyInventory(), language: "es" }),
  );
  assert.equal(count(empty, 'data-empty="true"'), 6);
  assert.equal(count(empty, "data-item-icon="), 0);
  assert.equal(count(empty, "×"), 0);
});

test("same source of truth: the HUD follows the state and keeps holes where items were consumed", () => {
  let state = sampleInventory();
  const before = html(h(InventoryHud, { inventory: state, language: "es" }));
  assert.equal(count(before, `data-item-id="${WATER}"`), 1);

  // water is used up: its slot becomes empty and nothing is moved
  state = inv.removeItem(state, WATER, 1);
  const after = html(h(InventoryHud, { inventory: state, language: "es" }));
  assert.equal(count(after, `data-item-id="${WATER}"`), 0);
  assert.equal(count(after, 'data-empty="true"'), 5);

  // the HUD is a pure function of the state: same state, same markup
  assert.equal(
    html(h(InventoryHud, { inventory: state, language: "es" })),
    after,
  );

  // a full inventory still shows 6 occupied slots
  let full = inv.createEmptyInventory();
  for (const id of ["water", "salt", "cloth", "alcohol", "coal", "honey"]) {
    full = inv.addItem(full, id);
  }
  assert.equal(
    count(
      html(h(InventoryHud, { inventory: full, language: "es" })),
      'data-empty="false"',
    ),
    6,
  );
});

test("Storage and Crafting draw their slots with the same shared contents, unchanged", () => {
  const state = sampleInventory();
  const storage = html(
    h(StorageOverlay, {
      storage: state,
      inventory: state,
      language: "es",
      onTransfer: () => {},
      onClose: () => {},
    }),
  );
  assert.equal(count(storage, "data-storage-slot"), 12);
  assert.equal(count(storage, "data-item-icon="), 4);
  assert.equal(count(storage, "×3"), 2);
  assert.equal(
    count(storage, "×1"),
    2,
    "interactive overlays still show every quantity",
  );

  const crafting = html(
    h(CraftingOverlay, {
      station: "manual",
      inventory: state,
      language: "es",
      onInventoryChange: () => {},
      onClose: () => {},
    }),
  );
  assert.equal(count(crafting, "data-inventory-slot"), 6);
  // (the hover labels repeat the numbers; this counts the slots themselves)
  const slotsOnly = crafting.replace(
    /<span[^>]*data-slot-tooltip[^>]*>.*?<\/span>/g,
    "",
  );
  assert.equal(count(slotsOnly, "×3"), 1);
  assert.equal(count(slotsOnly, "×1"), 1);
});

test("the HUD is presentational: no state, no input, no inventory of its own", () => {
  const source = fs.readFileSync(
    path.join(root, "src/game/inventory/InventoryHud.tsx"),
    "utf8",
  );
  assert.ok(!/useState|useEffect|useRef|addEventListener/.test(source));
  assert.ok(!/createEmptyInventory|addItem|removeItem/.test(source));
  const css = fs.readFileSync(
    path.join(root, "src/game/inventory/InventoryHud.module.css"),
    "utf8",
  );
  assert.ok(/pointer-events:\s*none/.test(css));
  assert.ok(
    /position:\s*absolute/.test(css),
    "anchored to the frame, not the window",
  );
  assert.ok(!/position:\s*fixed/.test(css));
  // icons are drawn at a fixed size (56px), slots at 60px
  assert.ok(/width:\s*56px/.test(css) && /height:\s*56px/.test(css));
  assert.ok(/width:\s*60px/.test(css) && /height:\s*60px/.test(css));
});

test("HUD: an occupied slot carries its own label 'Name ×quantity'; empty slots have none", () => {
  const markup = html(
    h(InventoryHud, { inventory: sampleInventory(), language: "es" }),
  );
  assert.equal(count(markup, "data-slot-tooltip"), 2);
  assert.ok(markup.includes(`>${getItemName(HERB, "es")} ×3</span>`));
  // a single unit has no number on the slot but the label always says it
  assert.ok(markup.includes(`>${getItemName(WATER, "es")} ×1</span>`));
  // CSS-only (hover / focus-visible); keyboard reachable; no duplicate native title
  assert.equal(count(markup, 'tabindex="0"'), 2);
  assert.equal(count(markup, "title="), 0);
  const empty = html(
    h(InventoryHud, { inventory: inv.createEmptyInventory(), language: "en" }),
  );
  assert.equal(count(empty, "data-slot-tooltip"), 0);
  assert.equal(count(empty, "tabindex"), 0);
  // the label's CSS is shared with Crafting (one file), shown on hover / focus
  const css = fs.readFileSync(
    path.join(root, "src/game/inventory/InventorySlotTooltip.module.css"),
    "utf8",
  );
  assert.ok(
    /:hover > \.tooltip/.test(css) && /:focus-visible > \.tooltip/.test(css),
  );
  const tip = css.slice(
    css.indexOf(".tooltip {"),
    css.indexOf("}", css.indexOf(".tooltip {")),
  );
  assert.ok(
    /position:\s*absolute/.test(tip) && /pointer-events:\s*none/.test(tip),
  );
});

const PLAYING = {
  phase: "playing",
  openingActive: false,
  inNarrativeScene: false,
  tutorialDone: true,
  bookOpen: false,
  storageOpen: false,
  craftingOpen: false,
  mapVisible: false,
};

test("visibility: shown in normal play (dialogue does not hide it)", () => {
  assert.equal(isInventoryHudVisible(PLAYING), true);
});

test("visibility: hidden under every interface (Book, Storage, Crafting, Map), the black fade-out, opening, narrative scene and during the tutorial", () => {
  for (const [key, value] of [
    ["bookOpen", true],
    ["storageOpen", true],
    ["craftingOpen", true],
    ["mapVisible", true],
    ["phase", "fading-out"],
    ["openingActive", true],
    ["inNarrativeScene", true],
    ["tutorialDone", false],
  ]) {
    assert.equal(
      isInventoryHudVisible({ ...PLAYING, [key]: value }),
      false,
      `${key}=${value}`,
    );
  }
});

test("visibility: back as soon as the new scene is visible (fading-in), not only at playing", () => {
  assert.equal(isInventoryHudVisible({ ...PLAYING, phase: "fading-in" }), true);
  // ...but every other reason to hide it still applies during that fade
  assert.equal(
    isInventoryHudVisible({ ...PLAYING, phase: "fading-in", mapVisible: true }),
    false,
  );
});

test("GameWorld mounts the bar in the scene overlay layer (the camera frame) in both scene renderers", () => {
  const world = fs.readFileSync(
    path.join(root, "src/game/world/GameWorld.tsx"),
    "utf8",
  );
  assert.equal(count(world, "renderOverlay={renderSceneOverlay}"), 2);
  assert.ok(world.includes("isInventoryHudVisible("));
  assert.ok(world.includes("tutorialDone: tutorial.step"));
  // the frame overlay of both renderers is inside the clipped viewport
  for (const file of [
    "world/ExteriorScene.tsx",
    "apothecary/ApothecaryScene.tsx",
  ]) {
    assert.ok(
      fs
        .readFileSync(path.join(root, "src/game", file), "utf8")
        .includes("renderOverlay?.({"),
      file,
    );
  }
});

test("there is no Inventory screen: no overlay, no hotkey, I does nothing", () => {
  for (const file of [
    "src/game/inventory/InventoryOverlay.tsx",
    "src/game/inventory/InventoryOverlay.module.css",
    "src/game/inventory/useInventoryHotkeys.ts",
  ]) {
    assert.ok(!fs.existsSync(path.join(root, file)), `${file} is gone`);
  }
  const world = fs.readFileSync(
    path.join(root, "src/game/world/GameWorld.tsx"),
    "utf8",
  );
  assert.ok(!/InventoryOverlay|inventoryOpen|InventoryHotkeys/.test(world));
  // nothing in the game listens for the I key
  const hotkeyFiles = fs
    .readdirSync(path.join(root, "src/game"), { recursive: true })
    .filter((file) => /use\w*Hotkeys?\.ts$/.test(String(file)));
  assert.ok(hotkeyFiles.length > 0);
  for (const file of hotkeyFiles) {
    const source = fs.readFileSync(
      path.join(root, "src/game", String(file)),
      "utf8",
    );
    assert.ok(!/["']i["']|["']I["']|KeyI\b/.test(source), `${file} ignores I`);
  }
});

test("the 'obtained' notice carries the quantity, in both languages", () => {
  assert.equal(
    formatObtainedNotice("es", getItemName(HERB, "es"), 1),
    "Has obtenido: Hierba medicinal ×1",
  );
  assert.equal(
    formatObtainedNotice("en", getItemName(HERB, "en"), 3),
    "Obtained: Medicinal herb ×3",
  );
});

console.log(`\n${passed} tests passed`);
