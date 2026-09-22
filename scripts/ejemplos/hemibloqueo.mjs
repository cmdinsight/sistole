// Hemibloqueo anterior izquierdo.
//
//   npm run search:ptbxl -- --scp LAFB --findings scripts/ejemplos/hemibloqueo.mjs
//
// La rama izquierda se divide en dos fascículos: el anterior, que va hacia
// arriba y a la izquierda, y el posterior, hacia abajo y atrás. Si se bloquea el
// anterior, el ventrículo izquierdo se activa primero desde el posterior —desde
// abajo y atrás— y el vector resultante se va hacia arriba y a la izquierda.
// Eso es toda la definición: una desviación del eje más allá de −45°.
//
// El QRS se pide ANGOSTO a propósito. Es sólo un fascículo el que falla, no la
// rama entera: el resto de la conducción funciona y el complejo no se ensancha.
// Ahí está la diferencia con el bloqueo completo de rama izquierda.
//
// Y se piden las dos morfologías que acompañan al eje, porque una desviación
// izquierda sola tiene otras causas —infarto inferior, hipertrofia—: qR en I y
// aVL, que miran hacia donde va el vector, y rS en II, III y aVF, que miran
// hacia donde se aleja.
export default {
  axisDeg: [-90, -45],
  qrsMs: [60, 118],
  dominantR: ['I', 'aVL'],
  rsPattern: ['II', 'III', 'aVF'],
  irregular: false,
};
