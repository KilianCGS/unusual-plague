"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, MutableRefObject } from "react";

import { playSound } from "../audio/audioPlayer";
import { DECOR_IMPACT_SOUNDS, impactVolume } from "../audio/decorImpactSounds";
import type { DecorAsset, DecorInstance } from "./decorTypes";
import styles from "./DecorSprite.module.css";

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
  listener,
  highlight = false,
}: {
  asset: DecorAsset;
  instance: DecorInstance;
  // The Doctor is within reach of this one (a market stall): a pulsing silhouette glow around it.
  highlight?: boolean;
  // Where the Doctor stands (null while the game is not being played). Only needed for
  // working NPCs that make a sound; without it they stay silent.
  listener?: MutableRefObject<{ x: number; y: number } | null>;
}) {
  const { frames, frameWidth, frameHeight, fps, loop } = asset.sprite;
  const frameIndex = useFrameIndex(frames.length, fps, loop);
  const impact = DECOR_IMPACT_SOUNDS[asset.id];

  useEffect(() => {
    const at = listener?.current;
    if (!impact || !at || frameIndex !== impact.frame) return;
    const volume = impactVolume(Math.hypot(at.x - instance.x, at.y - instance.y), impact.radius);
    if (volume > 0) playSound(impact.sound, { volume });
    // the sound belongs to the frame change only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex]);

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
    <div
      style={anchorStyle}
      className={highlight ? styles.highlight : undefined}
      data-instance-id={instance.instanceId}
      data-highlight={highlight || undefined}
    >
      {frames.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${index}-${src}`}
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
