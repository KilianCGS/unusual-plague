// Content of the Medical Compendium as DATA. The component only renders this.
//
// Coordinates are in BOOK-IMAGE pixels (the open book art is 688x384).
// A spread is drawn as stacked image layers plus optional text blocks. A
// finished spread painted by hand is just ONE full-size layer (that is how the
// Ingredientes spreads work). The image is the visual source of truth: text
// blocks only exist where a section writes its pages in code (Dolencias, the
// placeholders), and never duplicate text that an image already contains.

import { bookCopy } from "../i18n/book";
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

// The physical open book, shared by every section: plain paper pages, nothing
// printed inside. Sections that do not paint their own pages start from this.
export const PLAIN_BASE_LAYER: BookLayer = {
  src: `${UI_DIR}/book-base-plain.png`,
  x: 0,
  y: 0,
  width: BOOK_WIDTH,
  height: BOOK_HEIGHT,
};

// The same book WITH the ruled ornaments on the right page. That decoration is
// specific to DOLENCIAS (it separates the future SÍNTOMAS / TRATAMIENTO text);
// it is not a template of the Compendium, so only the ailment spreads use it.
const AILMENT_BASE_LAYER: BookLayer = {
  src: `${UI_DIR}/book-base.png`,
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
//   right page -> SÍNTOMAS, its text, the book's own ruled line, TRATAMIENTO,
//                 its text. The ornaments of the right page are part of
//                 AILMENT_BASE_LAYER (they sit at y 23-39 and y 192, between
//                 x 375 and 609), so the text column follows them.
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
      AILMENT_BASE_LAYER,
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

// A spread that is one complete hand-painted image, shown as-is (Ingredientes).
function fullSpread(id: string, file: string): BookSpread {
  return {
    id,
    layers: [
      {
        src: `${UI_DIR}/resources/${file}.png`,
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
    spreads: [
      fullSpread("ingredients-1", "resources-spread-1-v1"),
      fullSpread("ingredients-2", "resources-spread-2-v1"),
      fullSpread("ingredients-3", "resources-spread-3-v1"),
      fullSpread("ingredients-4", "resources-spread-4-v1"),
    ],
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
    { ...ingredients, label: tabs.ingredients },
    {
      id: "preparations",
      label: tabs.preparations,
      spreads: buildPreparationSpreads(context),
    },
  ];
}
