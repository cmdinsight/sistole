// Ritmo de la unión.
//
//   npm run index:cinc -- 426995002 426664006
//
// PTB-XL no tiene código para esto. En Ningbo hay 60 registros etiquetados
// "junctional escape" y 12 "accelerated junctional rhythm".
//
// ── EL ESCAPE LENTO NO ESTABA ────────────────────────────────────────────────
//
// La intención era el escape de la unión clásico: angosto, sostenido, entre 40
// y 60, sin ninguna P que conduzca. De los 60, cinco tienen derivaciones planas.
// De los 55 restantes no quedó ninguno, y las razones valen más que la lista:
//
//   · La mayoría son bradicardia sinusal con algún latido de escape suelto, no
//     un ritmo de escape sostenido: el PR se mide bien y es constante.
//   · JS22357 (31 por minuto, QRS de 72 ms) parecía perfecto —el coeficiente de
//     variación del RR daba 0,004— y NO es regular: los RR miden 1936, 1460,
//     1928, 1572 y 1936 ms. El coeficiente usa la mediana de las desviaciones,
//     que es robusta a un valor suelto y por eso mismo es CIEGA cuando la
//     minoría se desvía: dos de cinco RR se apartan un 25 % y la mediana de las
//     desviaciones sigue siendo 8 ms. Un estadístico robusto puede esconder
//     exactamente lo que se le está preguntando.
//   · JS12436 (37 por minuto, QRS de 80 ms, sin PR medible sobre el promedio)
//     parecía el mejor. El PR LATIDO A LATIDO lo desarmó: da 216, 212, 220 y
//     216 ms con cuatro derivaciones de acuerdo. Hay P que conducen, con un PR
//     constante y largo: es un bloqueo de alto grado con conducción parcial, no
//     un ritmo de la unión. Las dos mediciones del PR no se contradicen —una
//     exige segmento isoeléctrico sobre el promedio y la otra no— y la que
//     decide acá es la que mira latido a latido.
//
// ── LA ONDA P RETRÓGRADA: SE INTENTÓ Y NO SE PUDO ────────────────────────────
//
// El hallazgo POSITIVO de un ritmo de la unión es la P retrógrada: la aurícula
// activada de abajo hacia arriba deja una P negativa en II, III y aVF y positiva
// en aVR, pegada al QRS. Se construyó la medición y se la calibró antes de
// usarla. Fracasó, y de una manera instructiva:
//
//     deflexión negativa en II/III/aVF, positiva en aVR,
//     de menos de 130 ms y a menos de 160 ms del QRS:
//
//         ritmo de la unión .......  8 / 60
//         NORMALES ................  4 / 70
//         INFARTO INFERIOR ........ 12 / 60
//
// Dispara MÁS en los infartos inferiores que en los ritmos de la unión, y el
// motivo es que una onda T invertida en cara inferior es exactamente eso:
// negativa en II, III y aVF, y positiva en aVR. La medición no mide la P
// retrógrada, mide la T invertida. Se descartó.
//
// Lo que haría falta para separarlas es exigir que después de la deflexión haya
// TODAVÍA una onda T, o sea distinguir dos ondas de una; es la misma forma del
// problema que resolvió ondaU(), y no se intentó acá.
//
// ── EL QUE SÍ: JS22432 ───────────────────────────────────────────────────────
//
// Mujer de 28, y una sola etiqueta en toda la base: "accelerated junctional
// rhythm". Trece latidos, RR de 728 a 760 ms —dispersión máxima del 2 %, no la
// mediana: la máxima—, QRS de 84 ms, eje +47°, QTc 387, 54 µV de ruido.
//
// Y ninguna onda P delante del QRS. El latido promedio de once complejos en la
// derivación II no muestra nada positivo en los 420 ms previos, y la medición
// del PR no encuentra nada en ninguna de sus cinco derivaciones.
//
// Los dos hallazgos juntos ubican el marcapasos sin ambigüedad: el QRS angosto
// dice que el impulso usó el His y las dos ramas, o sea que nació en la unión o
// por encima; la ausencia de P dice que no nació en el nodo sinusal. Queda la
// unión.
//
// A 81 por minuto no es un escape: la unión dispara sola entre 40 y 60, y por
// encima de eso hay algo que la está acelerando. El caso enseña justamente esa
// diferencia, que es la que cambia la conducta.
//
// HONESTIDAD SOBRE LA GUARDA: "no hay onda P" es un hallazgo negativo, y la
// medición del PR devuelve null en 7 de 70 electros NORMALES —el 10 %, y 5 de
// esos 7 con buen trazado—. No alcanza sola. Sirve como una de varias
// condiciones sobre un trazado que ya se miró, que es para lo que se usa acá.
export default {
  noPWave: true,
  qrsMs: [60, 110],
  rate: [70, 95],
  irregular: false,
};
