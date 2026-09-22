// ═══════════════════════════════════════════════════════════════
// TRAZADOS REALES: FORMATO COMPACTO Y RECONSTRUCCIÓN DE LAS 12
// ═══════════════════════════════════════════════════════════════
// Los electros de la sección son registros reales de PTB-XL (PhysioNet). El
// original viene en WFDB: un binario de 12 derivaciones a 500 Hz. Para la app se
// guarda en public/ecg12/ una versión más liviana, y este módulo la vuelve a
// convertir en señales en milivoltios.
//
// Se guardan OCHO derivaciones, no doce, y no es para ahorrar espacio: es que un
// electrocardiógrafo tampoco mide doce. Mide I, II y V1-V6; III, aVR, aVL y aVF
// las CALCULA a partir de las dos primeras, porque quedan determinadas por la
// ley de Kirchhoff aplicada al triángulo de Einthoven. Guardar las cuatro
// derivadas sería guardar información que ya está.
//
// Se verificó contra los registros originales: la diferencia entre las
// derivaciones calculadas acá y las que publica PTB-XL es de 1,5 µV, que es
// exactamente el escalón de cuantización. No hay pérdida.

export const STORED_LEADS = ['I', 'II', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

const b64ToBytes = (b64) => {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // Node, para las pruebas.
  return new Uint8Array(Buffer.from(b64, 'base64'));
};

/**
 * Convierte el payload guardado en señales listas para dibujar.
 * @param {{fs:number, samples:number, gain:number, leads:string[], data:string}} rec
 * @returns {{fs:number, duration:number, leads:Object<string,Float32Array>, labels:string[]}}
 */
export function decodeRecord(rec) {
  const bytes = b64ToBytes(rec.data);
  // La vista Int16 necesita que el offset esté alineado a 2 bytes; se copia el
  // buffer para no depender de cómo lo haya alojado el navegador.
  const raw = new Int16Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const n = rec.samples;
  const stored = rec.leads || STORED_LEADS;

  const leads = {};
  stored.forEach((lead, li) => {
    const out = new Float32Array(n);
    const base = li * n;
    for (let i = 0; i < n; i++) out[i] = raw[base + i] / rec.gain;
    leads[lead] = out;
  });

  return { fs: rec.fs, duration: n / rec.fs, leads: deriveLimbLeads(leads), labels: LEAD_LABELS.slice() };
}

export const LEAD_LABELS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

/**
 * Completa III, aVR, aVL y aVF a partir de I y II.
 *
 *   III = II − I          (Einthoven: la suma de los tres lados del triángulo es cero)
 *   aVR = −(I + II)/2     (Goldberger: el electrodo explorador contra el promedio de los otros dos)
 *   aVL = I − II/2
 *   aVF = II − I/2
 *
 * De acá sale que aVR es negativa en casi todo electro normal: no es una
 * convención arbitraria, es que mira al corazón desde el hombro derecho, en
 * contra de la dirección en la que se despolariza el ventrículo.
 */
export function deriveLimbLeads(leads) {
  const { I, II } = leads;
  const n = I.length;
  const III = new Float32Array(n), aVR = new Float32Array(n), aVL = new Float32Array(n), aVF = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = I[i], b = II[i];
    III[i] = b - a;
    aVR[i] = -(a + b) / 2;
    aVL[i] = a - b / 2;
    aVF[i] = b - a / 2;
  }
  return { ...leads, III, aVR, aVL, aVF };
}

/** Codifica señales al formato guardado. Lo usa scripts/fetch-ptbxl.mjs. */
export function encodeRecord(leads, fs, gain = 1000) {
  const n = leads[STORED_LEADS[0]].length;
  const raw = new Int16Array(n * STORED_LEADS.length);
  STORED_LEADS.forEach((lead, li) => {
    const src = leads[lead];
    for (let i = 0; i < n; i++) {
      // Se satura en vez de desbordar: un valor fuera de rango daría la vuelta y
      // aparecería como un pico invertido en mitad del trazado.
      const v = Math.round(src[i] * gain);
      raw[li * n + i] = v > 32767 ? 32767 : v < -32768 ? -32768 : v;
    }
  });
  return { fs, samples: n, gain, leads: STORED_LEADS.slice(), data: Buffer.from(raw.buffer).toString('base64') };
}
