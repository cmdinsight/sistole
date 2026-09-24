// Onda U prominente: el electro de la hipopotasemia.
//
// PTB-XL no tiene registros etiquetados con onda U anormal. Salió del CinC 2021
// (SNOMED 164937009, "u wave abnormal", 88 registros en Ningbo, 17 limpios).
//
// ── LA MEDICIÓN, Y EL DEFECTO QUE DESTAPÓ ────────────────────────────────────
//
// La onda U es la deflexión chica que sigue a la T. Medirla es separarla de la
// T, y eso se hace buscando el valle entre las dos: la primera joroba es la T,
// la segunda la U. Se pide que el valle esté 0,02 mV por debajo de las dos
// cimas, para no informar como onda U cualquier ondulación de la rama
// descendente de la T.
//
// Al implementarlo apareció un defecto de la medición que ya existía. La
// amplitud de la T se toma como la deflexión MÁS GRANDE de la ventana de la T.
// Eso funciona siempre salvo justo acá: cuando la U supera a la T —que es lo
// que define este hallazgo— la regla se queda con la U y la informa como T. En
// V4 de JS22392 el módulo informa "T 2,1 mm" y lo que está midiendo es la U; la
// T verdadera mide 1,3 mm. Por eso ondaU() hace su propia separación, por orden
// de aparición y no por tamaño, y la razón U/T se calcula con ESA T. Si se
// calculara con la otra daría 1,00 exacto en todos los casos donde la U gana,
// que es un número perfectamente creíble y perfectamente inútil.
//
// Dos topes de ventana que hicieron falta, los dos por errores concretos:
//
//   · 85 % del RR, para no llegar a la P del latido siguiente. Sin eso, un
//     electro normal con la P visible da "onda U" y sale informado como
//     hipopotasemia.
//   · 350 ms desde el pico de la T. Sin eso, en un trazado lento el máximo de
//     toda la ventana caía a 700 ms de la R, sobre la línea de base, y salía
//     una onda U de 0,0 mm. Se agregó además que la U tenga amplitud propia
//     (≥ 0,02 mV sobre la línea): en V5 y V6 de este mismo registro la T y la U
//     están FUNDIDAS en una sola meseta, no hay onda U separable, y la
//     respuesta correcta ahí es null y no un cero.
//
// ── CALIBRACIÓN ──────────────────────────────────────────────────────────────
//
//   U ≥ 1,5 mm Y U/T ≥ 1 en V2, V3 o V4:
//
//     etiquetados con onda U anormal .... 3 de 17   (limpios)
//     normales de PTB-XL ............... 0 de 32
//
// La mediana de la U en los normales es 0,00 mm: en un electro normal esta
// medición directamente no encuentra una segunda onda. Esa es la columna que
// importa.
//
// Se pide además descenso del ST, que es la otra mitad del cuadro y lo que
// separa una onda U de hipopotasemia de una onda U prominente de bradicardia,
// donde el ST está en su lugar.
export default {
  uWave: { leads: ['V2', 'V3', 'V4'], min: 0.20 },
  uToT: { leads: ['V4'], min: 1.2 },
  stDepression: { leads: ['V3', 'V4', 'V5'], min: 0.10 },
  qrsMs: [70, 110],
  rate: [45, 75],
  irregular: false,
};
