// EXPERIMENTAL camera helpers for /dev/scene. Pure functions: the camera only
// affects presentation. Player, sprite, background and controller bounds stay
// in world coordinates (logical units).
//
// Screen position of a world point: (world - camera) * zoom.

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };

// How the camera sits on one axis, for the HUD.
export type CameraAxisState = "fixed" | "min" | "max" | "free";

export type CameraView = {
  // Camera top-left corner in world units (after screen-pixel rounding).
  x: number;
  y: number;
  // The same offset in whole screen pixels, used for the CSS translate.
  offsetX: number;
  offsetY: number;
  stateX: CameraAxisState;
  stateY: CameraAxisState;
};

const EPSILON = 1e-6;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Screen pixels per logical unit. The zoom fits the reference viewport into
// the available window, so every scene shares it, then applies the scene's
// multiplier.
export function computeZoom(
  referenceViewport: Size,
  available: Size,
  zoomMultiplier: number,
  maxZoom: number,
) {
  const fitZoom = Math.min(
    available.width / referenceViewport.width,
    available.height / referenceViewport.height,
  );

  return Math.min(fitZoom * zoomMultiplier, maxZoom);
}

// Visible logical area of a scene: the reference viewport divided by the zoom
// multiplier (a closer zoom shows less world, so the frame keeps filling the
// same window area), shrunk on any axis where the world is smaller so the
// frame never shows anything outside it. With a multiplier of 1 this is the
// reference viewport itself.
export function computeFrame(
  world: Size,
  referenceViewport: Size,
  zoomMultiplier = 1,
): Size {
  return {
    width: Math.min(world.width, referenceViewport.width / zoomMultiplier),
    height: Math.min(world.height, referenceViewport.height / zoomMultiplier),
  };
}

function computeAxis(
  focus: number,
  worldSize: number,
  frameSize: number,
  zoom: number,
) {
  const maxUnits = Math.max(worldSize - frameSize, 0);
  const units = clamp(focus - frameSize / 2, 0, maxUnits);
  // Round to whole screen pixels to avoid shimmering; the floor on the upper
  // bound guarantees the frame never reveals space beyond the background.
  const maxOffset = Math.floor(maxUnits * zoom + EPSILON);
  const offset = clamp(Math.round(units * zoom), 0, maxOffset);

  let state: CameraAxisState = "free";

  if (maxOffset === 0) {
    state = "fixed";
  } else if (offset === 0) {
    state = "min";
  } else if (offset === maxOffset) {
    state = "max";
  }

  return { units: offset / zoom, offset, state };
}

// Camera centered on `focus` (world units), limited by the world borders.
export function computeCamera(
  focus: Point,
  world: Size,
  frame: Size,
  zoom: number,
): CameraView {
  const horizontal = computeAxis(focus.x, world.width, frame.width, zoom);
  const vertical = computeAxis(focus.y, world.height, frame.height, zoom);

  return {
    x: horizontal.units,
    y: vertical.units,
    offsetX: horizontal.offset,
    offsetY: vertical.offset,
    stateX: horizontal.state,
    stateY: vertical.state,
  };
}
