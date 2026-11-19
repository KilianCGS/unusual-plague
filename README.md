# Unusual Plague

Un juego de exploración y artesanía en pixel art, en español e inglés. Eres un médico de la peste en un pueblo medieval
donde empiezan a aparecer dolencias extrañas. Durante cuatro días recorres sus calles, hablas con los vecinos,
investigas a los pacientes con ayuda del Compendio (un libro de dolencias, ingredientes y preparados), recoges o compras
ingredientes, los combinas en tu botica y tratas a quien lo necesita. El último día cambia el tono.

Proyecto personal de Kilian García Santana, hecho con Next.js, React y TypeScript mediante un flujo de trabajo asistido por
IA: las decisiones de diseño, narrativa, arte y colocación son del autor (véase `AGENTS.md`).

## Cómo ejecutarlo

```bash
npm install
npm run dev        # http://localhost:3000
```

Requiere Node.js 20 o superior. Abre `http://localhost:3000`, elige idioma y pulsa «Empezar». El juego se guarda solo
al empezar cada día (a partir del 2) y el título ofrece «Continuar» y copiar/pegar la partida.

## Pruebas

```bash
node --test tests/*.test.mjs      # recorridos, economía, colisiones, textos, guardado...
npx tsc --noEmit -p .             # tipos
npx eslint src tests              # lint
```

Los tests no son de interfaz: recorren los datos (casos, tienda, economía sin callejones sin salida, alcanzabilidad de las
escenas sobre los colliders reales, coherencia entre el libro y los casos, paridad ES/EN).

## Qué hay dentro

- `src/game/`: el juego. Composiciones por día (`compositions/`), diálogos y resolutores de historia (`dialogue/`), crafteo
  y recetas (`crafting/`), libro (`book/`), tienda y monedas (`shop/`, `money/`), guardado (`save/`), audio (`audio/`).
- `src/app/dev/`: herramientas propias para autoría, no forman parte del juego:
  - `/dev/decorator`: coloca personajes y decoración por día y exporta composiciones versionadas.
  - `/dev/collisions`: dibuja colliders, profundidad, transiciones y spawns, con mover/escalar y arrastrar.
  - `/dev/day2`, `/dev/day3`, `/dev/day4`: arrancan el juego en ese día con el estado ya preparado.
- `docs/`: contexto del proyecto (`AI_PROJECT_CONTEXT.md`), diagnóstico y evaluación (`DIAGNOSTICO_JUEGO.md`,
  `EVALUACION_NOV19.md`) y textos pendientes de revisión.

## Estado

Los cuatro días están encadenados: investigación y tratamiento los días 1 a 3, y una noche final sin pacientes. Los textos
nuevos están pendientes de revisión del autor (`docs/TEXTOS_NUEVOS_ES_EN.md`).
