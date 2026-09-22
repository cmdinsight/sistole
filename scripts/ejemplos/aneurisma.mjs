// Aneurisma ventricular: infarto anterior antiguo con elevación PERSISTENTE
// del ST.
//
//   npm run search:ptbxl -- --scp ANEUR --findings scripts/ejemplos/aneurisma.mjs
//
// Después de un infarto anterior grande la pared queda fina, cicatrizal y sin
// contraerse; en sístole, en vez de empujar, se abomba hacia afuera. Esa pared
// discinética mantiene una corriente de lesión, y el ST que tendría que haber
// vuelto a la línea de base a las dos semanas se queda arriba para siempre.
// De ahí el trazado: las ondas R de la cara anterior perdidas —el músculo que
// las generaba no está— y encima, elevación del ST.
//
// ── LO QUE DIO LA CALIBRACIÓN, Y POR QUÉ CAMBIÓ EL CASO ─────────────────────
//
// Se midieron tres discriminadores contra los grupos etiquetados: 57 registros
// ANEUR y 46 infartos anteriores en Stadium I (agudos). NINGUNO separa.
//
//   1. Razón T/QRS (la regla de Smith: sumar T y sumar QRS de pico a pico en
//      V1-V4; por debajo de 0,22 hablaría de aneurisma).
//        aneurisma  p25 0,125  mediana 0,181  p75 0,245
//        agudo      p25 0,153  mediana 0,204  p75 0,266
//      38 de 57 aneurismas quedan por debajo de 0,22 — pero también 25 de 46
//      agudos. Es poco más que tirar una moneda.
//
//   2. Complejo QS (R ≤ 100 µV) junto con ST ≥ 1,5 mm en V2 y V3:
//      0 de 57 aneurismas lo cumplen. La R está reducida, no ausente.
//      Medianas de la onda R, sobre 70 registros de cada grupo:
//        V2   aneurisma 231 µV · anterior antiguo  90 · normal 476
//        V3   aneurisma 248 µV · anterior antiguo 139 · normal 825
//      De ahí salen los 4,8 y 8,3 mm que el caso usa como referencia.
//
//   3. Descenso recíproco en la cara inferior, que el libro adjudica al agudo:
//      sale al revés. 16 de 53 aneurismas lo tienen y sólo 6 de 43 agudos.
//
// Lo que SÍ separa es el aneurisma del infarto anterior antiguo SIN aneurisma:
// ST máximo en V2-V3, mediana de 302 µV contra 136. O sea que el trazado puede
// decir "infarto viejo cuyo ST no bajó", y eso es exactamente la definición del
// patrón. Lo que NO puede decir, y el caso lo dice con estos números, es que no
// haya además un infarto AGUDO encima. Por eso ante dolor se trata como agudo.
export default {
  stElevation: { leads: ['V2', 'V3'], min: 0.20 },
  rLoss: { leads: ['V1', 'V2', 'V3'], max: 0.25 },
  // Que la elevación esté confinada adelante es lo que lo separa de una
  // pericarditis, que la da difusa.
  stFlat: { leads: ['I', 'II', 'aVL', 'aVF'], max: 0.10 },
  qrsMs: [60, 118],
  rate: [55, 100],
  irregular: false,
};
