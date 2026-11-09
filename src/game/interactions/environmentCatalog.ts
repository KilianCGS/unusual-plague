// Text ids offered in /dev/collisions. Geometry is painted by Kilian, not
// inferred from a background. The runtime never reads editor drafts.
export const ENVIRONMENT_INTERACTIONS = [
  { interactionId: "world.plaza.noticeboard", sceneId: "plaza", label: "Tablón de anuncios" },
  { interactionId: "world.plaza.well", sceneId: "plaza", label: "Pozo" },
  { interactionId: "world.plaza.statue", sceneId: "plaza", label: "Estatua" },
  { interactionId: "world.mill.tools", sceneId: "mill-farmland", label: "Herramientas del molino" },
  { interactionId: "world.granary.sacks", sceneId: "granary-interior", label: "Sacos de grano" },
  { interactionId: "world.tavern.hearth", sceneId: "tavern-interior", label: "Hogar de la taberna" },
  { interactionId: "world.smithy.anvil", sceneId: "smithy-interior", label: "Yunque" },
] as const;

// Painted zones that DO something (story outcomes), unlike the Doctor-only
// observations above. Offered in /dev/collisions the same way.
export const STORY_ZONE_INTERACTIONS = [
  { interactionId: "chapter2.bakery.flourSack", sceneId: "bakery-interior", label: "Saco de harina de la panadera (da harina)" },
] as const;
