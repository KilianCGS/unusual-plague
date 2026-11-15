"use client";

import { useEffect, useRef, useState } from "react";

import { playSound } from "../../../game/audio/audioPlayer";
import { setAudioSettings, useAudioSettings } from "../../../game/audio/audioStore";
import { SOUND_IDS, SOUNDS, type SoundCategory, type SoundId } from "../../../game/audio/soundManifest";
import styles from "./page.module.css";

const CATEGORIES: SoundCategory[] = ["steps", "loops", "crafting", "ui", "music"];

// /dev/sounds: listen to every sound, and try the "loop" ones repeated at a chosen pace
// (the interval between hits and the playback rate) to find the speed that fits the NPC
// animation. Uses the same volume setting as the game.
export default function SoundsPage() {
  const { volume, muted } = useAudioSettings();
  const [looping, setLooping] = useState<Partial<Record<SoundId, boolean>>>({});
  const [interval, setIntervalMs] = useState<Partial<Record<SoundId, number>>>({});
  const [rate, setRate] = useState<Partial<Record<SoundId, number>>>({});
  const timers = useRef<Partial<Record<SoundId, number>>>({});

  useEffect(() => {
    const active = timers.current;
    return () => {
      Object.values(active).forEach((timer) => window.clearInterval(timer));
    };
  }, []);

  function stopLoop(id: SoundId) {
    const timer = timers.current[id];
    if (timer !== undefined) window.clearInterval(timer);
    delete timers.current[id];
    setLooping((current) => ({ ...current, [id]: false }));
  }

  function startLoop(id: SoundId, ms: number, playbackRate: number) {
    const existing = timers.current[id];
    if (existing !== undefined) window.clearInterval(existing);
    playSound(id, { rate: playbackRate });
    timers.current[id] = window.setInterval(() => playSound(id, { rate: playbackRate }), ms);
    setLooping((current) => ({ ...current, [id]: true }));
  }

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <strong>/dev/sounds</strong>
        <label>
          Volumen {Math.round(volume * 100)}%{" "}
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(event) => setAudioSettings({ volume: Number(event.target.value) / 100 })}
          />
        </label>
        <button type="button" onClick={() => setAudioSettings({ muted: !muted })}>
          {muted ? "Activar sonido" : "Silenciar"}
        </button>
      </div>
      {CATEGORIES.map((category) => (
        <section key={category} className={styles.group}>
          <h2>{category}</h2>
          {SOUND_IDS.filter((id) => SOUNDS[id].category === category).map((id) => {
            const def = SOUNDS[id];
            const ms = interval[id] ?? 600;
            const playbackRate = rate[id] ?? 1;
            const isLooping = looping[id] === true;
            return (
              <div key={id} className={styles.row}>
                <span className={styles.id}>{id}</span>
                <span className={styles.file}>{def.src.replace("/game/audio/", "")}</span>
                <button type="button" onClick={() => playSound(id, { rate: playbackRate })}>
                  Reproducir
                </button>
                {def.loop || category === "steps" ? (
                  <>
                    <label>
                      cada {ms} ms
                      <input
                        type="range"
                        min={100}
                        max={1500}
                        step={25}
                        value={ms}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setIntervalMs((current) => ({ ...current, [id]: value }));
                          if (isLooping) startLoop(id, value, playbackRate);
                        }}
                      />
                    </label>
                    <label>
                      velocidad x{playbackRate.toFixed(2)}
                      <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.05}
                        value={playbackRate}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setRate((current) => ({ ...current, [id]: value }));
                          if (isLooping) startLoop(id, ms, value);
                        }}
                      />
                    </label>
                    <button type="button" onClick={() => (isLooping ? stopLoop(id) : startLoop(id, ms, playbackRate))}>
                      {isLooping ? "Parar bucle" : "Probar en bucle"}
                    </button>
                  </>
                ) : null}
              </div>
            );
          })}
        </section>
      ))}
    </main>
  );
}
