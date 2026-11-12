import type { NarrativeIllustrationId } from "../narrative/illustrations";
import type { SceneId } from "./worldScenes";

// Where and how a chapter (a day) BEGINS. Data only, so another day can start
// the same way: through its own narrative interlude, then in the Doctor's Room.
// Only Chapter 1 is defined today.
export type ChapterStart = {
  // The first controllable scene and the arrival the Doctor stands on.
  sceneId: SceneId;
  spawnName: string;
  // An illustration + monologue shown from black before the first scene. The
  // monologue itself is the chapter intro (see resolveChapterIntro).
  opening?: { illustration: NarrativeIllustrationId };
};

const CHAPTER_STARTS: Record<string, ChapterStart> = {
  "chapter-1": {
    sceneId: "doctor-room",
    spawnName: "chapter-start",
    opening: { illustration: "doctor-writing" },
  },
  // Day 2 begins in the Doctor's Room on the SAME existing spawn, with no
  // opening: the closing of Day 1 already was the transition (see GameWorld).
  "chapter-2": {
    sceneId: "doctor-room",
    spawnName: "chapter-start",
  },
  // Day 3 and Day 4 (2026-11-12) also begin in the Doctor's Room, with no opening: the
  // closing of the day before is the transition.
  "chapter-3": {
    sceneId: "doctor-room",
    spawnName: "chapter-start",
  },
  "chapter-4": {
    sceneId: "doctor-room",
    spawnName: "chapter-start",
  },
};

// The chapter that follows each chapter once its closing is over. Only Day 1
// leads somewhere today; a chapter without an entry has no successor.
const NEXT_CHAPTER_IDS: Record<string, string> = {
  "chapter-1": "chapter-2",
  "chapter-2": "chapter-3",
  "chapter-3": "chapter-4",
};

export function getNextChapterId(chapterId: string): string | null {
  return NEXT_CHAPTER_IDS[chapterId] ?? null;
}

export function getChapterStart(chapterId: string): ChapterStart {
  const start = CHAPTER_STARTS[chapterId];

  if (!start) {
    throw new Error(`Chapter has no start: ${chapterId}`);
  }

  return start;
}
