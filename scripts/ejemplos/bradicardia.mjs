// Bradicardia sinusal.
//   npm run search:ptbxl -- --scp SBRAD --findings scripts/ejemplos/bradicardia.mjs
// Menos de 60 por minuto con cada QRS precedido de su P. El caso no está en
// reconocerla —es fácil— sino en decidir si importa, que es lo difícil: la
// misma frecuencia es fisiológica en un deportista y es un problema en alguien
// con síncope o en tratamiento con betabloqueantes.
export default {
  rate: [38, 55],
  prMs: [110, 210],
  qrsMs: [60, 115],
  irregular: false,
};
