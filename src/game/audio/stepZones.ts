// ORANGE zones of /dev/collisions ("steps" mode): the STONE path inside scenes whose floor is
// otherwise earth (the river bank before the forest, the mountain path). Inside one the Doctor's
// steps use the stone sound; everywhere else in the scene they sound as always. Exported per scene
// from the editor as `<scene>StepZones` and registered here.
export type StepZone = { id: string; points: { x: number; y: number }[] };

export const STEP_MIX_ZONES: Record<string, StepZone[]> = {
  // Drawn by Kilian in /dev/collisions (2026-11-15).
  outskirts: [
    { id: "outskirts-steps-1", points: [{ x: 775, y: 498 }, { x: 1309, y: 500 }, { x: 1311, y: 358 }, { x: 3, y: 358 }, { x: 3, y: 504 }] },
  ],
  "mountain-path": [
    { id: "mountain-path-steps-1", points: [{ x: 1097, y: 518 }, { x: 1097, y: 426 }, { x: 1327, y: 428 }, { x: 1331, y: 517 }] },
  ],
};

export function pointInStepZone(zone: StepZone, x: number, y: number): boolean {
  let inside = false;
  const pts = zone.points;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function isInStepMixZone(sceneId: string, x: number, y: number): boolean {
  return (STEP_MIX_ZONES[sceneId] ?? []).some((zone) => pointInStepZone(zone, x, y));
}
