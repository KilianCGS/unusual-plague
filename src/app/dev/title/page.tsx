"use client";

import { useState } from "react";

import { GothicText } from "../../../game/ui/GothicText";
import styles from "./page.module.css";

// IDEAS for the title screen, over the real cover. Pick a lettering (A-D) and a
// button style (1-3); nothing here is used by the game yet.
type Lettering = "A" | "B" | "C" | "D" | "E";
type ButtonStyle = "wood" | "iron" | "wax" | "plank";

// The P pictures to compare (E only): all in /game/ui/title/
const PS = [
  { file: "p-crook-wood-rc.png", name: "gancho madera (color letras)" },
  { file: "p-crook-wood.png", name: "gancho madera (original)" },
  { file: "p-crook-gold.png", name: "gancho dorado" },
  { file: "p-side-straps.png", name: "correas laterales" },
  { file: "p-rope-2.png", name: "cuerda" },
  { file: "p-chibi-1.png", name: "chibi" },
];

const LETTERINGS: { id: Lettering; name: string }[] = [
  { id: "A", name: "A · Manuscrito + P máscara" },
  { id: "B", name: "B · Uncial con hiedra" },
  { id: "C", name: "C · Gótica con setas" },
  { id: "D", name: "D · Máscara + hiedra" },
  { id: "E", name: "E · Madera (prueba)" },
];
const BUTTONS: { id: ButtonStyle; name: string }[] = [
  { id: "wood", name: "1 · Madera y pergamino" },
  { id: "iron", name: "2 · Hierro y oro" },
  { id: "wax", name: "3 · Lacre rojo" },
  { id: "plank", name: "4 · Tablón madera" },
];

export default function TitleIdeas() {
  const [lettering, setLettering] = useState<Lettering>("A");
  const [button, setButton] = useState<ButtonStyle>("wood");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [shield, setShield] = useState(false);
  const [pIndex, setPIndex] = useState(0);

  const wood = lettering === "E";
  const font = wood ? styles.woodLetters : lettering === "B" ? styles.uncial : styles.gothic;
  const withMask = lettering === "A" || lettering === "D" || wood;
  const withIvy = lettering === "B" || lettering === "D" || wood;
  const withMushrooms = lettering === "C";

  return (
    <main className={styles.stage}>
      <div className={styles.titleBlock}>
        {withIvy ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.ivyRow} src="/game/ui/title/ivy.png" alt="" />
        ) : null}
        <h1 className={`${styles.title} ${font}`}>
          <span>Unusual</span>
          {withMask ? (
            <span style={{ display: "inline-flex", alignItems: "flex-end" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={wood ? styles.pcustom : styles.pmask}
                src={wood ? `/game/ui/title/${PS[pIndex].file}` : "/game/ui/title/p-mask.png"}
                alt="P"
              />
              <span>lague</span>
            </span>
          ) : (
            <span>Plague</span>
          )}
        </h1>
        {withIvy ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={`${styles.ivyRow} ${styles.ivyBottom}`} src="/game/ui/title/ivy.png" alt="" />
        ) : null}
        {withMushrooms ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.mushroomL} src="/game/ui/title/mushrooms.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.mushroomR} src="/game/ui/title/mushrooms.png" alt="" />
          </>
        ) : null}
        <p className={styles.subtitle}>
          <GothicText
            text={lang === "es" ? "Algo extraño se acerca." : "Something strange is coming."}
          />
        </p>
      </div>

      <div className={styles.langs}>
        {(["es", "en"] as const).map((code) => (
          <button
            key={code}
            type="button"
            className={`${styles.flag} ${shield ? styles.flagShield : ""}`}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/game/ui/languages/${code}.png`} alt={code} />
          </button>
        ))}
      </div>

      <div className={styles.start} style={withIvy ? { top: "53%" } : undefined}>
        <button type="button" className={`${styles.btn} ${styles[button]}`}>
          {lang === "es" ? "Empezar" : "Begin"}
        </button>
      </div>
      <div className={styles.about}>
        <button type="button" className={`${styles.btn} ${styles.small} ${styles[button]}`}>
          {lang === "es" ? "Sobre el juego" : "About the game"}
        </button>
      </div>

      <div className={styles.panel}>
        <div>
          {LETTERINGS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={lettering === item.id}
              onClick={() => setLettering(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div>
          {BUTTONS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={button === item.id}
              onClick={() => setButton(item.id)}
            >
              {item.name}
            </button>
          ))}
          <button type="button" aria-pressed={shield} onClick={() => setShield(!shield)}>
            Banderas en escudo
          </button>
        </div>
        {wood ? (
          <div>
            {PS.map((item, index) => (
              <button
                key={item.file}
                type="button"
                aria-pressed={pIndex === index}
                onClick={() => setPIndex(index)}
              >
                P: {item.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
