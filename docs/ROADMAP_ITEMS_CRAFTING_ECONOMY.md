# Hoja de ruta: objetos, crafteo, importancia y sensación de "me alcanza"

**Estado: PROPUESTA.** Nada de esto está implementado salvo lo indicado en "Punto de partida".
Los números (precios, pagos, cantidades) son **inventados y no redondos** a propósito y esperan
tu revisión. Se apoya en `DESIGN_ITEMS_QUESTS_DRAFT.md` (lo que ya aprobaste) y no lo contradice.

## 0. Punto de partida (lo que existe hoy)

- 17 recetas: 3 de mortero (triturar), 6 de mesa (preparar) y 8 de fuego (cocinar).
- Objetos base: tela, alcohol, agua, sal, hongo, miel, carbón, leche, harina, naranja, menta,
  resina, ajo, sanguijuela (más los preparados).
- Monedas de cobre 0-99. Empiezas con **4**. Pagos de pacientes: día 1 = 6 + 8 + 11 = **25**;
  día 2 = 7 + 9 + 13 = **29**.
- El mercader vende tela (1 moneda, 3 unidades) y sal (1 moneda, 1 unidad). Gasto obligatorio del
  día 1: **3 monedas** de 4, así que el día 1 termina con **26** (comprobado jugando de verdad).
- Inventario de 6 casillas; el cofre guarda 10.

## 1. Qué significa que un objeto "importe"

Un objeto importa si el jugador **siente su falta o su presencia**. Propongo cuatro papeles; cada
objeto nuevo debe cumplir al menos dos:

| Papel | Pregunta que responde | Ejemplo |
|---|---|---|
| **Necesario** | ¿Sin esto no avanzo? | la tela del paño frío |
| **Alternativa** | ¿Me abre una segunda manera de curar? | caldo de huesos en vez de sopa de hongo |
| **Moneda social** | ¿Alguien me lo pide o me lo agradece? | la cebolla que pide la panadera |
| **Aspiración** | ¿Quiero ahorrar para tenerlo? | el azúcar |

Regla práctica: **ningún objeto es solo decorativo** y **ningún objeto obligatorio se puede
perder** (lo que el mercader vende y es necesario nunca se agota antes de usarse).

## 2. Los objetos por fases

### Fase A: la familia de cocina medicinal (ya aprobada)

| Objeto | Papel principal | Papel secundario | Dónde se consigue |
|---|---|---|---|
| Hueso | alternativa (caldos) | moneda social | cocinero de la cantera (regalo, día 1); mercader desde el día 2 |
| Seta de pino | alternativa (crema) | recogible, justifica el bosque profundo | leñador (regalo) y bosque |
| Azúcar | aspiración | alternativa (jarabes) | solo mercader, desde el día 2, caro |
| Cebolla | alternativa (jarabe de tos) | moneda social | granja y mercader, barato |

Las 6 recetas nuevas están en el borrador (caldo de huesos, crema de setas, jarabe de cebolla,
bebida reconstituyente, jarabe cítrico, caldo fuerte). Todas al fuego.

### Fase B: oficios que venden lo suyo (cuando decidas)

Tu idea: en vez de trueques, **crafteos que se cambian por dinero** y oficios con producto propio.
Cada oficio produce un objeto que solo ese oficio da, y que una receta o un pedido pide:

| Oficio | Producto | Para qué sirve |
|---|---|---|
| Herrero | herraduras, clavos | pedidos de la granja (el caballo), recompensa de mini-misión |
| Panadera | harina y trigo crudo | pan en el fuego, base de cataplasmas |
| Tabernera | alcohol | desinfectar (ya existe) y jarabes fuertes |
| Apicultor | miel, cera | pomadas, bebidas |

No hace falta implementarlos todos a la vez: **uno por capítulo** basta para que el mundo se
sienta productivo. Propuesta: herrero en el capítulo 2 (el herido ya aparece), panadera en el 3.

## 3. Crafteo: cómo cambia el valor de cocinar

Hoy cada paciente tiene **una** receta "correcta". El objetivo es que cocinar sea **decidir**:

1. **Camino principal** (el que enseña el libro) y **camino alternativo** (con los objetos nuevos).
   El alternativo es más barato o más lento, nunca estrictamente mejor.
2. **Pedidos** (tablón o vecinos): una receta que ya sabes, pedida por alguien, pagada en monedas
   o en un objeto. Sirven para tener algo que hacer entre pacientes sin forzar el orden.
3. **Recetas descubiertas**: se aprenden al tener los objetos (ya funciona) y se refuerzan con los
   regalos de misión del día 1.

Rótulos de la mesa y la cocina: el prompt de interacción ya dice **E · Preparar** y **E · Cocinar**.

## 4. Economía: que el jugador sienta "me alcanza" sin sobrar

Tres sensaciones que quiero conseguir, en este orden:

1. **Alivio** (día 1): empiezas justo (4 monedas) pero lo obligatorio es barato. Todo avanza.
2. **Elección** (día 2): ya tienes un colchón (~26 + pagos) y el mercader enseña **algo que no
   necesitas pero quieres** (azúcar). Eliges entre una receta alternativa o guardar.
3. **Tensión amable** (día 3): lo necesario cuesta más (jarabes, tos, escorbuto), pero los pedidos
   y las alternativas baratas permiten llegar sin ahorrar de más.

### Curva propuesta (inventada; para tu revisión)

| Día | Entra (pagos) | Gasto obligatorio | Gasto de elección | Colchón al final |
|---|---|---|---|---|
| 1 | 25 + 4 iniciales | 3 (tela, sal) | 0 (el mercader no tiene extras) | ~26 |
| 2 | 29 | ~7 (tela, ajo, cebolla) | azúcar 5, hueso 2 | ~25-30 según elijas |
| 3 | ~30 + pedidos | ~14 (miel, jarabes) | pedidos y herrero | ~20 |
| 4 | visual, sin economía | 0 | 0 | — |

Reglas que se pueden **comprobar con pruebas** (como ya hacemos con el día 1):
- Con solo el pago de los pacientes, el obligatorio **siempre** está cubierto.
- Nunca se necesita más de lo que hay a la venta ese día.
- El colchón nunca supera ~40 monedas (si no, el dinero deja de importar; entonces suben precios
  de aspiración, no los obligatorios).

### Cómo se "siente" el precio

- Etiquetas de precio con la moneda nueva y el número en grande (ya está la interfaz de la tienda).
- Un objeto agotado **se oscurece** (ya funciona), el aspiracional **parpadea** una vez al
  alcanzar el precio por primera vez ("ya me alcanza").
- Al cobrar a un paciente, el contador sube con **+N** (ya funciona), con sonido de monedas
  (pendiente del gestor de sonido).
- El Doctor **piensa en voz alta** si le falta dinero ("tendría que ganarme algo antes"), sin bloquear:
  lo normal es que no le falte.

## 5. Orden de trabajo sugerido

1. **Moneda nueva** y rótulos Preparar/Cocinar (hecho en esta sesión, pendiente de que lo pruebes).
2. **Objetos de la fase A** (4 objetos + iconos con PixelLab) y sus 6 recetas, con textos ES/EN
   marcados para tu revisión.
3. **Mercader por días**: lista de existencias del día 2 (azúcar, cebolla, hueso) y comprobación
   automática de que el obligatorio sigue cubierto.
4. **Regalos de misión del día 1** (leñador, cocinero de la cantera, costurera).
5. **Tablón de pedidos** (versión mínima: 1-2 pedidos por capítulo).
6. **Fase B**: un oficio con producto propio por capítulo.
7. **Sonido**: monedas, fuego, mortero (primera versión silenciosa si faltan archivos).

## 6. Preguntas abiertas

- ¿El azúcar debe ser tan caro como para que el jugador dude (5 monedas, propuesta) o más
  asequible (3)?
- ¿Un paciente acepta **varios** tratamientos o pide uno concreto? (afecta a cuántas recetas
  importan).
- ¿Los pedidos van en un **tablón** o los pide cada vecino en persona?
- ¿Quieres que el dinero se pueda **perder** (multas, robos) o solo ganar y gastar? Propongo solo
  ganar y gastar.
