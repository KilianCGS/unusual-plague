// KEY BINDINGS: which key does what. Pure data and rules, no React and no DOM, so the
// rules can be tested on their own. The keys are KeyboardEvent.key values normalised by
// `normalizeKey` (letters in lower case, the space bar as "Space"), i.e. what the player
// SEES on the keycap, so an AZERTY player who picks ZQSD gets the letters printed on
// his keys.
export type ControlAction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "interact"
  | "run"
  | "book"
  | "map"
  | "objectives";

export const CONTROL_ACTIONS: readonly ControlAction[] = [
  "up",
  "down",
  "left",
  "right",
  "interact",
  "run",
  "book",
  "map",
  "objectives",
];

// Movement has a main key and an alternative; every other action has one key.
export const MOVE_ACTIONS: readonly ControlAction[] = ["up", "down", "left", "right"];
export const SLOTS_PER_ACTION: Record<ControlAction, number> = {
  up: 2,
  down: 2,
  left: 2,
  right: 2,
  interact: 1,
  run: 1,
  book: 1,
  map: 1,
  objectives: 1,
};

export type Bindings = Record<ControlAction, string[]>;

// Keys that can never be assigned: they close or confirm things in every interface.
export const RESERVED_KEYS: readonly string[] = ["Escape", "Enter"];

export type PresetId = "wasd" | "zqsd" | "ijkl";

export const PRESETS: Record<PresetId, Bindings> = {
  // The default. The arrow keys stay as the alternative for movement.
  wasd: {
    up: ["w", "ArrowUp"],
    down: ["s", "ArrowDown"],
    left: ["a", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    interact: ["e"],
    run: ["Space"],
    book: ["q"],
    map: ["Tab"],
    objectives: ["r"],
  },
  // For AZERTY keyboards: ZQSD, the book moves to A (Q is "left" here).
  zqsd: {
    up: ["z", "ArrowUp"],
    down: ["s", "ArrowDown"],
    left: ["q", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    interact: ["e"],
    run: ["Space"],
    book: ["a"],
    map: ["Tab"],
    objectives: ["r"],
  },
  // Everything under the right hand.
  ijkl: {
    up: ["i", "ArrowUp"],
    down: ["k", "ArrowDown"],
    left: ["j", "ArrowLeft"],
    right: ["l", "ArrowRight"],
    interact: ["o"],
    run: ["Space"],
    book: ["u"],
    map: ["Tab"],
    objectives: ["p"],
  },
};

export const DEFAULT_PRESET: PresetId = "wasd";

export function cloneBindings(bindings: Bindings): Bindings {
  const copy = {} as Bindings;
  for (const action of CONTROL_ACTIONS) copy[action] = [...bindings[action]];
  return copy;
}

export function defaultBindings(): Bindings {
  return cloneBindings(PRESETS[DEFAULT_PRESET]);
}

// What a key press is called in the bindings.
export function normalizeKey(key: string): string {
  if (key === " " || key === "Spacebar") return "Space";
  return key.length === 1 ? key.toLowerCase() : key;
}

export function isAssignable(key: string): boolean {
  const normalized = normalizeKey(key);
  return (
    normalized.length > 0 &&
    !RESERVED_KEYS.includes(normalized) &&
    normalized !== "Dead" &&
    normalized !== "Unidentified" &&
    normalized !== "Process"
  );
}

export function matchesAction(
  bindings: Bindings,
  action: ControlAction,
  key: string,
): boolean {
  return bindings[action].includes(normalizeKey(key));
}

// The action a key belongs to, if any (movement actions first, as the keys are unique).
export function actionForKey(bindings: Bindings, key: string): ControlAction | null {
  const normalized = normalizeKey(key);
  return CONTROL_ACTIONS.find((action) => bindings[action].includes(normalized)) ?? null;
}

// Gives `key` to a slot of an action. A key belongs to ONE slot only: if it was somewhere
// else, the two slots swap keys (nothing is ever left empty). Returns the same object
// when the key cannot be assigned.
export function assignKey(
  bindings: Bindings,
  action: ControlAction,
  slot: number,
  key: string,
): Bindings {
  const normalized = normalizeKey(key);
  if (!isAssignable(normalized) || slot < 0 || slot >= SLOTS_PER_ACTION[action]) return bindings;

  const next = cloneBindings(bindings);
  const previous = next[action][slot];
  if (previous === normalized) return bindings;

  for (const other of CONTROL_ACTIONS) {
    const index = next[other].indexOf(normalized);
    if (index !== -1) next[other][index] = previous;
  }
  next[action][slot] = normalized;
  return next;
}

// Validates something read from storage: anything wrong falls back to the default.
export function sanitizeBindings(value: unknown): Bindings {
  const fallback = defaultBindings();
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Record<string, unknown>;
  const result = {} as Bindings;
  const seen = new Set<string>();

  for (const action of CONTROL_ACTIONS) {
    const keys = candidate[action];
    if (!Array.isArray(keys) || keys.length !== SLOTS_PER_ACTION[action]) return fallback;
    for (const key of keys) {
      if (typeof key !== "string" || !isAssignable(key) || normalizeKey(key) !== key || seen.has(key)) {
        return fallback;
      }
      seen.add(key);
    }
    result[action] = [...(keys as string[])];
  }
  return result;
}

export function presetOf(bindings: Bindings): PresetId | null {
  for (const id of Object.keys(PRESETS) as PresetId[]) {
    if (CONTROL_ACTIONS.every((a) => PRESETS[id][a].join("|") === bindings[a].join("|"))) return id;
  }
  return null;
}

const KEY_LABELS: Record<string, { es: string; en: string }> = {
  Space: { es: "ESPACIO", en: "SPACE" },
  Tab: { es: "TAB", en: "TAB" },
  ArrowUp: { es: "↑", en: "↑" },
  ArrowDown: { es: "↓", en: "↓" },
  ArrowLeft: { es: "←", en: "←" },
  ArrowRight: { es: "→", en: "→" },
  Shift: { es: "MAYÚS", en: "SHIFT" },
  Control: { es: "CTRL", en: "CTRL" },
  Alt: { es: "ALT", en: "ALT" },
  Backspace: { es: "RETROCESO", en: "BACKSPACE" },
  CapsLock: { es: "BLOQ MAYÚS", en: "CAPS LOCK" },
};

// What is drawn on the keycap.
export function keyLabel(key: string, language: "es" | "en"): string {
  const named = KEY_LABELS[key];
  if (named) return named[language];
  return key.length === 1 ? key.toUpperCase() : key.toUpperCase();
}
