import type { ItemId } from "../items/items";
import type { Language } from "../i18n/types";

// SHOPS: a character who SELLS. Kilian's rules: every item on sale is needed
// to move forward (nothing can be missed), stock is limited per day, and the
// prices are invented, not round. An entry is available while fewer than
// `stock` units were bought; the purchases live in the claimed-reward flags,
// like every other one-time fact, so nothing new is stored.
export type ShopEntry = {
  itemId: ItemId;
  price: number;
  stock: number;
  // The first chapter (day) this item is on sale; left out = from the start.
  fromChapter?: string;
  // A CUMULATIVE cap per day (2026-11-16, Kilian: "stock limited per day"): the most units that can have
  // been bought by the end of each chapter, e.g. { "chapter-1": 1, "chapter-2": 2 } = one on Day 1 and one
  // more on Day 2. The cap of the latest listed chapter up to today applies; never above `stock`. It keeps
  // a player from spending the starting purse on units that cure nobody (see economy-no-deadlock).
  capByChapter?: Readonly<Record<string, number>>;
};

// The order of the days, to compare `fromChapter` with the current chapter.
const CHAPTER_ORDER = ["chapter-1", "chapter-2", "chapter-3", "chapter-4"];

// How many units of an entry can have been bought by `chapterId`: its stock, held back by the daily cap.
export function stockForChapter(entry: ShopEntry, chapterId: string): number {
  if (!entry.capByChapter) return entry.stock;

  const today = CHAPTER_ORDER.indexOf(chapterId);
  let cap: number | undefined;

  for (const [chapter, units] of Object.entries(entry.capByChapter)) {
    if (CHAPTER_ORDER.indexOf(chapter) <= today) cap = units;
  }

  return Math.min(entry.stock, cap ?? 0);
}

export function entryOnSale(entry: ShopEntry, chapterId: string): boolean {
  if (!entry.fromChapter) return true;

  return CHAPTER_ORDER.indexOf(chapterId) >= CHAPTER_ORDER.indexOf(entry.fromChapter);
}

// The shop as it looks on a given day: only what is on sale that day.
export function shopForChapter(shop: ShopDefinition, chapterId: string): ShopDefinition {
  return {
    ...shop,
    entries: shop.entries
      .filter((entry) => entryOnSale(entry, chapterId))
      .map((entry) => ({ ...entry, stock: stockForChapter(entry, chapterId) })),
  };
}

export type ShopDefinition = {
  id: string;
  // The interaction that opens it.
  interactionId: string;
  title: Record<Language, string>;
  // What the seller says on the counter (NEW text, awaiting Kilian's review).
  greeting: Record<Language, string>;
  entries: readonly ShopEntry[];
};

export const MERCHANT_SHOP: ShopDefinition = {
  id: "plaza-merchant",
  interactionId: "chapter1.plaza.merchant",
  title: { es: "Mercader", en: "Merchant" },
  // 2026-11-16: with the market street open the merchant sells ONLY salt and sugar, "hard-to-get spices".
  // New greeting, awaiting Kilian's review.
  greeting: {
    es: "Sal y azúcar, que por aquí no se encuentran en cualquier parte. Lo demás, en el mercado.",
    en: "Salt and sugar, which aren't found just anywhere around here. For the rest, try the market.",
  },
  entries: [
    // One spare of salt (voluntary errands must never block a case); sugar already has one spare
    // thanks to the baker's gift. The Day 1-2 payments were raised by 5 in total (money/payments.ts)
    // and the no-deadlock test checks that buying every spare still leaves every case curable.
    // Day 1: two (the tavern case + one spare); the rest from Day 2 (daily cap, see ShopEntry).
    { itemId: "salt", price: 2, stock: 5, capByChapter: { "chapter-1": 2, "chapter-2": 4 } },
    // From Day 2 (the price was decided by Kilian): it feeds two patients and two voluntary errands.
    // 2026-11-17: stock 4 (one more on Day 3) because the base syrup of the balsamic syrup also takes a sugar.
    { itemId: "sugar", price: 5, stock: 4, fromChapter: "chapter-2", capByChapter: { "chapter-2": 2, "chapter-3": 4 } },
  ],
};

// THE MARKET STREET (2026-11-16, Kilian): three stalls between the apothecary and the farm, so every
// day's purchases have a place that explains them: they sell cloth, oranges, onion, garlic, bone, fat and
// candle, and the plaza merchant only sugar and salt. Bone and onion have ONE spare unit (see the
// merchant above). New text, awaiting Kilian's review.
export const PRODUCE_STALL: ShopDefinition = {
  id: "market-produce",
  interactionId: "chapter1.market.produce",
  title: { es: "Frutas y verduras", en: "Fruit and vegetables" },
  greeting: {
    es: "Todo de la huerta de esta mañana. Si algo no le gusta, es que no lo ha probado.",
    en: "All from this morning's garden. If you don't like something, you haven't tried it.",
  },
  entries: [
    // Oranges from Day 1 (the farm woman's trade); the Mill branch of Day 1 can then be removed.
    // One a day at most (cumulative: 1, 2, 3): the farm woman's trade, the woodcutter, the path miner.
    { itemId: "orange", price: 1, stock: 3, capByChapter: { "chapter-1": 1, "chapter-2": 2, "chapter-3": 3 } },
    { itemId: "onion", price: 2, stock: 3, fromChapter: "chapter-2", capByChapter: { "chapter-2": 2, "chapter-3": 3 } },
    { itemId: "garlic", price: 5, stock: 1, fromChapter: "chapter-3" },
  ],
};

export const DRAPER_STALL: ShopDefinition = {
  id: "market-draper",
  interactionId: "chapter1.market.draper",
  title: { es: "Telas y retales", en: "Cloth and scraps" },
  greeting: {
    es: "Retales, lino y lana. Lo que sobra de una cosa sirve para otra.",
    en: "Scraps, linen and wool. What's left over from one thing serves for another.",
  },
  entries: [
    { itemId: "cloth", price: 2, stock: 6, capByChapter: { "chapter-1": 3, "chapter-2": 4, "chapter-3": 6 } },
    // 2026-11-18 (Kilian): the candle is out for now (it was only for the statue); the item and the statue
    // conversation stay in the code, dormant.
  ],
};

export const BUTCHER_STALL: ShopDefinition = {
  id: "market-butcher",
  interactionId: "chapter1.market.butcher",
  title: { es: "Carnicería", en: "Butcher" },
  greeting: {
    es: "Huesos para el caldo y grasa para lo que haga falta. De la carne mejor no hablamos hoy.",
    en: "Bones for the broth and fat for whatever's needed. Let's not talk about the meat today.",
  },
  entries: [
    { itemId: "bone", price: 3, stock: 3, fromChapter: "chapter-2", capByChapter: { "chapter-2": 2, "chapter-3": 3 } },
    { itemId: "animal-fat", price: 3, stock: 1, fromChapter: "chapter-2" },
  ],
};

export const SHOPS: Readonly<Record<string, ShopDefinition>> = {
  [MERCHANT_SHOP.interactionId]: MERCHANT_SHOP,
  [PRODUCE_STALL.interactionId]: PRODUCE_STALL,
  [DRAPER_STALL.interactionId]: DRAPER_STALL,
  [BUTCHER_STALL.interactionId]: BUTCHER_STALL,
};

export function getShop(interactionId: string): ShopDefinition | undefined {
  return SHOPS[interactionId];
}

// Where an item is sold on a given day: the shop that has it on sale (the plaza merchant sells sugar and
// salt, the market stalls the rest), or undefined when nobody sells it.
export function shopSelling(itemId: string, chapterId: string): ShopDefinition | undefined {
  return Object.values(SHOPS).find((shop) =>
    shopForChapter(shop, chapterId).entries.some((entry) => entry.itemId === itemId),
  );
}

// Everything on sale on a given day, in every shop (an item sold by two shops appears twice).
export function allEntriesForChapter(chapterId: string): (ShopEntry & { shopId: string })[] {
  return Object.values(SHOPS).flatMap((shop) =>
    shopForChapter(shop, chapterId).entries.map((entry) => ({ ...entry, shopId: shop.id })),
  );
}

const flag = (shopId: string, itemId: string, n: number) =>
  `shop.${shopId}.${itemId}.${n}`;

export function purchasedCount(
  claimed: ReadonlySet<string>,
  shopId: string,
  itemId: string,
): number {
  let n = 0;
  while (claimed.has(flag(shopId, itemId, n + 1))) n++;
  return n;
}

export function unitsLeft(
  claimed: ReadonlySet<string>,
  shop: ShopDefinition,
  entry: ShopEntry,
): number {
  return Math.max(0, entry.stock - purchasedCount(claimed, shop.id, entry.itemId));
}

// The effects of buying ONE unit: pay, receive, remember. Applied all or
// nothing by the game, so the coins never leave without the goods.
export function buyEffects(
  claimed: ReadonlySet<string>,
  shop: ShopDefinition,
  entry: ShopEntry,
) {
  const next = purchasedCount(claimed, shop.id, entry.itemId) + 1;

  return [
    { type: "take-coins" as const, amount: entry.price },
    { type: "give-item" as const, itemId: entry.itemId, quantity: 1 },
    { type: "claim-reward" as const, rewardId: flag(shop.id, entry.itemId, next) },
  ];
}
