"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApothecaryScene } from "../apothecary/ApothecaryScene";
import { DialogueBubble } from "../dialogue/DialogueBubble";
import { DOCTOR_SPEAKER } from "../dialogue/dialogueTypes";
import {
  resolveChapterIntro,
  resolveInteractionConversation,
} from "../dialogue/interactionDialogues";
import { useDialogue } from "../dialogue/useDialogue";
import type { Language } from "../i18n/types";
import { useDirectionInput } from "../protagonist/useDirectionInput";
import { INITIAL_CHAPTER_ID } from "./currentChapter";
import { ExteriorScene, type SceneOverlayContext } from "./ExteriorScene";
import { START_SCENE, START_SPAWN, WORLD_SCENES } from "./worldScenes";
import type { SceneId } from "./worldScenes";

// Scene changes fade to black and back. The scene swap happens while the
// screen is completely covered.
const SCENE_FADE_MS = 450;
// Small margin so the swap never happens before the overlay is fully opaque.
const COVER_MARGIN_MS = 50;
// The opening monologue waits for the title-to-game fade to finish.
const INTRO_DELAY_MS = 1200;

type Phase = "playing" | "fading-out" | "fading-in";
type WorldState = { sceneId: SceneId; spawnName: string; arrival: number };
// Owns the current scene, the navigation and the fade. The keyboard input
// lives here (not in the scenes), so keys that stay physically held survive a
// scene change and keep walking once the fade ends.
export function GameWorld({ language }: { language: Language }) {
  const input = useDirectionInput();
  const [world, setWorld] = useState<WorldState>({
    sceneId: START_SCENE,
    spawnName: START_SPAWN,
    arrival: 0,
  });
  const dialogue = useDialogue();
  const startDialogue = dialogue.start;
  const [phase, setPhase] = useState<Phase>("playing");
  // No narrative state yet: the chapter is fixed at its initial value.
  const [chapterId] = useState(INITIAL_CHAPTER_ID);
  const phaseRef = useRef<Phase>("playing");
  // In-memory only: the Chapter's opening monologue plays once per GameWorld
  // (= per game session), never again on scene changes, book open/close or
  // re-renders. There is no persistent game state yet.
  const introPlayedRef = useRef(false);
  const pendingRef = useRef<{ sceneId: SceneId; spawnName: string } | null>(
    null,
  );
  const scene = WORLD_SCENES[world.sceneId];
  const spawn = scene.arrivals[world.spawnName];
  // The Doctor is blocked (and nothing else can trigger) during a fade and
  // while a conversation is open; control returns when its last line closes.
  const isPlaying = phase === "playing" && !dialogue.active;

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

  // The scene only reports WHICH interaction was activated (and the decor
  // instance it belongs to); a data table turns the id into a conversation in
  // the current language. Nothing here knows what an interactionId means.
  const handleInteract = useCallback(
    (interactionId: string, source: { instanceId?: string }) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      const conversation = resolveInteractionConversation(
        interactionId,
        language,
        source.instanceId ?? "",
      );

      if (conversation) {
        startDialogue(conversation);
      }
    },
    [language, startDialogue],
  );

  useEffect(() => {
    if (introPlayedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      introPlayedRef.current = true;

      const intro = resolveChapterIntro(chapterId, language);

      if (intro) {
        startDialogue(intro);
      }
    }, INTRO_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [chapterId, language, startDialogue]);

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

  // One bubble for every scene: anchored to whoever speaks, in the Doctor's
  // grey when the speaker is the Doctor.
  const renderDialogue = (context: SceneOverlayContext) => {
    if (!dialogue.line) {
      return null;
    }

    const anchor = context.getSpeakerAnchor(dialogue.line.speaker);

    return anchor ? (
      <DialogueBubble
        anchorX={anchor.x}
        anchorY={anchor.y}
        frameWidth={context.frameWidth}
        frameHeight={context.frameHeight}
        visibleText={dialogue.visibleText}
        fullText={dialogue.fullText}
        isComplete={dialogue.isComplete}
        isDoctor={dialogue.line.speaker === DOCTOR_SPEAKER}
      />
    ) : null;
  };

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
          renderOverlay={renderDialogue}
        />
      ) : (
        <ExteriorScene
          key={`${world.sceneId}-${world.arrival}`}
          scene={scene}
          chapterId={chapterId}
          spawn={spawn}
          input={input}
          isPlaying={isPlaying}
          onExit={handleExit}
          onInteract={handleInteract}
          renderOverlay={renderDialogue}
        />
      )}
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
