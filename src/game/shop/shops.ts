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
};

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
  title: { es: "MERCADER", en: "MERCHANT" },
  greeting: {
    es: "Poco género, pero honrado. Lo que no vea aquí, no lo tengo.",
    en: "Not much stock, but honest. If you don't see it here, I don't have it.",
  },
  // Day 1 needs two scraps for the cold cloth and the bandage and Day 2 needs
  // a third for the compress, so three are on sale, one coin each.
  entries: [{ itemId: "cloth", price: 1, stock: 3 }],
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
