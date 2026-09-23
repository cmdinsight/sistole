// Bloqueo AV de segundo grado tipo II: NO se pudo hacer. Y la razón no es que
// falten registros — es que el hallazgo que lo define no está medido.
//
//   npm run index:cinc -- 426183003
//
// ── EL PROBLEMA DE FONDO, QUE VALE MÁS QUE LA LISTA ──────────────────────────
//
// Un Mobitz II y una extrasístole auricular bloqueada producen EXACTAMENTE la
// misma firma en todo lo que este módulo sabe medir:
//
//     ritmo de base regular ............ los dos
//     una pausa de casi el doble ....... los dos (el nodo sinusal conserva su
//                                        tiempo en los dos casos)
//     PR constante en los conducidos ... los dos
//     QRS sin cambios .................. los dos
//
// Lo único que los separa es DÓNDE cae la onda P de la pausa. En el Mobitz II
// llega a horario, en su lugar del ritmo sinusal, y simplemente no pasa. En la
// extrasístole bloqueada llega ANTES de tiempo y se esconde encima de la onda T
// del latido anterior, deformándola.
//
// Eso no está medido. Y es justo lo que el caso 24 —extrasístole auricular
// bloqueada— ya dice en su propia trampa: "el número descarta; la vista
// confirma". Mandar un caso de Mobitz II sin poder medir esa diferencia sería
// afirmar sobre un trazado lo que el módulo no puede distinguir del caso que ya
// está publicado con la respuesta contraria.
//
// ── LOS SIETE DEL CinC ───────────────────────────────────────────────────────
//
// Uno tiene derivaciones planas. De los otros seis:
//
//   JS12436  PR de 216, 212, 220 y 216 ms —constante, con cuatro derivaciones
//            de acuerdo— pero la razón de pausa da 1,06: no hay pausa. Es un
//            bloqueo 2:1 o de alto grado con el ventrículo regular a 37. Para
//            llamarlo así hay que medir la frecuencia auricular y mostrar que
//            es el doble o el triple, y con 6 latidos —4 promediables— el
//            latido promedio da jorobas de 60 a 120 µV sobre un piso de ruido
//            de 38: dos o tres veces el ruido, que no alcanza para afirmar que
//            hay DOS ondas P por ciclo.
//   JS12440  dos pausas de 1,89 veces, pero el PR de los conducidos va de 224 a
//            300 ms. Esa variación de 76 ms es decremento: apunta a Wenckebach.
//   JS12439  razón de pausa 1,18 —no hay pausa— y el PR salta 220 ms.
//   JS11534  QRS de 124 ms y dispersión del RR de 0,30: el ritmo de base no es
//            regular, así que no hay ciclo contra el cual llamar pausa a nada.
//   JS11533  145 µV de ruido y el PR de los conducidos va de 136 a 336 ms.
//   JS12438  el mejor de lejos, y se cae por el trazado. RR de 656, 656, 656,
//            652, 656, 656, 648, 1304, 656, 656, 648, 644 y 656 ms: la pausa es
//            EXACTAMENTE el doble. El PR de los conducidos da 280, 284, 276,
//            276, 280, 280, 276, 280, 264 y 264 ms: constante. Catorce latidos.
//            Es la mejor imagen de Mobitz II que apareció.
//            Pero el ruido entre latidos da 215 µV, por encima del límite de
//            200 que tienen las pruebas. Mirado por derivación, la tira del
//            ritmo está impecable —42 µV en II— y el ruido está concentrado en
//            las precordiales: 407 µV en V3, 489 en V4 y 373 en V6. Un caso se
//            mira en doce derivaciones, no en una, y ese límite está puesto
//            justamente para eso.
//
// ── Y TAMPOCO EN PTB-XL ──────────────────────────────────────────────────────
//
// Se buscó la firma sobre los 3283 registros en caché, sin mirar etiquetas:
// base pareja, una pausa entre 1,80 y 2,20 veces, y el PR de los conducidos
// variando menos de 60 ms. Salieron dos, y los dos se explican por otra cosa:
// el 6647 es la pausa compensadora de una extrasístole ventricular y el 19803
// es una extrasístole supraventricular —el informe del cardiólogo lo dice—, o
// sea el diagnóstico del caso 24.
//
// Que la búsqueda por medición devuelva justamente los dos imitadores, y ningún
// Mobitz II, es la confirmación empírica del problema de fondo.
//
// ── QUÉ HARÍA FALTA ──────────────────────────────────────────────────────────
//
//   · Medir si la onda P de la pausa llega A HORARIO. Concretamente: establecer
//     el intervalo P-P con las P de los latidos conducidos, predecir dónde
//     caería la siguiente dentro de la pausa, y ver si hay algo ahí. Es
//     medible, y es EL hallazgo: separa el Mobitz II de la extrasístole
//     bloqueada, y de paso separa el bloqueo de salida sinoauricular del paro
//     sinusal, que es lo que faltó en paro-sinusal.mjs.
//   · Con esa medición hecha, JS12438 sigue sin servir por el ruido de las
//     precordiales, así que habría que escanear los 20 grupos de Ningbo que no
//     están indexados, o las otras siete bases del desafío.
export default {
  // Sin registro que lo satisfaga: no hay findings que ofrecer todavía.
};
