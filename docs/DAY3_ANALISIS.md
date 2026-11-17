# Día 3: análisis a fondo (2026-11-17)

Para Kilian. **Análisis y preguntas; nada de esto está implementado.** Sale de los datos reales del juego
(composición del Día 3 que exportaste hoy, pacientes, recetas, tienda, pagos, diálogos, tests).

## 0. Veredicto en tres líneas

1. **El esqueleto del Día 3 está completo y es jugable a nivel de datos** (3 pacientes, bruja, cierre, tienda, test de
   partida completa). Pero es el día **más plano** de los cuatro: ninguna mecánica nueva, ningún recado, y 20 personas
   colocadas que no dicen nada.
2. **Hay dos bloqueantes**: la mujer del plumero y el minero del camino **no están colocados** (sin ellos el día no se
   cierra), y hay **personas del Día 2 que se heredan por error** (dos herreros, el agricultor enfermo tumbado...).
3. Lo que más sube la calidad por hora de trabajo: **(a)** dar voz a las 20 personas mudas, **(b)** los 3 recados ya diseñados,
   **(c)** meter el motivo del Día 3 («la gente mira algo pequeño») en los pacientes y en la bruja con los cuervos,
   **(d)** una pequeña investigación por paciente.

## 1. Dónde está cada día (datos)

| | Día 1 | Día 2 | **Día 3** |
|---|---|---|---|
| Pacientes | 3 | 3 | 3 (2 sin colocar) |
| Mecánica nueva | tutorial, mortero, tabla de cortar, cocina | **investigación del agricultor** (muestra, análisis, bruja de la cueva), recados, suministros | **ninguna** |
| Preparado nuevo para el jugador | todos | los del agricultor, jarabes de los recados | **1** (jarabe balsámico: ajo machacado) |
| Recados voluntarios | 1 (pescador) | 4 (cantero, anciano, vecina, hombre sentado) | **0** (3 diseñados, sin construir) |
| Gente colocada que habla | todos | 26 de 26 | 28 hablan, **20 mudos** |
| Apertura | interludio + tutorial | pie de foto del mensajero | **ninguna** (despierta en la habitación) |
| Cierre | cena | chimenea | «escribiendo» + 3 pensamientos |
| Tienda | sal, tela | + azúcar, cebolla, hueso, vela | + **ajo** (1 unidad, 5 monedas) |

Recetas de los pacientes del Día 3: infusión de menta (ya del Día 2), cítrica (Día 2), cataplasma (Día 2), vendaje (Día 1), caldo
de huesos (recado del Día 2) y **jarabe balsámico** (la única nueva). Es decir, el Día 3 es un día de **repetir** recetas con
otros pacientes; hasta ahora el jugador no aprende nada nuevo.

## 2. Bloqueantes técnicos / de contenido

1. **Mujer del plumero** (`chapter3.apothecaryStreet.duster`, calle botica) y **minero del camino** (`chapter3.mountainPath.miner`,
   camino de la mina): no están en tu export. Sin ellos `shouldCloseDay3` nunca se cumple. Hay sprites (`woman-dusting` y
   `miner-pick-swing`).
2. **Herencia del Día 2 sin forma de borrar.** El Día 3 hereda todo lo del Día 2 y tu export **añade o reemplaza por id**, no
   puede quitar. Hoy en el Día 3 se ven (comprobado con los datos):
   - Herrería interior: **dos herreros** (el herido del Día 2 + el del martillo que acabas de poner).
   - Granero: **el agricultor enfermo tumbado** (ya curado el Día 2) y la cuidadora.
   - Bosque: el leñador **agotado** en el tocón (curado el Día 2).
   - Cantera: banco, pala y descansando (tres picapedreros; solo el del taburete es paciente).
   - Mina y cueva: minero recuperándose y la bruja de la linterna, **inaccesibles** hoy por el guardia.
   Propuesta: una lista `REMOVED_IN_CHAPTER` en `compositions/index.ts` (ids que el Día 3 no hereda). Pequeño y seguro.
3. **Las 20 personas mudas del Día 3** (todas las nuevas que colocaste y las v2): cura rezando (5 personas), ancianos sentados,
   niño de la peonza, niña de la comba, carpintero, arquero, niño de la espada, lavandera, mujer de la panadería, mujer de la
   taberna, joven del molino, hombre del taberna interior, picapedrero de la cantera (resting + v2), herrero del martillo.
   Día 2 tenía **0 mudos**. Sin interacción no sale ni la «E»: el jugador acostumbrado a que cada persona del pueblo hable se encuentra con gente que es decorado, y el Día 3 es justo el día en que la gente debería sentirse *rara*, no *inerte*.

## 3. Economía

**Dinero total posible hasta el final del Día 3: 82** (6 inicial + 3 pescador + 15 pacientes D1 + 17 pacientes D2 + 28 recados D2 +
13 pacientes D3). **Máximo gastable en tienda: 60** (sal 8, azúcar 15, naranja 3, cebolla 6, ajo 5, tela 10, vela 1, hueso 9, grasa 3).

- Lo **obligatorio** del Día 3 son unas **15 monedas**: ajo 5, azúcar 5 (bebida cítrica), sal 2, tela 2, naranja 1. Cobra 13.
- Si el jugador hizo los recados del Día 2, llega al final del Día 3 con unas **30 monedas sin uso** (el test de partida termina
  con 32). **El dinero del Día 3 no pide ninguna decisión**: sobra y no hay en qué gastarlo (solo el ajo es caro).
- En el Día 3 la tienda solo añade 18 monedas de existencias nuevas (3.ª unidad de azúcar, naranja, cebolla, hueso, 5.ª tela, ajo).
- **Salidas de dinero posibles que ya existen en el código:** recados (con pago en monedas y objeto), vela a la estatua.
- Detalle a cuidar: la bruja regala hueso, hierba y menta en la primera visita; si la visita se hace pronto, ahorra 3 monedas
  de hueso. Está bien (la gracia del claro), pero reduce todavía más la presión.

Opciones para darle sentido: recados del Día 3 (más salida), un gasto narrativo (ofrenda, propina), un objeto de comodidad
opcional (otra mochila +1) o subir un poco ajo/azúcar. Cualquier cambio exige volver a pasar `economy-no-deadlock`.

## 4. Pacientes

| Paciente | Dónde | Dolencia | Preparados | Qué hay que recorrer | Problema |
|---|---|---|---|---|---|
| Mujer del plumero | calle botica | tos de pecho | infusión de menta + **jarabe balsámico** (menta + miel + ajo machacado) | menta (bruja o cabaña), miel (apicultor), ajo (mercado) + mortero | es la única con receta nueva; cercana a la botica |
| Minero del camino | camino de la mina | escorbuto | bebida cítrica + caldo de huesos | naranja + azúcar (mercado/plaza), hueso (bruja o carnicería), sal | los dos preparados son repetidos |
| Picapedrero (taburete) | cantera | fractura | vendaje desinfectado + cataplasma | tela (mercado), alcohol (tabernero), hierba (bruja), miel, harina (saco de la panadera) | es la que más viaje exige |

Observaciones:
- **Mecánica idéntica para los tres**: hablar → «examinar en el sitio» → preparar → entregar. El Día 2 tenía el agricultor con
  investigación y análisis; el Día 3 no tiene nada parecido.
- **El texto de síntomas del diagnóstico regala la respuesta** (p. ej. «encías que sangran... pan duro y cecina» = escorbuto).
  Con 10 dolencias en el libro, y sin penalización por fallar, el diagnóstico es casi trivial.
- **Dolencias sin usar:** quemadura e **insomnio**. El insomnio encaja con el motivo del Día 3 (gente que no duerme por mirar
  una luz pequeña) y se cura con **recetas que ya existen** (infusión de menta + leche con miel). Es un cuarto paciente barato.
- Pagos (3, 4, 6): el que menos paga es el de más cerca (la mujer del plumero); el picapedrero (6) paga justo por el viaje.
- La mina está cerrada: el guardia no deja pasar. Para los casos del Día 3 **no hace falta la mina**: ninguno de los ingredientes de sus recetas sale de ahí.

## 5. Diálogos

- **Pacientes:** 4 conversaciones cada uno (examen, cura, tras curar, esperando). Buen tono, pero **sin el motivo del día**
  (nadie mira nada pequeño ni contesta tarde). Solo los 10 vecinos de fondo lo llevan.
- **Bruja del claro** (texto del 12-nov): hueso + hierba + menta y el mal presagio por una seta de pino. **No menciona los
  cuervos** que acabamos de dibujar y que el Día 4 explica («los cuervos avisan cuando algo cambia de sitio»).
- **Incoherencia con tu bloqueo de la mina:** el presagio dice «el bosque, la granja y la mina se cerrarán a tu paso» (mañana),
  pero hoy ya cierra el guardia por desprendimientos. Hay que decidir si el presagio nombra solo bosque y granja o si el
  guardia es ya la primera señal.
- **Texto ambiental de los 10 vecinos** del Día 3 (aplicado el 13-nov) está bien orientado. Falta dar lo mismo a las 20 personas
  mudas, con voz propia según su oficio (el carpintero corta torcido, la niña falla la comba por mirar...).
- **Apertura sin texto:** el Día 2 abre con el pie de foto del mensajero. El Día 3 empieza en la habitación sin nada; es el
  único día sin «gancho» de arranque.
- **Cierre:** 3 pensamientos del Doctor bien escogidos; la ilustración es «escribiendo» (la misma del título y de la noche).

## 6. Cómo correr el día (ritmo y recorrido)

Hechos que condicionan el ritmo:
- Los NPC solo **dan suministros** (miel, harina, alcohol) cuando el caso ya está **examinado**. Hay que examinar primero a los
  tres y luego recoger: sin pistas, el jugador puede dar vueltas.
- Escenas implicadas: calle botica, mercado, plaza, calle panadería (+ interior), calle taberna (+ interior), granja, molino,
  bosque, claro, camino de la mina, cantera. **unas 11 escenas** para 3 pacientes.
- La mina está cerrada: el camino a la cantera pasa ahora por el guardia (buen cuello de botella para una conversación).
- No hay objetivo guiado del Día 3 en el panel (R) más allá de los casos.

Ideas (a decidir):
1. **Mañana / tarde / noche**: examinar (calle botica → camino de la mina → cantera), recoger (panadería, taberna, mercado, mill),
   claro con la bruja (menta/hueso/hierba) y entregar en orden inverso. El mapa ya agrupa bien el recorrido.
2. **Un bucle más corto**: cambiar el lugar de un suministro (p. ej. alcohol que da el herrero, no el tabernero) para evitar el
   viaje a la taberna desde el camino de la mina.
3. **Cuello de botella narrativo**: el guardia al volver de la cantera comenta el estado de la mina (cambia lo que dice según los
   pacientes tratados).
4. **Pista de fin de jornada**: cuando solo queda un paciente, el Doctor lo piensa en voz alta (como en los otros días).

## 7. Qué recomiendo (orden de valor por hora)

1. Desbloquear: colocar los dos pacientes que faltan y limpiar la herencia (REMOVED_IN_CHAPTER).
2. Dar voz a las 20 personas mudas (1-3 líneas cada una, motivo del día).
3. Construir los recados del Día 3 (vela, paño frío, bebida rehidratante y, si se reponen o se sustituyen sus recetas, crema de setas y
   jarabe cítrico: **esas dos recetas se retiraron en el commit 7b52d8d**) y arreglar la economía.
4. Añadir el motivo «algo pequeño en las manos» a los pacientes y a la bruja, con los cuervos.
5. Una micro-investigación por paciente (pista en el mundo que completa los síntomas).
6. Insomnio como cuarto paciente opcional.
7. Apertura corta del Día 3.
8. Pulir el cierre y volver a pasar `economy-no-deadlock` + `day3-playthrough`.

## 8. Decisiones de Kilian (2026-11-17)

- **Herencia:** lista de «no heredar» (ids a decidir; propuesta: herrero herido, agricultor enfermo, leñador agotado, minero y bruja de la mina).
- **Mudos:** 2-3 líneas ES/EN para cada una de las 20 personas, con el motivo sutil del Día 3 (nunca se nombra qué es).
- **Recados:** crema de setas (granjera), jarabe cítrico (joven del río), vela (niña de la muñeca) + carpintero (paño frío) + ancianos sentados (bebida rehidratante). Pagos en mezcla (monedas y algún ingrediente útil).
- **Pacientes:** pista en el mundo por paciente (polvo del piso cerrado, zurrón de pan duro y cecina, bloque caído), síntomas menos obvios y **cuarto paciente: insomnio en el anciano del cántaro** (la granjera vuelve a dar leche por el trueque).
- **Economía:** que al terminar el Día 3 sobren unas **10 monedas** (hoy ~30); repasar `economy-no-deadlock`.
- **Presagio de la bruja:** solo bosque y granja (la mina ya la cierra el guardia). La bruja menciona a los cuervos en una línea.
- **Apertura:** pensamiento del Doctor al salir de la botica. **Ritmo:** objetivos guiados en el panel R.
- **Plazo:** sin recortes por ahora (Kilian está creando cosas para ir teniendo).


> **Corrección (17-nov):** crema de setas y jarabe cítrico **ya no existen como recetas** (se retiraron en `7b52d8d` por no usarse). Los recados que las necesitan requieren reponer la receta o cambiarse por otro.
