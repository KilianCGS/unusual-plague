import type { Language } from "./types";

// Every line here is NEW narrative/UI text awaiting Kilian's review.
type MoneyCopy = {
  coins: string;
  // "You receive 5 coins." / "You receive 1 coin."
  received: (amount: number) => string;
  spent: (amount: number) => string;
  // The Doctor, when a price is out of reach: he knows he must earn something.
  notEnough: string;
  noRoom: string;
  shop: {
    close: string;
    buy: string;
    soldOut: string;
    price: string;
  };
};

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const moneyCopy: Record<Language, MoneyCopy> = {
  es: {
    coins: "Monedas",
    received: (n) => `Recibes ${n} ${plural(n, "moneda", "monedas")}.`,
    spent: (n) => `Pagas ${n} ${plural(n, "moneda", "monedas")}.`,
    notEnough: "(No me alcanza. Debería ganar algo antes.)",
    noRoom: "(No tengo espacio para llevar esto.)",
    shop: { close: "Cerrar", buy: "Comprar", soldOut: "Agotado", price: "Precio" },
  },
  en: {
    coins: "Coins",
    received: (n) => `You receive ${n} ${plural(n, "coin", "coins")}.`,
    spent: (n) => `You pay ${n} ${plural(n, "coin", "coins")}.`,
    notEnough: "(I can't afford it. I should earn something first.)",
    noRoom: "(I don't have room to carry this.)",
    shop: { close: "Close", buy: "Buy", soldOut: "Sold out", price: "Price" },
  },
};
