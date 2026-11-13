import type { CSSProperties } from "react";

import { useBindings } from "../controls/controlsStore";
import { keyLabel } from "../controls/keybindings";
import { DOCTOR_SCALE } from "../protagonist/doctorScale";
import styles from "./InteractionPrompt.module.css";

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
  label,
}: {
  feetX: number;
  feetY: number;
  spriteSize: number;
  spriteScale: number;
  zoom: number;
  // Camera offset in whole screen pixels (CameraView.offsetX / offsetY).
  cameraOffsetX: number;
  cameraOffsetY: number;
  // What pressing E does, when the owner knows it ("Preparar", "Cocinar"); the
  // key alone otherwise. The prompt itself still knows nothing about interactions.
  label?: string;
}) {
  const interactKey = keyLabel(useBindings().interact[0], "es");
  const headTopY =
    feetY - (spriteSize - SPRITE_TOP_PADDING) * spriteScale * DOCTOR_SCALE;

  // Only the position is computed here; the look (a keycap that is pressed) is
  // in InteractionPrompt.module.css.
  const style: CSSProperties = {
    left: Math.round(feetX * zoom - cameraOffsetX),
    top: Math.round(headTopY * zoom - cameraOffsetY),
    transform: `translate(-50%, calc(-100% - ${GAP_PX}px))`,
  };

  return (
    <div className={styles.prompt} style={style} data-interaction-prompt="true">
      <span>{interactKey}</span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
