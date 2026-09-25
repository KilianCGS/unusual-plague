import type { SceneCollider } from "../../../game/collision";
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

export const DEV_SCENES: DevScene[] = [
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
    label: "Habitación del Doctor",
    // Unmodified copy of art/references/doctor-room-v5.png (288x320), approved
    // provisionally. Interior: 1 unit per asset pixel like the Apothecary, so
    // the sprite keeps the interior scale. zoomMultiplier 602 / 270 gives the
    // same zoom as the 480x270 interiors; the frame is then 288x270 of the
    // 288x320 room and the camera only scrolls vertically.
    backgroundSrc: "/game/areas/doctor-room/doctor-room-background.png",
    assetWidth: 288,
    assetHeight: 320,
    // Provisional: on the floor just inside the bottom threshold.
    initialAssetX: 144,
    initialAssetY: 262,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 602 / 270,
  },
  {
    id: "tavern-interior",
    label: "Interior Taberna",
    // Unmodified copy of art/references/tavern-interior-v1.png (480x270), same
    // interior scale/zoom as the Doctor's room and the Apothecary.
    backgroundSrc: "/game/areas/tavern-interior/tavern-interior-background.png",
    assetWidth: 480,
    assetHeight: 270,
    // Provisional: on the floor just in front of the south double door.
    initialAssetX: 240,
    initialAssetY: 192,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 602 / 270,
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
    id: "bakery-interior",
    label: "Interior Panadería",
    // Lossless 1:1 crop (x 45..433, y 13..254, no resize, no padding) of
    // art/references/bakery-interior-v2.png, which had a white margin around the
    // room. Interior: 1 unit per asset pixel; zoomMultiplier 602 / 270 keeps the
    // same zoom (and Doctor size) as the 480x270 interiors. The whole 389x242
    // room fits the frame, so the camera stays fixed.
    backgroundSrc: "/game/areas/bakery-interior/bakery-interior-background.png",
    assetWidth: 389,
    assetHeight: 242,
    // Provisional: on the floor above the bottom threshold.
    initialAssetX: 195,
    initialAssetY: 157,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 602 / 270,
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
    // Unmodified copy of art/references/smithy-interior-v2-approved.png
    // (833x581): smithy-interior-v1.png (416x304) manually finished by hand,
    // fixing the two white background patches at the bottom threshold.
    // Approved as final; 833x581 is the logical world the geometry was
    // painted against, so it stays exactly as-is.
    //
    // zoomMultiplier 1 (not 602/270 like the other interiors): this world is
    // much bigger than theirs (833x581 vs ~270-480 tall), and 602/270 would
    // zoom the camera in as if it were the same size, showing only a small
    // cropped slice at a time. computeFrame(world, REFERENCE_VIEWPORT,
    // zoomMultiplier) = min(world, referenceViewport / zoomMultiplier), so
    // zoomMultiplier 1 gives frame = min(833,1161) x min(581,602) = 833x581:
    // the whole room, no scrolling. This does NOT change the Doctor's size
    // relative to the furniture (that ratio is fixed by the asset's own
    // logical pixels vs the sprite's fixed 96-unit size, and camera/zoom
    // scales both together) - only how much of the room the camera shows and
    // how large everything appears together on screen.
    backgroundSrc: "/game/areas/smithy-interior/smithy-interior-background.png",
    assetWidth: 833,
    assetHeight: 581,
    // Provisional: on the floor just above the bottom threshold.
    initialAssetX: 417,
    initialAssetY: 497,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 1,
    protagonistScale: 1.5,
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
    // Unmodified copy of art/references/mine-interior-v3.png (632x420):
    // worked mining zone left, natural cave right, central open area above
    // the bottom exit. The rock reaches all four canvas edges/corners,
    // unlike v1/v2. Approved as the definitive Mina Principal. v4 (an
    // inpaint of v3's right side) and v1/v2 are discarded iterations only.
    backgroundSrc: "/game/areas/mine-interior/mine-interior-background.png",
    assetWidth: 632,
    assetHeight: 420,
    // Provisional: on the floor just above the bottom exit.
    initialAssetX: 316,
    initialAssetY: 380,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 602 / 270,
  },
  {
    id: "mine-natural-cave",
    label: "Cámara Natural",
    // Unmodified copy of art/references/mine-natural-cave-v3.png (693x550): a
    // separate, independent asset (not an edit of mine-interior), a small
    // hidden natural chamber reached from the Mina's right side. Only entrance
    // is a gap in the LEFT wall; top, right and bottom are fully closed rock.
    // v3 is v1's composition (approved) with a material-aware recolor toward
    // the Mina Principal's palette, then manually cropped/finished by hand.
    // Approved as final; 693x550 is the logical world the geometry was
    // painted against, so it stays exactly as-is.
    //
    // zoomMultiplier 1, same reasoning as smithy-interior: this world is much
    // bigger than the other interiors', so the shared 602/270 multiplier
    // cropped the camera in tight. zoomMultiplier 1 gives frame =
    // min(693,1161) x min(550,602) = 693x550: the whole chamber, no
    // scrolling, without touching the Doctor/furniture proportion (fixed by
    // the asset's own logical pixels, unaffected by zoom).
    backgroundSrc: "/game/areas/mine-natural-cave/mine-natural-cave-background.png",
    assetWidth: 693,
    assetHeight: 550,
    // Provisional: on the floor just inside the left entrance.
    initialAssetX: 50,
    initialAssetY: 300,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 1,
    protagonistScale: 1.5,
  },
  {
    id: "apothecary-interior",
    label: "Botica (interior)",
    // The Apothecary interior itself, added here only so /dev/scene and
    // /dev/collisions can display and edit its already-persisted geometry
    // (apothecaryInteriorGeometry.ts). Real gameplay
    // does NOT use this entry: ApothecaryScene.tsx is hard-wired to its own
    // fixed 480x270 room (see ApothecaryScene.module.css) and is rendered
    // directly, not through DEV_SCENES/ExteriorScene. This entry mirrors
    // those exact same logical dimensions (480x270, 1 unit per pixel) so
    // colliders/transitions/spawns painted here line up with the real scene.
    //
    // CAVEAT: the background PNG is 1586x992 and CSS renders it with
    // `background-size: cover` into the 480x270 box, so this editor preview
    // is not a byte-exact crop of the real view (parts of the tall/wide
    // source image get cropped by `cover` in ways this simple <img>-style
    // background can't reproduce exactly). The geometry numbers themselves
    // are unaffected: they're defined in the same 480x270 logical space as
    // actual gameplay.
    backgroundSrc: "/game/areas/apothecary/apothecary-background.png",
    assetWidth: 480,
    assetHeight: 270,
    // Provisional: matches the existing start position.
    initialAssetX: 240,
    initialAssetY: 220,
    logicalUnitsPerAssetPixel: 1,
    zoomMultiplier: 602 / 270,
  },
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
