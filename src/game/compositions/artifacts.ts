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
      }
    ]
  }
];
