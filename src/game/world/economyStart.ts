import { getRequiredIngredients } from "../crafting/needs";
import { NPC_TRADES } from "../dialogue/npcTrades";
import { createChapter1Inventory } from "../inventory/initialInventory";
import { addItem, createEmptyInventory, removeItem, type InventoryState } from "../inventory/inventory";
import { STARTING_COINS } from "../money/money";
import { PATIENT_PAYMENTS } from "../money/payments";
import { CHAPTER1_INITIAL_PATIENTS, CHAPTER1_PATIENTS } from "../patients/chapter1Patients";
import { CHAPTER2_PATIENTS } from "../patients/chapter2Patients";
import { CHAPTER3_PATIENTS } from "../patients/chapter3Patients";
import { BUTCHER_STALL, DRAPER_STALL, MERCHANT_SHOP, PRODUCE_STALL } from "../shop/shops";
import { createChapter1Storage } from "../inventory/initialInventory";
import { createDay2DevStart, createDay3DevStart, createDay4DevStart, type GameDevStart } from "./devStart";

// /dev/testDays (2026-11-20): start ANY day with the coins and the bag the economy says a player would have, to try the
// day's playability. TEST DATA like the rest of devStart.ts: nothing here is a decision about the real game.
//
//   "justo"   : the player earned the payments of the cases he has treated, bought ONLY what those cases needed (each
//               shop item at its real price) and did no voluntary errand. The bag holds only what is free in the world.
//   "recados" : the same, and he also did every voluntary errand he could by then (their coins, their grants, and what
//               their preparations cost in the shop).
//
// The numbers are the ones economy-no-deadlock.test.mjs models, taken from the same data (payments, shop prices,
// recipes, trades), so this page and that test cannot drift apart.
export type EconomyProfile = "justo" | "recados";
export type TestDay = 1 | 2 | 3 | 4;

const DAY_CASES: Record<number, string[]> = {
  1: Object.keys(CHAPTER1_PATIENTS),
  2: Object.keys(CHAPTER2_PATIENTS),
  3: Object.keys(CHAPTER3_PATIENTS),
};

const SHOP_ENTRIES = [MERCHANT_SHOP, PRODUCE_STALL, DRAPER_STALL, BUTCHER_STALL]
  .flatMap((shop) => shop.entries)
  .filter((entry) => entry.itemId !== "animal-fat");
const SHOP_PRICE = new Map(SHOP_ENTRIES.map((entry) => [entry.itemId as string, entry.price]));

// the items of the shop a treatment needs (the rest of the ingredients are free in the world)
function shopNeeds(treatments: readonly { itemId: string; quantity: number }[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const need of getRequiredIngredients(treatments, createEmptyInventory())) {
    if (SHOP_PRICE.has(need.itemId)) out.set(need.itemId, (out.get(need.itemId) ?? 0) + need.quantity);
  }
  return out;
}

export type EconomyStart = { coins: number; lines: string[]; shopItemsRemoved: string[] };

// What the coins are at the START of `day`, and how they add up.
export function computeEconomy(day: TestDay, profile: EconomyProfile): EconomyStart {
  let coins = STARTING_COINS;
  const lines = [`Monedas iniciales: ${STARTING_COINS}`];
  const removed = new Set<string>();
  for (let d = 1; d < day; d += 1) {
    for (const id of DAY_CASES[d] ?? []) {
      const pay = PATIENT_PAYMENTS[id] ?? 0;
      const def = { ...CHAPTER1_PATIENTS, ...CHAPTER2_PATIENTS, ...CHAPTER3_PATIENTS }[id];
      const needs = shopNeeds(def.requiredTreatments);
      // the tavern case also needs one orange for the farm woman's milk
      if (id === "tavern-patient") needs.set("orange", (needs.get("orange") ?? 0) + 1);
      let cost = 0;
      needs.forEach((qty, item) => {
        cost += qty * (SHOP_PRICE.get(item) ?? 0);
        removed.add(item);
      });
      coins += pay - cost;
      lines.push(`Día ${d}, ${def.name.es}: +${pay} de pago, -${cost} de compras (${[...needs].map(([i, q]) => `${i}×${q}`).join(", ") || "nada"})`);
    }
    if (profile === "recados") {
      const dayIndex = d;
      for (const trade of Object.values(NPC_TRADES)) {
        if (!trade.ask) continue;
        const startsOn = trade.chapters ? Number(trade.chapters[0].replace("chapter-", "")) : 2;
        // an errand done on its own day or later within the days already played
        if (startsOn !== dayIndex) continue;
        const needs = shopNeeds(trade.consumes);
        let cost = 0;
        needs.forEach((qty, item) => {
          cost += qty * (SHOP_PRICE.get(item) ?? 0);
          removed.add(item);
        });
        const pay = trade.payCoins ?? 0;
        coins += pay - cost;
        lines.push(`Día ${dayIndex}, recado ${trade.rewardId}: +${pay}, -${cost}${trade.grants.length ? ` (y recibe ${trade.grants.map((g) => `${g.itemId}×${g.quantity}`).join(", ")})` : ""}`);
      }
    }
  }
  lines.push(`Monedas al empezar el día ${day}: ${coins}`);
  return { coins, lines, shopItemsRemoved: [...removed] };
}

// The bag: the fixture of that day's start without the items the SHOP sells (the player must buy those, with the coins
// above), plus what the errands handed over in the "recados" profile.
function bagFor(base: GameDevStart, day: TestDay, profile: EconomyProfile, removed: string[]): InventoryState {
  let inventory = base.inventory;
  for (const item of removed) {
    for (;;) {
      const next = removeItem(inventory, item, 1);
      if (!next) break;
      inventory = next;
    }
  }
  if (profile === "recados") {
    for (const trade of Object.values(NPC_TRADES)) {
      if (!trade.ask) continue;
      const startsOn = trade.chapters ? Number(trade.chapters[0].replace("chapter-", "")) : 2;
      if (startsOn >= day) continue;
      for (const grant of trade.grants) {
        inventory = addItem(inventory, grant.itemId, grant.quantity) ?? inventory;
      }
    }
  }
  return inventory;
}

export function createTestDayStart(day: TestDay, profile: EconomyProfile): { start: GameDevStart; economy: EconomyStart } {
  const economy = computeEconomy(day, profile);
  const base: GameDevStart =
    day === 1
      ? {
          chapterId: "chapter-1",
          patients: CHAPTER1_INITIAL_PATIENTS,
          claimedRewards: new Set(),
          knownRecipeIds: new Set(),
          inventory: createChapter1Inventory(),
          storage: createChapter1Storage(),
          collected: new Set(),
          // Day 1 skips the tutorial here: the page is for trying the day's economy, not the first minutes
          tutorialStep: "done",
        }
      : day === 2
        ? createDay2DevStart()
        : day === 3
          ? createDay3DevStart()
          : createDay4DevStart();
  return {
    start: { ...base, coins: economy.coins, inventory: day === 1 ? base.inventory : bagFor(base, day, profile, economy.shopItemsRemoved) },
    economy,
  };
}
