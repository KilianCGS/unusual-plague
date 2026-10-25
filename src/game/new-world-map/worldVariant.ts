// The new world (this folder) is THE world of the game: there is no longer a
// switch (NEXT_PUBLIC_WORLD was removed). The old exterior tables, backgrounds
// and geometry files are still in the repository as legacy, unused by the game.
//
// The exterior scenes redrawn for the new world. Every other scene (the
// interiors) is shared with the old tables and keeps its own population.
export const NEW_WORLD_SCENE_IDS = [
  "plaza",
  "apothecary-street",
  "bakery-street",
  "smithy-street",
  "tavern-street",
  "outskirts",
  "forest",
  "forest-cottage",
  "farm",
  "mill-farmland",
  "mountain-path",
] as const;
