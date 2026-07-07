# Guía de Configuración — StageKit Core / LandingDJ

Este documento describe cómo reconfigurar la landing page completamente editando solo el archivo `config/landingdj.config.json`.

---

## Índice

1. [Introducción](#1-introduccion)
2. [Referencia completa de campos](#2-referencia-completa-de-campos)
3. [Ejemplo completo: De Landing de DJ a Tienda de Presets](#3-ejemplo-completo-de-landing-de-dj-a-tienda-de-presets)
4. [Archivos externos necesarios](#4-archivos-externos-necesarios)
5. [Configuración de Email](#5-configuracion-de-email)
6. [Límites del JSON — Cuándo tocar código](#6-limites-del-json--cuando-tocar-codigo)
7. [Checklist rápido de reconfiguración](#7-checklist-rapido-de-reconfiguracion)

---

## 1. Introducción

El archivo `config/landingdj.config.json` es el único punto de personalización de la landing page.

- **No requiere base de datos** — todo está en el JSON.
- **No requiere backend** — el servidor Next.js lo lee localmente.
- **No requiere rebuild** — los cambios en el JSON se reflejan al recargar la página.

Puedes cambiar desde el nombre del artista hasta la paleta de colores, las secciones visibles, los textos, las redes sociales y el SEO sin abrir un solo archivo de código.

---

## 2. Referencia completa de campos

### 2.1 Identidad

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `artisticName` | `string` | Sí | Nombre del artista, banda o marca. Se usa en el título del sitio, hero y template de email |
| `slogan` | `string` | Sí | Eslogan o tagline visible en el Hero |
| `description` | `string` | Sí | Descripción general. También se usa como meta description si no hay SEO configurado |
| `logo` | `string` | Sí | Ruta pública del logo (ej. `/images/logo.png`) o URL externa |
| `favicon` | `string` | No | Ruta del favicon (ej. `/favicon.ico`) |

### 2.2 Identidad Visual (Design Presets)

La identidad visual se controla exclusivamente mediante **presets de diseño** que encapsulan colores, tipografía, radios, sombras, animaciones y ~56 tokens visuales. No se configuran colores ni fuentes directamente en el JSON.

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `designPreset` | `string` | Sí | Nombre del preset activo. Debe estar incluido en `validDesignPresets` |
| `validDesignPresets` | `string[]` | Sí | Lista de presets permitidos. Cada preset debe existir en código |

#### Presets disponibles

| Preset | Temperatura | Ambiente | Acento | Tipografía headings | Radios | Personalidad |
|--------|-------------|----------|--------|---------------------|--------|-------------|
| `gold` | 🔥 Cálida | Oscuro clásico | Ámbar `#d4af37` | Outfit | `1rem` | Lujo, elegancia, tradicional |
| `neon` | ❄️ Fría | Cyberpunk | Cian `#00f0ff` | Plus Jakarta Sans | `0.5rem` | Futurista, rave, techno |
| `slate` | 🌫️ Neutra | Monocromático | Blanco `#ffffff` | DM Sans | `0` | Editorial, minimalista, radical |
| `pearl` | ☀️ Neutra | **Claro** | Violeta `#8b5cf6` | DM Sans | `0.75rem` | Limpio, profesional, daytime |
| `ember` | 🔥 Cálida | Carmesí | Rojo `#dc2626` | Outfit | `0.5rem` | Intenso, dramático, pasión |
| `frost` | ❄️ Fría | Navy profundo | Azul hielo `#38bdf8` | Inter | `0.75rem` | Técnico, berlinés, profesional |
| `sienna` | 🔥 Cálida | Terracota | Ámbar `#d97706` | DM Serif Display | `0.75rem` | Orgánico, boho, desértico |
| `vapor` | 🌸 Vibrante | Púrpura | Magenta `#d946ef` | Plus Jakarta Sans | `0.5rem` | Retro-wave, synthwave, ochentero |
| `barbie` | 🌸 Vibrante | **Claro** | Hot pink `#ff1493` | Outfit | `1rem` | Femenino, divertido, pop |
| `barbie-dark` | 🌸 Vibrante | Oscuro | Hot pink `#ff1493` | Outfit | `1rem` | Dark Barbie, actitud |
| `SalvajeDjPreset` | ❄️ Fría | Espacio profundo | Violeta `#a78bfa` | Space Grotesk | `1rem` | Galaxia, elegante, minimalista |

```json
"designPreset": "SalvajeDjPreset",
"validDesignPresets": ["gold", "neon", "slate", "pearl", "ember", "frost", "sienna", "vapor", "barbie", "barbie-dark", "SalvajeDjPreset"]
```

> Para crear un preset nuevo: agregarlo en `src/features/theme/designPresets.ts` y añadir su nombre a `validDesignPresets` en el JSON.

### 2.3 Hero

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `hero.type` | `"image"` \| `"video"` | No | Tipo de hero. Si se omite, usa `image` |
| `hero.url` | `string` | Sí | URL de la imagen o video de fondo |
| `hero.ctaText` | `string` | Sí | Texto del botón de llamada a la acción |

### 2.4 Servicios

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `services[]` | `array` | No | Lista de servicios (máx. 10) |
| `services[].id` | `string` | Sí | Identificador único (ej. `srv_1`) |
| `services[].title` | `string` | Sí | Título del servicio |
| `services[].description` | `string` | Sí | Descripción del servicio |
| `services[].icon` | `string` | Sí | Nombre del icono Lucide React (ej. `music`, `briefcase`, `headphones`) |

### 2.5 Equipamiento

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `equipment[]` | `array` | No | Lista de equipos/productos (máx. 20) |
| `equipment[].id` | `string` | Sí | Identificador único |
| `equipment[].name` | `string` | Sí | Nombre del equipo/producto |
| `equipment[].category` | `string` | Sí | Categoría (agrupa visualmente) |
| `equipment[].icon` | `string` | Sí | Icono Lucide React |

### 2.6 Galería

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `gallery[]` | `string[]` | No | URLs de imágenes (máx. 10). Pueden ser rutas locales (`/images/...`) o externas |

### 2.7 Videos

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `videos[]` | `array` | No | Lista de videos (máx. 10) |
| `videos[].id` | `string` | Sí | Identificador único |
| `videos[].youtubeId` | `string` | Sí | ID del video de YouTube (ej. `kMJVNerOtRI`) |
| `videos[].title` | `string` | Sí | Título que se muestra en la grilla |
| `videos[].thumbnail` | `string` | No | URL de miniatura personalizada. Si se omite, YouTube genera una automáticamente |

### 2.8 Canciones / Tracks

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `songs[]` | `array` | No | Lista de canciones (máx. 10) |
| `songs[].id` | `string` | Sí | Identificador único |
| `songs[].title` | `string` | Sí | Título de la canción |
| `songs[].url` | `string` (URL) | Sí | URL a Spotify, Apple Music o SoundCloud |

### 2.9 FAQ

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `faq[]` | `array` | No | Preguntas frecuentes (máx. 10) |
| `faq[].id` | `string` | Sí | Identificador único |
| `faq[].question` | `string` | Sí | Pregunta |
| `faq[].answer` | `string` | Sí | Respuesta |

### 2.10 Redes Sociales

Todos los campos son opcionales. Solo se renderizan los que están presentes.

| Ruta JSON | Tipo | Descripción |
|-----------|------|-------------|
| `socials.instagram` | `string` (URL) | Link a Instagram |
| `socials.youtube` | `string` (URL) | Link a YouTube |
| `socials.soundcloud` | `string` (URL) | Link a SoundCloud |
| `socials.spotify` | `string` (URL) | Link a Spotify |
| `socials.tiktok` | `string` (URL) | Link a TikTok |
| `socials.facebook` | `string` (URL) | Link a Facebook |

### 2.11 Contacto

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `contactForm.enabled` | `boolean` | Sí | Muestra u oculta toda la sección de contacto |
| `contactForm.title` | `string` | Sí | Título de la sección de contacto |
| `contactForm.description` | `string` | Sí | Descripción debajo del título |
| `contactButtonText` | `string` | Sí | Texto del botón de envío |
| `confirmationPopupText` | `string` | Sí | Mensaje mostrado tras envío exitoso |
| `destinationEmail` | `string` (email) | No | Correo donde llegan los leads. Si se omite, el formulario dará error 503 |
| `whatsapp.enabled` | `boolean` | No | Muestra botón de WhatsApp si está activo |
| `whatsapp.phoneNumber` | `string` | No* | Número de WhatsApp (con código país, sin `+`) |
| `whatsapp.buttonText` | `string` | No* | Texto del botón de WhatsApp |
| `whatsapp.message` | `string` | No* | Mensaje predefinido al abrir WhatsApp |

> *Obligatorio si `whatsapp.enabled` es `true`.

### 2.12 Textos de Secciones

Cada sección tiene un objeto `*Texts` que permite cambiar los labels, headings, placeholders y mensajes sin tocar el código. Todos son opcionales; si se omiten, la sección usa valores por defecto o simplemente no muestra ciertos elementos.

| Objeto | Campos principales |
|--------|-------------------|
| `navbarTexts` | `bio`, `services`, `equipment`, `gallery`, `videos`, `faq`, `contact`, `ctaButton` |
| `heroTexts` | `badge`, `scrollIndicator` |
| `bioTexts` | `sectionTag`, `headingPrefix`, `cardTitle`, `badges[]` |
| `servicesTexts` | `sectionTag`, `heading`, `description` |
| `equipmentTexts` | `sectionTag`, `heading`, `description` |
| `galleryTexts` | `sectionTag`, `heading`, `description`, `overlayLabel` |
| `videosTexts` | `sectionTag`, `heading`, `description`, `playLabel`, `subtitleLabel` |
| `songsTexts` | `sectionTag`, `heading`, `description` |
| `faqTexts` | `sectionTag`, `heading`, `description` |
| `contactFormTexts` | `sectionTag`, `nameLabel`, `namePlaceholder`, `emailLabel`, `emailPlaceholder`, `messageLabel`, `messagePlaceholder`, `successTitle`, `sendAnotherButton`, `sendingText`, `bullets[]`, `validationError`, `apiError`, `networkError` |
| `footerTexts` | `copyrightTemplate` (usa `{{year}}`), `tagline`, `socialLabel`, `creditPrefix`, `creditBrand`, `creditTagline` |

### 2.13 SEO

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `seo.title` | `string` | Sí | Título de la página (pestaña del navegador y Open Graph) |
| `seo.description` | `string` | Sí | Meta description |
| `seo.keywords` | `string[]` | Sí | Palabras clave para SEO |
| `seo.ogImage` | `string` (URL) | No | Imagen para Open Graph (compartir en redes) |

### 2.14 Orden de Secciones

| Ruta JSON | Tipo | Obligatorio | Descripción |
|-----------|------|-------------|-------------|
| `sectionOrder` | `string[]` | No | Define el orden de renderizado de las secciones. Si se omite, se usa el orden por defecto. Secciones no listadas no se renderizan. |

Valores permitidos: `hero`, `bio`, `services`, `equipment`, `gallery`, `videos`, `songs`, `faq`, `contact`.

```json
"sectionOrder": ["hero", "contact", "services", "faq"]
```

> Las secciones `hero`, `bio`, `services`, `equipment`, `gallery`, `videos`, `songs`, `faq` y `contact` siguen siendo opcionales por su propia lógica interna (datos ausentes = no renderizado). Este campo solo controla el orden de las que están activas.

---

## 3. Ejemplo completo: De Landing de DJ a Tienda de Presets

Este ejemplo muestra cómo transformar la landing actual de un DJ en una landing de venta de presets para productores musicales, editando solo el JSON.

### 3.1 JSON original (DJ — Anto Bravo)

```json
{
  "artisticName": "Anto Bravo DJ",
  "slogan": "   ",
  "description": "DJ y Productor musical uruguaya radicada en Punta del este con mas de 5 años de trayectoria en la escena electronica nacional e internacional.",
  "logo": "/images/logo.png",
  "designPreset": "SalvajeDjPreset",
  "validDesignPresets": ["gold", "neon", "slate", "pearl", "ember", "frost", "sienna", "vapor", "barbie", "barbie-dark", "SalvajeDjPreset"],
  "services": [
    { "id": "srv_1", "title": "Festivales de electrónica y clubes", "description": "Sets exclusivos para cada evento...", "icon": "music" },
    { "id": "srv_2", "title": "Eventos privados y corporativos", "description": "Diseñamos experiencias musicales a medida...", "icon": "briefcase" }
  ],
  "equipment": [
    { "id": "eq_1", "name": "Pioneer DJ CDJ-3000", "category": "Controladores", "icon": "speaker" },
    { "id": "eq_2", "name": "Mixer Pioneer DJM-900NXS2", "category": "Sistemas de Audio", "icon": "speaker" }
  ],
  "gallery": [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
  ],
  "faq": [
    { "id": "faq_1", "question": "¿Con cuánta anticipación recomiendas reservar la fecha?", "answer": "Para garantizar la exclusividad..." },
    { "id": "faq_2", "question": "¿El servicio incluye la provisión e instalación de equipos?", "answer": "Sí, diseñamos soluciones integrales..." }
  ],
  "socials": {
    "instagram": "https://www.instagram.com/antobravodj_",
    "soundcloud": "https://m.soundcloud.com/anto-bravo-240086065"
  },
  "contactForm": { "enabled": true, "title": "Coordinemos tu Próxima Experiencia", "description": "Completa tus datos..." },
  "contactButtonText": "Enviar Solicitud",
  "confirmationPopupText": "Tu solicitud ha sido registrada exitosamente.",
  "destinationEmail": "booking@alexisverdi.com",
  "whatsapp": { "enabled": true, "phoneNumber": "59897973677", "buttonText": "Contáctanos por WhatsApp", "message": "Hola! Vi tu landing y quiero consultarte sobre un evento." },
  "sectionOrder": ["hero", "bio", "services", "equipment", "gallery", "videos", "songs", "faq", "contact"],
  "seo": {
    "title": "Anto Bravo | DJ & Productor de Eventos de Lujo",
    "description": "DJ profesional internacional experto en bodas de alta gama...",
    "keywords": ["DJ bodas boutique", "DJ eventos de lujo"],
    "ogImage": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200"
  }
}
```

### 3.2 JSON transformado (Tienda de Presets — BeatForge)

```json
{
  "artisticName": "BeatForge Presets",
  "slogan": "Elevá tus sets con sonidos profesionales",
  "description": "Packs de presets diseñados por DJs para DJs. Sonidos curados para Tech House, Melodic House y Deep House. Compatibles con Serum, Ableton Live y más.",
  "logo": "/images/beatforge-logo.png",
  "designPreset": "neon",
  "validDesignPresets": ["gold", "neon", "slate", "pearl", "ember", "frost", "sienna", "vapor", "barbie", "barbie-dark", "SalvajeDjPreset"],
  "services": [
    { "id": "srv_1", "title": "Tech House Essentials", "description": "50 presets diseñados para sesiones de tech house. Incluye leads, basses, plucks y fx. Compatible con Serum v1.5+.", "icon": "waveform" },
    { "id": "srv_2", "title": "Melodic Hypnosis", "description": "Packs de 40 presets melódicos con pads atmosféricos, arpegios y leads etéreos. Ideal para melodic house y progressive.", "icon": "headphones" },
    { "id": "srv_3", "title": "Peak Time Tools", "description": "30 sonidos agresivos para main stage. Basses distort, leads potentes y fx de transición. Formato WAV 24bit + Serum.", "icon": "zap" }
  ],
  "equipment": [
    { "id": "eq_1", "name": "Serum (Xfer Records)", "category": "Sintetizador", "icon": "music" },
    { "id": "eq_2", "name": "Ableton Live 12 Suite", "category": "DAW", "icon": "music" },
    { "id": "eq_3", "name": "FL Studio 24", "category": "DAW", "icon": "music" },
    { "id": "eq_4", "name": "WAV 24bit / 44.1kHz", "category": "Formato de Audio", "icon": "file-audio" }
  ],
  "gallery": [
    "/images/preset-screenshot-1.jpg",
    "/images/preset-screenshot-2.jpg",
    "/images/serum-preset-demo.jpg"
  ],
  "videos": [
    { "id": "vid_1", "youtubeId": "dQw4w9WgXcQ", "title": "Demo: Tech House Essentials Pack", "thumbnail": "/images/thumb-demo-1.jpg" },
    { "id": "vid_2", "youtubeId": "dQw4w9WgXcQ", "title": "Tutorial: Cómo cargar presets en Serum", "thumbnail": "/images/thumb-demo-2.jpg" }
  ],
  "songs": [
    { "id": "song_1", "title": "BeatForge — Tech House Demo", "url": "https://soundcloud.com/beatforge/tech-house-demo" },
    { "id": "song_2", "title": "BeatForge — Melodic Showcase", "url": "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" }
  ],
  "faq": [
    { "id": "faq_1", "question": "¿Cómo descargo los presets después de comprarlos?", "answer": "Recibirás un link de descarga inmediato por email. También podés descargarlos desde tu panel de cliente en nuestra web." },
    { "id": "faq_2", "question": "¿Son compatibles con mi DAW?", "answer": "Los presets de Serum funcionan en cualquier DAW que soporte VST3 o AU (Ableton, FL Studio, Logic, Cubase, etc). Los WAV se pueden usar en cualquier DAW." },
    { "id": "faq_3", "question": "¿Puedo usar estos presets en mis producciones comerciales?", "answer": "Sí, todos nuestros presets tienen licencia libre de regalías. Podés usarlos en tus canciones sin pagar extra." },
    { "id": "faq_4", "question": "¿Ofrecen reembolsos?", "answer": "Sí, ofrecemos reembolso completo dentro de los primeros 14 días si el producto no cumple tus expectativas." }
  ],
  "socials": {
    "instagram": "https://www.instagram.com/beatforge",
    "youtube": "https://youtube.com/@beatforge",
    "tiktok": "https://www.tiktok.com/@beatforge"
  },
  "contactForm": {
    "enabled": true,
    "title": "¿Tenés dudas sobre nuestros packs?",
    "description": "Dejanos tu consulta y te respondemos en menos de 24 horas hábiles."
  },
  "contactButtonText": "Consultar",
  "confirmationPopupText": "Tu consulta fue recibida. Te responderemos a la brevedad.",
  "destinationEmail": "ventas@beatforge.com",
  "whatsapp": {
    "enabled": true,
    "phoneNumber": "59897973677",
    "buttonText": "Chateá por WhatsApp",
    "message": "Hola! Vi BeatForge Presets y quiero consultar sobre los packs."
  },
  "sectionOrder": ["hero", "bio", "services", "equipment", "gallery", "videos", "songs", "faq", "contact"],
  "seo": {
    "title": "BeatForge Presets | Packs de Sonidos para DJs y Productores",
    "description": "Packs de presets profesionales para Tech House, Melodic House y Deep House. Compatibles con Serum, Ableton Live y FL Studio. Descarga inmediata.",
    "keywords": ["presets serum", "tech house presets", "melodic house samples", "sonidos para djs", "packs de presets"],
    "ogImage": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200"
  },
  "heroTexts": {
    "badge": "Nuevos Packs 2026",
    "scrollIndicator": "Ver Packs"
  },
  "bioTexts": {
    "sectionTag": "Sobre BeatForge",
    "headingPrefix": "Sonidos que marcan la diferencia: ",
    "cardTitle": "Por qué elegirnos",
    "badges": [
      { "title": "Sonidos Curados por DJs Activos", "description": "Cada preset es probado en cabina antes de ser lanzado." },
      { "title": "Formato Universal", "description": "Compatible con Serum, Ableton, FL Studio y cualquier DAW." },
      { "title": "Actualizaciones Gratuitas", "description": "Todos los packs incluyen actualizaciones de por vida." }
    ]
  },
  "servicesTexts": {
    "sectionTag": "Nuestros Packs",
    "heading": "Elegí tu Sonido",
    "description": "Packs diseñados para cada género y momento del set."
  },
  "equipmentTexts": {
    "sectionTag": "Compatibilidad",
    "heading": "Tecnología y Formatos Soportados",
    "description": "Todos nuestros productos son compatibles con los estándares de la industria."
  },
  "galleryTexts": {
    "sectionTag": "Vista Previa",
    "heading": "Mirá lo que suena",
    "description": "Capturas de pantalla de los presets en acción dentro del DAW.",
    "overlayLabel": "Ver Demo"
  },
  "videosTexts": {
    "sectionTag": "Demostraciones",
    "heading": "Escuchalos en Acción",
    "description": "Videos mostrando cómo suenan los presets en contexto.",
    "playLabel": "Reproducir demo",
    "subtitleLabel": "Demo Oficial BeatForge"
  },
  "faqTexts": {
    "sectionTag": "Dudas Frecuentes",
    "heading": "Todo lo que necesitás saber",
    "description": "Respuestas rápidas a las preguntas más comunes sobre nuestros productos."
  },
  "footerTexts": {
    "copyrightTemplate": "© {{year}} — BeatForge Presets. Todos los derechos reservados.",
    "tagline": "Sonidos profesionales para DJs y productores.",
    "socialLabel": "Seguinos",
    "creditPrefix": "Powered by",
    "creditBrand": "StageKit Core",
    "creditTagline": "Configuración Declarativa"
  }
}
```

### 3.3 Resumen de cambios

| Aspecto | Antes (DJ) | Después (Presets) |
|---------|-----------|-------------------|
| Marca | Nombre de DJ | Nombre de producto/marca |
| Preset | Gold | Neon |
| Colores | Dorado, gris, negro | Cyan, magenta, oscuro |
| Servicios | Shows y eventos | Packs de presets (3 productos) |
| Equipamiento | Pioneer DJ | Serum, Ableton, FL Studio |
| Galería | Fotos de eventos | Screenshots de DAW |
| Videos | Sets en vivo en YouTube | Demos y tutoriales |
| Canciones | Sets grabados | Demos de los presets |
| FAQ | Booking y rider | Descargas, compatibilidad, reembolsos |
| Redes Sociales | Instagram, SoundCloud | Instagram, YouTube, TikTok |
| Contacto | Booking para eventos | Consultas de venta |
| WhatsApp | Consultar disponibilidad | Chatear por packs |
| SEO | Palabras de DJ | Palabras de presets |

---

## 4. Archivos externos necesarios

Además del JSON, algunos campos referencian archivos que debes proveer:

| Archivo | Ruta esperada | Se usa en |
|---------|---------------|-----------|
| Logo | `public/images/logo.png` (o cualquier URL) | `logo` |
| Favicon | `public/favicon.ico` | `favicon` |
| Hero image | `public/images/heroportada.jpg` (o URL) | `hero.url` |
| Gallery images | `public/images/...` (o URLs externas) | `gallery[]` |
| Video thumbnails | `public/images/...` (o URLs externas) | `videos[].thumbnail` |
| Songs audio | URLs externas (Spotify, SoundCloud, Apple Music) | `songs[].url` |

> Las imágenes pueden ser URLs externas (Unsplash, Imgur, etc.) sin necesidad de descargarlas localmente.

---

## 5. Configuración de Email

Para que el formulario de contacto envíe correos reales, necesitas configurar variables de entorno.

### 5.1 Archivo `.env` (local, no sube a git)

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tuemail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

- `EMAIL_PROVIDER=smtp` — activa el envío real vía SMTP
- `SMTP_USER` — tu correo de Gmail
- `SMTP_PASS` — **App Password** de Google (no tu contraseña normal)

### 5.2 Cómo obtener la App Password de Gmail

1. Andá a [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activá **"Verificación en dos pasos"**
3. Buscá **"Contraseñas de aplicaciones"**
4. Elegí **"Correo"** + **"Otra"**
5. Copiá la clave de 16 caracteres generada

### 5.3 En producción (Cloud Run, Vercel, etc.)

Configurá las mismas variables de entorno en el panel de la plataforma (no uses `.env` en producción).

### 5.4 Destino de los correos

El email del destinatario se configura en el JSON (`destinationEmail`) — NO en las variables de entorno.

```json
"destinationEmail": "tucorreo@dominio.com"
```

---

## 6. Límites del JSON — Cuándo tocar código

No todo se puede cambiar desde el JSON. Estas modificaciones requieren editar archivos de código:

| Qué querés hacer | Dónde se cambia |
|------------------|-----------------|
| Agregar una sección nueva | Crear nuevo componente en `src/features/landing/components/` e importarlo en `LandingContainer.tsx` |
| Cambiar el layout de una sección | Editar el componente React correspondiente |
| Crear un nuevo design preset | Agregarlo en `src/features/theme/designPresets.ts` + añadir a `validDesignPresets` en el JSON |
| Agregar/quitar tokens de un preset | Editar `DesignTokens` interface + el preset en `designPresets.ts` + `ThemeProvider.tsx` + `globals.css` |
| Usar una fuente no listada | Agregarla al array `ALLOWED_FONTS` en `src/lib/config/schema.ts` |
| Usar un icono no soportado | Agregarlo al mapper en `src/features/landing/components/IconMapper.tsx` |
| Cambiar el proveedor de email | Editar `src/lib/email/factory.ts` (agregar case + import) |
| Cambiar animaciones o interacciones | Editar el componente React correspondiente |
| Agregar campos nuevos al JSON | 1. Agregar el campo al schema en `schema.ts` 2. Agregar validación Zod 3. Usarlo en el componente |
| Cambiar la plantilla HTML del email | Editar `src/lib/email/providers/smtp.ts` (método `buildHtml`) |

---

## 7. Checklist rápido de reconfiguración

- [ ] Editar `config/landingdj.config.json` (identidad, colores, contenido, secciones, SEO)
- [ ] Reemplazar imágenes en `public/images/` (logo, hero, galería)
- [ ] Configurar `.env` con credenciales SMTP (si usás formulario de contacto)
- [ ] Verificar que el JSON es válido: `npm run dev` y revisar la consola
- [ ] Compilar para producción: `npm run build`
