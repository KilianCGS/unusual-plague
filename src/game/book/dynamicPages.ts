import { RECIPES, expandKnownRecipeIds, type Recipe } from "../crafting/recipes";
import { ailmentNames, bookCopy } from "../i18n/book";
import type { Language } from "../i18n/types";
import { countItem, type InventoryState } from "../inventory/inventory";
import { getItemName } from "../items/items";
import { getPatientDefinitions } from "../patients/patientRegistry";
import {
  getPatientStatus,
  getVisiblePatientIds,
  type PatientCasesState,
} from "../patients/patientCases";
import { PLAIN_BASE_LAYER, type BookSpread } from "./bookPages";
import type { BookTextBlock } from "./bookText";
import { PREPARATION_DESCRIPTIONS, getPreparationUse } from "./preparations";
import { DIAGNOSIS_SYMPTOMS } from "../patients/diagnosis";
import { PATIENT_IDS_BY_CHAPTER } from "../patients/chapterPatients";
import { PREPARATION_CATEGORY, PREPARATION_CATEGORY_NAMES, preparationCategoryRank, type PreparationCategory } from "./preparationCategories";

// The PACIENTES and PREPARADOS pages are not fixed content: they are drawn from
// the patient cases, the inventory and the recipes the Doctor knows. Nothing
// here is stored; opening the book always recomputes it.

export type BookContext = {
  language: Language;
  patients: PatientCasesState;
  inventory: InventoryState;
  knownRecipeIds: ReadonlySet<string>;
  storyFlags?: ReadonlySet<string>;
  diagnosisPatientId?: string;
  // The day being played: PACIENTES shows only that day's cases (left out = every case the Doctor knows).
  chapterId?: string;
  // The chest of his room: INGREDIENTES counts what is in it too (left out = only what he carries).
  storage?: InventoryState;
};

// Text columns of the open book (art space 688x384): left page and right page.
const LEFT = { x: 74, width: 240 };
const RIGHT = { x: 375, width: 234 };
const NAME_Y = 50;
const SUBTITLE_Y = 112;
const DETAIL_Y = 142;
const LINES_Y = 80;
const LINE_STEP = 24;

const text = (
  id: string,
  role: BookTextBlock["role"],
  column: { x: number; width: number },
  y: number,
  content: string,
  align?: "left" | "center",
): BookTextBlock => ({
  id,
  role,
  x: column.x,
  y,
  width: column.width,
  align,
  content: [content],
});

function emptySpread(id: string, title: string, note: string): BookSpread {
  return {
    id,
    layers: [PLAIN_BASE_LAYER],
    texts: [
      text(`${id}-title`, "name", { x: 84, width: 220 }, 60, title, "center"),
      text(`${id}-note`, "note", { x: 84, width: 220 }, 96, note, "center"),
    ],
  };
}

// One spread per visible patient case.
export function buildPatientSpreads(context: BookContext): BookSpread[] {
  const { language, patients, inventory } = context;
  const copy = bookCopy[language];
  const definitions = getPatientDefinitions(context.storyFlags);
  // 2026-11-26 (Kilian): only the day's own patients, the treated ones last.
  const ofToday = context.chapterId ? new Set(PATIENT_IDS_BY_CHAPTER[context.chapterId] ?? []) : null;
  const visible = getVisiblePatientIds(patients).filter(
    (id) => definitions[id] && (!ofToday || ofToday.has(id)),
  );
  const ids = [
    ...visible.filter((id) => getPatientStatus(patients, id) !== "treated"),
    ...visible.filter((id) => getPatientStatus(patients, id) === "treated"),
  ];

  if (ids.length === 0) {
    return [
      emptySpread(
        "patients-empty",
        copy.noPatients.title,
        copy.noPatients.note,
      ),
    ];
  }

  return ids.map((id) => {
    const definition = definitions[id];
    const status = getPatientStatus(patients, id);
    const texts: BookTextBlock[] = [
      {
        ...text(`${id}-name`, "heading", LEFT, NAME_Y, definition.name[language]),
        ...(status === "treated" ? { tone: "good" as const } : {}),
      },
    ];

    if (status === "discovered") {
      texts.push(
        text(
          `${id}-info`,
          "body",
          LEFT,
          SUBTITLE_Y,
          definition.discovered[language],
        ),
      );
      if (context.diagnosisPatientId === id && DIAGNOSIS_SYMPTOMS[id]) {
        texts.push(
          text(`${id}-symptoms-title`, "heading", RIGHT, 46,
            language === "es" ? "Síntomas observados" : "Observed symptoms"),
          text(`${id}-symptoms`, "body", RIGHT, LINES_Y, DIAGNOSIS_SYMPTOMS[id][language]),
          text(`${id}-pending`, "note", RIGHT, 214,
            language === "es" ? "Diagnóstico pendiente. Contrastar con Dolencias." : "Diagnosis pending. Compare with Ailments."),
        );
      }
    } else {
      texts.push(
        text(
          `${id}-diagnosis`,
          "heading",
          LEFT,
          SUBTITLE_Y,
          ailmentNames[definition.ailmentId]?.[language] ??
            definition.ailmentId,
        ),
        text(
          `${id}-observation`,
          "body",
          LEFT,
          DETAIL_Y,
          definition.observation[language],
        ),
        text(`${id}-treatment`, "heading", RIGHT, 46,
          definition.investigation ? (language === "es" ? "Investigación" : "Investigation") : copy.treatment),
      );

      if (definition.investigation) {
        texts.push(text(`${id}-investigation`, "body", RIGHT, LINES_Y,
          definition.investigation[language]));
      }

      definition.requiredTreatments.forEach(({ itemId, quantity }, index) => {
        // The boxes are DERIVED from the inventory while the case is open; a
        // treated case shows them all ticked.
        const done =
          status === "treated" || countItem(inventory, itemId) >= quantity;

        // 2026-11-27 (Kilian): each preparation opens its recipe in PREPARADOS (when the recipe is known)
        const recipeSpread = preparationSpreadIdOf(itemId, context.knownRecipeIds, context.language);
        texts.push({
          ...text(
            `${id}-need-${index}`,
            "body",
            RIGHT,
            LINES_Y + index * LINE_STEP,
            `${done ? "☑" : "☐"} ${getItemName(itemId, language)}`,
          ),
          ...(recipeSpread ? { link: `preparations:${recipeSpread}` } : {}),
        });
      });

      if (status === "treated") {
        texts.push({
          ...text(
            `${id}-treated`,
            "heading",
            RIGHT,
            LINES_Y + definition.requiredTreatments.length * LINE_STEP + 18,
            copy.treated,
          ),
          tone: "good" as const,
        });
      }
    }

    return { id: `patient-${id}`, layers: [PLAIN_BASE_LAYER], texts };
  });
}

// 2026-11-17 (Kilian): the names of these two are long (HIERBA MACHACADA, CARBÓN TRITURADO) and wrap, so their
// description overlapped the title: everything under the title sits a bit lower on their pages (and only theirs).
const LONG_TITLE_DROP: Readonly<Record<string, number>> = { "crushed-herb": 16, "crushed-coal": 16 };

// How many lines a text takes in a column of a preparation's leaf (Patrick Hand: about 41 characters a line at 14 px,
// 48 at 12 px). An estimate on the safe side, only used to stack the texts.
function estimateLines(content: string, role: "preparationBody" | "preparationNote"): number {
  const perLine = role === "preparationBody" ? 40 : 47;
  return Math.max(1, Math.ceil(content.length / perLine));
}

// Where the texts of a leaf must end (the lower edge of the written area of the page).
const PAGE_TEXT_BOTTOM = 358;

// The known recipes in the order of their leaves: grouped by category (preparationCategories.ts, 2026-11-27) and, inside
// each, in alphabetical order of their names in the book's language (2026-11-26, Kilian), so the index and the leaves
// follow the same order.
function knownRecipesInOrder(knownRecipeIds: ReadonlySet<string>, language: Language) {
  const expanded = expandKnownRecipeIds(knownRecipeIds);
  const collator = new Intl.Collator(language, { sensitivity: "base" });
  return RECIPES.filter(recipe => expanded.has(recipe.id))
    .map((recipe) => ({ recipe, name: getItemName(recipe.output.itemId, language) }))
    .sort((a, b) => preparationCategoryRank(a.recipe.output.itemId) - preparationCategoryRank(b.recipe.output.itemId)
      || collator.compare(a.name, b.name))
    .map(({ recipe }) => recipe);
}

// The spread of PREPARADOS where a known preparation is written (the index comes first), or null if it is not known.
export function preparationSpreadIdOf(itemId: string, knownRecipeIds: ReadonlySet<string>, language: Language): string | null {
  const position = knownRecipesInOrder(knownRecipeIds, language).findIndex((recipe) => recipe.output.itemId === itemId);
  return position < 0 ? null : `preparations-${Math.floor(position / 2) + 1}`;
}

// One known preparation per physical leaf, two per opening.
export function buildPreparationSpreads(context: BookContext): BookSpread[] {
  const { language, knownRecipeIds } = context;
  const copy = bookCopy[language];
  const known = knownRecipesInOrder(knownRecipeIds, language);

  if (known.length === 0) {
    return [emptySpread("preparations-empty", copy.noRecipes.title, copy.noRecipes.note)];
  }

  const spreads: BookSpread[] = [buildPreparationIndex(known, context)];
  for (let start = 0; start < known.length; start += 2) {
    const texts: BookTextBlock[] = [];
    const layers: BookSpread["layers"] = [PLAIN_BASE_LAYER];
    known.slice(start, start + 2).forEach((recipe, side) => {
      const column = side === 0 ? LEFT : RIGHT;
      const drop = LONG_TITLE_DROP[recipe.output.itemId] ?? 0;
      const ingredients = recipe.inputs.map(({ itemId, quantity }) =>
        `${getItemName(itemId, language)}${quantity > 1 ? ` ?${quantity}` : ""}`
      ).join(" + ");
      const ingredientsReady = recipe.inputs.every(input =>
        countItem(context.inventory, input.itemId) >= input.quantity);
      const intermediates = recipe.inputs.filter(input =>
        RECIPES.some(candidate => candidate.output.itemId === input.itemId));

      layers.push({
        src: `/game/ui/book/preparations/${recipe.output.itemId}.png`,
        x: column.x + (column.width - 220) / 2,
        y: 26,
        width: 220,
        height: 110,
        smooth: true,
        fit: "contain",
        blend: "multiply",
        alt: getItemName(recipe.output.itemId, language),
      });
      if (side === 0) {
        texts.push({ ...text(`${recipe.id}-to-index`, "preparationNote", { x: LEFT.x - 14, width: 70 }, 17,
          language === "es" ? "← Índice" : "← Index"), link: PREPARATION_INDEX_ID });
      }
      const category = PREPARATION_CATEGORY[recipe.output.itemId];
      if (category) {
        texts.push(text(`${recipe.id}-category`, "preparationNote", column, 17,
          PREPARATION_CATEGORY_NAMES[category][language].toUpperCase(), "center"));
      }
      // 2026-11-27: the texts under the title FLOW (each one below the last, by its estimated number of lines) instead
      // of sitting at fixed heights, so a long description never runs over the next line (Carbón triturado did).
      const description = PREPARATION_DESCRIPTIONS[recipe.output.itemId]?.[language] ?? "";
      const use = getPreparationUse(recipe.output.itemId, language);
      const steps = intermediates.length
        ? `${language === "es" ? "Preparar antes" : "Prepare first"}: ${intermediates.map(input => getItemName(input.itemId, language)).join(", ")}.`
        : null;
      const parts: [string, "preparationBody" | "preparationNote", string, number][] = [
        ["description", "preparationBody", description, 6],
        ["use", "preparationBody", use, 8],
        ["inputs", "preparationNote", ingredients, steps ? 4 : 8],
        ...(steps ? [["steps", "preparationNote", steps, 4] as [string, "preparationNote", string, number]] : []),
        ["station", "preparationNote", `${copy.station}: ${copy.stations[recipe.station]}`, 2],
        ["availability", "preparationNote", ingredientsReady
          ? (language === "es" ? "Ingredientes disponibles en el maletín." : "Ingredients available in your bag.")
          : (language === "es" ? "Faltan ingredientes en el maletín." : "Some ingredients are missing from your bag."), 0],
      ];
      const height = (role: "preparationBody" | "preparationNote", content: string) =>
        estimateLines(content, role) * (role === "preparationBody" ? 16 : 14);
      const total = parts.reduce((sum, [, role, content, gap]) => sum + height(role, content) + gap, 0);
      // a long leaf starts a little higher (never more than 20 units) so it still ends on the page
      let y = 190 + drop - Math.min(20, Math.max(0, 190 + drop + total - PAGE_TEXT_BOTTOM));
      texts.push(
        text(`${recipe.id}-name`, "preparationTitle", column, 144,
          getItemName(recipe.output.itemId, language).toUpperCase(), "center"),
      );
      for (const [id, role, content, gap] of parts) {
        texts.push(text(`${recipe.id}-${id}`, role, column, y, content));
        y += height(role, content) + gap;
      }
    });
    spreads.push({ id: `preparations-${start / 2 + 1}`, layers, texts });
  }
  return spreads;
}

// THE INDEX OF PREPARADOS (2026-11-27, Kilian): the first spread of the section lists the four groups and, under each,
// the remedies the Doctor knows; a click on one turns to its page (two remedies per spread, after the index).
export const PREPARATION_INDEX_ID = "preparations-index";
const INDEX_LINE = 17;

// What the Doctor can do with a recipe right now, by its DIRECT ingredients (a step before counts only if it is made):
// "ready" everything is in the case, "chest" everything is there but some of it is in the chest, "missing" not enough.
export type RecipeAvailability = "ready" | "chest" | "missing";
export function recipeAvailability(
  recipe: { inputs: readonly { itemId: string; quantity: number }[] },
  inventory: InventoryState,
  storage?: InventoryState,
): RecipeAvailability {
  if (recipe.inputs.every(({ itemId, quantity }) => countItem(inventory, itemId) >= quantity)) return "ready";
  const total = (itemId: string) => countItem(inventory, itemId) + (storage ? countItem(storage, itemId) : 0);
  return recipe.inputs.every(({ itemId, quantity }) => total(itemId) >= quantity) ? "chest" : "missing";
}

// The station sits at the right end of each line of the index.
const INDEX_STATION_WIDTH = 74;

function buildPreparationIndex(known: readonly Recipe[], context: BookContext): BookSpread {
  const { language } = context;
  const copy = bookCopy[language];
  const texts: BookTextBlock[] = [
    text("index-title", "heading", LEFT, 22, language === "es" ? "ÍNDICE" : "INDEX", "center"),
  ];
  // left page: herbs, spices and naturals, the others; right page: the liquids, the longest group (2026-11-26: the
  // soup, the citrus drink and the infusions joined it, so the others moved to the left page)
  const pages: [PreparationCategory[], { x: number; width: number }, number][] = [
    [["herbs", "naturals", "others"], LEFT, 52],
    [["liquids"], RIGHT, 52],
  ];
  for (const [groups, column, top] of pages) {
    let y = top;
    for (const group of groups) {
      texts.push(text(`index-${group}`, "preparationTitle", column, y, PREPARATION_CATEGORY_NAMES[group][language].toUpperCase()));
      y += 22;
      const recipes = known.filter((recipe) => PREPARATION_CATEGORY[recipe.output.itemId] === group);
      if (recipes.length === 0) {
        texts.push(text(`index-${group}-none`, "preparationNote", column, y, language === "es" ? "Aún ninguno." : "None yet."));
        y += INDEX_LINE;
      }
      for (const recipe of recipes) {
        const itemId = recipe.output.itemId;
        const position = known.indexOf(recipe);
        // 2026-11-26 (Kilian): no marks and no red, not to give away too much: green when everything is there (in
        // the case or the chest), the plain ink otherwise. Every name still turns to its recipe.
        const available = recipeAvailability(recipe, context.inventory, context.storage) !== "missing";
        texts.push(
          {
            ...text(`index-${itemId}`, "preparationBody", { x: column.x, width: column.width - INDEX_STATION_WIDTH }, y,
              getItemName(itemId, language)),
            ...(available ? { tone: "good" as const } : {}),
            link: `preparations-${Math.floor(position / 2) + 1}`,
          },
          {
            ...text(`index-${itemId}-station`, "preparationNote",
              { x: column.x + column.width - INDEX_STATION_WIDTH, width: INDEX_STATION_WIDTH }, y + 2, copy.stations[recipe.station]),
            align: "right",
          },
        );
        y += INDEX_LINE;
      }
      // a little tighter since three groups share the left page (2026-11-26)
      y += 8;
    }
  }
  // What the green means is told in a small plate UNDER the book (BookOverlay), not on the page (2026-11-26).
  return { id: PREPARATION_INDEX_ID, layers: [PLAIN_BASE_LAYER], texts };
}
