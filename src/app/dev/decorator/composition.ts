import { getDecorAsset } from "../../../game/decor/decorAssets";
import type { DecorComposition, DecorInstance } from "../../../game/decor/decorTypes";

// Neutral, easy-to-rename ids. Compositions are independent: none inherits
// from another.
export const CHAPTER_IDS = ["chapter-1", "chapter-2", "artifacts", "final"];

const STORAGE_PREFIX = "unusual-plague:decorator:v1";

export function compositionKey(sceneId: string, chapterId: string) {
  return `${sceneId}::${chapterId}`;
}

function storageKey(sceneId: string, chapterId: string) {
  return `${STORAGE_PREFIX}:${sceneId}:${chapterId}`;
}

// Every value is finite; unknown assets and malformed rows are dropped.
function sanitizeInstances(raw: unknown): DecorInstance[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item): DecorInstance[] => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.instanceId !== "string" ||
      typeof item.assetId !== "string" ||
      !getDecorAsset(item.assetId) ||
      !Number.isFinite(item.x) ||
      !Number.isFinite(item.y)
    ) {
      return [];
    }

    return [
      {
        instanceId: item.instanceId,
        assetId: item.assetId,
        x: item.x,
        y: item.y,
        scale: Number.isFinite(item.scale) && item.scale > 0 ? item.scale : 1,
        flipX: item.flipX === true,
        colliderEnabled: item.colliderEnabled !== false,
        zOffset: Number.isFinite(item.zOffset) ? item.zOffset : 0,
        interaction: item.interaction ?? undefined,
      },
    ];
  });
}

// localStorage is DEV-ONLY convenience, one entry per scene + chapter. Every
// access is guarded: it can be unavailable or hold garbage.
export function loadInstances(
  sceneId: string,
  chapterId: string,
): DecorInstance[] {
  try {
    const text = window.localStorage.getItem(storageKey(sceneId, chapterId));

    if (text !== null) {
      return sanitizeInstances(JSON.parse(text));
    }
  } catch {
    // Fall through to the default below.
  }

  // Nothing stored: the composition starts empty.
  return [];
}

export function saveInstances(
  sceneId: string,
  chapterId: string,
  instances: DecorInstance[],
) {
  try {
    window.localStorage.setItem(
      storageKey(sceneId, chapterId),
      JSON.stringify(instances),
    );
  } catch {
    // Storage full or blocked: the in-memory composition still works.
  }
}

export function clearStoredInstances(sceneId: string, chapterId: string) {
  try {
    window.localStorage.removeItem(storageKey(sceneId, chapterId));
  } catch {
    // Nothing to clear.
  }
}

// Independent copy: no object is shared with the source.
export function cloneInstances(instances: DecorInstance[]): DecorInstance[] {
  return JSON.parse(JSON.stringify(instances)) as DecorInstance[];
}

// `<scene>-<asset>-NN`, the first number not used in this composition.
export function nextInstanceId(
  sceneId: string,
  assetId: string,
  instances: DecorInstance[],
) {
  const base = `${sceneId}-${assetId}`;
  const used = new Set(instances.map((instance) => instance.instanceId));

  for (let number = 1; ; number += 1) {
    const candidate = `${base}-${String(number).padStart(2, "0")}`;

    if (!used.has(candidate)) {
      return candidate;
    }
  }
}

const round = (value: number, decimals = 0) => {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
};

function camelize(text: string) {
  return text
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, index) =>
      index === 0
        ? part.charAt(0).toLowerCase() + part.slice(1)
        : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
}

// Fixed key order, integers for positions and zones, two decimals at most for
// scale. Every DecorInstance field is kept.
function cleanComposition(composition: DecorComposition) {
  return {
    sceneId: composition.sceneId,
    chapterId: composition.chapterId,
    instances: composition.instances.map((instance) => ({
      instanceId: instance.instanceId,
      assetId: instance.assetId,
      x: round(instance.x),
      y: round(instance.y),
      scale: round(instance.scale, 2),
      flipX: instance.flipX,
      colliderEnabled: instance.colliderEnabled,
      zOffset: round(instance.zOffset),
      ...(instance.interaction
        ? {
            interaction: {
              interactionId: instance.interaction.interactionId,
              zone: {
                offsetX: round(instance.interaction.zone.offsetX),
                offsetY: round(instance.interaction.zone.offsetY),
                width: round(instance.interaction.zone.width),
                height: round(instance.interaction.zone.height),
              },
              ...(instance.interaction.requiredDirection
                ? { requiredDirection: instance.interaction.requiredDirection }
                : {}),
            },
          }
        : {}),
    })),
  };
}

// Deterministic TypeScript: fixed key order, instances in list order.
export function formatComposition(composition: DecorComposition) {
  const clean = cleanComposition(composition);
  const name = camelize(`${composition.sceneId}-${composition.chapterId}`);

  return (
    `// Decorator composition: scene "${composition.sceneId}", chapter "${composition.chapterId}".\n` +
    "// x / y are WORLD logical units of the instance anchor (bottom-center by\n" +
    "// default). interaction.zone is relative to that anchor. Shape:\n" +
    "// DecorComposition in src/game/decor/decorTypes.ts.\n" +
    `export const ${name}Composition = ${JSON.stringify(clean, null, 2)};\n`
  );
}

// Every scene with instances SAVED in this browser for the chapter, sorted by
// scene id. Reads only what the Decorator stored (never seeds or defaults), so
// the export is exactly what was authored.
export function loadStoredChapter(chapterId: string): DecorComposition[] {
  const prefix = `${STORAGE_PREFIX}:`;
  const suffix = `:${chapterId}`;
  const sceneIds: string[] = [];

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);

      if (key?.startsWith(prefix) && key.endsWith(suffix)) {
        sceneIds.push(key.slice(prefix.length, key.length - suffix.length));
      }
    }
  } catch {
    return [];
  }

  return sceneIds
    .sort()
    .map((sceneId) => {
      let instances: DecorInstance[] = [];

      try {
        instances = sanitizeInstances(
          JSON.parse(
            window.localStorage.getItem(storageKey(sceneId, chapterId)) ??
              "[]",
          ),
        );
      } catch {
        // Unreadable entry: treated as empty.
      }

      return { sceneId, chapterId, instances };
    })
    .filter((composition) => composition.instances.length > 0);
}

// The whole chapter as the file src/game/compositions/<chapterId>.ts.
export function formatChapter(
  chapterId: string,
  compositions: DecorComposition[],
) {
  const name = `${camelize(chapterId)}Compositions`;
  const clean = compositions.map(cleanComposition);

  return (
    `// Exported from /dev/decorator (COPY CHAPTER): chapter "${chapterId}".\n` +
    `// Save as src/game/compositions/${chapterId}.ts. x / y are WORLD logical\n` +
    "// units of the instance anchor; interaction.zone is relative to it.\n" +
    'import type { DecorComposition } from "../decor/decorTypes";\n\n' +
    `export const ${name}: DecorComposition[] = ${JSON.stringify(clean, null, 2)};\n`
  );
}
