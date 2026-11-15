// Every sound file the game has, with a logical id. Files live in public/game/audio.
// Nothing here plays by itself: scenes and actions call `playSound(id)` (audioPlayer.ts)
// once they are connected. `loop` marks sounds meant to be repeated by the caller at a
// comfortable pace (blacksmith, wood chop); the others are one-shots.
export type SoundCategory = "steps" | "loops" | "crafting" | "ui" | "music";

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
  "ui.introButton",
  "ui.bookTab",
  "ui.dialogueBubble",
  "music.intro",
  "music.day1",
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
// The steps are half as loud as the rest (Kilian, 2026-11-15).
const STEP_GAIN = 0.5;

function def(id: SoundId, path: string, category: SoundCategory, loop = false, gain = 1): SoundDef {
  return { id, src: `${BASE}/${path}`, category, loop, gain };
}

export const SOUNDS: Record<SoundId, SoundDef> = {
  "steps.interior": def("steps.interior", "steps/interior.mp3", "steps", false, STEP_GAIN),
  "steps.cityRock": def("steps.cityRock", "steps/city-rock.mp3", "steps", false, STEP_GAIN),
  "steps.woodPath": def("steps.woodPath", "steps/wood-path.mp3", "steps", false, STEP_GAIN),
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
  "ui.introButton": def("ui.introButton", "ui/intro-button-click.mp3", "ui"),
  "ui.bookTab": def("ui.bookTab", "ui/book-tab.mp3", "ui"),
  "ui.dialogueBubble": def("ui.dialogueBubble", "ui/dialogue-bubble.mp3", "ui"),
  "music.day1": def("music.day1", "music/day1-ambient.mp3", "music", true, 0.6),
  "music.intro": def("music.intro", "music/game-intro.mp3", "music", true),
  "ui.chestOpen": def("ui.chestOpen", "ui/chest-open.mp3", "ui"),
};
