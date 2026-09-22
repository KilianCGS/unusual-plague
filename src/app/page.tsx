"use client";

import { useEffect, useState } from "react";
import { titleScreenCopy } from "../game/i18n/titleScreen";
import type { Language } from "../game/i18n/types";

const BEGIN_FADE_DURATION_MS = 1000;

type BeginPhase = "idle" | "fading" | "black";

export default function Home() {
  const [isAboutPanelOpen, setIsAboutPanelOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const [beginPhase, setBeginPhase] = useState<BeginPhase>("idle");
  const copy = titleScreenCopy[language];
  const isInteractionLocked = beginPhase !== "idle";

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
    if (beginPhase !== "fading") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setBeginPhase("black");
    }, BEGIN_FADE_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [beginPhase]);

  const handleBegin = () => {
    if (isInteractionLocked) {
      return;
    }

    setBeginPhase("fading");
  };

  const handleAboutBackdropClick = () => {
    setIsAboutPanelOpen(false);
  };

  return (
    <main
      className={`title-screen${beginPhase === "fading" ? " is-fading" : ""}${beginPhase === "black" ? " is-black" : ""}`}
    >
      <div className="title-container">
        <div
          className="language-selector"
          aria-label={copy.languageSelectorLabel}
        >
          <button
            className={`language-button${language === "es" ? " is-active" : ""}`}
            type="button"
            disabled={isInteractionLocked}
            onClick={() => setLanguage("es")}
          >
            🇪🇸 ES
          </button>
          <button
            className={`language-button${language === "en" ? " is-active" : ""}`}
            type="button"
            disabled={isInteractionLocked}
            onClick={() => setLanguage("en")}
          >
            🇬🇧 EN
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
          transitionDuration: `${BEGIN_FADE_DURATION_MS}ms`,
        }}
      />
    </main>
  );
}