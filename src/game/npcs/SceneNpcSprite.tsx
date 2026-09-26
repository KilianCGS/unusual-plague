import type { CSSProperties } from "react";

import type { SceneNpc } from "./sceneNpc";

export function SceneNpcSprite({ npc }: { npc: SceneNpc }) {
  const { src, frameSize, scale = 1 } = npc.visual;

  // Same anchoring as ProtagonistSprite: a 0x0 anchor on the feet, image
  // bottom-center on it. Drawn in feet-Y order together with the protagonist.
  const anchorStyle: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    left: npc.position.x,
    top: npc.position.y,
    zIndex: Math.round(npc.position.y),
  };

  const imageStyle: CSSProperties = {
    position: "absolute",
    left: -frameSize / 2,
    top: -frameSize,
    width: frameSize,
    height: frameSize,
    imageRendering: "pixelated",
    ...(scale === 1
      ? null
      : { transform: `scale(${scale})`, transformOrigin: "50% 100%" }),
  };

  return (
    <div style={anchorStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`NPC ${npc.id}`}
        width={frameSize}
        height={frameSize}
        style={imageStyle}
      />
    </div>
  );
}
