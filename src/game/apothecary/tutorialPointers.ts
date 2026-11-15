// Where the tutorial's bobbing arrows hang in the Botica (logical units, 480x293). They are
// read from the PAINTING (1606x979 px, 0.2989 unit per pixel): one right above the long table at
// the left (its top edge), the other above the cauldron on the stove. They only point; the
// interaction zones themselves (apothecaryMainZoneGeometry.ts, hand-drawn) are not touched.
export const BOTICA_STATION_POINTERS: Readonly<Record<string, { x: number; y: number }>> = {
  "craft.manual": { x: 87, y: 84 },
  "craft.fire": { x: 363, y: 74 },
};

// The white ovals on the floor where the Doctor stands to use each station (centre and size in
// logical units). Read from the ovals Kilian drew on a screenshot, checked against the hand-drawn
// interaction zones: the stove zone (x323-415, y116-127) and the table zone (x115-134, y98-168).
export const BOTICA_STATION_RINGS: Readonly<Record<string, { x: number; y: number; width: number; height: number }>> = {
  "craft.manual": { x: 136, y: 136, width: 32, height: 16 },
  "craft.fire": { x: 365, y: 124, width: 36, height: 16 },
};

// While the kitchen cooks: where the steam leaves the cauldron and where the stove fire burns
// (logical units, read from the painting like the arrows: the cauldron's rim and the oven mouth).
export const BOTICA_POT_STEAM = { x: 364, y: 77 };
export const BOTICA_STOVE_FIRE = { x: 362, y: 103 };
