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
};

// The order of the days, to compare `fromChapter` with the current chapter.
const CHAPTER_ORDER = ["chapter-1", "chapter-2", "chapter-3", "chapter-4"];

export function entryOnSale(entry: ShopEntry, chapterId: string): boolean {
  if (!entry.fromChapter) return true;

  return CHAPTER_ORDER.indexOf(chapterId) >= CHAPTER_ORDER.indexOf(entry.fromChapter);
}

// The shop as it looks on a given day: only what is on sale that day.
export function shopForChapter(shop: ShopDefinition, chapterId: string): ShopDefinition {
  return { ...shop, entries: shop.entries.filter((entry) => entryOnSale(entry, chapterId)) };
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
  greeting: {
    es: "Poco género, pero honrado. Lo que no vea aquí, no lo tengo.",
    en: "Not much stock, but honest. If you don't see it here, I don't have it.",
  },
  // Day 1 needs two scraps for the cold cloth and the bandage and Day 2 needs
  // a third for the compress, so three are on sale, one coin each. Salt (the
  // tavern man's soup) is sold too, so that case never waits for the baker's
  // thank-you: Day 1 spends 2 + 1 of the 4 starting coins.
  entries: [
    { itemId: "cloth", price: 2, stock: 4 },
    { itemId: "salt", price: 2, stock: 1 },
    // From Day 2 (prices decided by Kilian, 2026-11-11: sugar 3, bone 1, onion 1).
    // None of these is needed to cure a patient: they feed the cooking recipes and
    // the errands. The stock (3 each) is a proposal, to be balanced.
    { itemId: "sugar", price: 6, stock: 4, fromChapter: "chapter-2" },
    { itemId: "onion", price: 2, stock: 3, fromChapter: "chapter-2" },
    { itemId: "bone", price: 3, stock: 3, fromChapter: "chapter-2" },
    // From Day 3: garlic, which the balsamic syrup of the sweeper's cough needs. It has no
    // other source in the world; 2 coins is Kilian's earlier decision (2026-11-09).
    { itemId: "garlic", price: 5, stock: 2, fromChapter: "chapter-3" },
  ],
};

export const SHOPS: Readonly<Record<string, ShopDefinition>> = {
  [MERCHANT_SHOP.interactionId]: MERCHANT_SHOP,
};

export function getShop(interactionId: string): ShopDefinition | undefined {
  return SHOPS[interactionId];
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
