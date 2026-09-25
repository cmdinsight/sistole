# Video: nueva sección «12 Derivaciones»

Video vertical (1080×1920, 42 s, 30 fps) para Reels / TikTok / Stories, hecho con
[HyperFrames](https://hyperframes.heygen.com). El render final es
`sistole-12-derivaciones.mp4`.

Guion: anuncio → qué trae la sección → caso (mujer de 67 años, dolor torácico) →
su electro real (PTB-XL 12899, el mismo del caso `inferior-stemi`) con las 4
opciones y un temporizador → respuesta (IAM inferior) → por qué (ST ↑ en II, III,
aVF y descenso recíproco en aVL, con los valores medidos de `cases.js`) → perla
(III > II, V3R–V4R antes del nitrato) → cierre con **sistole.cmdtech.uy**.

## Volver a renderizar

Requiere Node 22+ y FFmpeg (con ffprobe).

```bash
cd marketing/video-12-derivaciones
node generar-ecg.mjs assets/ecg.js   # sólo si cambia el trazado
npm run check
npm run render -- -o sistole-12-derivaciones.mp4
```

GSAP y las tipografías están en `assets/` para que el render no dependa de la red.

## Versión para LinkedIn

En `linkedin/` está la versión 4:5 (1080×1350, 45 s), el formato que más ocupa en
el feed de LinkedIn en el celular. Cambia el enfoque: arranca por el porqué
(electros reales en vez de dibujados) y las cifras —más de 88.000 electros
revisados, 32 casos elegidos, 568 verificaciones automáticas— antes de mostrar
el mismo caso. Se renderiza igual, desde esa carpeta:

```bash
cd marketing/video-12-derivaciones/linkedin
npm run check
npm run render -- -o sistole-12-derivaciones-linkedin.mp4
```
