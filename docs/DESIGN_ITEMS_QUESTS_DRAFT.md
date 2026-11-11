# Borrador: más objetos, cocina medicinal y misiones (día 1)

**Estado: BORRADOR para que lo corrijas.** Solo lo marcado con ✅ lo has aprobado
tú. Todo lo demás son propuestas mías: nombres, precios, usos, líneas de diálogo
y cantidades están pendientes de tu decisión. No hay nada implementado.

## 1. Lo decidido (✅)

- ✅ Cocina medicinal: más comida además de medicinas.
- ✅ Hasta 8 objetos nuevos, algunos solo ingredientes. El mercader tendrá más cosas.
- ✅ El mercader vende **sal** (1 moneda) y el Doctor empieza con **4 monedas** (hoy 3).
  El agradecimiento de la panadera pasa a ser un extra.
- ✅ Misiones del día 1: una en cada zona nueva (bosque profundo, cantera) y una
  del pueblo. Cada una da ingredientes y una conversación que cuente algo.
- ✅ El leñador pasa al fondo del bosque. El bosque profundo da resina y/o setas.
- ✅ La cantera: más personajes y más ingredientes.
- Tus fotos de las dos zonas nuevas ya existen; faltan colliders, salidas, spawns y
  decoración, que son tuyos.

## 2. ¿Cuesta mucho? Lo que sí y lo que no

| Parte | Esfuerzo | Notas |
|---|---|---|
| Objetos y recetas en datos (`items.ts`, `recipes.ts`) | Bajo | Las reglas del mortero, la guarda de "no lo necesito" y la guía de ingredientes ya funcionan con datos |
| Reorganizar tratamientos de pacientes | Bajo-medio | Es cambiar `requiredTreatments`; cuesta más reescribir los diálogos que los nombran |
| Mercader con más cosas | Bajo | Ya existe la tienda y su pantalla |
| 8 iconos de inventario y 8 ilustraciones del Compendio | **Medio** | Con Codex, como el mapa. El Compendio tiene las páginas de ingredientes llenas: hace falta una página nueva y ajustar su test |
| Textos ES/EN (nombres, descripciones, diálogos de misiones) | **Medio** | Los marco todos para tu revisión |
| Equilibrio entre días | **Lo difícil** | Es tu observación: ingredientes ↔ crafteo ↔ dolencias ↔ motivo para explorar |

El equilibrio se puede **comprobar con tests**, no solo a ojo. Ya hay uno para el
día 1 (`tests/day1-solvable.test.mjs`): con las fuentes que existen, los pacientes se
pueden completar y las monedas alcanzan. Lo ampliaré a los días 2 y 3.

## 3. Propuesta de 8 objetos (cocina medicinal)

Edad media: sin patata ni tomate. Origen y precio son propuestas.

| Objeto | Origen | Receta nueva | Para qué dolencia |
|---|---|---|---|
| Cebada | Molino / granja | Agua de cebada (cebada + agua), fuego | Fiebre, alternativa a la infusión |
| Huevo | Mujer de la granja | Yema con miel (huevo + miel), mesa | Agotamiento |
| Cebolla | Granja o mercader | Jarabe de cebolla (cebolla + miel), fuego | Tos, alternativa al jarabe balsámico |
| Vinagre | Mercader (monedas) | Compresa de vinagre (vinagre + tela), mesa | Heridas, fiebre alta |
| Setas de pino | Bosque profundo | Caldo de setas (setas + agua + sal), fuego | Estómago, agotamiento |
| Bayas | Bosque profundo | Jarabe de bayas (bayas + miel), fuego | Escorbuto |
| Hueso para caldo | Campamento de la cantera | Caldo de huesos (hueso + agua + sal), fuego | Agotamiento, estómago |
| Corteza de sauce | Bosque profundo | Infusión de sauce (agua + corteza), fuego; la corteza se tritura en el mortero | Fiebre y dolor |

El mortero sigue la regla acordada: solo tritura (corteza, ajo, hierba, carbón).
Las mezclas se hacen en la mesa o al fuego.

**Mercader (propuesta):** sal 1, tela 1 (×3), ajo 2 (ya aprobado), vinagre y cebolla
(precios por decidir; no redondos). Todo lo que vende sirve para avanzar.

## 4. Dolencias y tratamientos

El Compendio ya promete más variedad que la que usan los pacientes: "sopa ligera,
leche con miel o un preparado de carbón" para el estómago; infusión de menta o
jarabe balsámico para la tos; bebida cítrica para escorbuto y agotamiento. Los
objetos nuevos se apoyan en eso, sin cambiar el texto del libro.

| Dolencia | Hoy (requerido) | Alternativas con objetos nuevos |
|---|---|---|
| Fiebre común | infusión medicinal + paño frío | agua de cebada, infusión de sauce, compresa de vinagre |
| Mal del estómago | sopa de setas + leche con miel | caldo de setas, caldo de huesos |
| Herida infectada | vendaje desinfectado + ungüento | compresa de vinagre |
| Tos del pecho (día 3) | por definir | jarabe de cebolla, infusión de menta, jarabe balsámico |
| Escorbuto (día 3) | por definir | jarabe de bayas, bebida cítrica |
| Agotamiento | bebida cítrica + infusión de menta | yema con miel, caldo de huesos |

Pregunta de diseño: ¿el paciente exige un tratamiento concreto, o varios valen
(el jugador elige según lo que tenga)? Lo segundo da más libertad, pero complica
los diálogos que nombran el objeto.

## 5. Misiones del día 1 (esbozo, sin texto final)

Todas son **opcionales**: no bloquean a los pacientes.

| Dónde | Quién | Pide (idea) | Da (idea) | Conversación |
|---|---|---|---|---|
| Fondo del bosque | Leñador | Algo sencillo de la botica para el cansancio | Corteza de sauce y resina | El bosque, la bruja, por qué trabaja tan lejos |
| Cantera | Capataz | Un recado o un preparado pequeño | Hueso para caldo | Los mineros, los derrumbes, el campamento |
| Pueblo | Costurera de la calle de la botica | Algo pequeño | Tela (ahorra una moneda) | Noticias de panadera y taberna |

El leñador de la jornada 2 es un paciente (agotamiento). Si pasa al fondo del bosque,
su sitio y su ruta cambian también en el capítulo 2; hay que decidirlo.

## 6. Reglas de equilibrio que vigilarán los tests

1. En cada día, todo lo que piden los pacientes sale de fuentes reales (recogidas,
   trueques, mercader, misiones) y las monedas cubren el gasto obligatorio.
2. Las misiones no son obligatorias: sin ellas el día se completa.
3. Cada zona nueva aporta al menos una cosa útil y alcanzable (lo comprueba el
   verificador de alcanzabilidad cuando tengan colliders).
4. Cada objeto nuevo tiene al menos una receta y un uso (paciente, alternativa o misión).
5. Sin callejones: ningún objeto necesario queda solo detrás de otro opcional.

## 7. Preguntas abiertas

- ¿Qué objetos de los 8 te gustan, cuáles cambiarías y cuáles faltan?
- ¿Un tratamiento por dolencia o varios válidos?
- ¿El leñador sigue siendo paciente el día 2 en el fondo del bosque?
- ¿La costurera es la vecina del día 1 o prefieres otra persona?
- Precios del mercader (invento valores no redondos para tu revisión).
- Orden de trabajo: primero datos y mercader, luego arte (Codex), luego misiones
  cuando lleguen los colliders de las dos zonas.
