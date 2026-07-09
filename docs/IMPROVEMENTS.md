# Ideas de Mejora — StageKit Core / LandingDJ

Catálogo de mejoras propuestas para aumentar el dinamismo vía JSON y la flexibilidad general del proyecto. Cada idea incluye el problema que resuelve, la solución propuesta, el esfuerzo estimado y los archivos involucrados.

---

## Índice

1. [Orden de secciones configurable](#1-orden-de-secciones-configurable) ✅
2. [Flags enabled explícitos por sección](#2-flags-enabled-explícitos-por-sección)
3. [Estilos de botones configurables](#3-estilos-de-botones-configurables)
4. [Animaciones configurables](#4-animaciones-configurables)
5. [Anchor IDs configurables](#5-anchor-ids-configurables)
6. [Sección de Testimonios](#6-sección-de-testimonios)
7. [Tabla de Precios / Productos](#7-tabla-de-precios--productos)
8. [Background personalizable por sección](#8-background-personalizable-por-sección)
9. [Campos de formulario configurables](#9-campos-de-formulario-configurables)
10. [Layout variants por sección](#10-layout-variants-por-sección)
11. [Dark/Light mode configurable](#11-darklight-mode-configurable)
12. [Secciones custom (bloques genéricos)](#12-secciones-custom-bloques-genéricos)
13. [Separación del JSON en múltiples archivos](#13-separación-del-json-en-múltiples-archivos-de-configuración)
14. [Sección BioFondoOverlay](#14-sección-biofondooverlay)

---

## Notación

| Símbolo | Significado |
|---------|-------------|
| 🟢 Alta | Prioridad alta |
| 🟡 Media | Prioridad media |
| 🔵 Alta (esfuerzo) | Prioridad alta, esfuerzo mayor |
| Bajo | 1-2 archivos modificados, sin nuevas dependencias |
| Medio | 3-5 archivos modificados, puede requerir nuevo componente |
| Alto | Múltiples archivos, posible nueva dependencia |
| ✅ | Idea implementada |
| ⏳ | Idea pendiente de implementar |

---

## 1. Orden de secciones configurable ✅

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟢 Alta | Bajo | ✅ Implementado |

**Problema actual**: El orden de las secciones está hardcodeado en `LandingContainer.tsx`. No es posible reordenar secciones sin modificar código.

**Solución implementada**: Se agregó el campo `sectionOrder: string[]` en el JSON que define el orden de renderizado.

```json
"sectionOrder": ["hero", "bio", "services", "equipment", "gallery", "videos", "songs", "faq", "contact"]
```

**Archivos modificados**:
- `src/lib/config/schema.ts` — agregado `SECTION_IDS`, `SectionId` type y `sectionOrder` opcional
- `src/features/landing/components/LandingContainer.tsx` — refactorizado a mapa de secciones + loop por `sectionOrder`
- `config/landingdj.config.json` — agregado el campo
- `docs/CONFIG_GUIDE.md` — documentado en sección 2.14 y ejemplos
- `README.md` — agregado a la tabla resumen

**Comportamiento**:
- Si el campo se omite, se usa el orden por defecto retrocompatible
- Secciones listadas pero sin datos no se renderizan (cada componente maneja su propia lógica de null)
- Secciones con datos pero no listadas en `sectionOrder` no se renderizan (permite ocultar sin borrar)

---

## 2. Flags enabled explícitos por sección

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟢 Alta | Bajo | ⏳ Pendiente |

**Problema actual**: Las secciones se ocultan implícitamente:
- Arrays vacíos (`services: []`) ocultan la sección
- Strings vacíos (`description: ""`) ocultan la sección
- Hero, Navbar y Footer siempre se renderizan

Esto impide guardar contenido desactivado y no hay forma de ocultar una sección sin perder sus datos.

**Solución propuesta**: Agregar un campo `enabled: boolean` opcional en cada sección.

```json
"hero": {
  "enabled": true,
  "type": "image",
  ...
},
"bio": {
  "enabled": false,
  ...
}
```

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar `enabled?: boolean` en cada schema de sección
- Cada componente de sección — agregar guard `if (!enabled) return null`
- `config/landingdj.config.json` — agregar flags

**Consideraciones**:
- Si `enabled` se omite, mantener el comportamiento actual (auto-detect por datos presentes) para retrocompatibilidad

---

## 3. Estilos de botones configurables

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟢 Alta | Bajo | ⏳ Pendiente |

**Problema actual**: Todos los botones tienen el mismo estilo: `variant: filled`, `borderRadius` fijo, colores primary/secondary fijos.

**Solución propuesta**: Agregar configuración de estilo de botón por sección.

```json
"hero": {
  "ctaStyle": {
    "variant": "filled",
    "radius": "full",
    "size": "lg"
  }
},
"contactForm": {
  "submitStyle": {
    "variant": "outlined",
    "radius": "md",
    "size": "md"
  }
}
```

Variantes: `filled`, `outlined`, `ghost`. Radios: `none`, `sm`, `md`, `lg`, `full`. Tamaños: `sm`, `md`, `lg`.

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar schema de estilo de botón
- Componentes con botones (Hero, Contact, etc.) — aplicar estilos desde props en lugar de clases fijas
- Eventualmente crear un componente `Button` reutilizable

---

## 4. Animaciones configurables

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟢 Alta | Bajo | ⏳ Pendiente |

**Problema actual**: Las animaciones de entrada (stagger, fade, slide, scale) están hardcodeadas en cada componente con valores fijos de duración, retraso y tipo.

**Solución propuesta**: Agregar configuración de animación por sección o global.

```json
"animation": {
  "enabled": true,
  "type": "fade-up",
  "duration": 0.6,
  "stagger": 0.1,
  "ease": "easeOut"
}
```

Tipos: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale-up`, `slide-up`, `none`.

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar schema de animación global y por sección
- Componentes con motion — recibir variantes desde props en lugar de valores fijos
- Opcional: crear hook `useSectionAnimation` para centralizar la lógica

---

## 5. Anchor IDs configurables

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟢 Alta | Bajo | ⏳ Pendiente |

**Problema actual**: Los anchor IDs (`#hero`, `#bio`, `#contacto`, etc.) están hardcodeados en cada componente y referenciados en el Navbar y Hero CTA.

**Solución propuesta**: Agregar un campo `sectionId` en cada sección.

```json
"hero": {
  "sectionId": "inicio",
  ...
},
"contactForm": {
  "sectionId": "contacto",
  ...
}
```

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar `sectionId?: string`
- Cada componente de sección — usar `sectionId` del prop en lugar de string fijo
- `Navbar.tsx` — recibir anchors desde config en lugar de strings fijos
- `Hero.tsx` — el CTA link debe usar el anchor de contacto configurable

---

## 6. Sección de Testimonios

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Medio | ⏳ Pendiente |

**Problema actual**: No hay forma de mostrar reseñas, valoraciones o testimonios de clientes. Es una sección clave para páginas de producto o servicios.

**Solución propuesta**: Nueva sección nativa con renderizado condicional.

```json
"testimonials": [
  {
    "id": "test_1",
    "name": "Carlos Méndez",
    "role": "Productor Musical",
    "text": "Los presets transformaron completamente mi sonido. Altamente recomendados.",
    "rating": 5,
    "avatar": "/images/avatars/carlos.jpg"
  },
  {
    "id": "test_2",
    "name": "Laura Giménez",
    "role": "DJ / Productora",
    "text": "La calidad de los sonidos es increíble. Usé el pack Tech House en mi último set y fue un éxito.",
    "rating": 5,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  }
],
"testimonialsTexts": {
  "sectionTag": "Lo que dicen nuestros clientes",
  "heading": "Testimonios",
  "description": "Esto es lo que opinan quienes ya probaron nuestros productos."
}
```

**Archivos a crear/modificar**:
- `src/features/landing/components/Testimonials.tsx` — nuevo componente
- `src/lib/config/schema.ts` — agregar schemas `TestimonialSchema` y `TestimonialsTextsSchema`
- `src/features/landing/components/LandingContainer.tsx` — importar y renderizar
- `config/landingdj.config.json` — agregar datos de ejemplo

**Consideraciones**:
- El avatar debe soportar tanto rutas locales como URLs externas
- Las estrellas (rating) pueden usar iconos de lucide-react
- Soporte para video testimonial opcional

---

## 7. Tabla de Precios / Productos

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Medio | ⏳ Pendiente |

**Problema actual**: No hay forma de mostrar precios, tiers o productos con sus características. El array `services` no incluye precio ni lista de features.

**Solución propuesta**: Nueva sección nativa con cards de precios.

```json
"pricing": {
  "enabled": true,
  "plans": [
    {
      "id": "plan_1",
      "name": "Starter",
      "price": "$29",
      "period": "/mes",
      "description": "Perfecto para empezar",
      "features": ["50 presets", "Formato WAV 24bit", "Compatible con Serum", "Descarga inmediata"],
      "cta": "Comprar",
      "featured": false
    },
    {
      "id": "plan_2",
      "name": "Pro",
      "price": "$59",
      "period": "/mes",
      "description": "Para productores exigentes",
      "features": ["150 presets", "WAV + Serum presets", "Actualizaciones mensuales", "Soporte prioritario"],
      "cta": "Comprar",
      "featured": true
    }
  ]
},
"pricingTexts": {
  "sectionTag": "Planes",
  "heading": "Elegí tu Pack",
  "description": "Todos los planes incluyen actualizaciones gratuitas."
}
```

**Archivos a crear/modificar**:
- `src/features/landing/components/Pricing.tsx` — nuevo componente
- `src/lib/config/schema.ts` — agregar schemas de pricing
- `src/features/landing/components/LandingContainer.tsx` — importar y renderizar
- `config/landingdj.config.json` — agregar datos de ejemplo

**Consideraciones**:
- El card `featured` debe destacarse visualmente (border glow, badge "Más popular", etc.)
- El CTA del pricing envía al formulario de contacto o a un link externo configurable

---

## 8. Background personalizable por sección

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Medio | ⏳ Pendiente |

**Problema actual**: Todas las secciones usan el mismo color de fondo global `colors.background`. No hay forma de darle identidad visual distinta a cada sección.

**Solución propuesta**: Agregar configuración de fondo por sección.

```json
"hero": {
  "background": {
    "type": "gradient",
    "value": "radial-gradient(circle at 50% 50%, #1a1a2e, #09090b)"
  },
  ...
},
"services": {
  "background": {
    "type": "color",
    "value": "#0d0d14"
  },
  ...
},
"testimonials": {
  "background": {
    "type": "image",
    "value": "/images/testimonials-bg.jpg",
    "opacity": 0.1
  }
}
```

Tipos: `color`, `gradient`, `image`, `none`.

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar schema `SectionBackgroundSchema`
- Schemas de cada sección — agregar `background?: SectionBackground`
- Cada componente de sección — aplicar fondo dinámico

---

## 9. Campos de formulario configurables

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Medio | ⏳ Pendiente |

**Problema actual**: El formulario de contacto siempre tiene tres campos: name, email, message. No se pueden agregar campos adicionales (teléfono, fecha del evento, etc.) sin modificar código.

**Solución propuesta**: Reemplazar los campos fijos por un array de campos configurables.

```json
"contactForm": {
  "enabled": true,
  "fields": [
    { "type": "text", "name": "name", "label": "Nombre Completo *", "placeholder": "Ej. Carlos Mendoza", "required": true, "icon": "user" },
    { "type": "email", "name": "email", "label": "Correo de Contacto *", "placeholder": "Ej. carlos@email.com", "required": true, "icon": "mail" },
    { "type": "phone", "name": "phone", "label": "Teléfono", "placeholder": "+598 99 123 456", "required": false, "icon": "phone" },
    { "type": "date", "name": "eventDate", "label": "Fecha del Evento", "required": false, "icon": "calendar" },
    { "type": "textarea", "name": "message", "label": "Mensaje", "placeholder": "Contanos los detalles...", "required": false, "icon": "message-square" }
  ],
  ...
}
```

Tipos de campo: `text`, `email`, `phone`, `date`, `textarea`, `select`, `checkbox`.

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar `FormFieldSchema`
- `src/lib/config/schema.ts` — actualizar `ContactFormSchema`
- `src/features/landing/components/Contact.tsx` — refactorizar para renderizar campos dinámicamente
- `src/app/api/contact/route.ts` — actualizar validación para aceptar campos dinámicos
- `config/landingdj.config.json` — actualizar con campos dinámicos

**Consideraciones**:
- El API route debe validar campos dinámicos sin saber sus nombres de antemano
- Los datos enviados al provider de email deben incluir todos los campos
- Importante: mantener retrocompatibilidad con el formato actual

---

## 10. Layout variants por sección

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Medio | ⏳ Pendiente |

**Problema actual**: El layout de cada sección es fijo: Services es grid de 2 columnas, Equipment de 3, Gallery de 3, etc. No hay forma de cambiar la cantidad de columnas o el ancho del contenedor.

**Solución propuesta**: Agregar configuración de layout por sección.

```json
"services": {
  "layout": {
    "columns": 3,
    "width": "contained",
    "gap": "lg",
    "align": "center"
  },
  ...
},
"gallery": {
  "layout": {
    "columns": 4,
    "width": "full",
    "gap": "md"
  },
  ...
}
```

Parámetros:
- `columns`: `1 | 2 | 3 | 4`
- `width`: `"contained"` (max-w-7xl centrado) | `"full"` (ancho completo)
- `gap`: `"sm" | "md" | "lg"`
- `align`: `"left" | "center"`

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar `LayoutSchema`
- Schemas de secciones — agregar `layout?: LayoutSchema`
- Componentes de sección — aplicar columnas y estilos dinámicos

---

## 11. Dark/Light mode configurable

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🔵 Alta | Medio/Alto | ⏳ Pendiente |

**Problema actual**: La landing tiene un solo tema (dark actualmente). No hay soporte para tema claro ni toggle de modo.

**Solución propuesta**: Ampliar el sistema de colores para soportar temas duales con toggle opcional.

```json
"theme": {
  "mode": "dark",
  "dark": {
    "colors": {
      "primary": "#d4af37",
      "secondary": "#f4f4f5",
      "accent": "#9a3412",
      "background": "#09090b",
      "text": "#e4e4e7"
    }
  },
  "light": {
    "colors": {
      "primary": "#b8860b",
      "secondary": "#27272a",
      "accent": "#dc2626",
      "background": "#fafafa",
      "text": "#18181b"
    }
  }
}
```

Modos: `"dark"`, `"light"`, `"toggle"` (muestra un switch al usuario).

**Archivos a modificar**:
- `src/lib/config/schema.ts` — nuevo `ThemeSchema` con soporte dual
- `src/features/theme/components/ThemeProvider.tsx` — aplicar tema según modo y preferencia del usuario
- Nuevo componente `ThemeToggle.tsx` — switch dark/light
- `config/landingdj.config.json` — reestructurar colores

**Consideraciones**:
- Si `mode: "dark"` o `mode: "light"`, no mostrar toggle (comportamiento fijo)
- Si `mode: "toggle"`, mostrar switch y persistir preferencia en localStorage
- Todas las referencias a `colors.*` en los componentes deben leer del tema activo
- Alto impacto: toca el sistema de temas actual y todos los componentes

---

## 12. Secciones custom (bloques genéricos)

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🔵 Alta | Medio/Alto | ⏳ Pendiente |

**Problema actual**: No se puede agregar una sección que no exista como componente (ej. "Nuestro Equipo", "Proceso de Trabajo", "Clientes") sin escribir código React.

**Solución propuesta**: Agregar un array de secciones genéricas que se renderizan con componentes reutilizables.

```json
"customSections": [
  {
    "id": "cs_1",
    "type": "text-image",
    "title": "Nuestro Proceso",
    "description": "Creamos cada preset con dedicación artesanal...",
    "image": "/images/process.jpg",
    "layout": "image-left",
    "background": { "type": "color", "value": "#0d0d14" }
  },
  {
    "id": "cs_2",
    "type": "logo-cloud",
    "title": "Confían en nosotros",
    "logos": [
      { "src": "/images/client-1.png", "alt": "Cliente 1" },
      { "src": "/images/client-2.png", "alt": "Cliente 2" }
    ]
  },
  {
    "id": "cs_3",
    "type": "cta-banner",
    "title": "¿Listo para empezar?",
    "description": "Descargá el pack y transformá tu sonido hoy.",
    "cta": "Descargar Ahora",
    "ctaLink": "#contacto"
  }
]
```

Tipos de bloque: `text-image`, `logo-cloud`, `cta-banner`, `stats`, `feature-grid`, `text-only`.

**Archivos a crear/modificar**:
- `src/features/landing/components/CustomSectionRenderer.tsx` — nuevo componente que mapea `type` al bloque visual correcto
- `src/features/landing/components/blocks/` — carpeta con componentes de bloque (TextImageBlock, LogoCloudBlock, CTABannerBlock, etc.)
- `src/lib/config/schema.ts` — agregar `CustomSectionSchema`
- `src/features/landing/components/LandingContainer.tsx` — renderizar customSections
- `config/landingdj.config.json` — agregar ejemplo

**Consideraciones**:
- Cada bloque debe ser un componente React independiente
- El renderizador debe ser extensible: agregar un nuevo tipo = crear un nuevo componente + mapearlo
- Los bloques deben poder intercalarse entre las secciones nativas mediante `sectionOrder`

---

## 13. Separación del JSON en múltiples archivos de configuración

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Medio | ⏳ Pendiente |

**Problema actual**: Todo reside en `config/landingdj.config.json` (~215 líneas). A medida que crece, mezcla datos de identidad, visuales, contenido, textos, funcionalidad y SEO en un solo archivo.

**Solución propuesta**: Separar en archivos por categoría funcional:

```
config/
├── brand.json          # artisticName, slogan, description, logo, favicon
├── theme.json          # colors, typography
├── sections.json       # hero, services, gallery, videos, songs, faq, equipment
├── texts.json          # todos los *Texts
├── settings.json       # sectionOrder, contactForm, whatsapp, socials, destinationEmail
└── seo.json            # seo
```

**Archivos a modificar**:
- `src/lib/config/loader.ts` — leer N archivos y mergearlos con orden de prioridad
- `src/lib/config/schema.ts` — exponer schemas parciales por archivo + schema de merge final
- Documentación — actualizar rutas de archivos en README, CONFIG_GUIDE

**Consideraciones**:
- **Backwards compatibility**: Si solo existe `landingdj.config.json`, debe seguir funcionando sin cambios
- **Orden de merge**: Último archivo en ser leído sobrescribe campos duplicados
- **Validación**: Cada archivo debe validarse con Zod por separado, y también el merge final
- **No afecta a componentes**: Todos reciben el `LandingConfig` mergeado como ahora
- **Trigger para implementar**: Cuando el JSON supere ~500 líneas o haya 3+ motivos para editar un archivo sin tocar otros

---

## 14. Sección BioFondoOverlay 🆕

| Prioridad | Esfuerzo | Estado |
|-----------|----------|--------|
| 🟡 Media | Bajo | ⏳ Pendiente |

**Problema actual**: No existe una sección de presentación con imagen de fondo a full-width. `BioConFoto` usa layout Split Editorial (50/50), pero algunos artistas prefieren un diseño más dramático donde la imagen ocupa todo el ancho.

**Solución propuesta**: Nueva sección `bio_fondo_overlay` con imagen de fondo a full-width y texto superpuesto en un panel semitransparente con backdrop-blur.

**Estructura conceptual**:
```
<section id="bio-fondo-overlay">
  <img full-width object-cover />
  <div overlay absolute inset-0 />
  <div card backdrop-blur centered>
    <sectionTag />
    <h2 heading />
    <divider />
    <p description />
  </div>
</section>
```

**Config** (comparte esquema con `BioConFoto`):
```json
"bioFondoOverlay": {
  "type": "image",
  "url": "/images/fondo-presentacion.jpg"
},
"bioFondoOverlayTexts": {
  "sectionTag": "Presentación",
  "heading": "",
  "description": ""
}
```

**Archivos a modificar**:
- `src/lib/config/schema.ts` — agregar `bio_fondo_overlay` a `SECTION_IDS`, crear schemas
- `src/features/landing/components/BioFondoOverlay.tsx` — nuevo componente
- `src/features/landing/components/LandingContainer.tsx` — registrar
- `src/features/landing/components/Navbar.tsx` — agregar nav entry
- `config/landingdj.config.json` — agregar data

**Alternativa**: Unificar con `BioConFoto` usando un token `layout: 'split' | 'overlay'` en el preset, de modo que ambos diseños compartan el mismo schema de datos y solo cambie el renderizado.

---

## Roadmap sugerido

| Fase | Ideas | Enfoque | Progreso |
|------|-------|---------|----------|
| **Fase 1** | 1, 2, 3, 4, 5 | Bajo esfuerzo, alto impacto inmediato en dinamismo | 1/5 ✅ |
| **Fase 2** | 6, 7, 8, 9, 10, 14 | Nuevas secciones y flexibilidad visual media | 0/6 ⏳ |
| **Fase 3** | 11, 12, 13 | Alto impacto pero requieren refactor mayor | 0/3 ⏳ |

---

## Criterios para evaluar nuevas ideas

Una mejora debería considerarse si cumple al menos dos de estos criterios:

- [ ] Agrega flexibilidad significativa al JSON sin comprometer la simplicidad
- [ ] Mantiene o mejora la seguridad (especialmente en manejo de datos de usuario)
- [ ] Es compatible con el patrón Provider y la arquitectura desacoplada existente
- [ ] No introduce dependencias externas pesadas
- [ ] Resuelve un caso de uso real documentado
- [ ] Es retrocompatible (no rompe configuraciones existentes)
