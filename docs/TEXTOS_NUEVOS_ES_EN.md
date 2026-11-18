# Textos nuevos para revisar (ES / EN) — 2026-11-15

Todo lo que ha escrito Claude y no está aprobado todavía. Español = voz canónica; el inglés es adaptación
natural. Cada tabla dice de qué fichero sale; para corregir, dime la clave y el texto nuevo (o cámbialo en
el fichero). Generado desde el código, así que lo que ves aquí es lo que sale en el juego.

## 1. Tutorial (src/game/i18n/tutorial.ts)

### Pasos del tutorial

| Clave | Español | English |
|---|---|---|
| goal.title[0] | Explora la ciudad y trata a los pacientes que lo necesiten. | Explore the town and treat the patients who need it. |
| goal.body | Esa es tu misión, Doctor. Te enseñaré lo imprescindible por el camino. | That is your mission, Doctor. I will teach you the essentials along the way. |
| book.title[0] | Pulsa  | Press  |
| book.title[1].action | book | book |
| book.title[2] |  para abrir tu libro. |  to open your book. |
| book.body | El Compendio es tu herramienta más importante: lo consultarás una y otra vez para reconocer dolencias, recordar preparados y repasar a tus pacientes. | The Compendium is your most important tool: you will consult it again and again to recognise ailments, recall preparations and review your patients. |
| book-cover.title[0] | Haz clic en el libro para abrirlo. | Click the book to open it. |
| book-cover.body | También puedes pulsar Espacio. | You can also press Space. |
| book-page.title[0] | Pasa de página con  | Turn the page with  |
| book-page.title[1].key | ◄ | ◄ |
| book-page.title[2] |   |   |
| book-page.title[3].key | ► | ► |
| book-page.title[4] | . | . |
| book-page.body | Estás en Ingredientes: todo lo que puedes recoger o comprar y para qué sirve cada cosa.<br>También puedes usar las flechas que hay junto a las páginas. | You are in Ingredients: everything you can gather or buy, and what each thing is for.<br>You can also use the arrows beside the pages. |
| book-preparations.title[0] | Abre la pestaña Preparados. | Open the Remedies tab. |
| book-preparations.body | Aquí se apuntan las recetas que vayas aprendiendo: qué mezclar, en qué estación y qué resulta. | Here go the recipes you learn: what to mix, at which station, and what comes out. |
| book-ailments.title[0] | Ahora, la pestaña Dolencias. | Now, the Ailments tab. |
| book-ailments.body | Todas las enfermedades que conoces: sus síntomas para reconocerlas y cómo se tratan. Te hará falta para diagnosticar. | Every illness you know: its symptoms, so you can recognise it, and how it is treated. You will need it to diagnose. |
| book-patients.title[0] | Y por último, Pacientes. | And last, Patients. |
| book-patients.body | La ficha de cada persona a la que atiendas: qué le pasa, qué necesita y cómo va su tratamiento. | The file of each person you treat: what is wrong, what they need and how the treatment is going. |
| book-close.title[0] | Pulsa  | Press  |
| book-close.title[1].action | book | book |
| book-close.title[2] |  o  |  or  |
| book-close.title[3].key | Esc | Esc |
| book-close.title[4] |  para cerrar el libro. |  to close the book. |
| book-close.body | Podrás volver a abrirlo siempre que lo necesites. | You can open it again whenever you need it. |
| map.title[0] | Mantén  | Hold  |
| map.title[1].action | map | map |
| map.title[2] |  para consultar el mapa. |  to check the map. |
| map.body | Te mostrará dónde estás y te ayudará a orientarte por la ciudad. | It shows where you are and helps you find your way around town. |
| move.title[0] | Usa  | Use  |
| move.title[2] |  o  |  or  |
| move.title[4] |  para moverte. |  to move. |
| move.body | Echa un vistazo a tu habitación. | Have a look around your room. |
| chest-approach.title[0] | Acércate al cofre. | Approach the chest. |
| chest-approach.body | Es tu almacén personal, en la esquina de la habitación. | It is your personal storage, in the corner of the room. |
| chest-interact.title[0] | Pulsa  | Press  |
| chest-interact.title[1].action | interact | interact |
| chest-interact.title[2] |  para interactuar. |  to interact. |
| chest-interact.body | Con {interact} hablas con las personas y usas los objetos del mundo.<br>Prueba con el cofre: ábrelo y toma el frasco vacío. | With {interact} you talk to people and use the objects of the world.<br>Try it on the chest: open it and take the empty flask. |
| take-flask.title[0] | Selecciona el frasco vacío para llevarlo contigo. | Select the empty flask to carry it with you. |
| take-flask.body | Lo necesitarás para recoger muestras. | You will need it to collect samples. |
| bar.title[0] | Tu inventario y tu dinero. | Your inventory and your money. |
| bar.body | La barra de abajo es lo que llevas encima: tiene pocas casillas, así que elige bien.<br>Las monedas, abajo a la derecha, sirven para comprar ingredientes a los comerciantes. | The bar below is what you carry: it has few slots, so choose wisely.<br>The coins, bottom right, are for buying ingredients from the merchants. |
| eye.title[0] | Ojo abierto, ojo cerrado. | Eye open, eye closed. |
| eye.body | El ojo de la barra de abajo la esconde cuando te estorba y la vuelve a mostrar. Los objetos siguen contigo aunque no los veas. | The eye on the bar below hides it when it gets in your way and shows it again. Your items stay with you even when you cannot see them. |
| exit-room.title[0] | Baja a la botica. | Go down to the apothecary. |
| exit-room.body | Sal de tu habitación por la puerta. | Leave your room through the door. |
| botica.title[0] | Dos lugares para preparar remedios. | Two places to prepare remedies. |
| botica.body | La mesa de alquimia (izquierda) sirve para mezclar y preparar a mano; el mortero se abre desde ella.<br>La cocina (arriba a la derecha) sirve para cocer y hervir. Acércate y pulsa {interact}. | The alchemy table (left) is for mixing and preparing by hand; the mortar opens from it.<br>The stove (top right) is for cooking and boiling. Step up and press {interact}. |
| exit-botica.title[0] | Sal a la calle. | Head out to the street. |
| exit-botica.body | Hay mucha ciudad por recorrer. | There is a whole town to explore. |
| fast-travel.title[0] | Botón de viaje rápido. | Fast travel button. |
| fast-travel.body | Arriba a la derecha: te lleva de vuelta a la botica al instante.<br>Después tarda dos minutos en recargarse; verás cómo se llena. | Top right: it takes you straight back to the apothecary.<br>Then it needs two minutes to recharge; you will see it fill up. |
| run.title[0] | Mantén  | Hold  |
| run.title[1].action | run | run |
| run.title[2] |  mientras te mueves para correr. |  while moving to run. |
| run.body | En interiores, mejor ir despacio. | Indoors, better take it slow. |

### Botón de continuar

| Clave | Español | English |
|---|---|---|
| label | Entendido | Got it |
| key | Enter | Enter |

## 2. Texto de la intro antes de empezar (src/game/i18n/introScreen.ts)

### Bloques de la intro

| Clave | Español | English |
|---|---|---|
| blocks[0] | La peste quedó atrás hace ya algunos años.<br><br>Se llevó consigo muchas vidas, pero no logró acabar con nosotros. Todavía quedan sus huellas: cruces borradas en las puertas, campanas que nadie se atreve a tocar y una máscara de pico que sigo llevando por costumbre. | The plague was left behind some years ago.<br><br>It took many lives, but it could not bring an end to us. Its marks remain: faded crosses on the doors, bells nobody dares to ring, and a beaked mask I still wear out of habit. |
| blocks[1] | Nuestro pequeño pueblo volvió a llenarse de voces, de pan caliente y de mercado los domingos.<br><br>Aprendimos a reír otra vez, casi con prisa, como quien teme que se lo quiten. Poco a poco, la normalidad regresó. | Our small village slowly filled again with voices, warm bread, and market days on Sundays.<br><br>We learned to laugh again, almost in a hurry, like people afraid it might be taken from them. Little by little, normal life returned. |
| blocks[2] | Yo seguí haciendo lo que siempre había hecho: hierbas, frascos y paciencia.<br><br>Hasta esta mañana. Alguien ha llamado a la botica antes de que saliera el sol, y no era un enfermo cualquiera. Era alguien que sabe lo que pasa cuando algo no encaja. | I carried on doing what I had always done: herbs, jars, and patience.<br><br>Until this morning. Someone knocked at the apothecary before sunrise, and it was no ordinary patient. It was someone who knows what happens when something does not fit. |

## 3. Cocina y tabla de cortar (src/game/i18n/crafting.ts)

### Crafteo (todo el bloque, incluye lo nuevo: Preparando…, tabla, volver)

| Clave | Español | English |
|---|---|---|
| title.manual | Preparar | Prepare |
| title.fire | Cocinar | Cook |
| title.mortar | Triturar | Grind |
| title.chop | Trocear | Chop |
| ingredients | Ingredientes | Ingredients |
| inventoryHeading | Inventario del Doctor | Doctor's inventory |
| action.manual | Preparar | Prepare |
| action.fire | Cocinar | Cook |
| action.mortar | Triturar | Grind |
| action.chop | Trocear | Chop |
| close | Cerrar | Close |
| noRecipe | Estos ingredientes no parecen combinar bien aquí. | These ingredients don't seem to combine well here. |
| noSpace | No tengo sitio para llevar esto. | I don't have room to carry this. |
| notNeeded | (Eso no lo necesito ahora.) | (I don't need that right now.) |
| neededElsewhere | (Eso me hace falta para otra cosa.) | (I need that for something else.) |
| mortar.label | Triturar | Grind |
| mortar.back | Mesa | Table |
| mortar.ingredient | Ingrediente | Ingredient |
| board.label | Trocear | Chop |
| board.back | Cocina | Kitchen |
| limitReached | Ya no caben más ingredientes. | No more ingredients fit. |
| preparing | Preparando... | Preparing... |
| preparingHint | Esc para cancelar | Esc to cancel |
| created | Has preparado | Prepared |
| closeModal | Cerrar | Close |

## 4. Fin del día y cama (src/game/i18n/dayEnd.ts)

### Fin de día

| Clave | Español | English |
|---|---|---|
| thoughts.chapter-1 | Creo que por hoy he hecho un buen trabajo. Debería descansar. | I think I've done a good day's work. I should get some rest. |
| thoughts.chapter-2 | Hoy ha dado mucho de sí, y ha salido bien. Será mejor que descanse. | Today gave a lot, and it went well. I'd better rest. |
| thoughts.chapter-3 | Estoy cansado, pero contento. Mañana será otro día: a descansar. | I'm tired, but glad. Tomorrow is another day: time to rest. |
| sign | Ve a la botica | Go to the apothecary |
| notYetSleepy | Aún queda trabajo por hacer. No es hora de dormir. | There is still work to do. It is not time to sleep. |
| rest.title | Fin del día | End of the day |
| rest.question | ¿Quieres dormir ya y pasar al día siguiente? | Do you want to sleep now and start the next day? |
| rest.sleep | Dormir | Sleep |
| rest.keep | Seguir explorando | Keep exploring |

## 5. Volumen (src/game/i18n/audio.ts)

### Control de sonido

| Clave | Español | English |
|---|---|---|
| volume | Sonido | Sound |
| mute | Silenciar | Mute |
| unmute | Activar | Unmute |

## 6. Objetos nuevos (src/game/items/items.ts)

| Id | Español | English |
|---|---|---|
| candle | Vela | Candle |
| chopped-onion | Cebolla troceada | Chopped onion |
| chopped-mushroom | Hongo troceado | Chopped mushroom |
| chopped-pine-mushroom | Seta de pino troceada | Chopped pine mushroom |
| crushed-garlic | Ajo machacado | Crushed garlic |

## 7. Diálogos nuevos

### Vela en la estatua de la plaza (statueCandle.ts)

| Quién | Español | English |
|---|---|---|
| doctor | Enciendo la vela al pie de la estatua. No sé a quién se la dedico: a todos, supongo. | I light the candle at the foot of the statue. I don't know who it's for: everyone, I suppose. |
| doctor | La llama se queda quieta, sin prisa. Hoy tampoco la tengo yo. | The flame stays still, in no hurry. Neither am I today. |
| doctor | Las plagas se llevan nombres. Una vela, al menos, recuerda dónde estaban. | Plagues take names away. A candle, at least, remembers where they were. |

### Bruja del claro, día 3, primera visita: hueso + hierba + menta (las 2 últimas líneas son nuevas) (chapter3WitchDialogues.ts)

| Quién | Español | English |
|---|---|---|
| personaje | Mira quién viene. Llegas tarde para las setas y pronto para lo demás, pero siempre eres bienvenido. | Look who's here. You're late for the mushrooms and early for the rest, but you're always welcome. |
| doctor | ¡Qué alegría verte! ¿Qué es lo demás? | How good to see you! What's the rest? |
| personaje | Depende de cuánto te guste preguntar. Y a ti te gusta mucho, lo sé. | It depends on how much you like asking. And you like it a lot, I know. |
| doctor | Veo que estás recogiendo setas. | I see you're picking mushrooms. |
| personaje | Qué ojo clínico, de verdad. ¿Por eso eres médico? | Such a clinical eye, truly. Is that why you're a doctor? |
| personaje | Toma, anda. Es para ti. | Here, go on. It's for you. |
| doctor | ¡Un hueso! Gracias. | A bone! Thank you. |
| personaje | Para caldo. Alguien va a tener frío y te lo va a pedir. | For broth. Someone is going to be cold and ask you for it. |
| doctor | ¿Quién? | Who? |
| personaje | Alguien con frío. | Someone cold. |
| doctor | Sigues sin responder, y aun así te sonrío. | You still don't answer, and I'm smiling anyway. |
| personaje | Te he dado un hueso. Es más que una respuesta, y más de lo que le doy a la mayoría. | I gave you a bone. That's more than an answer, and more than I give most people. |
| personaje | Llévate también menta y una hierba del claro. Unos tosen, otros sangran, y el trabajo te toca a ti. | Take some mint and an herb from the glade too. Some cough, others bleed, and the work falls to you. |
| doctor | Con eso tengo para un par de remedios. Gracias, de verdad. | That's enough for a couple of remedies. Thank you, truly. |

### Mujer del campamento de la cantera (chapter1Dialogues.ts)

| Quién | Español | English |
|---|---|---|
| personaje | Les traigo el almuerzo a estos. Si no, la piedra les sabe a pan, y el pan, a piedra. | I bring these lads their lunch. Otherwise the stone tastes like bread, and the bread like stone. |
| doctor | ¿Alguno anda con tos o con dolores? | Is anyone coughing or aching? |
| personaje | Todos, un poco. Pero hoy ninguno se ha quejado, y eso por aquí ya es salud. | All of them, a little. But today nobody has complained, and around here that counts as health. |

### Cantero apoyado en la pala (chapter1Dialogues.ts)

| Quién | Español | English |
|---|---|---|
| personaje | Apoyado en la pala se lleva mejor la mañana. La pala no se queja. | Leaning on the shovel the morning goes easier. The shovel doesn't complain. |
| doctor | ¿Y la espalda? | And your back? |
| personaje | La espalda sí. Pero a ella no le pregunta nadie. | My back does. But nobody asks it anything. |

### Cantero del taburete (chapter1Dialogues.ts)

| Quién | Español | English |
|---|---|---|
| personaje | Me siento un momento y el taburete ya me da la razón. | I sit for a moment and the stool already agrees with me. |
| doctor | ¿Tanto cansa partir piedra? | Does splitting stone tire you that much? |
| personaje | Cansa no partirla. Cuando uno para, es cuando se entera de todo. | What tires is not splitting it. It's when you stop that you notice everything. |

## 8. Recados voluntarios: día 1 (chapter1Errands.ts) y día 2 (chapter2Errands.ts)

**Llevar un paño frío al pescador del río** / Bring a cold cloth to the fisherman by the river (paga 3 monedas)

### Petición (primera vez) — chapter1.errand.fisherman.ask

| Quién | Español | English |
|---|---|---|
| personaje | Llevo toda la mañana al sol y ya no distingo si pica el pez o pica la cabeza. | I've been in the sun all morning and I can't tell whether it's the fish or my head that's biting. |
| doctor | Un paño frío en la nuca le sentará bien: agua fresca y un trapo limpio. | A cold cloth on the back of your neck will do you good: cool water and a clean rag. |
| personaje | Tráigamelo y le doy tres monedas. Es lo que he pescado hoy, que ya es decir. | Bring me one and I'll give you three coins. It's what I've caught today, which says it all. |

### Recordatorio — chapter1.errand.fisherman.reminder

| Quién | Español | English |
|---|---|---|
| personaje | ¿El paño? Sigo aquí, al sol, con la nuca ardiendo y la caña quieta. | The cloth? Still here, in the sun, my neck on fire and the rod still. |

### Entrega — chapter1.errand.fisherman.ready

| Quién | Español | English |
|---|---|---|
| doctor | Paño frío, recién mojado. Póngaselo en la nuca. | A cold cloth, freshly wetted. Put it on the back of your neck. |
| personaje | Qué alivio... Tome, tres monedas. Y no le cuente a los peces que me he sentado. | What a relief... Here, three coins. And don't tell the fish I sat down. |
| doctor | Su secreto está a salvo conmigo. | Your secret is safe with me. |

**Llevar jarabe de cebolla al anciano del cántaro** / Bring onion syrup to the old man with the jug (paga 9 monedas)

### Petición (primera vez) — chapter2.errand.elder.ask

| Quién | Español | English |
|---|---|---|
| personaje | Esta tos me acompaña desde que cambió el tiempo. Dicen que la cebolla con azúcar la espanta. | This cough has kept me company since the weather turned. They say onion with sugar scares it off. |
| doctor | Un jarabe de cebolla. Puedo prepararlo, y no le pediré que se lo beba con cara de héroe. | An onion syrup. I can make it, and I won't ask you to drink it with a hero's face. |
| personaje | Tráigamelo y le pago nueve monedas. Y no prometo ninguna cara. | Bring it to me and I'll pay you nine coins. And I promise no faces at all. |

### Recordatorio — chapter2.errand.elder.reminder

| Quién | Español | English |
|---|---|---|
| personaje | ¿Ya tiene el jarabe? La tos no espera, pero yo sí: estoy sentado. | Have you got the syrup yet? The cough won't wait, but I will: I'm sitting down. |

### Entrega — chapter2.errand.elder.ready

| Quién | Español | English |
|---|---|---|
| doctor | Aquí tiene el jarabe de cebolla, todavía templado. | Here's the onion syrup, still warm. |
| personaje | Huele a cocina de abuela. Nueve monedas, como quedamos. | It smells like grandmother's kitchen. Nine coins, as agreed. |
| doctor | Es un precio generoso para un jarabe. | That's a generous price for a syrup. |
| personaje | Es un precio justo por dormir esta noche. | It's a fair price for sleeping tonight. |

**Llevar caldo fuerte a la vecina de la panadería** / Bring strong broth to the bakery's neighbour (paga 2 monedas + sugar x1)

### Petición (primera vez) — chapter2.errand.bakery.ask

| Quién | Español | English |
|---|---|---|
| personaje | Mi vecina la panadera dice que su marido sigue flojo. Pan no le falta, pero el pan no es sustancia. | My neighbour the baker says her husband is still weak. He has no lack of bread, but bread isn't substance. |
| doctor | Un caldo fuerte, de cebolla y hueso. Así se le devuelve cuerpo a un convaleciente. | A strong broth, with onion and bone. That puts body back into a convalescent. |
| personaje | Si lo prepara, le doy un puñado de azúcar y dos monedas. De la panadería, claro: yo solo hago de mensajera. | If you make it, I'll give you a handful of sugar and two coins. From the bakery, of course: I'm only the messenger. |

### Recordatorio — chapter2.errand.bakery.reminder

| Quién | Español | English |
|---|---|---|
| personaje | ¿Y el caldo, doctor? Mi vecina pregunta cada mañana y ya no sé qué contestarle. | And the broth, doctor? My neighbour asks every morning and I no longer know what to tell her. |

### Entrega — chapter2.errand.bakery.ready

| Quién | Español | English |
|---|---|---|
| doctor | Caldo fuerte, de cebolla y hueso. Que se lo tome bien caliente. | Strong broth, with onion and bone. Have him drink it good and hot. |
| personaje | Se lo llevo en cuanto lo tenga. Tome: azúcar y dos monedas, como dije. | I'll take it to him as soon as I can. Here: sugar and two coins, as I said. |
| doctor | Con esto tengo para un jarabe y para ser feliz. | With this I have enough for a syrup and to be happy. |
| personaje | Lo primero, seguro. Lo segundo, ya veremos. | The first one, for sure. The second, we'll see. |

**Llevar una bebida rehidratante al hombre sentado de la calle de la taberna** / Bring a rehydration drink to the seated man on the tavern street (paga 9 monedas)

### Petición (primera vez) — chapter2.errand.seated.ask

| Quién | Español | English |
|---|---|---|
| personaje | Desde aquí veo salir a los de la taberna con la boca seca y la cabeza hecha un tambor. | From here I watch the tavern folk come out with dry mouths and heads like drums. |
| doctor | Agua con un poco de azúcar y sal repone lo que se pierde. Es un remedio humilde. | Water with a little sugar and salt puts back what's lost. A humble remedy. |
| personaje | Los humildes son los que funcionan. Tráigame una bebida de esas y le pago nueve monedas. | The humble ones are the ones that work. Bring me one of those drinks and I'll pay nine coins. |

### Recordatorio — chapter2.errand.seated.reminder

| Quién | Español | English |
|---|---|---|
| personaje | ¿La bebida? Aquí me tiene, sentado, esperando con paciencia y con sed. | The drink? Here I am, sitting, waiting with patience and with thirst. |

### Entrega — chapter2.errand.seated.ready

| Quién | Español | English |
|---|---|---|
| doctor | Bebida rehidratante: agua, azúcar y sal. Sabe a poco y hace mucho. | Rehydration drink: water, sugar and salt. It tastes of little and does a lot. |
| personaje | Como todo lo bueno de esta calle. Aquí tiene sus nueve monedas. | Like everything good on this street. Here are your nine coins. |
| doctor | ¿Se la bebe usted? | Will you drink it yourself? |
| personaje | Yo no. La guardo para el próximo que salga de la taberna arrepentido. | Not me. I'm keeping it for the next one who walks out of the tavern full of regret. |

## 9. Guía del día 1 (2026-11-15 y 16)

### Minero herido tras el diagnóstico (chapter1Patient3Dialogues.ts)

| Quién | Español | English |
|---|---|---|
| personaje | ¿Le hace falta carbón para el ungüento? Vaya al campamento de la cantera; allí se lo darán. | Do you need coal for the ointment? Go to the quarry camp; they'll give it to you there. |
| personaje | Gracias, iré a verlos. | Thank you, I'll go and see them. |

### Tabernera: llamada y jarra (chapter1TavernDialogues.ts)

| Quién | Español | English |
|---|---|---|
| personaje | Doctor, venga aquí. | Doctor, come over here. |
| personaje | He escuchado que necesita leche. Tome, llévese esta jarra y hable con mi hermana, en la granja. | I heard you need milk. Here, take this jar and talk to my sister at the farm. |
| personaje | Se lo agradezco. Iré a verla enseguida. | Thank you. I'll go and see her right away. |

### Cantero descansando en el suelo (nuevo, sustituye al de espaldas)

| Quién | Español | English |
|---|---|---|
| personaje | Perdone que no me levante, doctor. Hoy la piedra ha ganado. | Forgive me for not getting up, doctor. The stone won today. |
| doctor | ¿Tan duro ha sido el día? | Has the day been that hard? |
| personaje | Duro, no. Largo. Por eso me siento, a ver si se acorta. | Not hard: long. That's why I sit down, to see if it gets shorter. |

### Minero del camino (pista del carbón cambiada)

| Quién | Español | English |
|---|---|---|
| personaje | Si viene buscando trabajo, ha elegido mal la ropa. | If you're here looking for work, you picked the wrong clothes. |
| doctor | No vengo buscando trabajo, solo a saludar. | I'm not looking for work, just saying hello. |
| personaje | Entonces ha elegido muy bien la ropa. | Then you picked exactly the right clothes. |
| doctor | Por casualidad, ¿sabe dónde conseguir un poco de carbón limpio? | By any chance, do you know where I could get a little clean coal? |
| personaje | Pregunte en el campamento de la cantera, al que descansa sentado en el suelo. Siempre guarda un poco para su hoguera. | Ask at the quarry camp, the one resting on the ground. He always keeps a little for his fire. |

## 2026-11-16 — mercado, mochila, panadera y vecinos mudos (pendiente de tu revisión)

| Dónde | ES | EN |
|---|---|---|
| Tienda de frutas y verduras (saludo) | Todo de la huerta de esta mañana. Si algo no le gusta, es que no lo ha probado. | All from this morning's garden. If you don't like something, you haven't tried it. |
| Tienda de telas (saludo) | Retales, lino y lana. Lo que sobra de una cosa sirve para otra. | Scraps, linen and wool. What's left over from one thing serves for another. |
| Carnicería (saludo) | Huesos para el caldo y grasa para lo que haga falta. De la carne mejor no hablamos hoy. | Bones for the broth and fat for whatever's needed. Let's not talk about the meat today. |
| Vendedora de verduras (charla) | Naranjas, cebollas, ajos. Lo que no vendo hoy, lo vendo mañana, que la fruta es paciente. / Las cebollas ya nacen resignadas. | Oranges, onions, garlic. What I don't sell today I'll sell tomorrow; fruit is patient. / Onions are born resigned. |
| Vendedor de telas (charla) | Telas, retales y cuero. De lo que sobra de un abrigo sale un vendaje. / En mi oficio, tirar es un pecado. | Cloth, scraps and leather. What's left of a coat makes a bandage. / In my trade, throwing away is a sin. |
| Carnicero (charla) | Huesos para el caldo y grasa para lo que haga falta. De la carne, hoy mejor no hablamos. / Porque se me nota la cara de carnicero. | Bones for the broth and fat for whatever's needed. Let's not talk about the meat today. / Because I look too much like a butcher. |
| Costurera: mochila (día 2) | Usted es el que ayudó a mi marido en la taberna… Tome, la mochila la cosí con retales de sobra. Le cabe una cosa más. | You're the one who helped my husband at the tavern… Here, I sewed this backpack from leftover scraps. It holds one more thing. |
| Panadera: azúcar (día 2) | Espere, Doctor. Con lo de ayer le debo algo más que palabras: un puñado de azúcar del obrador. | Wait, Doctor. After yesterday I owe you more than words: a handful of sugar from the bakery. |
| Mujer de la calle de la botica | Pasa usted tanto por aquí que ya lo espero con el reloj en la mano. (+4 líneas) | You pass by so often that I wait for you with my watch in hand. (+4 lines) |
| Costurera (charla ambiental) | Remiendo lo que el pueblo rompe. Hoy es poco; ayer fue un abrigo y una paciencia. (+3 líneas) | I mend what the village breaks. Today it's little; yesterday it was a coat and a patience. (+3 lines) |
| Niña de la cometa (plaza) | No hay viento, pero la cometa no lo sabe. (+4 líneas) | There's no wind, but the kite doesn't know. (+4 lines) |
| Aldeano de espaldas, mercado (delante de la carnicería) | Llevo media hora mirando ese jamón y el jamón me mira a mí. / El jamón, pero no se lo cuente a nadie. | I've been looking at that ham for half an hour and the ham is looking back at me. / The ham did, but don't tell anyone. |
| Anciano de espaldas, mercado | Antes aquí solo había una pared. Ahora hay pared y gente, que es mejor. / A mi edad, mirar es la mitad de comprar. | There used to be only a wall here. Now there's a wall and people, which is better. / At my age, looking is half of buying. |
| Crafteo: ya tengo suficiente | (Ya tengo todos los que necesito.) | (I already have all I need.) |


## Dia 3: la gente que no tenia voz (18-nov, para revisar)

Una conversacion de 3 lineas por persona colocada, con la rareza sutil del dia (algo pequeno en las manos, respuestas tardias) sin nombrar nunca que es.

**chapter3.plaza.priest** (plaza-priest-praying-01)

| | ES | EN |
|---|---|---|
| Persona | Rezo por todos. Hoy cuesta: la mitad de la plaza mira al suelo y la otra mitad, a su mano. | I pray for everyone. It's hard today: half the plaza looks at the ground and the other half at their hand. |
| Doctor | ¿A su mano? | At their hand? |
| Persona | A algo pequeño que llevan. No he conseguido ver qué, y mira que tengo buena vista para lo que no se debe mirar. | At something small they carry. I haven't managed to see what, and I do have a good eye for what one shouldn't look at. |

**chapter3.plaza.prayingMan** (plaza-praying-man-side-01)

| | ES | EN |
|---|---|---|
| Persona | Chis. Estoy a mitad de una oración y a mitad de un pensamiento. | Shh. I'm halfway through a prayer and halfway through a thought. |
| Doctor | ¿Y cuál va ganando? | Which one is winning? |
| Persona | El pensamiento. Qué vergüenza. | The thought. How embarrassing. |

**chapter3.plaza.prayingYoungWoman** (plaza-praying-young-woman-01)

| | ES | EN |
|---|---|---|
| Persona | Pido que se me pase la prisa. | I'm asking for my hurry to pass. |
| Doctor | ¿Prisa por qué? | Hurry for what? |
| Persona | Por llegar. A todo. Sin saber adónde. | To arrive. Everywhere. Without knowing where. |

**chapter3.plaza.prayingOldWoman** (plaza-praying-old-woman-back-01)

| | ES | EN |
|---|---|---|
| Persona | No me hable ahora, hijo, que se me va el rezo. | Don't speak to me now, son, I'll lose my place. |
| Doctor | Perdone, vuelvo luego. | Forgive me, I'll come back later. |
| Persona | Ya se me ha ido. Dígame, ¿qué quería? | It's gone already. Tell me, what did you want? |

**chapter3.plaza.elderMan** (plaza-elderly-man-seated-01)

| | ES | EN |
|---|---|---|
| Persona | Aquí sentado se ve pasar todo. Antes también se oía. | Sitting here you see everything pass. It used to be heard, too. |
| Doctor | ¿Qué se oía? | What was there to hear? |
| Persona | Gente. Ahora pasan en silencio, con la cabeza gacha. Mi mujer y yo apostamos a ver quién levanta la vista primero. | People. Now they walk by in silence, heads down. My wife and I bet on who will look up first. |

**chapter3.plaza.elderWoman** (plaza-elderly-woman-seated-01)

| | ES | EN |
|---|---|---|
| Persona | Mi marido dice que usted levantará la vista al pasar. Yo, que no. | My husband says you'll look up as you pass. I say you won't. |
| Doctor | Pues ha perdido usted: la estoy mirando. | Then you've lost: I'm looking right at you. |
| Persona | Ay, qué vergüenza. Dos pasteles, entonces. | Oh, how embarrassing. Two pastries, then. |

**chapter3.tavernStreet.neighbour** (tavern-street-villager-woman-02-01)

| | ES | EN |
|---|---|---|
| Persona | Mi vecino lleva tres días sin darme los buenos días. Hoy le ha dicho "perdón" a la pared. | My neighbour hasn't said good morning in three days. Today he said "sorry" to the wall. |
| Doctor | ¿A la pared? | To the wall? |
| Persona | Iba mirando algo que llevaba en la mano y chocó con ella. Qué cosas. | He was looking at something he held and walked into it. Honestly. |

**chapter3.tavernStreet.topBoy** (tavern-street-boy-spinning-top-01)

| | ES | EN |
|---|---|---|
| Persona | ¡Mire, doctor! ¡Ya aguanta una vuelta entera! | Look, doctor! It can last a whole spin now! |
| Doctor | ¡Enhorabuena, qué puntería! | Congratulations, what a feat! |
| Persona | Nadie ha visto la vuelta entera. Todos miraban otra cosa. | Nobody saw the whole spin. Everyone was looking at something else. |

**chapter3.tavernInterior.drinker** (tavern-interior-villager-man-01-v2-01)

| | ES | EN |
|---|---|---|
| Persona | Pedí otra jarra y no sé si me la han servido. Estaba mirando algo. | I ordered another tankard and I don't know whether it was served. I was looking at something. |
| Doctor | ¿Mirando qué? | Looking at what? |
| Persona | Pues eso: que no lo recuerdo. | That's the thing: I can't remember. |

**chapter3.outskirts.washer** (outskirts-woman-washing-clothes-01)

| | ES | EN |
|---|---|---|
| Persona | El río trae hoy menos charla. Antes las lavanderas hablábamos más que el agua. | The river brings less chatter today. We washerwomen used to talk more than the water. |
| Doctor | ¿Y hoy? | And today? |
| Persona | Hoy solo se oye el agua. Y un zumbido pequeñito, que viene y va. | Today you only hear the water. And a tiny hum that comes and goes. |

**chapter3.mill.woman** (mill-farmland-villager-woman-02-01)

| | ES | EN |
|---|---|---|
| Persona | Salí a por huevos y volví a casa con la cesta vacía. Me entretuve. | I went out for eggs and came home with an empty basket. I got held up. |
| Doctor | ¿Con qué? | With what? |
| Persona | Con nada. Y no me di cuenta de cuánto rato. | With nothing. And I didn't notice how long it took. |

**chapter3.mill.stonecutter** (mill-farmland-stonecutter-shovel-01)

| | ES | EN |
|---|---|---|
| Persona | Me han mandado a cavar una zanja. Llevo la pala más tiempo en la mano que en la tierra. | They sent me to dig a ditch. I've held the shovel longer than I've put it in the ground. |
| Doctor | ¿Descansando? | Resting? |
| Persona | Pensando. Creo. Ya no distingo. | Thinking. I believe. I can't tell any more. |

**chapter3.bakeryStreet.basketWoman** (bakery-street-villager-woman-01-v2-01)

| | ES | EN |
|---|---|---|
| Persona | Llevo los huevos de la panadera y el pan de mi casa, y se me ha mezclado todo. | I'm carrying the baker's eggs and the bread for my house, and it's all got mixed up. |
| Doctor | Bueno, un huevo con pan es una comida. | Well, an egg with bread is a meal. |
| Persona | Eso mismo ha dicho mi marido, sin levantar la vista. | That's just what my husband said, without looking up. |

**chapter3.smithyStreet.ropeGirl** (smithy-street-girl-jump-rope-01)

| | ES | EN |
|---|---|---|
| Persona | ¡Treinta y dos sin fallar! | Thirty-two without a miss! |
| Doctor | ¡Qué barbaridad! ¿Quién lleva la cuenta? | Goodness! Who's counting? |
| Persona | Yo sola. Antes mi hermano contaba en voz alta. | Me, alone. My brother used to count out loud. |

**chapter3.smithyStreet.carpenter** (smithy-street-carpenter-workbench-01)

| | ES | EN |
|---|---|---|
| Persona | Corto recto, mido dos veces, y esta tabla me ha salido torcida. | I cut straight, I measure twice, and this board still came out crooked. |
| Doctor | Le pasa a los mejores. | It happens to the best. |
| Persona | Es que miré un segundo hacia otro lado. Con eso basta. | I looked away for just a second. That's all it takes. |

**chapter3.mountainPath.archerBoy** (mountain-path-child-bow-archer-01)

| | ES | EN |
|---|---|---|
| Persona | Les aviso "¡cuidado, flecha!" y ni se apartan. | I warn them "watch out, arrow!" and they don't even step aside. |
| Doctor | Qué descuido. ¿Sueles apuntar a alguien? | How careless. Do you ever aim at anyone? |
| Persona | ¡Qué va! Menos mal: ni me ven. | No way! Lucky for them: they don't even see me. |

**chapter3.mountainPath.swordBoy** (mountain-path-child-wooden-sword-01)

| | ES | EN |
|---|---|---|
| Persona | ¡Defiendo el camino! Nadie pasa sin mi permiso. | I'm defending the path! Nobody passes without my permission. |
| Doctor | ¿Puedo pasar yo? | May I pass? |
| Persona | Usted sí, que es el médico. Los demás ni me ven: van mirando algo. | You may, you're the doctor. The rest don't even see me: they're looking at something. |

**chapter3.quarry.visitor** (quarry-villager-man-02-v2-01)

| | ES | EN |
|---|---|---|
| Persona | Vine a cobrar una deuda y me he quedado mirando las piedras. | I came to collect a debt and ended up looking at the stones. |
| Doctor | Son muy mirables. | They're very lookable. |
| Persona | Antes no lo eran. Hoy me parecen más interesantes que mi dinero, y eso es mal síntoma. | They weren't before. Today they seem more interesting than my money, and that's a bad sign. |

**chapter3.quarry.minersWife** (quarry-villager-woman-02-v2-01)

| | ES | EN |
|---|---|---|
| Persona | Es mi marido. Se queja de las encías, no de lo que come: pan duro, siempre. | He's my husband. He complains about his gums, not about what he eats: hard bread, always. |
| Doctor | Eso me dice mucho. Gracias. | That tells me a lot. Thank you. |
| Persona | Le llevo caldo y ni lo prueba. Está distraído. | I bring him broth and he doesn't even taste it. He's distracted. |

---

## 18 nov: profundidad del Día 3, recados, anciano y guardado (todo NUEVO, pendiente de revisión)

Marca lo que cambiar. Origen entre corchetes.

### Pensamiento de apertura del Día 3 [dialogue/toolsRenewal.ts]
- ES: Cada día el pueblo parece un poco más cansado. Empezaré por preguntar a quien me mire.
- EN: Each day the village looks a little more tired. I'll start by asking whoever looks back at me.

### Rumores del panel R, antes de conocer al paciente [objectives/objectives.ts]
- Mujer del plumero: «Alguien tose sin parar en la calle de la panadería» / "Someone is coughing nonstop on the bakery street"
- Minero: «Un hombre descansa en la cantera, cansado y sin sonreír» / "A man rests at the quarry, tired and not smiling"
- Picapedrero: «Un picapedrero se sostiene el brazo en la cantera» / "A stonecutter is holding his arm at the quarry"
- Anciano del cántaro: «El anciano del cántaro lleva noches sin dormir» / "The old man with the jug has gone nights without sleep"

### Síntomas del diagnóstico, Día 3 (menos evidentes) [patients/diagnosis.ts]
- Plumero: «Un silbido al respirar y una tos seca que no cede, peor al caer la tarde. Se cansa al subir escaleras y dice que viene de un trabajo polvoriento.»
- Minero: «Está agotado y le duele la boca al masticar. Un arañazo viejo sigue abierto y su plato es siempre el mismo.»
- Picapedrero: «No puede girar el antebrazo y el codo está hinchado, de otro color, con la forma cambiada. Lo sostiene con la otra mano.»
- Anciano: «Ojeras, mal humor por cualquier cosa y dolor de cabeza. Cabecea de día, pero asegura que de noche no logra dormir.»
(EN en el mismo archivo, `DIAGNOSIS_SYMPTOMS`.)

### Anciano del cántaro, insomnio (cuarto caso) [dialogue/chapter3PatientDialogues.ts]
- Examen: «Buenas, doctor. Perdone si bostezo en su cara: llevo cuatro noches mirando el techo.» / «Peor: de día estoy despierto y de mal humor. Ayer le grité a una gallina.» / «Antes me dormía en la silla. Ahora hasta el jarro me parece ruidoso.»
- Cura: Doctor: «Infusión de menta y leche con miel, tibias, antes de acostarse. Y nada de contar gallinas.» / «¿Contar ovejas no vale?» / «Las ovejas sí. Las gallinas despiertan.»
- Después: «Anoche dormí de un tirón. Hasta soñé con la gallina, y me disculpé.»
- Esperando: «Sigo sin pegar ojo, doctor. El techo y yo ya nos conocemos demasiado.»
(La conversación completa y el EN están en el archivo.)

### Recados del Día 3 [dialogue/chapter3Errands.ts]
- Carpintero (paño frío, 4 monedas): «Corto recto, mido dos veces, y esta tabla me ha salido torcida. Y ahora, además, me martillea la cabeza.» Doctor: «Un paño frío en la frente le vendrá bien.» Paga: «Tome sus cuatro monedas.» Cierre del Doctor: «Y mida con la cabeza fresca, que la tabla se lo agradecerá.»
- Ancianos de la plaza (bebida rehidratante, 6 monedas): «Con tanto rezar y tanto sol, mi mujer y yo salimos de misa secos como una pasa.» Pago: «Los dos a medias, como siempre. Aquí tiene sus seis monedas.»
(Texto completo y EN en el archivo; ya coinciden los números con el pago real.)

### Pantalla de título, partida guardada [i18n/saveCopy.ts]
- Botones: «Continuar», «Partida». Panel: «Partida guardada», «Copiar partida», «Cargar texto pegado», «Cerrar».
- Mensajes: «Partida copiada. Pégala donde quieras guardarla.» / «Partida cargada. Pulsa «Continuar».» / «Ese texto no es una partida válida.» / «Aún no hay partida guardada: se guarda al empezar el día 2.»
