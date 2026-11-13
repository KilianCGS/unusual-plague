# Revisión de economía de los días 1 a 3 (13-nov)

Cálculo directo sobre los datos del juego (`money/payments.ts`, `shop/shops.ts`, recados del
picapedrero). No es una partida jugada: es aritmética de lo que entra y de lo que se puede gastar.

## Lo que entra

| Día | Pacientes (monedas) | Recados | Total del día |
|---|---|---|---|
| 1 | Marido de la panadera 6 + Hombre de la taberna 8 + Minero herido 11 = 25 | - | 25 |
| 2 | Leñador 7 + Herrero 9 + Agricultor 13 = 29 | Caldo para el picapedrero de la cantera 5 | 34 |
| 3 | Mujer del plumero 8 + Minero del camino 9 + Picapedrero 12 = 29 | - | 29 |
| Monedas iniciales | 4 | | 4 |
| **Total hasta el día 3** | | | **92** |

El día 4 no tiene pagos ni tienda nueva.

## Lo que se puede gastar (todo lo que vende el mercader)

| Objeto | Precio | Existencias | Disponible desde | Coste |
|---|---|---|---|---|
| Tela | 1 | 3 | día 1 | 3 |
| Sal | 1 | 1 | día 1 | 1 |
| Azúcar | 3 | 3 | día 2 | 9 |
| Cebolla | 1 | 3 | día 2 | 3 |
| Hueso | 1 | 3 | día 2 | 3 |
| Ajo | 2 | 2 | día 3 | 4 |
| **Total si se comprase TODO** | | | | **23** |

## Lo que obligan los casos (mínimo imprescindible)

- Día 1: tela x2 y sal = 3 monedas (las 4 iniciales alcanzan, el juego nunca se bloquea por dinero).
- Día 2: una tela para la compresa = 1 moneda. (Azúcar, cebolla y hueso son para recetas de cocina y recados.)
- Día 3: ajo x1 para el jarabe balsámico de la mujer del plumero = 2 monedas; hueso para el caldo del
  minero del camino (la bruja da uno gratis, o se compra por 1).

Forzado en total: **unas 6-8 monedas** de las 92 que entran.

## Conclusión

- **Sobran unas 70 monedas** (cobras 92, lo máximo comprable son 23 y lo obligatorio unas 7). El
  dinero no cumple ninguna función de decisión a partir del día 1: siempre vas sobrado.
- No hay riesgo de bloqueo (bien), pero tampoco hay tensión ni sensación de ahorrar para algo.
- El pico: en el día 1 terminas con ~26 monedas y la tienda solo vende 4 objetos baratos.

## Opciones (a decidir por ti)

1. **Bajar los pagos** a más o menos la mitad (p. ej. 3-6 por paciente). Siguen sobrando, pero menos.
   Es lo más barato: solo cambia una tabla.
2. **Subir los precios y ampliar la tienda**: azúcar a 5, ajo a 4, más existencias y algún objeto caro
   opcional (un frasco especial, un libro de recetas). Da en qué gastar sin tocar los pagos.
3. **Gasto narrativo opcional**: una propina a un personaje, una limosna en la plaza, una vela para la
   estatua... con una frase del Doctor. No afecta a la jugabilidad, solo da uso al dinero.
4. **Dejarlo así**: el dinero es "color" de la economía y no un recurso a gestionar (la decisión
   original era que el mercader solo vende lo necesario).

Mi recomendación: 1 + 3 (pagos más bajos y un par de gastos narrativos opcionales). Pero necesito tu decisión
antes de tocar nada.

---

## Decisión aplicada (13-nov, a petición de Kilian: "que el dinero tenga necesidad")

Enfoque elegido: **pagos bajos + más cosas de pago obligatorio**.

| Cambio | Antes | Ahora |
|---|---|---|
| Monedas iniciales | 4 | 6 |
| Pagos día 1 (panadera / taberna / minero) | 6 / 8 / 11 | 3 / 4 / 6 |
| Pagos día 2 (leñador / herrero / agricultor) | 7 / 9 / 13 | 3 / 4 / 6 |
| Pagos día 3 (plumero / minero camino / picapedrero) | 8 / 9 / 12 | 3 / 4 / 6 |
| Caldo para el picapedrero de la cantera | 5 | 8 |
| Tela | 1 (x3) | 2 (x4) |
| Sal | 1 (x1) | 2 (x1) |
| Azúcar | 3 (x3) | 6 (x4) |
| Cebolla | 1 (x3) | 2 (x3) |
| Hueso | 1 (x3) | 3 (x3) |
| Ajo | 2 (x2) | 5 (x2) |
| **Receta Bebida cítrica** | naranja + agua | naranja + agua + **azúcar** (solo se compra) |

Compras obligatorias por día (antes de cobrar ese día):

- Día 1: 2 telas + sal = **6** monedas (las 6 iniciales: nunca se bloquea).
- Día 2: tela (compresa) + azúcar (bebida cítrica del leñador) = **8** (llegas con 13 del día 1).
- Día 3: tela (vendaje) + ajo (jarabe balsámico) + azúcar (bebida cítrica del minero) = **13**
  (llegas con ~18 de los días anteriores; el hueso lo regala la bruja o se compra por 3).

Saldo aproximado al final del día 3: **~20 monedas** (antes ~70). El caldo de la cantera deja un
beneficio pequeño (cuesta unas 5 y paga 8). Los valores son propuestas para que los ajustes.
