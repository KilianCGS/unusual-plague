import type { CSSProperties } from "react";

import type { Direction } from "./useProtagonistController";

type ProtagonistSpriteProps = {
  x: number;
  y: number;
  spriteSrc: string;
  spriteSize: number;
  direction: Direction;
  isWalking: boolean;
  // Visual only. Scales around the bottom-center of the image, which is the
  // feet anchor, so the feet never move.
  scale?: number;
  // Stacking order among scene entities; scenes pass the feet Y to sort them.
  zIndex?: number;
  // Visual only: draws the image flipped horizontally around its centre (west
  // runs with the east frames). The anchor, the logical position and every
  // hitbox are untouched.
  mirrored?: boolean;
};

export function ProtagonistSprite({
  x,
  y,
  spriteSrc,
  spriteSize,
  direction,
  isWalking,
  scale = 1,
  zIndex,
  mirrored = false,
}: ProtagonistSpriteProps) {
  const anchorStyle: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    left: x,
    top: y,
    zIndex,
  };

  const imageStyle: CSSProperties = {
    position: "absolute",
    left: -spriteSize / 2,
    top: -spriteSize,
    width: spriteSize,
    height: spriteSize,
    imageRendering: "pixelated",
    ...(scale === 1 && !mirrored
      ? null
      : {
          transform:
            `${scale === 1 ? "" : `scale(${scale}) `}${mirrored ? "scaleX(-1)" : ""}`.trim(),
          transformOrigin: "50% 100%",
        }),
  };

  return (
    <div style={anchorStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spriteSrc}
        alt={`Protagonist ${isWalking ? "walk" : "idle"} ${direction} sprite`}
        width={spriteSize}
        height={spriteSize}
        style={imageStyle}
      />
    </div>
  );
}
