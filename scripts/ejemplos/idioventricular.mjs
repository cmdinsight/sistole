// Ritmo idioventricular acelerado.
//
//   npm run index:cinc -- 81898007 61277005
//
// PTB-XL no tiene ningún código para esto. En el catálogo del CinC 2021 hay
// cuatro que sirven, y la tabla oficial del desafío dice dónde vive cada uno:
//
//     81898007  ventricular escape rhythm .............. 96 en Ningbo
//     61277005  accelerated idioventricular rhythm ..... 14 en Ningbo
//     426995002 junctional escape ...................... 60 en Ningbo
//     49260003  idioventricular rhythm ................. 2, y los dos en San
//                                                        Petersburgo, que el
//                                                        adaptador no lee
//
// Sobre las 14.000 cabeceras ya bajadas aparecen 44 del primero y 7 del segundo.
//
// ── POR QUÉ NO SALIÓ EL ESCAPE LENTO ─────────────────────────────────────────
//
// La primera intención era el idioventricular clásico: el escape de 20 a 40 por
// minuto, ancho, que es el ritmo de último recurso. De los 44 candidatos, 16
// tienen derivaciones planas y se caen al dibujarlos. De los que quedan:
//
//   · JS12525 parecía el mejor de todos por número: 22 por minuto, QRS de
//     148 ms, RR de 2748 y 2760 ms, y CERO de ruido entre latidos. El cero era
//     la pista. A 22 por minuto entran TRES latidos en diez segundos, y
//     descartando el primero y el último para que no queden cortados por los
//     bordes, queda UNO. El ruido entre latidos no daba cero por limpio: daba
//     cero porque no había con qué comparar, y el ancho, el eje y la plantilla
//     se habrían apoyado enteros sobre un único complejo. Un número perfecto
//     puede significar que la medición no tenía datos.
//   · JS12521 (33 por minuto) mide 112 ms de QRS, que no alcanza para llamarlo
//     ancho, y dibujado tiene los complejos chicos y angostos.
//   · JS12488 y JS19201 vienen con aleteo auricular encima, que es el peor
//     acompañante para enseñar de dónde nace un complejo.
//
// Y hay una razón de fondo para no insistir: el escape ventricular lento
// aparece casi siempre DENTRO de un bloqueo AV completo, que ya es el caso 30.
// Dos casos con el mismo trazado de fondo enseñan una vez.
//
// ── EL QUE SÍ: JS22128 ───────────────────────────────────────────────────────
//
// Mujer de 39. Regular a 78 —los RR van de 752 a 788 ms, coeficiente de
// variación 0,013—, trece latidos, 112 µV de ruido. Y un QRS de 220 ms.
//
// Cinco cosas medidas, y todas dicen lo mismo:
//
//     QRS ................ 220 ms   (por encima de 160 ya es ventricular)
//     eje ................ −123°    (cuadrante noroeste)
//     R en aVR ........... 12,8 mm contra S de 0,0 — monofásica
//     V5 y V6 ............ R de 0,0 mm, patrón QS
//     disociación AV ..... aurícula 113, ventrículo 78, razón 1,45
//
// La disociación la encuentra la medición que se construyó para el caso 30, y
// vale la pena decirlo porque ES el criterio que faltaba cuando se intentó el
// caso de taquicardia ventricular y no se pudo: acá las ondas P son medibles
// —189 µV, 76 ms, cuatro derivaciones de acuerdo, realce 2,97— y allá no.
//
// Confirmación independiente, la misma forma que en el caso 30: la etiqueta de
// la base dice "sinus tachycardia" y la medición da la aurícula a 113.
//
// Y una segunda, que no comparte nada con la anterior: el PR latido a latido da
// 272 · 268 · 188 · 232 · 128 · 84 · 160 · 332 · 276 · 292 · 288 ms. Azaroso.
// El PR del latido promedio, en cambio, devuelve "sin medición" —la exigencia
// de segmento PR isoeléctrico funcionando como corresponde—, que es la
// respuesta correcta cuando la aurícula va por su cuenta.
//
// ── LO QUE ESTE TRAZADO NO PERMITE AFIRMAR ───────────────────────────────────
//
// Hay supradesnivel del ST de 4 a 7 mm en II, III y aVF, con descenso en aVL.
// Parece un infarto inferior y NO se puede decir eso. En esas tres derivaciones
// el QRS es netamente negativo —S de 19, 16 y 17 mm— y un complejo de 220 ms
// arrastra la repolarización hacia el lado contrario al suyo. El ST elevado
// sobre un QRS negativo es lo esperable. Sobre un complejo ventricular ancho el
// segmento ST no se lee para isquemia, y el caso lo dice en vez de aprovecharlo.
export default {
  avDissociation: { min: 1.3 },
  qrsMs: [190, 250],
  rate: [65, 95],
  irregular: false,
  axisDeg: [-180, -90],
  dominantR: ['aVR'],
};
