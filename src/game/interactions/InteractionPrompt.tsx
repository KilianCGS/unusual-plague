import type { CSSProperties } from "react";

// Transparent rows above the head in the protagonist's 96 px frames (the
// highest visible row of any facing is 14). Sprite-art dependent.
const SPRITE_TOP_PADDING = 14;
// Screen pixels between the head and the prompt.
const GAP_PX = 4;

// Small "[E]" over the protagonist's head. It belongs to the PLAYER, not to
// what is being interacted with, and knows nothing about interactions.
//
// It lives in the camera frame (not in the scaled world), so it follows the
// protagonist through the camera, is clipped like the rest of the frame, and
// keeps the same UI size at any zoom or protagonistScale. Only its position
// depends on the rendered sprite: the sprite scales around its feet anchor, so
// the head top is (frame - padding) * scale above the feet.
export function InteractionPrompt({
  feetX,
  feetY,
  spriteSize,
  spriteScale,
  zoom,
  cameraOffsetX,
  cameraOffsetY,
}: {
  feetX: number;
  feetY: number;
  spriteSize: number;
  spriteScale: number;
  zoom: number;
  // Camera offset in whole screen pixels (CameraView.offsetX / offsetY).
  cameraOffsetX: number;
  cameraOffsetY: number;
}) {
  const headTopY = feetY - (spriteSize - SPRITE_TOP_PADDING) * spriteScale;

  const style: CSSProperties = {
    position: "absolute",
    left: Math.round(feetX * zoom - cameraOffsetX),
    top: Math.round(headTopY * zoom - cameraOffsetY),
    transform: `translate(-50%, calc(-100% - ${GAP_PX}px))`,
    zIndex: 10,
    padding: "2px 8px",
    font: "700 16px/1 monospace",
    letterSpacing: "0.08em",
    color: "#f4ead5",
    background: "rgba(9, 9, 9, 0.82)",
    border: "1px solid #3ddc84",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div style={style} data-interaction-prompt="true">
      [E]
    </div>
  );
}
