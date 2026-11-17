"use client";

import { RECIPES } from "../../../game/crafting/recipes";
import { getItem, ITEMS } from "../../../game/items/items";
import styles from "./page.module.css";

// DEV-ONLY preview of the whole item catalog, grouped by what each item IS in the economy (where it
// comes from and what it is for), so the art can be reviewed in context. 2026-11-16 (Kilian): every
// item must be used at least once; an item the recipes never consume and no group marks as "used
// outside the recipes" is flagged. The full numbers (units, chapters, sources) live in
// docs/EconomyReview.md.
//
// Being in the catalog is NOT gameplay by itself. An id listed here that is missing from the catalog
// is flagged, and a catalog item missing from every group shows up in "Not grouped".
const GROUPS: { title: string; ids: string[] }[] = [
  { title: "Containers", ids: ["empty-flask", "empty-jar"] },
  {
    title: "Gathered in the world",
    ids: ["water", "medicinal-herb", "mushroom", "pine-mushroom", "mint", "resin", "coal"],
  },
  { title: "Given by people", ids: ["milk", "honey", "flour", "alcohol", "leech", "black-feather"] },
  {
    title: "Bought (market street stalls; the plaza merchant keeps sugar and salt)",
    ids: ["cloth", "orange", "onion", "garlic", "bone", "animal-fat", "candle", "salt", "sugar"],
  },
  {
    title: "Intermediate steps (mortar, chopping board, work table)",
    ids: [
      "crushed-herb",
      "crushed-coal",
      "crushed-garlic",
      "chopped-onion",
      "chopped-mushroom",
      "medicinal-paste",
      "ointment-base",
      "syrup",
    ],
  },
  {
    title: "Treatments for patients",
    ids: [
      "medicinal-infusion",
      "cold-cloth",
      "mushroom-soup",
      "milk-with-honey",
      "disinfected-bandage",
      "medicinal-ointment",
      "poultice",
      "medicinal-compress",
      "charcoal-suspension",
      "citrus-drink",
      "mint-infusion",
      "balsamic-syrup",
    ],
  },
  {
    title: "Cooking for errands (bone broth is also a Day 3 treatment)",
    ids: ["bone-broth", "onion-syrup", "strong-broth", "rehydration-drink"],
  },
];

// Used by something that is not a recipe input: a case, a trade, the statue, the granary, Day 4.
const USED_OUTSIDE_RECIPES = new Set([
  "water",
  "empty-flask",
  "empty-jar",
  "leech",
  "black-feather",
  "candle",
  "pine-mushroom",
  "milk",
  "honey",
  "flour",
  "alcohol",
  "mint",
  "resin",
  "orange",
  "coal",
  "bone-broth",
  "onion-syrup",
  "strong-broth",
  "rehydration-drink",
  "cold-cloth",
  "medicinal-infusion",
  "mushroom-soup",
  "milk-with-honey",
  "disinfected-bandage",
  "medicinal-ointment",
  "poultice",
  "medicinal-compress",
  "charcoal-suspension",
  "citrus-drink",
  "mint-infusion",
  "balsamic-syrup",
]);

const usedAsInput = (id: string) =>
  RECIPES.some((recipe) => recipe.inputs.some((input) => input.itemId === id));
const madeByRecipe = (id: string) => RECIPES.some((recipe) => recipe.output.itemId === id);

function describeUse(id: string): string {
  if (!getItem(id)) return "NOT IN CATALOG";
  const parts = [
    usedAsInput(id) ? "recipe input" : null,
    USED_OUTSIDE_RECIPES.has(id) ? "case / trade / errand" : null,
  ].filter(Boolean);

  return parts.length ? parts.join(" + ") : "UNUSED";
}

function IconGrid({ title, ids }: { title: string; ids: string[] }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <ul className={styles.grid}>
        {ids.map((id) => {
          const item = getItem(id);
          const use = describeUse(id);

          return (
            <li key={id} className={styles.cell} data-art-id={id}>
              {item?.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.icon}
                  src={item.icon}
                  alt=""
                  width={48}
                  height={48}
                />
              ) : (
                <div className={styles.icon} />
              )}
              <span className={styles.id}>{id}</span>
              <span className={item?.icon ? styles.inGame : styles.artOnly}>
                {item
                  ? `${item.name.es} / ${item.name.en} · ${madeByRecipe(id) ? "crafted" : "raw"}`
                  : "NOT IN CATALOG"}
              </span>
              <span className={use === "UNUSED" ? styles.artOnly : styles.inGame}>{use}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const GROUPED = new Set(GROUPS.flatMap((group) => group.ids));
const NOT_GROUPED = Object.keys(ITEMS).filter((id) => !GROUPED.has(id));

export default function ItemArtPreviewPage() {
  const catalog = Object.values(ITEMS);
  const unused = Object.keys(ITEMS).filter(
    (id) => !usedAsInput(id) && !USED_OUTSIDE_RECIPES.has(id),
  );

  return (
    <main className={styles.page}>
      <h1>/dev/items</h1>
      <p>
        Catalog: {catalog.length} items · {catalog.filter((i) => i.icon).length} with an icon ·{" "}
        {catalog.filter((i) => !i.icon).length} without · {unused.length} with no use at all
        {unused.length ? ` (${unused.join(", ")})` : ""}. Icons at 3x (nearest-neighbour). The
        units and chapters of each one are in docs/EconomyReview.md.
      </p>
      {GROUPS.map((group) => (
        <IconGrid key={group.title} title={group.title} ids={group.ids} />
      ))}
      {NOT_GROUPED.length ? <IconGrid title="Not grouped (add to a group)" ids={NOT_GROUPED} /> : null}
    </main>
  );
}
