// Isquemia subendocárdica difusa: ST descendido en todas partes y aVR elevado.
//   npm run search:ptbxl -- --scp STD_,ISC_ --findings scripts/ejemplos/subendocardica.mjs
//
// No es un territorio: es TODO el subendocardio, que es la capa peor irrigada
// del corazón. Cuando el aporte cae de golpe —tronco izquierdo, enfermedad de
// tres vasos, o una demanda brutal— la capa interna sufre entera, y el vector
// de la lesión apunta hacia adentro y hacia arriba: se aleja de casi todas las
// derivaciones —ST descendido difuso— y apunta a la única que mira desde el
// hombro derecho, aVR, que sube.
//
// La regla de oro: ST descendido en muchas derivaciones CON aVR elevado no es
// "isquemia inespecífica", es enfermedad de tronco hasta que se demuestre lo
// contrario. Lo que hace el diagnóstico es la COMBINACIÓN, y por eso se piden
// las dos cosas juntas y no cada una por su lado.
//
// Los umbrales se bajaron a 0,5 mm después de la primera pasada: con 1 mm en
// las cinco derivaciones sólo un registro de 220 lo cumplía. El descenso
// subendocárdico es difuso y modesto por definición — lo que llama la atención
// es en cuántas derivaciones está, no cuánto mide en cada una.
export default {
  stDepression: { leads: ['I', 'II', 'V4', 'V5', 'V6'], min: 0.05 },
  stElevation: { leads: ['aVR'], min: 0.05 },
  qrsMs: [60, 118],
  irregular: false,
};
