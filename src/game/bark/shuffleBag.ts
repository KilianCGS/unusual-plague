// A shuffle bag: every index 0..size-1 comes out once, in random order, before
// any of them comes out again. When the bag runs dry a new shuffled one is made
// whose FIRST item is never the last one drawn, so a phrase is never said twice
// in a row across two rounds either. The randomness is injected (`random`
// returns [0, 1)), so it can be tested without real chance. Pure: nothing here
// mutates its arguments.
export type ShuffleBag = {
  // The indices still to come out, in the order they will.
  remaining: number[];
  // The last index drawn (null before the first draw).
  last: number | null;
};

export type Random = () => number;

function shuffled(size: number, random: Random): number[] {
  const items = Array.from({ length: size }, (_, index) => index);

  for (let index = items.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));

    [items[index], items[other]] = [items[other], items[index]];
  }

  return items;
}

export function createShuffleBag(
  size: number,
  random: Random,
  last: number | null = null,
): ShuffleBag {
  const remaining = shuffled(size, random);

  // never start a round with the phrase that ended the previous one
  if (size > 1 && last !== null && remaining[0] === last) {
    const swapWith = 1 + Math.floor(random() * (size - 1));

    [remaining[0], remaining[swapWith]] = [remaining[swapWith], remaining[0]];
  }

  return { remaining, last };
}

export function drawFromBag(
  bag: ShuffleBag,
  size: number,
  random: Random,
): { index: number; bag: ShuffleBag } {
  const source =
    bag.remaining.length > 0 ? bag : createShuffleBag(size, random, bag.last);
  const [index, ...rest] = source.remaining;

  return { index, bag: { remaining: rest, last: index } };
}
