# Guia de Traspaso (AI Handover Guide)

Este documento esta redactado especificamente para que una nueva Inteligencia Artificial (o desarrollador) asuma el desarrollo de **StageKit Core / LandingDJ** sin perder contexto ni romper la arquitectura.

---

## Por donde empezar? (Orden de Lectura Obligatorio)

Si acabas de entrar a este proyecto, **NO comiences a escribir codigo inmediatamente**. Sigue este orden de lectura para comprender la vision, el estado actual y las reglas del juego:

1. **`README.md`**: Resumen general de la tecnologia e instrucciones de ejecucion local.
2. **`docs/PROJECT_CONTEXT.md`**: Contexto de negocio y por que se construye el producto de esta manera.
3. **`docs/CONFIG_GUIDE.md`**: Guia completa de reconfiguracion via JSON con ejemplo practico.
4. **`docs/CONVENTIONS.md`**: Guia de estilo tecnica oficial, estructura de carpetas, y convenciones para desarrolladores e IAs.
5. **`docs/DECISIONS.md`**: Registro de decisiones de arquitectura (ADRs) que detalla el por que del diseno modular.
6. **`docs/ROADMAP.md`**: El plan de fases aprobado. No implementes nada fuera de la fase actual.
7. **`docs/PROJECT_STATE.md`**: Progreso exacto del codigo, archivos creados y tareas pendientes.
8. **`docs/IMPROVEMENTS.md`**: Catalogo de mejoras futuras pendientes.
9. **`docs/guiaImplementaciones/presetArchitecture.md`**: Guia tecnica para crear nuevos presets de diseno.

---

## Reglas Fundamentales de Desarrollo

1. **Control de Alcance Estricto:** No desarrolles codigo, componentes o configuraciones que no formen parte de la fase actual. Cualquier mejora conveniente fuera de fase debe proponerse primero.
2. **Coherencia Documentacion-Codigo:** Cada vez que realices un cambio arquitectonico o completes una fase, actualiza **primero** `docs/PROJECT_STATE.md` y, si aplica, `docs/DECISIONS.md`.
3. **Validacion antes de Renderizar:** Toda interaccion con la configuracion debe pasar a traves del validador de Zod. No asumas que los datos en `landingdj.config.json` siempre seran correctos.
4. **Desacoplamiento Estricto:** El frontend no se comunica con servicios de correo externos. La comunicacion es local mediante la API `/api/contact` de Next.js, delegando la tarea de envio a servicios internos abstractos.
5. **Design Presets sobre valores directos:** La identidad visual se controla exclusivamente via `designPreset` en el JSON. **No** agregues `colors`/`typography` como campos directos del JSON. Si necesitas un nuevo look, crea un preset en `src/features/theme/designPresets.ts`.
6. **CSS Variables sobre clases hardcodeadas:** Todos los componentes deben usar CSS variables (`text-[var(--heading-color)]`, `bg-[var(--section-bg)]`, `font-[var(--font-weight-heading)]`) en vez de clases Tailwind fijas como `text-white`, `bg-black`, `font-extrabold`. Las unicas excepciones son colores verdaderamente estaticos (blanco puro, negro puro) que no deban cambiar con el preset.

---

## Fase 4 Completada -- SMTP (Gmail) Implementado

La **Fase 4 (Integracion Real de Servicios)** esta completada con el provider SMTP:

1. **`SmtpEmailProvider`** en `src/lib/email/providers/smtp.ts` usando `nodemailer` con Gmail.
2. Las credenciales SMTP se configuran en `.env` (excluido de git) y se leen desde `process.env`.
3. El factory `createEmailProvider()` resuelve automaticamente el provider al setear `EMAIL_PROVIDER=smtp`.
4. El template HTML inline incluye nombre, email y mensaje del cliente, con `replyTo` para respuesta directa.

## Arquitectura de Design Presets

El sistema de presets vive en `src/features/theme/designPresets.ts`:

1. **`DesignTokens` interface:** ~75 campos que cada preset debe implementar (colores, radios, sombras, animaciones, fondos, overlays, letter-spacing, font-weight, mas `btnPrimaryBgAlpha` opcional).
2. **`DESIGN_PRESETS` record:** Objeto con todos los presets disponibles (12 presets). Cada preset incluye `colors`, `typography` y `tokens`.
3. **`loader.ts`:** Resuelve el preset desde `designPreset` en el JSON, extrayendo `colors`, `typography` y `tokens` del objeto correspondiente.
4. **`ThemeProvider.tsx`:** Inyecta los ~75 tokens como CSS variables en el nodo raiz + setea `--color-primary`, `--color-secondary`, `--font-heading`, `--font-body` para compatibilidad con `@theme` de Tailwind.

### Presets disponibles (12)

| Preset | Temperatura | Ambiente | Acento | Tipografia |
|--------|-------------|----------|--------|------------|
| `gold` | Calida | Oscuro clasico | Ambar | Outfit |
| `neon` | Fria | Cyberpunk | Cian | Plus Jakarta Sans |
| `slate` | Neutra | Monocromatico | Blanco | DM Sans |
| `pearl` | Neutra | Claro | Violeta | DM Sans |
| `ember` | Calida | Carmesi | Rojo | Outfit |
| `frost` | Fria | Navy profundo | Azul hielo | Inter |
| `sienna` | Calida | Terracota | Ambar | DM Serif Display |
| `vapor` | Vibrante | Purpura | Magenta | Plus Jakarta Sans |
| `barbie` | Vibrante | Claro | Hot pink | Outfit |
| `barbie-dark` | Vibrante | Oscuro | Hot pink | Outfit |
| `barbie-blue` | Fria | Oscuro | Azul electrico | Space Grotesk |
| `SalvajeDjPreset` | Fria | Espacio profundo | Violeta | Space Grotesk |

### Como agregar un preset nuevo
1. Agregar el objeto al `DESIGN_PRESETS` record en `designPresets.ts` (incluir todos los ~75 tokens). Si se desea transparencia en el boton primary, agregar `btnPrimaryBgAlpha` (0-1) al preset.
2. Agregar el nombre al campo `designPreset` en `config/landingdj.config.json` (no hay validacion de lista cerrada).
3. Compilar y verificar: `npm run build`.

No requiere cambios en componentes, CSS, ThemeProvider ni schemas. El nuevo preset aparecera automaticamente en el loader.

## Archivo clave para entender los tokens

`src/features/theme/designPresets.ts` -- leer las interfaces `DesignTokens` y `DesignPreset` primero, luego revisar cualquier preset existente (ej. `gold` o `pearl`) para entender la estructura. Luego `src/features/theme/components/ThemeProvider.tsx` para ver como se inyectan.

## Arquitectura de Tours Dinamicos (Fase 6)

El sistema de tours soporta dos fuentes de datos mediante el toggle `toursSource`:

| Source | Descripcion | Archivos de datos |
|--------|-------------|-------------------|
| `"static"` | Datos desde el JSON (`config.tours`, `config.tourTable`) | `config/landingdj.config.json` |
| `"google-sheets"` | Datos desde CSV publico de Google Sheets | URL en `toursSheetUrl` |

### Flujo de datos (Google Sheets)

```
Usuario edita Google Sheet
        ↓
    (CSV publico publicado)
        ↓
  Componente Tours/TourTable
        ↓  fetch GET /api/tours
  API Route (/api/tours/route.ts)
        ↓  fetch URL publica
  Google CSV
        ↓  csv-parse/sync
  Filas individuales
        ↓  TourEventSchema.safeParse()
  Array validado + warnings
        ↓  Response JSON
  Tours/TourTable -> renderizado
```

### Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/lib/tours/cache.ts` | `MemoryCache<T>` con TTL configurable (30 seg default). Thread-safe para API Route. |
| `src/lib/tours/sheetParser.ts` | `fetchToursFromSheet()` -- fetch CSV desde URL, parsea con `csv-parse/sync`, itera filas, valida cada una con `TourEventSchema.safeParse()`, loggea warnings para filas invalidas, retorna solo las validas. |
| `src/app/api/tours/route.ts` | GET handler que recibe query param `source`, hace switch entre leer del JSON o del sheet. Cachea resultados 30 seg. |
| `src/features/landing/components/Tours.tsx` | Renderiza tours como cards. Si `toursSource: 'google-sheets'`, fetchea de `/api/tours` y muestra skeleton mientras carga. Paginacion: 6 iniciales, boton "Mostrar mas" de a 3. |
| `src/features/landing/components/TourTable.tsx` | Renderiza tours como tabla. Misma logica de fetch condicional, skeleton y paginacion. |
| `src/features/landing/components/LandingContainer.tsx` | Pasa `toursSource` como prop a Tours y TourTable. |

### Reglas de comportamiento

1. **`toursSource: "static"`** (default) -- comportamiento original, lee `config.tours` y `config.tourTable`.
2. **`toursSource: "google-sheets"`** -- ignora `config.tours`/`config.tourTable`, fetchea de API. Si falla, se oculta (sin fallback).
3. **URL vacia + `google-sheets`** -- se oculta (evita errores si no se configuro).
4. **Filas invalidas** -- descartadas con `console.warn` server-side. Solo las validas se devuelven.
5. **Cache** -- 30 seg TTL en memoria de la API Route. No persistente (se pierde al reiniciar el servidor).

### Como validar el sheet manualmente

```bash
curl http://localhost:3000/api/tours
# -> array de eventos validos o []
```

### Dependencia externa

- `csv-parse` -- unica dependencia nueva. Se usa solo server-side (API Route), no impacta el bundle del cliente.

## Proximos Pasos (Opcionales)

1. Incorporar proveedores adicionales (ej. Resend, Brevo o SendGrid) en `src/lib/email/providers/` siguiendo la interfaz `EmailProvider`.
2. Validar el mapeo y flujo completo de leads desde el frontend hasta la casilla del DJ usando datos reales de contacto.
3. Configurar variables de entorno productivas para el envio de correos reales en el servidor (Cloud Run, Vercel, etc.).
4. Implementar mejoras del backlog: `docs/IMPROVEMENTS.md` (14 ideas priorizadas).
