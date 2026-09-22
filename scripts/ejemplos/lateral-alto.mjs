// Infarto lateral alto ANTIGUO (I y aVL).
//   npm run search:ptbxl -- --scp LMI --findings scripts/ejemplos/lateral-alto.mjs
//
// Se buscó primero el agudo, con ST elevado en I y aVL. No existe en la base:
// de los 101 registros con código LMI, los 70 medibles fallan TODOS el umbral
// de 1 mm de elevación. La etiqueta LMI de PTB-XL marca infartos ya
// evolucionados, no agudos. Así que el caso es el antiguo, que además es el que
// de verdad se pasa por alto.
//
// La pared lateral alta la miran I y aVL, y nadie más de frente. Cuando se
// infarta y cicatriza, esas dos derivaciones pierden la onda R y quedan con una
// Q. El problema es que es el único par del electro que no tiene vecinos: si
// uno recorre el trazado por grupos —cara inferior, precordiales— y no mira I y
// aVL juntas, el infarto no aparece por ningún lado.
export default {
  rLoss: { leads: ['aVL'], max: 0.25 },
  rHeight: { leads: ['V5', 'V6'], min: 0.40 },
  qrsMs: [60, 118],
  irregular: false,
};
