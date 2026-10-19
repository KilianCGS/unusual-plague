"use client";

import { getItem, ITEMS } from "../../../game/items/items";
import styles from "./page.module.css";

// DEV-ONLY preview of the whole item art family (16 base resources + 14
// prepared items), because the real carried inventory only shows 6.
//
// All 30 are real entries of the item catalog (src/game/items): they have a
// name and an icon. Being in the catalog is NOT gameplay: no recipe, patient or
// acquisition exists for most of them yet. An id listed here that is missing
// from the catalog is flagged, since that would be a bug.
const BASE_RESOURCES = [
  "milk",
  "medicinal-herb",
  "mushroom",
  "water",
  "alcohol",
  "flour",
  "coal",
  "cloth",
  "orange",
  "mint",
  "honey",
  "resin",
  "animal-fat",
  "garlic",
  "salt",
  "leech",
];

const PREPARED_ITEMS = [
  "medicinal-infusion",
  "cold-cloth",
  "mushroom-soup",
  "milk-with-honey",
  "disinfected-bandage",
  "mint-infusion",
  "balsamic-syrup",
  "ointment-base",
  "medicinal-ointment",
  "poultice",
  "medicinal-compress",
  "crushed-coal",
  "charcoal-suspension",
  "citrus-drink",
];

function IconGrid({ title, ids }: { title: string; ids: string[] }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <ul className={styles.grid}>
        {ids.map((id) => {
          const item = getItem(id);

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
              <span
                className={item?.icon ? styles.inGame : styles.artOnly}
                data-in-catalog={item ? "true" : "false"}
              >
                {item
                  ? `catalog item · icon ${item.icon ? "linked" : "NOT linked"}`
                  : "NOT IN CATALOG"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const ART_IDS = new Set([...BASE_RESOURCES, ...PREPARED_ITEMS]);
// Catalog items that are not part of the 30 art entries (internal items).
const OTHER_CATALOG_ITEMS = Object.keys(ITEMS).filter((id) => !ART_IDS.has(id));

export default function ItemArtPreviewPage() {
  const catalog = Object.values(ITEMS);

  return (
    <main className={styles.page}>
      <h1>/dev/items</h1>
      <p>
        Catalog: {catalog.length} items · {catalog.filter((i) => i.icon).length}{" "}
        with an icon · {catalog.filter((i) => !i.icon).length} without. Icons at
        3x (nearest-neighbour).
      </p>
      <IconGrid title="Base resources (inventory-icons)" ids={BASE_RESOURCES} />
      <IconGrid title="Prepared items (prepared-icons)" ids={PREPARED_ITEMS} />
      <IconGrid
        title="Other catalog items (not in the 30 art entries)"
        ids={OTHER_CATALOG_ITEMS}
      />
    </main>
  );
}
