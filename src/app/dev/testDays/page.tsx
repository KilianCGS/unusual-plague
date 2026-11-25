"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import type { Language } from "../../../game/i18n/types";
import { addItem } from "../../../game/inventory/inventory";
import { ITEMS, getItemName } from "../../../game/items/items";
import { useIsClient } from "../../../game/ui/useIsClient";
import { createTestDayStart, type EconomyProfile, type TestDay } from "../../../game/world/economyStart";
import type { SceneId } from "../../../game/world/worldScenes";
import { GameWorld } from "../../../game/world/GameWorld";

// DEV-ONLY (2026-11-20): pick any day and START it with the coins and the bag the economy says a player would have there,
// to try how that day plays. It is the real GameWorld started like /dev/day2..4 (TEST DATA, see world/economyStart.ts).
// The coins and the extra items can be changed before starting. Nothing is saved; the normal game never passes a start.
const DAYS: { day: TestDay; label: string; note: string }[] = [
  { day: 1, label: "Día 1", note: "El primer día, sin tutorial" },
  { day: 2, label: "Día 2", note: "Tras curar a los 3 del día 1" },
  { day: 3, label: "Día 3", note: "Tras los días 1 y 2" },
  { day: 4, label: "Día 4", note: "La noche (sin economía: solo narrativa)" },
];

const box: CSSProperties = { padding: "10px 14px", font: "14px monospace", color: "#f4ead5", background: "#1c1710", border: "2px solid #8a6a47", cursor: "pointer" };

// URL parameters (2026-11-21, to take clean screenshots and to reproduce a situation quickly):
//   ?day=2&profile=justo|recados&lang=es|en&scene=forest&spawn=from-outskirts&items=orange:2,cloth:1&coins=20&clean=1&go=1
// `go=1` starts at once; `clean=1` hides this page's floating readout (no development panel on screen).
function readParams() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

export default function TestDaysPage() {
  const isClient = useIsClient();
  const [language, setLanguage] = useState<Language>("es");
  const [day, setDay] = useState<TestDay>(2);
  const [profile, setProfile] = useState<EconomyProfile>("justo");
  const [coinsOverride, setCoinsOverride] = useState<string>("");
  const [extras, setExtras] = useState<{ itemId: string; quantity: number }[]>([]);
  const [extraItem, setExtraItem] = useState<string>("orange");
  const [run, setRun] = useState<number | null>(null);
  const [params] = useState(readParams);
  const [paramsApplied, setParamsApplied] = useState(false);
  useEffect(() => {
    if (paramsApplied || typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      const d = Number(params.day);
      if ([1, 2, 3, 4].includes(d)) setDay(d as TestDay);
      if (params.profile === "justo" || params.profile === "recados") setProfile(params.profile);
      if (params.lang === "es" || params.lang === "en") setLanguage(params.lang);
      if (params.coins) setCoinsOverride(params.coins);
      if (params.items) {
        setExtras(params.items.split(",").flatMap((pair) => {
          const [itemId, qty] = pair.split(":");
          return itemId in ITEMS ? Array.from({ length: Math.max(1, Number(qty) || 1) }, () => ({ itemId, quantity: 1 })) : [];
        }));
      }
      if (params.go === "1") setRun(0);
      setParamsApplied(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [params, paramsApplied]);

  const built = useMemo(() => createTestDayStart(day, profile), [day, profile]);
  const coins = coinsOverride.trim() !== "" && Number.isFinite(Number(coinsOverride)) ? Math.max(0, Math.round(Number(coinsOverride))) : built.start.coins ?? 0;
  const start = useMemo(() => {
    let inventory = built.start.inventory;
    for (const extra of extras) inventory = addItem(inventory, extra.itemId, extra.quantity) ?? inventory;
    const scene = params.scene && params.spawn ? { sceneId: params.scene as SceneId, spawnName: params.spawn } : undefined;
    return { ...built.start, coins, inventory, ...(scene ? { scene } : {}) };
  }, [built, extras, coins, params]);
  const bag = start.inventory.slots.flatMap((slot) => (slot ? [`${getItemName(slot.itemId, language)} ×${slot.quantity}`] : []));

  if (!isClient) return null;

  if (run !== null) {
    return (
      <>
        <GameWorld key={`${run}-${language}`} language={language} devStart={start} />
        {params.clean === "1" ? null : <aside style={{ position: "fixed", top: 8, left: 8, zIndex: 2000, display: "flex", gap: 6, padding: "6px 8px", font: "12px monospace", color: "#f4ead5", background: "rgba(9,9,9,0.85)", border: "1px solid #3f3427" }}>
          <strong>/dev/testDays · Día {day} · {profile} · {coins} monedas</strong>
          <button type="button" onClick={() => setRun((r) => (r ?? 0) + 1)}>Reiniciar</button>
          <button type="button" onClick={() => setRun(null)}>Elegir otro</button>
        </aside>}
      </>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#0b0907", color: "#f4ead5", font: "14px/1.4 monospace" }}>
      <h1 style={{ fontSize: 18, margin: "0 0 4px" }}>/dev/testDays</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>Elige un día y empiézalo con las monedas y el inventario que la economía daría. Nada se guarda.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {DAYS.map((d) => (
          <button key={d.day} type="button" style={{ ...box, background: d.day === day ? "#4a3524" : "#1c1710" }} onClick={() => { setDay(d.day); setCoinsOverride(""); }}>
            <strong>{d.label}</strong><br /><span style={{ opacity: 0.7 }}>{d.note}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span>Perfil:</span>
        {(["justo", "recados"] as EconomyProfile[]).map((p) => (
          <button key={p} type="button" style={{ ...box, background: p === profile ? "#4a3524" : "#1c1710" }} onClick={() => { setProfile(p); setCoinsOverride(""); }}>
            {p === "justo" ? "Justo (solo lo necesario, sin recados)" : "Con recados (todos los hechos)"}
          </button>
        ))}
        <span style={{ marginLeft: 12 }}>Idioma:</span>
        {(["es", "en"] as Language[]).map((l) => (
          <button key={l} type="button" style={{ ...box, background: l === language ? "#4a3524" : "#1c1710" }} onClick={() => setLanguage(l)}>{l.toUpperCase()}</button>
        ))}
      </div>

      <section style={{ border: "1px solid #3f3427", padding: 12, marginBottom: 12 }}>
        <strong>Monedas al empezar el día {day}: {coins}</strong>{" "}
        <label style={{ marginLeft: 12 }}>
          cambiar a: <input value={coinsOverride} onChange={(e) => setCoinsOverride(e.target.value)} placeholder={String(built.start.coins ?? "")} style={{ width: 70, font: "inherit" }} />
        </label>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, opacity: 0.85 }}>
          {built.economy.lines.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </section>

      <section style={{ border: "1px solid #3f3427", padding: 12, marginBottom: 12 }}>
        <strong>Inventario inicial:</strong> {bag.length ? bag.join(" · ") : "vacío"}
        {built.economy.shopItemsRemoved.length > 0 ? <div style={{ opacity: 0.7 }}>Quitado (se compra en tiendas): {built.economy.shopItemsRemoved.join(", ")}</div> : null}
        <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span>Añadir:</span>
          <select value={extraItem} onChange={(e) => setExtraItem(e.target.value)} style={{ font: "inherit" }}>
            {Object.keys(ITEMS).map((id) => <option key={id} value={id}>{getItemName(id, language)} ({id})</option>)}
          </select>
          <button type="button" style={box} onClick={() => setExtras((list) => [...list, { itemId: extraItem, quantity: 1 }])}>+1</button>
          {extras.length ? <button type="button" style={box} onClick={() => setExtras([])}>Quitar lo añadido ({extras.length})</button> : null}
        </div>
      </section>

      <button type="button" style={{ ...box, background: "#2a4a2a", fontSize: 16 }} onClick={() => setRun(0)}>
        Empezar el día {day} →
      </button>
    </main>
  );
}
