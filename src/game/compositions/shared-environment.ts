import type { DecorComposition, DecorInstance } from "../decor/decorTypes";

// Vegetation and fire animations placed by Kilian in supplied chapter-1
// export. Shared across every chapter; preserve all authored instance values.
export const sharedEnvironmentCompositions: Pick<DecorComposition, "sceneId" | "instances">[] = [
  {
    "sceneId": "farm",
    "instances": [
      {
        "instanceId": "farm-fern-weed-01",
        "assetId": "fern-weed",
        "x": 238,
        "y": 956,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-02",
        "assetId": "fern-weed",
        "x": 298,
        "y": 802,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-03",
        "assetId": "fern-weed",
        "x": 434,
        "y": 811,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-04",
        "assetId": "fern-weed",
        "x": 96,
        "y": 736,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-05",
        "assetId": "fern-weed",
        "x": 213,
        "y": 338,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-06",
        "assetId": "fern-weed",
        "x": 229,
        "y": 197,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-07",
        "assetId": "fern-weed",
        "x": 386,
        "y": 495,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-08",
        "assetId": "fern-weed",
        "x": 1068,
        "y": 728,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-09",
        "assetId": "fern-weed",
        "x": 1149,
        "y": 673,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-grass-tuft-01",
        "assetId": "grass-tuft",
        "x": 930,
        "y": 946,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-grass-tuft-02",
        "assetId": "grass-tuft",
        "x": 1595,
        "y": 911,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-bush-tall-01",
        "assetId": "bush-tall",
        "x": 1203,
        "y": 939,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-bush-tall-02",
        "assetId": "bush-tall",
        "x": 920,
        "y": 1075,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-bush-tall-03",
        "assetId": "bush-tall",
        "x": 1685,
        "y": 1060,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-fern-weed-10",
        "assetId": "fern-weed",
        "x": 427,
        "y": 636,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "farm-grass-tuft-03",
        "assetId": "grass-tuft",
        "x": 745,
        "y": 675,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest",
    "instances": [
      {
        "instanceId": "forest-grass-tuft-01",
        "assetId": "grass-tuft",
        "x": 694,
        "y": 287,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-grass-tuft-02",
        "assetId": "grass-tuft",
        "x": 720,
        "y": 483,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-grass-tuft-03",
        "assetId": "grass-tuft",
        "x": 590,
        "y": 660,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-grass-tuft-04",
        "assetId": "grass-tuft",
        "x": 957,
        "y": 739,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-fern-weed-01",
        "assetId": "fern-weed",
        "x": 506,
        "y": 494,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mill-farmland",
    "instances": [
      {
        "instanceId": "mill-farmland-fern-weed-01",
        "assetId": "fern-weed",
        "x": 421,
        "y": 1145,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fern-weed-02",
        "assetId": "fern-weed",
        "x": 1247,
        "y": 1156,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fern-weed-03",
        "assetId": "fern-weed",
        "x": 988,
        "y": 523,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-grass-tuft-01",
        "assetId": "grass-tuft",
        "x": 1436,
        "y": 310,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-grass-tuft-02",
        "assetId": "grass-tuft",
        "x": 1629,
        "y": 335,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-grass-tuft-03",
        "assetId": "grass-tuft",
        "x": 1941,
        "y": 495,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fern-weed-04",
        "assetId": "fern-weed",
        "x": 2027,
        "y": 503,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fern-weed-05",
        "assetId": "fern-weed",
        "x": 1844,
        "y": 1036,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fern-weed-06",
        "assetId": "fern-weed",
        "x": 641,
        "y": 434,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-grass-tuft-04",
        "assetId": "grass-tuft",
        "x": 773,
        "y": 468,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-grass-tuft-05",
        "assetId": "grass-tuft",
        "x": 1453,
        "y": 396,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fern-weed-07",
        "assetId": "fern-weed",
        "x": 1553,
        "y": 396,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-bush-tall-01",
        "assetId": "bush-tall",
        "x": 649,
        "y": 495,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-bush-tall-02",
        "assetId": "bush-tall",
        "x": 1964,
        "y": 447,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mountain-path",
    "instances": [
      {
        "instanceId": "mountain-path-grass-tuft-01",
        "assetId": "grass-tuft",
        "x": 587,
        "y": 466,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-grass-tuft-02",
        "assetId": "grass-tuft",
        "x": 448,
        "y": 232,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-grass-tuft-03",
        "assetId": "grass-tuft",
        "x": 970,
        "y": 236,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-grass-tuft-04",
        "assetId": "grass-tuft",
        "x": 975,
        "y": 364,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-grass-tuft-05",
        "assetId": "grass-tuft",
        "x": 1095,
        "y": 536,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-bush-round-01",
        "assetId": "bush-round",
        "x": 1066,
        "y": 599,
        "scale": 0.6,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-bush-round-02",
        "assetId": "bush-round",
        "x": 1139,
        "y": 218,
        "scale": 0.6,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-bush-tall-01",
        "assetId": "bush-tall",
        "x": 686,
        "y": 113,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-fern-weed-01",
        "assetId": "fern-weed",
        "x": 603,
        "y": 354,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-fern-weed-02",
        "assetId": "fern-weed",
        "x": 289,
        "y": 515,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-fern-weed-03",
        "assetId": "fern-weed",
        "x": 709,
        "y": 496,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-fern-weed-04",
        "assetId": "fern-weed",
        "x": 927,
        "y": 425,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mountain-path-campfire-01",
        "assetId": "campfire",
        "x": 650,
        "y": 568,
        "scale": 1.21,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "outskirts",
    "instances": [
      {
        "instanceId": "outskirts-bush-round-01",
        "assetId": "bush-round",
        "x": 946,
        "y": 566,
        "scale": 0.6,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-bush-round-02",
        "assetId": "bush-round",
        "x": 454,
        "y": 757,
        "scale": 0.6,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-bush-tall-01",
        "assetId": "bush-tall",
        "x": 945,
        "y": 300,
        "scale": 0.75,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-grass-tuft-01",
        "assetId": "grass-tuft",
        "x": 257,
        "y": 561,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-grass-tuft-02",
        "assetId": "grass-tuft",
        "x": 458,
        "y": 615,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-grass-tuft-03",
        "assetId": "grass-tuft",
        "x": 457,
        "y": 93,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-grass-tuft-04",
        "assetId": "grass-tuft",
        "x": 791,
        "y": 85,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-grass-tuft-05",
        "assetId": "grass-tuft",
        "x": 779,
        "y": 561,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "apothecary-main-zone",
    "instances": [
      {
        "instanceId": "apothecary-main-zone-candle-flame-01",
        "assetId": "candle-flame",
        "x": 38,
        "y": 164,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-02",
        "assetId": "candle-flame",
        "x": 95,
        "y": 81,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-03",
        "assetId": "candle-flame",
        "x": 144,
        "y": 42,
        "scale": 0.88,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-04",
        "assetId": "candle-flame",
        "x": 155,
        "y": 42,
        "scale": 0.88,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-05",
        "assetId": "candle-flame",
        "x": 363,
        "y": 103,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-06",
        "assetId": "candle-flame",
        "x": 361,
        "y": 103,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-07",
        "assetId": "candle-flame",
        "x": 367,
        "y": 104,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-08",
        "assetId": "candle-flame",
        "x": 372,
        "y": 36,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "apothecary-main-zone-candle-flame-09",
        "assetId": "candle-flame",
        "x": 149,
        "y": 38,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "bakers-bedroom",
    "instances": [
      {
        "instanceId": "bakers-bedroom-candle-flame-01",
        "assetId": "candle-flame",
        "x": 213,
        "y": 73,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakers-bedroom-candle-flame-02",
        "assetId": "candle-flame",
        "x": 456,
        "y": 211,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "bakery-interior",
    "instances": [
      {
        "instanceId": "bakery-interior-candle-flame-01",
        "assetId": "candle-flame",
        "x": 236,
        "y": 318,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakery-interior-candle-flame-02",
        "assetId": "candle-flame",
        "x": 339,
        "y": 318,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakery-interior-candle-flame-03",
        "assetId": "candle-flame",
        "x": 248,
        "y": 72,
        "scale": 1.07,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakery-interior-candle-flame-04",
        "assetId": "candle-flame",
        "x": 331,
        "y": 97,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakery-interior-candle-flame-05",
        "assetId": "candle-flame",
        "x": 513,
        "y": 86,
        "scale": 1.04,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "bakery-interior-candle-flame-06",
        "assetId": "candle-flame",
        "x": 51,
        "y": 168,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "doctor-room",
    "instances": [
      {
        "instanceId": "doctor-room-candle-flame-02",
        "assetId": "candle-flame",
        "x": 342,
        "y": 98,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest-cottage",
    "instances": [
      {
        "instanceId": "forest-cottage-candle-flame-01",
        "assetId": "candle-flame",
        "x": 412,
        "y": 454,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest-cottage-interior",
    "instances": [
      {
        "instanceId": "forest-cottage-interior-candle-flame-01",
        "assetId": "candle-flame",
        "x": 442,
        "y": 252,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-candle-flame-02",
        "assetId": "candle-flame",
        "x": 381,
        "y": 141,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-candle-flame-03",
        "assetId": "candle-flame",
        "x": 392,
        "y": 139,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-cottage-interior-candle-flame-04",
        "assetId": "candle-flame",
        "x": 371,
        "y": 139,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mine-interior",
    "instances": [
      {
        "instanceId": "mine-interior-candle-flame-01",
        "assetId": "candle-flame",
        "x": 166,
        "y": 71,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "smithy-interior",
    "instances": [
      {
        "instanceId": "smithy-interior-candle-flame-01",
        "assetId": "candle-flame",
        "x": 139,
        "y": 115,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-interior-candle-flame-02",
        "assetId": "candle-flame",
        "x": 143,
        "y": 116,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-interior-candle-flame-03",
        "assetId": "candle-flame",
        "x": 154,
        "y": 118,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-interior-candle-flame-04",
        "assetId": "candle-flame",
        "x": 125,
        "y": 118,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-interior-candle-flame-05",
        "assetId": "candle-flame",
        "x": 256,
        "y": 72,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-interior-candle-flame-06",
        "assetId": "candle-flame",
        "x": 542,
        "y": 241,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "smithy-interior-candle-flame-07",
        "assetId": "candle-flame",
        "x": 136,
        "y": 112,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "tavern-interior",
    "instances": [
      {
        "instanceId": "tavern-interior-campfire-01",
        "assetId": "campfire",
        "x": 364,
        "y": 140,
        "scale": 1.17,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-01",
        "assetId": "candle-flame",
        "x": 139,
        "y": 62,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-02",
        "assetId": "candle-flame",
        "x": 38,
        "y": 220,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-03",
        "assetId": "candle-flame",
        "x": 111,
        "y": 111,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-04",
        "assetId": "candle-flame",
        "x": 169,
        "y": 229,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-05",
        "assetId": "candle-flame",
        "x": 473,
        "y": 173,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-06",
        "assetId": "candle-flame",
        "x": 405,
        "y": 250,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-07",
        "assetId": "candle-flame",
        "x": 523,
        "y": 99,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-interior-candle-flame-08",
        "assetId": "candle-flame",
        "x": 535,
        "y": 269,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  }
];

export function getSharedEnvironmentInstances(sceneId: string): DecorInstance[] {
  // The authored botica visual and its hard-wired runtime use different ids,
  // but share the same 480x293 logical space and background.
  const authoredId = sceneId === "apothecary-interior" ? "apothecary-main-zone" : sceneId;
  return sharedEnvironmentCompositions.find(c => c.sceneId === authoredId)?.instances ?? [];
}

// Shared ids are authoritative if a later chapter export also contains them.
// Never mutate the chapter export, and never inherit NPCs or collectibles.
export function mergeSharedEnvironmentInstances(sceneId: string, instances: DecorInstance[]): DecorInstance[] {
  const shared = getSharedEnvironmentInstances(sceneId);
  if (!shared.length) return instances;
  const ids = new Set(shared.map(i => i.instanceId));
  return [...instances.filter(i => !ids.has(i.instanceId)), ...shared];
}
