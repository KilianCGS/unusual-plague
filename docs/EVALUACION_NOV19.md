# Evaluación de Unusual Plague, 19 de noviembre

Hecha leyendo el código y los datos, pasando los tests y cargando páginas en un Chrome sin ventana. **No he jugado el
juego**: duraciones, dificultad y claridad para un jugador nuevo son inferencias del código, no experiencia real. Los
textos de los días 3 y 4 y del guardado los escribió la IA, así que no se pueden juzgar con distancia.

## Hallazgo principal: el día 4 no es completable con los datos actuales

Recuento de instancias colocadas por día (script de lectura):

| Día | Instancias | Personas | Interacciones |
|---|---|---|---|
| 1 | 221 | 30 | 40 |
| 2 | 216 | 26 | 29 |
| 3 | 243 | 48 | 51 |
| 4 | 134 | **1** | **1** |

- Día 4: un solo vecino con artefacto (el leñador) y ninguna interacción más.
- La Bruja: su conversación final está en código (`src/game/dialogue/chapter4Dialogues.ts`), pero la interacción se deriva de
  que se coloque su asset en `forest-cottage` o su interior (`src/game/compositions/artifacts.interactions.ts:53`). Hoy no
  está colocada. Sin ella no hay escena final, ni día completado, ni pantalla de fin.
- Lo que sí está: poses, pensamientos de 12 tipos de vecino, pinturas nocturnas, final de la Bruja, pantalla de fin. Es
  trabajo de colocación pendiente, no un fallo de código.

## 1. Jugabilidad y entretenimiento

- **Implementado y comprobado por tests, no jugado:** el ciclo investigar, recolectar, comprar, fabricar y tratar existe
  completo: 10 dolencias, 25 recetas, 3 estaciones (mesa, fogón, mortero), tienda con topes diarios, cuatro días
  encadenados y guardado al amanecer.
- Recorridos automáticos de los días 1, 2 y 3 (`tests/day1-solvable`, `day2-playthrough`, `day3-playthrough`) y economía sin
  callejones sin salida por búsqueda de estados (`tests/economy-no-deadlock`, 714.365 estados). No hay recorrido del día 4.
- **Riesgos de diseño (inferidos):**
  - La protección del crafteo (`crafting/needs.ts`) rechaza lo que no hace falta: protege de errores pero puede sentirse
    como si el juego supiera más que tú y quitara la experimentación.
  - El día 3 reparte el material por muchos sitios (miel, leche, hueso, menta, sal, azúcar). Los textos y el panel R
    orientan, pero nadie ha comprobado que una persona nueva encuentre cada fuente sola.
  - Los días se parecen en mecánica: cambian casos, mapa, recados y herrería. La variedad real vendría del día 4.
  - Orientación: el panel R muestra rumores en el día 3 y «Tratar a X» tras conocer al paciente. No hay marcadores en el
    mapa a propósito (`AGENTS.md`).

## 2. Duración y dificultad (todo inferido del código)

| Día | Estimación primera vez | Base |
|---|---|---|
| 1 | 25–40 min | Tutorial, 3 pacientes, 1 recado, crafteo con animación de 5 s |
| 2 | 25–40 min | 3 pacientes, 4 recados, investigación del agricultor |
| 3 | 35–50 min | 4 pacientes, 2 recados, la Bruja, herramientas |
| 4 | 10–15 min si se completa | Caminar, observar, conversación final |
| Total | ≈ 1 h 45 – 2 h 30 | Sin datos de partida real |

Dificultad baja en lo mecánico, moderada en lo informativo. Posibles atascos: monedas malgastadas, cofre sin ver
(inventario de 8–9 casillas), salidas del bosque recién reescritas (solo las comprueba el test de alcanzabilidad).

## 3. Narrativa y misterio

- El día 3 siembra la distracción en las líneas ambientales (`src/game/dialogue/chapter34AmbientDialogues.ts`): «Ahora pasan
  en silencio, con la cabeza gacha. Mi mujer y yo apostamos a ver quién levanta la vista primero».
- El día 4 usa el principio de vecinos que no hablan y pensamientos del Doctor: dos líneas propias por tipo de persona
  (`ARTIFACT_PERSON_THOUGHTS`).
- La Bruja resuelve poco: «La atención. Antes se repartía entre las cosas. Ahora tiene dueño».
- **Las observaciones no son diagnósticos:** son 12 pares de líneas, sin entrada de notas ni registro. Si se quiere un
  Doctor que diagnostica con sus notas, hoy no hay mecánica que lo haga.
- No se comprobó si los días 1 y 2 siembran el artefacto; solo se vio la pista del día 3.
- El cambio de tono del último día es la mejor idea del proyecto, pero hoy no hay transición que lo anuncie salvo que sea
  de noche.

## 4. Compendio, recetas y coherencia

- `tests/book-matches-cases` comprueba que cada tratamiento que exige un caso aparece nombrado en el libro, en ES y EN.
- Verbos con poco uso: el mortero (2 recetas) y la renovación de herramientas (sumidero de monedas sin efecto jugable).
- Ilustraciones provisionales: el jarabe es copia del balsámico (la hierba machacada era otra copia temporal).
- Los textos nuevos de hoy están pendientes de revisión: `docs/TEXTOS_NUEVOS_ES_EN.md`.

## 5. Sonido y música

- **Existe y se usa:** 23 archivos. 4 pistas de día + intro; 3 tipos de pasos según suelo
  (`src/game/audio/footstepSurface.ts`); golpes de herrero y leñador por proximidad (`decorImpactSounds.ts`); efectos de
  interfaz y crafteo.
- **Comprobado:** las músicas nuevas de los días 2–4 no se han oído; todas con volumen 0,6; solo hay fundido de entrada
  desde el 18-nov.
- **Comprobado:** no hay música ni ambiente diferenciado por lugar, ni sonido ambiente (río, viento, aves, taberna), ni de
  puertas o transiciones.
- Ideas opcionales (propuestas): loops de ambiente por tipo de lugar, tema de botica y de noche, sonido corto al cambiar
  de escena.

## 6. Arte y presentación

- Estilo pixel art coherente por registros y assets; no se ha visto renderizado en conjunto.
- Peso: `public/` 233 MB, 89 PNG de más de 1 MB, fondos de hasta 4,2 MB (`new-world-map/mountain-path-background.png`);
  `.git` 346 MB. No se midió tiempo de carga ni se ejecutó `next build`.
- Escenas sin personas: en el día 3, 6 exteriores; en el 4, prácticamente todo.
- Reutilizar PNJ es intencional (`AGENTS.md`).
- Tres mejoras visuales de mayor impacto (opinión): poblar el día 4; comprimir los fondos grandes para la demo; cerrar los
  grabados provisionales.

## 7. Calidad como portfolio junior

**Demuestra bien:** 70 archivos de test (~18.000 líneas) sobre ~37.000 de código; herramientas propias (Decorator, editor
de colisiones con mover/escalar, visor de objetos, libro de pruebas); arquitectura de datos clara (composiciones por
capítulo con herencia, interacciones por id, resolvedor de historia encadenado); `AGENTS.md` y
`docs/AI_PROJECT_CONTEXT.md`; ES/EN en paralelo.

**Podría preocupar:** el README es el de `create-next-app`; no hay `npm test` (se usa `node --test tests/*.test.mjs`), ni
integración continua, ni licencia; `GameWorld.tsx` (~2.000 líneas) y `decorAssets.ts` (~2.500) concentran mucha lógica; el
flujo asistido por IA conviene explicarlo (qué decidió el autor y qué se delegó); un test rojo a fecha de hoy.

**Evidencias a preparar:** demo desplegada (imágenes comprimidas), vídeo de 2–3 min del ciclo completo, 6–8 capturas,
README real, página de decisiones de diseño, capturas de las herramientas en uso.

---

## Resumen ejecutivo

Base técnica y de herramientas sólida para un portfolio junior, y una idea narrativa fuerte (la inversión de tono del
último día). Falta lo que más importa al jugador: el día 4 es un esqueleto sin personas ni escena final alcanzable, y nadie
ha jugado los cuatro días seguidos. Los tres primeros días, según los tests, se pueden terminar.

## Puntuaciones (1–5)

| Aspecto | Nota | Justificación |
|---|---|---|
| Jugabilidad | 3 | Bucle completo y bien probado en datos; poca variedad entre días; nadie lo ha jugado |
| Claridad | 3 | Hay guía (panel R, libro, rumores), no verificada con una persona nueva |
| Dificultad | 3 | Baja y a prueba de callejones sin salida; puede frustrar por información dispersa |
| Narrativa | 3 | Buena preparación en el día 3; el cierre no es jugable hoy |
| Misterio | 2 | La idea es buena; en este estado el jugador no llega a vivirlo |
| Presentación | 4 | Estilo coherente; pesos altos y piezas provisionales |
| Calidad de portfolio | 4 | Tests, herramientas y documentación fuertes; faltan README y demo |

## Los cinco problemas que más perjudican la experiencia

1. El día 4 no es completable: una persona colocada, sin Bruja colocada.
2. Ninguna partida completa verificada, ni de cuatro días ni con QA humano.
3. Los vecinos del día 4 son pensamientos, no diagnósticos: no hay mecánica de notas.
4. Los días se parecen en mecánica; sin el día 4 es el mismo ciclo tres veces.
5. Sonido plano (una pista por día, sin ambiente ni transiciones), con músicas nuevas sin oír.

## Las cinco mejoras prioritarias (propuestas, no decisiones)

1. Colocar vecinos y Bruja en el día 4 y jugarlo entero. *Mediano.*
2. Una partida completa de 4 días con cronómetro y notas, por el autor y por su pareja. *Mediano.*
3. Dar al día 4 una mecánica ligera de notas (decisión narrativa del autor). *Mediano a grande.*
4. README real, demo desplegada, imágenes comprimidas y vídeo. *Pequeño a mediano.*
5. Pasada de audio: ambiente por tipo de lugar y sonido de transición. *Mediano.*

## Observaciones para la sesión de QA (sin pistas)

Que anote, con la hora:
- Cuánto tarda en cada día y el total, y cuándo se queda sin saber qué hacer (y qué hace entonces).
- El primer minuto: si entiende qué son el libro, el cofre, el panel de recados (R) y el mapa.
- Cada vez que dude de dónde sacar un ingrediente o piense que el juego no la deja hacer algo.
- Si pierde dinero o material y se queda sin poder avanzar, o cree haberlo hecho.
- Qué recuerda de cada paciente y si sabe por qué cada preparado era el correcto.
- Si algo parece raro: personas que se pisan, objetos tapados, salidas de escena que fallan, texto cortado o sin traducir.
- El cambio al día 4: qué siente y qué cree que ha pasado sin leer nada fuera del juego; si entiende qué miran los vecinos.
- Si la Bruja le resulta memorable y qué cree que debía aprender de ella.
- Sonido: qué le molesta, qué echa de menos, si la música cambia de día en día.
- Guardado: si encuentra «Continuar» y si al volver reanuda donde esperaba.

## Valoración franca

- **Para sentirse como un juego completo** faltan, por orden: el día 4 jugable de principio a fin, una partida real de
  comprobación y una capa de sonido que distinga los lugares.
- **Para presentarlo bien a una empresa:** un README que cuente qué es y cómo se ejecuta, una demo accesible sin instalar
  nada, un vídeo corto y una explicación breve de qué decidió el autor y qué se delegó.
