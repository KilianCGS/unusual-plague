// Exported from /dev/decorator (COPY CHAPTER): chapter "artifacts" = DAY 4, the night
// (2026-11-12). The Decorator calls this chapter "artifacts"; the game reads it as
// "chapter-4" (see compositions/index.ts). Save its export here as `artifactsCompositions`.
// x / y are WORLD logical units of the instance anchor; interaction.zone is relative to it.
import type { DecorComposition } from "../decor/decorTypes";

// 2026-11-18: Kilian's first (partial) Day 4 export: the forest. More scenes follow.
export const artifactsCompositions: DecorComposition[] = [
  {
    "sceneId": "forest",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "forest-woodcutter-smartphone-01",
        "assetId": "woodcutter-smartphone",
        "x": 722,
        "y": 521,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "forest-ch4-log-pile-01",
        "assetId": "ch4-log-pile",
        "x": 1388,
        "y": 584,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest-cottage",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "forest-cottage-ch4-barrier-horizontal-01",
        "assetId": "ch4-barrier-horizontal",
        "x": 659,
        "y": 786,
        "scale": 1.43,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        // 2026-11-19: the Witch OUTSIDE her cottage, facing us, conjuring. She asks him to come in and then leaves
        // (see chapter4Dialogues.ts: WITCH_OUTSIDE_*).
        "instanceId": "forest-cottage-witch-conjuring-front-01",
        "assetId": "witch-conjuring-front",
        "x": 659,
        "y": 748,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    // 2026-11-19: INSIDE the cottage: the Witch seated, her cat and her ravens. The last conversation happens here.
    "sceneId": "forest-cottage-interior",
    "chapterId": "artifacts",
    "instances": [
      { "instanceId": "forest-cottage-interior-witch-crow-pecking-01", "assetId": "witch-crow-pecking", "x": 375, "y": 48, "scale": 1, "flipX": false, "colliderEnabled": false, "zOffset": 0 },
      { "instanceId": "forest-cottage-interior-witch-crow-cawing-01", "assetId": "witch-crow-cawing", "x": 77, "y": 51, "scale": 1, "flipX": false, "colliderEnabled": false, "zOffset": 0 },
      { "instanceId": "forest-cottage-interior-witch-crow-head-tilt-01", "assetId": "witch-crow-head-tilt", "x": 451, "y": 142, "scale": 1, "flipX": true, "colliderEnabled": false, "zOffset": 0 },
      { "instanceId": "forest-cottage-interior-fireflies-01", "assetId": "fireflies", "x": 442, "y": 227, "scale": 1, "flipX": false, "colliderEnabled": false, "zOffset": 0 },
      { "instanceId": "forest-cottage-interior-merchant-table-01", "assetId": "merchant-table", "x": 63, "y": 336, "scale": 1, "flipX": false, "colliderEnabled": true, "zOffset": 0 },
      { "instanceId": "forest-cottage-interior-witch-tavern-sitting-01", "assetId": "witch-tavern-sitting", "x": 189, "y": 162, "scale": 1, "flipX": true, "colliderEnabled": false, "zOffset": 0 },
      { "instanceId": "forest-cottage-interior-witch-cat-sitting-01", "assetId": "witch-cat-sitting", "x": 110, "y": 173, "scale": 0.89, "flipX": false, "colliderEnabled": false, "zOffset": 0 }
    ]
  }
];
