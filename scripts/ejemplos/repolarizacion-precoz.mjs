// Repolarización precoz: la onda J.
//
// PTB-XL no tiene ningún registro etiquetado con esto, así que el caso salió del
// desafío CinC 2021 (código SNOMED 428417006, 59 registros en la base de
// Ningbo).
//
// ── LO QUE NO SIRVIÓ, Y POR QUÉ IMPORTA ──────────────────────────────────────
//
// El primer intento fue el obvio: buscar supradesnivel del ST en las
// precordiales. No sirve, y los números dicen exactamente cuánto no sirve. El ST
// en V3, medido a 60 ms del punto J, da de mediana 2,4 mm en los 25 registros
// limpios etiquetados como repolarización precoz y 1,3 mm en 32 normales, con
// los dos rangos completamente superpuestos. Pedir supradesnivel habría sido
// enseñar a llamar repolarización precoz a cualquier electro con el ST algo
// alto — que es precisamente el error que este caso tiene que evitar.
//
// Lo mismo con las razones que se usan en la clínica para separar esto de un
// infarto: ST/R de V4 da 0,10 en los etiquetados y 0,10 en los normales. Cero
// separación. Se probaron y se descartaron.
//
// ── LO QUE SÍ SIRVIÓ ─────────────────────────────────────────────────────────
//
// El hallazgo que define el cuadro desde el consenso de 2015 no es el
// supradesnivel sino la ONDA J: el QRS no baja limpio hasta el segmento ST, se
// frena en el punto J y hace una joroba que después desciende. Eso se puede
// medir, y measure.js lo mide en jNotch (la altura de la joroba) y jAmp (la
// altura del punto J sobre la línea de base).
//
// La primera versión de la medición estaba mal y vale la pena dejarla anotada,
// porque el error era invisible: buscaba un mínimo local seguido de un máximo,
// sin exigir que el trazado volviera a bajar. Con eso tomaba la subida del final
// de la S hasta el pico de la onda T como si fuera una muesca. Devolvía 24 mm de
// onda J en derivaciones donde no había ninguna, y —lo que la delató— devolvía
// lo mismo en los normales: 1,34 mm de mediana en los normales contra 0,70 en
// los etiquetados, o sea que el número separaba al revés. Un número puede ser
// plausible, salir en todos los registros y no medir nada.
//
// Corregida —pidiendo que el pico sea un máximo local de verdad, que suba desde
// el mínimo INMEDIATAMENTE anterior y que baje al menos 0,03 mV después—, el
// criterio del consenso queda así:
//
//   Jp ≥ 2 mm con muesca ≥ 1 mm en dos derivaciones contiguas, inferiores o
//   laterales:
//
//     repolarización precoz etiquetada .... 4 de 25   (limpios)
//     normales de PTB-XL .................. 0 de 32
//
// Cuatro de veinticinco es poco, y es honesto que sea poco: la etiqueta de la
// base incluye muchos registros con supradesnivel y sin onda J medible. Lo que
// importa para custodiar un caso es la otra columna: ningún normal lo cumple.
//
// El QRS angosto no es decorativo. Un bloqueo de rama derecha también deja una
// joroba al final del complejo —la R'— y ahí no es una onda J: es conducción
// tardía del ventrículo derecho. El ancho es lo que los separa.
export default {
  jPoint: { leads: ['V4', 'V5', 'V6'], min: 0.20 },
  jNotch: { leads: ['V4', 'V5'], min: 0.10 },
  qrsMs: [70, 110],
  stFlat: { leads: ['aVL'], max: 0.10 },
  rate: [40, 65],
  irregular: false,
};
