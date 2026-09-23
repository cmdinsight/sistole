// Paro sinusal: NO se pudo hacer el caso. Queda anotado por qué.
//
//   npm run index:cinc -- 5609005
//
// ── LO QUE SE BUSCÓ ──────────────────────────────────────────────────────────
//
// Un paro sinusal es el nodo sinusal que deja de disparar. En el papel: una
// línea de base regular, UNA pausa larga sin ninguna onda P adentro, y el ritmo
// que retoma después. Lo que lo separa de sus dos imitadores es la proporción
// entre la pausa y el ciclo, y ese criterio ya está medido y calibrado desde el
// caso de la extrasístole auricular bloqueada:
//
//     pausa / ciclo de base     qué es
//     ─────────────────────     ────────────────────────────────────────
//     menos de 2                Wenckebach: hubo decremento del PR antes
//     exactamente 2             extrasístole bloqueada, o bloqueo de salida
//                               sinoauricular: el nodo sinusal conservó su
//                               tiempo
//     ningún múltiplo           PARO SINUSAL: la pausa dura lo que se le
//                               antoja, porque el nodo simplemente no disparó
//
// ── DÓNDE SE BUSCÓ Y QUÉ APARECIÓ ────────────────────────────────────────────
//
// Los 33 registros de Ningbo etiquetados "sinus arrest", y los 3283 registros de
// PTB-XL que están en caché, medidos uno por uno sin mirar etiquetas: se buscó
// la FORMA —línea de base pareja, una pausa que no sea múltiplo del ciclo, QRS
// angosto, trazado limpio—.
//
// De los 33 del CinC, ninguno sirve:
//
//   · JS22395 parecía el mejor con una razón de 2,76. La razón estaba mal
//     calculada, y el error vale: pauseRatio compara el intervalo más LARGO con
//     el más CORTO, y acá los cortos —556 y 560 ms sobre una base de 1500— son
//     extrasístoles. La razón medía la prematuridad, no la pausa. Contra el
//     ciclo de base no hay ninguna pausa en ese trazado.
//   · JS12467 da 1,88 contra el ciclo de base, o sea casi exactamente 2: eso es
//     un bloqueo de salida sinoauricular o una extrasístole bloqueada, no un
//     paro. Su propia etiqueta dice "sinoatrial block".
//   · JS22353, JS22351 y JS11657 dan 1,44 a 1,47, pero mirando la serie entera
//     de RR no hay una pausa: hay variación en todos los intervalos. Es arritmia
//     sinusal marcada en gente de 89 años, no un paro.
//   · JS11811 y JS13183 tienen la línea de base dispersa un 124 % y un 150 %:
//     no hay ciclo contra el cual llamar pausa a nada.
//
// De los 3283 de PTB-XL, con el filtro exigente salieron 2 y con el filtro
// flojo 4, y los cuatro se explican por otra cosa: dos son la pausa compensadora
// de una extrasístole ventricular (registros 555 y 8153) y dos son fibrilación
// auricular (5208 y 5848), donde no hay ciclo de base por definición.
//
// ── UNA RAZÓN DE FONDO, Y VALE MÁS QUE LA LISTA ──────────────────────────────
//
// El filtro pedía una línea de base regular, y eso puede ser pedir algo que no
// convive con el hallazgo: el paro sinusal aparece sobre todo en el síndrome del
// nodo enfermo, donde el ritmo de base YA es irregular. Se aflojó el filtro
// hasta un 35 % de dispersión y siguió sin aparecer nada limpio.
//
// ── Y UNA RAZÓN PARA NO INSISTIR ─────────────────────────────────────────────
//
// El caso 24 —extrasístole auricular bloqueada, registro 4110— ya hace esta
// pregunta: sus opciones incluyen el paro sinusal como distractor y su
// explicación recorre la discriminación de las tres pausas con los números del
// trazado. Un caso de paro sinusal enseñaría lo mismo con la respuesta corrida
// de lugar.
//
// ── QUÉ HARÍA FALTA ──────────────────────────────────────────────────────────
//
//   · Medir la AUSENCIA de onda P dentro de la pausa, que es lo que de verdad
//     define el paro y lo separa del bloqueo de salida. Es la misma familia de
//     problema que resolvió el barrido de disociacion-av.mjs, sobre un tramo
//     corto en vez de sobre toda la tira.
//   · O una tira más larga que diez segundos. Un paro sinusal de verdad se
//     documenta con Holter, no con un electro de reposo, y eso no es un
//     accidente de esta base: es la naturaleza del hallazgo.
export default {
  // Sin registro que lo satisfaga: no hay findings que ofrecer todavía.
};
