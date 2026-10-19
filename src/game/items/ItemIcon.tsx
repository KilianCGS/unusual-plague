import type { CSSProperties } from "react";

import { getItemIcon } from "./items";
import styles from "./ItemIcon.module.css";

// The icon of an item, read from the item catalog (never from a table of its
// own). Renders nothing when the item has no icon, so the caller can fall back
// to the item's name. The art is 48x48 pixel art: it is only ever scaled by the
// browser with nearest-neighbour (see the CSS), never smoothed.
export function ItemIcon({
  itemId,
  className,
  style,
}: {
  itemId: string;
  className?: string;
  style?: CSSProperties;
}) {
  const icon = getItemIcon(itemId);

  if (!icon) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`${styles.icon}${className ? ` ${className}` : ""}`}
      style={style}
      src={icon}
      alt=""
      width={48}
      height={48}
      draggable={false}
      data-item-icon={itemId}
    />
  );
}
