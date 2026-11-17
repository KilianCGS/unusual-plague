// Market street (2026-11-16, Kilian): three stalls (produce, draper, butcher) and the seamstress backpack.
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
      for (const c of [base + ".ts", path.join(base, "index.ts")]) if (fs.existsSync(c)) return load(c);
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
const inv = at("src/game/inventory/inventory.ts");
const shops = at("src/game/shop/shops.ts");
const ch2 = at("src/game/dialogue/chapter2StoryInteractions.ts");
const items = at("src/game/items/items.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

test("the three stalls sell what Kilian decided, from Day 2, and every item exists", () => {
  const sells = (id, day = "chapter-2") =>
    shops.shopForChapter(shops.getShop(id), day).entries.map((e) => e.itemId).sort();
  assert.deepEqual(sells("chapter1.market.produce"), ["onion", "orange"]);
  assert.deepEqual(sells("chapter1.market.produce", "chapter-3"), ["garlic", "onion", "orange"]);
  assert.deepEqual(sells("chapter1.market.draper"), ["candle", "cloth"]);
  // cloth and oranges are on sale from Day 1; the plaza merchant ends up with sugar and salt only
  assert.deepEqual(sells("chapter1.market.draper", "chapter-1"), ["cloth"]);
  assert.deepEqual(sells("chapter1.market.produce", "chapter-1"), ["orange"]);
  assert.deepEqual(sells("chapter1.market.butcher"), ["animal-fat", "bone"]);
  for (const id of ["chapter1.market.produce", "chapter1.market.draper", "chapter1.market.butcher"]) {
    const shop = shops.getShop(id);
    assert.ok(shop.greeting.es && shop.greeting.en && shop.title.es && shop.title.en);
    for (const e of shop.entries) assert.ok(items.ITEMS[e.itemId], e.itemId);
  }
  // their purchase flags never collide with the plaza merchant's
  const ids = ["plaza-merchant", "market-produce", "market-draper", "market-butcher"];
  assert.equal(new Set(ids).size, 4);
  for (const id of ids.slice(1)) assert.ok(Object.values(shops.SHOPS).some((s) => s.id === id));
});

test("the three stall sprites exist (128x96) and are registered in the Decorator", () => {
  const assets = read("src/game/decor/decorAssets.ts");
  for (const n of ["produce", "draper", "butcher"]) {
    const b = fs.readFileSync(path.join(root, `public/game/npcs/market-stall-${n}/static.png`));
    assert.deepEqual([b.readUInt32BE(16), b.readUInt32BE(20)], [128, 96]);
    assert.ok(assets.includes(`"market-stall-${n}"`));
    for (let i = 0; i < 9; i++) assert.ok(fs.existsSync(path.join(root, `public/game/npcs/market-stall-${n}/idle/${i}.png`)));
  }
});

test("the backpack adds ONE slot, keeping what is carried, and the world applies it", () => {
  const base = inv.addItem(inv.createEmptyInventory(), "cloth", 2);
  const grown = inv.growInventory(base, 1);
  assert.equal(grown.capacity, 9);
  assert.equal(grown.slots.length, 9);
  assert.equal(inv.countItem(grown, "cloth"), 2);
  assert.ok(inv.isValidInventory(grown));
  assert.equal(inv.createEmptyInventory().slots.length, 8);
  assert.ok(read("src/game/world/GameWorld.tsx").includes('effect.type === "grow-inventory"'));
});

test("the seamstress gives the backpack once, just by talking, then goes back to her ambient talk", () => {
  const facts = (claimed = []) => ({ patients: {}, inventory: inv.createEmptyInventory(), claimedRewards: new Set(claimed) });
  const first = ch2.resolveChapter2StoryInteraction(ch2.SEAMSTRESS_INTERACTION_ID, facts(), "es", "s");
  assert.ok(first.effects.some((e) => e.type === "grow-inventory" && e.slots === 1));
  assert.ok(first.effects.some((e) => e.type === "claim-reward" && e.rewardId === ch2.SEAMSTRESS_BACKPACK_ID));
  assert.ok(first.conversation.lines.some((l) => l.text.includes("mochila")));
  const en = ch2.resolveChapter2StoryInteraction(ch2.SEAMSTRESS_INTERACTION_ID, facts(), "en", "s");
  assert.ok(en.conversation.lines.some((l) => /backpack/.test(l.text)));
  const again = ch2.resolveChapter2StoryInteraction(ch2.SEAMSTRESS_INTERACTION_ID, facts([ch2.SEAMSTRESS_BACKPACK_ID]), "es", "s");
  assert.ok(!again || !again.effects.some((e) => e.type === "grow-inventory"));
});

test("the market street scene is registered (background, empty geometry, editor) so Kilian can paint it", () => {
  const b = fs.readFileSync(path.join(root, "public/game/new-world-map/market-street-background.png"));
  assert.deepEqual([b.readUInt32BE(16), b.readUInt32BE(20)], [1835, 674]);
  const visuals = read("src/game/new-world-map/newWorldVisuals.ts");
  assert.ok(visuals.includes('id: "market-street"') && visuals.includes("assetWidth: 1835") && visuals.includes("assetHeight: 674"));
  const mk = visuals.slice(visuals.indexOf('id: "market-street"'));
  assert.ok(mk.slice(0, 500).includes("logicalUnitsPerAssetPixel: 0.48"), "0.4 of the first 1.2 scale (x1.2 after the 1/3 one was too big)");
  // Kilian's geometry (painted at 1.2, rescaled by 0.4) lies inside the 881 x 324 world
  const geometry = at("src/game/new-world-map/geometry/marketStreetGeometry.ts");
  const W = Math.round(1835 * 0.48), H = Math.round(674 * 0.48);
  assert.equal(geometry.marketStreetColliders.length, 10);
  assert.equal(geometry.marketStreetOccluders.length, 5);
  assert.equal(geometry.marketStreetTransitions.length, 2);
  assert.equal(geometry.marketStreetSpawns.length, 2);
  for (const c of geometry.marketStreetColliders) assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.width <= W + 1 && c.y + c.height <= H + 1, c.id);
  for (const s of geometry.marketStreetSpawns) {
    assert.ok(s.x > 0 && s.x < W && s.y > 180 && s.y < H, `${s.id} lands on the road`);
    const hit = geometry.marketStreetColliders.some((c) => s.x >= c.x && s.x <= c.x + c.width && s.y >= c.y && s.y <= c.y + c.height);
    assert.ok(!hit, `${s.id} is not inside a collider`);
  }
  const scenes = read("src/game/new-world-map/newWorldScenes.ts");
  assert.ok(scenes.includes('"market-street": {') && scenes.includes('visual("market-street")'));
  const editor = read("src/app/dev/collisions/page.tsx");
  assert.ok(editor.includes('sceneId: "market-street"') && editor.includes('exportPrefix: "marketStreet"'));
  assert.ok(read("src/game/world/worldScenes.ts").includes('| "market-street"'));
});

test("guard: once the market street can be reached, the plaza merchant must no longer sell what that stall sells (no doubled stock)", () => {
  // "linked" = the street can be reached (its scene has exits); until then the plaza must keep its stock
  const reachable = !/"market-street": \{[\s\S]*?exits: \[\],/.test(read("src/game/new-world-map/newWorldScenes.ts"));
  const linked = () => reachable;
  const plaza = new Set(shops.MERCHANT_SHOP.entries.map((e) => e.itemId));
  for (const stall of [shops.PRODUCE_STALL, shops.DRAPER_STALL, shops.BUTCHER_STALL]) {
    if (!linked()) continue;
    for (const e of stall.entries) assert.ok(!plaza.has(e.itemId), `${e.itemId} is sold by both ${stall.id} and the plaza merchant`);
  }
  // growInventory ignores nonsense
  const base = inv.createEmptyInventory();
  for (const bad of [0, -1, 1.5, NaN]) assert.equal(inv.growInventory(base, bad), base);
});

test("the market street is populated from Day 1 and stays the same on Days 2 and 3, with the three shops linked", () => {
  const idx = at("src/game/compositions/index.ts");
  const stalls = ["produce", "draper", "butcher"].map((n) => `market-street-market-stall-${n}-01`);
  for (const chapter of ["chapter-1", "chapter-2", "chapter-3"]) {
    const comp = idx.getComposition("market-street", chapter);
    assert.equal(comp.instances.length, 10, chapter);
    for (const id of stalls) assert.ok(comp.instances.some((i) => i.instanceId === id), `${id} in ${chapter}`);
    const interactions = idx.getChapterInteractions(chapter);
    assert.deepEqual(stalls.map((id) => interactions[id]?.interactionId), ["chapter1.market.produce", "chapter1.market.draper", "chapter1.market.butcher"], chapter);
  }
  // Kilian's placements are untouched: the produce stall at 411,229 scale 0.89
  const produce = idx.getComposition("market-street", "chapter-1").instances.find((i) => i.instanceId === stalls[0]);
  assert.deepEqual([produce.x, produce.y, produce.scale], [411, 229, 0.89]);
  // the counters block the Doctor (default collider enabled on the three stalls), and the two villagers talk
  const assets = at("src/game/decor/decorAssets.ts");
  for (const id of stalls) {
    const instance = idx.getComposition("market-street", "chapter-1").instances.find((i) => i.instanceId === id);
    assert.equal(instance.colliderEnabled, true, id);
    assert.ok(assets.getDecorAsset(instance.assetId).defaultCollider, `${instance.assetId} has a default collider`);
  }
  const talk = idx.getChapterInteractions("chapter-3");
  assert.equal(talk["market-street-villager-back-man-01"].interactionId, "chapter1.market.customerMan");
  assert.equal(talk["market-street-villager-back-old-01"].interactionId, "chapter1.market.customerOld");
  for (const key of ["chapter1.market.produce", "chapter1.market.draper", "chapter1.market.butcher"]) assert.ok(shops.getShop(key), key);
});

test("the market street is connected both ways: apothecary street (west) and farm (east)", () => {
  const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
  const market = WORLD_SCENES["market-street"];
  const to = (scene, target) => scene.exits.find((e) => e.targetScene === target);
  for (const [from, other] of [["apothecary-street", "market-street"], ["farm", "market-street"], ["market-street", "apothecary-street"], ["market-street", "farm"]]) {
    const exit = to(WORLD_SCENES[from], other);
    assert.ok(exit, `${from} -> ${other}`);
    assert.ok(WORLD_SCENES[other].arrivals[exit.targetSpawn], `${other} has the arrival ${exit.targetSpawn}`);
  }
  // west = apothecary (the exit at x=1), east = farm (the exit at x=861)
  assert.ok(to(market, "apothecary-street").zone.x < 100 && to(market, "farm").zone.x > 800);
  // the plaza merchant sells only salt and sugar now
  assert.deepEqual(shops.MERCHANT_SHOP.entries.map((e) => e.itemId), ["salt", "sugar"]);
});

test("the stalls say [E] Comprar, the man in front of the butcher talks about the ham, and the street is zoomed 1.7", () => {
  assert.ok(read("src/game/world/GameWorld.tsx").includes("if (getShop(interactionId)) return moneyCopy[language].shop.buy;"));
  const dialogues = read("src/game/dialogue/chapter1Dialogues.ts");
  const man = dialogues.slice(dialogues.indexOf('conversation("chapter1.market.customerMan"'), dialogues.indexOf('conversation("chapter1.market.customerOld"'));
  assert.ok(/jamón/.test(man) && /ham/.test(man) && !/tela/.test(man) && !/cloth/.test(man), "he stands in front of the butcher stall");
  const visuals = read("src/game/new-world-map/newWorldVisuals.ts");
  assert.ok(visuals.slice(visuals.indexOf('id: "market-street"'), visuals.indexOf('id: "market-street"') + 900).includes("zoomMultiplier: 1.7"));
  // the tutorial notes are wide and short, the coin HUD squarer
  assert.ok(read("src/game/tutorial/TutorialHint.module.css").includes("width: min(720px"));
  assert.ok(read("src/game/money/CoinHud.module.css").includes("flex-direction: column"));
});

test("the Doctor arrives walking the right way between the apothecary street and the market street", () => {
  const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
  assert.equal(WORLD_SCENES["market-street"].arrivals["from-apothecary-street"].direction, "east");
  assert.equal(WORLD_SCENES["apothecary-street"].arrivals["from-market-street"].direction, "west");
});

test("/dev/market-test: live zoom, Doctor size and HUD size, only for the market street and never in the real game", () => {
  const page = read("src/app/dev/market-test/page.tsx");
  for (const key of ["zoomMultiplier", "protagonistScale", "hudScale"]) assert.ok(page.includes(key), key);
  assert.ok(page.includes('sceneId: "market-street"') && page.includes("Copiar valores"));
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(world.includes('base.id === "market-street"') && world.includes("<HudScale scale={hudScale}"));
  // the real game never sets the overrides: only the dev page does
  assert.ok(!read("src/game/world/GameWorld.tsx").includes("setMarketTestOverrides"));
  assert.ok(read("src/game/ui/HudScale.tsx").includes("if (scale === 1) return <>{children}</>"));
});

test("UI pass of 2026-11-16: centred notes, higher chest, flasks, coins like the inventory, fast travel in the frame, stall aura", () => {
  const world = read("src/game/world/GameWorld.tsx");
  assert.ok(world.includes('placement={hintStep === "exit-room" || hintStep === "exit-botica" ? "top" : "bottom"}'), "book and chest notes centred, door notes at the top");
  assert.ok(read("src/game/storage/StorageOverlay.module.css").includes("align-items: flex-start"));
  // two flasks, one stack
  const initial = at("src/game/inventory/initialInventory.ts").createChapter1Storage();
  assert.deepEqual(initial.slots[0], { itemId: "empty-flask", quantity: 2 });
  // the coin HUD: number first, then the coin; same bottom line as the inventory bar
  const coinTsx = read("src/game/money/CoinHud.tsx");
  assert.ok(coinTsx.indexOf("styles.count") < coinTsx.indexOf("styles.coin"), "number above the coin");
  const coinCss = read("src/game/money/CoinHud.module.css");
  const invCss = read("src/game/inventory/InventoryHud.module.css");
  assert.ok(invCss.includes("bottom: 4px"));
  assert.ok(invCss.includes("--slot-size: 78px") && coinCss.includes("--slot-size: 60px"), "a bit smaller than the inventory slot");
  assert.ok(coinCss.includes("bottom: 13px"), "centred on the bar height");
  // fast travel: inside the frame (the scene overlay), absolute, glowing during its tutorial step
  const overlay = world.slice(world.indexOf("const renderSceneOverlay"));
  assert.ok(overlay.includes("<FastTravelButton") && overlay.includes('glow={tutorialStepNow === "fast-travel"}'));
  assert.ok(read("src/game/ui/FastTravelButton.module.css").includes("position: absolute"));
  // blinking chip + a bobbing yellow arrow under it while the tutorial explains it
  assert.ok(read("src/game/ui/FastTravelButton.module.css").includes("fast-travel-blink") && read("src/game/ui/FastTravelButton.module.css").includes("fast-travel-arrow"));
  assert.ok(read("src/game/ui/FastTravelButton.tsx").includes("data-fast-travel-arrow"));
  // a stall in reach glows
  const ext = read("src/game/world/ExteriorScene.tsx");
  assert.ok(ext.includes("highlight={instance.instanceId === highlightedInstanceId}") && ext.includes("getShop(availableInteraction.interactionId)"));
  assert.ok(read("src/game/decor/DecorSprite.module.css").includes("stall-aura"));
});

console.log(`\n${passed} tests passed`);
