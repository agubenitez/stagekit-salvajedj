# Registro de Decisiones Arquitectónicas (ADRs)

Este documento registra las decisiones técnicas y arquitectónicas más importantes tomadas para el desarrollo de StageKit Core / LandingDJ, junto con sus justificaciones y alternativas consideradas.

---

## ADR 01: Selección de Framework Principal (Next.js App Router)

- **Estado**: Aprobado.
- **Contexto**: El producto LandingDJ necesita ser altamente veloz, amigable para motores de búsqueda (SEO) y servir como base tecnológica reutilizable para otros proyectos más grandes dentro de StageKit (como StageKit Agency).
- **Decisión**: Utilizar **Next.js con App Router** (React 19, TypeScript y Tailwind CSS).
- **Justificación**:
  - **Server Components (RSC)**: Permiten leer el archivo de configuración `landingdj.config.json` directamente desde el sistema de archivos del servidor durante el renderizado, enviando cero HTML innecesario o lógica de parsing al cliente.
  - **SEO nativo**: La función `generateMetadata()` integrada de Next.js permite inyectar etiquetas meta de Open Graph, título, descripción y favicon directamente en el servidor basándose en la configuración dinámica.
  - **Escalabilidad**: Proporciona un entorno robusto para la inclusión de API Routes y optimizaciones automáticas de imágenes.
- **Consecuencias**: Mayor complejidad de setup inicial frente a un SPA de React puro, pero entrega un producto con tiempos de carga casi instantáneos (Core Web Vitals óptimos) y máxima flexibilidad para el futuro.

---

## ADR 02: Carga Declarativa de Configuración en Servidor

- **Estado**: Aprobado.
- **Contexto**: Necesitamos inyectar toda la personalización de `landingdj.config.json` sin causar retrasos en el cliente (flickering o layout shift).
- **Decisión**: El archivo de configuración reside en `public/config/landingdj.config.json` y se lee usando el módulo `fs` de Node.js en los componentes de servidor raíz (`layout.tsx`, `page.tsx`).
- **Justificación**:
  - **Cero latencia de red**: La configuración se lee localmente en milisegundos en el servidor.
  - **Seguridad**: Los datos críticos (como el `destinationEmail`) pueden permanecer o validarse en el servidor sin exponerse innecesariamente en bundles de JavaScript del cliente.
  - **SEO**: Permite generar metadata estática antes de enviar el HTML al navegador.
- **Consecuencias**: El archivo debe estar ubicado exactamente en la ruta especificada y debe ser un JSON válido que coincida con el esquema de Zod.

---

## ADR 03: Validación Robusta con Zod

- **Estado**: Aprobado.
- **Contexto**: Si un usuario o desarrollador comete un error tipográfico en el JSON de configuración, el sitio web podría romperse silenciosamente o comportarse de manera errática.
- **Decisión**: Implementar un esquema de validación estricto utilizando **Zod** en el servidor antes de realizar el renderizado.
- **Justificación**:
  - **Tipado seguro estricto**: Convierte la configuración JSON cruda en un tipo de TypeScript fuertemente tipado (`LandingConfig`).
  - **Fallo rápido (Fail-Fast)**: Si el archivo JSON es inválido, el sistema arroja un error amigable en la consola o muestra un fallback limpio, evitando renderizados rotos o errores de ejecución difíciles de depurar en producción.
- **Consecuencias**: Cada nuevo campo configurable debe agregarse tanto al JSON como al esquema Zod en `/src/lib/config/schema.ts`.

---

## ADR 04: Estilización y Tematización Dinámica con Tailwind v4 y Variables CSS

- **Estado**: Aprobado.
- **Contexto**: El cliente final puede configurar colores y tipografías personalizadas desde el JSON. Tailwind tradicionalmente se compila estáticamente.
- **Decisión**: Mapear la configuración de color y tipografía de `landingdj.config.json` a variables CSS personalizadas (`--color-primary`, `--font-heading`, etc.) inyectadas dinámicamente en `:root` a través de una etiqueta `<style>` generada en el servidor. Luego, estas variables se enlazan con el sistema de temas `@theme` de Tailwind v4.
- **Justificación**:
  - **Compatibilidad con Tailwind**: Permite usar clases como `bg-primary` o `font-heading` de manera natural en todo el código base.
  - **Cero sobrecarga JS**: Todo se resuelve a nivel CSS nativo en el navegador.
- **Consecuencias**: Las fuentes deben ser validadas contra un catálogo seguro predefinido e importarse dinámicamente usando etiquetas de Google Fonts en el head.

---

## ADR 05: Servicio de Email Desacoplado (Patrón Provider)

- **Estado**: Aprobado y Extendido.
- **Contexto**: El envío de correos desde el formulario de contacto se implementa de manera temporal con un placeholder, pero debe poder cambiarse fácilmente a proveedores de nivel corporativo (SendGrid, Resend, AWS SES) en el futuro.
- **Decisión**: Crear una interfaz de abstracción (`EmailService`) y un despachador centralizado en la API Route. En esta fase se implementa un `PlaceholderEmailProvider` que simplemente simula el envío con logs detallados.
- **Justificación**:
  - **Aislamiento**: El código del formulario de contacto del cliente solo interactúa con un endpoint `/api/contact`. El backend desacopla los detalles del proveedor mediante una fábrica o inyección simple.
  - **Mantenibilidad**: Cambiar de proveedor en el futuro requerirá modificar únicamente un archivo de servicio en la carpeta `/src/lib/email/` sin tocar un solo componente visual.
- **Consecuencias**: El frontend maneja un estado genérico de "enviando", "éxito" y "error", delegando toda la complejidad operativa al backend de Next.js.

### Extensión — Fase 4: SMTP (Gmail) como Provider Real

- **Estado**: Implementado.
- **Decisión**: Incorporar `nodemailer` con SMTP de Gmail como primer proveedor real, manteniendo el patrón Provider existente.
- **Seguridad**: Las credenciales SMTP (`SMTP_USER`, `SMTP_PASS`) se configuran exclusivamente en variables de entorno (`.env`), NO en el JSON de configuración. El archivo `.env` está excluido de git.
- **Uso**: Con `EMAIL_PROVIDER=smtp` en el entorno, el factory instancia `SmtpEmailProvider` automáticamente. Sin cambios en componentes visuales ni en la API Route.

---

## ADR 06: Design Presets como Sistema de Tematización Declarativa

- **Estado**: Aprobado e Implementado.
- **Contexto**: Originalmente los colores y tipografía se configuraban directamente en el JSON (`colors.primary`, `colors.secondary`, `typography.heading`, etc.). A medida que crecía la necesidad de controles visuales más finos (radios, sombras, animaciones, fondos de sección, overlays), quedó claro que tener valores sueltos en el JSON era frágil e inconsistente: cambiar de dorado a cian requería editar 7+ campos manualmente sin garantía de coherencia visual.
- **Decisión**: Crear un sistema de **Design Presets** donde cada preset es un objeto TypeScript en `src/features/theme/designPresets.ts` que encapsula ~56 tokens visuales y estructurales. El JSON solo referencia el nombre del preset (`designPreset: "gold"`).
- **Justificación**:
  - **Coherencia visual garantizada**: Cada preset es diseñado como un sistema completo (colores, tipografía, radios, sombras, animaciones, fondos, overlays). No hay riesgo de "rojo de un lado, azul del otro".
  - **Cambio instantáneo**: Modificar una sola línea en el JSON (`"designPreset": "neon"`) cambia toda la apariencia del sitio.
  - **Extensible**: Agregar un preset nuevo requiere solo un objeto en `designPresets.ts` + el nombre en `validDesignPresets` del JSON. Sin cambios en componentes.
  - **Tokens estructurales**: Los presets controlan no solo colores sino también `cardHoverTransform`, `cardLeftBorder`, `sectionBg`, `headingColor`, `overlayColor`, `fontWeightHeading`, `letterSpacingTag`, etc. — permitiendo cambios de layout y comportamiento.
- **Consecuencias**:
  - El JSON ya no acepta `colors`/`typography` como campos directos. Se resuelven desde el preset en `loader.ts`.
  - `ThemeProvider.tsx` inyecta ~56 CSS variables desde los tokens del preset seleccionado.
  - Todos los componentes fueron migrados de clases hardcodeadas (`text-white`, `bg-black`, `font-extrabold`) a CSS variables.
  - Para crear un preset visualmente coherente, se requiere diseñar los ~56 tokens manualmente (no es una fórmula automática).

### ADR 08 — Tours Dinámicos vía Google Sheets (CSV público)

- **Estado**: Aprobado e Implementado.
- **Contexto**: Los DJs necesitan actualizar sus fechas de shows frecuentemente. Con la fuente `static` (datos en JSON), cada cambio requiere editar el JSON, rebuild y redeploy. El usuario final no debería depender del desarrollador para agregar una fecha.
- **Decisión**: Agregar un toggle `toursSource` (`"static"` | `"google-sheets"`) en el JSON. Cuando es `"google-sheets"`, los componentes Tours y TourTable hacen fetch a una API Route interna (`/api/tours`) que descarga un CSV público desde Google Sheets, lo parsea con `csv-parse`, valida cada fila con `TourEventSchema.safeParse()`, y devuelve los eventos. Todo el proceso es server-side (API Route), no se expone lógica al cliente.
- **Justificación**:
  - **Sin API key ni service account**: Google Sheets permite publicar una hoja como CSV público. No requiere autenticación OAuth, ni credenciales, ni dependencias pesadas.
  - **Sin deploy para el usuario**: El usuario solo edita la Google Sheet; los cambios se reflejan automáticamente (con TTL de caché de 30 seg).
  - **Validación robusta**: Cada fila se valida con Zod (`safeParse`). Filas inválidas se descartan con warning server-side, sin romper el componente.
  - **Misma API para ambos componentes**: Tours (cards) y TourTable (tabla) comparten la misma API Route, misma lógica de fetch y mismos types.
  - **Caché en memoria**: Evita saturar Google con requests en cada carga de página. TTL de 30 segundos.
  - **Mismo patrón que SECTION_IDS**: `TOURS_SOURCES` + `toursSourceValid` sigue el diseño ya establecido de `SECTION_IDS` + `validSectionIds`.
- **Alternativas consideradas**:
  1. **Google Sheets API v4 (oficial)**: Requiere API key expuesta al cliente o proxy server-side con autenticación OAuth. Mucha complejidad para el caso de uso.
  2. **CMS externo (Sanity, Contentful)**: Overkill para un puñado de eventos. Agrega dependencia externa, costos y latencia.
  3. **Webhook/CI/CD**: Hacer rebuild automático cuando cambia la sheet. Sigue requiriendo deploy.
  4. **JSON remoto**: El usuario tendría que mantener un JSON válido manualmente. Mucho más propenso a errores que una planilla.
- **Consecuencias**:
  - El JSON incluye tres nuevos campos: `toursSource`, `toursSourceValid`, `toursSheetUrl`.
  - Se instaló `csv-parse` como dependencia.
  - Nuevos archivos: `src/lib/tours/cache.ts`, `src/lib/tours/sheetParser.ts`, `src/app/api/tours/route.ts`.
  - `Tours.tsx` y `TourTable.tsx` fueron reescritos con soporte de source dinámico y skeleton loading.
  - Cuando `toursSource: "google-sheets"` y el fetch falla o la URL está vacía, la sección se oculta (sin fallback a datos estáticos).

### ADR 09 — Alternancia dinámica de fondos de sección

- **Contexto**: Cada componente de sección tenía su fondo hardcodeado (`bg-[var(--section-bg)]`, `section-bg-alt` o `section-bg-mid`). Al reordenar secciones en el JSON, el patrón de alternancia se rompía porque los bg no seguían el orden dinámico.
- **Decisión**: Cada sección (excepto hero) lee `var(--section-current-bg)` de un wrapper `<div>` en `LandingContainer.tsx`. El wrapper alterna entre `var(--section-bg)` y `var(--section-bg-alt)` según la posición de la sección en `sectionOrder`, ignorando hero.
- **Justificación**:
  - La alternancia A/B perfecta se mantiene automáticamente al reordenar.
  - No requiere props, context API ni cambios en schemas.
  - Hero se excluye porque usa su propio layout con overlays.
- **Consecuencias**:
  - 10 componentes de sección reemplazaron su bg hardcodeado por `bg-[var(--section-current-bg)]`.
  - `LandingContainer.tsx` calcula el bg basado en índice par/impar.

### ADR 10 — Renderizado dinámico forzado y paginación de tours

- **Estado**: Implementado.
- **Contexto**: La página principal (`page.tsx`) no exportaba indicadores de rendering, por lo que Next.js 15 la trataba como estática (SSG). Los cambios en el JSON o en Google Sheets no se reflejaban hasta reiniciar el servidor o redeployar. Además, la sección de tours mostraba todos los eventos de golpe, lo que era visualmente pesado con muchos shows.
- **Decisión**:
  1. Agregar `export const dynamic = 'force-dynamic'` en `page.tsx` para forzar SSR en cada request.
  2. Reducir el TTL del `MemoryCache` de tours de 5 minutos a 30 segundos.
  3. Implementar paginación incremental en `Tours.tsx` y `TourTable.tsx`: mostrar los primeros 6 eventos con un botón "Mostrar más" que expone de a 3 adicionales.
- **Justificación**:
  - `force-dynamic` garantiza que `getLandingConfig()` lea el JSON fresco del disco en cada request, eliminando la necesidad de reiniciar para ver cambios.
  - El TTL de 30 seg balancea performance (evita saturar Google) con actualizaciones casi inmediatas para el usuario que edita la Google Sheet.
  - La paginación mejora la UX: la sección no se extiende excesivamente con muchos eventos, y el usuario controla cuántos ve.
- **Alternativas consideradas**:
  1. **ISR (`revalidate: 60`)**: Revalidación periódica, pero los datos se seguirían sirviendo stale entre revalidaciones. Menos inmediato que `force-dynamic`.
  2. **Eliminar caché por completo**: Simplificar el código pero saturaría Google con un request por carga de página.
  3. **Paginación server-side**: Más complejo (requiere state en la URL o parámetros de query), innecesario para un número pequeño de eventos.
- **Consecuencias**:
  - `page.tsx` exporta `dynamic = 'force-dynamic'`.
  - `cache.ts` tiene TTL de 30s por defecto.
  - `Tours.tsx` y `TourTable.tsx` exportan constantes `INITIAL_VISIBLE=6` y `LOAD_MORE_STEP=3`, con estado `visibleCount` y botón condicional.
  - Se eliminó el problema de datos stale que requería reiniciar el servidor.
