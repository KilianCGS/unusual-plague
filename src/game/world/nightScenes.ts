import type { WorldScene } from "./worldScenes";

// DAY 4 IS AT NIGHT (2026-11-12). In chapter-4 each exterior scene is drawn with its
// night painting when there is one (ChatGPT's six, lined up on the day images by
// art/night-maps-prepare.cjs, so every collider, depth shape, exit and spawn of the day
// scene still fits). A scene without a painting yet gets a night GRADE (a CSS filter over
// the day image) so the whole village is dark and the walk is coherent; replace it by
// adding its painting here.
export const NIGHT_CHAPTER_ID = "chapter-4";

// 2026-11-17: every night painting lives in public/game/chapter-4-night/ (Kilian's folder).
const NIGHT_DIR = "/game/chapter-4-night";

export const NIGHT_BACKGROUNDS: Readonly<Record<string, string>> = {
  outskirts: `${NIGHT_DIR}/outskirts-night-background.png`,
  "apothecary-street": `${NIGHT_DIR}/apothecary-street-night-background.png`,
  "bakery-street": `${NIGHT_DIR}/bakery-street-night-background.png`,
  "tavern-street": `${NIGHT_DIR}/tavern-street-night-background.png`,
  "smithy-street": `${NIGHT_DIR}/smithy-street-night-background.png`,
  forest: `${NIGHT_DIR}/forest-night-background.png`,
  // The Witch's cottage at night (2026-11-12): where the Doctor meets her on Day 4.
  "forest-cottage": `${NIGHT_DIR}/forest-cottage-night-background.png`,
  // The Doctor's Room at night (2026-11-13): where Day 4 begins.
  "doctor-room": `${NIGHT_DIR}/doctor-room-night-background.png`,
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
  "market-street",
];

// The grade for the scenes that have no painting: dark, cool, a little desaturated.
export const NIGHT_GRADE =
  "brightness(0.58) sepia(0.55) hue-rotate(168deg) saturate(1.9) contrast(1.12)";

// The night look of a scene's visual (its painting, or the grade when it has none yet). Used by the
// Decorator when it edits Day 4 ("artifacts"), so Kilian places things on the night image. The Botica
// (a scene of its own in the Decorator, "apothecary-main-zone") has its night painting too.
export function nightVisualFor<V extends { backgroundSrc: string; backgroundFilter?: string }>(
  sceneId: string,
  visual: V,
): V {
  if (sceneId === "apothecary-main-zone") return { ...visual, backgroundSrc: APOTHECARY_NIGHT_BACKGROUND };
  const painting = NIGHT_BACKGROUNDS[sceneId];
  if (painting) return { ...visual, backgroundSrc: painting };
  if (NIGHT_GRADED_OUTDOORS.includes(sceneId)) return { ...visual, backgroundFilter: NIGHT_GRADE };
  return visual;
}

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

// The Botica is drawn by its own scene, not by the generic renderer: its night painting
// (2026-11-13, same 1606x979 size as the day one) is chosen here for Day 4.
export const APOTHECARY_NIGHT_BACKGROUND =
  `${NIGHT_DIR}/apothecary-main-zone-night-background.png`;
