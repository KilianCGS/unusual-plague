// Every sound file the game has, with a logical id. Files live in public/game/audio.
// Nothing here plays by itself: scenes and actions call `playSound(id)` (audioPlayer.ts)
// once they are connected. `loop` marks sounds meant to be repeated by the caller at a
// comfortable pace (blacksmith, wood chop); the others are one-shots.
export type SoundCategory = "steps" | "loops" | "crafting" | "ui";

export const SOUND_IDS = [
  "steps.interior",
  "steps.cityRock",
  "steps.woodPath",
  "loop.blacksmith",
  "loop.woodChop",
  "craft.cooking",
  "craft.chop",
  "craft.mortar",
  "craft.recipeCrafted",
  "ui.pageTurn",
  "ui.itemClickDrop",
  "ui.coins",
  "ui.itemObtained",
  "ui.chestOpen",
] as const;

export type SoundId = (typeof SOUND_IDS)[number];

export type SoundDef = {
  id: SoundId;
  src: string;
  category: SoundCategory;
  loop: boolean;
  // Per-sound level (0..1) applied before the player's volume setting.
  gain: number;
};

const BASE = "/game/audio";

function def(id: SoundId, path: string, category: SoundCategory, loop = false): SoundDef {
  return { id, src: `${BASE}/${path}`, category, loop, gain: 1 };
}

export const SOUNDS: Record<SoundId, SoundDef> = {
  "steps.interior": def("steps.interior", "steps/interior.mp3", "steps"),
  "steps.cityRock": def("steps.cityRock", "steps/city-rock.mp3", "steps"),
  "steps.woodPath": def("steps.woodPath", "steps/wood-path.mp3", "steps"),
  "loop.blacksmith": def("loop.blacksmith", "loops/blacksmith.mp3", "loops", true),
  "loop.woodChop": def("loop.woodChop", "loops/wood-chop.mp3", "loops", true),
  "craft.cooking": def("craft.cooking", "crafting/cooking-5s.mp3", "crafting"),
  "craft.chop": def("craft.chop", "crafting/chop.mp3", "crafting"),
  "craft.mortar": def("craft.mortar", "crafting/mortar.mp3", "crafting"),
  "craft.recipeCrafted": def("craft.recipeCrafted", "crafting/recipe-crafted.mp3", "crafting"),
  "ui.pageTurn": def("ui.pageTurn", "ui/page-turn.mp3", "ui"),
  "ui.itemClickDrop": def("ui.itemClickDrop", "ui/item-click-drop.mp3", "ui"),
  "ui.coins": def("ui.coins", "ui/coins.mp3", "ui"),
  "ui.itemObtained": def("ui.itemObtained", "ui/item-obtained.mp3", "ui"),
  "ui.chestOpen": def("ui.chestOpen", "ui/chest-open.mp3", "ui"),
};
