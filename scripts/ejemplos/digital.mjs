// Efecto digitálico.
//
//   npm run search:ptbxl -- --scp DIG --findings scripts/ejemplos/digital.mjs
//
// Ojo con el nombre: «efecto» digitálico es lo que la droga hace en el electro a
// dosis correctas, y no quiere decir intoxicación. Es un hallazgo esperable en
// quien toma digoxina, no un motivo para suspenderla.
//
// La forma característica es un descenso del ST en cubeta —baja por debajo del
// punto J, toca fondo y vuelve a subir— en las derivaciones de R alta.
//
// Lo que este findings NO puede hacer es distinguir digital de isquemia. Se
// midió: los registros con digital dan 35 µV de hundimiento y los de isquemia
// lateral 25, con mucha superposición. Sirve para encontrar un trazado donde la
// forma se vea bien; no para afirmar la causa.
export default {
  stDepression: { leads: ['V5', 'V6'], min: 0.05 },
  stSag: { leads: ['V5', 'V6'], min: 0.06 },
  qrsMs: [60, 115],
  irregular: false,
  rate: [50, 95],
};
