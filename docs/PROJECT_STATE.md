# Estado del Proyecto: StageKit Core / LandingDJ

Este documento mantiene un registro en tiempo real de la implementacion tecnica, permitiendo conocer exactamente que se ha construido, que esta en progreso y que sigue a nivel de codigo.

---

## Resumen de Progreso General

- **Fase 0 (Arquitectura):** 100% Completado.
- **Fase 1 (Fundacion del Proyecto):** 100% Completado.
- **Fase de Consolidacion Arquitectonica:** 100% Completado.
- **Fase 2 (Primera Landing Visual Funcional):** 100% Completado.
- **Fase 3 (QA Visual, Configuracion y Pulido V1):** 100% Completado.
- **Fase 4 (Integracion Real de Servicios):** 100% Completado.
- **Fase 5 (Design Presets y Expansion Visual):** 100% Completado.
- **Fase 6 (Tours Dinamicos via Google Sheets):** 100% Completado.

---

## Estado de la Estructura de Archivos Actual

```text
/
├── assets/                      # Assets auxiliares (AI Studio)
├── config/
│   └── landingdj.config.json    # Archivo de configuracion centralizado
├── docs/                        # Documentacion del proyecto
│   ├── PROJECT_CONTEXT.md       # Vision de negocio y alcance
│   ├── DECISIONS.md             # ADRs (Architecture Decision Records)
│   ├── ROADMAP.md               # Planificacion de fases
│   ├── PROJECT_STATE.md         # Estado actual del codigo
│   ├── CONFIG_GUIDE.md          # Guia de reconfiguracion via JSON
│   ├── IMPROVEMENTS.md          # Catalogo de mejoras futuras
│   ├── CONVENTIONS.md           # Convenciones tecnicas de desarrollo
│   ├── AI_HANDOVER.md           # Contexto para IAs que retomen el proyecto
│   ├── ActiveTask.md            # Ultima tarea completada
│   └── guiaImplementaciones/
│       └── presetArchitecture.md # Guia de arquitectura de presets
├── public/                      # Archivos estaticos
│   └── images/                  # Imagenes de la landing
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/
│   │   │   ├── contact/         # API Route para leads de contacto
│   │   │   │   └── route.ts
│   │   │   └── tours/           # API Route para tours dinamicos
│   │   │       └── route.ts
│   │   ├── globals.css          # Estilos globales + Tailwind v4 @theme
│   │   ├── layout.tsx           # Layout raiz (Google Fonts dinamico)
│   │   └── page.tsx             # Orquestador Server Component + SEO
│   ├── features/
│   │   ├── landing/
│   │   │   └── components/      # Componentes de secciones
│   │   │       ├── LandingContainer.tsx  # Orquestador de secciones
│   │   │       ├── Navbar.tsx            # Navegacion fija + movil
│   │   │       ├── Hero.tsx              # Hero con 2 layouts
│   │   │       ├── BioConFoto.tsx        # Presentacion Split Editorial
│   │   │       ├── Bio.tsx               # Biografia + badges
│   │   │       ├── Services.tsx          # Grid de servicios
│   │   │       ├── Equipment.tsx         # Rider tecnico
│   │   │       ├── Gallery.tsx           # Grilla de imagenes
│   │   │       ├── Videos.tsx            # Videos YouTube
│   │   │       ├── Songs.tsx             # Tracks embedidos
│   │   │       ├── Music.tsx             # Tracks con visual mode
│   │   │       ├── FAQ.tsx               # Acordion de preguntas
│   │   │       ├── Tours.tsx             # Cards de eventos
│   │   │       ├── TourTable.tsx         # Tabla de eventos
│   │   │       ├── Contact.tsx           # Formulario + WhatsApp
│   │   │       ├── Footer.tsx            # Pie de pagina
│   │   │       └── IconMapper.tsx        # Mapeo dinamico Lucide
│   │   └── theme/
│   │       ├── designPresets.ts          # 12 presets + ~75 tokens
│   │       └── components/
│   │           └── ThemeProvider.tsx      # Inyeccion de CSS vars
│   ├── lib/
│   │   ├── config/
│   │   │   ├── schema.ts        # Schema Zod completo
│   │   │   └── loader.ts        # Carga + validacion + merge presets
│   │   ├── email/
│   │   │   ├── types.ts         # Contratos (EmailMessage, EmailProvider)
│   │   │   ├── service.ts       # Singleton coordinator
│   │   │   ├── factory.ts       # Factory pattern
│   │   │   └── providers/
│   │   │       ├── smtp.ts      # Nodemailer SMTP real
│   │   │       └── placeholder.ts # Mock para desarrollo
│   │   └── tours/
│   │       ├── cache.ts         # MemoryCache<T> TTL 30s
│   │       └── sheetParser.ts   # Fetch CSV + parseo + validacion
│   ├── hooks/                   # (vacio, .gitkeep)
│   └── types/                   # (vacio, .gitkeep)
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── CHANGELOG.md
└── improvements.md
```

---

## Checklists de Implementacion por Fases

### Fase 1 -- Base & Docs (Completada)
- [x] Configurar dependencias en `package.json` para Next.js App Router.
- [x] Eliminar archivos obsoletos de la plantilla Vite.
- [x] Configurar TypeScript para soporte de Next.js.
- [x] Crear documentacion inicial obligatoria (`README.md`, `/docs/*`).
- [x] Implementar la estructura base de directorios fisicos de Next.js.
- [x] Ejecutar compilacion de verificacion.

### Fase de Consolidacion Arquitectonica (Completada)
- [x] **Separacion de responsabilidades:** Redisenar `src/app/page.tsx` para delegar la UI a `LandingContainer` y la inyeccion a un proveedor especializado.
- [x] **Sistema de Theme Dinamico:** Crear un `ThemeProvider.tsx` que inyecte las variables de diseno de manera declarativa mediante estilos inline.
- [x] **Google Fonts Selectivo:** Modificar `src/app/layout.tsx` para analizar el JSON de configuracion y solicitar a Google Fonts unicamente las familias utilizadas.
- [x] **Arquitectura de Email Flexible:** Crear una fabrica de proveedores que resuelva de forma desacoplada la implementacion a usar segun `EMAIL_PROVIDER`.
- [x] **Metadata Dinamica:** Generar metadatos dinamicos mediante `generateMetadata()` integrados con Next.js.

### Fase 2 -- Primera Landing Visual Funcional (Completada)
- [x] **Navbar Premium:** Menu de navegacion interactivo responsivo.
- [x] **Hero Escenico:** Fondo con gradiente cinematico, animacion de textos con motion/react y boton CTA. 2 layouts: `default` y `titles`.
- [x] **Biografia e Trayectoria:** perfil asimetrico de dos columnas con insignias personalizadas.
- [x] **BioConFoto:** Seccion Split Editorial con imagen en card + texto animado, configurable via JSON y presets.
- [x] **Mapeador de Iconos:** Helper `IconMapper.tsx` para traduccion segura de strings a componentes Lucide.
- [x] **Servicios & Tech Rider:** Renderizado inteligente y condicional de servicios y equipamiento.
- [x] **Galeria de Escenario:** Grilla de imagenes con efecto zoom en hover.
- [x] **Videos Interactivos:** Reproduccion de YouTube (in-place) que evita la carga de iframes hasta interaccion.
- [x] **Songs:** Seccion de tracks embedidos (SoundCloud, Spotify, Apple Music).
- [x] **Music:** Seccion de tracks embedidos con soporte para visual mode full-bleed en SoundCloud (`musicSoundCloudVisual`), tema oscuro en Apple Music. Grid responsivo con `items-start`.
- [x] **Preguntas Frecuentes:** Acordeon con animaciones de apertura y cierre fluidas.
- [x] **Formulario de Contacto:** Gestion de leads e interactividad multiestado (idle, enviando, exito, error).

### Fase 3 -- QA Visual, Configuracion y Pulido V1 (Completada)
- [x] **QA Responsivo:** Mejoras integrales de espaciado, desbordamientos e interaccion en moviles pequenos, tablets y pantallas grandes.
- [x] **Secciones Opcionales Robustecidas:** Validacion mental e implementacion de retornos `null` en todos los componentes para evitar espacios vacios o roturas si faltan datos en la configuracion.
- [x] **Configuracion de Ejemplo Premium:** Reescribir `landingdj.config.json` con datos reales elegantes, sin tecnicismos ni marcas placeholders.
- [x] **Accesibilidad Basica:** Atributos `aria-expanded` dinamicos, etiquetas `htmlFor` de formularios enlazadas con `id` de entrada, textos `alt` detallados para imagenes de galeria y contraste visual optimo.
- [x] **Performance Optimizado:** Lazy loading nativo en imagenes, reproduccion diferida en video de sets (evita layout shift) y suavizado de animaciones con Motion (`as const`).
- [x] **Estados del Formulario:** Eliminacion de errores de clases y depuracion de la interaccion del lead.
- [x] **Limpieza Absoluta:** Retirado cualquier rastro de consola, tags de depuracion, shells o descripciones que denoten ambiente tecnico.
- [x] **Verificacion Total:** Validar que `npm run lint` y `npm run build` compilan de manera perfecta.

### Fase 4 -- Integracion Real de Servicios (Completada)
- [x] **Provider SMTP real:** Implementar `SmtpEmailProvider` usando `nodemailer` con variables de entorno para credenciales.
- [x] **Seguridad de credenciales:** Las claves SMTP se configuran en `.env` (excluido de git) y se leen desde `process.env`.
- [x] **Factory actualizado:** Registrar `SmtpEmailProvider` en `createEmailProvider()` para el tipo `smtp`.
- [x] **Template HTML inline:** El email enviado al DJ incluye nombre, email, mensaje del cliente y `replyTo` para respuesta directa.
- [x] **Documentacion actualizada:** `PROJECT_STATE.md`, `DECISIONS.md`, `ROADMAP.md` y `AI_HANDOVER.md` reflejan la implementacion.

### Fase 5 -- Sistema de Design Presets y Expansion Visual (Completada)
- [x] **Arquitectura de presets:** Crear sistema de Design Presets con interface `DesignTokens` (~75 tokens) y objetos `DesignPreset` en `src/features/theme/designPresets.ts`.
- [x] **ThemeProvider actualizado:** Inyecta ~75 CSS variables desde los tokens del preset seleccionado.
- [x] **Migracion de componentes:** Todos los componentes reemplazan clases hardcodeadas (`text-white`, `bg-black`, `font-extrabold`, `tracking-widest`, `text-neutral-300`) por CSS variables (`--heading-color`, `--hero-bg`, `--font-weight-heading`, `--letter-spacing-tag`, `--text-label`).
- [x] **Presets dark:** `gold` (ambar/dorado), `neon` (cian/purpura/cyberpunk), `slate` (monocromatico/radios 0), `ember` (carmesi/dramatico), `frost` (azul hielo/navy), `sienna` (terracota/ambar/serif), `vapor` (magenta/retrowave), `barbie-dark` (hot pink/fondo oscuro), `barbie-blue` (azul electrico/fondo oscuro), `SalvajeDjPreset` (violeta galactico/espacio profundo).
- [x] **Preset light:** `pearl` (violeta/claro/cards blancas), `barbie` (hot pink/claro).
- [x] **CSS cascade fix:** `ThemeProvider` setea variables directas (`--color-primary`, `--font-heading`) en vez de cadenas `var()` desde `@theme` para evitar fallbacks a valores por defecto.
- [x] **Documentacion actualizada:** `CONFIG_GUIDE.md` (tabla de presets + ejemplos sin `colors`/`typography`), `DECISIONS.md` (ADR 06), `AI_HANDOVER.md` (arquitectura de presets).

### Fase 6 -- Tours Dinamicos via Google Sheets (Completada)
- [x] **Dependencia:** Instalar `csv-parse` para parseo server-side de CSV.
- [x] **Sistema de cache:** `src/lib/tours/cache.ts` -- clase `MemoryCache<T>` con TTL configurable (30 seg).
- [x] **Sheet parser:** `src/lib/tours/sheetParser.ts` -- fetch CSV publico, parsea con `csv-parse/sync`, valida filas con `TourEventSchema.safeParse()`, descarta invalidas con warning. Limpieza de BOM y deteccion de respuestas HTML.
- [x] **API Route:** `src/app/api/tours/route.ts` -- GET handler con source switch (static/google-sheets), cache en memoria, fallback silencioso a `[]`.
- [x] **Schema extendido:** `TOURS_SOURCES`, `ToursSource`, campos `toursSource`, `toursSourceValid`, `toursSheetUrl`.
- [x] **Config JSON:** `config/landingdj.config.json` actualizado con `toursSource`, `toursSourceValid`, `toursSheetUrl`.
- [x] **Tours.tsx reescrito:** Acepta prop `toursSource`, fetch condicional a `/api/tours`, skeleton `ToursSkeleton` con `animate-pulse`, oculta seccion si falla o no hay datos. Paginacion: 6 iniciales, boton "Mostrar mas" de a 3.
- [x] **TourTable.tsx reescrito:** Misma logica que Tours -- prop `toursSource`, fetch condicional, skeleton table loading, paginacion identica.
- [x] **LandingContainer.tsx:** Pasa `toursSource={config.toursSource}` a Tours y TourTable.
- [x] **Validacion de URL:** `toursSheetUrl` acepta `""` vacio cuando source es `static` (`.optional().or(z.literal(''))`).
- [x] **Renderizado dinamico:** `page.tsx` exporta `dynamic = 'force-dynamic'` para forzar SSR en cada request.
- [x] **Cache reducido:** TTL de 30 seg (antes 5 min) para actualizaciones casi inmediatas.
- [x] **Parser robustecido:** Limpieza de BOM, deteccion de respuestas HTML, logging de diagnostico con primeros 200 caracteres.
- [x] **Build verificado:** `npm run build` sin errores.
- [x] **Documentacion actualizada:** `CONFIG_GUIDE.md` (paso a paso Google Sheets), `DECISIONS.md` (ADR 08 + ADR 10), `ROADMAP.md` (Fase 6), `AI_HANDOVER.md` (arquitectura tours), `ActiveTask.md`.
