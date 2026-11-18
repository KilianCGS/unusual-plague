# chapter-4-night

ALL the night paintings of Day 4 (chapter-4) live here, named `<scene-id>-night-background.png`.
Same size as the day image of the scene (only the colours change), so every collider, depth
shape, exit and spawn of the day scene keeps fitting: the night uses the day geometry.

The Decorator ("artifacts" chapter) and the game use ONLY these files for the night.

Wired (see `src/game/world/nightScenes.ts` and `src/game/new-world-map/newWorldNightVisuals.ts`):
outskirts (river), apothecary-street, bakery-street, tavern-street, smithy-street, forest, plaza,
forest-cottage (the Witch's house), doctor-room, apothecary-main-zone (the Botica).

2026-11-18: Kilian replaced the forest (`bosqueNocturno.png`) and the bakery street (`panaderiaNoche.png`);
they were renamed to the names above. They measure exactly the same as their day images.

Still without a painting (they get the dark grade for now): farm, mill-farmland, mountain-path, quarry,
forest-deep, forest-glade, market-street.

To add one: drop `<scene-id>-night-background.png` here at the day size and add it to
`NIGHT_BACKGROUNDS` in nightScenes.ts (and to `NIGHTS` in newWorldNightVisuals.ts for /dev/collisions).
