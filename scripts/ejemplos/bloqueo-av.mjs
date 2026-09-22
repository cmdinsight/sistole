// Bloqueo AV de primer grado.
//
//   npm run search:ptbxl -- --scp 1AVB --findings scripts/ejemplos/bloqueo-av.mjs
//
// El estímulo sale del nodo sinusal, cruza la aurícula y se frena en el nodo
// AV antes de bajar por el His. Ese trayecto es el PR. Cuando pasa de 200 ms
// —cinco cuadraditos— hay bloqueo AV de primer grado, que en realidad no
// bloquea nada: TODAS las P conducen, sólo que tarde. De ahí que casi siempre
// sea un hallazgo sin consecuencias.
//
// ── LA MEDICIÓN, Y POR QUÉ SE PUDO HACER ─────────────────────────────────
//
// El PR se mide sobre el LATIDO PROMEDIO, y ahí hay una asimetría que decide
// todo. Promediar los latidos alineados por la R CONSERVA la P cuando la
// conducción es 1:1 —la P cae siempre a la misma distancia de la R, se suma
// consigo misma y el ruido se divide por la raíz del número de latidos— y la
// DESTRUYE cuando la aurícula va por su cuenta. Por eso este camino sirve
// para el primer grado y no para el completo.
//
// Calibración sobre 70 registros de cada grupo:
//
//                    p10   p25  mediana  p75   p90     > 200 ms
//   NORMAL           128   140    160    180   204      9 / 63
//   BLOQUEO AV 1°    192   212    228    248   272     48 / 59
//   PR LARGO (LPR)   180   212    224    248   272     49 / 62
//
// Dos cosas dan confianza. La primera: el grupo NORMAL cae entero dentro del
// rango fisiológico de 120-200 ms, que es lo que tiene que pasar y lo que las
// versiones anteriores de esta medición NO hacían. La segunda: 1AVB y LPR son
// dos etiquetas asignadas por separado y dan la misma distribución, 228 y 224
// de mediana. Que dos etiquetas independientes coincidan es mejor evidencia
// que cualquier umbral.
//
// LÍMITE CONOCIDO: en fibrilación auricular esto no sirve. Sobre 70 registros
// de FA no devolvió nada en 51 —correcto, ahí no hay P— pero en los otros 19
// encontró algo y le puso número, con mediana de 296 ms. Cualquier caso que
// hable del PR tiene que pedir además `irregular: false`.
//
// ── LO QUE NO SE PUDO HACER: EL BLOQUEO COMPLETO ─────────────────────────
//
// El bloqueo AV de tercer grado es el que de verdad cambia conductas, y no se
// pudo construir. Hay 11 registros en toda la base, y varios informes dicen
// ellos mismos que las P son "inconspicuous". Se intentaron tres métodos,
// midiendo contra las frecuencias auriculares que los cardiólogos anotaron a
// mano (959 → 98, 8911 → 82, 7688 → 60):
//
//   1. Detección de cada P por picos: 5 de 6 registros sin medición.
//   2. Autocorrelación con máscara sobre el QRS tapado: acertó las tres
//      frecuencias de referencia (103, 88, 61) pero en 50 registros NORMALES
//      dio una razón auricular/ventricular de 1,31 de mediana, cuando tiene
//      que dar 1,00, y marcó disociación en 6 de 50 electros normales.
//   3. Resta del latido promedio (la técnica de las ondas f): 1 de 3.
//
// Un método que le dice a 1 de cada 8 electros normales que tiene disociación
// AV no se puede usar para un hallazgo cuya conducta es un marcapasos.
export default {
  prMs: [230, 400],
  // Sin esto la medición no se sostiene: ver el límite conocido, más arriba.
  irregular: false,
  qrsMs: [60, 115],
  rate: [55, 95],
};
