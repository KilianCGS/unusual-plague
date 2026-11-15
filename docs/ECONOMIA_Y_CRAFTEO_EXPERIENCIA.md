# Economía y crafteo desde la experiencia del jugador (2026-11-15)

Estado: **análisis y propuestas.** Aplicado el 2026-11-15: azúcar a 5 monedas y una pista del carbón (B4 y A1); el resto sigue como propuesta. Todas las cifras salen de los datos del juego
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
| Azúcar | 5 (6 hasta el 2026-11-15) | 4 | día 2 | 20 |
| Cebolla | 2 | 3 | día 2 | 6 |
| Hueso | 3 | 3 | día 2 | 9 |
| Ajo | 5 | 2 | día 3 | 10 |
| **Todo** | | | | **55** |

### Gasto obligatorio estimado (lo que fuerzan los casos si el jugador no encuentra otra fuente)

| Día | Qué hay que comprar | Monedas |
|---|---|---|
| 1 | Tela x2 (paño frío, venda) y sal x1 (sopa) | 6 |
| 2 | Azúcar x1 (bebida cítrica), tela x1 (compresa) | 7 |
| 3 | Azúcar x1, ajo x1 (balsámico), hueso x1, sal x1, tela x1 | 17 |
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

## 8. Verificación sin callejones (2026-11-15)

Principio de Kilian: el dinero debe **sobrar y faltar a la vez** (hay que hacer misiones para
conseguirlo), pero el jugador **no debe atascarse por cambiar el orden** de comprar, curar o hacer el
recado. Lo comprueba `tests/economy-no-deadlock.test.mjs`, que explora todos los órdenes posibles de
compras, curas y recado en los días 1 a 3 y exige que desde cualquier estado alcanzable se pueda terminar.

Lo que encontró con las existencias anteriores:
- **La sal:** 1 en tienda + 1 de regalo de la panadera, pero se usa 3 veces (sopa del día 1, caldo del
  recado, caldo del minero del camino del día 3). Hacer el recado antes dejaba al minero sin sal.
- **Gastar de más:** el coste total de la tienda (56) superaba lo que se cobra de forma obligatoria (45),
  así que comprar cosas inútiles podía dejar sin monedas para el ajo del último caso.

Lo que se aplicó (solo existencias de tienda): sal 3, azúcar 3, hueso 2, ajo 1, tela 4, vela 1, y la **cebolla
deja de venderse** hasta que un caso la necesite. Coste total de la tienda: 41, frente a 45 obligatorios.
Resultado: 3.011 estados comprobados, ninguno sin salida. Si se cambia un precio, un pago o una existencia,
este test dice al momento si se ha vuelto a abrir un callejón.


## 6. Días 3 y 4 por datos (2026-11-15)

Mismo método que el día 1: se leen los datos reales (casos, recetas, recolectables de las composiciones,
intercambios con NPC, suministros del día 2) y se cuenta qué se necesita y de dónde sale. No es una partida
jugada. Ojo: el test `economy-no-deadlock` solo vigila **lo que vende el mercader**; asume que el resto
está "libre en el mundo", y para el día 3 eso **no es cierto todavía**.

### Hallazgo principal: el día 3 no tiene de dónde sacar varios ingredientes

Lo que piden los tres casos del día 3, sin contar lo que vende el mercader:

| Caso | Ingredientes crudos |
|---|---|
| Mujer del plumero | agua x2, menta x2, miel x1, ajo x1 (tienda) |
| Minero del camino | naranja x1, agua x2, azúcar x1 (tienda), hueso x1, sal x1 |
| Picapedrero | tela x1 (tienda), alcohol x1, hierba medicinal x1, miel x1, harina x1 |

Libro de cuentas de lo que **no** vende el mercader (días 1 a 3, ids de recolectables únicos porque lo
recogido no vuelve a aparecer):

| Ingrediente | Hace falta | Fuentes reales | Resultado |
|---|---|---|---|
| Miel | 1 (d1) + 1 (d2) + **2 (d3)** = 4 | apicultor d1 (1) y apicultor d2 (1, solo si un caso del día 2 la necesita) | **faltan 2** |
| Harina | 1 (d2) + **1 (d3)** = 2 | saco de la panadera, solo mientras un caso del día 2 la necesita | **falta 1** |
| Alcohol | 1 (d1) + **1 (d3)** = 2 | camarero, una sola vez (día 1) | **falta 1** |
| Menta | 1 (d2) + **2 (d3)** = 3 | claro del bosque (1) y cabaña (1) | **falta 1** |
| Hierba medicinal | 2 (d1) + 2 (d2) + **1 (d3)** = 5 | bosque d1 (1), bosque d2 (2), trueque con la bruja (1) | **falta 1** (ya anotado: segunda fuente de hierba) |
| Naranja | 1 (d1) + 1 (d2) + 1 (d3) = 3 | una rama de 3 | justo, sin margen |
| Carbón, resina, grasa | solo días 1-2 | cantera, vecina, leñador | bien |

Por qué fallan miel, harina y alcohol: los proveedores del día 2 (`resolveBeekeeperHoney`, saco de harina,
`CHAPTER2_SUPPLIES`) buscan lo que falta **solo entre los casos del día 2**. En el día 3 responden "hoy no le
pido nada". El día 3 tampoco tiene colocaciones propias todavía (`chapter-3.ts` vacío: hereda las del día 2).

Consecuencia hoy: con las mejores decisiones posibles, el jugador **no puede curar** al picapedrero (alcohol,
harina, miel) ni terminar el balsámico del plumero sin una segunda miel. Es un callejón, aunque el dinero
sobre. Las partidas de prueba no lo ven porque `createDay3DevStart` regala menta, miel, ajo y naranjas.

### Dinero del día 3

Con las existencias de tienda actuales (sal 3, azúcar 3, hueso 2, ajo 1, tela 4) el día 3 se puede pagar: el
test lo da por bueno. La naranja, sin embargo, depende de **no haber desperdiciado ninguna**: la receta de
"jarabe cítrico" está bloqueada por el aviso "no hace falta", así que hoy no se puede gastar una por error.

### Día 4

Sin pacientes, sin pagos, sin recetas nuevas: no hay economía que analizar. Lo único a vigilar es el carácter
del día (visual) y que el jugador no pierda nada por llegar con monedas de sobra (hoy sobran ~8-12).

### Propuestas (cualquiera cierra el callejón; ninguna está aplicada)

1. **Miel, harina y alcohol**: generalizar los suministros del día 2 para que también atiendan los casos
   del día 3 (apicultor, saco de la panadera, camarero). No cambia ningún texto de diálogo nuevo salvo las
   líneas de "esto ya lo tienes".
2. **Menta y hierba**: dos recolectables más que **colocas tú en el Decorator** (menta y hierba ya existen
   como recolectables; yo solo te doy los nombres). Cierra también la segunda fuente de hierba.
3. **Naranja**: una segunda rama de naranjas en el día 3 (o aceptar el "justo").
4. Añadir a `economy-no-deadlock` el libro de cuentas de ingredientes que **no** vende el mercader, para que
   este tipo de hueco salte en un test en vez de en una partida.
