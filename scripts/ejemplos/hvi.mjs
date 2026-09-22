// Hipertrofia ventricular izquierda con sobrecarga ("strain").
//
//   npm run search:ptbxl -- --scp LVH --findings scripts/ejemplos/hvi.mjs
//
// El ventrículo izquierdo engrosado despolariza más masa, y eso se ve como
// voltaje: R altas en las laterales, S profundas en las derechas. El índice de
// Sokolow-Lyon suma las dos caras del mismo vector.
//
// Lo que convierte esto en un caso para enseñar no es el voltaje sino lo que lo
// acompaña: un descenso del ST con la T invertida en las laterales, que es
// idéntico a lo que produce una isquemia. A eso se le llama patrón de
// sobrecarga, y es el gran imitador.
//
// Se pide el QRS ANGOSTO a propósito. El mismo descenso lateral con T invertida
// aparece en un bloqueo de rama izquierda, y ahí no es sobrecarga sino
// discordancia. Lo que separa los dos cuadros es el ancho del complejo, así que
// el caso no sirve si el registro trae además un bloqueo.
export default {
  qrsMs: [60, 115],
  sokolowLyon: { min: 3.5 },
  dominantR: ['V5', 'V6'],
  rsPattern: ['V1'],
  stDepression: { leads: ['V5', 'V6'], min: 0.05 },
  tInversion: { leads: ['V5', 'V6'], min: 0.15 },
  irregular: false,
};
