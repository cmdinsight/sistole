// Bloqueo bifascicular derecho + posterior: rama derecha + hemibloqueo POSTERIOR.
//   npm run search:ptbxl -- --scp CRBBB,LPFB --findings scripts/ejemplos/bifascicular-posterior.mjs
// El hermano raro y peor del caso 14. Ahí faltaban la rama derecha y el
// fascículo anterior; acá faltan la rama derecha y el POSTERIOR, que es corto,
// ancho y de doble irrigación: cuesta mucho más romperlo, y cuando se rompe
// suele ser por un daño extenso. La conducción entera queda colgando del
// fascículo anterior izquierdo.
// La diferencia con el caso 14 se lee en un solo número: el eje. Allá iba a
// −68°, hacia arriba y a la izquierda; acá tiene que irse a la DERECHA.
export default {
  qrsMs: [120, 190],
  dominantR: ['V1'],
  secondR: { leads: ['V1'], min: 0.30 },
  sDepth: { leads: ['I', 'V6'], min: 0.15 },
  axisDeg: [95, 175],
  rsPattern: ['I', 'aVL'],
  irregular: false,
};
