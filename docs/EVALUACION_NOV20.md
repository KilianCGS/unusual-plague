# Evaluación de Unusual Plague, actualización del 20 de noviembre

Actualiza `EVALUACION_NOV19.md` con lo que cambió después. Mismas reglas: lo **comprobado por tests** (datos), lo **visto**
(capturas en un navegador sin ventana) y lo **jugado de verdad** se separan; hoy nadie ha jugado los cuatro días seguidos,
yo tampoco. Los textos de los días 3 y 4, el guardado y el epílogo los escribió la IA.

## Qué ha cambiado desde ayer

| Antes (19-nov) | Hoy (20-nov) | Evidencia |
|---|---|---|
| Día 4: 1 persona, sin Bruja colocada, final inalcanzable | 161 instancias, **15 vecinos absortos**, Bruja fuera (de frente, conjurando) y dentro, final y epílogo | `compositions/artifacts.ts`; recuento de instancias |
| Sin apertura del día 4 | Despertar extrañado por «una luz azulada y un zumbido» | Captura en `/dev/day4` (se ve el bocadillo); test `day4-flow` |
| Vecinos: dos pensamientos sueltos | Saludo en voz alta → silencio → «diagnóstico» extrañado | `chapter4Dialogues.ts`; tests `day4-ambient`, `day4-flow` |
| Puerta de la casita siempre abierta el día 4 | Cerrada hasta hablar con la Bruja de fuera («Aquí, Doctor»), sin vuelta al bosque | `GameWorld.tsx`, `nightScenes.ts`; tests |
| Sin cierre propio | Cierre → negro → epílogo sobre «la peste de la que nadie quiere curarse» → FIN | `EndCard.tsx`; test |
| Sin guardado | Autoguardado al amanecer, «Continuar», copiar/pegar partida | `save/saveGame.ts`; test `save-game`; probado «Continuar» en navegador sin ventana |
| README de create-next-app | README real, guion de QA, evaluación | `README.md`, `docs/GUION_QA.md` |
| 70 archivos de test | 72, con 4 de recorrido del día 4 sobre los colliders reales | `tests/day4-walk.test.mjs` |

Verificado hoy: 72 de 72 tests, `tsc` y `eslint` limpios. Sin ejecutar `next build`.

## Lo que sigue sin verificarse

- **Ninguna partida humana de los cuatro días.** Los tests demuestran que los días 1–3 se pueden terminar y que en el
  día 4 se camina hasta la Bruja y se alcanza a cada vecino; no demuestran cómo se siente.
- **La conversación en pantalla:** en la captura se ve el primer bocadillo del día 4, pero mi pulsación simulada de Intro
  no lo avanzó. No es un fallo confirmado (puede ser mi forma de enviar la tecla); hay que comprobarlo jugando.
- **Música, volúmenes y la puerta de la casita con el «Aquí, Doctor»:** sin oír ni jugar.

## Puntuaciones actualizadas (1–5)

| Aspecto | Antes | Hoy | Por qué |
|---|---|---|---|
| Jugabilidad | 3 | 3 | El bucle sigue siendo el mismo tres días; el día 4 es de lectura, no de acción |
| Claridad | 3 | 3 | Rumores, panel R y libro ayudan; no probado con una persona nueva |
| Dificultad | 3 | 3 | Baja y sin callejones sin salida demostrados; el riesgo es la información dispersa |
| Narrativa | 3 | 4 | Ahora hay arco completo: siembra del día 3, despertar, silencio, Bruja, epílogo |
| Misterio | 2 | 3 | El jugador ya llega a vivirlo; sigue sin diagnósticos como mecánica |
| Presentación | 4 | 4 | Coherente; pesos de imagen altos |
| Calidad de portfolio | 4 | 4 | Tests y herramientas fuertes; README ya real; falta demo y vídeo |

## Decisiones del autor (20-nov) que cambian la lectura

- **El día 4 es solo narrativo, a propósito:** el jugador debe sorprenderse con el mensaje y el misterio. Que sea corto y de
  lectura deja de ser un problema; es el diseño. Tampoco hay misión en el panel de recados (se ha quitado «Ir a ver a la
  bruja»): el jugador encuentra el camino por sí mismo.
- **Los días 1 a 3 repiten el verbo por naturaleza:** diagnosticar, tratar con objetos y curar es el propio juego, no un fallo.
- **El sonido se considera bien para un indie;** se añadirá alguna cosa pequeña.
- **Demo y vídeo:** después de que juegue su pareja.

## Los problemas que quedan hoy

1. **Ninguna partida humana completa** (mañana la primera, con `docs/GUION_QA.md`): es el mayor riesgo de bloqueos o ritmos
   no vistos.
2. **Sin guía en el día 4:** con una noche sin misión, el riesgo es que alguien no sepa a dónde ir. Hay un recorrido a pie
   hasta la Bruja demostrado por test, pero no si un jugador nuevo lo encuentra; que la pareja lo anote.
3. **Sonido sin ambiente por lugar** (opcional, ya decidido que está bien): algún sonido pequeño de puertas o ambiente.
4. **Sin demo desplegada ni vídeo,** con 233 MB de imágenes: se hará tras la prueba.
5. **Textos nuevos sin revisar** (días 3 y 4): `docs/TEXTOS_NUEVOS_ES_EN.md`.

## Siguientes pasos (propuestas)

1. Que su pareja juegue los cuatro días con la hoja de QA; arreglar lo que salga. *Mediano.*
2. Pequeños sonidos de ambiente o de puertas. *Pequeño a mediano.*
3. Demo desplegada, imágenes comprimidas y vídeo de 2–3 minutos. *Pequeño a mediano.*
4. Revisar los textos nuevos. *Pequeño.*

## Valoración franca

El juego ya tiene principio, nudo y desenlace jugables en datos y un tono final propio. Lo que falta para sentirse completo
es **comprobación humana** (jugarlo entero, ajustar el ritmo y los atascos). Para presentarlo a una
empresa falta, sobre todo, poder verlo sin instalar nada (demo y vídeo): la parte técnica ya está bien documentada y
probada.
