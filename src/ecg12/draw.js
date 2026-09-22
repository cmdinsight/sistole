// ═══════════════════════════════════════════════════════════════
// DIBUJO DEL ELECTRO SOBRE UN CANVAS
// ═══════════════════════════════════════════════════════════════
// Sin React: recibe un contexto 2D y una señal, y dibuja. Está separado del
// componente por dos razones. La primera es que así el mismo código que ve el
// usuario se puede correr fuera del navegador para revisar los trazados uno por
// uno antes de publicarlos. La segunda es que dibujar un electro no tiene nada
// que ver con el ciclo de vida de un componente.
//
// Se dibuja en MILÍMETROS, no en píxeles, porque un electro SE MIDE: 25 mm/s y
// 10 mm/mV son la convención que hace que un cuadrado chico valga 0,04 s y
// 0,1 mV. Respetarla es lo que permite que el estudiante cuente cuadraditos en
// la pantalla igual que lo va a hacer en la guardia con el papel en la mano.

import { LAYOUT_3x4 } from './leads.js';

export const MM_PER_SEC = 25;      // velocidad estándar
export const MM_PER_MV = 10;       // ganancia estándar
export const COL_SECONDS = 2.5;    // cada columna del formato 3×4 muestra 2,5 s
export const ROW_MM = 34;          // alto de cada fila
export const PAD_MM = { top: 5, right: 4, bottom: 4, left: 11 };
const CAL_MM = 5;                  // ancho del pulso de calibración (0,2 s)

export const THEMES = {
  paper: {
    bg: '#fffdfa',
    gridMinor: 'rgba(233,120,120,0.34)',
    gridMajor: 'rgba(214,74,74,0.58)',
    trace: '#101418',
    label: '#3f4854',
    highlight: 'rgba(37,99,235,0.07)',
    highlightBar: '#2563eb',
    highlightLabel: '#1d4ed8',
  },
  dark: {
    bg: '#080d14',
    gridMinor: 'rgba(56,189,248,0.10)',
    gridMajor: 'rgba(56,189,248,0.22)',
    trace: '#7dffb0',
    label: '#7d90a8',
    highlight: 'rgba(56,189,248,0.07)',
    highlightBar: '#38bdf8',
    highlightLabel: '#7dd3fc',
  },
};

/** Tamaño de la hoja en milímetros para una configuración dada. */
export function sheetSize({ singleRow = false, rhythmLead = 'II' } = {}) {
  const gridRows = singleRow ? 0 : LAYOUT_3x4.length;
  const rowMm = singleRow ? ROW_MM * 1.7 : ROW_MM;
  return {
    gridRows,
    rowMm,
    w: PAD_MM.left + 4 * COL_SECONDS * MM_PER_SEC + PAD_MM.right,
    h: PAD_MM.top + (gridRows + (rhythmLead ? 1 : 0)) * rowMm + PAD_MM.bottom,
  };
}

/**
 * Dibuja el electro y devuelve las zonas de clic de cada derivación.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} o
 * @param {{fs:number, duration:number, leads:Object}} o.signal
 * @param {number} o.cssW  ancho del canvas en píxeles CSS
 * @returns {{lead:string,x:number,y:number,w:number,h:number}[]}
 */
export function drawEcg(ctx, { signal, cssW, theme = 'paper', rhythmLead = 'II', highlight = [], singleRow = false }) {
  const t = THEMES[theme] || THEMES.paper;
  const { gridRows, rowMm, w: totalW, h: totalH } = sheetSize({ singleRow, rhythmLead });
  const cssH = (cssW * totalH) / totalW;
  const mm = cssW / totalW;              // píxeles por milímetro
  const px = (v) => v * mm;

  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, cssW, cssH);

  // ── Cuadriculado ──
  // Se dibujan primero todas las líneas finas y después las gruesas, en dos
  // trazos, en lugar de una llamada por línea: son ~300 líneas y hacerlo de a
  // una se nota en un celular de gama baja.
  const drawGrid = (stepMm, color, width) => {
    ctx.beginPath();
    for (let x = 0; x <= totalW + 0.01; x += stepMm) {
      const gx = Math.round(px(x)) + 0.5;
      ctx.moveTo(gx, 0); ctx.lineTo(gx, cssH);
    }
    for (let y = 0; y <= totalH + 0.01; y += stepMm) {
      const gy = Math.round(px(y)) + 0.5;
      ctx.moveTo(0, gy); ctx.lineTo(cssW, gy);
    }
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  };
  drawGrid(1, t.gridMinor, 0.5);
  drawGrid(5, t.gridMajor, 0.9);

  const boxes = [];
  const plot = (lead, xStartMm, yBaseMm, fromSec, toSec, widthMm) => {
    const data = signal.leads[lead];
    if (!data) return;
    const fs = signal.fs;
    const i0 = Math.max(0, Math.round(fromSec * fs));
    const i1 = Math.min(data.length, Math.round(toSec * fs));

    const isHot = highlight.includes(lead);
    if (isHot) {
      ctx.fillStyle = t.highlight;
      ctx.fillRect(px(xStartMm), px(yBaseMm - rowMm / 2 + 2), px(widthMm), px(rowMm - 4));
      ctx.fillStyle = t.highlightBar;
      ctx.fillRect(px(xStartMm), px(yBaseMm - rowMm / 2 + 2), Math.max(1.5, px(0.7)), px(rowMm - 4));
    }

    ctx.beginPath();
    ctx.strokeStyle = t.trace;
    ctx.lineWidth = Math.max(1, px(0.32));
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (let i = i0; i < i1; i++) {
      const x = px(xStartMm + ((i - i0) / fs) * MM_PER_SEC);
      const y = px(yBaseMm - data[i] * MM_PER_MV);
      if (i === i0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = isHot ? t.highlightLabel : t.label;
    ctx.font = `${isHot ? 700 : 600} ${px(3.4).toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(lead, px(xStartMm + 2.0), px(yBaseMm - rowMm / 2 + 5.4));

    boxes.push({ lead, x: px(xStartMm), y: px(yBaseMm - rowMm / 2), w: px(widthMm), h: px(rowMm) });
  };

  // ── Pulso de calibración: 1 mV = 10 mm de alto, 0,2 s de ancho ──
  const calibration = (yBaseMm) => {
    ctx.beginPath();
    ctx.strokeStyle = t.trace;
    ctx.lineWidth = Math.max(1, px(0.32));
    const x0 = px(PAD_MM.left - CAL_MM - 1.5), x1 = px(PAD_MM.left - 1.5);
    const yb = px(yBaseMm), yt = px(yBaseMm - MM_PER_MV);
    ctx.moveTo(x0, yb);
    ctx.lineTo(x0 + px(1), yb); ctx.lineTo(x0 + px(1), yt);
    ctx.lineTo(x1 - px(1), yt); ctx.lineTo(x1 - px(1), yb);
    ctx.lineTo(x1, yb);
    ctx.stroke();
  };

  // ── Formato 3×4: cada columna es una ventana temporal distinta ──
  if (!singleRow) {
    LAYOUT_3x4.forEach((row, ri) => {
      const yBase = PAD_MM.top + ri * rowMm + rowMm / 2;
      calibration(yBase);
      row.forEach((lead, ci) => {
        plot(lead, PAD_MM.left + ci * COL_SECONDS * MM_PER_SEC, yBase,
             ci * COL_SECONDS, (ci + 1) * COL_SECONDS, COL_SECONDS * MM_PER_SEC);
      });
    });
  }

  // ── Tira de ritmo: la derivación elegida, los 10 s completos ──
  if (rhythmLead) {
    const yBase = PAD_MM.top + gridRows * rowMm + rowMm / 2;
    calibration(yBase);
    plot(rhythmLead, PAD_MM.left, yBase, 0, signal.duration || 10, 4 * COL_SECONDS * MM_PER_SEC);
  }

  // ── Pie con la calibración, como lo imprime cualquier equipo ──
  ctx.fillStyle = t.label;
  ctx.font = `${px(2.6).toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText('25 mm/s    10 mm/mV', px(PAD_MM.left), cssH - px(1.2));

  return boxes;
}
