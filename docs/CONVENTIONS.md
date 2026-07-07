# 📜 Convenciones Técnicas — StageKit Core / LandingDJ

Este documento establece las directrices oficiales de desarrollo, estilos de código, principios arquitectónicos y estándares prácticos para **StageKit Core** y la suite de productos de **LandingDJ**. Toda contribución posterior (realizada por desarrolladores humanos o asistentes de Inteligencia Artificial) debe seguir rigurosamente estas reglas.

---

## 🏛️ 1. Principios Arquitectónicos Fundamentales

1. **Declarativo y Guiado por Configuración (Config-Driven):**
   Toda sección visual o funcionalidad en el frontend de LandingDJ debe renderizarse basándose en el estado estructurado del archivo `public/config/landingdj.config.json`. Si una sección no tiene datos o está desactivada en la configuración, no debe renderizarse ni causar saltos de diseño (Layout Shifts).
2. **Fail-Safe y Fail-Fast Server-Side:**
   La configuración se valida de forma estricta en el servidor con **Zod** antes de renderizar la página. Si el JSON es inválido, el sistema no debe explotar de manera silenciosa ni colapsar con pantallas en blanco; en su lugar, se renderizará un contenedor de error educativo detallado describiendo exactamente qué campo falló.
3. **Separación de Responsabilidades Estricta:**
   - **Orquestador (`src/app/page.tsx`):** Carga de datos del lado del servidor, resolución de SEO nativo y manejo de fallbacks críticos.
   - **Contenedor UI (`src/features/landing/components/LandingContainer.tsx`):** Gestión de estructura visual y envoltura de temas.
   - **Lógica de Dominio (`src/lib/`):** Utilidades puras, cargadores de configuración y servicios desacoplados de infraestructura (ej. emails).
   - **Presentación y Componentes (`src/features/landing/components/`):** Shells puros de UI que reciben datos listos mediante props fuertemente tipados.

---

## 📂 2. Estructura de Carpetas

Adoptamos una organización híbrida basada en **Features** para el desarrollo de módulos visuales específicos, y carpetas globales **Lib/Core** para utilidades transversales.

```text
/
├── public/
│   └── config/
│       └── landingdj.config.json   # Archivo único de configuración de la landing
├── src/
│   ├── app/                        # Rutas de Next.js App Router (Páginas y API Routes)
│   │   ├── api/
│   │   │   └── contact/            # Endpoint modular de procesamiento de leads
│   │   ├── layout.tsx              # Layout raíz (manejo dinámico de Google Fonts)
│   │   └── page.tsx                # Orquestador del Server Component principal
│   ├── features/                   # Módulos encapsulados de negocio y UI
│   │   ├── landing/
│   │   │   └── components/         # Secciones de la landing (Hero, Bio, Contact, etc.)
│   │   └── theme/
│   │       └── components/         # Inyección declarativa de estilos de diseño
│   └── lib/                        # Núcleo y lógica agnóstica reutilizable
│       ├── config/                 # Esquemas Zod y cargadores seguros
│       └── email/                  # Abstracción desacoplada de despacho de correos
└── docs/                           # Documentación de arquitectura y ciclo de vida
```

---

## 🏷️ 3. Nomenclatura e Identificadores

- **Carpetas y Archivos no-componentes:** Utilizar camelCase o kebab-case (ej. `schema.ts`, `landingdj.config.json`, `route.ts`).
- **Componentes React:** Utilizar PascalCase (ej. `LandingContainer.tsx`, `Hero.tsx`).
- **Nombres de Interfaces y Tipos:** Utilizar PascalCase y evitar prefijos redundantes como `I` (ej. `EmailMessage`, `LandingConfig`).
- **Identificadores HTML (IDs):** Todo elemento semántico relevante (sección, formulario de contacto, botones principales, cards) **MUST** poseer un atributo `id` descriptivo para posibilitar accesibilidad, targeting por CSS variables y futuras pruebas automatizadas.

---

## 💅 4. Estilos y Sistema de Temas (Theming)

- **Cero CSS en línea para estilos visuales:** Todo el diseño se resuelve con clases de **Tailwind CSS**.
- **Inyección Segura de Variables:** Está prohibido inyectar bloques de estilo mediante tags `<style>` directos en strings con `dangerouslySetInnerHTML` dentro de las secciones para colorear la página. Toda variable dinámica (colores, fuentes tipográficas) debe inyectarse a través del objeto `style` inline del componente `ThemeProvider` en el nodo raíz:
  ```tsx
  const themeStyles = {
    '--color-primary': colors.primary,
    '--font-heading': typography.heading,
  } as React.CSSProperties;
  ```
- **Catálogo de Fuentes Estricto:** Solo se pueden proponer o usar fuentes registradas y validadas en el arreglo `ALLOWED_FONTS` de `schema.ts`. Esto protege el renderizado y permite que `layout.tsx` descargue únicamente las familias deseadas.

---

## ✉️ 5. Abstracción del Servicio de Email

- Ningún componente visual ni API Route debe acoplarse a un SDK de terceros (Resend, SendGrid, SMTP, etc.).
- La transmisión de leads se delega exclusivamente a `emailService` mediante un contrato común (`EmailProvider`).
- Toda nueva implementación de email debe heredar e implementar el contrato `EmailProvider` definido en `src/lib/email/types.ts`.
- La fábrica `createEmailProvider()` es el único punto encargado de resolver e instanciar el adaptador según la variable de entorno `EMAIL_PROVIDER`.

---

## 📝 6. Estándares de TypeScript y Comentarios

- **Tipado estricto:** Prohibido el uso de `any` injustificado. Si se requiere tipado dinámico, se deben utilizar genéricos o estructuras desconocidas (`unknown`).
- **Validaciones en Tiempo de Ejecución:** Toda entrada de datos externa (como payloads de formularios REST en API Routes) debe validarse usando schemas de **Zod** o validaciones de tipo explícitas con respuestas HTTP adecuadas (`400 Bad Request`).
- **Documentación en Código (JSDoc):** Todo archivo nuevo, función exportada o componente semántico importante debe incluir comentarios descriptivos en formato JSDoc detallando su propósito y responsabilidades.

---

## 🤖 7. Reglas Prácticas para Futuras Inteligencias Artificiales (IAs)

Cuando operes en el proyecto StageKit Core / LandingDJ, debes:
1. **Verificar antes de Crear:** Ejecutar la carga y validación para asegurar que el entorno compile con `npm run lint` y `npm run build` tras realizar cualquier alteración.
2. **Respetar la Fundación:** No modifiques ni reinventes la validación por configuración basada en Zod ni el cargador de `src/lib/config/loader.ts`.
3. **No Agregar Ruido:** Evita inyectar elementos visuales, animaciones o dependencias que el usuario no haya solicitado de manera estricta y literal.
