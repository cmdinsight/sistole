// Hipertrofia ventricular derecha.
//   npm run search:ptbxl -- --scp RVH --findings scripts/ejemplos/hvd.mjs
// El ventrículo derecho normal es una lámina fina y su vector queda tapado por
// el izquierdo. Cuando se hipertrofia —hipertensión pulmonar, EPOC, estenosis
// mitral, una cardiopatía congénita— pasa a competir, y el vector se va hacia
// adelante y a la derecha: R dominante en V1, que en un adulto es siempre
// anormal, más desviación derecha del eje y S persistente en V5-V6.
// El QRS se pide ANGOSTO: es lo que la separa del bloqueo de rama derecha, que
// también da R alta en V1 pero con rsR' y complejo ancho.
export default {
  dominantR: ['V1'],
  qrsMs: [60, 115],
  axisDeg: [90, 180],
  sDepth: { leads: ['V6'], min: 0.20 },
  irregular: false,
};
