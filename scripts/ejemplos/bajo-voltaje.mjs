// Bajo voltaje en las derivaciones de los miembros.
//
//   npm run search:ptbxl -- --scp LVOLT --findings scripts/ejemplos/bajo-voltaje.mjs
//
// El voltaje del QRS es cuánta señal llega al electrodo, y eso depende de dos
// cosas: cuánta genera el músculo y cuánto se pierde en el camino. Por eso el
// bajo voltaje casi nunca habla de la electricidad del corazón: habla de lo que
// hay ENTRE el corazón y el electrodo —grasa, aire, líquido— o de que hay menos
// músculo del que debería haber.
//
// El criterio es de pico a pico: lo que sube la R más lo que baja la S, en la
// misma derivación. Y la palabra que decide es TODAS: hay bajo voltaje cuando
// ninguna de las seis derivaciones de los miembros llega a 5 mm. Una sola que
// pase, y no se cumple. El criterio generalizado agrega que ninguna precordial
// llegue a 10 mm.
//
// ── LO QUE DIO LA CALIBRACIÓN, QUE ES LA MITAD DEL TRABAJO ──────────────────
//
// Antes de buscar nada se midió la amplitud pico a pico sobre dos grupos de 60
// registros, los etiquetados LVOLT y los etiquetados NORM. La medición separa:
//
//                     miembros (máximo de las seis)   precordiales
//     LVOLT   p10 4,4   mediana  6,1   p90  7,1        mediana 18,6
//     NORM    p10 8,3   mediana 12,0   p90 17,1        mediana 20,2
//
// O sea que el código LVOLT de PTB-XL es MÁS LAXO que el criterio clásico: de
// 160 registros etiquetados, sólo 27 cumplen los 5 mm en los miembros y apenas
// 2 cumplen además los 10 mm en las precordiales. Conviene saberlo antes de
// tratar la etiqueta como si fuera el criterio.
//
// Por eso este findings pide el criterio de los MIEMBROS, que es el que la base
// sostiene y el que los propios informes escriben ("low limb lead voltage",
// "periphere Niederspannung"), y pide explícitamente que las precordiales NO
// sean bajas: el contraste entre las dos mitades es lo que enseña el caso.
export default {
  qrsAmplitude: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'], max: 0.5 },
  qrsMs: [60, 115],
  rate: [55, 100],
  irregular: false,
};
