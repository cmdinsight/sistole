// ═══════════════════════════════════════════════════════════════
// LECTOR DE WFDB — el formato en que PhysioNet publica PTB-XL
// ═══════════════════════════════════════════════════════════════
// Un registro son dos archivos: un .hea de texto con la cabecera y un .dat
// binario con las muestras. Se implementa acá el formato 16 (enteros de 16 bits
// con signo, little-endian, muestras intercaladas entre derivaciones), que es el
// que usa PTB-XL. No hace falta ninguna dependencia.
//
// Especificación: https://wfdb.readthedocs.io/en/latest/wfdb.html

import { readFileSync } from 'node:fs';

/**
 * Parsea una cabecera .hea.
 *
 * Primera línea:   nombre nSeñales frecuencia nMuestras [hora fecha]
 * Líneas siguientes (una por señal):
 *   archivo formato ganancia(baseline)/unidad resolución cero inicial checksum bloque descripción
 */
export function parseHeader(text) {
  const lines = text.split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const [name, nSigStr, fsStr, nSampStr] = lines[0].split(/\s+/);
  const nSig = parseInt(nSigStr, 10);
  const header = {
    name,
    nSig,
    fs: parseFloat(fsStr),
    nSamples: parseInt(nSampStr, 10),
    signals: [],
  };

  for (let i = 1; i <= nSig; i++) {
    const f = lines[i].split(/\s+/);
    // La ganancia viene como "1000.0(0)/mV": ganancia, baseline entre paréntesis
    // y unidad tras la barra. Los dos últimos son opcionales.
    const m = /^([-\d.eE+]+)(?:\((-?\d+)\))?(?:\/(\S+))?$/.exec(f[2] || '');
    header.signals.push({
      file: f[0],
      format: parseInt(f[1], 10),
      gain: m && parseFloat(m[1]) ? parseFloat(m[1]) : 200,
      baseline: m && m[2] !== undefined ? parseInt(m[2], 10) : 0,
      units: (m && m[3]) || 'mV',
      adcRes: f[3] !== undefined ? parseInt(f[3], 10) : 16,
      adcZero: f[4] !== undefined ? parseInt(f[4], 10) : 0,
      // La descripción es el nombre de la derivación: "I", "II", "aVR", "V1"...
      name: f.slice(8).join(' ') || `sig${i - 1}`,
    });
  }
  return header;
}

/**
 * Lee un registro completo y devuelve las señales en unidades físicas (mV).
 * @param {string} heaPath ruta al .hea; el .dat se busca al lado.
 */
export function readRecord(heaPath) {
  const header = parseHeader(readFileSync(heaPath, 'utf8'));

  const unsupported = header.signals.find((s) => s.format !== 16);
  if (unsupported) {
    throw new Error(`Formato WFDB ${unsupported.format} no soportado (solo el 16). Señal: ${unsupported.name}`);
  }
  const files = new Set(header.signals.map((s) => s.file));
  if (files.size !== 1) {
    throw new Error('Se esperaba un único .dat con todas las derivaciones intercaladas.');
  }

  const datPath = heaPath.replace(/[^/\\]+$/, header.signals[0].file);
  const buf = readFileSync(datPath);
  // Se crea una vista Int16 sobre el buffer sin copiarlo. El byteOffset importa:
  // Node puede entregar buffers que son una ventana de un pool mayor.
  const raw = new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 2));

  const n = Math.min(header.nSamples, Math.floor(raw.length / header.nSig));
  const leads = {};
  header.signals.forEach((sig, si) => {
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // Muestras intercaladas: frame i, señal si → índice i*nSig + si
      out[i] = (raw[i * header.nSig + si] - sig.baseline) / sig.gain;
    }
    leads[sig.name] = out;
  });

  return { name: header.name, fs: header.fs, nSamples: n, duration: n / header.fs, leads,
           order: header.signals.map((s) => s.name) };
}

// ── Escritura, sólo para poder probar la lectura contra datos conocidos ──
export function writeRecordFiles(name, fs, leads, order, gain = 1000) {
  const n = leads[order[0]].length;
  const raw = new Int16Array(n * order.length);
  for (let i = 0; i < n; i++) {
    for (let si = 0; si < order.length; si++) {
      raw[i * order.length + si] = Math.round(leads[order[si]][i] * gain);
    }
  }
  const hea = [
    `${name} ${order.length} ${fs} ${n}`,
    ...order.map((l) => `${name}.dat 16 ${gain.toFixed(1)}(0)/mV 16 0 0 0 0 ${l}`),
  ].join('\n') + '\n';
  return { hea, dat: Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength) };
}
