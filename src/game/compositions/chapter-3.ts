// Exported from /dev/decorator (COPY CHAPTER): chapter "chapter-3".
// Save as src/game/compositions/chapter-3.ts. x / y are WORLD logical
// units of the instance anchor; interaction.zone is relative to it.
//
// DAY 3 (2026-11-12): it INHERITS the population of Day 2 (see compositions/index.ts):
// what Kilian places here is ADDED on top of it, so he only has to place what is new in
// Day 3 (the sweeper, the path miner, the quarry stonecutter, the glade...).
// 2026-11-17: Kilian's second export (bakery, farm, glade with the Witch's cat, mountain path
// with the spear knight who blocks the mine, quarry, smithy and tavern added to the plaza and
// tavern street ones). The market street is NOT in it on purpose: its stalls are the same every
// day and come from Day 1 (see compositions/index.ts).
import type { DecorComposition } from "../decor/decorTypes";

export const chapter3Compositions: DecorComposition[] = [
  {
    "sceneId": "bakery-interior",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "bakery-interior-baker-01",
        "assetId": "baker",
        "x": 243,
        "y": 165,
        "scale": 0.82,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "bakery-street",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "bakery-street-villager-woman-01-v2-01",
        "assetId": "villager-woman-01-v2",
        "x": 197,
        "y": 769,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakery-street-woman-dusting-01",
        "assetId": "woman-dusting",
        "x": 698,
        "y": 668,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "farm",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "farm-horse-01",
        "assetId": "horse",
        "x": 93,
        "y": 478,
        "scale": 1.47,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "farm-chicken-01",
        "assetId": "chicken",
        "x": 828,
        "y": 386,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "farm-cow-01",
        "assetId": "cow",
        "x": 802,
        "y": 588,
        "scale": 1.57,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "farm-sheep-01",
        "assetId": "sheep",
        "x": 339,
        "y": 520,
        "scale": 1.08,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "farm-sheep-02",
        "assetId": "sheep",
        "x": 179,
        "y": 362,
        "scale": 1.09,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "farm-chicken-02",
        "assetId": "chicken",
        "x": 1083,
        "y": 374,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "farm-villager-woman-01-01",
        "assetId": "villager-woman-01",
        "x": 206,
        "y": 615,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest-glade",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "forest-glade-witch-sitting-back-01",
        "assetId": "witch-sitting-back",
        "x": 987,
        "y": 683,
        "scale": 0.87,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-glade-witch-cat-sitting-back-01",
        "assetId": "witch-cat-sitting-back",
        "x": 1034,
        "y": 671,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-glade-witch-crow-head-tilt-01",
        "assetId": "witch-crow-head-tilt",
        "x": 827,
        "y": 487,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-glade-witch-crow-cawing-01",
        "assetId": "witch-crow-cawing",
        "x": 795,
        "y": 518,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-glade-witch-crow-pecking-01",
        "assetId": "witch-crow-pecking",
        "x": 864,
        "y": 517,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mill-farmland",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "mill-farmland-villager-woman-02-01",
        "assetId": "villager-woman-02",
        "x": 1214,
        "y": 516,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-stonecutter-shovel-01",
        "assetId": "stonecutter-shovel",
        "x": 1948,
        "y": 1004,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mountain-path",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "mountain-path-knight-spear-shield-01",
        "assetId": "knight-spear-shield",
        "x": 201,
        "y": 365,
        "scale": 0.84,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": -42
      },
      {
        "instanceId": "mountain-path-squirrel-01",
        "assetId": "squirrel",
        "x": 466,
        "y": 644,
        "scale": 0.87,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-squirrel-02",
        "assetId": "squirrel",
        "x": 1011,
        "y": 125,
        "scale": 0.88,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-child-bow-archer-01",
        "assetId": "child-bow-archer",
        "x": 520,
        "y": 487,
        "scale": 0.8,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-child-wooden-sword-01",
        "assetId": "child-wooden-sword",
        "x": 606,
        "y": 571,
        "scale": 0.9,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "outskirts",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "outskirts-woman-washing-clothes-01",
        "assetId": "woman-washing-clothes",
        "x": 442,
        "y": 667,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "plaza",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "plaza-priest-praying-01",
        "assetId": "priest-praying",
        "x": 781,
        "y": 650,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-elderly-man-seated-01",
        "assetId": "elderly-man-seated",
        "x": 466,
        "y": 250,
        "scale": 0.79,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-elderly-woman-seated-01",
        "assetId": "elderly-woman-seated",
        "x": 511,
        "y": 248,
        "scale": 0.78,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-praying-man-side-01",
        "assetId": "praying-man-side",
        "x": 830,
        "y": 691,
        "scale": 0.81,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-praying-young-woman-01",
        "assetId": "praying-young-woman",
        "x": 721,
        "y": 693,
        "scale": 0.85,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-praying-old-woman-back-01",
        "assetId": "praying-old-woman-back",
        "x": 777,
        "y": 723,
        "scale": 0.8,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "quarry",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "quarry-stonecutter-resting-01",
        "assetId": "stonecutter-resting",
        "x": 1032,
        "y": 508,
        "scale": 0.82,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "quarry-villager-man-02-v2-01",
        "assetId": "villager-man-02-v2",
        "x": 281,
        "y": 435,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "quarry-stonecutter-stool-01",
        "assetId": "stonecutter-stool",
        "x": 689,
        "y": 506,
        "scale": 0.88,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "quarry-villager-woman-02-v2-01",
        "assetId": "villager-woman-02-v2",
        "x": 1076,
        "y": 491,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "smithy-interior",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "smithy-interior-blacksmith-hammer-01",
        "assetId": "blacksmith-hammer",
        "x": 414,
        "y": 162,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "smithy-street",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "smithy-street-girl-jump-rope-01",
        "assetId": "girl-jump-rope",
        "x": 290,
        "y": 358,
        "scale": 0.78,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-street-carpenter-workbench-01",
        "assetId": "carpenter-workbench",
        "x": 828,
        "y": 492,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "tavern-interior",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "tavern-interior-villager-man-01-v2-01",
        "assetId": "villager-man-01-v2",
        "x": 341,
        "y": 254,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-bartender-01",
        "assetId": "bartender",
        "x": 187,
        "y": 118,
        "scale": 0.84,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "tavern-street",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "tavern-street-villager-woman-02-01",
        "assetId": "villager-woman-02",
        "x": 409,
        "y": 440,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-street-boy-spinning-top-01",
        "assetId": "boy-spinning-top",
        "x": 451,
        "y": 439,
        "scale": 0.78,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  }
];
