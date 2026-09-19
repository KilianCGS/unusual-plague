"use client";

import { useState } from "react";
import { titleScreenCopy } from "../game/i18n/titleScreen";
import type { Language } from "../game/i18n/types";

export default function Home() {
  const [isAboutPanelOpen, setIsAboutPanelOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const copy = titleScreenCopy[language];

  return (
    <main className="title-screen">
      <div className="title-container">
        <div
          className="language-selector"
          aria-label={copy.languageSelectorLabel}
        >
          <button
            className={`language-button${language === "es" ? " is-active" : ""}`}
            type="button"
            onClick={() => setLanguage("es")}
          >
            🇪🇸 ES
          </button>
          <button
            className={`language-button${language === "en" ? " is-active" : ""}`}
            type="button"
            onClick={() => setLanguage("en")}
          >
            🇬🇧 EN
          </button>
        </div>
        <h1 className="title">{copy.title}</h1>
        <p className="subtitle">{copy.subtitle}</p>
        <button className="begin-button">{copy.beginButton}</button>
        <button
          className="begin-button secondary-title-button"
          type="button"
          onClick={() => setIsAboutPanelOpen(true)}
        >
          {copy.aboutButton}
        </button>
      </div>

      {isAboutPanelOpen ? (
        <div className="about-panel-backdrop">
          <section className="about-panel" aria-modal="true" role="dialog">
            <h2 className="about-panel-title">{copy.aboutPanel.title}</h2>
            <p>{copy.aboutPanel.paragraphs[0]}</p>
            <p>{copy.aboutPanel.paragraphs[1]}</p>
            <p>{copy.aboutPanel.paragraphs[2]}</p>
            <button
              className="begin-button about-panel-close"
              type="button"
              onClick={() => setIsAboutPanelOpen(false)}
            >
              {copy.aboutPanel.closeButton}
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}