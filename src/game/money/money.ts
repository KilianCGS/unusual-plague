// The Doctor's purse: ONE counter of copper coins, not items (they take no
// inventory slot). Pure helpers, nothing is mutated. Kilian's rules: 0 to 99,
// the Doctor starts with 4 (cloth x2 + salt for Day 1, with one coin to spare),
// and the coins carry over from one day to the next.
export const MAX_COINS = 99;
export const STARTING_COINS = 6;

function clamp(coins: number): number {
  return Math.min(MAX_COINS, Math.max(0, Math.floor(coins)));
}

// Earning never fails: past the cap the extra is simply lost (the design keeps
// the totals far below 99, so this is a safety net, not a mechanic).
export function addCoins(coins: number, amount: number): number {
  return clamp(coins + Math.max(0, amount));
}

export function canAfford(coins: number, price: number): boolean {
  return price >= 0 && coins >= price;
}

// The purse after paying, or null when it does not hold enough (nothing is
// spent then).
export function spendCoins(coins: number, price: number): number | null {
  return canAfford(coins, price) ? clamp(coins - price) : null;
}
