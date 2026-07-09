# Changelog

## [Unreleased]

### Added

- **BioConFoto**: Nueva sección de presentación con imagen + texto (Split Editorial).
  - Configurable vía `bioConFoto` (imagen) y `bioConFotoTexts` (textos) en el JSON.
  - Layout 50/50: imagen en card-raised a la izquierda, texto con motion a la derecha.
  - Dirección configurable por preset: `bioConFotoLayout: 'image-left' | 'image-right'`.
  - Fallback de heading a `artisticName` y description a root `description`.
  - Nueva sección `bio_con_foto` en `SECTION_IDS`, `sectionOrder`, `navbarTexts`.
  - Archivos: `schema.ts`, `designPresets.ts`, `ThemeProvider.tsx`, `BioConFoto.tsx` (nuevo), `LandingContainer.tsx`, `Navbar.tsx`, `landingdj.config.json`.
  - Documentada variante alternativa (BioFondoOverlay) en `improvements.md`.

- **Bio**: Heading ahora configurable desde JSON via `bioTexts.heading`.
  - Si está presente, se usa textual; si no, fallback a `headingPrefix + artisticName`.
  - Agregado `heading` a `BioTextsSchema`.
  - Archivo: `src/lib/config/schema.ts`, `src/features/landing/components/Bio.tsx`
  - Los 3 configs incluyen `"heading": "Detrás del Sonido: Anto Bravo DJ"`.

- **Presets**: Nuevo campo `btnPrimaryBgAlpha` (número 0-1) en `DesignTokens`.
  - Controla la opacidad del fondo del botón primary. Hover siempre opaco.
  - Gold preset: `btnPrimaryBgAlpha: 0.85` (85% opaco).
  - Los demás presets: `btnPrimaryBgAlpha: 1` (sin cambio visual).
  - Helper `hexToRgba()` en `designPresets.ts`.
  - Archivo: `src/features/theme/designPresets.ts`, `src/features/theme/components/ThemeProvider.tsx`

- **Presets**: Nuevo preset `barbie`.
  - Temática rosa hot pink con fondo claro, tipografía Playfair Display + Inter.
  - Cards blancas, bordes redondeados (1rem), acentos en hot pink.
  - Archivo: `src/features/theme/designPresets.ts`

- **Presets**: Nuevo preset `barbie-dark`.
  - Versión oscura del gold con hot pink Barbie (fondo `#09090b`, primary `#ff1493`).
  - Sin alternancia de secciones: `sectionBg = sectionBgMid = sectionBgAlt = #0a0a0a`.
  - Botón primary hot pink sólido, texto blanco. Tipografía Outfit + Inter.
  - Archivo: `src/features/theme/designPresets.ts`

- **Music**: Nueva sección `music` en la landing page con tracks embedidos.
  - Propio `musicTexts` (sectionTag, heading, description) y `music` array de canciones (mismo formato que `songs`).
  - SoundCloud tracks renderizan con `visual=true` (full-bleed artwork, 450px height, sin padding) cuando el token `musicSoundCloudVisual` es true (default).
  - Apple Music tracks renderizan con `&theme=dark` para fondo oscuro.
  - Spotify tracks renderizan como antes (ya son dark).
  - Grid usa `items-start` para alturas mixtas.
  - Nuevo design token `musicSoundCloudVisual` (boolean, default true) en DesignTokens y todos los presets.
  - Nueva CSS var `--music-sc-visual` en ThemeProvider.
  - Section id es `music`, href es `#music`.
  - Archivos: `schema.ts`, `designPresets.ts`, `ThemeProvider.tsx`, `Music.tsx` (nuevo), `LandingContainer.tsx`, `Navbar.tsx`, `landingdj.config.json`.

### Changed

- **Hero**: Revertido degradado espejo superior (Alternativa A). No gustó el resultado.
  Pendiente de evaluar Alternativa B (`object-position`) u otra opción.
  - Archivo: `src/features/landing/components/Hero.tsx:61`
  - Documentado en `docs/ActiveTask.md`

- **Hero**: Acotado el degradado inferior (`bg-gradient-to-t`) de la imagen de portada
  para que no tape la bandeja de DJ en `heroportada.jpg`.
  - Se agregaron stops `via-20%` y `to-40%` en el gradiente lineal.
  - Antes: el `via` sin stops quedaba a ~50% de altura, oscureciendo gran parte
    de la imagen.
  - Archivo: `src/features/landing/components/Hero.tsx:60`
  - Para revertir: `git checkout -- src/features/landing/components/Hero.tsx`
    o restaurar la línea original:
    ```tsx
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--overlay)] via-[var(--overlay)]/40 to-transparent z-0" />
    ```

- **Hero**: Corregido encuadre de la imagen para que la bandeja de DJ sea visible.
  - Eliminado `scale-105` que recortaba ~5% del área visible.
  - Agregado `object-bottom` para anclar el encuadre a la parte inferior de la imagen.
  - El recorte ahora se da en la parte superior (cielo/fondo) en vez de ocultar la bandeja.
  - Archivo: `src/features/landing/components/Hero.tsx:55`
  - Para revertir: restaurar `scale-105` y quitar `object-bottom`.
  - Ajustado a `object-position: 50% 75%` como punto medio entre cabeza y bandeja.
  - Archivo: `src/features/landing/components/Hero.tsx:55`
  - Para ajustar: modificar el porcentaje (mayor = más abajo, menor = más arriba).

- **Hero**: Cambiado `object-cover` por `object-contain` para mostrar la imagen
  completa (cabeza + bandeja de DJ) sin recortes.
  - Eliminado `object-position: 50% 75%` (ya no aplica).
  - Las barras negras laterales se funden con el fondo del hero.
  - Archivo: `src/features/landing/components/Hero.tsx:55`
  - Para revertir: restaurar `object-cover` con `scale-105`.
  - Alternativas exploradas documentadas en `docs/ActiveTask.md`.

- **Hero**: Forzado aspect ratio `5/4` en el contenedor para matchear el ratio
  de la imagen `heroportada.jpg` (3840×3072) y eliminar el recorte vertical.
  - Restaurado `object-cover` (reemplaza `object-contain` que creaba barras).
  - En desktop (pantalla ancha), el hero mide `1920×1536` — la imagen encaja
    perfectamente sin recortes ni barras.
  - En mobile, `min-h-screen` sigue ganando (pantalla más alta que ancha) y
    la imagen se ve completa en vertical.
  - Archivo: `src/features/landing/components/Hero.tsx:39`
  - Para revertir: quitar `aspect-[5/4]` de línea 39 y restaurar `scale-105`.

- **Hero**: Revertidos todos los cambios previos y re-aplicada solo la solución
  final (`aspect-[5/4]` + eliminar `scale-105`).
  - Revertido a original: `git checkout HEAD --`
  - Solo se modificaron 2 líneas: `aspect-[5/4]` en línea 39 y remover `scale-105` en línea 55.
  - Gradiente, overlays y comentarios quedaron exactamente como en el original.
  - Archivo: `src/features/landing/components/Hero.tsx:39,55`

- **Hero**: Revertidos los cambios exploratorios (gradiente acotado, object-bottom,
  object-position, object-contain). El estado final activo del componente solo
  incluye `aspect-[5/4]` en el contenedor y la eliminación de `scale-105`.
  - Archivo: `src/features/landing/components/Hero.tsx:39,55`

- **Hero**: Eliminado `docs/ActiveTask.md` — tarea completada.

- **Layout**: Unificado el ancho máximo de los contenedores de todas las secciones
  a `max-w-6xl` (1152px) para eliminar la sensación de compresión hacia el centro.
  - Hero: `max-w-4xl` → `max-w-6xl` (`Hero.tsx:67`)
  - Bio: `max-w-5xl` → `max-w-6xl` (`Bio.tsx:30`)
  - FAQ: `max-w-4xl` → `max-w-6xl` (`FAQ.tsx:26`)
  - Contacto: `max-w-5xl` → `max-w-6xl` (`Contact.tsx:72`)
  - Services, Equipment, Gallery, Videos, Songs ya usaban `max-w-6xl` — sin cambios.

- **Layout**: El `max-w` de las secciones ahora es configurable desde el JSON
  mediante el campo `sectionMaxWidth` (default `'1152px'`).
  - Agregado al schema: `src/lib/config/schema.ts`
  - Expuesto como `--section-max-width` via ThemeProvider.
  - 9 componentes reemplazan `max-w-6xl` → `max-w-[var(--section-max-width)]`.
  - Navbar y Footer mantienen `max-w-6xl` fijo.
  - Archivos: `schema.ts`, `ThemeProvider.tsx`, `LandingContainer.tsx`, 9 componentes.

- **Hero**: Corregida posición del contenido y scroll indicator para que
  queden dentro del viewport inicial a pesar del mayor alto del hero.
  - Cambiado `items-center` → `items-start` (contenido al tope).
  - Aumentado `pt-16` → `pt-24 md:pt-32` (separación del navbar fixed).
  - Cambiado scroll indicator de `absolute` → `fixed bottom-8 z-50`
    (siempre visible al fondo del viewport).
  - Archivo: `src/features/landing/components/Hero.tsx:39,67,107`

- **Hero**: Revertido el diseño del hero a la versión original (commit 3825050).
  Se mantienen solo 2 cambios mínimos que no rompen el layout:
  - Eliminado `scale-105` (recupera ~5% de área visible).
  - Acotado el degradado inferior con `via-20% to-40%` (bandeja visible).
  - Sin `aspect-[5/4]`, sin cambios de posición, sin scroll fixed.
  - Archivo: `src/features/landing/components/Hero.tsx:55,60`

- **Hero**: Agregado degradado espejo superior (`bg-gradient-to-b`) para disimular
  el crop de `object-cover` en la parte superior de la imagen (cabeza).
  - Misma configuración que el degradado inferior: `via-20% to-40%`.
  - El crop en ambos extremos se fusiona suavemente con el fondo oscuro.
  - Archivo: `src/features/landing/components/Hero.tsx:61`
