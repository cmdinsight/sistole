// Ejemplo de findings para buscar con scripts/ptbxl-search.mjs.
//
//   npm run search:ptbxl -- --scp CLBBB --findings scripts/ejemplos/clbbb.mjs
//
// Un bloqueo completo de rama izquierda. El ventrículo izquierdo no recibe el
// estímulo por su rama sino que se despolariza de músculo en músculo, desde el
// derecho: por eso el QRS se ensancha y por eso el ST y la T terminan apuntando
// al lado CONTRARIO del QRS. A eso se le llama discordancia, y es lo que hay que
// pedirle al registro:
//
//   · En V1-V3 el QRS es profundamente negativo → el ST se eleva y la T es
//     positiva. Eso parece un infarto anterior y no lo es. Ese es el caso.
//   · En V5-V6 el QRS es una R ancha y positiva → el ST baja y la T se invierte.
//
// Pedir las dos mitades, y no sólo la elevación de V1-V3, es lo que separa un
// bloqueo de rama de un infarto anterior de verdad: en el infarto la elevación
// no viene acompañada por la imagen opuesta del otro lado.
export default {
  qrsMs: [120, 190],                                // el ensanchamiento, que es el hallazgo de fondo
  rsPattern: ['V1'],                                // QRS negativo en V1
  stElevation: { leads: ['V1', 'V2', 'V3'], min: 0.10 },
  tUpright: { leads: ['V1', 'V2'], min: 0.15 },     // T concordante con el ST elevado
  stDepression: { leads: ['V6'], min: 0.03 },       // la mitad opuesta
  tInversion: { leads: ['V5', 'V6'], min: 0.05 },
  irregular: false,
};
