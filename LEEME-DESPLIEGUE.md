# Sístole — Brief técnico

> Última actualización: septiembre 2026. En producción en **https://sistole.cmdtech.uy**

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

**Sistema de progreso:** cuentas de usuario con sincronización entre dispositivos, 10 niveles, 41 logros, mapa de dominio por ritmo, estadísticas de efectividad y bitácora de errores con práctica dirigida.

---

## Arquitectura técnica

| | |
|---|---|
| **Frontend** | React 18 + Vite 5 + Tailwind CSS 3 |
| **Backend** | Funciones serverless de Vercel (`api/`), Node 20 |
| **Base de datos** | **Neon** (Postgres serverless), vía `@neondatabase/serverless` |
| **Autenticación** | Propia: contraseñas con `bcryptjs`, sesiones en cookie `HttpOnly` de 180 días |
| **Dependencias de UI** | `react`, `react-dom`, `lucide-react` (iconos) |
| **App móvil** | Capacitor 8 (iOS, App Store) + TWA (Android, Google Play) |
| **Build** | `dist/` estático + funciones serverless, desplegado en Vercel |
| **Tamaño** | ~1,3 MB de JS (~412 KB gzip) y ~37 KB de CSS (~7 KB gzip) |

**Todo el ECG se genera por código**, no son imágenes: hay generadores matemáticos de forma de onda (suma de gaussianas) que se dibujan sobre un `<canvas>` a 60 fps, con audio sintetizado vía Web Audio API. La frecuencia del trazado se escala dinámicamente según los signos vitales de cada escenario.

### Cómo persiste el progreso

Modelo híbrido, pensado para que la app siga siendo usable sin conexión:

1. Todo se escribe primero en `localStorage`, con espacio de nombres por cuenta (`sistole_progress_v2::<id>`, etc.). La app funciona completa aunque la API falle.
2. Si hay sesión iniciada, el cliente **empuja** el estado completo (`{progress, srData, adaptData, errors, mistakes}`) a `PUT /api/progress` cada 20 segundos cuando hay cambios, al ocultarse la pestaña, y con `navigator.sendBeacon` al cerrarla.
3. Al iniciar sesión o restaurar la sesión, el servidor **devuelve** ese estado y se fusiona con el local. Eso es lo que permite empezar en el celular y seguir en la computadora.

### Esquema de la base de datos

El esquema se crea y migra solo, con `CREATE TABLE IF NOT EXISTS` en `server/db.js` (`ensureSchema()`), invocado al inicio de cada función. No hay herramienta de migraciones aparte.

| Tabla | Contenido |
|---|---|
| `users` | id, email, `password_hash`, nombre, rol (`medico` / `estudiante` / `otro`), país, fecha de alta |
| `sessions` | token, usuario, vencimiento (180 días) |
| `progress` | una fila por usuario, con todo el progreso en una columna `JSONB` |
| `password_resets` | tokens de recuperación de contraseña (guardados como hash, de un solo uso) |
| `feedback` | reportes de error y sugerencias enviados desde la app |

### Endpoints

| Ruta | Qué hace |
|---|---|
| `POST /api/auth/register` | Alta de cuenta (mínimo 8 caracteres de contraseña) |
| `POST /api/auth/login` | Inicio de sesión; devuelve el progreso guardado |
| `POST /api/auth/logout` | Cierra la sesión y borra el token |
| `POST /api/auth/forgot` | Pide el correo de recuperación (responde igual exista o no la cuenta) |
| `POST /api/auth/reset` | Cambia la contraseña con el token del correo y abre sesión |
| `GET / PATCH /api/me` | Lee o actualiza nombre y rol del usuario |
| `GET / PUT / POST /api/progress` | Lee y guarda el progreso (POST existe solo por `sendBeacon`) |
| `POST /api/feedback` | Envía un reporte o sugerencia (máx. 2000 caracteres) |
| `POST /api/admin/login` · `logout` | Acceso al panel de administración |
| `GET /api/admin/stats` · `feedback` | Métricas y bandeja de feedback — **solo lectura** |

### Panel de administración

En `/admin` (`admin.html` + `src/admin-main.jsx`). Entra con una clave única (`ADMIN_SECRET`), sin cuenta de usuario: cookie firmada con HMAC-SHA256, válida 12 horas y **separada** de la sesión normal de usuarios. Muestra altas por día, desglose por rol y por país, actividad a 24 h / 7 d / 30 d, activación, profundidad de uso y los reportes recibidos. Las dos rutas de datos son de solo lectura: no insertan, actualizan ni borran nada.

---

## Cómo se construye y despliega

```
sistole/
├── index.html            ← la aplicación
├── admin.html            ← el panel de administración
├── src/
│   ├── App.jsx           ← toda la aplicación (~11.800 líneas)
│   ├── admin-main.jsx
│   ├── main.jsx
│   └── index.css
├── api/                  ← funciones serverless (Vercel)
├── server/               ← código compartido: db.js, auth.js, adminAuth.js
├── public/               ← manifest PWA, iconos, privacidad.html, assetlinks.json
│   └── ecg12/            ← los 8 electros reales de PTB-XL (~420 KB, versionados)
├── ios/                  ← proyecto Xcode (Capacitor)
├── codemagic.yaml        ← compilación y publicación de iOS en la nube
└── vercel.json
```

**Construir y probar:**

```bash
npm install
npm run build      # genera dist/
npm run dev        # servidor local de desarrollo
npm test           # pruebas del módulo de 12 derivaciones
```

**Trazados de 12 derivaciones:** los electrocardiogramas de esa sección son
registros reales de [PTB-XL](https://physionet.org/content/ptb-xl/1.0.3/)
(PhysioNet, licencia ODC-BY 1.0). Ya están en `public/ecg12/` y versionados, así
que el build no baja nada. Sólo hace falta volver a bajarlos si se agrega o
cambia un caso:

```bash
npm run fetch:ptbxl          # baja los que falten
npm run fetch:ptbxl -- --force   # rehace todos
```

Qué registro usa cada caso se declara en `src/ecg12/records.js`, y
`npm test` verifica —midiendo la señal— que cada caso enseñe lo que su trazado
realmente muestra. Si una prueba de `test-cases.mjs` falla, el caso no se
publica: el texto y el electro dejaron de coincidir.

### Agregar un caso nuevo

Los trazados son de pacientes reales: nadie los grabó a medida del texto que los
acompaña. Por eso el orden es al revés del que uno esperaría — primero se
describe lo que se quiere enseñar en términos medibles, después se busca qué
electro lo muestra, y recién al final se escribe el texto.

**1. Describir el hallazgo.** Un `findings` es esa descripción: umbrales en
milivoltios (0,1 mV = 1 mm de papel = un cuadradito), derivación por derivación.
Hay un ejemplo comentado en `scripts/ejemplos/clbbb.mjs`. El vocabulario completo
está en `src/ecg12/findings.js`.

**2. Buscar registros que lo cumplan.** El buscador recorre PTB-XL midiendo, y
devuelve sólo los que satisfacen el `findings` entero:

```bash
npm run search:ptbxl -- --scp CLBBB --findings scripts/ejemplos/clbbb.mjs
npm run search:ptbxl -- --case inferior-stemi      # alternativas a un caso que ya existe
npm run search:ptbxl -- --report "posterior"       # por lo que escribió el cardiólogo
```

Los ordena por lo CLARO que se vea el hallazgo, no por lo grande: cuenta el
margen con que se cumple la regla más ajustada y penaliza el ruido entre latidos.
Un infarto espectacular sobre un trazado sucio enseña peor que uno moderado sobre
uno limpio.

**3. Mirarlos.** Este paso no se saltea aunque los números den bien:

```bash
npm run preview:ecg12 -- 5191 2940            # la hoja 3×4
npm run preview:ecg12 -- 5191 --lead V2 V6    # una derivación, en grande
```

Se aprendió por las malas. En la primera tanda, el registro con el descenso del
ST más marcado de toda la base tenía, al dibujarlo, las derivaciones de los
miembros casi planas: la medición era correcta y el electro no servía igual. Los
números descartan; la vista decide. (Requiere Playwright, que no es dependencia
del proyecto porque sólo lo usa esta herramienta: `npm i -D playwright && npx
playwright install chromium`.)

**4. Anotarlo y escribirlo.** En `records.js` van el id, la edad y el sexo del
registro y el informe original del cardiólogo, sin traducir. En `cases.js` va el
caso, con el mismo `findings` con que se lo buscó. Después:

```bash
npm run fetch:ptbxl && npm test
```

Las pruebas comprueban, midiendo, que el registro siga mostrando lo que el texto
dice. El predicado que encontró el caso es el que después lo vigila: si mañana se
cambia el registro y deja de cumplir, la prueba falla antes de que un estudiante
lea algo que el trazado no dice.

**Dos límites conocidos.** La hoja 3×4 dibuja a 10 mm/mV, así que un registro con
más de unos 3 mV de excursión invade la fila de al lado — el buscador lo avisa
con «necesita media ganancia». Pasa sobre todo con bloqueos de rama e hipertrofia
ventricular; la salida sería dibujarlos a 5 mm/mV, como hace cualquier
electrocardiógrafo, y escribirlo en el pie (que `draw.js` ya imprime). Y hay
cuadros que la base simplemente no tiene con la limpieza necesaria: el infarto
lateral aislado, por ejemplo, da cero candidatos.

**Despliegue:** Vercel, conectado al repositorio. Cada push a `main` despliega solo. Ya no es un sitio puramente estático: las funciones de `api/` necesitan un hosting que ejecute funciones serverless de Node (Vercel, Netlify Functions o equivalente); un CDN sin backend solo serviría la parte cliente, sin cuentas ni sincronización.

**Variables de entorno requeridas:**

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Cadena de conexión de Neon |
| `ADMIN_SECRET` | Clave de acceso al panel `/admin` |
| `RESEND_API_KEY` | Clave de Resend, para los correos de recuperación |
| `EMAIL_FROM` | Remitente verificado, ej. `Sístole <no-reply@cmdtech.uy>` |
| `APP_URL` | Base de los enlaces del correo (por defecto `https://sistole.cmdtech.uy`) |

**Rutas:** `vercel.json` manda `/admin` a `admin.html` y todo lo demás a `index.html`, dejando afuera `api/`, `assets/`, `ecg12/`, `manifest.json`, `privacidad.html`, `icons/` y `.well-known/`. La exclusión de `ecg12/` es necesaria: sin ella los trazados se responderían con el HTML de la app. En Nginx o Apache hay que escribir la regla equivalente.

---

## Recuperación de contraseña

Flujo: el usuario pide el enlace desde la pantalla de inicio de sesión → `POST /api/auth/forgot` → le llega un correo con `https://sistole.cmdtech.uy/?reset=<token>` → la app detecta el parámetro, muestra la pantalla de contraseña nueva → `POST /api/auth/reset` → queda con la sesión abierta.

Decisiones que conviene conocer antes de tocarlo:

- **El token se guarda hasheado** (SHA-256). Leer la tabla `password_resets` no alcanza para secuestrar una cuenta.
- **Un solo uso y una hora de vida.** El consumo es un `UPDATE ... WHERE used_at IS NULL RETURNING`, atómico: dos pedidos simultáneos con el mismo token no pasan los dos.
- **Pedir uno nuevo invalida el anterior.** Solo sirve el último enlace enviado.
- **Control de frecuencia:** 60 segundos entre pedidos y un máximo de 5 por hora y por cuenta, para que nadie use el formulario como ametralladora de correos.
- **`/forgot` responde siempre lo mismo**, exista o no la cuenta, para no revelar qué correos están registrados. Los fallos de envío quedan en el log del servidor, no en la respuesta. La única excepción es el 503 cuando falta `RESEND_API_KEY`, que no depende de la cuenta y si no sería invisible.
- **El enlace se arma con `APP_URL`, nunca con el header `Host`** de la request: si se confiara en el header, alguien podría falsificarlo para que el correo apunte a su propio dominio y quedarse con el token.
- **Cambiar la contraseña cierra todas las sesiones** de esa cuenta y abre una nueva. Quien tuviera la contraseña vieja queda afuera.
- **El proveedor de correo está aislado** en `sendEmail()` dentro de `server/email.js`. Cambiar Resend por SendGrid, Postmark o SMTP es reescribir esa función; el resto del código no se entera.

---

## Apps móviles

- **iOS** — Capacitor con `appId` `uy.cmdtech.sistole`. Ojo con un detalle importante: `capacitor.config.json` apunta a `https://sistole.cmdtech.uy`, así que la app **carga el sitio en vivo** en lugar de servir el `dist/` empaquetado. Consecuencia práctica: los cambios en la web llegan a la app publicada sin pasar por la revisión de App Store. La compilación y subida a TestFlight las hace Codemagic (`codemagic.yaml`) en cada push a `main`.
- **Android** — TWA (Trusted Web Activity), paquete `uy.cmdtech.sistole.twa`, verificado con `public/.well-known/assetlinks.json`. Mismo principio: envuelve el sitio en vivo.
- **PWA** — `public/manifest.json` en modo `standalone`, orientación vertical, iconos de 192 y 512 px. Instalable desde el navegador sin pasar por ninguna tienda.

---

## Privacidad y datos

- Se guardan: correo, nombre, rol, código de país y progreso de aprendizaje. Las contraseñas solo como hash bcrypt.
- **No se guarda la IP.** El país sale del header `x-vercel-ip-country` que Vercel ya resuelve en cada request; se persiste únicamente el código ISO de dos letras.
- Política de privacidad publicada en `/privacidad.html` (requisito del listado en Google Play).
- **Sin analítica de terceros ni rastreo.** Las métricas del panel salen de la propia base de datos.

---

## Notas para tener en cuenta

**El archivo `App.jsx` es grande** (~11.800 líneas) porque contiene todo el contenido clínico embebido: casos, escenarios, traducciones y datos de ondas. Se puede dividir en módulos; hoy no es un impedimento, pero sí es lo que más pesa a la hora de tocar la aplicación.

**El progreso viaja como un solo blob JSON.** Es simple y funciona, pero no permite consultar el detalle por usuario desde SQL sin navegar el JSONB, y dos dispositivos abiertos al mismo tiempo se pisan: gana el último que sincroniza.

**El esquema se crea en caliente.** `ensureSchema()` corre en cada invocación (cacheado por instancia). Va bien a esta escala; un cambio de esquema realmente destructivo pediría migraciones de verdad.
