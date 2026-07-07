# StageKit Core — LandingDJ

LandingDJ es el primer producto del ecosistema **StageKit Core**, una landing page premium, moderna, accesible y altamente personalizable diseñada específicamente para DJs y artistas de eventos en vivo.

Este proyecto ha sido concebido bajo una arquitectura robusta, modular y completamente declarativa, permitiendo desplegar múltiples landings independientes para diferentes DJs modificando exclusivamente un archivo de configuración JSON externo, recursos multimedia y variables de estilo.

## 🚀 Arquitectura y Stack

El proyecto utiliza un stack de nivel de producción alineado con los objetivos de StageKit Core:

- **Framework**: Next.js (App Router, React Server Components) para optimización de SEO, Server-Side Rendering y máxima velocidad de carga.
- **Estilos**: Tailwind CSS (v4) con variables CSS dinámicas inyectadas desde la configuración.
- **Animaciones**: Motion (`motion/react`) para transiciones premium y micro-interacciones suaves.
- **Tipografía**: Catálogo predefinido con fuentes de Google Fonts cargadas de forma óptima.
- **Validación de Configuración**: Zod para verificar que la configuración sea robusta y segura antes del renderizado.
- **Servicios**: Arquitectura de correo electrónico desacoplada (Email Services) con un patrón Provider para evitar el acoplamiento con intermediarios específicos.

---

## 📂 Estructura de Documentación (`/docs`)

Para asegurar la continuidad del desarrollo por cualquier desarrollador o IA, la documentación está organizada en los siguientes documentos clave:

1. **[PROJECT_CONTEXT.md](./docs/PROJECT_CONTEXT.md)**: Visión del negocio, alcance de LandingDJ y objetivos del producto. *(Léase primero)*.
2. **[DECISIONS.md](./docs/DECISIONS.md)**: Bitácora de decisiones arquitectónicas y técnicas (ADRs), justificando cada elección.
3. **[ROADMAP.md](./docs/ROADMAP.md)**: Planificación de fases desde la fundación hasta el lanzamiento de la v1 y escalamiento.
4. **[PROJECT_STATE.md](./docs/PROJECT_STATE.md)**: Estado actual del proyecto, componentes completados, tareas pendientes y estado de los builds.
5. **[CONFIG_GUIDE.md](./docs/CONFIG_GUIDE.md)**: Guía completa de reconfiguración vía JSON con ejemplos prácticos.
6. **[IMPROVEMENTS.md](./docs/IMPROVEMENTS.md)**: Catálogo de ideas de mejora para aumentar el dinamismo vía JSON.
7. **[AI_HANDOVER.md](./docs/AI_HANDOVER.md)**: Instrucciones específicas y contexto técnico detallado para asistentes de IA que retomen el proyecto.

---

## 🛠️ Cómo Iniciar el Proyecto

### Requisitos Previos

- Node.js (v18.x o superior)
- npm (v9.x o superior)

### Instalación

```bash
npm install
```

### Desarrollo

Para iniciar el servidor de desarrollo en el puerto 3000:

```bash
npm run dev
```

### Producción

Para compilar y arrancar la versión de producción:

```bash
npm run build
npm run start
```

---

## ⚙️ Reconfiguración vía JSON

Este proyecto se personaliza íntegramente editando `config/landingdj.config.json`. No necesitás tocar código React para cambiar contenido, colores, secciones o SEO.

| Categoría | Campo clave en el JSON | Qué cambia |
|-----------|------------------------|------------|
| Identidad | `artisticName`, `slogan`, `description`, `logo`, `favicon` | Nombre del artista/marca, eslogan, logo y favicon del sitio |
| Colores | `colors.primary`, `.secondary`, `.accent`, `.background`, `.text` | Paleta de 5 colores HEX que tiñen toda la interfaz |
| Tipografía | `typography.heading`, `.body` | Fuentes para títulos y cuerpo (catálogo en `schema.ts`) |
| Hero | `hero.url`, `.ctaText` | Imagen o video de portada y texto del botón principal |
| Servicios | `services[]` | Lista de servicios/productos con título, descripción e icono |
| Galería | `gallery[]` | Hasta 10 imágenes en grilla responsiva |
| Videos | `videos[]` | Hasta 10 videos de YouTube con lazy loading |
| FAQ | `faq[]` | Hasta 10 preguntas frecuentes con acordeón |
| Redes Sociales | `socials.*` | Links a Instagram, SoundCloud, Spotify, etc. |
| Contacto | `contactForm`, `destinationEmail`, `whatsapp` | Formulario, email destino, WhatsApp |
| Textos | `*Texts.*` | Todos los labels, placeholders, headings y mensajes |
| Orden de secciones | `sectionOrder` | Reordena las secciones (hero, bio, services, etc.) |
| SEO | `seo.title`, `.description`, `.keywords`, `.ogImage` | Meta tags, Open Graph, keywords |

> Para la guía completa con todos los campos en detalle, ejemplos de reconfiguración (incluyendo cómo convertir esta landing en una tienda de presets) y los límites del JSON → **[`docs/CONFIG_GUIDE.md`](./docs/CONFIG_GUIDE.md)**
