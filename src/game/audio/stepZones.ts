// ORANGE zones of /dev/collisions ("steps" mode): ground where two surfaces mix, e.g. the river
// bank before the forest and the mountain path, stone path and earth side by side. Inside one, the
// Doctor's steps alternate between the stone sound and the earth sound. Exported per scene from the
// editor as `<scene>StepZones` and registered here (empty until Kilian draws them).
export type StepZone = { id: string; points: { x: number; y: number }[] };

export const STEP_MIX_ZONES: Record<string, StepZone[]> = {};

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
