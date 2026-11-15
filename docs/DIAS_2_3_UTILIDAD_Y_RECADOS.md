# Días 2 y 3: que todo sirva para algo (2026-11-15)

Estado: **análisis y propuesta, nada implementado.** Sale de los datos reales (recetas, casos, personajes
colocados, tienda, intercambios) y del criterio de Kilian: *recolección → crafteo → recompensa (dinero o
items) y repetir; que el jugador investigue y sienta que craftea y usa cosas, para pacientes y para misiones.*

## 1. Dónde estamos (con números)

**Recetas: 26. Las que usa algún paciente o el recado en los días 1-3: 19. Sin uso: 7.**

| Sin uso hoy | Qué es |
|---|---|
| `chop.onion` → cebolla troceada | paso intermedio |
| `chop.pine-mushroom` → seta de pino troceada | paso intermedio |
| `fire.mushroom-cream` → crema de setas | seta de pino troceada + leche + sal |
| `fire.onion-syrup` → jarabe de cebolla | cebolla troceada + azúcar |
| `fire.rehydration-drink` → bebida rehidratante | agua + azúcar + sal |
| `fire.citrus-syrup` → jarabe cítrico | naranja + azúcar |
| `fire.strong-broth` → caldo fuerte | cebolla troceada + hueso + agua |

Y hay más: el juego **impide fabricar lo que no hace falta** ("no hace falta"), así que el jugador ni siquiera
puede probarlas. Cinco preparados y dos pasos de troceado existen y nadie los ve.

**Recompensas: solo dinero, y solo en un sitio.** Los 9 pacientes pagan 3-4-6 por día y hay **un** recado
(el caldo de huesos del cantero: 8). Los objetos que se reciben (miel, harina, alcohol, hueso...) son
*suministros para curar*, nunca un premio. Resultado: el bucle completo existe (recoger → fabricar → cobrar),
pero **solo dentro del caso**; no hay una segunda vuelta que el jugador pueda elegir.

**Personajes con los que se puede hablar en los días 2 y 3 y que solo dicen una frase:** 14
(tabernero, niña de la muñeca, anciano del cántaro, joven del río, pescador, mujer de la granja, vecino del
molino, apicultor, hombre y mujer de la calle de la panadería, panadera, herrero, minero, cuidadora del
granero...). Cada uno es un posible **dador de recados** sin colocar nada nuevo.

**Aviso importante:** el día 3 **no tiene colocaciones propias** (`chapter-3.ts` vacío, hereda el día 2). Los
tres pacientes del día 3 (plumero, minero del camino, picapedrero) todavía no existen en el mundo. Sin esas
colocaciones el día 3 no se puede jugar; el resto de este documento lo da por hecho.

## 2. Principios para que "todo sirva para algo"

1. **Cada ingrediente tiene dos usos:** el caso obligatorio y, como mínimo, un recado voluntario. Si un
   ingrediente solo sirve para un paciente, se siente un requisito, no un recurso.
2. **Cada preparado tiene a alguien que lo quiere.** Los 5 sin uso se reparten entre vecinos.
3. **Los recados son voluntarios, nunca bloquean**, y pagan por encima de su coste. El camino obligatorio
   (los 3 pacientes por día) sigue siendo suficiente: los recados son la parte "extra" que da gusto.
4. **La recompensa varía:** monedas, un ingrediente útil de verdad (azúcar, hueso: cosas que cuestan en la
   tienda), o una pista. Así dos recados no son "lo mismo con otro número".
5. **Investigar, no recibir una lista:** el vecino *dice qué le pasa* en conversación; el jugador abre el libro,
   busca qué preparado le encaja y lo fabrica. Sin marcador mágico (el panel de recados R lo apunta una vez
   aceptado).

## 3. Propuesta: 6 recados en los días 2 y 3 (usa los 5 preparados sin uso)

Los dadores son personajes **ya colocados**. Coste = lo que hay que comprar en la tienda actual (el resto sale
del mundo). "Neto" = recompensa − coste en monedas.

| Día | Dador | Qué le pasa / pide | Preparado (el sin uso) | Coste tienda | Recompensa | Neto |
|---|---|---|---|---|---|---|
| 2 | Anciano del cántaro (calle de la taberna) | Tos seca de toda la noche | **Jarabe de cebolla** | cebolla 2 + azúcar 5 = 7 | 9 monedas | +2 |
| 2 | Panadera (con su marido ya curado) | Su marido sigue flojo, necesita algo de sustancia | **Caldo fuerte** | cebolla 2 + hueso 3 = 5 | 1 azúcar (vale 5) + 2 monedas | +2 |
| 2 | Tabernero | Clientes con la boca seca tras la noche | **Bebida rehidratante** | azúcar 5 + sal 2 = 7 | 9 monedas | +2 |
| 3 | Mujer de la granja | Quiere algo suave para la cena de su marido | **Crema de setas** | sal 2 (+ seta de pino y leche del mundo) | 6 monedas + 1 leche | +4 |
| 3 | Joven del río | Mareo, "quiero algo dulce y fresco" | **Jarabe cítrico** | azúcar 5 (+ naranja) | 8 monedas | +3 |
| 3 | Niña de la muñeca (taberna) | Una vela para la muñeca | *(ninguno; usa la vela de 1 moneda)* | vela 1 | un dibujo / pista del pueblo | 0 |

Con esto: **los 5 preparados sin uso se usan**; la cebolla troceada y la seta de pino troceada también
(jarabe de cebolla, caldo fuerte y crema). El recado de la niña es el "color" del día 3 (gasto narrativo
barato, ya hay vela y estatua).

### Reparto del bucle (lo que siente el jugador)

- **Día 2:** 3 pacientes (obligatorio) + 3 recados (voluntarios). Cobra 13 + hasta 20 extra. Gasta en azúcar,
  cebolla, hueso y sal. Toca la tabla de cortar por primera vez de forma natural (cebolla).
- **Día 3:** 3 pacientes + 3 recados. Gasta lo ganado; hay que elegir qué recado hacer con el azúcar (cuestan lo
  mismo y solo hay un cierto número): esa **decisión** es la parte "sobra y falta".

## 4. Lo que habría que ajustar para que cuadre (sin que nadie se atasque)

El modelo de `economy-no-deadlock` hoy asume que la tienda solo vende lo obligatorio. Con los recados hay que
recalcular, y estos son los cambios que propongo (se comprueban con el test, que hay que ampliar):

| Cambio | Por qué |
|---|---|
| Azúcar: de 3 a **5** existencias (5 monedas) | 1 d2 + 1 d3 obligatorios + 3 de recados posibles (no todos a la vez: ahí está la elección) |
| Cebolla: **volver a venderla** desde el día 2 (2 monedas, 3 existencias) | hoy está fuera de la tienda; sin ella el jarabe de cebolla y el caldo fuerte no existen |
| Hueso: de 2 a **3** | 1 caldo de huesos (cantero) + 1 del caso del día 3 + 1 caldo fuerte |
| Sal: de 3 a **5** | sopa, caldo de huesos, errand del cantero, rehidratante, crema |
| Leche: una vía para el día 3 | hoy solo hay 1 (día 1); la mujer de la granja puede dar 1 al agradecer (y de ahí sale la crema) |
| Seta de pino: 1 más | solo hay una en el claro y la usa la bruja; hace falta otra para la crema (colocarla en el Decorator, tú) |
| Naranja | siguen siendo 3 para 3 usos; el jarabe cítrico necesita **una cuarta** (colocarla, tú) o cambiar su receta |

Con esos números el coste total de la tienda sube de 41 a ~64 monedas; los ingresos posibles son los 53 de hoy
(6 iniciales + pacientes + recado del cantero) más ~34 en monedas de los recados (y un azúcar y una leche), unos
**87**. Se puede comprar casi todo, pero no todo a la vez si se gasta mal: **sobra lo suficiente para que el dinero no
ahogue y falta lo suficiente para elegir**, que es lo que pediste. (Cifras a verificar con el test ampliado.)

## 5. Qué hay que construir (en orden)

1. **Dos cambios mínimos de sistema:** (a) que los intercambios con NPC admitan *recompensa en monedas y en
   objeto a la vez* (ahora una u otra por entrada), (b) que el panel de recados (R) liste los recados
   aceptados, para que el jugador no tenga que acordarse. El mecanismo de intercambio (`NPC_TRADES`) y la
   gate de "esto no hace falta" ya existen; los recados se activan al hablar con el dador.
2. **Texto de cada recado (ES/EN):** la petición (que sugiere el preparado sin nombrarlo), la entrega, la
   respuesta si falta algo y el agradecimiento: **4 conversaciones por recado, unas 4-6 líneas**. Son 6
   recados: unas 24 conversaciones nuevas. Todo **para tu revisión**.
3. **Ajustar la tienda** (tabla de arriba) y ampliar el test para que prohíba callejones con los recados.
4. **Tus colocaciones:** una seta de pino y una naranja más (y los pacientes del día 3, que son lo primero).
5. **Recomendado antes de todo:** colocar el día 3, porque hoy no hay nada contra lo que probar nada de esto.

## 6. Qué NO haría

- No añadiría objetos nuevos (pan, cuencos...) hasta el plazo del 19 de noviembre: cada uno pide icono, libro,
  tienda y tests. Los recados con lo que ya hay bastan.
- No pondría un tablón de pedidos (ya acordado que queda fuera del recorte).
- No haría obligatorio ningún recado: el día se cierra con los 3 pacientes como hoy.

## 7. Qué cambiaría en el sentimiento de cada día

| Día | Hoy | Con la propuesta |
|---|---|---|
| 2 | 3 casos y 1 recado casi invisible | 3 casos + 3 recados; la tabla de cortar y el azúcar importan |
| 3 | 3 casos sin mundo propio | 3 casos + 3 recados + un gasto narrativo; hay que elegir con el azúcar |
