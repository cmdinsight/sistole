import React, { useRef, useEffect, useCallback } from 'react';
import { drawEcg, sheetSize } from './draw.js';

// ═══════════════════════════════════════════════════════════════
// TwelveLead — envoltorio React del dibujo de 12 derivaciones
// ═══════════════════════════════════════════════════════════════
// Todo lo que es dibujo vive en draw.js. Acá sólo queda lo que corresponde a un
// componente: ajustar el canvas a la densidad de la pantalla, redibujar cuando
// cambia el tamaño y traducir un clic a la derivación que se tocó.

export default function TwelveLead({
  signal,
  theme = 'paper',
  rhythmLead = 'II',
  highlight = [],
  onLeadClick,
  // singleRow dibuja sólo la tira de ritmo, sin la grilla 3×4: se usa al ampliar
  // una derivación para mirarle el ST de cerca.
  singleRow = false,
  // Milímetros por milivoltio. Lo elige el que llama, normalmente con
  // suggestGain(): un electro de mucho voltaje se dibuja a la mitad, como en el
  // papel de cualquier equipo.
  gain,
  className = '',
}) {
  const canvasRef = useRef(null);
  const boxesRef = useRef([]);   // zonas de clic por derivación, en píxeles CSS

  const sheet = sheetSize({ singleRow, rhythmLead });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !signal) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;

    // El canvas se dimensiona en píxeles reales del dispositivo y se escala el
    // contexto: sin esto el trazado se ve borroso en cualquier pantalla retina,
    // y un electro borroso no se puede medir.
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor((rect.width * sheet.h) / sheet.w * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    boxesRef.current = drawEcg(ctx, { signal, cssW: rect.width, theme, rhythmLead, highlight, singleRow, gain });
  }, [signal, theme, rhythmLead, highlight, singleRow, gain, sheet.w, sheet.h]);

  useEffect(() => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const handleClick = (e) => {
    if (!onLeadClick) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const hit = boxesRef.current.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    if (hit) onLeadClick(hit.lead);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className={`w-full block ${onLeadClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ aspectRatio: `${sheet.w} / ${sheet.h}` }}
    />
  );
}
