// Content of the Medical Compendium as DATA. The component only renders this.
//
// Coordinates are in BOOK-IMAGE pixels (the open book art is 688x384).
// A spread is drawn as stacked image layers; a finished spread painted by hand
// is just ONE full-size layer (that is how the Ingredientes spreads work, and
// how the Dolencias spreads will be replaced once Kilian paints them: swap the
// `layers` of that spread for a single full image, nothing else changes).
// The image is the visual source of truth: `notes` is only for placeholder
// text that is not part of any art yet.

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

export type BookNote = {
  x: number;
  y: number;
  width: number;
  text: string;
  align?: "left" | "center";
  // Font size in book pixels.
  size?: number;
};

export type BookSpread = {
  id: string;
  layers: BookLayer[];
  notes?: BookNote[];
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
const PLAIN_BASE_LAYER: BookLayer = {
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
    notes: [
      {
        x: LEFT_PAGE_CENTER_X - 110,
        y: 60,
        width: 220,
        text: title,
        align: "center",
        size: 18,
      },
      {
        x: LEFT_PAGE_CENTER_X - 110,
        y: 96,
        width: 220,
        text: note,
        align: "center",
        size: 9,
      },
    ],
  };
}

// An ailment spread = the book with the Dolencias right-page ornaments + the
// hand-drawn illustration on the left page (the ailment name will go under
// it). No text is drawn: the right page keeps the ruled lines reserved for
// SÍNTOMAS / TRATAMIENTO once those pages are painted.
// (x, y) = where the 176x176 illustration canvas sits on the book image.
function ailmentSpread(
  id: string,
  file: string,
  x: number,
  y: number,
): BookSpread {
  return {
    id,
    layers: [
      AILMENT_BASE_LAYER,
      { src: `${UI_DIR}/ailments/${file}.png`, x, y, width: 176, height: 176 },
    ],
  };
}

// A spread that is one complete hand-painted image, shown as-is (Ingredientes).
function fullSpread(id: string, file: string): BookSpread {
  return {
    id,
    layers: [
      {
        src: `${UI_DIR}/ingredients/${file}.png`,
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
    spreads: [
      ailmentSpread("ailment-fever", "fever", 102, 39),
      ailmentSpread("ailment-stomach", "stomach", 108, 30),
      ailmentSpread("ailment-infected-wound", "infected-wound", 100, 24),
      ailmentSpread("ailment-chest-cough", "chest-cough", 112, 23),
      ailmentSpread("ailment-scurvy", "scurvy", 107, 20),
      ailmentSpread("ailment-exhaustion", "exhaustion", 117, 15),
    ],
  },
  {
    id: "ingredients",
    label: "INGREDIENTES",
    spreads: [
      fullSpread("ingredients-1", "ingredients-spread-1"),
      fullSpread("ingredients-2", "ingredients-spread-2"),
      fullSpread("ingredients-3", "ingredients-spread-3"),
      fullSpread("ingredients-4", "ingredients-spread-4"),
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
