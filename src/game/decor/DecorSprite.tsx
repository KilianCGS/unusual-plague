"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import type { DecorAsset, DecorInstance } from "./decorTypes";

// Frame index of an in-place animation (1 frame = static, no timer).
function useFrameIndex(frameCount: number, fps: number, loop: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (frameCount <= 1 || fps <= 0) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) =>
        loop ? (current + 1) % frameCount : Math.min(current + 1, frameCount - 1),
      );
    }, 1000 / fps);

    return () => window.clearInterval(id);
  }, [frameCount, fps, loop]);

  return frameCount <= 1 ? 0 : index;
}

// Box of a placed sprite in world units (scale and flip act around the anchor).
export function getSpriteBox(asset: DecorAsset, instance: DecorInstance) {
  const { frameWidth, frameHeight } = asset.sprite;
  const leftFraction = instance.flipX ? 1 - asset.anchor.x : asset.anchor.x;

  return {
    x: instance.x - leftFraction * frameWidth * instance.scale,
    y: instance.y - asset.anchor.y * frameHeight * instance.scale,
    width: frameWidth * instance.scale,
    height: frameHeight * instance.scale,
  };
}

// A 0x0 anchor sitting on the instance position, like SceneNpcSprite. Depth is
// the anchor Y (plus zOffset), the same principle as the game.
export function DecorSprite({
  asset,
  instance,
}: {
  asset: DecorAsset;
  instance: DecorInstance;
}) {
  const { frames, frameWidth, frameHeight, fps, loop } = asset.sprite;
  const frameIndex = useFrameIndex(frames.length, fps, loop);

  const anchorStyle: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    left: instance.x,
    top: instance.y,
    zIndex: Math.round(instance.y) + instance.zOffset,
  };
  const imageStyle: CSSProperties = {
    position: "absolute",
    left: -asset.anchor.x * frameWidth,
    top: -asset.anchor.y * frameHeight,
    width: frameWidth,
    height: frameHeight,
    imageRendering: "pixelated",
    transformOrigin: `${asset.anchor.x * 100}% ${asset.anchor.y * 100}%`,
    transform: `scale(${instance.flipX ? -instance.scale : instance.scale}, ${instance.scale})`,
    userSelect: "none",
    // Frames are stacked and toggled, so a frame is never loaded mid-animation.
  };

  return (
    <div style={anchorStyle} data-instance-id={instance.instanceId}>
      {frames.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          width={frameWidth}
          height={frameHeight}
          style={{
            ...imageStyle,
            visibility: index === frameIndex ? "visible" : "hidden",
          }}
        />
      ))}
    </div>
  );
}
