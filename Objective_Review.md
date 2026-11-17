# Unusual Plague: revisión crítica del estado actual (2026-11-17)

Revisión de solo lectura (este archivo es lo único que se ha creado; sin stage, commit ni push; sonidos excluidos).
Base: `AGENTS.md`, `CLAUDE.md`, `docs/AI_PROJECT_CONTEXT.md` y el código/tests citados en cada apartado.

**Cómo leer las etiquetas de evidencia**

| Etiqueta | Significa |
|---|---|
| **[C]** Código | Existe e implementado en el repositorio (comprobado leyéndolo) |
| **[T]** Test | Además lo cubre un test que pasa hoy (`node --test tests/*.test.mjs`: 61 archivos OK; `tsc` y `eslint` sin errores). Los tests son **comprobaciones de datos y de lógica**, no una partida jugada en el navegador |
| **[J]** Jugar | Hay que jugarlo o verlo en pantalla para saber si funciona: **nada de esta revisión se ha validado en navegador** |
| **[I]** Idea | Solo está en un documento, en un borrador o en este informe |

Estado del repositorio: último commit `7b52d8d`. Hay **74 entradas sin commitear** (47 modificadas, 9 borradas, 18 nuevas;
unas 56 archivos tocados): todo lo de hoy (ediciones de NPC, cuervos y obstáculos, Día 3, noches de `chapter-4-night`).
Es un riesgo en sí mismo (ver §6).

---

## 0. Valoración general (la respuesta corta)

**Objetivo acordado con Kilian:** «versión casi terminada» = **jugable de principio a fin** (los 4 días sin bloqueos, textos
revisados, recorrido probado por su pareja), no una versión de portfolio pulida.

| Área | Estado real | Confianza |
|---|---|---|
| Motor, escenas, colisiones, Decorator, herramientas dev | Maduro | Alta [C][T] |
| Día 1 | Completo y la mejor pulida | Alta en datos [T], media en experiencia [J] |
| Día 2 | Completo (investigación del agricultor, 4 recados, apertura y cierre) | Alta en datos [T], media en experiencia [J] |
| Día 3 | **Esqueleto completo, pero no jugable hoy**: faltan 2 pacientes colocados, la herencia del Día 2 deja personas que sobran y 20 personas no hablan | Media |
| Día 4 | **Cáscara**: empieza de noche, hay final y pantalla FIN, pero **no hay ninguna persona colocada** y las "poses con artefacto" no se usan en ninguna escena | Media-baja |
| Libro / Compendio | Funciona y es bonito; hay **incoherencias comprobables** con los casos (§3) | Alta |
| Economía | Sin callejones **en el modelo de datos**; el Día 3 es plano; el inventario no está modelado | Media |
| Narrativa ES/EN | Mucho texto nuevo **pendiente de tu revisión** (marcado en cada archivo) | Alta |

**Valoración global.** El juego es *técnicamente sólido* (arquitectura limpia, 61 tests, herramientas de autoría excelentes) y
*narrativamente prometedor*, pero a día de hoy **solo los Días 1 y 2 son una experiencia comprobable de principio a fin**.
Estimación prudente de completitud respecto a «jugable de principio a fin»: **~70 %** (estructura y sistemas ~90 %, contenido
colocado y revisado ~55 %, experiencia verificada jugando ~40 %). La parte que falta **no es código**: son colocaciones en el
Decorator, imágenes nocturnas, textos por revisar y, sobre todo, **jugarlo entero**.

---

## 1. Economía de cada día

Fuentes: `src/game/money/payments.ts`, `src/game/money/money.ts`, `src/game/shop/shops.ts`, `src/game/crafting/recipes.ts`,
`src/game/dialogue/chapter2Errands.ts`, `src/game/dialogue/npcTrades.ts`, `tests/economy-no-deadlock.test.mjs`,
`docs/EconomyReview.md`.

### 1.1 Números reales (código)

- Monedas iniciales: **6** (`money.ts`). Pagos de pacientes: Día 1 = 4 + 4 + 7 = **15**; Día 2 = 4 + 6 + 7 = **17**;
  Día 3 = 3 + 4 + 6 = **13**. Recados: pescador 3 (Día 1); Día 2 = 9 + 2 (+1 azúcar) + 9 + 8 (cantero) = **28**.
- **Máximo posible hasta el final del Día 3: ~82** monedas. **Máximo gastable en tienda: 60** (sal 8, azúcar 15, naranja 3,
  cebolla 6, ajo 5, tela 10, vela 1, hueso 9, grasa 3), con topes acumulados por día (`capByChapter` en `shops.ts`).
- Forzado por los casos (aprox.): Día 1 ≈ 6 (2 telas + 1 sal = justo lo que tienes), Día 2 ≈ 8 (tela, azúcar, naranja), Día 3 ≈ 15
  (ajo 5, azúcar 5, sal 2, tela 2, naranja 1).
- Inventario: **8 casillas** (`INVENTORY_CAPACITY` en `src/game/inventory/inventory.ts`) +1 de la mochila de la costurera (Día 2).
  Hay **2 frascos** y el juego devuelve el frasco al usar el agua.

### 1.2 ¿Se puede quedar bloqueado?

- **Dinero y orden de compras [T]:** `tests/economy-no-deadlock.test.mjs` explora ~34.000 estados (cualquier orden de compra,
  curar y hacer recados) y comprueba que siempre se puede terminar los Días 1-3. Los topes diarios y los +6 de pagos
  existen **por ese test**: son consecuencia de un modelo, no de una partida.
- **Límite del modelo (comprobado en el propio archivo):** «Only what the merchant sells is tracked. A data check, not a played
  game.» No modela **capacidad de inventario**, ni recoger objetos del mundo, ni ir con las manos llenas. El inventario es de 8:
  en el Día 3 puede haber en la bolsa hasta 6 preparados + ingredientes + 2 frascos. **Riesgo [J]:** llegar a un NPC con la bolsa
  llena (el juego avisa «no cabe», pero hay que jugarlo para ver si frustra).
- **Orden de acciones:** los suministros (miel, harina, alcohol) solo se entregan con el caso **ya examinado**
  (`getActiveMissingIngredients` en `chapter2Supplies.ts`). No bloquea, pero obliga a examinar a los tres antes de recoger.
  **Día 4** no tiene economía ni test.
- **Crafteo limitado por los casos del día** [T] (`tests/day-crafting-limits.test.mjs`): el juego impide fabricar lo que no hace
  falta y muestra «Ya tengo todos los que necesito». Está bien pensado, pero reduce la experimentación (§3).

### 1.3 Lo obligatorio, abusivo, confuso o ajustado

- **Ajustado a propósito:** los pagos y los topes están calibrados para que el jugador que compra todo no se quede corto
  (`payments.ts`: «+6 coins… let ONE spare unit… be sold»). Es frágil: **cualquier cambio de un precio o de un pago obliga a
  repasar el test**. Cualquier receta/recado nuevo (Día 3) rompe el equilibrio si no se repasa.
- **Día 3 es plano:** entra 13 y lo obligatorio cuesta ~15; si se hicieron los recados del Día 2 (28) el jugador termina el Día 3 con
  **~30 monedas sin uso** (el recorrido de `tests/day3-playthrough.test.mjs` acaba con 32). El dinero deja de ser una decisión.
  **Decisión de Kilian (hoy):** que sobren ~10 → hay que rediseñar con recados y repasar el test.
- **Naranja a 1 moneda con 3 unidades** y **ajo a 5 con 1 unidad**: el ajo es una compra obligatoria cara en el día en que el
  jugador más sobrado va. Es coherente como «cuello de botella» pero **conviene jugarlo [J]** para ver si se siente injusto o trivial.
- **Compras confusas:** el mercader de la plaza vende solo sal y azúcar; telas, naranja, cebolla, ajo, hueso, grasa y vela están en el
  Mercado (3 puestos). **Pistas desactualizadas comprobadas:** `src/game/items/items.ts` líneas ~94 y ~264 dicen «Quizá el mercader
  tenga [tela]» y «El mercader de la plaza vende velas», lo que ya no es cierto (la tela y la vela las vende el puesto de telas).

### 1.4 Coherencia de fuentes y usos entre días

- **Bien:** hueso, hierba y menta tienen varias fuentes (bruja del claro, carnicería, bosque); la miel viene del apicultor; la harina
  del saco de la panadera; el alcohol del tabernero. El test de recorrido del Día 3 confirma que **ninguna receta del Día 3 necesita
  nada de la mina** (que ahora está cerrada).
- **Recetas [C]:** hay **23** (`recipes.ts`). Desde el commit `7b52d8d` se retiraron las tres que no usaba nadie (crema de setas,
  jarabe cítrico y trocear la seta de pino), así que **todas las recetas actuales tienen uso** (casos o recados del Día 2).
  **Consecuencia comprobada:** dos de los recados que se aprobaron para el Día 3 (crema de setas y jarabe cítrico, en
  `docs/DIAS_2_3_UTILIDAD_Y_RECADOS.md`) **dependen de recetas que ya no existen**: hay que reponerlas o sustituirlos. La seta de pino
  hoy solo sirve para el presagio de la bruja.
- Las dolencias **quemadura** e **insomnio** no tienen paciente (`src/game/book/ailments.ts`).
- **Hueco documentado y no resuelto:** la leche solo se consigue por un trueque del Día 1 con la granjera; el insomnio la necesita
  el Día 3 (decidido hoy: la granjera la vuelve a dar).

### 1.5 Documentado frente a provisional

| Decisión | Dónde está | Estado |
|---|---|---|
| Moneda de cobre, pagos por paciente, tienda solo de lo necesario | `docs/EconomyReview.md`, `payments.ts` | Documentado y aprobado |
| Topes diarios, un sobrante de sal/hueso/cebolla, naranja comprada | `shops.ts`, `docs/EconomyReview.md` | Documentado, **sin jugar [J]** |
| Pagos 4/4/7, 4/6/7, 3/4/6 | `payments.ts` | Provisional (los documentos viejos aún dicen 3/4/6 y 4 monedas iniciales) |
| Recados del Día 3, dinero final ~10 | `docs/DAY3_ANALISIS.md` | Idea [I], aprobada en pregunta, sin construir |

**Deriva de documentación (comprobada):** `docs/ECONOMY_REVIEW_NOV13.md` (4 monedas, pagos 6/8/11), `docs/INTERACCIONES_DIAS_1_2_3.md`
y `docs/PARA_PROBAR_DIA1_DIA2.md` describen números anteriores. Si tu pareja prueba con esos documentos, verá cifras distintas.

---

## 2. Riqueza del mundo, decoración y NPC

Fuente: población real calculada de `getComposition()` (`src/game/compositions/index.ts`) por escena y día
(p = personas, a = animales, o = objetos, v = vegetación), más `src/game/new-world-map/newWorldScenes.ts`.

| Escena | Día 1 | Día 2 | Día 3 | Día 4 |
|---|---|---|---|---|
| Calle botica | 1p | 2p | 2p | **0** |
| Plaza | 3p 1a 2o | 4p 1a 2o | **10p** 1a 2o | **0** |
| Calle taberna | 2p | 2p | 4p | **0** |
| Calle panadería / interior | 1p / 1p | 2p / 1p | 3p / 1p | **0** |
| Calle herrería | 2p | **0** | 2p | **0** |
| Camino de la mina | 1p | **0** (1a) | 3p 2a | **0** |
| Cantera | 3p | 2p | 4p | **0** |
| Mercado | 2p 2a 3o | 0p 2a 3o | 0p 2a 3o | **0** |
| Granero | **0** | 2p | 2p | **0** |
| Bosque / claro | 2p / 0p | 1p / 0p | 1p / 1p | **0** |
| Bosque profundo | **0** | **0** | **0** | **0** |
| Cueva natural | 0 | 1p 1a | 1p 1a | 0 |

### 2.1 Lo que se ve y es comprobable

- **Día 4 tiene 0 personas colocadas en todo el mundo**: `src/game/compositions/artifacts.ts` es `[]`. Solo se ve el entorno
  compartido (arbustos y velas). Las 8 poses con artefacto existen como assets (`decorAssets.ts`: `woman-sweeping`, `fisherman`,
  `bartender`, `baker`, `villager-sitting`, `woodcutter`, `blacksmith`, `woman-washing-clothes`, cada una `-smartphone`, 2 frames,
  «ASSETS ONLY: nothing in the chapters uses them yet») pero **no se usan en ninguna escena**. [C]
- **Bosque profundo** (`forest-deep`) está registrado pero sin geometría, salidas ni llegadas (`exits: []`, `arrivals: {}`); el
  leñador vive en `forest`. Es una escena huérfana: o se conecta o se retira del mapa/Decorator. [C]
- **Desequilibrio entre días:** la plaza pasa de 4 a 10 personas en el Día 3 (6 rezando/sentadas sin interacción) mientras la calle
  de la herrería queda con **0** en el Día 2 y el camino de la mina con 0. «Calle vacía» es un patrón que aparece y desaparece. [C]
- **Mercado:** puestos animados y con tienda, brillo y «E Comprar», cartel de interacción pequeño. Falta que se **vea lleno [J]**: en
  los Días 2-3 no hay clientes (decisión de hoy: los puestos son fijos, la gente de delante no).
- **Herencia sin borrado (comprobado):** el Día 3 hereda todo el Día 2 y no se puede quitar. Hoy en el Día 3 hay **dos herreros** en
  la herrería, el **agricultor enfermo tumbado** en el granero y el **leñador agotado** en el tocón (pacientes ya curados el Día 2).
  Además 20 personas colocadas en el Día 3 **no tienen interacción** (el Día 2 tenía 0).

### 2.2 Reutilización de NPC

- **Bien:** `AGENTS.md` pide reutilizar y el proyecto lo hace: panadera, herrero, tabernero, leñador… cambian de pose/estado entre días
  (poses `*-day2-*`, `*-smartphone`). Las ediciones de hoy mantienen identidades.
- **Riesgo [J]:** hay **varios hombres/mujeres de aldeano** (`villager-man-01/02`, `-v2`, `woman-01/02`, `-v2`) con rasgos parecidos
  repartidos por muchas escenas. «Quién es quién» depende de que cada uno tenga un oficio o un gesto; los que son solo «vecino» se
  confunden. Hay 4 originales y 4 versiones mejoradas pendientes de que elijas cuáles sustituyen.
- **Los tres picapedreros** (taburete, banco, pala) más el descansando y el de la pala del molino son seis instancias para una
  profesión; solo uno es paciente. Puede leerse como cuadrilla o como repetición.

### 2.3 Qué aportaría más con menos trabajo

1. **Que cada persona colocada tenga voz** (2-3 líneas) antes de añadir más personajes: es lo que hace que un lugar parezca habitado.
2. **Completar el Día 4** con las poses que **ya existen**; no crear sprites nuevos.
3. **Rellenar escenas vacías** con gente que ya existe (herrería Día 2, camino de la mina Día 2, mercado Días 2-3).
4. **Decidir `forest-deep`** (conectar o retirar).
5. **No añadir NPC nuevos** hasta cerrar lo anterior (ya hay 20 sin uso en el Día 3).

---

## 3. Libro, recetas y variedad de acciones

Fuentes: `src/game/book/` (`ailments.ts`, `bookPages.ts`, `dynamicPages.ts`, `preparations.ts`), `src/game/crafting/recipes.ts`,
`src/game/items/items.ts`, `src/game/patients/`.

### 3.1 Qué hace bien el Compendio [C][T]

- Cuatro pestañas: **Pacientes** (dinámica, desde los casos), **Dolencias** (10, texto fijo ES/EN), **Ingredientes** (5 dobles páginas
  pintadas con 20 ingredientes, ES/EN) y **Preparados** (dinámica, recetas conocidas + stock). La «tabla de cortar» y el mortero
  tienen su propio texto en recetas.
- Las recetas se descubren por los casos (`revealsRecipeIds`), así que el libro **crece con lo que el jugador ve**. Buen principio.

### 3.2 Contradicciones y huecos comprobados

| Dónde | Qué dice el libro | Qué exige el juego |
|---|---|---|
| Herida infectada (`ailments.ts`) | vendaje desinfectado, y ungüento para las avanzadas | **Día 2** (herrero): cataplasma + compresa medicinal (ninguna aparece en el libro) |
| Agotamiento | bebida cítrica | **Día 2** (leñador): bebida cítrica **+ infusión de menta** (la menta no se nombra) |
| Escorbuto | bebida cítrica + «alimentos nutritivos» | **Día 3**: bebida cítrica + **caldo de huesos** (no se nombra) |
| Insomnio / Quemadura | tratamiento escrito | No hay paciente que lo ejercite |
| Ingredientes | 20 pintados | Faltan **vela** (existe como objeto) y cualquier ingrediente nuevo que añadas; «Hongo» en el libro, «Hongo de cueva» en `items.ts` |
| Pistas de procedencia | `items.ts`: «el mercader vende tela/vela» | Hoy lo vende el **mercado** |

Lo de las dolencias puede ser intencional («el libro describe, no define tratamiento»: comentario de `preparations.ts`), pero para el
jugador es **confuso**: lee Dolencias → «herida infectada» y el caso de hoy le pide otra cosa. **[J]** para ver cuánto le estorba.
- **Grabados provisionales:** `docs/PARA_PROBAR_DIA1_DIA2.md` admite que los grabados de preparados nuevos «son provisionales (se
  repiten)»; `ailments.ts` dice «the engravings are provisional» para quemadura, fractura e insomnio. [C]
- **Diagnóstico regala la respuesta** (`DIAGNOSIS_SYMPTOMS` en `diagnosis.ts`): con 10 dolencias, el texto de síntomas del Día 3
  contiene casi la palabra («encías que sangran… pan duro y cecina» = escorbuto) y fallar no tiene coste (`checkDiagnosis` devuelve
  «retry»). El libro y el diagnóstico existen, pero **diagnosticar no es una decisión**. [C]

### 3.3 Variedad de acciones

Verbos hoy [C]: caminar/correr, hablar, examinar, diagnosticar, recoger, comprar, machacar, trocear, mezclar a mano, cocinar,
entregar, dormir. Es un buen conjunto de **verbos**, pero el **ciclo por día es el mismo** (examinar → reunir → fabricar → entregar) y
solo el Día 2 (investigación del agricultor) rompe el patrón. El Día 3 es el más repetido (recetas ya vistas). Los recados
voluntarios son el mejor antídoto (variedad, dinero), y solo existen en los Días 1-2.

---

## 4. Intuición y experiencia de juego

Fuentes: `src/game/tutorial/`, `src/game/objectives/objectives.ts`, `src/game/world/GameWorld.tsx`, `src/game/ui/`, tests de tutorial
(`tests/tutorial-inventory.test.mjs`, `tests/start-experience.test.mjs`, `tests/fast-travel.test.mjs`).

### 4.1 Lo que ayuda al jugador [C][T]

- **Tutorial** de máquina de estados que solo avanza con eventos reales (libro, mapa, movimiento, cofre, frasco), notas centradas
  y anchas, botón de viaje rápido que parpadea con flecha hasta que se usa.
- **Panel de recados (R)** con objetivos; **«!»** sobre personajes con novedades; **brillo** en puestos del mercado; mensajes del
  Doctor cuando no hace falta fabricar algo; **mapa** con iconos; **teclas configurables**.

### 4.2 Lo que puede desorientar (hipótesis a validar jugando [J])

- Qué se puede **examinar/recoger/comprar** depende de iconos y de que el jugador lea el diálogo. No hay ninguna indicación común
  para «aquí hay una persona con la que hablar» frente a «es decorado» (20 casos en el Día 3).
- **Interfaces que compiten:** libro (Q), mapa (Tab), recados (R), inventario, cofre, mesa de crafteo y diagnóstico. El Día 1 enseña
  las tres primeras; no hay evidencia de que el jugador sepa que existe el panel R **entre** días.
- **Día 3 sin objetivo guiado** más allá de los casos; los suministros condicionados al examen son un callejón sin pista.
- **Mina cerrada (Día 3):** el guardia lo explica, pero el aviso al tocar la puerta es un texto genérico. **[J]**.
- **Bolsa llena:** el aviso existe pero no se ha probado en una partida real del Día 3.

### 4.3 Evidencia de código y tests frente a lo que exige una partida real

| Qué | Evidencia |
|---|---|
| Lógica de cada día (casos, pagos, suministros, cierre) | **[T]** `tests/day1-solvable`, `day2-playthrough`, `day3-playthrough`, `economy-no-deadlock` |
| Alcanzabilidad de zonas (colliders, salidas, spawns) | **[T]** `tests/reachability.test.mjs`, `new-world-map.test.mjs` |
| Tutorial y primera experiencia | **[T]** + **[J]** |
| **Una partida completa en el navegador, de principio a fin** | **No hay evidencia en el repositorio.** Los «recorridos» son scripts que llaman a los manejadores del juego; no pasan por el DOM, la cámara, el sonido o la interfaz |
| Rendimiento con pinturas de 3-4 MB | **[J]** (`docs/ROADMAP_NEXT.md` lo señala; no hay medición) |

---

## 5. Capítulo 4: la noche de los artefactos

### 5.1 Estado real

- **Hecho [C]:** el día 4 empieza en la habitación del Doctor de noche, la cadena de capítulos 1→2→3→4 existe
  (`src/game/world/chapterStart.ts`), las pinturas nocturnas están en `public/game/chapter-4-night/` (8 exteriores/interiores;
  faltan plaza, granja, molino, camino de la mina, cantera, claro, mercado, bosque profundo, que usan un filtro oscuro),
  el objetivo «Ir a ver a la bruja» (`objectives.ts`), la casita se abre (`lockedDoors.ts`), el final con la pluma y la pantalla FIN
  (`src/game/dialogue/chapter4Dialogues.ts`, `EndCard`).
- **No hecho [C]:** ninguna persona colocada (`artifacts.ts` vacío); los 4 pensamientos genéricos de «no ha levantado la vista» son
  **iguales para cualquiera** (`ARTIFACT_THOUGHTS`, ids `chapter4.artifact.*`); ninguna mecánica de observación o diagnóstico;
  obstáculos nocturnos (carreta, troncos, árbol, piedras, barreras) existen como assets pero sin colocar; la ilustración de
  cierre es `doctor-writing-night` (provisional); no hay economía ni test de recorrido del Día 4. Hay `tests/day4-night.test.mjs`,
  que comprueba tamaños de pinturas, puerta cerrada y la escena de la bruja; **no un recorrido**.

### 5.2 La dirección de Kilian frente a lo que existe

La dirección (vecinos absorbidos, sin diálogo, el Doctor los observa y «diagnostica» como casos) **encaja bien** con lo que ya hay:

| Pieza de la dirección | Qué hay que la sostiene |
|---|---|
| Vecinos «conocidos» absorbidos | Los **mismos oficios** de los Días 1-3 y **8 poses con artefacto** ya dibujadas |
| El Doctor observa y diagnostica | El **Compendio** (pestaña Pacientes) y el esquema `PatientCaseDefinition` con `requiredTreatments: []` ya se usa en el **agricultor del Día 2** (investigación sin tratamiento) |
| Contraste con su rutina | Los Días 1-3 han **mostrado** esa rutina: herrero que martillea, panadera que amasa, pescador con su hilo, leñador con su tocón |
| La Bruja y el resto de la pista | Cuervos y pluma (Día 3), final de la casita ya escrito, `WITCH_FINAL_INTERACTION_ID` |
| Sin moralizar | El tono del juego (curiosidad del Doctor, bruja evasiva) ya evita el «la tecnología es mala» |

**Evaluación crítica.** La dirección es buena, pero **tal como está implementado hoy no la sostiene**: el jugador recorrería un pueblo
vacío (cero personas) y, si se colocaran, obtendría cuatro frases idénticas. El mayor riesgo narrativo es que las ocho interacciones se
sientan iguales. La solución no es una mecánica grande: es **variar qué mira el Doctor** y **qué hay en el entorno** en cada vecino.

### 5.3 Estructura jugable propuesta (SUGERENCIAS, no canon)

Respetando las respuestas de Kilian: observación en el Compendio **sin elegir dolencia**, pistas por contraste con la rutina,
detalles físicos, huellas de los días anteriores y rastro de la Bruja, y cierre en la casita **mitad abierto**.

**Estructura en 5 pasos**

1. **Despertar.** El Doctor se despierta de noche (ya existe). Objetivo vago en el panel R. *Jugador:* sale de la habitación y de la
   botica. *Sistema:* existente.
2. **El pueblo (6 observaciones).** Paseo por la calle botica → plaza → calle panadería → calle taberna → calle herrería → río. En
   cada una hay **un vecino absorbido** (poses `*-smartphone`). *Jugador:* se acerca, «Observa» y se abre una **ficha en la pestaña
   Pacientes** con el **mismo formato** que un caso, pero sin tratamiento ni diagnóstico a elegir.
3. **Síntesis.** Tras 3-4 observaciones, el Doctor «junta» lo que ha visto en una ficha final del Compendio (un patrón, no un nombre):
   a la misma hora, con la misma luz, sin mirar a nadie. El panel R pasa de vago a «Ir a ver a la bruja».
4. **El camino cerrado.** Los obstáculos (carreta incendiada, troncos, árbol caído, piedras, barreras mágicas) **cierran** granja, mina
   y bosque ancho; el camino a la casita queda abierto (tú los colocas en el Decorator).
5. **La casita.** El final ya escrito: la Bruja, la pluma (no se gasta) y el cierre; mitad abierto.

**Cuántos vecinos y diagnósticos.** **6 vecinos observables** (de las 8 poses; 2 se quedan de decorado como «relleno» sin ficha) y
**1 ficha de síntesis**. Con menos de 5 la secuencia se siente corta; con 8 la variedad es imposible de mantener en el plazo.

**Cómo variar las observaciones (que no sean ocho iguales).** Cada vecino enseña **un eje distinto**:

| Vecino (pose) | Eje de la observación | Qué descubre el Doctor sin palabras |
|---|---|---|
| Mujer que barría (`woman-sweeping`) | Huella del Día 1 | Escoba caída; barre un polvo que ya no hay |
| Pescador (`fisherman`) | Rutina rota | Su hilo flota sin vigilar; el cubo vacío |
| Herrero (`blacksmith`) | Contraste con el Día 2 | La mano ya curada, el martillo en el suelo |
| Panadera (`baker`) | Detalle físico | El pulgar repite el mismo gesto; la masa sin tocar |
| Tabernero (`bartender`) | Rutina rota | La jarra rebosa; nadie pide |
| Leñador o lavandera (`woodcutter` / `woman-washing-clothes`) | Rastro de la Bruja | Una pluma negra a sus pies; un cuervo mirando |

Además **dos de ellos** necesitan dos pasos («mira las manos» y luego «mira lo que tiene alrededor»), y **uno** es opcional.

**Qué puede descubrir sin diálogo.** Un patrón (todos miran desde la misma altura, con luz fría, sin pestañear), una contraposición con
sus oficios y un **rastro de la Bruja** (plumas y cuervos que *miran al pueblo*). Los cuervos que se pusieron en el claro el Día 3
sirven de motivo: «los cuervos avisan cuando algo cambia de sitio» (ya está en el final escrito).

**Cierre y papel de la Bruja** (sugerencia, no canon): el cierre ya escrito (casita, pluma, conversación, mitad abierto). La Bruja
**no cura ni explica por completo**; devuelve al Doctor su propia pregunta. El Doctor cierra con un último pensamiento.

**Sistemas nuevos imprescindibles (solo 3, pequeños)**

| Sistema | Por qué es imprescindible | Tamaño |
|---|---|---|
| «Observar» sin pasar por la pantalla de diagnóstico (marca el caso como examinado sin elegir dolencia) | La pantalla de diagnóstico obliga a elegir una de las 10 dolencias | Pequeño |
| Texto de ficha en la pestaña Pacientes que no pida tratamiento | Hoy se espera `requiredTreatments`; el agricultor del Día 2 ya funciona con `[]` | Muy pequeño |
| El objetivo del panel R cambia tras N observaciones | Sin esto el jugador no sabe cuándo ir a la casita | Pequeño |

**Qué no recomiendo:** un tablero de artefactos, un minijuego de «arrebatar» el objeto, o una pantalla de diagnóstico con estados
nuevos. Añaden mecánica y no resuelven el riesgo real (variedad de las observaciones).

---

## 6. Los 5 riesgos más importantes (por impacto)

1. **El Día 4 es una cáscara y el Día 3 no es jugable hoy.** Sin personas en `artifacts.ts`, sin los dos pacientes colocados y con la
   herencia sin borrado, no se puede completar el juego. Es lo que más pesa en el plazo y **depende de las colocaciones de Kilian**
   en el Decorator. *(Defecto comprobado.)*
2. **No hay ninguna partida completa verificada en navegador** de los Días 2-4. Los recorridos son scripts de datos; no sabemos cuánto
   cuestan la cámara, el scroll, los avisos de «bolsa llena», el panel R o las pinturas de 3-4 MB. *(Hipótesis que se valida jugando.)*
3. **74 entradas sin commit** (todo lo de hoy y buena parte de ayer). Un borrado, un `git checkout` o un cambio de rama pierde horas
   de trabajo. *(Hecho comprobado.)* Requiere que Kilian autorice un commit.
4. **Deriva de textos y documentos**: el libro y los casos se contradicen (herida, agotamiento, escorbuto), las pistas de `items.ts`
   nombran al mercader equivocado, y los documentos de economía/pruebas describen cifras viejas. Para una QA de otra persona es la
   primera cosa que se nota. *(Defecto comprobado; su impacto es hipótesis.)*
5. **Economía y herencia frágiles**: la economía sólo está validada por un modelo que **no incluye el inventario**, cualquier cambio
   de precio rompe el equilibrio, y la herencia Día N → Día N+1 genera duplicados (dos herreros, enfermos que ya están curados).
   *(Comprobado el modelo y la herencia; el impacto en la experiencia es hipótesis.)*

---

## 7. Lo que falta, priorizado

### 7.1 Imprescindible para una versión «jugable de principio a fin»

1. **Colocar** (Decorator, tú): mujer del plumero, minero del camino, pistas del Día 3; **las poses con artefacto del Día 4** y los
   obstáculos nocturnos; (opcional pero casi imprescindible) los clientes del mercado.
2. **Lista de «no heredar»** del Día 3 (herrero herido, agricultor enfermo, leñador agotado) y revisar si hay más en el Día 4.
3. **Voz a las 20 personas mudas del Día 3** (2-3 líneas ES/EN) y a las personas del Día 4 (una ficha cada una).
4. **Día 4 jugable**: observación en el Compendio, ficha de síntesis, objetivo que cambia, cierre con la pluma. Test de recorrido.
5. **Recados del Día 3** (los 5 acordados; **2 necesitan receta nueva o sustituto**) + insomnio, ajustando pagos para que sobren ~10, y **repasar `economy-no-deadlock`**.
6. **Arreglar las incoherencias comprobables** (libro vs. casos, pistas del mercader, documentos con cifras viejas).
7. **Partida completa de los 4 días, en navegador, con otra persona** (tu pareja), y corregir lo que salga.
8. **Autorizar un commit** (con `git add -A . ':!presentation'`) para no perder el trabajo.

### 7.2 Mejora opcional

- Noches para plaza, granja, molino, camino de la mina, cantera, claro y mercado (hoy filtro oscuro).
- Elegir qué aldeanos mejorados sustituyen a los originales; pulir `forest-deep` (conectar o retirar).
- Grabados definitivos del libro; ilustración final nocturna.
- Diagnóstico menos obvio (síntomas) y que fallar cueste algo (pista, no castigo).
- Más recados con las personas nuevas; reponer 2 recetas (crema de setas, jarabe cítrico) o sustituir esos recados.
- Pantalla de ajustes, build de producción y medición de peso de imágenes.

---

## 8. Qué partes requieren que Kilian juegue o revise visualmente

| Qué | Por qué | Prioridad |
|---|---|---|
| **Jugar el Día 1 y el Día 2 enteros en el navegador** | Todos los «recorridos» son scripts; nadie ha visto todavía el ritmo | Alta |
| **Jugar el Día 3 cuando esté colocado** | Examinar → reunir → entregar: ritmo, bolsa llena, mina cerrada | Alta |
| **Mercado y calles nuevas** | Zoom 1.7, colliders, brillo, «E Comprar», cartel pequeño | Alta |
| **Pinturas nocturnas** (8 hoy) y el filtro del resto | Coherencia visual y carga | Media |
| **Sprites editados hoy** (cama del marido, hombre de espaldas, apicultor, minero, granjero, bruja, gato, cuervos, obstáculos) | Verlos **dentro de la escena**, no en la galería | Media |
| **Textos nuevos ES/EN** (Día 3, Día 4, mercado, recados) | Están marcados «awaiting Kilian's review» | Alta |
| **QA de tu pareja** sin guía | Lo que a ti no te parece raro | Alta |

---

## 9. Estimación prudente del trabajo restante

Unidades: **sesión** = una sesión larga como las de estos días (~3-4 h de trabajo mío); las horas de Kilian son tiempo de Decorator,
revisión de texto y juego. **Las estimaciones son rangos amplios**: la mayor incertidumbre es el tiempo de colocación y de QA.

| Bloque | Trabajo mío | Trabajo de Kilian | Incertidumbre |
|---|---|---|---|
| A. Desbloquear el Día 3 (herencia, 2 pacientes, interacciones, test) | 0,5-1 sesión | 1-1,5 h (colocar) | Baja |
| B. Voces de las 20 personas y del Día 4 (~70-90 líneas ES/EN) | 1-1,5 sesiones | 1,5-2 h (revisar) | **Media** (revisión) |
| C. Recados del Día 3 (5), insomnio, economía y test | 1,5-2,5 sesiones | 1 h | **Media-alta** (equilibrio) |
| D. Día 4 jugable (observación, ficha de síntesis, objetivo, test) | 1-1,5 sesiones | 2-3 h (colocar poses, obstáculos y noches) | **Alta** (depende de la colocación) |
| E. Pistas del Día 3 y diagnóstico menos obvio | 0,5-1 sesión | 0,5-1 h | Media |
| F. Incoherencias (libro, pistas, documentos) | 0,5 sesión | 0,5 h | Baja |
| G. Commit, build de producción, rendimiento | 0,3-0,5 sesión | 0,2 h | Baja |
| H. **Partidas completas, QA y correcciones** | 1-2 sesiones | **4-6 h (con tu pareja)** | **Muy alta** (lo que salga) |
| **Total estimado** | **~6-10 sesiones** | **~11-15 h** | — |

**Lectura honesta del plazo (19 de noviembre).** Con 2-3 h al día por tu parte, el camino crítico es **tus colocaciones y la QA**,
no el código. Es **posible** llegar a «jugable de principio a fin» si en 17-18 de noviembre se hacen A-D y se reserva el 18-19 para H;
es **probable** que algo de E-G quede como mejora opcional. Si se estrecha el plazo, el orden de recorte sugerido es: insomnio, pistas
del Día 3, voz de las personas del Día 3 que no están en el camino principal, recados extra; **nunca** el Día 4 jugable ni la partida
completa.

---

## 10. Qué es defecto comprobado y qué es hipótesis

| Comprobado leyendo el repositorio | Hipótesis que hay que validar jugando |
|---|---|
| `artifacts.ts` vacío; `forest-deep` sin geometría; 20 personas sin interacción en el Día 3; herencia que deja 2 herreros, agricultor y leñador | Que 6 observaciones sean suficientes y no cansen |
| Incoherencias libro / casos; pistas del mercader desactualizadas; documentos con cifras viejas | Que la incoherencia del libro confunda de verdad |
| El modelo de economía no incluye el inventario; Día 3 termina con ~30 monedas | Que el ajo a 5 monedas o la bolsa llena frustren |
| 74 entradas sin commit | Que la carga de las pinturas de 3-4 MB sea un problema |
| No hay recorrido en navegador en el repositorio | Que el ritmo del Día 3 (11 escenas) sea excesivo |

*Fin del informe. Nada de lo anterior se ha implementado como parte de esta revisión.*
