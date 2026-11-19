// Exported from /dev/decorator (COPY CHAPTER): chapter "artifacts" = DAY 4, the night. The Decorator calls this chapter
// "artifacts"; the game reads it as "chapter-4" (see compositions/index.ts). Save its export here as
// `artifactsCompositions`. x / y are WORLD logical units of the instance anchor; interaction.zone is relative to it.
// 2026-11-19: Kilian's COMPLETE Day 4 export (all the absorbed villagers, the roadblocks, the Witch outside and inside).
import type { DecorComposition } from "../decor/decorTypes";

export const artifactsCompositions: DecorComposition[] = [
  {
    "sceneId": "apothecary-street",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "apothecary-street-woman-sweeping-smartphone-01",
        "assetId": "woman-sweeping-smartphone",
        "x": 210,
        "y": 659,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-street-ch4-barrier-horizontal-01",
        "assetId": "ch4-barrier-horizontal",
        "x": 363,
        "y": 391,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-street-ch4-burning-cart-01",
        "assetId": "ch4-burning-cart",
        "x": 685,
        "y": 428,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "bakery-interior",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "bakery-interior-baker-smartphone-01",
        "assetId": "baker-smartphone",
        "x": 321,
        "y": 166,
        "scale": 0.89,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "bakery-street",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "bakery-street-old-man-bench-smartphone-01",
        "assetId": "old-man-bench-smartphone",
        "x": 690,
        "y": 730,
        "scale": 0.81,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "forest-woodcutter-smartphone-01",
        "assetId": "woodcutter-smartphone",
        "x": 738,
        "y": 521,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "forest-ch4-log-pile-01",
        "assetId": "ch4-log-pile",
        "x": 1391,
        "y": 579,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "forest-ch4-log-pile-02",
        "assetId": "ch4-log-pile",
        "x": 1408,
        "y": 630,
        "scale": 1,
        "flipX": false,
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
    "sceneId": "forest-cottage-interior",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "forest-cottage-interior-witch-crow-pecking-01",
        "assetId": "witch-crow-pecking",
        "x": 375,
        "y": 48,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-witch-crow-cawing-01",
        "assetId": "witch-crow-cawing",
        "x": 77,
        "y": 51,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-witch-crow-head-tilt-01",
        "assetId": "witch-crow-head-tilt",
        "x": 451,
        "y": 142,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-fireflies-01",
        "assetId": "fireflies",
        "x": 442,
        "y": 227,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-merchant-table-01",
        "assetId": "merchant-table",
        "x": 63,
        "y": 336,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-witch-tavern-sitting-01",
        "assetId": "witch-tavern-sitting",
        "x": 189,
        "y": 162,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-witch-cat-sitting-01",
        "assetId": "witch-cat-sitting",
        "x": 110,
        "y": 173,
        "scale": 0.89,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "outskirts",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "outskirts-fisherman-smartphone-01",
        "assetId": "fisherman-smartphone",
        "x": 434,
        "y": 246,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-ch4-fallen-tree-01",
        "assetId": "ch4-fallen-tree",
        "x": 420,
        "y": 65,
        "scale": 0.68,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-woman-washing-clothes-smartphone-01",
        "assetId": "woman-washing-clothes-smartphone",
        "x": 446,
        "y": 723,
        "scale": 0.78,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "plaza",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "plaza-villager-sitting-smartphone-01",
        "assetId": "villager-sitting-smartphone",
        "x": 514,
        "y": 260,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-fainted-man-smartphone-01",
        "assetId": "fainted-man-smartphone",
        "x": 294,
        "y": 688,
        "scale": 0.84,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "smithy-interior",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "smithy-interior-blacksmith-smartphone-01",
        "assetId": "blacksmith-smartphone",
        "x": 412,
        "y": 164,
        "scale": 0.92,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "smithy-street",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "smithy-street-child-sitting-smartphone-01",
        "assetId": "child-sitting-smartphone",
        "x": 195,
        "y": 424,
        "scale": 0.81,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-street-child-sitting-legs-smartphone-01",
        "assetId": "child-sitting-legs-smartphone",
        "x": 250,
        "y": 446,
        "scale": 0.82,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-street-ch4-stone-blocks-01",
        "assetId": "ch4-stone-blocks",
        "x": 15,
        "y": 500,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-street-ch4-stone-blocks-02",
        "assetId": "ch4-stone-blocks",
        "x": 19,
        "y": 544,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-street-ch4-stone-blocks-03",
        "assetId": "ch4-stone-blocks",
        "x": 22,
        "y": 595,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "tavern-interior",
    "chapterId": "artifacts",
    "instances": [
      {
        "instanceId": "tavern-interior-bartender-smartphone-01",
        "assetId": "bartender-smartphone",
        "x": 184,
        "y": 118,
        "scale": 0.87,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-old-man-stool-smartphone-01",
        "assetId": "old-man-stool-smartphone",
        "x": 415,
        "y": 168,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  }
];
