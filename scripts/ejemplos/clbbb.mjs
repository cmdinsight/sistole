// Ejemplo de findings para buscar con scripts/ptbxl-search.mjs.
//
//   npm run search:ptbxl -- --scp CLBBB --findings scripts/ejemplos/clbbb.mjs
//
// Un bloqueo completo de rama izquierda: el ventrículo izquierdo se despolariza
// tarde y por vía muscular, así que el QRS se ensancha y el ST y la T apuntan al
// lado contrario del QRS. En V1-V3, donde el QRS es profundamente negativo, eso
// aparece como una elevación del ST que NO es un infarto — y ese es exactamente
// el caso que valdría la pena enseñar.
//
// El QRS ancho no se pide acá sino en el prefiltro por código (--scp CLBBB),
// porque el buscador descarta de entrada los QRS de más de 130 ms: fuera de ese
// rango la detección suele estar fallando y las mediciones no son confiables.
export default {
  stElevation: { leads: ['V1', 'V2', 'V3'], min: 0.10 },
  tUpright: { leads: ['V1', 'V2'], min: 0.15 },   // T concordante con el ST elevado
  tInversion: { leads: ['V5', 'V6'], min: 0.05 }, // discordancia del otro lado
  rsPattern: ['V1'],
  irregular: false,
};
