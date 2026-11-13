// Where the tutorial's bobbing arrows hang in the Botica (logical units, 480x293). They are
// read from the PAINTING (1606x979 px, 0.2989 unit per pixel): one right above the long table at
// the left (its top edge), the other above the cauldron on the stove. They only point; the
// interaction zones themselves (apothecaryMainZoneGeometry.ts, hand-drawn) are not touched.
export const BOTICA_STATION_POINTERS: Readonly<Record<string, { x: number; y: number }>> = {
  "craft.manual": { x: 87, y: 84 },
  "craft.fire": { x: 363, y: 74 },
};
