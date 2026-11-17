# chapter-4-night

ALL the night paintings of Day 4 (chapter-4) live here, named `<scene-id>-night-background.png`.
Same size as the day image of the scene (only the colours change), so every collider, depth
shape, exit and spawn of the day scene keeps fitting: the night uses the day geometry.

Wired (see `src/game/world/nightScenes.ts` and `src/game/new-world-map/newWorldNightVisuals.ts`):
outskirts (river), apothecary-street, bakery-street, tavern-street, smithy-street, forest,
forest-cottage (the Witch's house), doctor-room, apothecary-main-zone (the Botica).

Still without a painting (they get the dark grade for now): plaza, farm, mill-farmland,
mountain-path, quarry, forest-deep, forest-glade, market-street.

To add one: drop `<scene-id>-night-background.png` here at the day size and add it to
`NIGHT_BACKGROUNDS` in nightScenes.ts (and to `NIGHTS` in newWorldNightVisuals.ts for /dev/collisions).
