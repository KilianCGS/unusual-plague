import type { LocalizedConversation } from "./localizedConversation";

// 2026-11-13: warmth pass on the Doctor's lines (his new voice: cheerful, close, serene). New
// text, awaiting Kilian's review; the conversations keep their ids, items and missions.
const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): [string, LocalizedConversation] => [id, { id, lines }];

export const chapter2AmbientDialogues: Record<string, LocalizedConversation> = Object.fromEntries([
  talk("chapter2.bakery.baker", [
    npc("Mi marido ha querido bajar a ayudar esta mañana. Ha llegado hasta la escalera y ya se ha puesto a dar órdenes.", "My husband wanted to come down and help this morning. He made it as far as the stairs before he started giving orders."),
    doctor("¿Ha vuelto a acostarse? Me alegra que ya quiera ayudar.", "Has he gone back to bed? I'm glad he already wants to help."),
    npc("Le he dicho que vigile el techo. Es lo único que no puede estropear desde allí.", "I told him to keep an eye on the ceiling. It's the only thing he can't spoil from up there."),
    doctor("Que recupere las fuerzas con calma antes de volver al horno.", "Let him get his strength back, calmly, before returning to the oven."),
    npc("Ya le he guardado un pan. Para que no diga luego que le quito el trabajo y el desayuno.", "I've saved him a loaf. So he can't say I've taken away both his work and his breakfast."),
    doctor("Está en las mejores manos, desde luego.", "He's in the best hands, no doubt."),
    npc("Eso no se lo diga. En cuanto se encuentre bien, volverá a quejarse de la corteza.", "Don't tell him that. The moment he's well, he'll be complaining about the crust again."),
  ]),
  talk("chapter2.bakeryStreet.man", [
    npc("Llevamos un rato decidiendo de quién es el turno de comprar el pan.", "We've been deciding whose turn it is to buy the bread for a while now."),
    doctor("La panadería está ahí mismo.", "The bakery is right there."),
    npc("Precisamente. Si estuviera lejos, ya tendríamos una excusa.", "Exactly. If it were far away, at least we'd have an excuse."),
    doctor("Mientras deciden, se enfría. ¡Qué pena, con lo bien que huele!", "It's getting cold while you decide. What a pity, it smells so good!"),
    npc("Eso ha dicho ella. Creo que va ganando.", "That's what she said. I think she's winning."),
  ]),
  talk("chapter2.bakeryStreet.woman", [
    npc("Antes reconocía la hora por las campanas. Ahora, por el olor del horno.", "I used to tell the time by the bells. Now I go by the smell from the oven."),
    doctor("¿Y qué hora es, entonces?", "And what time is it, then?"),
    npc("Demasiado tarde para que quede la hogaza que me gusta.", "Too late for my favourite loaf to be left."),
    doctor("Entonces su reloj va un poquito atrasado, pero qué manera tan bonita de llevar el tiempo.", "Then your clock's running a little slow, but what a lovely way to keep time."),
    npc("Mi reloj funciona. El que iba a entrar a comprar sigue hablando.", "My clock works. The one who was meant to go in and buy it is still talking."),
  ]),
  talk("chapter2.farm.woman", [
    npc("Ya ve. Aunque una salga corriendo a buscar al médico, las gallinas no se dan por enteradas.", "There you are. Even when you run off to fetch the doctor, the hens take no notice."),
    doctor("Algunas cosas siguen su curso, y eso también tranquiliza.", "Some things carry on as usual, and that's reassuring too."),
    npc("Y menos mal. Les echo el grano y, por un momento, sé exactamente qué tengo que hacer.", "Thank goodness. I scatter their grain and, for a moment, I know exactly what I ought to be doing."),
    doctor("¿Hay alguien con el agricultor? Quisiera ir a verlo enseguida.", "Is someone with the farmer? I'd like to go and see him right away."),
    npc("Sí. No lo hemos dejado solo. Cuando pueda, pase por el granero.", "Yes. We haven't left him alone. Call at the granary when you can."),
  ]),
  talk("chapter2.forest.woodcutter", [
    npc("Si viene por leña, hoy tendrá que negociar con el árbol.", "If you've come for firewood, you'll have to negotiate with the tree today."),
    doctor("Venía a ver por qué el hacha está en el suelo. ¿Se encuentra bien?", "I came to see why your axe is on the ground. Are you all right?"),
    npc("Pesaba lo de siempre esta mañana. Ahora parece que alguien le ha echado piedras dentro.", "It weighed what it always does this morning. Now it feels as if someone's filled it with stones."),
    doctor("¿Cuánto tiempo lleva trabajando?", "How long have you been working?"),
    npc("Iba a terminar un tronco más. He dicho eso unas cuantas veces.", "I was going to finish one more log. I've said that a few times."),
    doctor("Ha hecho muy bien en sentarse. Eso es sensatez, no rendirse.", "You were quite right to sit down. That's good sense, not surrender."),
    npc("No se lo cuente al tocón. Ya bastante orgulloso está de haberme ganado.", "Don't tell the stump. It's already pleased enough with itself for getting the better of me."),
  ]),
  talk("chapter2.mill.neighbour", [
    npc("Hoy me han dejado pendiente de las herramientas. No sabía que podían faltar tantas sin moverse del sitio.", "They've left me in charge of the tools today. I didn't know so many could go missing without leaving the place."),
    doctor("¿Busca alguna en particular?", "Are you looking for one in particular?"),
    npc("Busco la que me han pedido. El problema es que cada uno la llama de una manera.", "The one they asked for. Trouble is, everyone calls it something different."),
    doctor("¿El agricultor está en el granero?", "Is the farmer in the granary?"),
    npc("Sí. Él sabría cuál es. Hoy no voy a molestarlo por eso.", "Yes. He'd know which one it was. I'm not going to bother him with that today."),
  ]),
  talk("chapter2.mine.recoveringMiner", [
    npc("No me mire así. Estoy usando los brazos, no la pierna.", "Don't look at me like that. I'm using my arms, not my leg."),
    doctor("Su pierna sigue viniendo al trabajo con usted, y se queja con razón.", "Your leg still comes to work with you, and it complains with reason."),
    npc("He escogido la piedra más blanda.", "I've picked the softest rock."),
    doctor("Haga pausas, se lo ruego. Y no dé por terminado el cuidado solo porque haya bajado el dolor.", "Take breaks, please. And don't stop looking after it just because the pain has eased."),
    npc("Mi compañero también me lo dice. Creo que disfruta mandándome más que picando.", "My mate says that too. I think he enjoys ordering me about more than mining."),
    doctor("Por una vez, hágale caso. Se nota que le aprecia.", "Listen to him, for once. It's clear he thinks the world of you."),
  ]),
  talk("chapter2.cave.witch", [
    npc("Sabía que acabarías encontrando este sitio.", "I knew you'd find this place eventually."),
    doctor("¡Qué alegría verte! Tu farol ayuda bastante.", "How good to see you! Your lantern helps considerably."),
    npc("Me gusta escuchar el agua aquí. Arriba siempre hay alguien explicando algo.", "I like listening to the water here. Up above, someone's always explaining something."),
    doctor("¿Y abajo no? Pues aquí se está de maravilla.", "And down here they don't? Well, it's lovely down here."),
    npc("Abajo puedo fingir que no te he oído.", "Down here I can pretend I didn't hear you."),
    doctor("El gato tampoco parece sorprendido de verme.", "The cat doesn't look surprised to see me either."),
    npc("Él te ha oído llegar mucho antes. Yo solo llevo el farol.", "He heard you coming long before I did. I just carry the lantern."),
  ]),
  talk("chapter2.outskirts.young", [
    npc("Me ha dicho que, si hablo, espanto los peces.", "He says I scare the fish away if I talk."),
    doctor("¿Ha probado a guardar silencio? A veces el agua habla mejor.", "Have you tried keeping quiet? Sometimes the water speaks better."),
    npc("Sí. Entonces me ha dicho que no me mueva.", "Yes. Then he told me not to move."),
    doctor("Parece una actividad exigente, pero también muy serena.", "Sounds like a demanding occupation, but a very peaceful one."),
    npc("Llevo toda la mañana ayudando y ni siquiera me deja sujetar la caña.", "I've been helping all morning and he won't even let me hold the rod."),
  ]),
  talk("chapter2.outskirts.fisherman", [
    npc("Antes venía aquí para estar solo. Ahora viene este a preguntarme por qué.", "I used to come here to be alone. Now this one comes along to ask me why."),
    doctor("Tal vez quiera aprender de usted. Eso es un cumplido.", "Perhaps he wants to learn from you. That's a compliment."),
    npc("Entonces que mire el agua. Llevo media vida mirándola y aún me enseña cosas.", "Then he should watch the water. I've been watching it half my life and it still teaches me things."),
    doctor("Eso podría decírselo; seguro que le encantaría.", "You could tell him that; I'm sure he'd love it."),
    npc("Se lo dije. Me preguntó cuántas.", "I did. He asked how many."),
  ]),
  talk("chapter2.smithy.blacksmith", [
    npc("Pase. Hoy el hierro está teniendo un día mejor que yo.", "Come in. The iron's having a better day than I am."),
    doctor("Veo que se está cuidando esa mano. Muy bien hecho.", "I see you're looking after that hand. Well done."),
    npc("Lo malo de trabajar con las manos es que nunca sabe uno dónde dejarlas cuando molestan.", "Trouble with working with your hands is never knowing where to put them when they hurt."),
    doctor("Para empezar, lejos del martillo, amigo.", "Away from the hammer, for a start, friend."),
    npc("Ya está lejos. Y aun así no dejo de mirarlo.", "It is. I still can't stop looking at it."),
    doctor("El taller puede quedarse en silencio un rato: descansará usted, y él también.", "The workshop can be quiet for a while: you'll rest, and so will it."),
    npc("Ya. Lo que cuesta es no sentirse uno de más dentro.", "Aye. It's feeling out of place in your own workshop that's hard."),
  ]),
  talk("chapter2.tavern.bartender", [
    npc("Hoy nadie se ha tumbado en el suelo. Voy a considerarlo una mejora.", "Nobody's lain down on the floor today. I'm counting that as an improvement."),
    doctor("¿Cómo sigue el hombre de ayer? Me quedé pensando en él.", "How's yesterday's patient doing? I kept thinking about him."),
    npc("Ya pregunta qué hay para comer. Le he dicho que, por ahora, lo que usted permita.", "He's asking what's for dinner again. I told him, for now, whatever you allow."),
    doctor("Que no tenga prisa por repetir la velada, por su bien.", "He shouldn't hurry to repeat the evening, for his own good."),
    npc("He apartado su jarra de siempre. Dice que le he cambiado el sabor al local.", "I've put his usual tankard away. Says I've changed the flavour of the place."),
    doctor("Puede que le siente muy bien. A veces un cambio de sabor es un buen comienzo.", "It might do him a lot of good. Sometimes a change of flavour is a good beginning."),
  ]),
  talk("chapter2.tavern.child", [
    npc("Está enferma, pero no quiere decirme de qué.", "She's ill, but she won't tell me what's wrong."),
    doctor("¿Su muñeca? ¡Pobrecita!", "Your doll? Poor thing!"),
    npc("Le he puesto una manta. Ahora solo falta que alguien haga sus tareas.", "I've given her a blanket. Now someone just needs to do her chores."),
    doctor("Un tratamiento muy solicitado. Y muy eficaz.", "A very popular treatment. And a very effective one."),
    npc("A usted no le dejo cuidarla. Seguro que le manda levantarse pronto.", "I'm not letting you look after her. You'll tell her to get up too soon."),
    doctor("Hoy está en las mejores manos, seguro.", "Today she's in the best hands, I'm sure."),
  ]),
  talk("chapter2.tavernStreet.sitting", [
    npc("Desde aquí sé quién lleva prisa y quién solo camina deprisa para que no lo paren.", "From here I can tell who's in a hurry and who just walks fast so nobody stops them."),
    doctor("¿Y yo? ¿Qué le parezco?", "And me? What do I look like to you?"),
    npc("Usted se ha parado. Todavía estoy decidiendo.", "You stopped. I'm still deciding."),
    doctor("¿Lleva mucho aquí? Se está bien a la sombra.", "Have you been here long? It's pleasant in the shade."),
    npc("Lo suficiente para que la sombra cambie de lado. Es un reloj que no tengo que darle cuerda.", "Long enough for the shade to change sides. It's a clock I don't have to wind."),
  ]),
  talk("chapter2.tavernStreet.elder", [
    npc("No es vino, si eso es lo que está pensando.", "It isn't wine, if that's what you're thinking."),
    doctor("Todavía no había pensado nada, se lo aseguro.", "I hadn't thought anything yet, I assure you."),
    npc("Pues ahora ya lo sabe. Agua. De la que no mejora con los años.", "Well, now you know. Water. The sort that doesn't improve with age."),
    doctor("No todo tiene que mejorar con los años para ser valioso, y usted es la prueba.", "Not everything needs to improve with age to be valuable, and you're the proof."),
    npc("Eso voy a decir la próxima vez que me cambien de banco porque estorbo.", "I'll say that next time they move me to another bench because I'm in the way."),
  ]),
]);
