"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApothecaryScene } from "../apothecary/ApothecaryScene";
import { useDirectionInput } from "../protagonist/useDirectionInput";
import { ExteriorScene } from "./ExteriorScene";
import { START_SCENE, START_SPAWN, WORLD_SCENES } from "./worldScenes";
import type { SceneId } from "./worldScenes";

// Scene changes fade to black and back. The scene swap happens while the
// screen is completely covered.
const SCENE_FADE_MS = 450;
// Small margin so the swap never happens before the overlay is fully opaque.
const COVER_MARGIN_MS = 50;

type Phase = "playing" | "fading-out" | "fading-in";
type WorldState = { sceneId: SceneId; spawnName: string; arrival: number };
// PROVISIONAL readout of the last interaction fired in the current scene
// arrival. The real resolution (dialogue, pick-up...) will replace this.
type InteractionLog = { arrival: number; interactionId: string; count: number };

// Owns the current scene, the navigation and the fade. The keyboard input
// lives here (not in the scenes), so keys that stay physically held survive a
// scene change and keep walking once the fade ends.
export function GameWorld() {
  const input = useDirectionInput();
  const [world, setWorld] = useState<WorldState>({
    sceneId: START_SCENE,
    spawnName: START_SPAWN,
    arrival: 0,
  });
  const [interactionLog, setInteractionLog] = useState<InteractionLog | null>(
    null,
  );
  const [phase, setPhase] = useState<Phase>("playing");
  const phaseRef = useRef<Phase>("playing");
  const pendingRef = useRef<{ sceneId: SceneId; spawnName: string } | null>(
    null,
  );
  const scene = WORLD_SCENES[world.sceneId];
  const spawn = scene.arrivals[world.spawnName];
  const isPlaying = phase === "playing";

  const changePhase = useCallback((nextPhase: Phase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  // A transition only starts while the game is playable; while a fade or a
  // scene change is running nothing else can trigger.
  const handleExit = useCallback(
    (exitName: string) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      const exit = WORLD_SCENES[world.sceneId].exits.find(
        (candidate) => candidate.name === exitName,
      );

      if (!exit) {
        return;
      }

      pendingRef.current = {
        sceneId: exit.targetScene,
        spawnName: exit.targetSpawn,
      };
      changePhase("fading-out");
    },
    [world.sceneId, changePhase],
  );

  // The scene only reports WHICH interaction was activated; nothing here knows
  // what an interactionId means.
  const handleInteract = useCallback(
    (interactionId: string) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      setInteractionLog((current) => ({
        arrival: world.arrival,
        interactionId,
        count: current?.arrival === world.arrival ? current.count + 1 : 1,
      }));
    },
    [world.arrival],
  );

  useEffect(() => {
    if (phase === "fading-out") {
      const timeoutId = window.setTimeout(() => {
        const pending = pendingRef.current;

        pendingRef.current = null;

        if (!pending) {
          changePhase("playing");
          return;
        }

        setWorld((current) => ({
          sceneId: pending.sceneId,
          spawnName: pending.spawnName,
          arrival: current.arrival + 1,
        }));
        changePhase("fading-in");
      }, SCENE_FADE_MS + COVER_MARGIN_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    if (phase === "fading-in") {
      const timeoutId = window.setTimeout(() => {
        changePhase("playing");
      }, SCENE_FADE_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [phase, changePhase]);

  return (
    <>
      {scene.kind === "interior" ? (
        <ApothecaryScene
          key={`${world.sceneId}-${world.arrival}`}
          spawn={spawn}
          input={input}
          isPlaying={isPlaying}
          exits={scene.exits}
          onExit={handleExit}
        />
      ) : (
        <ExteriorScene
          key={`${world.sceneId}-${world.arrival}`}
          scene={scene}
          spawn={spawn}
          input={input}
          isPlaying={isPlaying}
          onExit={handleExit}
          onInteract={handleInteract}
        />
      )}
      {interactionLog?.arrival === world.arrival ? (
        <div
          data-interaction-log={interactionLog.interactionId}
          data-interaction-count={interactionLog.count}
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 12px",
            font: "600 14px/1 monospace",
            color: "#f4ead5",
            background: "rgba(9, 9, 9, 0.82)",
            border: "1px solid #3ddc84",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          Interaction: {interactionLog.interactionId} (#{interactionLog.count})
        </div>
      ) : null}
      <div
        className="title-screen-fade"
        data-scene={world.sceneId}
        data-phase={phase}
        style={{
          opacity: phase === "fading-out" ? 1 : 0,
          pointerEvents: isPlaying ? "none" : "auto",
          transitionDuration: `${SCENE_FADE_MS}ms`,
        }}
      />
    </>
  );
}
