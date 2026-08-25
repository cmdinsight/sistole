# Sístole — Brief técnico para despliegue

## Qué es

Sístole es una aplicación web de formación médica: un simulador clínico de electrocardiografía y arritmias, dirigido a médicos, residentes y estudiantes de medicina.

No es un sitio de contenido ni un curso en video. Es una aplicación interactiva donde el usuario ve trazados de ECG animados en tiempo real, identifica ritmos cardíacos y toma decisiones clínicas dentro de escenarios que evolucionan según lo que elige. Si acierta, el paciente mejora; si se equivoca, se deteriora o muere, y el monitor lo refleja en vivo.

Está en **español, inglés y portugués**, con el idioma seleccionable desde la interfaz.

---

## Qué contiene

**Cuatro secciones principales:**

- **Quiz** — Identificación de 20 ritmos cardíacos sobre trazados animados, con repetición espaciada (algoritmo SM-2), dificultad adaptativa por niveles y modo contrarreloj.
- **Casos** — 24 casos clínicos con historia, signos vitales y opciones de manejo con fundamento.
- **Referencia** — Catálogo consultable de los 20 ritmos con diagramas anotados, buscador y comparador lado a lado.
- **Simulador** — 33 escenarios interactivos ramificados: 24 casos clínicos, 6 de manejo avanzado de arritmias y 3 de paro cardíaco con protocolo ACLS.

**Volumen de contenido:** 228 nodos de decisión, 320 decisiones clínicas posibles, todas con retroalimentación razonada y traducidas a tres idiomas.

**Sistema de progreso:** cuentas de usuario locales, 10 niveles, 41 logros, mapa de dominio por ritmo, estadísticas de efectividad y bitácora de errores con práctica dirigida.

---

## Arquitectura técnica

| | |
|---|---|
| **Stack** | React 18 + Vite 5 + Tailwind CSS 3 |
| **Dependencias** | Solo `react`, `react-dom` y `lucide-react` (iconos) |
| **Backend** | **Ninguno.** Aplicación 100% cliente |
| **Base de datos** | Ninguna. Persistencia en `localStorage` del navegador |
| **Autenticación** | Sin servidor: las cuentas viven en el dispositivo |
| **Build** | Estático (`dist/`), servible desde cualquier CDN u hosting |
| **Tamaño** | ~1.3 MB de JS, ~360 KB comprimido con gzip |

**Todo el ECG se genera por código**, no son imágenes: hay generadores matemáticos de forma de onda (suma de gaussianas) que se dibujan sobre un `<canvas>` a 60 fps, con audio sintetizado vía Web Audio API. La frecuencia del trazado se escala dinámicamente según los signos vitales de cada escenario.

---

## Qué necesito desplegar

La aplicación está lista para producción. El paquete contiene:

```
sistole/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── src/
    ├── App.jsx      ← toda la aplicación (~11.500 líneas)
    ├── main.jsx
    └── index.css
```

**Para construir:**

```bash
npm install
npm run build      # genera dist/
```

**Para probar en local:**

```bash
npm run dev
```

**Despliegue:** al ser una SPA estática funciona en Vercel, Netlify, Cloudflare Pages, o cualquier servidor web sirviendo la carpeta `dist/`.

**Único requisito de configuración:** redirigir todas las rutas a `index.html` (ya viene resuelto en `vercel.json` para Vercel; en Nginx o Apache hay que añadir la regla equivalente).

---

## Lo que quiero

Publicarlo en un dominio propio, accesible desde cualquier dispositivo por un enlace único. Debe funcionar bien en móvil: la interfaz es responsive y está pensada para usarse desde el celular.

---

## Notas para tener en cuenta

**El progreso es por dispositivo.** Como no hay backend, si un usuario entra desde el celular y después desde la computadora, no encuentra su cuenta ni su avance. Es una decisión consciente para esta primera versión.

**Si más adelante se quiere sincronización entre dispositivos**, el camino natural es Supabase o Firebase: la aplicación ya guarda el progreso separado por cuenta, así que migrar de `localStorage` a una base remota es un cambio acotado, no una reescritura.

**Sin analítica ni rastreo** en la versión actual. Si se quiere medir uso, hay que añadirlo.

**El archivo `App.jsx` es grande** (~11.500 líneas) porque contiene todo el contenido clínico embebido: casos, escenarios, traducciones y datos de ondas. Se puede dividir en módulos, pero no es necesario para desplegar.
