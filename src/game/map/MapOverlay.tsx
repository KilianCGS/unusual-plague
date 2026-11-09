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
import styles from "./MapOverlay.module.css";

// The map is an aged parchment unrolled from one side of the screen to the
// other (a roll at each end), inked in the Compendium's sepia: a small
// engraving per place, trails, the river, a compass and each place's name in
// the book's own handwriting with its underline. All of it is laid out on one
// stage and scaled as one block.
const STAGE = { width: 1920, height: 900 };

const PAPER = "#f3e1b2";
const RED = "#8c2a1f";
const MAP_INK = "#4a2411";
const WATER = "#a9bfba";
const WATER_DARK = "#6f8f90";

// MAP_LOCATIONS keeps its schematic coordinates (see mapLocations.ts); they are
// stretched onto the parchment here.
const toStageX = (x: number) => 190 + (x / MAP_SIZE.width) * 1540;
const toStageY = (y: number) => 210 + (y / MAP_SIZE.height) * 600;
// The ground line of a drawing: a little below its schematic centre so the
// drawing rises above it and the name fits underneath.
const GROUND_OFFSET = 26;
// The painted drawings (public/game/ui/map/<id>.png, 512 x 512, transparent)
// are shown this wide; their ground line sits at 450 / 512 of the picture's height.
const ICON_SIZE = 186;
const ICON_GROUND = 450 / 512;
// Where each drawing's ink starts from the top of its picture (out of 512), to
// hang the pin beside it.
const ICON_TOP: Record<MapLocationId, number> = {
  pharmacy: 30, plaza: 109, tavern: 114, bakery: 61, smithy: 87, forest: 106,
  cottage: 127, farm: 155, mill: 46, mountain: 132, mine: 150, river: 233,
};
const iconSrc = (id: MapLocationId) => `/game/ui/map/${id}.png`;

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

const PARCHMENT = tornPath(70, 78, 1850, 826, 22, 18, 7);

// The river runs north to south through the east of the map; the "river"
// place is the bridge over it.
const RIVER_X = toStageX(420);
const RIVER_PATH =
  `M${RIVER_X - 90} 96 C${RIVER_X - 95} 175 ${RIVER_X - 42} 235 ${RIVER_X - 58} 315 ` +
  `S${RIVER_X - 20} 435 ${RIVER_X} 506 S${RIVER_X + 42} 620 ${RIVER_X + 24} 715 ` +
  `S${RIVER_X - 6} 790 ${RIVER_X - 10} 812`;

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
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeDasharray="0.1 9"
      opacity={0.7}
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
      <rect x={x} y={54} width={92} height={792} fill="url(#roll-shade)" stroke={MAP_INK} strokeWidth={2} />
      <ellipse cx={x + 46} cy={54} rx={46} ry={11} fill="#e3c283" stroke={MAP_INK} strokeWidth={2} />
      <ellipse cx={x + 46} cy={54} rx={28} ry={6} fill="#a97738" stroke={MAP_INK} strokeWidth={1.4} />
      <ellipse cx={x + 46} cy={846} rx={46} ry={11} fill="#b98a4e" stroke={MAP_INK} strokeWidth={2} />
      {[0.16, 0.3, 0.7, 0.86].map((f) => (
        <path key={f} d={`M${x + 92 * f} 60 V840`} stroke={MAP_INK} strokeWidth={1} opacity={0.35} />
      ))}
      <path d={`M${x + 4} 120 h84 M${x + 4} 780 h84`} stroke={MAP_INK} strokeWidth={1.4} opacity={0.5} />
    </g>
  );
}

// The Doctor's map. Screen-space, not clickable, no state: it draws
// MAP_LOCATIONS / MAP_LINKS and marks the place the player is in.
export function MapOverlay({
  currentLocationId,
  language = "es",
}: {
  currentLocationId: MapLocationId;
  language?: Language;
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
            <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0 0.09  0 0 0 0.2 0" />
          </filter>
          {/* large soft stains */}
          <filter id="paper-stains" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="4" seed="11" />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.31  0 0 0 0 0.1  0 0 0 2.4 -1.05" />
          </filter>
          <filter id="edge-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="scroll-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <radialGradient id="paper-light" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#f6e6ba" />
            <stop offset="70%" stopColor="#ecd29b" />
            <stop offset="100%" stopColor="#d4ac6c" />
          </radialGradient>
          <linearGradient id="roll-shade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#8c5b2c" />
            <stop offset="22%" stopColor="#d9b373" />
            <stop offset="48%" stopColor="#f2dca6" />
            <stop offset="78%" stopColor="#c79a59" />
            <stop offset="100%" stopColor="#6e4420" />
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
          <path d={PARCHMENT} fill="none" stroke="#7a4a1f" strokeWidth={46} opacity={0.55} filter="url(#edge-blur)" />
          <rect x={150} y={60} width={110} height={780} fill="url(#roll-cast-left)" />
          <rect x={1660} y={60} width={110} height={780} fill="url(#roll-cast-right)" />
        </g>
        <path d={PARCHMENT} fill="none" stroke={MAP_INK} strokeWidth={1.6} opacity={0.55} />
        <Roll x={0} />
        <Roll x={STAGE.width - 92} />

        <g filter="url(#map-inked)">
          {/* a ruled border, as on the pages of the book */}
          <rect x={150} y={112} width={1620} height={676} fill="none" stroke={MAP_INK} strokeWidth={1.6} opacity={0.5} />
          <rect x={158} y={120} width={1604} height={660} fill="none" stroke={MAP_INK} strokeWidth={0.8} opacity={0.4} />
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
          const half = Math.max(30, name.length * 7.6);

          return (
            <g key={location.id} data-map-node={location.id} transform={`translate(${x} ${y})`}>
              {isHere ? (
                <ellipse cx={0} cy={0} rx={104} ry={20} fill="none" stroke={RED} strokeWidth={2.2} strokeDasharray="6 5" className={styles.ring} />
              ) : null}
              <image
                href={iconSrc(location.id)}
                x={-ICON_SIZE / 2}
                y={-ICON_SIZE * ICON_GROUND}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
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
              <path
                d={`M${-half} 57 q${half * 0.5} 5 ${half} 1 q${half * 0.5} -4 ${half} 0`}
                fill="none"
                stroke={isHere ? RED : MAP_INK}
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={0.85}
              />
            </g>
          );
        })}

        {/* "you are here": a red pin above the place, bobbing slowly */}
        {hereGround ? (
          <g
            data-map-marker
            transform={`translate(${hereGround.x + 78} ${hereGround.y - ((ICON_GROUND * 512 - ICON_TOP[currentLocationId]) / 512) * ICON_SIZE * 0.55})`}
          >
            <g className={styles.pin}>
              <path
                d="M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0 Z"
                transform="translate(0 6)"
                fill={RED}
                stroke={PAPER}
                strokeWidth={2.4}
                strokeLinejoin="round"
              />
              <circle cx={0} cy={-22} r={4.4} fill={PAPER} />
            </g>
          </g>
        ) : null}

        <Compass x={290} y={690} />
      </svg>
    </div>
  );
}
