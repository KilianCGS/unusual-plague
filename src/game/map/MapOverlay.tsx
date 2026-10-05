"use client";

import { useFitScale } from "../book/useFitScale";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import {
  MAP_LINKS,
  MAP_LOCATIONS,
  MAP_SIZE,
  type MapLocationId,
} from "./mapLocations";
import styles from "./MapOverlay.module.css";

// Fraction of the window the map may occupy (its limiting dimension).
const VIEWPORT_FRACTION = 0.5;
const NODE_WIDTH = 68;
const NODE_HEIGHT = 26;
// Padding around the drawing inside the parchment, in map units.
const PAD = 14;

const INK = "#2b1a14";
const PAPER = "#e9dbb9";

// The old map the Doctor glances at while TAB is held. Screen-space, not
// clickable, no state: it only draws MAP_LOCATIONS / MAP_LINKS and marks the
// place the player is in (`currentLocationId`). Replacing the drawing with a
// painted PNG later means swapping the <svg>; the data and the marker logic
// stay as they are.
export function MapOverlay({
  currentLocationId,
}: {
  currentLocationId: MapLocationId;
}) {
  const width = MAP_SIZE.width + PAD * 2;
  const height = MAP_SIZE.height + PAD * 2;
  const scale = useFitScale(width, height, VIEWPORT_FRACTION);
  const byId = new Map(
    MAP_LOCATIONS.map((location) => [location.id, location]),
  );
  const current = byId.get(currentLocationId);

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY }}
      data-map-overlay
      data-map-current={currentLocationId}
    >
      <div className={styles.border} style={{ width: width * scale + 8 }}>
        <div className={styles.paper}>
          <svg
            className={styles.drawing}
            width={width * scale}
            height={height * scale}
            viewBox={`${-PAD} ${-PAD} ${width} ${height}`}
            shapeRendering="crispEdges"
            role="img"
            aria-label="Mapa"
          >
            {/* hand-drawn feeling: a thin inner frame */}
            <rect
              x={-PAD + 6}
              y={-PAD + 6}
              width={width - 12}
              height={height - 12}
              fill="none"
              stroke={INK}
              strokeWidth={1}
              strokeOpacity={0.55}
            />
            {/* paths: dashed ink lines under the places */}
            {MAP_LINKS.map(([fromId, toId]) => {
              const from = byId.get(fromId);
              const to = byId.get(toId);

              return from && to ? (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={INK}
                  strokeWidth={3}
                  strokeDasharray="6 4"
                />
              ) : null;
            })}
            {MAP_LOCATIONS.map((location) => {
              const isHere = location.id === currentLocationId;

              return (
                <g key={location.id} data-map-node={location.id}>
                  <rect
                    x={location.x - NODE_WIDTH / 2}
                    y={location.y - NODE_HEIGHT / 2}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    fill={isHere ? INK : PAPER}
                    stroke={INK}
                    strokeWidth={3}
                  />
                  <text
                    x={location.x}
                    y={location.y + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--ui-font)"
                    fontSize={9}
                    fontWeight={700}
                    letterSpacing={0.4}
                    fill={isHere ? PAPER : INK}
                    shapeRendering="auto"
                  >
                    {location.label}
                  </text>
                </g>
              );
            })}
            {/* "you are here": the place is inked in and a small pointer sits on its
                top-left corner (never on a path line) */}
            {current ? (
              <g data-map-marker>
                <polygon
                  points={`${current.x - NODE_WIDTH / 2 + 2},${current.y - NODE_HEIGHT / 2 - 14} ${current.x - NODE_WIDTH / 2 + 16},${current.y - NODE_HEIGHT / 2 - 14} ${current.x - NODE_WIDTH / 2 + 9},${current.y - NODE_HEIGHT / 2 - 4}`}
                  fill={INK}
                />
              </g>
            ) : null}
          </svg>
        </div>
      </div>
    </div>
  );
}
