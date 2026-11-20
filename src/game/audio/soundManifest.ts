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
  "ui.mapOpen",
  "ui.dialogueBubble",
  "music.intro",
  "music.day1",
  "music.day2",
  "music.day3",
  "music.day4",
  "music.end",
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
const STEP_GAIN = 0.375; // (0.5 at first, 25% lower again on 2026-11-15)

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
  // 2026-11-17 (Kilian): picking things up was too loud: -50%.
  "ui.itemObtained": def("ui.itemObtained", "ui/item-obtained.mp3", "ui", false, 0.5),
  "ui.introButton": def("ui.introButton", "ui/intro-button-click.mp3", "ui"),
  "ui.bookTab": def("ui.bookTab", "ui/book-tab.mp3", "ui"),
  "ui.mapOpen": def("ui.mapOpen", "ui/map-open.mp3", "ui"),
  "ui.dialogueBubble": def("ui.dialogueBubble", "ui/dialogue-bubble.mp3", "ui", false, 0.75),
  "music.day1": def("music.day1", "music/day1-ambient.mp3", "music", true, 0.6),
  // 2026-11-18: Kilian is generating the ambient music of Days 2, 3 and 4: drop the files with these names in
  // public/game/audio/music/ (until they exist the day is simply silent: a missing file only fails to play).
  "music.day2": def("music.day2", "music/day2-ambient.mp3", "music", true, 0.6),
  "music.day3": def("music.day3", "music/day3-ambient.mp3", "music", true, 0.6),
  "music.day4": def("music.day4", "music/day4-ambient.mp3", "music", true, 0.6),
  // 2026-11-20 (Kilian): the music of the END of the game: from the moment the Doctor starts writing (after the closing
  // transition) until the player leaves the end card.
  "music.end": def("music.end", "music/endgame.mp3", "music", true, 0.6),
  "music.intro": def("music.intro", "music/game-intro.mp3", "music", true),
  "ui.chestOpen": def("ui.chestOpen", "ui/chest-open.mp3", "ui"),
};
