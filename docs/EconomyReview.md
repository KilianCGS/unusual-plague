# EconomyReview — toda la economía del juego (2026-11-16)

Escrito para Kilian. Las cifras salen de los datos reales del código (catálogo de objetos, recetas, pacientes, tratos con NPC, recados, tiendas y colocaciones de recogibles de los días 1–3), no de memoria. Día 4 aún no tiene pacientes ni objetos propios.

Regla de diseño: **todo objeto se usa al menos una vez** (a diferencia de las dolencias, que no tienen por qué salir todas), y no hay objetos inútiles en el catálogo.

Para ver el arte agrupado así, abre `/dev/items`: ya está reorganizado por función y marca los objetos sin uso.

## 1. Resumen en cuatro líneas

- El catálogo tiene **47 objetos** (eran 50: el 2026-11-16 se quitaron `mushroom-cream`, `citrus-syrup` y `chopped-pine-mushroom`, que nadie consumía, con sus 3 recetas y sus iconos). Hoy: 7 se recogen en el mundo, 6 los dan las personas, 9 se compran, 7 son pasos intermedios, 12 tratamientos de pacientes, 4 de cocina para recados y 2 recipientes.
- **Casi todos los objetos escasos tienen margen 0**: se compra o se recibe justo lo que se necesita (hierba, tela, sal, azúcar, hueso, naranja, menta, seta). Es intencionado («nada se puede perder») y el test de «no atasco» lo garantiza. Salvo sal, hueso, cebolla y azúcar, que tienen 1 de holgura (ver §5, que costó +6 monedas de pagos y topes diarios de compra).
- **Sin uso hoy: ninguno.** Las 3 recetas que no consumía nadie ya están eliminadas.
- `candle` sirve solo para la estatua de la plaza (opcional, cosmético) y `black-feather` espera al día 4 (la bruja la pide al final y no se gasta).

## 2. Materias primas: fuentes, unidades y usos

Leyenda de días: D1, D2, D3. «Margen» = fuente − uso. Dónde se compra: la **plaza** vende solo sal y azúcar; los tres puestos de la **calle del mercado** (verduras, telas, carnicería) venden el resto. Los precios y el stock son los de `shops.ts`.

| Objeto | De dónde sale (unidades) | Para qué se usa (unidades) | Margen |
|---|---|---|---|
| Hierba medicinal | Bosque 1 (D1) + 2 (D2); bruja D1 por seta 1; regalo de la bruja en el claro D3 1 = **5** | Pacientes: D1 2, D2 2, D3 1 = **5** | 0 |
| Tela | Puesto de telas (mercado), desde D1, stock **5**, 2 monedas | Pacientes D1 2, D2 1, D3 1; recado del pescador (paño frío) D1 1 = **5** | 0 |
| Alcohol | Cantinera (trato D1 y repetible) | Paciente D1 1, D3 1 | repetible |
| Agua | Frasco, ilimitada | Muchas recetas | ilimitada |
| Sal | Plaza, stock **4** (2 monedas); agradecimiento de la panadera D1 **1** = **5** | Pacientes D1 1 (sopa), D3 1 (caldo); recados: caldo de huesos 1, bebida rehidratante 1 = **4** | +1 |
| Seta | Mina 2 (D1) | Paciente D1 1; trueque con la bruja D1 1 = **2** | 0 |
| Miel | Apicultor (D1 y repetible según el caso) | Pacientes D1 1, D2 1, D3 2 | repetible |
| Carbón | Cantero del suelo D1 1; minero recuperándose (repetible) | Pacientes D1 1, D2 1 | repetible |
| Leche | Granjera D1 1 (por una naranja y un tarro) | Paciente D1 1 | 0 |
| Harina | Saco de la panadera (repetible) | Pacientes D2 1, D3 1 | repetible |
| Naranja | **Solo** el puesto de verduras (se quitaron las ramas del molino el 2026-11-16): stock **3**, **1 moneda**, tope acumulado 1 / 2 / 3 por día | Trueque con la granjera D1 1; pacientes D2 1, D3 1 = **3** | 0 |
| Menta | Claro 1 + casita 1 (D2); regalo de la bruja D3 1 = **3** | Pacientes D2 1, D3 2 = **3** | 0 |
| Resina | Bosque 1 (D1); vecina del molino (repetible) | Paciente D2 1 | repetible |
| Grasa animal | Regalo del leñador (repetible); carnicería desde D2, stock 1 (3 monedas) | Paciente D2 1 | repetible |
| Ajo | Puesto de verduras, desde D3: stock **1** (5 monedas) | Paciente D3 1 | 0 |
| Hueso | Carnicería desde D2, stock **3** (3 monedas); regalo de la bruja D3 **1** = **4** | Paciente D3 1; recados: caldo de huesos 1, caldo fuerte 1 = **3** | +1 |
| Azúcar | Plaza (comerciante) desde D2, stock **3** (5 monedas); recompensa del recado de la calle de la panadería **1**; regalo de la panadera D2 **1** = **5** | Pacientes D2 1, D3 1; recados: jarabe de cebolla 1, bebida rehidratante 1 = **4** | +1 (los recados son voluntarios) |
| Cebolla | Puesto de verduras desde D2, stock **3** (2 monedas) | Recados: jarabe de cebolla 1, caldo fuerte 1 = **2** | +1 |
| Seta de pino | Claro **2**, recogibles desde el día 1 (lo que no se recoge se queda en el suelo los días 2 y 3) | La bruja se queda 1 en D3 = **1** | +1 |
| Sanguijuela | Bruja (D2) 1 | Investigación del agricultor en el granero 1 | 0 |
| Tarro vacío | Cantinera 1 (D1) | Trueque con la granjera 1 | 0 |
| Frasco vacío | Empieza en el cofre del Doctor | Recipiente del agua | — |
| Pluma negra | Bruja D1 1 | Día 4: la bruja la pide al final y no se gasta | pendiente |
| Vela | Puesto de telas desde D2, stock 1 (1 moneda) | Solo la estatua de la plaza (opcional) | 0 |

## 3. Preparados: quién los usa

| Preparado | Receta | Uso |
|---|---|---|
| Infusión medicinal | agua + hierba (fuego) | Pacientes D1 (marido de la panadera), D2 (agricultor) |
| Paño frío | agua + tela | Paciente D1; recado del pescador D1 (3 monedas) |
| Sopa de setas | agua + sal + seta picada | Paciente D1 |
| Leche con miel | leche + miel | Paciente D1 |
| Venda desinfectada | tela + alcohol | Pacientes D1, D3 |
| Ungüento medicinal | hierba triturada + carbón triturado | Paciente D1 |
| Cataplasma | pasta medicinal + harina | Pacientes D2, D3 |
| Compresa medicinal | base de ungüento + tela | Paciente D2 |
| Suspensión de carbón | carbón triturado + agua | Paciente D2 |
| Bebida de cítricos | naranja + agua + azúcar | Pacientes D2, D3 |
| Infusión de menta | agua + menta | Pacientes D2, D3 (y paso de jarabe balsámico) |
| Jarabe balsámico | infusión de menta + miel + ajo triturado | Paciente D3 |
| Caldo de huesos | hueso + agua + sal | Paciente D3; recado de la cantera (8 monedas) |
| Jarabe de cebolla | cebolla picada + azúcar | Recado del anciano del cántaro D2 (9 monedas) |
| Caldo fuerte | cebolla picada + hueso + agua | Recado de la calle de la panadería D2 (2 monedas + 1 azúcar) |
| Bebida rehidratante | agua + azúcar + sal | Recado del hombre sentado D2 (9 monedas) |
| Pasos intermedios | hierba/carbón/ajo triturados, cebolla/seta picadas, pasta medicinal, base de ungüento | Alimentan los de arriba |

## 4. Decisiones de hoy y cómo quedan

- **Mercado de la calle (3 puestos, ya colocados y conectados).** Diseño: frutas y verduras (naranja desde el día 1, cebolla desde D2, ajo desde D3), telas y cueros (tela desde el día 1, vela desde D2) y carnicería (hueso y grasa animal desde D2). **El comerciante de la plaza se queda solo con sal y azúcar**, como «especias difíciles de conseguir».
- **Mercado conectado (2026-11-16):** la calle de la botica sale al este hacia el mercado y la granja al oeste; el mercado enlaza con las dos. **La plaza ya vende solo sal y azúcar**; la tela, la cebolla, el hueso, el ajo y la vela se compran en los puestos. El día 1 compra la tela en el puesto de telas.
- **Naranjas:** se quitaron las dos ramas del molino. Solo se compran en el puesto de verduras, a 1 moneda, desde el día 1 (el arte de la rama sigue registrado, sin colocar).
- **Tope de compra por día** (nuevo, `capByChapter` en `shops.ts`): cuántas unidades acumuladas se pueden haber comprado al acabar cada día. Naranja 1 / 2 / 3; sal 2 el día 1 y 4 desde el día 2; tela 3 / 4 / 5; azúcar, cebolla y hueso, tope desde el día 2 (2 y luego 3). Sirve para que nadie gaste el monedero inicial en sobrantes y se quede sin poder curar al primero.
- **Panadera:** da 1 azúcar (además de la sal del día 1) en su primera conversación del día 2 tras ofrecerte la harina, con flag propio. No lo he metido el día 1 porque la entrega de la sal está muy fijada por tests y por el momento de la entrega.
- **Crafteo limitado por día (nuevo):** el Doctor puede preparar lo que necesitan los pacientes **del día**, aunque aún no los haya conocido (por ejemplo, el paño frío antes de examinar al marido de la panadera), hasta la cantidad que se usará. Lo que ningún paciente del día pide sale «(Eso no lo necesito ahora.)»; lo que el día sí pide pero ya lleva todo sale «(Ya tengo todos los que necesito.)». Los recados voluntarios solo cuentan una vez aceptados. Junto con el tope de compra por día, esto es lo que impide gastar ingredientes escasos en cosas que no hacen falta.
- **Mochila de la costurera (D2):** +1 hueco (9 en total), al hablar con ella, sin recado.
- **Eliminados** `mushroom-cream`, `citrus-syrup`, `chopped-pine-mushroom`, sus 3 recetas, sus iconos y sus páginas del libro. El libro queda con 23 recetas: la última hoja derecha queda en blanco al ser impar.

## 5. Holgura (1 de sobra) y por qué hubo que subir los pagos

Sal, hueso y cebolla tienen ahora **1 unidad de más**; el azúcar ya la tiene por el regalo de la panadera. Una unidad de más cuesta monedas, y el test de «no atasco» demostró que con los pagos de antes un jugador que las compraba se quedaba sin dinero para una compra obligatoria (51 monedas sin recados frente a 54 de stock total). Por eso, con tu visto bueno, se subieron los pagos (**+6 monedas en total**), y tenían que llegar pronto: probé el extra en el día 3 y seguía atascándose. Al quitar las naranjas gratis hizo falta además el tope diario de compra y un pago más.

| Paciente | Antes | Ahora |
|---|---|---|
| Marido de la panadera (D1) | 3 | 4 |
| Minero herido (D1) | 6 | 7 |
| Leñador (D2) | 3 | 4 |
| Herrero (D2) | 4 | 6 |
| Agricultor (D2) | 6 | 7 |

El reparto evita los múltiplos de 5 (regla de los tests). Hay unos 347 000 estados revisados (todas las compras posibles, con los topes diarios) y ninguno atasca.

## 6. Riesgos que quedan

1. **`candle`** solo sirve para una escena cosmética (la estatua de la plaza). Cuenta como «usada», pero es el uso más flojo. Opción: dejarla o darle función en el día 4.
2. **`black-feather`** espera al día 4; cuando se coloque, queda usada.
3. **Todo lo repetible** (miel, harina, carbón, resina, alcohol, grasa) no puede quedarse corto.
4. **El día 1 depende del mercado:** la tela solo se compra allí. Está conectado y comprobado por tests de datos; falta jugarlo.

## 7. Cómo se mantiene esto

- Los tests (`economy-no-deadlock`, `day2-playthrough`, `market-street`) leen los datos reales. Si cambia una cifra, fallan.
- Este documento es una foto de hoy. Si cambia el stock, un precio o un trato, actualízalo.
- Antecedente: `docs/ECONOMY_REVIEW_NOV13.md` (más corto, de antes del mercado y de los recados).
