// Hemibloqueo posterior izquierdo.
//
//   npm run search:ptbxl -- --scp LPFB \
//     --not-scp IRBBB,RVH,LMI,ALMI,ILMI,IPMI,PMI,IMI,ASMI,AMI,AFIB \
//     --findings scripts/ejemplos/hemibloqueo-posterior.mjs
//
// El espejo del hemibloqueo anterior, y mucho más raro. El fascículo posterior
// izquierdo es corto, ancho y tiene doble irrigación: cuesta bloquearlo. Cuando
// se bloquea, el ventrículo izquierdo se activa desde el fascículo anterior
// —desde arriba y adelante— y el vector resultante sale hacia abajo y a la
// derecha. Eso es una desviación DERECHA del eje.
//
// Y acá está lo incómodo, que es justamente lo que hay que enseñar: el trazado
// solo no alcanza. Una desviación derecha del eje la da también un corazón
// vertical en alguien flaco y joven, una hipertrofia del ventrículo derecho, un
// EPOC, un infarto lateral. El hemibloqueo posterior es un diagnóstico POR
// DESCARTE. Lo único que el electro puede aportar son las exclusiones, y se
// piden todas las que se pueden medir:
//
//   · QRS angosto — no es un bloqueo de rama
//   · rS en V1, no R dominante — no es hipertrofia derecha
//   · una r INICIAL en I y aVL — no es un infarto lateral, que empieza con Q
//   · R dominante en II, III y aVF: el vector va para abajo
//
// Lo que NO se puede medir queda para el texto del caso: la contextura física,
// la radiografía, el ecocardiograma, un electro previo.
//
// ── LO QUE DIO LA BÚSQUEDA, QUE VALE LA PENA DEJAR ESCRITO ──────────────────
//
// De 21.799 registros, 92 limpios traen el código LPFB. Y se reparten así:
//
//   · 44 traen además CRBBB y 21 más IRBBB. O sea que 65 de 92 —el 71 %— son
//     en realidad bloqueos bifasciculares, no hemibloqueos posteriores
//     aislados. Coincide con la clínica: el posterior aislado es rarísimo.
//   · 12 traen hipertrofia ventricular derecha, que es el confundidor.
//   · Quitando ramas, hipertrofias, infartos y fibrilación quedan 12 registros.
//     Y de esos 12, las edades son 17, 18, 19, 22, 24, 25, 35, 37, 47, 63, 63
//     y 64 años. Los limpios son jóvenes y flacos: corazón vertical.
//
// Los dos únicos pacientes en los que un cardiólogo de verdad lo sospechó
// —6938 y 8007, las dos de 63 años— escribieron "PROBABLE left posterior
// fascicular block", y los dos trazados miden 125 y 172 µV de ruido con una
// derivación I en la que no se ve el complejo: justo la derivación donde hay
// que ver la rS. Se miraron dibujados y no se pueden enseñar.
//
// Varios de los limpios están etiquetados a la vez como NORM y como LPFB, y
// dos informes dicen con todas las letras "no definite pathology" / "inget
// säkert patologiskt". La base no está equivocada: está mostrando el problema.
//
// Conclusión: no hay en PTB-XL un hemibloqueo posterior izquierdo aislado que
// se pueda afirmar. Lo que sí hay, y es lo que enseña el caso, es el PATRÓN
// limpio y las tres exclusiones que el electro sí puede hacer.
export default {
  axisDeg: [95, 175],
  qrsMs: [60, 118],
  dominantR: ['II', 'III', 'aVF'],
  rsPattern: ['I', 'aVL', 'V1'],
  rHeight: { leads: ['I', 'aVL'], min: 0.06 },
  irregular: false,
};
