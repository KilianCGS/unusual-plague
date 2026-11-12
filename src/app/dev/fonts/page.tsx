"use client";

// Font candidates for the whole game UI, on the same kind of text the game shows.
const FONTS = ["Almendra", "Metamorphous", "MedievalSharp", "IM Fell DW Pica", "Grenze Gotisch", "UP Gothic", "Courier New"];

const LINES = [
  "Explora la ciudad y trata a los pacientes que lo necesiten.",
  "Infusión de menta y jarabe balsámico. ¡Una cucharada antes de dormir, ñu!",
  "Pulsa E para interactuar · Libro · Recados · 12 monedas · 0123456789",
];

export default function FontsPreview() {
  return (
    <main style={{ padding: 24, background: "#e9dbb9", color: "#2b1a14", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "Georgia" }}>/dev/fonts</h1>
      {FONTS.map((family) => (
        <section key={family} style={{ margin: "18px 0", padding: 12, border: "2px solid #8a6a4a" }}>
          <div style={{ fontFamily: "Arial", fontSize: 12, opacity: 0.7 }}>{family}</div>
          <div style={{ fontFamily: `"${family}"`, fontSize: 22, fontWeight: 700 }}>{LINES[0]}</div>
          <div style={{ fontFamily: `"${family}"`, fontSize: 16 }}>{LINES[1]}</div>
          <div style={{ fontFamily: `"${family}"`, fontSize: 13 }}>{LINES[2]}</div>
        </section>
      ))}
    </main>
  );
}
