import type { CSSProperties } from "react";

import type { Direction } from "./useProtagonistController";

type ProtagonistSpriteProps = {
  x: number;
  y: number;
  spriteSrc: string;
  spriteSize: number;
  direction: Direction;
  isWalking: boolean;
};

export function ProtagonistSprite({
  x,
  y,
  spriteSrc,
  spriteSize,
  direction,
  isWalking,
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