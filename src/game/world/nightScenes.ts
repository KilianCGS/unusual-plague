import type { WorldScene } from "./worldScenes";

// DAY 4 IS AT NIGHT (2026-11-12). In chapter-4 each exterior scene is drawn with its
// night painting when there is one (ChatGPT's six, lined up on the day images by
// art/night-maps-prepare.cjs, so every collider, depth shape, exit and spawn of the day
// scene still fits). A scene without a painting yet gets a night GRADE (a CSS filter over
// the day image) so the whole village is dark and the walk is coherent; replace it by
// adding its painting here.
export const NIGHT_CHAPTER_ID = "chapter-4";

const NIGHT_DIR = "/game/new-world-map/night";

export const NIGHT_BACKGROUNDS: Readonly<Record<string, string>> = {
  outskirts: `${NIGHT_DIR}/outskirts-night-background.png`,
  "apothecary-street": `${NIGHT_DIR}/apothecary-street-night-background.png`,
  "bakery-street": `${NIGHT_DIR}/bakery-street-night-background.png`,
  "tavern-street": `${NIGHT_DIR}/tavern-street-night-background.png`,
  "smithy-street": `${NIGHT_DIR}/smithy-street-night-background.png`,
  forest: `${NIGHT_DIR}/forest-night-background.png`,
};

// The outdoor scenes that have no night painting yet (they get the grade below).
export const NIGHT_GRADED_OUTDOORS: readonly string[] = [
  "plaza",
  "farm",
  "mill-farmland",
  "mountain-path",
  "quarry",
  "forest-deep",
  "forest-glade",
  "forest-cottage",
];

// The grade for the scenes that have no painting: dark, cool, a little desaturated.
export const NIGHT_GRADE =
  "brightness(0.58) sepia(0.55) hue-rotate(168deg) saturate(1.9) contrast(1.12)";

export function sceneForChapter(scene: WorldScene, chapterId: string): WorldScene {
  if (chapterId !== NIGHT_CHAPTER_ID || scene.kind !== "exterior") return scene;

  const painting = NIGHT_BACKGROUNDS[scene.id];

  if (painting) {
    return { ...scene, visual: { ...scene.visual, backgroundSrc: painting } };
  }

  // Only the OUTDOOR scenes without a painting are graded: the interiors keep their own
  // warm light (they have a night version of their own when Kilian paints one).
  if (!NIGHT_GRADED_OUTDOORS.includes(scene.id)) return scene;

  return { ...scene, visual: { ...scene.visual, backgroundFilter: NIGHT_GRADE } };
}
