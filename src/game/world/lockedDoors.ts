import type { Language } from "../i18n/types";

// Doors the Doctor cannot walk through yet: touching their transition shows a
// short notice instead of changing scene. A door opens in the chapters listed
// in `openInChapters` (none yet).
export type LockedDoor = {
  fromScene: string;
  targetScene: string;
  openInChapters: readonly string[];
  notice: Record<Language, string>;
};

export const LOCKED_DOORS: readonly LockedDoor[] = [
  {
    // The mine entrance on Day 3 (2026-11-17, Kilian): rockfalls. A spear knight stands in front of it
    // (his words: chapter3.mountainPath.guard) and the way in stays shut for that day only.
    fromScene: "mountain-path",
    targetScene: "mine-interior",
    openInChapters: ["chapter-1", "chapter-2", "chapter-4"],
    notice: {
      es: "Un desprendimiento ha cortado el paso a la mina.",
      en: "A rockfall has cut off the way into the mine.",
    },
  },
  {
    // The Witch's house. Kilian's plan: on the last day the Doctor visits her
    // after seeing how strange things have become in the village. Until then
    // the door stays shut.
    fromScene: "forest-cottage",
    targetScene: "forest-cottage-interior",
    // Opens on Day 4 (2026-11-12): the Doctor meets her inside, at night.
    openInChapters: ["chapter-4"],
    notice: {
      es: "No debería colarme aquí sin permiso.",
      en: "I shouldn't sneak in here without permission.",
    },
  },
];

export function getLockedDoorNotice(
  fromScene: string,
  targetScene: string,
  chapterId: string,
  language: Language,
): string | null {
  const door = LOCKED_DOORS.find(
    (candidate) =>
      candidate.fromScene === fromScene &&
      candidate.targetScene === targetScene,
  );

  if (!door || door.openInChapters.includes(chapterId)) {
    return null;
  }

  return door.notice[language];
}
