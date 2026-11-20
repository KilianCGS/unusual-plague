"use client";

import { useEffect, useState } from "react";
import { GameWorld } from "../game/world/GameWorld";
import { playSound } from "../game/audio/audioPlayer";
import { useIntroMusic } from "../game/audio/useIntroMusic";
import { ControlsPanel } from "../game/controls/ControlsPanel";
import { controlsCopy } from "../game/i18n/controls";
import { IntroScreen } from "../game/intro/IntroScreen";
import { introScreenCopy } from "../game/i18n/introScreen";
import { GothicText } from "../game/ui/GothicText";
import { titleScreenCopy } from "../game/i18n/titleScreen";
import type { Language } from "../game/i18n/types";
import { saveCopy } from "../game/i18n/saveCopy";
import { DeviceNotice } from "../game/ui/DeviceNotice";
import type { GameDevStart } from "../game/world/devStart";
import { readSave, saveFromText, saveToText, toDevStart, writeSave, type SaveGame } from "../game/save/saveGame";

const FADE_DURATION_MS = 1000;

type GamePhase = "title" | "intro" | "apothecary";
type FadePhase = "idle" | "out" | "in";

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("title");
  const [isAboutPanelOpen, setIsAboutPanelOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const [fadePhase, setFadePhase] = useState<FadePhase>("idle");
  const [queuedPhase, setQueuedPhase] = useState<GamePhase | null>(null);
  const copy = titleScreenCopy[language];
  const saves = saveCopy[language];
  // The saved game (autosaved at every dawn): read after mount, since it lives in the browser.
  const [savedGame, setSavedGame] = useState<SaveGame | null>(null);
  const [loadedStart, setLoadedStart] = useState<GameDevStart | undefined>(undefined);
  const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setSavedGame(readSave()), 0);
    return () => window.clearTimeout(id);
  }, [gamePhase]);
  // "UNUSUAL PLAGUE" -> ["Unusual", "Plague"] as letters, in title case
  const titleWords = copy.title
    .split(" ")
    .map((word) => [...(word.charAt(0) + word.slice(1).toLowerCase())]);
  const introCopy = introScreenCopy[language];
  const isInteractionLocked = fadePhase !== "idle";
  // The title music plays on the title and the intro text, and fades out when the game begins.
  useIntroMusic(gamePhase === "title" || gamePhase === "intro");

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
    playSound("ui.introButton");
    setLoadedStart(undefined);
    transitionToPhase("intro");
  };

  const handleContinue = () => {
    if (!savedGame) return;
    playSound("ui.introButton");
    setLoadedStart(toDevStart(savedGame));
    transitionToPhase("apothecary");
  };

  const handleCopySave = async () => {
    if (!savedGame) return;
    const text = saveToText(savedGame);
    setPasteText(text);
    try {
      await navigator.clipboard.writeText(text);
      setSaveMessage(saves.copied);
    } catch {
      // the clipboard can be refused: the text stays in the box to copy by hand
      setSaveMessage(saves.copied);
    }
  };

  const handleLoadSave = () => {
    const parsed = saveFromText(pasteText);
    if (!parsed) {
      setSaveMessage(saves.invalid);
      return;
    }
    writeSave(parsed);
    setSavedGame(parsed);
    setSaveMessage(saves.loaded);
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
        <GameWorld language={language} resume={loadedStart} autosave onQuit={() => transitionToPhase("title")} />
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
            onClick={() => {
              playSound("ui.introButton");
              setLanguage("es");
            }}
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
            onClick={() => {
              playSound("ui.introButton");
              setLanguage("en");
            }}
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
        <div className="title-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="title-ivy" src="/game/ui/title/ivy.png" alt="" />
          <h1 className="title" aria-label={copy.title}>
            {titleWords.map(([first, ...rest], index) => (
              <span className="title-word" key={index} aria-hidden="true">
                {first === "P" ? (
                  // The P of PLAGUE is a post with the plague mask hanging from it.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="title-p" src="/game/ui/title/p-post.png" alt="" />
                ) : (
                  first
                )}
                {rest.join("")}
              </span>
            ))}
          </h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="title-ivy is-below" src="/game/ui/title/ivy.png" alt="" />
          <p className="subtitle">
            <GothicText text={copy.subtitle} />
          </p>
          {/* The start button lives INSIDE the title block, under the subtitle, so
              it can never overlap it whatever the size of the window. */}
          <div className="title-start">
            <button
              className="begin-button"
              type="button"
              disabled={isInteractionLocked}
              onClick={handleBegin}
            >
              {copy.beginButton}
            </button>
            {savedGame ? (
              <button
                className="begin-button title-save-button"
                type="button"
                disabled={isInteractionLocked}
                onClick={handleContinue}
              >
                {saves.continueButton}
              </button>
            ) : null}
            <button
              className="begin-button title-save-button"
              type="button"
              disabled={isInteractionLocked}
              onClick={() => {
                playSound("ui.introButton");
                setSaveMessage(savedGame ? null : saves.empty);
                setIsSavePanelOpen(true);
              }}
            >
              {saves.saveButton}
            </button>
          </div>
        </div>
        <button
          className="begin-button secondary-title-button"
          type="button"
          disabled={isInteractionLocked}
          onClick={() => {
            playSound("ui.introButton");
            setIsAboutPanelOpen(true);
          }}
        >
          {copy.aboutButton}
        </button>
        <button
          className="begin-button secondary-title-button controls-title-button"
          type="button"
          disabled={isInteractionLocked}
          onClick={() => {
            playSound("ui.introButton");
            setIsControlsOpen(true);
          }}
        >
          {controlsCopy[language].openButton}
        </button>
      </div>

      <DeviceNotice language={language} />

      {isControlsOpen ? (
        <ControlsPanel language={language} onClose={() => setIsControlsOpen(false)} />
      ) : null}

      {isSavePanelOpen ? (
        <div className="about-panel-backdrop" onClick={() => setIsSavePanelOpen(false)}>
          <section className="about-panel" aria-modal="true" role="dialog" onClick={(event) => event.stopPropagation()}>
            <h2 className="about-panel-title">{saves.title}</h2>
            <p>{saves.intro}</p>
            <textarea
              className="save-text"
              value={pasteText}
              placeholder={saves.placeholder}
              onChange={(event) => setPasteText(event.target.value)}
              rows={4}
            />
            {saveMessage ? <p className="save-message">{saveMessage}</p> : null}
            <div className="save-actions">
              {savedGame ? (
                <button className="begin-button" type="button" onClick={handleCopySave}>
                  {saves.copy}
                </button>
              ) : null}
              <button className="begin-button" type="button" onClick={handleLoadSave} disabled={!pasteText.trim()}>
                {saves.load}
              </button>
              <button className="begin-button" type="button" onClick={() => setIsSavePanelOpen(false)}>
                {saves.close}
              </button>
            </div>
          </section>
        </div>
      ) : null}

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
            <p>{copy.aboutPanel.paragraphs[3]}</p>
            <h3 className="about-credits-title">{copy.aboutPanel.creditsTitle}</h3>
            {copy.aboutPanel.credits.map((line) => (
              <p key={line} className="about-credits">{line}</p>
            ))}
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