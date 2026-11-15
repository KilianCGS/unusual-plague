"use client";

import { audioCopy } from "../i18n/audio";
import type { Language } from "../i18n/types";
import { playSound } from "./audioPlayer";
import { setAudioSettings, useAudioSettings } from "./audioStore";
import styles from "./VolumeControl.module.css";

// Effects volume slider with a mute toggle; shared by the pause menu and the controls
// screen. Releasing the slider plays a sample so the level can be judged by ear.
export function VolumeControl({ language }: { language: Language }) {
  const copy = audioCopy[language];
  const { volume, muted } = useAudioSettings();
  return (
    <div className={styles.root} data-volume-control>
      <label className={styles.label} htmlFor="sfx-volume">
        {copy.volume}
      </label>
      <input
        id="sfx-volume"
        className={styles.slider}
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(volume * 100)}
        disabled={muted}
        onChange={(event) => setAudioSettings({ volume: Number(event.target.value) / 100 })}
        onPointerUp={(event) => {
          playSound("ui.itemClickDrop");
          event.currentTarget.blur();
        }}
      />
      <button
        type="button"
        className={`${styles.mute}${muted ? ` ${styles.muteOn}` : ""}`}
        aria-pressed={muted}
        data-volume-mute
        onClick={(event) => {
          event.currentTarget.blur();
          setAudioSettings({ muted: !muted });
        }}
      >
        {muted ? copy.unmute : copy.mute}
      </button>
    </div>
  );
}
