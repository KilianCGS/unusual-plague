import { RECIPES, expandKnownRecipeIds } from "../crafting/recipes";
import { ailmentNames, bookCopy } from "../i18n/book";
import type { Language } from "../i18n/types";
import { countItem, type InventoryState } from "../inventory/inventory";
import { getItemName } from "../items/items";
import { PATIENT_CASES } from "../patients/patientRegistry";
import {
  getPatientStatus,
  getVisiblePatientIds,
  type PatientCasesState,
} from "../patients/patientCases";
import { PLAIN_BASE_LAYER, type BookSpread } from "./bookPages";
import type { BookTextBlock } from "./bookText";

// The PACIENTES and PREPARADOS pages are not fixed content: they are drawn from
// the patient cases, the inventory and the recipes the Doctor knows. Nothing
// here is stored; opening the book always recomputes it.

export type BookContext = {
  language: Language;
  patients: PatientCasesState;
  inventory: InventoryState;
  knownRecipeIds: ReadonlySet<string>;
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
  const ids = getVisiblePatientIds(patients).filter(
    (id) => PATIENT_CASES[id],
  );

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
    const definition = PATIENT_CASES[id];
    const status = getPatientStatus(patients, id);
    const texts: BookTextBlock[] = [
      text(`${id}-name`, "heading", LEFT, NAME_Y, definition.name[language]),
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
          definition.investigation ? (language === "es" ? "INVESTIGACIÓN" : "INVESTIGATION") : copy.treatment),
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

        texts.push(
          text(
            `${id}-need-${index}`,
            "body",
            RIGHT,
            LINES_Y + index * LINE_STEP,
            `${done ? "☑" : "☐"} ${getItemName(itemId, language)}`,
          ),
        );
      });

      if (status === "treated") {
        texts.push(
          text(
            `${id}-treated`,
            "heading",
            RIGHT,
            LINES_Y + definition.requiredTreatments.length * LINE_STEP + 18,
            copy.treated,
          ),
        );
      }
    }

    return { id: `patient-${id}`, layers: [PLAIN_BASE_LAYER], texts };
  });
}

// The recipes the Doctor knows, two per spread (left and right page).
export function buildPreparationSpreads(context: BookContext): BookSpread[] {
  const { language, knownRecipeIds } = context;
  const copy = bookCopy[language];
  const expanded = expandKnownRecipeIds(knownRecipeIds);
  const known = RECIPES.filter((recipe) => expanded.has(recipe.id));

  if (known.length === 0) {
    return [
      emptySpread(
        "preparations-empty",
        copy.noRecipes.title,
        copy.noRecipes.note,
      ),
    ];
  }

  const spreads: BookSpread[] = [];

  for (let start = 0; start < known.length; start += 2) {
    const texts: BookTextBlock[] = [];

    known.slice(start, start + 2).forEach((recipe, side) => {
      const column = side === 0 ? LEFT : RIGHT;
      const ingredients = recipe.inputs
        .map(
          ({ itemId, quantity }) =>
            `${getItemName(itemId, language)}${quantity > 1 ? ` ×${quantity}` : ""}`,
        )
        .join(" + ");

      texts.push(
        text(
          `${recipe.id}-name`,
          "heading",
          column,
          NAME_Y,
          getItemName(recipe.output.itemId, language).toUpperCase(),
        ),
        text(`${recipe.id}-inputs`, "body", column, SUBTITLE_Y, ingredients),
        text(
          `${recipe.id}-station`,
          "body",
          column,
          190,
          `${copy.station}: ${copy.stations[recipe.station]}`,
        ),
      );
      const ingredientsReady = recipe.inputs.every(input =>
        countItem(context.inventory, input.itemId) >= input.quantity);
      texts.push(text(`${recipe.id}-availability`, "note", column, 296,
        ingredientsReady
          ? (language === "es" ? "Ingredientes disponibles en la bolsa." : "Ingredients available in your bag.")
          : (language === "es" ? "Faltan ingredientes en la bolsa." : "Some ingredients are missing from your bag.")));
      const intermediates = recipe.inputs.filter(input =>
        RECIPES.some(candidate => candidate.output.itemId === input.itemId));
      if (intermediates.length) {
        texts.push(text(`${recipe.id}-steps`, "body", column, 232,
          `${language === "es" ? "Preparar antes" : "Prepare first"}: ${intermediates.map(input => getItemName(input.itemId, language)).join(", ")}.`));
      }
    });

    spreads.push({
      id: `preparations-${start / 2 + 1}`,
      layers: [PLAIN_BASE_LAYER],
      texts,
    });
  }

  return spreads;
}
