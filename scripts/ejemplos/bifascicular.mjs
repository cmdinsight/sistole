// Bloqueo bifascicular: rama derecha + hemibloqueo anterior izquierdo.
//
//   npm run search:ptbxl -- --scp CRBBB --findings scripts/ejemplos/bifascicular.mjs
//
// El haz de His se reparte en tres caminos: la rama derecha y los dos fascículos
// de la izquierda, el anterior y el posterior. Acá fallan dos de los tres. Todo
// el ventrículo se está activando por el fascículo posterior izquierdo, que
// queda solo sosteniendo la conducción: de ahí que el hallazgo importe: no es la
// suma de dos anomalías eléctricas, es un sistema de conducción al que le queda
// una sola vía.
//
// No hace falta un hallazgo nuevo: el bifascicular es, literalmente, la
// conjunción de los dos que ya se miden. Se pide el bloqueo de rama derecha
// completo por sus dos caras —la R' de V1 y la S ancha de I y V6— y encima el
// eje del hemibloqueo, más allá de −45°, con las morfologías que lo acompañan.
//
// Se busca por el código CRBBB y se deja que el EJE haga el resto del filtro. Es
// a propósito: el eje es una medición sobre el trazado, no una etiqueta, y si un
// registro anotado sólo como bloqueo de rama derecha mide −60° con rS en la cara
// inferior, el hemibloqueo está ahí lo hayan escrito o no.
//
// En I NO se pide R dominante como en el hemibloqueo aislado: el bloqueo de rama
// derecha le agrega a I una S ancha terminal que puede superar a la R. Se pide
// que la R exista y sea franca, que es lo que dice que las fuerzas iniciales van
// hacia la izquierda.
export default {
  qrsMs: [120, 190],
  dominantR: ['V1'],
  secondR: { leads: ['V1'], min: 0.30 },
  sDepth: { leads: ['I', 'V6'], min: 0.15 },
  axisDeg: [-90, -45],
  rsPattern: ['II', 'III', 'aVF'],
  rHeight: { leads: ['I', 'aVL'], min: 0.20 },
  irregular: false,
};
