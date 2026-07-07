# Guía de Traspaso (AI Handover Guide)

Este documento está redactado específicamente para que una nueva Inteligencia Artificial (o desarrollador) asuma el desarrollo de **StageKit Core / LandingDJ** sin perder contexto ni romper la arquitectura.

---

## 🧭 ¿Por dónde empezar? (Orden de Lectura Obligatorio)

Si acabas de entrar a este proyecto, **NO comiences a escribir código inmediatamente**. Sigue este orden de lectura para comprender la visión, el estado actual y las reglas del juego:

1. **`README.md`**: Resumen general de la tecnología e instrucciones de ejecución local.
2. **`docs/CONFIG_GUIDE.md`**: Guía completa de reconfiguración vía JSON con ejemplo práctico.
3. **`docs/PROJECT_CONTEXT.md`**: Contexto de negocio y por qué se construye el producto de esta manera.
4. **`docs/CONVENTIONS.md`**: Guía de estilo técnica oficial, estructura de carpetas, y convenciones para desarrolladores e IAs.
5. **`docs/DECISIONS.md`**: Registro de decisiones de arquitectura (ADRs) que detalla el porqué del diseño modular.
6. **`docs/ROADMAP.md`**: El plan de fases aprobado. No implementes nada fuera de la fase actual.
7. **`docs/PROJECT_STATE.md`**: Progreso exacto del código, archivos creados y tareas pendientes.

---

## 🛡️ Reglas Fundamentales de Desarrollo

1. **Control de Alcance Estricto:** No desarrolles código, componentes o configuraciones que no formen parte de la fase actual. Cualquier mejora conveniente fuera de fase debe proponerse primero.
2. **Coherencia Documentación-Código:** Cada vez que realices un cambio arquitectónico o completes una fase, actualiza **primero** `docs/PROJECT_STATE.md` y, si aplica, `docs/DECISIONS.md`.
3. **Validación antes de Renderizar:** Toda interacción con la configuración debe pasar a través del validador de Zod. No asumas que los datos en `landingdj.config.json` siempre serán correctos.
4. **Desacoplamiento Estricto:** El frontend no se comunica con servicios de correo externos. La comunicación es local mediante la API `/api/contact` de Next.js, delegando la tarea de envío a servicios internos abstractos.
5. **Design Presets sobre valores directos:** La identidad visual se controla exclusivamente vía `designPreset` en el JSON. **No** agregues `colors`/`typography` como campos directos del JSON. Si necesitas un nuevo look, creá un preset en `src/features/theme/designPresets.ts`.
6. **CSS Variables sobre clases hardcodeadas:** Todos los componentes deben usar CSS variables (`text-[var(--heading-color)]`, `bg-[var(--section-bg)]`, `font-[var(--font-weight-heading)]`) en vez de clases Tailwind fijas como `text-white`, `bg-black`, `font-extrabold`. Las únicas excepciones son colores verdaderamente estáticos (blanco puro, negro puro) que no deban cambiar con el preset.

---

## ✅ Fase 4 Completada — SMTP (Gmail) Implementado

La **Fase 4 (Integración Real de Servicios)** está completada con el provider SMTP:

1. **`SmtpEmailProvider`** en `src/lib/email/providers/smtp.ts` usando `nodemailer` con Gmail.
2. Las credenciales SMTP se configuran en `.env` (excluido de git) y se leen desde `process.env`.
3. El factory `createEmailProvider()` resuelve automáticamente el provider al setear `EMAIL_PROVIDER=smtp`.
4. El template HTML inline incluye nombre, email y mensaje del cliente, con `replyTo` para respuesta directa.

## ⚙️ Arquitectura de Design Presets

El sistema de presets vive en `src/features/theme/designPresets.ts`:

1. **`DesignTokens` interface:** ~57 campos que cada preset debe implementar (colores, radios, sombras, animaciones, fondos, overlays, letter-spacing, font-weight, más `btnPrimaryBgAlpha` opcional).
2. **`DESIGN_PRESETS` record:** Objeto con todos los presets disponibles. Cada preset incluye `colors`, `typography` y `tokens`.
3. **`loader.ts`:** Resuelve el preset desde `designPreset` en el JSON, extrayendo `colors`, `typography` y `tokens` del objeto correspondiente.
4. **`ThemeProvider.tsx`:** Inyecta los ~56 tokens como CSS variables en `:root` + setea `--color-primary`, `--color-secondary`, `--font-heading`, `--font-body` para compatibilidad con `@theme` de Tailwind.

### Cómo agregar un preset nuevo
1. Agregar el objeto al `DESIGN_PRESETS` record en `designPresets.ts` (incluir todos los ~57 tokens). Si se desea transparencia en el botón primary, agregar `btnPrimaryBgAlpha` (0-1) al preset.
2. Agregar el nombre al campo `designPreset` en `config/landingdj.config.json` (no hay validación de lista cerrada).
3. Compilar y verificar: `npm run build`.

No requiere cambios en componentes, CSS, ThemeProvider ni schemas. El nuevo preset aparecerá automáticamente en el loader.

## 🔍 Archivo clave para entender los tokens

`src/features/theme/designPresets.ts` — leer las interfaces `DesignTokens` y `DesignPreset` primero, luego revisar cualquier preset existente (ej. `gold` o `pearl`) para entender la estructura. Luego `src/features/theme/components/ThemeProvider.tsx` para ver cómo se inyectan.

## 🚦 Próximos Pasos (Opcionales)

1. Incorporar proveedores adicionales (ej. Resend, Brevo o SendGrid) en `src/lib/email/providers/` siguiendo la interfaz `EmailProvider`.
2. Validar el mapeo y flujo completo de leads desde el frontend hasta la casilla del DJ usando datos reales de contacto.
3. Configurar variables de entorno productivas para el envío de correos reales en el servidor (Cloud Run, Vercel, etc.).
