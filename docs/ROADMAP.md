# Hoja de Ruta (Roadmap) — StageKit Core / LandingDJ

Este documento establece la progresión del desarrollo de LandingDJ a través de fases de desarrollo controladas y secuenciales.

---

## 🗺️ Resumen de Fases

```text
[ Fase 0: Arquitectura ] ──> [ Fase 1: Fundación ] ──> [ Consolidación Técnica ] ──> [ Fase 2: Landing Visual ] ──> [ Fase 3: QA & Pulido V1 ] ──> [ Fase 4: Integración Real ] ──> [ Fase 5: Design Presets ] ──> [ Fase 6: Tours Dinámicos ]
          (Completo)                  (Completo)                  (Completo)                  (Completo)                  (Completo)                  (Completo)                  (Completo)                  (Completo)
```

---

## 📌 Detalle de Fases

### 🏁 Fase 0 — Arquitectura y Fundación (COMPLETADO)
- [x] Análisis inicial de requisitos y restricciones.
- [x] Propuesta conceptual de la arquitectura adaptada a Next.js App Router.
- [x] Aprobación de la estrategia de tematización dinámica, Zod, e inyección de configuración.

### 🛠️ Fase 1 — Estructura Base, Entorno y Documentación (COMPLETADO)
- [x] Inicialización del proyecto Next.js real.
- [x] Configuración e instalación de dependencias en `package.json`.
- [x] Creación de la estructura de carpetas modular basada en características (`features`).
- [x] Generación de la documentación del proyecto (`README.md`, `/docs`).
- [x] Verificación de la compilación base.

### 💎 Fase de Consolidación Arquitectónica (COMPLETADO)
- [x] **Separación limpia de responsabilidades:** Separar la lógica del cargador de configuración, la generación de SEO y el renderizado UI de la landing.
- [x] **Sistema de Theme robusto:** Integración de un componente `ThemeProvider` para inyectar colores y fuentes dinámicas mediante estilos inline.
- [x] **Carga selectiva de fuentes (Google Fonts):** Optimizar `layout.tsx` para descargar únicamente las tipografías utilizadas de forma activa en la landing.
- [x] **Desacoplamiento de Email (Factory Pattern):** Abstraer el sistema de envíos mediante la fábrica `createEmailProvider()`.
- [x] **Metadata Dinámica:** Generar metadatos dinámicos mediante `generateMetadata()` de forma nativa.

### 🎨 Fase 2 — Primera Landing Visual Funcional (COMPLETADO)
- [x] **Navbar de Navegación Inteligente:** Cabecera responsiva con soporte de scroll y menú móvil.
- [x] **Hero Inmersivo:** Animaciones con motion/react, botón de acción con glow y fondo dinámico.
- [x] **Biografía & Insignias:** Cuadrícula de presentación asimétrica con insignias de trayectoria premium.
- [x] **Servicios & Tech Rider:** Diseño de tarjetas interactivas con bordes de color brillante, hover de escalado, e iconos Lucide.
- [x] **Galería de Escenario:** Grilla responsiva de capturas con efecto zoom.
- [x] **Videos de Sets en Vivo:** Integración interactiva de YouTube (in-place) para reproducir sets con un solo clic sin afectar los tiempos de carga iniciales.
- [x] **Sección FAQ (Acordeón):** Transición fluida de apertura/cierre de preguntas.
- [x] **Contacto & API Route:** Formulario de dos columnas con validación cliente-servidor y estados fluidos.

### 🔍 Fase 3 — QA Visual, Configuración y Pulido V1 (COMPLETADO)
- [x] **QA Responsivo Multi-Dispositivo:** Ajuste fino de padding, margin, desbordamientos e interacciones en móviles pequeños, medianos y ultra-wide.
- [x] **Secciones Opcionales Seguras:** Robustecer componentes para devolver `null` y evitar renderizar bloques vacíos cuando falten datos en el JSON.
- [x] **Configuración de Ejemplo Premium:** Creación de un catálogo para el artista musical "Alexis Verdi" sin terminología técnica ni placeholders de sistema.
- [x] **Accesibilidad Básica:** Enlaces semánticos, labels correctos, textos alternativos descriptivos en galería, y aria-labels dinámicos en el menú responsivo móvil.
- [x] **Optimización de Performance:** Carga perezosa (lazy) de imágenes y poster diferido en videos.
- [x] **Validación y Estabilidad de Compilación:** Limpieza de código sobrante y test de compilación e integración sin errores.

### ⚙️ Fase 4 — Integración Real de Servicios (COMPLETADO)
- [x] Implementación de `SmtpEmailProvider` con `nodemailer` para envío SMTP vía Gmail.
- [x] Variables de entorno como único medio para credenciales SMTP (seguridad).
- [x] Template HTML inline con datos del lead y `replyTo`.
- [x] Documentación actualizada reflejando la implementación.

### 📦 Fase 5 — Sistema de Design Presets y Expansión Visual (COMPLETADO)
- [x] Diseño e implementación de la interface `DesignTokens` con ~56 tokens (colores, tipografía, radios, sombras, animaciones, fondos de sección, overlays, letter-spacing, font-weight).
- [x] Migración de `ThemeProvider` para inyección directa de CSS variables.
- [x] Reemplazo de clases hardcodeadas en todos los componentes (`text-white` → `text-[var(--heading-color)]`, `bg-black` → `bg-[var(--hero-bg,#000)]`, etc.).
- [x] 11 presets completos: `gold` (oscuro/dorado), `neon` (cián/cyberpunk), `slate` (monocromático/radios 0), `pearl` (claro/violeta), `ember` (carmesí/dramático), `frost` (azul hielo/navy), `sienna` (terracota/ámbar/serif), `vapor` (magenta/retrowave), `barbie` (hot pink/fondo claro/Playfair Display), `barbie-dark` (hot pink/fondo oscuro/Outfit), `SalvajeDjPreset` (violeta galáctico/Space Grotesk/galaxia minimalista).
- [x] Documentación actualizada.
- [x] Verificación de compilación.

### 📦 Fase 6 — Tours Dinámicos vía Google Sheets (COMPLETADO)
- [x] Cache: `src/lib/tours/cache.ts` con TTL configurable.
- [x] Sheet parser: `src/lib/tours/sheetParser.ts` — fetch CSV, parseo, validación Zod.
- [x] API Route: `src/app/api/tours/route.ts` — GET handler con source switch.
- [x] Schema extendido: `TOURS_SOURCES`, `ToursSource`, `toursSource`, `toursSourceValid`, `toursSheetUrl`.
- [x] Config JSON: campos `toursSource`, `toursSourceValid`, `toursSheetUrl`.
- [x] Tours.tsx + TourTable.tsx: fetch condicional, skeleton loading, ocultamiento en falla.
- [x] LandingContainer.tsx: prop `toursSource` pasada a ambos componentes.
- [x] Validación de URL: `.optional().or(z.literal(''))` para soportar `""` cuando source es `static`.
- [x] Dependencia: `csv-parse` instalado.
- [x] Build verificado.

### 🔮 Próximos Pasos (Opcionales)
- [ ] Incorporar proveedores adicionales (Resend, Brevo, SendGrid) en la fábrica de `src/lib/email/providers`.
- [ ] Pruebas y despliegues productivos bajo entorno real en Cloud Run.
