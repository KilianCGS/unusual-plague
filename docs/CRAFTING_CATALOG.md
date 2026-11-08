# Preparados existentes: recetas y cadenas

Las 15 salidas usan objetos que ya estaban en el catálogo. No se han añadido
ingredientes, preparados ni iconos. Las siete recetas previas se conservan.
Las ocho recetas pendientes quedan implementadas como reglas de juego.

| Preparado | Ingredientes (una unidad de cada uno) | Estación |
| --- | --- | --- |
| Vendaje desinfectado | Tela + alcohol | Mesa |
| Pasta medicinal | Hierba medicinal + miel | Mesa |
| Ungüento medicinal | Hierba medicinal + carbón | Mesa |
| Sopa ligera | Agua + sal + hongo | Fuego |
| Leche con miel | Leche + miel | Fuego |
| Infusión medicinal | Agua + hierba medicinal | Fuego |
| Paño frío | Agua + tela | Mesa |
| Infusión de menta | Agua + menta | Fuego |
| Jarabe balsámico | Infusión de menta + miel + ajo | Fuego |
| Base de ungüento | Grasa animal + resina | Fuego |
| Cataplasma | Pasta medicinal + harina | Mesa |
| Compresa medicinal | Base de ungüento + tela | Mesa |
| Carbón triturado | Carbón | Mesa |
| Suspensión de carbón | Carbón triturado + agua | Mesa |
| Bebida cítrica | Naranja + agua | Fuego |

## Cadenas de dos operaciones

- Agua + menta → infusión de menta → jarabe con miel y ajo.
- Hierba + miel → pasta → cataplasma con harina.
- Grasa + resina → base → compresa con tela.
- Carbón → carbón triturado → suspensión con agua.

Una receta produce una unidad. La mesa mantiene sus dos huecos y el fuego sus
tres. Solo la receta de triturar carbón permite procesar una única unidad.
Los recipientes de agua siguen la transacción existente: se devuelve el frasco
al consumir su última unidad, si hay espacio; si no lo hay, no se consume nada.

## Libro y materiales

Los preparados conocidos se muestran de uno en uno por hoja: dos fichas por
apertura. Cada ficha conserva imagen, nombre, descripción, uso, ingredientes,
estación, pasos previos y disponibilidad en la bolsa. Las 15 recetas ocupan ocho
aperturas; la última hoja derecha queda vacía. Las recetas desconocidas no se
muestran.

Conocer una receta final hace visibles también las recetas intermedias necesarias.
Los preparados encadenados indican «Preparar antes» en ES/EN. El cálculo de
materiales recorre la cadena, suma necesidades compartidas, descuenta preparados
ya llevados y redondea por lotes después de sumar. No cuenta dos veces un mismo
intermedio. Se conserva el orden de las pistas del Día 1.

## Límites actuales

- Aprender recetas al obtener ingredientes ya está activo: hierba, tela,
  alcohol, hongo, leche, miel, carbón, menta, ajo, resina, grasa, harina y naranja
  revelan preparaciones relacionadas. Agua, recipientes y sanguijuela no revelan
  recetas. Recibir/fabricar un preparado enseña también su receta.
- El conocimiento se conserva durante la sesión aunque se gasten o guarden los
  objetos. Las operaciones fallidas no enseñan recetas. Examinar pacientes
  y acertar su diagnóstico sigue siendo otra vía de aprendizaje. Equivocarse no
  consume materiales ni revela recetas del caso; permite repasar síntomas y
  consultar el libro. Una notificación ES/EN indica cuándo
  consultar Preparados, y las páginas muestran disponibilidad en la bolsa.
- Leñador: bebida cítrica + infusión de menta. Herrero: cataplasma + compresa
  medicinal. Examen, entrega y conversación posterior ya están conectados.
- Fuentes para estos dos casos: granjera (naranja, menta, hierba y grasa),
  panadera (harina y miel), vecino del molino (resina y tela), río (agua con el
  frasco). Dan lo que falta para pacientes examinados sin depender de regalos
  del Día 1. Sin espacio, no se pierde material y se puede volver.
- Otras fuentes del catálogo y los casos del Día 3 siguen pendientes.
- Agricultor: examen → sanguijuela → muestra registrada en el libro → análisis
  desde la mesa de la botica → suspensión de carbón + infusión medicinal.
  Minero recuperado: carbón; granjera: hierbas; río: agua. El análisis y la
  entrega tienen protección contra repeticiones; no se añade otro item al catálogo.
- No se han añadido antídotos, tónicos ni papillas que no existieran en el catálogo.

## Prueba rápida

`/dev/crafting` incluye presets para cataplasma (`chain set`), jarabe
(`syrup chain`), compresa (`compress chain`), suspensión (`charcoal chain`)
y bebida cítrica (`citrus drink`). Son inventarios desechables de prueba.
