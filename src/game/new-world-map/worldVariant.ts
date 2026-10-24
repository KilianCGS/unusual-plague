// WHICH WORLD the game uses. The old exterior world is the default and stays
// untouched; the new one (this folder) is switched on with an environment
// variable, so going back is just not setting it:
//   .env.local            NEXT_PUBLIC_WORLD=new
//   PowerShell            $env:NEXT_PUBLIC_WORLD="new"; npm run dev
// NEXT_PUBLIC_ variables are inlined at build time, so the server and the
// browser always agree.
export const NEW_WORLD_MAP = process.env.NEXT_PUBLIC_WORLD === "new";

// The exterior scenes redrawn for the new world. Every other scene (the
// interiors and Calle Taberna) is shared by both worlds.
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
