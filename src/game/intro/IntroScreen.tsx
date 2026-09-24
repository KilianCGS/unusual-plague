"use client";

import { useEffect, useRef, useState } from "react";

const FADE_IN_MS = 1000;
const READ_MS = 4500;
const FADE_OUT_MS = 1000;
const GAP_MS = 500;

type IntroPhase = "fade-in" | "hold" | "fade-out" | "gap";

type IntroScreenProps = {
  lines: string[];
  onComplete: () => void;
};

export function IntroScreen({ lines, onComplete }: IntroScreenProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [phase, setPhase] = useState<IntroPhase>("fade-in");
  const onCompleteRef = useRef(onComplete);
  const isLastLine = currentLineIndex === lines.length - 1;
  const textAnimation =
    phase === "fade-in"
      ? `intro-text-fade-in ${FADE_IN_MS}ms ease forwards`
      : phase === "fade-out"
        ? `intro-text-fade-out ${FADE_OUT_MS}ms ease forwards`
        : "none";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timeoutMs =
      phase === "fade-in"
        ? FADE_IN_MS
        : phase === "hold"
          ? READ_MS
          : phase === "fade-out"
            ? FADE_OUT_MS
            : GAP_MS;

    const timeoutId = window.setTimeout(() => {
      if (phase === "fade-in") {
        setPhase("hold");
        return;
      }

      if (phase === "hold") {
        setPhase("fade-out");
        return;
      }

      if (phase === "fade-out") {
        if (isLastLine) {
          onCompleteRef.current();
          return;
        }

        setPhase("gap");
        return;
      }

      setCurrentLineIndex((currentIndex) => currentIndex + 1);
      setPhase("fade-in");
    }, timeoutMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLastLine, phase]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#000000",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          width: "min(100%, 720px)",
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "clamp(1.25rem, 2vw, 1.8rem)",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
            whiteSpace: "pre-line",
            opacity: phase === "hold" ? 1 : phase === "gap" ? 0 : undefined,
            animation: textAnimation,
          }}
        >
          {lines[currentLineIndex]}
        </p>
      </section>
      <style jsx>{`
        @keyframes intro-text-fade-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes intro-text-fade-out {
          from {
            opacity: 1;
          }

          to {
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}