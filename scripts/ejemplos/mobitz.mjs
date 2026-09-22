// Bloqueo AV de segundo grado tipo I (Wenckebach).
//
// ESTE CASO NO SE PUDO CONSTRUIR. El archivo queda como mapa para quien lo
// retome, con los números de por qué y con un criterio que sí quedó validado.
//
// ── QUÉ HAY EN LA BASE ───────────────────────────────────────────────────
//
// Ocho registros llevan el código 2AVB. Seis de esos ocho NO son un Mobitz:
//
//   3505   aleteo auricular con bloqueo 2:1
//   8048   bloqueo 3:1, frecuencia auricular 111 — alto grado, no Wenckebach
//   9136   taquicardia auricular con bloqueo 2:1
//   16401  aleteo auricular con bloqueo 4:1
//   18101  taquicardia auricular con bloqueo 2:1 + bloqueo de rama derecha
//   19164  fibrilación auricular — sin P, no puede haber Mobitz
//
// La conducción 2:1 o 4:1 de un aleteo es fisiología del nodo AV protegiendo
// al ventrículo, no un bloqueo patológico con decremento. Quedan dos:
//
//   14009  "av-block 2. grades TYP I" — el único etiquetado como tipo I
//   7688   "dropped beats due to second degree av block of WENCKEBACH type"
//          (etiquetado 3AVB, pero el informe dice Wenckebach)
//
// Buscando "wenckebach|mobitz|dropped beat" en el texto de los 21.799 informes
// aparecen seis, y tres son imitadores que la propia base nombra:
//
//   4110   "dropped beats due to BLOCKED ATRIAL PREMATURE BEATS"
//   8505   "dropped beats due to FAILURE OF THE SA NODE"
//   16007  "one dropped beat, possibly due to a blocked atrial premature beat"
//
// ── UN CRITERIO QUE SÍ QUEDÓ VALIDADO ────────────────────────────────────
//
// La huella de Wenckebach está en los TIEMPOS de los QRS, sin necesidad de ver
// una sola P: dentro de cada grupo el RR se va acortando, y la pausa dura MENOS
// que dos veces el RR más corto. Eso se mide con lo que measure.js ya detecta.
//
// Y la base regala los controles correctos: dos Wenckebach confirmados por el
// cardiólogo contra dos imitadores nombrados por el cardiólogo.
//
//   registro  lo que escribió el cardiólogo        pausa / RR más corto
//   14009     bloqueo AV 2° tipo I                        1,82
//    7688     tipo Wenckebach                             1,66
//    4110     extrasístoles auriculares bloqueadas        2,21
//    8505     falla del nodo sinusal                      2,08
//
// Los dos Wenckebach caen por debajo de 2× y los dos imitadores por encima.
// Es el criterio clásico, y acá está comprobado contra etiquetas escritas a
// mano. El RR de 14009 muestra además el decremento y la agrupación:
//
//   668 652 636 640 644 [1140]  656 640 636 628 636 [1120]
//
// ── POR QUÉ NO SE PUEDE ENSEÑAR IGUAL ────────────────────────────────────
//
// Porque un caso de Wenckebach en el que el alumno no ve una sola P no es un
// caso de Wenckebach. Se miraron los dos dibujados:
//
//   14009  las derivaciones de los miembros son de bajo voltaje —el QRS de II
//          mide 2 o 3 mm— y las P no se distinguen de las T. V1 es casi una
//          línea recta.
//   7688   los QRS son altos y limpios, pero entre latido y latido la línea de
//          base está PLANA: no hay P visible. El informe lo dice él mismo,
//          "p waves are often inconspicuous", y tiene razón.
//
// Un detalle que vale la pena dejar escrito porque casi me engaña: midiendo el
// PR latido a latido en 14009, V1 daba una serie que se alargaba prolijamente
// dentro de cada grupo (292 300 300 320 328, reinicio a 236, 272 288 292 316
// 332) — exactamente el hallazgo que se buscaba. Pero V1 en ese registro es una
// línea casi plana, así que esa serie no mide una P: mide ruido. Los números
// solos lo habrían dado por bueno. Hubo que dibujarlo para verlo.
//
// ── QUÉ HARÍA FALTA ──────────────────────────────────────────────────────
//
// Otro origen de datos, o un registro de PTB-XL con Wenckebach y P grandes que
// no esté etiquetado como tal. Lo segundo se puede buscar sin onda P: correr el
// criterio de la pausa sobre toda la base y mirar los que agrupan latidos con
// razón menor que 2. No se hizo acá.
//
// Lo que sí está al alcance con lo que ya se mide es el caso de la PAUSA: un
// electro por lo demás normal con un latido que falta, y la pregunta de qué lo
// causó. El registro 4110 —mujer de 40, etiquetado NORM, extrasístoles
// auriculares bloqueadas— tiene las P visibles y una razón de 2,21 que separa
// el diagnóstico del Wenckebach. Es el diagnóstico diferencial del Mobitz I y
// es el error que de verdad se comete.
export default {
  // Sin registro que lo satisfaga: no hay findings que ofrecer todavía.
};
