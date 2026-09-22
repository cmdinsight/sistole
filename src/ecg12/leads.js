// ═══════════════════════════════════════════════════════════════
// GEOMETRÍA DE LAS 12 DERIVACIONES
// ═══════════════════════════════════════════════════════════════
// Una derivación no es una señal independiente: es la proyección del vector
// eléctrico del corazón sobre un eje. Modelando el vector en 3D y proyectándolo,
// las polaridades salen solas — aVR negativa, rS en V1, qR en V6 — en lugar de
// tener que falsificarlas derivación por derivación.
//
// Sistema de coordenadas (el habitual en vectocardiografía):
//   X → hacia la izquierda del paciente
//   Y → hacia los pies
//   Z → hacia adelante (pared torácica anterior)

// Plano frontal. Los ángulos son los de Einthoven y Goldberger, no una elección
// nuestra: I a 0°, II a 60°, III a 120°, aVR a -150°, aVL a -30°, aVF a 90°.
//
// El factor de magnitud importa y es fácil pasarlo por alto: las derivaciones
// AUMENTADAS valen √3/2 de las bipolares. Con magnitud 1 se dibujan un 15% más
// grandes de lo que deben y, sobre todo, deja de cumplirse aVR = -(I+II)/2.
const AUG = Math.sqrt(3) / 2;
const frontal = (deg, mag = 1) => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r) * mag, Math.sin(r) * mag, 0];
};

// Plano transversal. Cada electrodo precordial mira a un punto distinto de la
// pared torácica: V1 a la derecha del esternón y anterior, V6 en la línea
// medioaxilar izquierda. El ángulo va desde +X (izquierda) hacia +Z (adelante).
const transverse = (deg, anterior = 1) => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r), 0, Math.sin(r) * anterior];
};

export const LEAD_VECTORS = {
  I:   frontal(0),
  II:  frontal(60),
  III: frontal(120),
  aVR: frontal(-150, AUG),
  aVL: frontal(-30, AUG),
  aVF: frontal(90, AUG),
  V1: transverse(115),
  V2: transverse(94),
  V3: transverse(70),
  V4: transverse(48),
  V5: transverse(26),
  V6: transverse(2),
};

// Orden estándar de presentación (el del papel milimetrado de cualquier equipo).
export const LEAD_ORDER = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

// Disposición 3×4 de un electro impreso: cada columna son 2,5 s del registro.
export const LAYOUT_3x4 = [
  ['I', 'aVR', 'V1', 'V4'],
  ['II', 'aVL', 'V2', 'V5'],
  ['III', 'aVF', 'V3', 'V6'],
];

export const project = (vec, lead) => {
  const a = LEAD_VECTORS[lead];
  return vec[0] * a[0] + vec[1] * a[1] + vec[2] * a[2];
};
