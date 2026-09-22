// Bloqueo completo de rama derecha.
//
//   npm run search:ptbxl -- --scp CRBBB --findings scripts/ejemplos/rama-derecha.mjs
//
// El ventrículo derecho no recibe el estímulo por su rama: le llega tarde, desde
// el izquierdo y de músculo en músculo. Eso ensancha el QRS y deja una parte
// final del complejo —la despolarización derecha, ya sola— apuntando hacia la
// derecha y adelante. De ahí salen las dos caras del hallazgo:
//
//   · V1 mira de frente al ventrículo derecho → esa fuerza tardía le agrega una
//     segunda R, la R'. El complejo queda rsR', las "orejas de conejo".
//   · I y V6 miran desde la izquierda → la misma fuerza tardía se aleja de
//     ellas y cava una onda S ancha.
//
// Pedir las dos, y no sólo la R' de V1, es lo que separa esto de un infarto
// posterior o de una hipertrofia derecha, donde también hay R alta en V1 pero
// sin la S ancha del otro lado ni el QRS ensanchado.
export default {
  qrsMs: [120, 190],
  dominantR: ['V1'],
  sDepth: { leads: ['I', 'V6'], min: 0.15 },
  irregular: false,
};
