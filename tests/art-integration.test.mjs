// Art + Inventory V2 integration: item icons live on the item definitions, the
// new decor assets (herb, population, smartphone variants, leech) are registered
// but not placed, and no art-only item became a gameplay item. Metadata only.
//   node tests/art-integration.test.mjs
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

const { ITEMS, getItem, getItemIcon } = at("src/game/items/items.ts");
const { DECOR_ASSETS, getDecorAsset, SMARTPHONE_VARIANT_BASE_IDS } = at(
  "src/game/decor/decorAssets.ts",
);
const { chapter1Compositions } = at("src/game/compositions/chapter-1.ts");
const { chapter1CollectibleTestCompositions } = at(
  "src/game/compositions/chapter-1.collectibles.ts",
);
const { getComposition } = at("src/game/compositions/index.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { CHAPTER1_PATIENTS, BAKER_HUSBAND_ID } = at(
  "src/game/patients/chapter1Patients.ts",
);
const { INVENTORY_CAPACITY } = at("src/game/inventory/inventory.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// PNG size straight from the file header (no image library, no pixel checks).
const pngSize = (publicPath) => {
  const file = path.join(root, "public", publicPath);
  assert.ok(fs.existsSync(file), `missing ${publicPath}`);
  const header = fs.readFileSync(file).subarray(0, 24);
  assert.equal(header.subarray(1, 4).toString(), "PNG", publicPath);
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
};

const ALL_PLACED = [
  ...chapter1Compositions,
  ...chapter1CollectibleTestCompositions,
].flatMap((c) => c.instances);

// The 17 art entries promoted to catalog items in the final refinement pass.
const PROMOTED_ITEMS = [
  "milk",
  "flour",
  "orange",
  "mint",
  "resin",
  "animal-fat",
  "garlic",
  "leech",
  "milk-with-honey",
  "mint-infusion",
  "balsamic-syrup",
  "ointment-base",
  "poultice",
  "medicinal-compress",
  "crushed-coal",
  "charcoal-suspension",
  "citrus-drink",
];

const PREPARED_ART = [
  "medicinal-infusion",
  "cold-cloth",
  "mushroom-soup",
  "milk-with-honey",
  "disinfected-bandage",
  "mint-infusion",
  "balsamic-syrup",
  "ointment-base",
  "medicinal-ointment",
  "poultice",
  "medicinal-compress",
  "crushed-coal",
  "charcoal-suspension",
  "citrus-drink",
];
const BASE_ART = [
  "milk",
  "medicinal-herb",
  "mushroom",
  "water",
  "alcohol",
  "flour",
  "coal",
  "cloth",
  "orange",
  "mint",
  "honey",
  "resin",
  "animal-fat",
  "garlic",
  "salt",
  "leech",
];

test("item icons live on the item definition: one authoritative, existing 48x48 icon per item", () => {
  const withIcon = Object.values(ITEMS)
    .filter((item) => item.icon)
    .map((item) => item.id);
  // every catalog item has art except medicinal-paste, whose art was never made
  assert.deepEqual(
    Object.keys(ITEMS).filter((id) => !ITEMS[id].icon),
    ["medicinal-paste"],
  );
  assert.equal(withIcon.length, Object.keys(ITEMS).length - 1);

  const seen = new Set();
  for (const id of withIcon) {
    const icon = ITEMS[id].icon;
    assert.ok(icon.startsWith("/game/items/"), id);
    assert.deepEqual(pngSize(icon), { width: 48, height: 48 }, id);
    assert.ok(!seen.has(icon), `icon shared by two items: ${icon}`);
    seen.add(icon);
    assert.equal(getItemIcon(id), icon);
  }
  // the Empty flask now has its own art, at the predictable path
  assert.equal(
    ITEMS["empty-flask"].icon,
    "/game/items/inventory-icons/empty-flask.png",
  );
  assert.equal(getItemIcon("medicinal-paste"), undefined);
  assert.equal(getItemIcon("not-an-item"), undefined);
});

test("all 30 approved art entries are catalog items with bilingual names", () => {
  assert.equal(new Set([...BASE_ART, ...PREPARED_ART]).size, 30);
  for (const id of [...BASE_ART, ...PREPARED_ART]) {
    const item = getItem(id);
    assert.ok(item, `${id} is in the catalog`);
    assert.equal(item.id, id);
    assert.ok(item.name.es && item.name.en, id);
    assert.ok(item.icon, id);
  }
  // no duplicated ids in the catalog (the key is the id)
  for (const [key, item] of Object.entries(ITEMS)) assert.equal(item.id, key);
  // 15 existing items + the 17 promoted ones
  assert.equal(Object.keys(ITEMS).length, 32);
});

test("catalogued is NOT implemented: promoted items have no recipe, patient need or source", () => {
  const recipeItemIds = new Set(
    RECIPES.flatMap((r) => [r.output.itemId, ...r.inputs.map((i) => i.itemId)]),
  );
  for (const id of PROMOTED_ITEMS) {
    assert.ok(getItem(id), id);
    assert.ok(!recipeItemIds.has(id), `${id} must not be in a recipe yet`);
    assert.equal(
      getItem(id).sourceHint,
      undefined,
      `${id} has no acquisition hint`,
    );
    for (const patient of Object.values(CHAPTER1_PATIENTS)) {
      assert.ok(
        !patient.requiredTreatments.some((t) => t.itemId === id),
        `${id} is not required by ${patient.id}`,
      );
    }
  }
  // the recipes are exactly the ones that existed before this pass
  assert.equal(RECIPES.length, 6);
  // the first patient still needs only the two prepared items
  assert.deepEqual(CHAPTER1_PATIENTS[BAKER_HUSBAND_ID].requiredTreatments, [
    { itemId: "medicinal-infusion", quantity: 1 },
    { itemId: "cold-cloth", quantity: 1 },
  ]);
});

test("inventory presentation: six slots in ONE row, capacity untouched", () => {
  assert.equal(INVENTORY_CAPACITY, 6);
  const overlay = fs.readFileSync(
    path.join(root, "src/game/inventory/InventoryOverlay.tsx"),
    "utf8",
  );
  const columns = Number(overlay.match(/const COLUMNS = (\d+);/)[1]);
  assert.equal(
    columns,
    INVENTORY_CAPACITY,
    "one row: as many columns as slots",
  );
  // the storage and crafting views of the carried inventory use the same row
  for (const file of [
    "src/game/storage/StorageOverlay.tsx",
    "src/game/crafting/CraftingOverlay.tsx",
  ]) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(
      /\b6\b/.test(source),
      `${file} lays the carried inventory out in 6 columns`,
    );
  }
});

test("no UI keeps its own itemId > image table: the overlays read the item catalog", () => {
  for (const file of [
    "src/game/inventory/InventoryOverlay.tsx",
    "src/game/storage/StorageOverlay.tsx",
    "src/game/crafting/CraftingOverlay.tsx",
  ]) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(source.includes("ItemIcon"), file);
    assert.ok(
      !/\/game\/items\//.test(source),
      `${file} must not hardcode icon paths`,
    );
  }
  const itemIconSource = fs.readFileSync(
    path.join(root, "src/game/items/ItemIcon.tsx"),
    "utf8",
  );
  assert.ok(
    itemIconSource.includes("getItemIcon") &&
      !/\/game\/items\//.test(itemIconSource),
  );
});

test("every decor sprite frame exists and matches its declared frame size (unscaled assets)", () => {
  for (const asset of DECOR_ASSETS) {
    // an asset declared at a deliberately scaled-down size (baker-standing) is
    // a different contract: frame size is then not the file size
    if (!Number.isInteger(asset.sprite.frameWidth)) continue;
    for (const frame of asset.sprite.frames) {
      if (frame.startsWith("data:")) continue;
      assert.deepEqual(
        pngSize(frame),
        { width: asset.sprite.frameWidth, height: asset.sprite.frameHeight },
        `${asset.id} ${frame}`,
      );
    }
  }
});

test("world Medicinal herb: final art, rooted anchor, still the same collectible", () => {
  const asset = getDecorAsset("medicinal-herb-dev");
  assert.deepEqual(asset.sprite.frames, [
    "/game/resources/medicinal-herb/world.png",
  ]);
  assert.equal(asset.sprite.frameWidth, 48);
  assert.equal(asset.sprite.frameHeight, 48);
  assert.equal(asset.category, "resources");
  assert.equal(asset.collectibleItemId, "medicinal-herb");
  assert.equal(asset.defaultCollider, undefined); // a collectible never blocks
  // anchored at the soil (low in the frame), not at the bottom edge of the box
  assert.ok(asset.anchor.y > 0.75 && asset.anchor.y < 0.9);
  assert.ok(asset.anchor.x > 0.4 && asset.anchor.x < 0.6);
  assert.ok(asset.defaultScale < 1);

  const herb = getComposition("forest", "chapter-1").instances.find(
    (i) => i.instanceId === "forest-medicinal-herb-01",
  );
  assert.equal(herb.assetId, "medicinal-herb-dev");
  assert.equal(herb.colliderEnabled, false);
  assert.equal(herb.scale, asset.defaultScale);
  assert.ok(
    !fs
      .readFileSync(path.join(root, "src/game/decor/decorAssets.ts"), "utf8")
      .includes("DEV_HERB_SVG"),
  );
});

test("new town population is registered with real, calm animations", () => {
  const spec = {
    "elderly-man-with-jug": { category: "people", frames: 4, w: 96, h: 96 },
    "elderly-woman-with-cane": { category: "people", frames: 4, w: 96, h: 96 },
    horse: { category: "animals", frames: 4, w: 128, h: 96 },
    squirrel: { category: "animals", frames: 2, w: 64, h: 64 },
    "fruit-vegetable-seller-stall": {
      category: "people",
      frames: 1,
      w: 128,
      h: 96,
    },
  };
  for (const [id, s] of Object.entries(spec)) {
    const asset = getDecorAsset(id);
    assert.ok(asset, id);
    assert.equal(asset.category, s.category, id);
    assert.equal(asset.sprite.frames.length, s.frames, id);
    assert.equal(asset.sprite.frameWidth, s.w, id);
    assert.equal(asset.sprite.frameHeight, s.h, id);
    if (s.frames > 1) {
      assert.ok(
        asset.sprite.fps > 0 && asset.sprite.fps <= 4,
        `${id} idles calmly`,
      );
      assert.equal(asset.sprite.loop, true, id);
    } else {
      assert.equal(asset.sprite.fps, 0, id);
    }
    // available in the Decorator only: never placed in a chapter yet
    assert.ok(!ALL_PLACED.some((i) => i.assetId === id), `${id} is not placed`);
  }
  // the originals of the approved static versions are still on disk
  pngSize("/game/npcs/elderly-man-with-jug/static.png");
  pngSize("/game/npcs/elderly-woman-with-cane/static.png");
});

test("smartphone variants: registered next to the originals, derived from them, and not active", () => {
  assert.deepEqual(
    [...SMARTPHONE_VARIANT_BASE_IDS],
    [
      "woman-sweeping",
      "fisherman",
      "bartender",
      "baker",
      "villager-sitting",
      "woodcutter",
      "blacksmith",
      "woman-washing-clothes",
    ],
  );
  for (const baseId of SMARTPHONE_VARIANT_BASE_IDS) {
    const base = getDecorAsset(baseId);
    const variant = getDecorAsset(`${baseId}-smartphone`);
    assert.ok(base && variant, baseId);
    // the normal NPC is untouched
    assert.ok(
      base.sprite.frames.every((f) => !f.includes("smartphone")),
      baseId,
    );
    assert.equal(variant.category, base.category);
    // same body, same place: only the art and the cadence differ
    assert.deepEqual(variant.anchor, base.anchor);
    assert.deepEqual(variant.defaultCollider, base.defaultCollider);
    assert.equal(variant.defaultScale, base.defaultScale);
    assert.equal(variant.sprite.frameWidth, base.sprite.frameWidth);
    assert.equal(variant.sprite.frameHeight, base.sprite.frameHeight);
    assert.deepEqual(
      variant.sprite.frames,
      [0, 1].map((i) => `/game/npcs/${baseId}-smartphone/idle/${i}.png`),
    );
    assert.ok(
      variant.sprite.fps > 0 && variant.sprite.fps < base.sprite.fps,
      `${baseId} is slower than its original`,
    );
    // not used in any chapter composition
    assert.ok(!ALL_PLACED.some((i) => i.assetId === variant.id), variant.id);
  }
  assert.ok(!ALL_PLACED.some((i) => String(i.assetId).endsWith("-smartphone")));
});

test("world leech: registered and animated, but not placed or collectible yet", () => {
  const leech = getDecorAsset("leech-world");
  assert.equal(leech.category, "resources");
  assert.equal(leech.sprite.frames.length, 4);
  assert.equal(leech.sprite.frameWidth, 32);
  assert.equal(leech.sprite.frameHeight, 32);
  assert.ok(leech.sprite.fps > 0 && leech.sprite.fps <= 4);
  assert.equal(leech.collectibleItemId, undefined);
  assert.equal(leech.defaultCollider, undefined);
  assert.ok(!ALL_PLACED.some((i) => i.assetId === "leech-world"));
  assert.equal(
    getComposition("mine-natural-cave", "chapter-1")?.instances.some(
      (i) => i.assetId === "leech-world",
    ) ?? false,
    false,
  );
  // the item exists in the catalog now, but the world leech is still not wired to it
  assert.equal(getItem("leech").id, "leech");
});

test("world Mint, Mushroom, Resin and Orange: registered resources, prepared but not placed", () => {
  const spec = {
    "mint-world": { item: "mint", dir: "mint" },
    "mushroom-world": { item: "mushroom", dir: "mushroom" },
    "resin-world": { item: "resin", dir: "resin" },
    "orange-world": { item: "orange", dir: "orange" },
  };
  for (const [id, s] of Object.entries(spec)) {
    const asset = getDecorAsset(id);
    assert.ok(asset, id);
    assert.equal(asset.category, "resources", id);
    assert.deepEqual(
      asset.sprite.frames,
      [`/game/resources/${s.dir}/world.png`],
      id,
    );
    assert.equal(asset.sprite.frameWidth, 48);
    assert.equal(asset.sprite.frameHeight, 48);
    assert.equal(asset.sprite.fps, 0, `${id} is static`);
    assert.equal(asset.defaultCollider, undefined, `${id} never blocks`);
    assert.equal(asset.collectibleItemId, s.item, id);
    assert.ok(getItem(s.item), `${id} points to a real item`);
    assert.ok(
      asset.anchor.x > 0 &&
        asset.anchor.x < 1 &&
        asset.anchor.y > 0 &&
        asset.anchor.y <= 1,
    );
    assert.ok(asset.defaultScale > 0 && asset.defaultScale <= 1);
    assert.ok(!ALL_PLACED.some((i) => i.assetId === id), `${id} is not placed`);
  }
  // the six resources of the Decorator's resources category
  const resources = DECOR_ASSETS.filter((a) => a.category === "resources")
    .map((a) => a.id)
    .sort();
  assert.deepEqual(resources, [
    "leech-world",
    "medicinal-herb-dev",
    "mint-world",
    "mushroom-world",
    "orange-world",
    "resin-world",
  ]);
});

console.log(`\n${passed} tests passed`);
