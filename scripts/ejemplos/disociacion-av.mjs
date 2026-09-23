// Disociación auriculoventricular: la aurícula y el ventrículo, cada uno por su
// lado. Es el hallazgo que define el bloqueo AV completo.
//
// Estuvo anotado como IMPOSIBLE durante varias tandas —ver el final de
// bloqueo-av.mjs—, y lo era con el camino que se intentaba. Esta es la historia
// de por qué ese camino no servía y cuál sí.
//
// ── LOS TRES INTENTOS QUE FALLARON ───────────────────────────────────────────
//
// Los tres querían contestar "¿a qué frecuencia va la aurícula?", y para eso
// hay que VER las ondas P:
//
//   1. Detectar cada P por picos: 5 de 6 registros sin medición. Se reintentó
//      acá con compuesto de cinco derivaciones y varios umbrales: el mejor daba
//      una serie P-P con coeficiente de variación de 0,28 a 0,89. Una P de
//      0,1 mV no se separa de 0,04 mV de ruido latido a latido, y no hay umbral
//      que lo arregle.
//   2. Autocorrelación con el QRS tapado: acertaba las frecuencias de
//      referencia pero marcaba disociación en 6 de 50 electros NORMALES.
//   3. Resta del latido promedio: 1 de 3.
//
// ── LA PREGUNTA DADA VUELTA ──────────────────────────────────────────────────
//
// No "a qué frecuencia va la aurícula" sino "¿queda en el trazado algún ritmo
// que NO sea el del ventrículo?".
//
// Se resta el latido promedio alineado por la R, que saca todo lo atado al
// ventrículo. Ahí está la asimetría que hace posible todo: en conducción 1:1 la
// P está atada al ventrículo y se va con la resta; cuando la aurícula va sola,
// sobrevive. Después se PLIEGA el residuo en cada período candidato —se
// promedian las muestras que caen en la misma fase— y se barre de 45 a 200 por
// minuto. Con el período justo las P se suman entre sí y el ruido se divide por
// la raíz del número de pliegues.
//
// Y lo que hace que funcione: en un electro normal el barrido TAMBIÉN encuentra
// algo, pero lo encuentra en el período del VENTRÍCULO, y la razón entre las dos
// frecuencias da 1,00. El hallazgo no es que aparezca un pico; es dónde.
//
// ── LAS GUARDAS SALIERON DE LOS QUE FALLABAN, NO DE LA TEORÍA ────────────────
//
// Con el barrido solo no alcanzaba. Cada guarda entró por un registro concreto:
//
//   · tapar el QRS en vez de restarlo — 4 ms de desalineamiento sobre la
//     pendiente del QRS dejan un residuo que el barrido toma por onda P, con
//     período igual al RR;
//   · la aurícula tiene que ir MÁS RÁPIDO que el ventrículo — dos falsos
//     positivos tenían la aurícula más lenta, que es fisiológicamente al revés;
//   · un solo lóbulo de la polaridad dominante — JS21141 daba dos picos de +101
//     y +95 µV y su "onda P" de 140 ms eran en realidad dos de 70;
//   · contar los lóbulos CON SIGNO — con el valor absoluto, el valle que sigue a
//     toda onda P cuenta como segunda deflexión y se caían los buenos;
//   · que dure y mida lo que una P —40 a 160 ms, 0,35 a 3 mm—; sin el techo, un
//     registro con 8 mm de deflexión salía informado como onda P;
//   · que dos derivaciones más la vean en la misma fase.
//
// Y con todas ésas puestas, el registro 2047 seguía disparando: cinco
// derivaciones de acuerdo, 102 µV, 92 ms, todo en regla. El informe del
// cardiólogo dice "sinus rhythm". Era deriva de la línea de base, que es lenta y
// mueve todas las derivaciones juntas, así que satisface cualquier prueba que
// mire la MISMA cuenta desde otro ángulo.
//
// Lo que la deriva no puede hacer es repetir su período en dos tramos distintos
// del trazado. Se mide el período auricular en los primeros cinco segundos y en
// los últimos cinco, por separado, y se pide que coincidan dentro del 8 %:
//
//     2047 (falso positivo) .... 312 y 253 muestras — 19 % — RECHAZADO
//     8620 .....................  180 y 184 —  2 %
//     JS12522 ..................  127 y 124 —  2 %
//     JS21402 ..................  148 y 146 —  1 %
//
// ── CALIBRACIÓN ──────────────────────────────────────────────────────────────
//
//                                            dispara
//     NORMAL .................................  0 / 70
//     BLOQUEO AV 1° (conducción 1:1) .........  0 / 50
//     FIBRILACIÓN AURICULAR (sin ondas P) ....  0 / 12
//     BLOQUEO AV COMPLETO ....................  1 / 11
//     DISOCIACIÓN AV (CinC 2021) .............  2 / 55
//
// Cero falsos positivos en 132 registros donde la conducción es 1:1 o no hay
// ondas P. Eso es lo que hacía falta y lo que los tres intentos anteriores no
// lograron.
//
// ── QUÉ ES Y QUÉ NO ES ───────────────────────────────────────────────────────
//
// Encuentra 1 de cada 11 bloqueos completos. NO es un detector: sirve para
// custodiar un caso cuyo trazado ya se miró, no para buscar en una base ni
// —muchísimo menos— para descartar disociación en un paciente. Que no dispare
// no dice nada.
//
// Confirmación independiente en el registro que se eligió: la base del CinC lo
// etiqueta "complete heart block; ventricular escape rhythm; atrioventricular
// dissociation; sinus tachycardia". La medición dice aurícula a 118 —que es
// taquicardia sinusal— y ventrículo a 52. La etiqueta se escribió sin ver esta
// medición y la medición se hizo sin leer la etiqueta.
//
// Y la segunda confirmación es una medición que ya existía y no comparte nada
// con ésta: el PR latido a latido da 144 · 304 · 364 · 80 · 276 · 188 ms. Sin
// orden, sin decremento, sin repetirse. Eso es lo que se ve cuando la P que
// precede a cada QRS no tiene nada que ver con él.
//
// LÍMITE DE FONDO: si las dos frecuencias fueran iguales, las P caerían siempre
// en la misma fase y esto no vería nada. La disociación isorrítmica queda fuera
// del alcance del método, no de un umbral.
export default {
  avDissociation: { min: 1.8 },
  qrsMs: [115, 150],
  rate: [45, 60],
  irregular: false,
};
