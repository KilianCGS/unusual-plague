"use client";

import { useState } from "react";

import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import { bookCopy } from "../i18n/book";
import {
  BOOK_HEIGHT,
  BOOK_WIDTH,
  buildBookSections,
  type BookSpread,
} from "./bookPages";
import type { BookContext } from "./dynamicPages";
import styles from "./BookOverlay.module.css";
import { useFitScale } from "./useFitScale";

// BOOK SHELL: the physical book, its tabs, the page-turn arrows, the dimmed
// backdrop and the scale. SECTION CONTENT lives in bookPages.ts: each section
// decides what its spreads contain; the shell only draws them.

// The tabs stick out above the book, so the stage is taller than the art.
const BOOK_TOP = 22;
const STAGE_HEIGHT = BOOK_TOP + BOOK_HEIGHT;
// Fraction of the window the stage may occupy. V1 used 0.85; the book is now
// ~25% smaller (0.85 * 0.75).
const VIEWPORT_FRACTION = 0.64;

const TAB_WIDTH = 112;
const TAB_GAP = 8;
// The book always has four tabs (PACIENTES, DOLENCIAS, INGREDIENTES, PREPARADOS).
const TAB_COUNT = 4;
const TAB_GROUP_WIDTH = TAB_COUNT * TAB_WIDTH + (TAB_COUNT - 1) * TAB_GAP;
// Centered as a group over the book (not stretched across it).
const TABS_LEFT = (BOOK_WIDTH - TAB_GROUP_WIDTH) / 2;

// Screen-space Compendium. The parent mounts it only while open, so every
// opening starts from the cover (the book is a physical object: it does not
// remember its page). It lays out a fixed 688x406 stage in book pixels and
// scales that whole stage, so nothing inside depends on the viewport and
// nothing deforms. The page-turn arrows sit OUTSIDE the book art, beside it.
// What the PACIENTES / PREPARADOS pages need to draw themselves. Without it
// (the /dev/book preview) the book shows the empty state in Spanish.
const EMPTY_CONTEXT: BookContext = {
  language: "es",
  patients: {},
  inventory: { capacity: 0, slots: [] },
  knownRecipeIds: new Set(),
};

export function BookOverlay({
  context = EMPTY_CONTEXT,
}: {
  context?: BookContext;
}) {
  const copy = bookCopy[context.language];
  const sections = buildBookSections(context);
  const scale = useFitScale(BOOK_WIDTH, STAGE_HEIGHT, VIEWPORT_FRACTION);
  const [isOpen, setIsOpen] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [spreadIndex, setSpreadIndex] = useState(0);

  const section = sections[sectionIndex];
  const spread = section.spreads[spreadIndex];
  const hasPrevious = spreadIndex > 0;
  const hasNext = spreadIndex < section.spreads.length - 1;

  function selectSection(index: number) {
    setSectionIndex(index);
    setSpreadIndex(0);
  }

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY }}
      data-book-overlay
    >
      <div
        className={styles.frame}
        style={{ width: BOOK_WIDTH * scale, height: STAGE_HEIGHT * scale }}
      >
        <div
          className={styles.stage}
          style={{
            width: BOOK_WIDTH,
            height: STAGE_HEIGHT,
            transform: `scale(${scale})`,
            ["--book-top" as string]: `${BOOK_TOP}px`,
            ["--book-height" as string]: `${BOOK_HEIGHT}px`,
          }}
        >
          {isOpen ? (
            <>
              <SpreadView spread={spread} />
              {hasPrevious ? (
                <button
                  type="button"
                  className={`${styles.arrow} ${styles.arrowPrevious}`}
                  aria-label={copy.previousLabel}
                  onClick={() => setSpreadIndex(spreadIndex - 1)}
                >
                  <span className={styles.arrowFace}>
                    <span className={styles.glyphLeft} />
                  </span>
                </button>
              ) : null}
              {hasNext ? (
                <button
                  type="button"
                  className={`${styles.arrow} ${styles.arrowNext}`}
                  aria-label={copy.nextLabel}
                  onClick={() => setSpreadIndex(spreadIndex + 1)}
                >
                  <span className={styles.arrowFace}>
                    <span className={styles.glyphRight} />
                  </span>
                </button>
              ) : null}
              <div className={styles.tabs} role="tablist">
                {sections.map((candidate, index) => (
                  <button
                    key={candidate.id}
                    type="button"
                    role="tab"
                    aria-selected={index === sectionIndex}
                    className={
                      index === sectionIndex
                        ? `${styles.tab} ${styles.tabActive}`
                        : styles.tab
                    }
                    style={{
                      left: TABS_LEFT + index * (TAB_WIDTH + TAB_GAP),
                      width: TAB_WIDTH,
                    }}
                    onClick={() => selectSection(index)}
                  >
                    <span className={styles.tabFace}>{candidate.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button
              type="button"
              className={styles.cover}
              onClick={() => setIsOpen(true)}
              aria-label={copy.openLabel}
            >
              <span className={styles.coverFrame}>
                <span className={styles.coverTitle}>{copy.coverTitle}</span>
                <span className={styles.coverRule} />
                <span className={styles.coverSubtitle}>
                  {copy.coverSubtitle}
                </span>
              </span>
              <span className={styles.coverHint}>{copy.coverHint}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SpreadView({ spread }: { spread: BookSpread }) {
  return (
    <div className={styles.spread} data-spread={spread.id}>
      {spread.layers.map((layer) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={layer.src}
          src={layer.src}
          alt=""
          draggable={false}
          className={styles.layer}
          style={{
            left: layer.x,
            top: BOOK_TOP + layer.y,
            width: layer.width,
            height: layer.height,
          }}
        />
      ))}
      {spread.texts?.map((block) => (
        <p
          key={block.id}
          className={`${styles.text} ${styles[block.role]}`}
          style={{
            left: block.x,
            top: BOOK_TOP + block.y,
            width: block.width,
            textAlign: block.align ?? "left",
          }}
        >
          {block.content.map((fragment, index) =>
            typeof fragment === "string" ? (
              fragment
            ) : (
              <em key={index} className={styles.emphasis}>
                {fragment.emphasis}
              </em>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
