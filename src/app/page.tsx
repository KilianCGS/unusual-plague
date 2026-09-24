"use client";

import { useEffect, useState } from "react";
import { GameWorld } from "../game/world/GameWorld";
import { IntroScreen } from "../game/intro/IntroScreen";
import { introScreenCopy } from "../game/i18n/introScreen";
import { titleScreenCopy } from "../game/i18n/titleScreen";
import type { Language } from "../game/i18n/types";

const FADE_DURATION_MS = 1000;

type GamePhase = "title" | "intro" | "apothecary";
type FadePhase = "idle" | "out" | "in";

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("title");
  const [isAboutPanelOpen, setIsAboutPanelOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const [fadePhase, setFadePhase] = useState<FadePhase>("idle");
  const [queuedPhase, setQueuedPhase] = useState<GamePhase | null>(null);
  const copy = titleScreenCopy[language];
  const introCopy = introScreenCopy[language];
  const isInteractionLocked = fadePhase !== "idle";

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!isAboutPanelOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAboutPanelOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAboutPanelOpen]);

  useEffect(() => {
    if (fadePhase === "out") {
      const timeoutId = window.setTimeout(() => {
        if (!queuedPhase) {
          setFadePhase("idle");
          return;
        }

        setGamePhase(queuedPhase);
        setQueuedPhase(null);
        setFadePhase("in");
      }, FADE_DURATION_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    if (fadePhase !== "in") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFadePhase("idle");
    }, FADE_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fadePhase, queuedPhase]);

  const transitionToPhase = (nextPhase: GamePhase) => {
    if (isInteractionLocked) {
      return;
    }

    setQueuedPhase(nextPhase);
    setFadePhase("out");
  };

  const handleBegin = () => {
    transitionToPhase("intro");
  };

  const handleAboutBackdropClick = () => {
    setIsAboutPanelOpen(false);
  };

  if (gamePhase === "intro") {
    return (
      <>
        <IntroScreen
          lines={introCopy.blocks}
          onComplete={() => transitionToPhase("apothecary")}
        />
        <div
          className="title-screen-fade"
          style={{
            opacity: fadePhase === "out" ? 1 : 0,
            pointerEvents: fadePhase === "idle" ? "none" : "auto",
            transitionDuration: `${FADE_DURATION_MS}ms`,
          }}
        />
      </>
    );
  }

  if (gamePhase === "apothecary") {
    return (
      <>
        <GameWorld />
        <div
          className="title-screen-fade"
          style={{
            opacity: fadePhase === "out" ? 1 : 0,
            pointerEvents: fadePhase === "idle" ? "none" : "auto",
            transitionDuration: `${FADE_DURATION_MS}ms`,
          }}
        />
      </>
    );
  }

  return (
    <main
      className="title-screen"
    >
      <div className="title-container">
        <div
          className="language-selector"
          aria-label={copy.languageSelectorLabel}
        >
          <button
            className={`language-button${language === "es" ? " is-active" : ""}`}
            type="button"
            aria-label="Español"
            disabled={isInteractionLocked}
            onClick={() => setLanguage("es")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="language-flag"
              src="/game/ui/languages/es.png"
              alt=""
              width="24"
              height="18"
            />
          </button>
          <button
            className={`language-button${language === "en" ? " is-active" : ""}`}
            type="button"
            aria-label="English"
            disabled={isInteractionLocked}
            onClick={() => setLanguage("en")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="language-flag"
              src="/game/ui/languages/en.png"
              alt=""
              width="24"
              height="18"
            />
          </button>
        </div>
        <h1 className="title">{copy.title}</h1>
        <p className="subtitle">{copy.subtitle}</p>
        <button
          className="begin-button"
          type="button"
          disabled={isInteractionLocked}
          onClick={handleBegin}
        >
          {copy.beginButton}
        </button>
        <button
          className="begin-button secondary-title-button"
          type="button"
          disabled={isInteractionLocked}
          onClick={() => setIsAboutPanelOpen(true)}
        >
          {copy.aboutButton}
        </button>
      </div>

      {isAboutPanelOpen ? (
        <div
          className="about-panel-backdrop"
          onClick={handleAboutBackdropClick}
        >
          <section
            className="about-panel"
            aria-modal="true"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="about-panel-title">{copy.aboutPanel.title}</h2>
            <p>{copy.aboutPanel.paragraphs[0]}</p>
            <p>{copy.aboutPanel.paragraphs[1]}</p>
            <p>{copy.aboutPanel.paragraphs[2]}</p>
            <button
              className="begin-button about-panel-close"
              type="button"
              disabled={isInteractionLocked}
              onClick={() => setIsAboutPanelOpen(false)}
            >
              {copy.aboutPanel.closeButton}
            </button>
          </section>
        </div>
      ) : null}

      <div
        className="title-screen-fade"
        style={{
          opacity: fadePhase === "out" ? 1 : 0,
          pointerEvents: fadePhase === "idle" ? "none" : "auto",
          transitionDuration: `${FADE_DURATION_MS}ms`,
        }}
      />
    </main>
  );
}