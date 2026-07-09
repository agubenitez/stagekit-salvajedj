# Contexto del Proyecto: LandingDJ

LandingDJ es el primer módulo funcional de la suite **StageKit Core**. Se trata de un generador de páginas de destino (landing pages) ultra-premium orientadas al mercado de DJs, productores musicales y artistas de eventos en vivo.

---

## 🎯 Visión del Producto

El modelo de negocio de LandingDJ se basa en un esquema de **Software-as-a-Product personalizable**:
1. Se comercializa una base técnica de alto rendimiento y diseño premium a DJs individuales.
2. Cada cliente recibe una instancia de landing independiente.
3. No se requiere base de datos ni panel de administración complejo en esta primera etapa.
4. La personalización y mantenimiento de cada sitio se realiza a través de un archivo de configuración declarativo: `public/config/landingdj.config.json`.

---

## 👥 Público Objetivo

- **DJs de Bodas y Eventos Corporativos**: Requieren elegancia, listas de equipamiento detalladas, testimonios/FAQs y un formulario de contacto directo.
- **Club/Festival DJs**: Priorizan galerías de fotos de alto impacto, videos de sets en vivo de YouTube, enlaces directos a SoundCloud/Spotify y redes sociales destacadas.
- **DJs híbridos (Open Format)**: Necesitan flexibilidad para activar o desactivar secciones según su enfoque actual.

---

## 💎 Filosofía de Diseño

- **Estética "Premium Dark/Light Canvas"**: Contraste elevado, tipografía sofisticada, espaciados generosos y colores dinámicos que se adaptan a la identidad visual del DJ.
- **Secciones Flexibles y Opcionales**: Cada DJ tiene prioridades distintas. Si una sección no se define en la configuración, desaparece por completo sin dejar rastros en el DOM ni espacios en blanco en la interfaz (layout shift).
- **Mobile First**: El 80% del tráfico de eventos en vivo proviene de dispositivos móviles. La experiencia táctil, las transiciones y los tiempos de carga en móviles deben ser impecables.

---

## 🛠️ Requisitos Funcionales Clave

Para cumplir con la promesa de personalización total, la landing page se compone de las siguientes secciones:

- **Navbar**: Cabecera de navegación fluida. Solo muestra enlaces a las secciones que están configuradas y activas.
- **Hero**: Presentación inicial con soporte para imagen estática o fondo de video en bucle (YouTube o MP4 local/remoto), un slogan impactante y llamadas a la acción (CTAs).
- **BioConFoto**: Sección de presentación con imagen + texto en formato Split Editorial (50/50), ideal para mostrar una foto profesional junto a una descripción personal.
- **Descripción (Bio)**: Sección biográfica sobre el DJ con soporte para textos limpios y maquetación elegante.
- **Servicios**: Lista de servicios ofrecidos (por ejemplo: Bodas, Corporativos, Clubes, Producción Musical) con títulos descripciones.
- **Equipamiento**: Listado estructurado del hardware de audio, iluminación y efectos especiales que utiliza el artista, categorizado y acompañado de iconos visuales estilizados.
- **Galería de Imágenes**: Carrusel o grilla bento de hasta 10 fotos optimizadas del artista en acción.
- **Galería de Videos**: Grilla de videos de YouTube integrados de forma ligera (lazy load) con soporte para hasta 10 videos.
- **Redes Sociales**: Enlaces optimizados a plataformas (Instagram, SoundCloud, Spotify, Facebook, TikTok, etc.).
- **FAQs (Preguntas Frecuentes)**: Acordeón interactivo con hasta 10 preguntas y respuestas clave.
- **Formulario de Contacto**: Formulario limpio (Nombre, Email, Mensaje) acoplado a un servicio de envío de email desacoplado y seguro, con popup de confirmación dinámico.
- **Footer**: Pie de página con créditos, enlaces legales mínimos, redes sociales y copyright.
