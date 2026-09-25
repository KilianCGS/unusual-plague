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
};

export function ProtagonistSprite({
  x,
  y,
  spriteSrc,
  spriteSize,
  direction,
  isWalking,
  scale = 1,
}: ProtagonistSpriteProps) {
  const anchorStyle: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    left: x,
    top: y,
  };

  const imageStyle: CSSProperties = {
    position: "absolute",
    left: -spriteSize / 2,
    top: -spriteSize,
    width: spriteSize,
    height: spriteSize,
    imageRendering: "pixelated",
    ...(scale === 1
      ? null
      : { transform: `scale(${scale})`, transformOrigin: "50% 100%" }),
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