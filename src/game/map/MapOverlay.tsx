"use client";

import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import {
  MAP_LINKS,
  MAP_LOCATIONS,
  MAP_SIZE,
  type MapLocation,
  type MapLocationId,
} from "./mapLocations";
import type { MapMarkers } from "./mapMarkers";
import styles from "./MapOverlay.module.css";

// The map is an aged parchment unrolled from one side of the screen to the
// other (a roll at each end), inked in the Compendium's sepia: a small
// engraving per place, trails, the river, a compass and each place's name in
// the book's own handwriting with its underline. All of it is laid out on one
// stage and scaled as one block.
// 2026-11-26 (Kilian): taller, more square parchment (it was 900 high).
const STAGE = { width: 1920, height: 1150 };
const PARCH_TOP = 78;
const PARCH_BOTTOM = 1068;
// the old vertical layout (78..826) stretched onto the new one
const STRETCH = (PARCH_BOTTOM - PARCH_TOP) / (826 - PARCH_TOP);
const sy = (y: number) => Math.round(PARCH_TOP + (y - PARCH_TOP) * STRETCH);

const PAPER = "#ece1c6"; // 2026-11-26: less saturated parchment (was #f3e1b2)
const RED = "#8c2a1f";
const MAP_INK = "#4a2411";
const WATER = "#a9bfba";
const WATER_DARK = "#6f8f90";

// MAP_LOCATIONS keeps its schematic coordinates (see mapLocations.ts); they are
// stretched onto the parchment here.
const toStageX = (x: number) => 190 + (x / MAP_SIZE.width) * 1540;
const toStageY = (y: number) => 300 + (y / MAP_SIZE.height) * 730;
// The ground line of a drawing: a little below its schematic centre so the
// drawing rises above it and the name fits underneath.
const GROUND_OFFSET = 26;
// The painted drawings (public/game/ui/map/<id>.png, 512 x 512, transparent)
// are shown this wide; their ground line sits at 450 / 512 of the picture's height.
// 2026-11-26 (Kilian's new engravings, public/game/ui/map/<id>NewMap.png, 512 x 512, transparent): they fill their
// picture, so each one has its own ink box (top and bottom, out of 512) and its ground line is its own bottom.
const ICON_SIZE = 160;
const ICON_BOX: Record<MapLocationId, { top: number; bottom: number }> = {
  pharmacy: { top: 28, bottom: 505 }, market: { top: 8, bottom: 495 }, plaza: { top: 107, bottom: 472 },
  tavern: { top: 18, bottom: 471 }, bakery: { top: 16, bottom: 504 }, smithy: { top: 9, bottom: 512 },
  forest: { top: 9, bottom: 498 }, cottage: { top: 123, bottom: 498 }, farm: { top: 114, bottom: 478 },
  mill: { top: 8, bottom: 505 }, mountain: { top: 18, bottom: 501 }, mine: { top: 127, bottom: 483 },
  river: { top: 178, bottom: 436 }, quarry: { top: 48, bottom: 512 }, "forest-deep": { top: 0, bottom: 506 },
};
const iconSrc = (id: MapLocationId) => `/game/ui/map/${id}NewMap.png`;
// Height of the drawing's ink above the ground line, and its top edge, in stage units.
const inkHeight = (id: MapLocationId) => ((ICON_BOX[id].bottom - ICON_BOX[id].top) / 512) * ICON_SIZE;

const YELLOW = "#ffd60a"; // a patient waits for the Doctor
const BLUE = "#3f8cff"; // somebody asked him for an errand

// A drawn "!" (the same shape as the one over the characters), 7 x 14 units, scaled up.
function Bang({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x - 11} ${y - 45}) scale(3.2)`}>
      <path d="M1 0h5v9H1z M1 10h5v4H1z" fill="#2b1a14" />
      <path d="M2 1h3v7H2z M2 11h3v2H2z" fill={color} />
    </g>
  );
}

// Small per-place nudges so the drawings sit naturally beside the river.
const NUDGE: Partial<Record<MapLocationId, { dx: number; dy: number }>> = {
  farm: { dx: 38, dy: 0 },
  forest: { dx: 16, dy: 0 },
};

function groundOf(location: MapLocation) {
  const nudge = NUDGE[location.id];

  return {
    x: toStageX(location.x) + (nudge?.dx ?? 0),
    y: toStageY(location.y) + GROUND_OFFSET + (nudge?.dy ?? 0),
  };
}

// "PANADERÍA" -> "Panadería": the handwriting reads better in title case.
function titleCase(text: string) {
  return text.charAt(0) + text.slice(1).toLowerCase();
}

// A torn edge: the rectangle's outline with a deterministic jitter.
function tornPath(x0: number, y0: number, x1: number, y1: number, step: number, amp: number, seed: number) {
  let state = seed;
  const rnd = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296 - 0.5;
  };
  const points: string[] = [];

  for (let x = x0; x <= x1; x += step) points.push(`${x} ${y0 + rnd() * amp}`);
  for (let y = y0; y <= y1; y += step) points.push(`${x1 + rnd() * amp * 0.5} ${y}`);
  for (let x = x1; x >= x0; x -= step) points.push(`${x} ${y1 + rnd() * amp}`);
  for (let y = y1; y >= y0; y -= step) points.push(`${x0 + rnd() * amp * 0.5} ${y}`);

  return `M${points.join(" L")} Z`;
}

const PARCHMENT = tornPath(70, PARCH_TOP, 1850, PARCH_BOTTOM, 22, 18, 7);

// The river runs north to south through the east of the map; the "river"
// place is the bridge over it.
const RIVER_X = toStageX(420);
const RIVER_PATH =
  `M${RIVER_X - 90} ${sy(96)} C${RIVER_X - 95} ${sy(175)} ${RIVER_X - 42} ${sy(235)} ${RIVER_X - 58} ${sy(315)} ` +
  `S${RIVER_X - 20} ${sy(435)} ${RIVER_X} ${sy(506)} S${RIVER_X + 42} ${sy(620)} ${RIVER_X + 24} ${sy(715)} ` +
  `S${RIVER_X - 6} ${sy(790)} ${RIVER_X - 10} ${sy(812)}`;

function Trail({ from, to, bend }: { from: MapLocation; to: MapLocation; bend: number }) {
  const a = groundOf(from);
  const b = groundOf(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const nx = (-(b.y - a.y) / length) * bend;
  const ny = ((b.x - a.x) / length) * bend;

  return (
    <path
      d={`M${a.x} ${a.y - 6} Q${mx + nx} ${my + ny - 6} ${b.x} ${b.y - 6}`}
      fill="none"
      stroke={MAP_INK}
      strokeWidth={5.5}
      strokeLinecap="round"
      strokeDasharray="13 10"
      opacity={0.9}
    />
  );
}

function Compass({ x, y }: { x: number; y: number }) {
  const point = (d: string, fill: string) => (
    <path d={d} fill={fill} stroke={MAP_INK} strokeWidth={1.2} strokeLinejoin="round" />
  );

  return (
    <g transform={`translate(${x} ${y})`} filter="url(#map-inked)">
      <circle r={50} fill="none" stroke={MAP_INK} strokeWidth={1.3} opacity={0.6} />
      <circle r={43} fill="none" stroke={MAP_INK} strokeWidth={0.8} opacity={0.5} strokeDasharray="2 4" />
      {point("M0 -48 L8 -8 L0 0 L-8 -8 Z", MAP_INK)}
      {point("M0 48 L8 8 L0 0 L-8 8 Z", "#dfb27c")}
      {point("M-48 0 L-8 -8 L0 0 L-8 8 Z", "#dfb27c")}
      {point("M48 0 L8 -8 L0 0 L8 8 Z", "#dfb27c")}
      {point("M0 0 L34 -34 L8 -8 Z M0 0 L-34 -34 L-8 -8 Z M0 0 L34 34 L8 8 Z M0 0 L-34 34 L-8 8 Z", "#f6ead0")}
      <text y={-60} textAnchor="middle" fontFamily="var(--book-font)" fontSize={28} fill={MAP_INK}>
        N
      </text>
    </g>
  );
}

// One roll of the parchment, at the left or right end.
function Roll({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={54} width={92} height={PARCH_BOTTOM + 22 - 54} fill="url(#roll-shade)" stroke={MAP_INK} strokeWidth={2} />
      <ellipse cx={x + 46} cy={54} rx={46} ry={11} fill="#d8c8a2" stroke={MAP_INK} strokeWidth={2} />
      <ellipse cx={x + 46} cy={54} rx={28} ry={6} fill="#8f7650" stroke={MAP_INK} strokeWidth={1.4} />
      <ellipse cx={x + 46} cy={PARCH_BOTTOM + 22} rx={46} ry={11} fill="#a8946c" stroke={MAP_INK} strokeWidth={2} />
      {[0.16, 0.3, 0.7, 0.86].map((f) => (
        <path key={f} d={`M${x + 92 * f} 60 V${PARCH_BOTTOM + 14}`} stroke={MAP_INK} strokeWidth={1} opacity={0.35} />
      ))}
      <path d={`M${x + 4} 120 h84 M${x + 4} ${PARCH_BOTTOM - 46} h84`} stroke={MAP_INK} strokeWidth={1.4} opacity={0.5} />
    </g>
  );
}

// The Doctor's map. Screen-space, not clickable, no state: it draws
// MAP_LOCATIONS / MAP_LINKS and marks the place the player is in.
export function MapOverlay({
  currentLocationId,
  language = "es",
  markers = {},
}: {
  currentLocationId: MapLocationId;
  language?: Language;
  markers?: MapMarkers;
}) {
  const byId = new Map(MAP_LOCATIONS.map((location) => [location.id, location]));
  const title = language === "es" ? "MAPA" : "MAP";
  const here = byId.get(currentLocationId);
  const hereGround = here ? groundOf(here) : null;

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY }}
      data-map-overlay
      data-map-current={currentLocationId}
    >
      <svg
        className={styles.stage}
        viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={title}
      >
        <defs>
          {/* a slight wobble so every line looks drawn by hand */}
          <filter id="map-inked" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
          </filter>
          {/* fine paper grain */}
          <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="2" />
            <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.35  0 0 0 0 0.26  0 0 0 0.2 0" />
          </filter>
          {/* large soft stains */}
          <filter id="paper-stains" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="4" seed="11" />
            <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.28  0 0 0 2.4 -1.05" />
          </filter>
          <filter id="edge-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="scroll-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <radialGradient id="paper-light" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#f1e8d0" />
            <stop offset="70%" stopColor="#e3d4b0" />
            <stop offset="100%" stopColor="#c9b48a" />
          </radialGradient>
          <linearGradient id="roll-shade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#7d6446" />
            <stop offset="22%" stopColor="#cdb98f" />
            <stop offset="48%" stopColor="#ebdfc0" />
            <stop offset="78%" stopColor="#b9a47d" />
            <stop offset="100%" stopColor="#5f4a30" />
          </linearGradient>
          <linearGradient id="roll-cast-left" x1="0" x2="1">
            <stop offset="0%" stopColor="#4a2411" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4a2411" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="roll-cast-right" x1="1" x2="0">
            <stop offset="0%" stopColor="#4a2411" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4a2411" stopOpacity="0" />
          </linearGradient>
          <clipPath id="parchment-clip">
            <path d={PARCHMENT} />
          </clipPath>
        </defs>

        {/* the parchment: tinted sheet, grain, stains and burnt edges */}
        <g filter="url(#scroll-shadow)">
          <path d={PARCHMENT} fill="url(#paper-light)" />
        </g>
        <g clipPath="url(#parchment-clip)">
          <rect x={0} y={0} width={STAGE.width} height={STAGE.height} filter="url(#paper-grain)" />
          <rect x={0} y={0} width={STAGE.width} height={STAGE.height} filter="url(#paper-stains)" opacity={0.55} />
          <path d={PARCHMENT} fill="none" stroke="#6e5a40" strokeWidth={46} opacity={0.5} filter="url(#edge-blur)" />
          <rect x={150} y={60} width={110} height={PARCH_BOTTOM - 60} fill="url(#roll-cast-left)" />
          <rect x={1660} y={60} width={110} height={PARCH_BOTTOM - 60} fill="url(#roll-cast-right)" />
        </g>
        <path d={PARCHMENT} fill="none" stroke={MAP_INK} strokeWidth={1.6} opacity={0.55} />
        <Roll x={0} />
        <Roll x={STAGE.width - 92} />

        <g filter="url(#map-inked)">
          {/* a ruled border, as on the pages of the book */}
          <rect x={150} y={112} width={1620} height={PARCH_BOTTOM - 112 - 38} fill="none" stroke={MAP_INK} strokeWidth={1.6} opacity={0.5} />
          <rect x={158} y={120} width={1604} height={PARCH_BOTTOM - 120 - 46} fill="none" stroke={MAP_INK} strokeWidth={0.8} opacity={0.4} />
          <text
            x={STAGE.width / 2}
            y={178}
            textAnchor="middle"
            fontFamily="var(--book-font)"
            fontSize={50}
            letterSpacing={14}
            fill={MAP_INK}
          >
            {title}
          </text>
          <path d="M790 196 q85 12 170 2 q85 -10 170 0" fill="none" stroke={MAP_INK} strokeWidth={2.2} strokeLinecap="round" opacity={0.7} />

          {/* the river: dark bank, water, a pale ripple line */}
          <path d={RIVER_PATH} fill="none" stroke={MAP_INK} strokeWidth={30} strokeLinecap="round" opacity={0.55} />
          <path d={RIVER_PATH} fill="none" stroke={WATER_DARK} strokeWidth={25} strokeLinecap="round" opacity={0.9} />
          <path d={RIVER_PATH} fill="none" stroke={WATER} strokeWidth={19} strokeLinecap="round" />
          <path d={RIVER_PATH} fill="none" stroke={PAPER} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="12 16" opacity={0.75} />

          {MAP_LINKS.map(([fromId, toId], index) => {
            const from = byId.get(fromId);
            const to = byId.get(toId);

            return from && to ? (
              <Trail key={`${fromId}-${toId}`} from={from} to={to} bend={index % 2 === 0 ? 16 : -16} />
            ) : null;
          })}
        </g>

        {MAP_LOCATIONS.map((location) => {
          const { x, y } = groundOf(location);
          const isHere = location.id === currentLocationId;
          const name = titleCase(language === "es" ? location.label : location.labelEn);

          return (
            <g key={location.id} data-map-node={location.id} transform={`translate(${x} ${y})`}>
              {isHere ? (
                <ellipse cx={0} cy={0} rx={104} ry={20} fill="none" stroke={RED} strokeWidth={2.2} strokeDasharray="6 5" className={styles.ring} />
              ) : null}
              <image
                href={iconSrc(location.id)}
                x={-ICON_SIZE / 2}
                y={-ICON_SIZE * (ICON_BOX[location.id].bottom / 512)}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
              {/* the symbols of what waits here: a yellow "!" per patient, a blue one per errand */}
              {(() => {
                const entry = markers[location.id];
                const symbols = [
                  ...Array.from({ length: entry?.patients ?? 0 }, () => YELLOW),
                  ...Array.from({ length: entry?.errands ?? 0 }, () => BLUE),
                ];
                // beside the drawing, at its left, half way up (clear of the name of the place above it and of the
                // "you are here" pin on the right), more symbols going outward to the left
                const gap = 28;
                const top = -inkHeight(location.id) / 2 + 22;

                return symbols.map((color, index) => (
                  <g key={index} data-map-symbol={color === YELLOW ? "patient" : "errand"}>
                    <Bang x={-ICON_SIZE / 2 - 2 - index * gap} y={top} color={color} />
                  </g>
                ));
              })()}
              <text
                y={46}
                textAnchor="middle"
                fontFamily="var(--book-font)"
                fontSize={isHere ? 34 : 31}
                fill={isHere ? RED : MAP_INK}
                stroke={PAPER}
                strokeWidth={6}
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* "you are here": a red pin above the place, bobbing slowly */}
        {hereGround ? (
          <g
            data-map-marker
            transform={`translate(${hereGround.x + 84} ${hereGround.y - inkHeight(currentLocationId) * 0.55})`}
          >
            {/* a ground shadow and a ripple under the tip, then a bigger pin with a gold edge */}
            <ellipse cx={0} cy={8} rx={16} ry={5} fill="#000" opacity={0.28} />
            <circle cx={0} cy={8} r={10} fill="none" stroke={RED} strokeWidth={2.4} className={styles.ripple} />
            <g className={styles.pin}>
              <g transform="translate(0 8) scale(1.7)">
                <path
                  d="M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0 Z"
                  fill={RED}
                  stroke="#d9a441"
                  strokeWidth={2.6}
                  strokeLinejoin="round"
                />
                <path d="M-6 -26 C-6 -30 -2 -31 0 -31" fill="none" stroke="#f4b8a8" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
                <circle cx={0} cy={-22} r={5.2} fill={PAPER} stroke="#7e221c" strokeWidth={1.2} />
              </g>
            </g>
          </g>
        ) : null}

        {/* what the symbols mean (and the "you are here" pin), at the top under the title */}
        <g data-map-legend>
          <Bang x={690} y={262} color={YELLOW} />
          <text x={716} y={247} fontFamily="var(--book-font)" fontSize={27} fill={MAP_INK}>
            {language === "es" ? "Paciente" : "Patient"}
          </text>
          <Bang x={900} y={262} color={BLUE} />
          <text x={926} y={247} fontFamily="var(--book-font)" fontSize={27} fill={MAP_INK}>
            {language === "es" ? "Recado" : "Errand"}
          </text>
          <g transform="translate(1100 258) scale(0.78)" data-map-legend-pin>
            <path d="M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0 Z" fill={RED} stroke="#d9a441" strokeWidth={2.6} strokeLinejoin="round" />
            <circle cx={0} cy={-22} r={5.2} fill={PAPER} stroke="#7e221c" strokeWidth={1.2} />
          </g>
          <text x={1122} y={247} fontFamily="var(--book-font)" fontSize={27} fill={MAP_INK}>
            {language === "es" ? "Estás aquí" : "You are here"}
          </text>
        </g>

        {/* bottom right: the quarry took the bottom-left corner */}
        <Compass x={1660} y={PARCH_BOTTOM - 136} />
      </svg>
    </div>
  );
}
