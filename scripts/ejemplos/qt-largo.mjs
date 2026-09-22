// QT largo.
//
//   npm run search:ptbxl -- --scp LNGQT --findings scripts/ejemplos/qt-largo.mjs
//
// El QT es lo que tarda el ventrículo en despolarizarse y volver a repolarizarse
// entero. Cuando se alarga, hay un rato más largo en el que parte del miocardio
// ya se recuperó y parte no, y un latido que caiga ahí puede desencadenar una
// taquicardia ventricular polimorfa — torsades de pointes.
//
// Lo difícil de este caso no es el concepto sino la medición. El final de la
// onda T es el punto más discutible de un electro, así que acá no alcanza con
// pedir un QTc alto: hay que pedir que el número se sostenga.
//
//   · Por las dos fórmulas. Bazett exagera la corrección y sola puede convertir
//     una taquicardia en un falso QT largo; si Fridericia también lo da largo,
//     el hallazgo no depende de cuál se usó.
//   · Entre derivaciones. Si cada una da un QT distinto, el del registro depende
//     de cuál se mire, y eso no se puede enseñar.
//   · A frecuencia moderada, donde cualquier corrección es más confiable.
export default {
  qtcMs: [490, 640],
  qtSpreadMs: { max: 55 },
  rate: [52, 88],
  irregular: false,
  qrsMs: [60, 115],          // un bloqueo de rama alarga el QT sin que eso sea QT largo
  tUpright: { leads: ['II'], min: 0.12 },   // una T medible, o el número no significa nada
};
