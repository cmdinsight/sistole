// Taquicardia ventricular: NO se pudo hacer el caso. Queda anotado por qué.
//
// Del CinC 2021 (SNOMED 425856008, "paroxysmal ventricular tachycardia", 53
// registros en Ningbo). PTB-XL no tiene ninguno.
//
// ── DE 53 A UNO ──────────────────────────────────────────────────────────────
//
// Se midieron los 53 y se los pasó por tres filtros:
//
//   1. Derivaciones planas. Cinco registros tienen las seis precordiales en
//      línea recta durante media tira: el electrodo no estaba midiendo nada.
//      Dos de ellos eran los MEJORES por número —JS11521 y JS11520 son los
//      únicos dos con la etiqueta de taquicardia ventricular y ninguna otra,
//      regulares, anchos y rápidos—. Al dibujarlos no servían. Es exactamente
//      para esto que existe el paso de mirar, y es la segunda vez que salva
//      una elección.
//
//   2. Ancho y velocidad. De los 48 que quedan, 19 tienen QRS ≥ 110 ms y más de
//      100 lpm.
//
//   3. Ruido y regularidad. Sobreviven cuatro, y tres se caen solos: dos con
//      más de 250 µV de variación entre latidos y uno con Wolff-Parkinson-White
//      y aleteo auricular encima, que es la peor combinación posible para
//      enseñar a leer una taquicardia ancha.
//
// Queda JS21813: regular a 154, QRS de 144 ms, 46 µV de ruido, monomorfo y
// limpio. Es un trazado precioso.
//
// ── Y POR QUÉ TAMPOCO ÉSE ────────────────────────────────────────────────────
//
// La base le pone TRES etiquetas a la vez: bloqueo completo de rama derecha,
// taquicardia supraventricular y taquicardia ventricular paroxística. La propia
// anotación no decide entre las dos hipótesis que el electro plantea, y son
// incompatibles: o el complejo nace en el ventrículo, o viene de arriba y se
// ensancha al bajar por una rama bloqueada.
//
// Lo medido que apunta a ventricular, de los algoritmos de Brugada y Vereckei:
// QRS de 144 ms, regular, sin ondas P medibles, QRS positivo en aVR (R 3,2 mm
// contra S 1,3 mm), eje en −78°, y en V1 una R monofásica de 545 µV precedida
// de una q chica, sin segunda R.
//
// Ese último punto parecía el que zanjaba el asunto: un bloqueo de rama derecha
// deja en V1 un rsR', y acá rPrime mide 0. Se agregó una regla noSecondR para
// poder exigirlo, y ANTES de usarla se la calibró contra los registros de
// PTB-XL etiquetados como bloqueo completo de rama derecha. El resultado la
// desarmó:
//
//     bloqueo completo de rama derecha (CRBBB) ... 11 de 40 con segunda R en V1
//     normales ................................... 1 de 40
//
// O sea que la medición es ESPECÍFICA —casi ningún normal tiene una segunda R—
// pero muy poco SENSIBLE: 29 de 40 bloqueos de rama derecha de verdad tampoco
// la muestran, porque la r inicial de V1 suele quedar por debajo del umbral de
// 0,10 mV con que segundaR() cuenta un pico. Sirve para AFIRMAR un bloqueo de
// rama cuando aparece, y no sirve para NEGARLO cuando falta. Es la diferencia
// entre un hallazgo positivo y su ausencia, y acá se necesitaba justamente la
// ausencia.
//
// Sin ese punto, lo que queda no distingue una taquicardia ventricular de una
// supraventricular conducida con aberrancia, que es el diagnóstico diferencial
// entero. La regla noSecondR se quitó: no tenía otro uso.
//
// Lo que zanjaría el asunto es la disociación auriculoventricular. Ya se había
// intentado medirla para el bloqueo AV completo, con tres métodos distintos, y
// el mejor marcaba 6 de 50 electros NORMALES como disociados. No está medible
// con lo que hay.
//
// ── QUÉ HARÍA FALTA ──────────────────────────────────────────────────────────
//
//   · Medir disociación AV de forma confiable. Es el criterio que falta, y
//     también desbloquearía el bloqueo AV completo y el ritmo idioventricular.
//   · O un registro de taquicardia ventricular con UNA sola etiqueta, limpio y
//     con las doce derivaciones vivas. En Ningbo no hay; habría que escanear las
//     otras siete bases del CinC 2021, que no están indexadas.
//
// Nota aparte: la conducta clínica no depende de resolver esto. Una taquicardia
// regular de complejo ancho se trata como ventricular hasta que se demuestre lo
// contrario. Pero un caso que pregunta "¿qué muestra este electro?" tiene que
// poder responderlo sobre el trazado, y acá no se puede.
export default {
  // Sin registro que lo satisfaga: no hay findings que ofrecer todavía.
};
