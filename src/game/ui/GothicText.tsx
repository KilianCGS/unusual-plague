import type { ReactNode } from "react";

// The title font ("UP Gothic", from PixelLab) only has ASCII letters, digits and basic
// punctuation: no á é í ó ú ü ñ ¿ ¡. This draws those letters anyway: the plain letter
// plus its mark on top (the mark comes from the CSS `.gothic-accent::before` rule in
// globals.css, in a serif face). The text stays real text for screen readers.
const MARKS: Record<string, [string, string]> = {
  á: ["a", "´"], é: ["e", "´"], í: ["i", "´"], ó: ["o", "´"], ú: ["u", "´"],
  Á: ["A", "´"], É: ["E", "´"], Í: ["I", "´"], Ó: ["O", "´"], Ú: ["U", "´"],
  ñ: ["n", "~"], Ñ: ["N", "~"], ü: ["u", "¨"], Ü: ["U", "¨"],
};

export function GothicText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let plain = "";

  [...text].forEach((char, index) => {
    const mark = MARKS[char];

    if (!mark) {
      plain += char;

      return;
    }

    if (plain) {
      parts.push(plain);
      plain = "";
    }

    parts.push(
      <span key={index} className="gothic-accent" data-accent={mark[1]} aria-hidden="true">
        {mark[0]}
      </span>,
    );
  });

  if (plain) {
    parts.push(plain);
  }

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{parts}</span>
    </span>
  );
}
