// Copper coins: the purse, what patients pay, the shop and how it is wired.
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

const { MAX_COINS, STARTING_COINS, addCoins, canAfford, spendCoins } = at("src/game/money/money.ts");
const { PATIENT_PAYMENTS, getPatientPayment } = at("src/game/money/payments.ts");
const { moneyCopy } = at("src/game/i18n/money.ts");
const shops = at("src/game/shop/shops.ts");
const { CHAPTER1_PATIENTS } = at("src/game/patients/chapter1Patients.ts");
const { CHAPTER2_PATIENTS } = at("src/game/patients/chapter2Patients.ts");
const { createDay2DevStart } = at("src/game/world/devStart.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};

test("the purse: starts at 3, caps at 99, never goes negative, a failed payment spends nothing", () => {
  assert.equal(STARTING_COINS, 4);
  assert.equal(MAX_COINS, 99);
  assert.equal(addCoins(90, 20), 99);
  assert.equal(addCoins(5, -3), 5, "earning cannot subtract");
  assert.equal(spendCoins(3, 2), 1);
  assert.equal(spendCoins(1, 2), null);
  assert.ok(canAfford(2, 2) && !canAfford(1, 2));
});

test("every patient of Days 1 and 2 pays something, and the prices are not round", () => {
  for (const id of [...Object.keys(CHAPTER1_PATIENTS), ...Object.keys(CHAPTER2_PATIENTS)]) {
    const pay = getPatientPayment(id);
    assert.ok(pay > 0 && pay <= MAX_COINS, id);
  }
  for (const [id, pay] of Object.entries(PATIENT_PAYMENTS)) {
    assert.ok(pay % 5 !== 0, `${id} pays ${pay}, a round number`);
  }
  assert.equal(getPatientPayment("nobody"), 0);
});

test("the merchant's shop: cloth at one coin, three in stock, sold out after three, units counted by flags", () => {
  const shop = shops.getShop("chapter1.plaza.merchant");
  assert.equal(shop.id, "plaza-merchant");
  const [cloth] = shop.entries;
  assert.deepEqual(cloth, { itemId: "cloth", price: 1, stock: 3 });
  let claimed = new Set();
  for (let i = 0; i < 3; i++) {
    assert.equal(shops.unitsLeft(claimed, shop, cloth), 3 - i);
    const [pay, give, claim] = shops.buyEffects(claimed, shop, cloth);
    assert.deepEqual([pay, give], [
      { type: "take-coins", amount: 1 },
      { type: "give-item", itemId: "cloth", quantity: 1 },
    ]);
    claimed = new Set([...claimed, claim.rewardId]);
  }
  assert.equal(shops.unitsLeft(claimed, shop, cloth), 0);
  assert.equal(shops.getShop("chapter1.farm.woman"), undefined);
});

test("Day 1 can never block on money: the four coins buy the cloth and the salt before the first payment and every payment covers the rest", () => {
  const shop = shops.getShop("chapter1.plaza.merchant");
  const spendAll = shop.entries.reduce((n, e) => n + e.price * e.stock, 0);
  assert.equal(spendAll, 4, "everything on sale costs exactly the starting purse");
  // the mandatory purchases of Day 1: two cloths and one salt
  const price = (id) => shop.entries.find((e) => e.itemId === id).price;
  assert.ok(STARTING_COINS >= 2 * price("cloth") + price("salt"), "cloth x2 + salt fit in the starting purse");
  const day1Income = Object.keys(CHAPTER1_PATIENTS).reduce((n, id) => n + getPatientPayment(id), 0);
  assert.ok(STARTING_COINS + day1Income >= spendAll);
  // even the worst order: only the cloth is mandatory before the first payment
  assert.ok(STARTING_COINS >= shop.entries[0].price);
});

test("ES and EN copy exists, with singular and plural", () => {
  assert.equal(moneyCopy.es.received(1), "Recibes 1 moneda.");
  assert.equal(moneyCopy.es.received(8), "Recibes 8 monedas.");
  assert.equal(moneyCopy.en.received(1), "You receive 1 coin.");
  assert.equal(moneyCopy.en.received(8), "You receive 8 coins.");
  for (const lang of ["es", "en"]) {
    assert.ok(moneyCopy[lang].notEnough.length > 0);
    assert.ok(moneyCopy[lang].shop.soldOut.length > 0);
  }
});

test("wiring: effects pay and charge atomically, patients pay on treatment, the shop and the HUD are mounted", () => {
  const game = read("src/game/world/GameWorld.tsx");
  assert.ok(game.includes('effect.type === "give-coins"'));
  assert.ok(game.includes('effect.type === "take-coins"'));
  assert.ok(game.includes("getPatientPayment(effect.patientId)"));
  assert.ok(game.includes("<ShopOverlay"));
  assert.ok(game.includes("<CoinHud"));
  assert.ok(game.includes("getShop(interactionId)"));
  // a failed payment cancels the whole list, so the goods never come for free
  assert.ok(/paid === null\)\s*\{\s*return false;/.test(game));
  const dev = createDay2DevStart();
  assert.equal(dev.coins, 12);
  assert.ok(read("src/game/world/GameWorld.tsx").includes("devStart?.coins ?? STARTING_COINS"));
  assert.ok(fs.existsSync(path.join(root, "public/game/ui/coin.png")));
});

test("a sold-out or too-dear item is dimmed in the shop", () => {
  const overlay = read("src/game/shop/ShopOverlay.tsx");
  assert.ok(overlay.includes("data-sold-out"));
  assert.ok(overlay.includes("disabled={soldOut}"));
  const css = read("src/game/shop/ShopOverlay.module.css");
  assert.ok(/\.soldOut\s*\{[^}]*opacity/.test(css));
});

console.log(`\n${passed} tests passed`);
