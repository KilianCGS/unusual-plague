# Economía y crafteo desde la experiencia del jugador (2026-11-15)

Estado: **análisis y propuestas, nada cambiado.** Todas las cifras salen de los datos del juego
(`money/payments.ts`, `shop/shops.ts`, `crafting/recipes.ts`, `patients/*`, `dialogue/npcTrades.ts`) tal y
como están hoy, incluidos los cambios de esta semana (cocina con espera de 5 s, tabla de cortar, ajo
machacado, carbón en la cantera). No es una partida jugada: es aritmética más lectura del recorrido.
Sustituye en lo económico a `ECONOMY_REVIEW_NOV13.md`, que partía de pagos más altos.

Cuando hablo de "el jugador" pienso en alguien que no sabe nada del juego y juega el día 1 por primera vez
(tu pareja, por ejemplo).

---

## 1. Qué es hoy el sistema, en una página

**Dinero.** Monedas de cobre. El Doctor empieza con **6**. Cobra al curar a cada paciente y por un recado.
No hay otra fuente (nadie paga por hablar, no hay objetos que vender).

**Tienda.** Un solo mercader en la plaza, con existencias limitadas y compra única (lo comprado no se repone).
Va ampliando su género por día.

**Crafteo.** Cuatro estaciones:

| Estación | Qué hace | Ingredientes | Espera |
|---|---|---|---|
| Mesa de trabajo | mezclar, empapar, envolver | 2 | ninguna |
| Mortero (dentro de la mesa) | machacar un ingrediente | 1 | ninguna |
| Cocina | cocinar, hervir, infusionar | 3 | **5 s** con barra "Preparando..." |
| Tabla de cortar (dentro de la cocina) | trocear un ingrediente | 1 | ninguna |

Cada receta da **1 unidad**. No hay lotes. Un preparado puede ser ingrediente de otro (cadenas).

**Pacientes.** Cada caso pide exactamente **2 preparados**. El jugador tiene que averiguar cuáles (el libro y
las pistas), reunir los ingredientes, fabricarlos y entregarlos.

## 2. Lo que entra y lo que sale, día a día

### Ingresos

| Día | Pacientes | Recado | Total |
|---|---|---|---|
| Inicio | | | 6 (monedas iniciales) |
| 1 | Marido de la panadera 3 + Hombre de la taberna 4 + Minero herido 6 | | 13 |
| 2 | Leñador 3 + Herrero 4 + Agricultor 6 | Caldo para el picapedrero 8 | 21 |
| 3 | Mujer del plumero 3 + Minero del camino 4 + Picapedrero 6 | | 13 |
| 4 | (sin pagos) | | 0 |
| **Total** | | | **53** |

### Tienda (lo máximo que se puede comprar)

| Objeto | Precio | Existencias | Desde | Coste total |
|---|---|---|---|---|
| Tela | 2 | 4 | día 1 | 8 |
| Sal | 2 | 1 | día 1 | 2 |
| Azúcar | 6 | 4 | día 2 | 24 |
| Cebolla | 2 | 3 | día 2 | 6 |
| Hueso | 3 | 3 | día 2 | 9 |
| Ajo | 5 | 2 | día 3 | 10 |
| **Todo** | | | | **59** |

### Gasto obligatorio estimado (lo que fuerzan los casos si el jugador no encuentra otra fuente)

| Día | Qué hay que comprar | Monedas |
|---|---|---|
| 1 | Tela x2 (paño frío, venda) y sal x1 (sopa) | 6 |
| 2 | Azúcar x1 (bebida cítrica), tela x1 (compresa) | 8 |
| 3 | Azúcar x1, ajo x1 (balsámico), hueso x1, sal x1, tela x1 | 18 |
| **Total** | | **32** |

Conclusión numérica: se cobran **53** y lo obligatorio ronda **32**. Sobran unas **20 monedas** en todo el
juego, y el máximo que se puede gastar (59) ya supera lo que se cobra. Es mucho mejor que antes (sobraban
~70), pero conviene mirar el **ritmo**, no solo el total.

## 3. Cómo se vive (el análisis de experiencia)

### 3.1 Día 1: el dinero entra tarde, y cuando entra ya no hace falta

Las 6 monedas iniciales cubren exactamente lo obligatorio del día 1 (6). Eso es bueno: nunca te quedas
bloqueado. Pero también significa que **el jugador no toma ninguna decisión económica** el primer día: compra
lo único que le sirve y ya. Las 13 monedas que cobra al final no tienen nada en lo que gastarse hasta el día
2.
- Riesgo: si el jugador gasta una moneda en algo no obligatorio (una tela de más), se queda a 1 moneda de
  bloquearse. Hoy no puede, porque no hay nada más que comprar. Mantenerlo así o dejar un colchón.
- Sensación: "cobro y no pasa nada". La monedita sube en el HUD, pero no hay un objetivo de ahorro.

### 3.2 Día 2: aparece el azúcar, y es caro

El azúcar cuesta **6**, es decir, **dos pacientes enteros de pago bajo**. El día 2 es el primero con tensión
real: o cobras al leñador/herrero primero, o llegas justo. Esto es *bueno* para la experiencia (primera
decisión de "qué compro primero"), siempre que el jugador pueda ver el precio antes de gastarse las monedas
en otra cosa. Hoy:
- No hay aviso de "esto te hará falta". El jugador descubre que necesita azúcar al intentar la bebida cítrica.
- Si compra tela de más el día 1 (hay 4 en venta y solo hacen falta 3 en todo el juego), puede quedarse corto.
  Con 6 iniciales no puede, pero conviene vigilar si se sube algún precio.

### 3.3 Día 3: el pico de gasto (18 monedas)

Es el día con más gasto obligatorio y el que menos ingresos de reserva deja. Ingresos de los días 1-2: 6 + 13 + 21
= 40, gastos obligatorios hasta el día 2: 14 → llegas con ~26. El día 3 pide 18 y te deja con ~8 + los 13
que cobras. Cuadra, pero **no hay margen para errores**: una compra equivocada se paga en el día 3.
- El recado del picapedrero (8 monedas) es en realidad lo que sostiene el día 3. Si el jugador no lo hace
  (es opcional), la cuenta se aprieta mucho. Ojo si la pareja lo salta.
- El recado del picapedrero necesita un caldo de hueso: cuesta unas 5 monedas fabricarlo (hueso 3 + sal 2,
  más agua) y paga 8, así que el beneficio neto es de solo ~3. Es un recado que da más historia que dinero.
- La bruja no regala ingredientes de tienda (da una hierba a cambio de un hongo y la pluma negra), así que no
  hay colchón oculto: el dinero del día 3 sale de los pacientes y del recado.

### 3.4 El dinero sin sumidero narrativo

Fuera de la tienda no hay nada que comprar. Lo que sobra (unas 20 monedas) se queda en el HUD sin función.
Es un sistema correcto, pero **plano**: no hay recompensa por ahorrar ni dilema por gastar.

### 3.5 El crafteo: cuánto trabajo, y qué se siente

Acciones de crafteo por día (contando cada paso: machacar, trocear, mezclar, cocinar):

| Día | Acciones | Cocciones (x5 s) | Espera total |
|---|---|---|---|
| 1 | 9 | 3 (infusión, sopa, leche con miel) | 15 s |
| 2 | 7 | 3 (cítrica, menta, base de ungüento) | 15 s |
| 3 | 9 | 4 (menta, balsámico, cítrica, caldo de hueso) | 20 s |

Lo que me parece sano:
- **La espera de 5 s es poca cosa** (50 s en tres días) y da ritmo y un momento "vivo". No cansa.
- **Trocear y machacar son instantáneos**: añaden pasos y sensación de oficio sin añadir tiempo muerto.

Lo que me parece frágil:
- **Cada receta da 1 unidad.** Si el jugador se equivoca de receta o necesita dos usos, repite todo. En los
  casos del juego no hace falta, pero la sensación "una cosa por vez" puede cansar con 9 acciones al día.
- **Descubrir cuál es el preparado necesario** depende del libro y las pistas. Una vez dentro de la
  estación, si el jugador prueba una combinación válida pero que ningún caso necesita, ve
  "(Eso no lo necesito ahora.)". Es una pista honesta, pero rompe la fantasía de experimentar.
- **La sopa del día 1 ahora necesita trocear el hongo antes**, y es el jugador *más novato* quien la hace.
  El nombre del ingrediente ("Hongo troceado") es la única pista. Conviene mirar con tu pareja si lo
  entiende solo o se atasca.

### 3.6 Descubribilidad y fricción

| Punto | Hoy | Riesgo |
|---|---|---|
| Qué necesita cada paciente | libro + diálogo | bajo |
| Dónde se consigue cada ingrediente | texto de pista en algunos objetos; el resto, explorar | medio: el carbón del día 1 está en la cantera (hombre de espaldas) y no hay pista |
| Qué estación usar | el libro dice "Mesa/Cocina/Mortero/Tabla" por receta | bajo |
| Saber que existe "Trocear" | el botón de la cocina | medio |
| Cuánto cuesta algo antes de ir al mercader | solo en la tienda | medio |

## 4. Propuestas

Ordenadas de menos a más trabajo. Cada una indica su efecto en el jugador.

### A. Sin tocar números (solo claridad)
1. **Pista del carbón.** Que alguien (el minero del paseo, ahora ambiente) mencione a su amigo de la cantera.
   Una línea de texto. Efecto: el jugador no se queda dando vueltas por el día 1.
2. **Aviso de coste.** En la tienda, al comprar, mostrar en el libro/recados qué ingredientes te faltan
   para tus casos (ya se calculan en `needs.ts`; solo habría que mostrarlos). Efecto: decisiones informadas.
3. **Receta visible mientras se prepara.** En el panel de la estación, mostrar al lado qué preparados necesitan los casos
   activos. Efecto: menos prueba y error.

### B. Ajustes de números (barato)
4. **Bajar el azúcar a 4-5.** El día 2 sigue siendo tenso pero ya no es "dos pacientes". Efecto: el jugador
   llega al día 3 con más margen.
5. **Subir el recado del picapedrero a 10 o añadir un segundo recado opcional.** Efecto: el día 3 deja de
   depender de una sola misión opcional.
6. **Aumentar existencias de tela** a 5 si se ve que el jugador la usa de más. Efecto: red de seguridad.

### C. Darle vida al dinero (medio)
7. **Gastos narrativos opcionales:** una vela para la estatua de la plaza, una propina a una persona, una
   limosna. Cuestan 1-3 monedas y devuelven una frase del Doctor, sin impacto en las curas. Efecto: el dinero
   sobrante tiene uso emocional.
8. **Un objeto caro opcional en la tienda** (un frasco especial, un libro de apuntes) que desbloquea una
   página o un diálogo. Efecto: da un objetivo de ahorro sin bloquear nada.

### D. Más profundidad de crafteo (más caro)
9. **Rendimiento mayor en recetas básicas** (por ejemplo 2 unidades de infusión) para que fabricar sea una
   decisión ("preparo para dos casos") y no solo un trámite.
10. **Ingredientes alternativos:** dos formas de hacer un mismo preparado (con miel o con azúcar), una más barata
    y otra más rápida. Efecto: el jugador elige según lo que lleve.

## 5. Recomendación

Para el plazo (19 de noviembre) y para tu pareja jugando los días 1 y 2:
1. **A1** (pista del carbón): evita un atasco real del día 1.
2. **B4** (azúcar a 5): quita la aspereza del día 2 sin cambiar nada más.
3. **C7** (dos o tres gastos narrativos): da uso al dinero con muy poco trabajo, y es texto que ya
   escribes.
4. Dejar **D** para después de entregar.

## 6. Qué mirar cuando juegue tu pareja (métricas sin herramientas)

- ¿Cuánto tarda en descubrir el carbón? ¿Pregunta dónde está?
- ¿Entiende por sí sola que hay que trocear el hongo?
- ¿Llega a quedarse sin monedas en algún momento? ¿Cuándo?
- ¿Cuántas monedas le quedan al terminar el día 2? (esperado: unas 10-14)
- ¿Prueba combinaciones al azar en las estaciones, o va directa a la receta del libro?
- ¿Le molesta la espera de la cocina o la disfruta?

## 7. Preguntas abiertas para ti

1. ¿Qué papel quieres que tenga el dinero: un recurso a gestionar, o un detalle de ambiente?
2. ¿Hay algo "caro" que te gustaría que el jugador pudiera querer comprar (por historia, no por jugabilidad)?
3. ¿Quieres que el herrero venda carbón (más adelante) y que eso cambie el precio de los preparados con carbón?
4. ¿Los recados son un extra o parte del recorrido que da dinero imprescindible?
5. ¿La tabla de cortar debe usarse también en el tutorial, o se descubre sola?
