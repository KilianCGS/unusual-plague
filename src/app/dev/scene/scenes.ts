import type { SceneCollider } from "../../../game/collision";
import {
  FOREST_COTTAGE_INTERIOR_VISUAL,
  FOREST_COTTAGE_VISUAL,
  NEW_WORLD_VISUALS,
} from "../../../game/new-world-map/newWorldVisuals";
import { plazaColliders } from "../../../game/plaza/plazaGeometry";

// EXPERIMENTAL scale test scenes for /dev/scene. None of these values is an
// approved world size, and none is a general scale for exteriors.
//
// Asset pixels are NOT logical units. Each scene declares its background size
// in asset pixels; the logical world is derived from it with
// LOGICAL_UNITS_PER_ASSET_PIXEL. Plaza V2 (512 px -> 960 units) is the
// reference: any scene drawn at the same pixel scale keeps the character /
// props proportion that was approved visually there. Change the constant, or a
// scene's own `logicalUnitsPerAssetPixel`, to test other scales.
export const LOGICAL_UNITS_PER_ASSET_PIXEL = 1.875;

// EXPERIMENTAL reference viewport (logical units) used to derive the zoom of
// every scene in /dev/scene. It equals the world of Calle Taberna V2, so that
// scene keeps its current look. It is a visual-validation value, not a final
// architectural decision about the real game viewport.
export const REFERENCE_VIEWPORT = { width: 1161, height: 602 };

export type DevScene = {
  id: string;
  label: string;
  backgroundSrc: string;
  // Size of the runtime background image, in asset pixels.
  assetWidth: number;
  assetHeight: number;
  // Initial feet position, in asset pixels of the background.
  initialAssetX: number;
  initialAssetY: number;
  logicalUnitsPerAssetPixel?: number;
  // Multiplies the shared zoom (1 = same apparent size as Calle Taberna).
  zoomMultiplier?: number;
  // Purely visual size of the protagonist sprite (default 1). Scales the image
  // around its feet anchor; position, hitbox and physics are unaffected.
  protagonistScale?: number;
  // Colliders in world units, fed to useProtagonistController as-is.
  colliders?: SceneCollider[];
};

const OLD_DEV_SCENES: DevScene[] = [
  {
    id: "plaza",
    label: "Plaza V2",
    backgroundSrc: "/game/areas/plaza/plaza-background.png",
    assetWidth: 512,
    assetHeight: 512,
    initialAssetX: 256,
    initialAssetY: 256,
    // First camera test: same apparent zoom as Calle Taberna.
    zoomMultiplier: 1.0,
    // Hand-painted in /dev/collisions (world units).
    colliders: plazaColliders,
  },
  {
    id: "apothecary-street",
    label: "Calle Botica",
    // Approved edited version of art/references/apothecary-street-v1.png
    // (448x562): pillar removed and bottom hedges cropped. No zoomMultiplier
    // yet; same 1.875 units per asset pixel as the other exteriors.
    backgroundSrc:
      "/game/areas/apothecary-street/apothecary-street-background.png",
    assetWidth: 448,
    assetHeight: 562,
    // PROVISIONAL spawn for the /dev/scene Doctor Test on the middle of the
    // street. NOT one of the final transition spawns.
    initialAssetX: 224,
    initialAssetY: 400,
  },
  {
    id: "calle-taberna",
    label: "Calle Taberna V2",
    // Technical crop of the white margins of art/references/calle-taberna-v2.png
    // (x=10..628, y=32..352), no pixel of the artwork modified.
    backgroundSrc: "/game/areas/calle-taberna/calle-taberna-background.png",
    assetWidth: 619,
    assetHeight: 321,
    // Middle of the cobblestone street.
    initialAssetX: 310,
    initialAssetY: 200,
  },
  {
    id: "outskirts-brook-provisional",
    label: "Afueras-Riachuelo provisional",
    // PROVISIONAL: exact technical crop of the 100 leftmost columns of
    // art/references/outskirts-brook-v1.png (588x384), no pixel modified. Not
    // the final V2; the second lower house is still partly visible.
    backgroundSrc:
      "/game/areas/outskirts-brook/outskirts-brook-background-provisional.png",
    assetWidth: 588,
    assetHeight: 384,
    // Left zone, on the horizontal road (y ~180-222), well inside the frame.
    initialAssetX: 110,
    initialAssetY: 205,
  },
  {
    id: "forest-v1",
    label: "Bosque V1",
    // Unmodified copy of art/references/forest-v1.png (512x512).
    backgroundSrc: "/game/areas/forest/forest-background.png",
    assetWidth: 512,
    assetHeight: 512,
    // Left entrance, on the dirt trail (y ~245-285), inside the map.
    initialAssetX: 72,
    initialAssetY: 272,
    // Experimental: closer zoom so only part of the forest is visible at once
    // (the whole width fits the reference viewport otherwise). 1.15 shows about
    // 960x523 of the 960x960 world (was 1.5, then 1.3; both judged too close).
    zoomMultiplier: 1.15,
  },
  {
    id: "doctor-room",
    label: "Habitaci�n del Doctor",
    // Unmodified copy of art/references/doctor-room-v6.png (1385x1136), the
    // Doctor's Room in play. 0.375 unit per asset pixel like the other approved
    // interiors, so the logical world is 519x426 (1385 x 1136 keeps its 1.219
    // aspect ratio) and the whole room is in frame at zoomMultiplier 1.5.
    backgroundSrc: "/game/areas/doctor-room/doctor-room-new-background.png",
    assetWidth: 1385,
    assetHeight: 1136,
    // The middle of the room (only a neutral seed for the dev tools).
    initialAssetX: 692,
    initialAssetY: 568,
    logicalUnitsPerAssetPixel: 0.375,
    zoomMultiplier: 1.5,
  },
  {
    id: "tavern-interior",
    label: "Interior Taberna",
    // Unmodified copy of the approved 1536x1024 tavern interior. The room is
    // 576x384 logical units (0.375 per asset pixel) so it reads as a bigger
    // room than the old 480x270 one at the same Doctor size; zoomMultiplier
    // 1.5 shows the whole room (frame 576x384), so the camera stays fixed.
    backgroundSrc: "/game/areas/tavern-interior/tavern-interior-background.png",
    assetWidth: 1536,
    assetHeight: 1024,
    // On the floor just in front of the south doorway.
    initialAssetX: 780,
    initialAssetY: 850,
    logicalUnitsPerAssetPixel: 0.375,
    zoomMultiplier: 1.5,
  },
  {
    id: "bakery-street",
    label: "Calle Panadería",
    // Unmodified copy of art/references/bakery-street-v1.png (448x600).
    backgroundSrc: "/game/areas/bakery-street/bakery-street-background.png",
    assetWidth: 448,
    assetHeight: 600,
    // Provisional: top of the street, just below the entrance from the plaza.
    initialAssetX: 224,
    initialAssetY: 60,
  },
  {
    id: "bakers-bedroom",
    label: "Bakers Bedroom (narrativa)",
    // Unmodified copy of art/locations/bakers-bedroom/bakers-bedroom-v4.png
    // (1536x1024), the new room. Same 576x384 logical world and zoom as the
    // tavern, smithy and bakery interiors (0.375 unit per asset pixel, whole
    // room in frame, fixed camera). A narrative microscene: not part of the
    // map, nothing to walk. Initial position: the centre of the room (only a
    // neutral seed; nobody spawns here).
    backgroundSrc: "/game/areas/bakers-bedroom/bakers-bedroom-background.png",
    assetWidth: 1536,
    assetHeight: 1024,
    initialAssetX: 768,
    initialAssetY: 512,
    logicalUnitsPerAssetPixel: 0.375,
    zoomMultiplier: 1.5,
  },
  {
    id: "bakery-interior",
    label: "Interior Panadería",
    // Unmodified copy of the approved 1536x1024 bakery interior. Same
    // 576x384 logical world and zoom as the tavern and smithy interiors (0.375
    // unit per asset pixel, whole room in frame, fixed camera).
    backgroundSrc: "/game/areas/bakery-interior/bakery-interior-background.png",
    assetWidth: 1536,
    assetHeight: 1024,
    // On the floor above the south doorway.
    initialAssetX: 770,
    initialAssetY: 760,
    logicalUnitsPerAssetPixel: 0.375,
    zoomMultiplier: 1.5,
  },
  {
    id: "smithy-street",
    label: "Calle Herrería",
    // Unmodified copy of art/references/smithy-street-v3.png (602x360):
    // manually finished by hand from smithy-street-v2.png (well removed,
    // right side cropped, forge glow retouched). Approved as final.
    backgroundSrc: "/game/areas/smithy-street/smithy-street-background.png",
    assetWidth: 602,
    assetHeight: 360,
    // Provisional: near the right (east) edge, the way to the Plaza.
    initialAssetX: 550,
    initialAssetY: 180,
  },
  {
    id: "smithy-interior",
    label: "Interior Herrería",
    // Unmodified copy of the approved 1536x1024 smithy interior. Same
    // 576x384 logical world and zoom as the tavern and bakery interiors (0.375
    // unit per asset pixel, whole room in frame, fixed camera). The Doctor is
    // drawn at the normal size (the old 833x581 world needed protagonistScale
    // 1.5 to compensate for its larger logical scale).
    backgroundSrc: "/game/areas/smithy-interior/smithy-interior-background.png",
    assetWidth: 1536,
    assetHeight: 1024,
    // On the floor just above the south doorway.
    initialAssetX: 767,
    initialAssetY: 760,
    logicalUnitsPerAssetPixel: 0.375,
    zoomMultiplier: 1.5,
  },
  {
    id: "mountain-path",
    label: "Camino de Montaña",
    // Unmodified copy of art/references/mountain-path-v1.png (688x384).
    backgroundSrc: "/game/areas/mountain-path/mountain-path-background.png",
    assetWidth: 688,
    assetHeight: 384,
    // Provisional: near the right edge, the way to Calle Herrería.
    initialAssetX: 640,
    initialAssetY: 200,
  },
  {
    id: "mine-interior",
    label: "Interior Mina",
    // Unmodified copy of the approved 1602x982 mine interior. Same zoom
    // approach as the other new interiors: 0.36 unit per asset pixel gives a
    // 577x354 world, and zoomMultiplier 1.5 shows all of it (fixed camera).
    // Its geometry (old art, old size) is a placeholder until it is repainted
    // in /dev/collisions.
    backgroundSrc: "/game/areas/mine-interior/mine-interior-background.png",
    assetWidth: 1602,
    assetHeight: 982,
    // On the floor just inside the entrance.
    initialAssetX: 800,
    initialAssetY: 700,
    logicalUnitsPerAssetPixel: 0.36,
    zoomMultiplier: 1.5,
  },
  {
    id: "mine-natural-cave",
    label: "Cámara Natural",
    // Unmodified copy of the approved 1618x972 natural cave (entrance on the
    // left, underground lake on the right). 0.36 unit per asset pixel gives a
    // 583x350 world and zoomMultiplier 1.5 shows all of it (fixed camera). The
    // Doctor is drawn at the normal size (the old 693x550 world needed
    // protagonistScale 1.5). Its geometry is a placeholder until it is
    // repainted in /dev/collisions.
    backgroundSrc:
      "/game/areas/mine-natural-cave/mine-natural-cave-background.png",
    assetWidth: 1618,
    assetHeight: 972,
    // On the floor just inside the left entrance.
    initialAssetX: 300,
    initialAssetY: 500,
    logicalUnitsPerAssetPixel: 0.36,
    zoomMultiplier: 1.5,
  },
  {
    id: "apothecary-main-zone",
    label: "Botica nueva (Apothecary Main Zone)",
    // Unmodified copy of art/references/apothecary-interior-v3.png (1606x979),
    // the Botica's art. The scene keeps the width of its 480-unit room, so one
    // asset pixel is 480/1606 units and the logical world is 480x293 (979 *
    // 480/1606 = 292.6); the image is drawn into it at 100% x 100% (a 0.14%
    // vertical stretch, not a crop). The hard-wired ApothecaryScene uses the
    // same 480x293 box. In the game it is the scene "apothecary-interior".
    backgroundSrc: "/game/areas/apothecary/apothecary-main-zone-background.png",
    assetWidth: 1606,
    assetHeight: 979,
    // The middle of the room (only a neutral seed).
    initialAssetX: 803,
    initialAssetY: 560,
    logicalUnitsPerAssetPixel: 480 / 1606,
    zoomMultiplier: 602 / 270,
  },
  {
    id: "farm",
    label: "Granja (Farm)",
    // Unmodified copy of art/references/farm-v1-color-match.png (678x384):
    // farm-v1.png color-matched to Outskirts' palette (deterministic, every
    // pixel/alpha/position unchanged). Standard exterior scale; no geometry
    // painted yet and not connected to the world.
    backgroundSrc: "/game/areas/farm/farm-background.png",
    assetWidth: 678,
    assetHeight: 384,
    // Provisional: on the dirt road along the bottom of the map.
    initialAssetX: 450,
    initialAssetY: 352,
  },
  {
    id: "mill-farmland",
    label: "Tierras del Molino",
    // Unmodified copy of art/references/mill-plantation-v2.png (777x384), the
    // version manually edited by hand after generation (river on the left,
    // added fences/borders). Standard exterior scale; no geometry painted yet
    // and not connected to the world.
    backgroundSrc: "/game/areas/mill-farmland/mill-farmland-background.png",
    assetWidth: 777,
    assetHeight: 384,
    // Provisional: on the main dirt path between the mill and the fields.
    initialAssetX: 430,
    initialAssetY: 260,
  },
];

// The new-world-map backgrounds replace the old exterior ones (same scene ids);
// the rest (interiors...) are unchanged. The old entries of the replaced scenes
// stay in OLD_DEV_SCENES as legacy.
export const DEV_SCENES: DevScene[] = [
  ...OLD_DEV_SCENES.map(
    (scene) =>
      NEW_WORLD_VISUALS.find((visual) => visual.id === scene.id) ?? scene,
  ),
  FOREST_COTTAGE_VISUAL,
  FOREST_COTTAGE_INTERIOR_VISUAL,
];

export function getSceneWorld(scene: DevScene) {
  const unitsPerPixel =
    scene.logicalUnitsPerAssetPixel ?? LOGICAL_UNITS_PER_ASSET_PIXEL;

  return {
    width: Math.round(scene.assetWidth * unitsPerPixel),
    height: Math.round(scene.assetHeight * unitsPerPixel),
    initialX: Math.round(scene.initialAssetX * unitsPerPixel),
    initialY: Math.round(scene.initialAssetY * unitsPerPixel),
  };
}
