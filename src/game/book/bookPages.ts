// Content of the Medical Compendium as DATA. The component only renders this.
//
// Coordinates are in BOOK-IMAGE pixels (the open book art is 688x384).
// A spread is drawn as stacked image layers plus optional text blocks. A
// finished spread painted by hand is just ONE full-size layer (that is how the
// Ingredientes spreads work). The image is the visual source of truth: text
// blocks only exist where a section writes its pages in code (Dolencias, the
// placeholders), and never duplicate text that an image already contains.

import { bookCopy } from "../i18n/book";
import type { Language } from "../i18n/types";
import { AILMENTS, type Ailment } from "./ailments";
import {
  buildPatientSpreads,
  buildPreparationSpreads,
  type BookContext,
} from "./dynamicPages";
import type { BookTextBlock } from "./bookText";

export const BOOK_WIDTH = 688;
export const BOOK_HEIGHT = 384;

const UI_DIR = "/game/ui/book";

export type BookLayer = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  // Short description for assistive technology (decorative layers have none).
  alt?: string;
  // A high-resolution picture shown smaller than it is (the Ingredientes
  // spreads): scaled smoothly instead of the pixel-art nearest-neighbour.
  smooth?: boolean;
};

export type BookSpread = {
  id: string;
  layers: BookLayer[];
  texts?: BookTextBlock[];
};

export type BookSectionId =
  "patients" | "ailments" | "ingredients" | "preparations";

export type BookSection = {
  id: BookSectionId;
  label: string;
  spreads: BookSpread[];
};

// The physical open book, shared by PACIENTES, DOLENCIAS and PREPARADOS (the
// same one in every language: the React text on top is what changes): empty
// paper pages, nothing printed inside. It is the empty counterpart of the
// painted INGREDIENTES spreads, which bring their own paper and take no base.
// A high-resolution picture shown smaller than it is, so it is scaled smoothly.
export const BOOK_BASE_V2_SRC = `${UI_DIR}/medical-book-base-v2.png`;

export const PLAIN_BASE_LAYER: BookLayer = {
  src: BOOK_BASE_V2_SRC,
  smooth: true,
  x: 0,
  y: 0,
  width: BOOK_WIDTH,
  height: BOOK_HEIGHT,
};

// Page centres of the open book art (left page x48-341, right page x345-638).
const LEFT_PAGE_CENTER_X = 194;

function placeholderSpread(
  id: string,
  title: string,
  note: string,
): BookSpread {
  return {
    id,
    layers: [PLAIN_BASE_LAYER],
    texts: [
      {
        id: `${id}-title`,
        role: "name",
        x: LEFT_PAGE_CENTER_X - 110,
        y: 60,
        width: 220,
        align: "center",
        content: [title],
      },
      {
        id: `${id}-note`,
        role: "note",
        x: LEFT_PAGE_CENTER_X - 110,
        y: 96,
        width: 220,
        align: "center",
        content: [note],
      },
    ],
  };
}

// DOLENCIAS layout (specific to this section, not a template for the others):
//   left page  -> the illustration and, under it, the ailment's name;
//   right page -> SÍNTOMAS, its text, TRATAMIENTO, its text, in one column
//                 (x 375-609) on the empty page of the shared base.
const AILMENT_NAME_Y = 224;
const RIGHT_COLUMN_X = 375;
const RIGHT_COLUMN_WIDTH = 234;
const SYMPTOMS_HEADING_Y = 46;
const SYMPTOMS_BODY_Y = 68;
const TREATMENT_HEADING_Y = 200;
const TREATMENT_BODY_Y = 222;

function ailmentSpread(ailment: Ailment): BookSpread {
  const { id, name, illustration } = ailment;

  return {
    id: `ailment-${id}`,
    layers: [
      PLAIN_BASE_LAYER,
      {
        src: `${UI_DIR}/ailments/${illustration.file}.png`,
        x: illustration.x,
        y: illustration.y,
        width: 176,
        height: 176,
      },
    ],
    texts: [
      {
        id: `${id}-name`,
        role: "name",
        x: LEFT_PAGE_CENTER_X - 120,
        y: AILMENT_NAME_Y,
        width: 240,
        align: "center",
        content: [name],
      },
      {
        id: `${id}-symptoms-heading`,
        role: "heading",
        x: RIGHT_COLUMN_X,
        y: SYMPTOMS_HEADING_Y,
        width: RIGHT_COLUMN_WIDTH,
        content: ["SÍNTOMAS"],
      },
      {
        id: `${id}-symptoms`,
        role: "body",
        x: RIGHT_COLUMN_X,
        y: SYMPTOMS_BODY_Y,
        width: RIGHT_COLUMN_WIDTH,
        content: ailment.symptoms,
      },
      {
        id: `${id}-treatment-heading`,
        role: "heading",
        x: RIGHT_COLUMN_X,
        y: TREATMENT_HEADING_Y,
        width: RIGHT_COLUMN_WIDTH,
        content: ["TRATAMIENTO"],
      },
      {
        id: `${id}-treatment`,
        role: "body",
        x: RIGHT_COLUMN_X,
        y: TREATMENT_BODY_Y,
        width: RIGHT_COLUMN_WIDTH,
        content: ailment.treatment,
      },
    ],
  };
}

// The four INGREDIENTES spreads, as complete hand-painted images that already
// hold the paper, the edges, the drawings and the writing: one per language and
// in the same conceptual order in both, so the page the Doctor is on stays the
// same when the language changes:
//   1 Milk / Medicinal herb / Mushroom / Water
//   2 Alcohol / Flour / Charcoal / Cloth
//   3 Orange / Mint / Honey / Resin
//   4 Animal fat / Garlic / Salt / Leech
const INGREDIENT_SPREAD_COUNT = 4;

function ingredientSpreads(language: Language): BookSpread[] {
  const alts = bookCopy[language].ingredientSpreadAlts;

  return Array.from({ length: INGREDIENT_SPREAD_COUNT }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return fullSpread(
      `ingredients-${index + 1}`,
      `${UI_DIR}/ingredients/${language}/ingredients-${number}.png`,
      alts[index],
    );
  });
}

// A spread that is one complete hand-painted image, shown as-is (Ingredientes).
function fullSpread(id: string, src: string, alt: string): BookSpread {
  return {
    id,
    layers: [
      {
        src,
        alt,
        smooth: true,
        x: 0,
        y: 0,
        width: BOOK_WIDTH,
        height: BOOK_HEIGHT,
      },
    ],
  };
}

export const BOOK_SECTIONS: BookSection[] = [
  {
    id: "patients",
    label: "PACIENTES",
    spreads: [
      placeholderSpread(
        "patients-placeholder",
        "Pacientes",
        "Todavía no hay datos conectados.",
      ),
    ],
  },
  {
    id: "ailments",
    label: "DOLENCIAS",
    spreads: AILMENTS.map(ailmentSpread),
  },
  {
    id: "ingredients",
    label: "INGREDIENTES",
    // (Spanish here; buildBookSections picks the language of the game.)
    spreads: ingredientSpreads("es"),
  },
  {
    id: "preparations",
    label: "PREPARADOS",
    spreads: [
      placeholderSpread(
        "preparations-placeholder",
        "Preparados",
        "Todavía no hay recetas conocidas.",
      ),
    ],
  },
];

// The sections of the book for the current game state. DOLENCIAS and
// INGREDIENTES are fixed content; PACIENTES and PREPARADOS are built from the
// patient cases, the inventory and the known recipes (see dynamicPages.ts).
export function buildBookSections(context: BookContext): BookSection[] {
  const tabs = bookCopy[context.language].tabs;
  const [, ailments, ingredients] = BOOK_SECTIONS;

  return [
    {
      id: "patients",
      label: tabs.patients,
      spreads: buildPatientSpreads(context),
    },
    { ...ailments, label: tabs.ailments },
    {
      ...ingredients,
      label: tabs.ingredients,
      spreads: ingredientSpreads(context.language),
    },
    {
      id: "preparations",
      label: tabs.preparations,
      spreads: buildPreparationSpreads(context),
    },
  ];
}
