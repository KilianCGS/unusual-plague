import type { DevScene } from "../../app/dev/scene/scenes";
import { FOREST_COTTAGE_VISUAL, NEW_WORLD_VISUALS } from "./newWorldVisuals";

// Night versions of six streets and the forest (chapter 3). Each is the SAME image as its
// day scene repainted at night, lined up on the day one (art/night-maps-prepare.cjs),
// so every size, unit-per-pixel and spawn is the day scene's. They are AUTHORING ONLY for
// now: /dev/collisions opens them with the day's geometry copied in ("calcado"), so
// Kilian can add the obstacles that close an area at night; they are not in WORLD_SCENES.
// Keyed by the DEV id of the day scene + "-night".
const NIGHT_DIR = "/game/new-world-map/night";

// [dev id of the day scene, night file, label]
const NIGHTS: [string, string, string][] = [
  ["outskirts-brook-provisional", "outskirts-night-background.png", "Río de la ciudad"],
  ["apothecary-street", "apothecary-street-night-background.png", "Calle Botica"],
  ["bakery-street", "bakery-street-night-background.png", "Calle Panadería"],
  ["calle-taberna", "tavern-street-night-background.png", "Calle Taberna"],
  ["smithy-street", "smithy-street-night-background.png", "Calle Herrería"],
  ["forest-v1", "forest-night-background.png", "Bosque"],
  ["forest-cottage", "forest-cottage-night-background.png", "Casita del bosque"],
];

export const NEW_WORLD_NIGHT_VISUALS: DevScene[] = NIGHTS.map(
  ([dayId, file, label]) => {
    const day = [...NEW_WORLD_VISUALS, FOREST_COTTAGE_VISUAL].find((visual) => visual.id === dayId);

    if (!day) {
      throw new Error(`Night scene without a day scene: ${dayId}`);
    }

    return {
      ...day,
      id: nightIdOf(dayId),
      label: `${label} (noche)`,
      backgroundSrc: `${NIGHT_DIR}/${file}`,
    };
  },
);

export function nightIdOf(dayDevSceneId: string): string {
  return `${dayDevSceneId}-night`;
}

export const NIGHT_DAY_IDS = NIGHTS.map(([dayId]) => dayId);
