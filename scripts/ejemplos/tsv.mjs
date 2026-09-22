// Taquicardia supraventricular.
//   npm run search:ptbxl -- --scp SVTAC,PSVT --findings scripts/ejemplos/tsv.mjs
// Rápida, regular y de QRS angosto. Los tres adjetivos importan: angosto dice
// que baja por el sistema normal, regular la separa de la fibrilación, y rápida
// —por encima de 150— la separa de una taquicardia sinusal.
export default {
  rate: [150, 230],
  qrsMs: [55, 115],
  irregular: false,
};
