# Contexto del Proyecto: LandingDJ

LandingDJ es el primer modulo funcional de la suite **StageKit Core**. Se trata de un generador de paginas de destino (landing pages) ultra-premium orientadas al mercado de DJs, productores musicales y artistas de eventos en vivo.

---

## Vision del Producto

El modelo de negocio de LandingDJ se basa en un esquema de **Software-as-a-Product personalizable**:
1. Se comercializa una base tecnica de alto rendimiento y diseno premium a DJs individuales.
2. Cada cliente recibe una instancia de landing independiente.
3. No se requiere base de datos ni panel de administracion complejo en esta primera etapa.
4. La personalizacion y mantenimiento de cada sitio se realiza a traves de un archivo de configuracion declarativo: `config/landingdj.config.json`.

---

## Publico Objetivo

- **DJs de Bodas y Eventos Corporativos**: Requieren elegancia, listas de equipamiento detalladas, testimonios/FAQs y un formulario de contacto directo.
- **Club/Festival DJs**: Priorizan galerias de fotos de alto impacto, videos de sets en vivo de YouTube, enlaces directos a SoundCloud/Spotify y redes sociales destacadas.
- **DJs hibridos (Open Format)**: Necesitan flexibilidad para activar o desactivar secciones segun su enfoque actual.

---

## Filosofia de Diseno

- **Estetica "Premium Dark/Light Canvas"**: Contraste elevado, tipografia sofisticada, espaciados generosos y colores dinamicos que se adaptan a la identidad visual del DJ.
- **12 Design Presets**: Sistema completo de temas visuales con ~75 tokens (colores, radios, sombras, animaciones, overlays, letter-spacing, font-weight). Incluye presets dark (gold, neon, slate, ember, frost, sienna, vapor, barbie-dark, barbie-blue, SalvajeDjPreset) y light (pearl, barbie).
- **Secciones Flexibles y Opcionales**: Cada DJ tiene prioridades distintas. Si una seccion no se define en la configuracion, desaparece por completo sin dejar rastros en el DOM ni espacios en blanco en la interfaz (layout shift).
- **Mobile First**: El 80% del trafico de eventos en vivo proviene de dispositivos moviles. La experiencia tactil, las transiciones y los tiempos de carga en moviles deben ser impecables.
- **Tours Dinamicos**: Soporte para gestion de eventos via Google Sheets (CSV publico) sin necesidad de deploy. El usuario final solo edita la planilla; los cambios se reflejan automaticamente.

---

## Requisitos Funcionales Clave

Para cumplir con la promesa de personalizacion total, la landing page se compone de las siguientes secciones:

- **Navbar**: Cabecera de navegacion fluida. Solo muestra enlaces a las secciones que estan configuradas y activas.
- **Hero**: Presentacion inicial con soporte para imagen estatica o fondo de video en bucle (YouTube o MP4 local/remoto), un slogan impactante y llamadas a la accion (CTAs). Layouts configurables: `default` (nombre + slogan + CTA) y `titles` (multi-titulo con animacion drift).
- **BioConFoto**: Seccion de presentacion con imagen + texto en formato Split Editorial (50/50), ideal para mostrar una foto profesional junto a una descripcion personal. Layout configurable via preset (`image-left` / `image-right`).
- **Descripcion (Bio)**: Seccion biografica sobre el DJ con soporte para textos limpios y maquetacion elegante. Heading configurable desde JSON via `bioTexts.heading`.
- **Servicios**: Lista de servicios ofrecidos (por ejemplo: Bodas, Corporativos, Clubes, Produccion Musical) con titulos, descripciones e iconos Lucide.
- **Equipamiento**: Listado estructurado del hardware de audio, iluminacion y efectos especiales que utiliza el artista, categorizado y acompanado de iconos visuales estilizados.
- **Galeria de Imagenes**: Grilla responsiva de hasta 10 fotos optimizadas del artista en accion con efecto zoom en hover.
- **Galeria de Videos**: Grilla de videos de YouTube integrados de forma ligera (lazy load) con soporte para hasta 10 videos.
- **Songs**: Seccion de tracks embedidos desde SoundCloud, Spotify y Apple Music.
- **Music**: Seccion de tracks embedidos con soporte para visual mode full-bleed en SoundCloud (`musicSoundCloudVisual`) y tema oscuro en Apple Music.
- **Tours/Eventos**: Seccion de fechas de shows con dos variantes: cards (`Tours`) y tabla (`TourTable`). Soporta datos estaticos del JSON o dinamicos via Google Sheets. Incluye estados (en_venta, agotado, finalizado, proximamente), banderas de pais y paginacion.
- **FAQs (Preguntas Frecuentes)**: Acordion interactivo con hasta 10 preguntas y respuestas clave.
- **Formulario de Contacto**: Formulario limpio (Nombre, Email, Mensaje) acoplado a un servicio de envio de email desacoplado y seguro, con popup de confirmacion dinamico y boton opcional de WhatsApp.
- **Footer**: Pie de pagina con creditos, enlaces legales minimos, redes sociales y copyright.
