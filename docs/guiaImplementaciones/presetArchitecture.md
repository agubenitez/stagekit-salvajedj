# Arquitectura de Design Presets — Guía de Implementación

> **Propósito:** Este documento es una guía completa para implementar el sistema de Design Presets con auto-descubrimiento en cualquier proyecto StageKit / LandingDJ. Está diseñado para que cualquier modelo de IA o desarrollador pueda replicar la implementación exacta en múltiples proyectos de forma consistente.
>
> **Audiencia:** Desarrolladores e inteligencias artificiales que implementan o mantienen el sistema de presets.
>
> **Principio fundamental:** Crear un preset nuevo = crear **1 archivo**. Cero registro manual, cero imports adicionales, cero barrel files.

---

## 1. Arquitectura: Auto-Descubrimiento

### Cómo funciona

El sistema utiliza `require.context` de webpack para escanear automáticamente todos los archivos `.ts` dentro de `src/features/theme/presets/` y registrarlos como presets disponibles. No existe un barrel file manual ni un registro explícito.

```
Flujo de auto-descubrimiento:

  1. Crea presets/barbie-pink.ts con export default
           ↓
  2. require.context escanea presets/*.ts
           ↓
  3. DESIGN_PRESETS['barbie-pink'] queda disponible
           ↓
  4. loader.ts resuelve el preset desde el JSON config
           ↓
  5. ThemeProvider inyecta los tokens como CSS variables
```

### Por qué auto-descubrimiento

La creación de presets es una tarea **diaria** en este proyecto. Se esperan decenas (eventualmente 50+) de presets. Cualquier mecanismo de registro manual (barrel files, imports explícitos) se convierte en un cuello de botella y una fuente de errores cuando se hace con esta frecuencia.

Con auto-descubrimiento, el proceso de crear un preset es:

1. Copiar el template
2. Modificar los valores
3. Guardar

No hay paso 4. No hay segundo archivo que actualizar.

### Tradeoffs aceptados

| Tradeoff | Por qué se acepta |
|----------|-------------------|
| `require.context` es webpack-specific | El proyecto usa Next.js con webpack. Si se migra a otro bundler, el cambio es en 1 archivo (`registry.ts`). |
| El orden de keys no es determinista | `DESIGN_PRESETS` es un lookup por clave. El orden no importa. |
| Sin validación runtime de archivos malformados | `satisfies DesignPreset` cubre compile-time. TypeScript avisa si falta un campo. |

### Equivalencia para otros bundlers

| Bundler | API equivalente |
|---------|-----------------|
| **Webpack** (Next.js default) | `require.context(directory, useSubdirectories, regExp)` |
| **Vite** | `import.meta.glob(directory, { eager: true })` |
| **Turbopack** | Soporta `require.context` por compatibilidad con webpack |

---

## 2. Estructura de Archivos

```
src/features/theme/
├── types.ts                          # Interfaces DesignTokens y DesignPreset
├── utils.ts                          # Función hexToRgba
├── presets/
│   ├── index.ts                      # Auto-descubrimiento (require.context)
│   ├── gold.ts                       # Preset gold
│   ├── neon.ts                       # Preset neon
│   ├── slate.ts                      # Preset slate
│   ├── frost.ts                      # Preset frost
│   ├── sienna.ts                     # Preset sienna
│   ├── vapor.ts                      # Preset vapor
│   ├── ember.ts                      # Preset ember
│   ├── pearl.ts                      # Preset pearl
│   ├── barbie.ts                     # Preset barbie
│   ├── barbie-dark.ts                # Preset barbie-dark
│   ├── barbie-blue.ts                # Preset barbie-blue
│   ├── salvaje.ts                    # Preset SalvajeDjPreset
│   └── _template.ts                  # Template vacío (excluido del registro)
└── components/
    └── ThemeProvider.tsx              # Inyección de CSS variables
```

### Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---------|----------------|
| `types.ts` | Define las interfaces `DesignTokens` (~75 campos) y `DesignPreset` (colors + typography + tokens). Es la fuente de verdad de la forma de un preset. |
| `utils.ts` | Contiene `hexToRgba()`, utilidad para convertir hex + alpha a `rgba()`. Usada por `ThemeProvider.tsx`. |
| `presets/index.ts` | Escanea `presets/*.ts` con `require.context`, registra todos los presets en `DESIGN_PRESETS`, exporta `PRESET_KEYS` para validación. |
| `presets/*.ts` | Cada archivo define **un solo preset** con `export default` y `satisfies DesignPreset`. |
| `presets/_template.ts` | Template vacío para copy-paste. Archivos que empiezan con `_` están excluidos del auto-descubrimiento. |

---

## 3. Implementación Paso a Paso

### 3.1. `src/features/theme/types.ts`

Este archivo define las interfaces que cada preset debe implementar.

```typescript
import { type ColorsConfig, type TypographyConfig } from '@/lib/config/schema';

/**
 * Tokens de diseño que controlan la apariencia visual de cada componente.
 * Cada preset debe definir TODOS los campos requeridos.
 * Los campos opcionales (marcados con ?) permiten variaciones sin forzar valores.
 */
export interface DesignTokens {
  // ─── Botones ────────────────────────────────────
  btnPrimaryBg: string;
  btnPrimaryBgAlpha?: number;           // 0-1, opacidad del fondo del botón primario
  btnPrimaryText: string;
  btnPrimaryRadius: string;
  btnPrimaryShadow: string;
  btnPrimaryHoverBg: string;
  btnPrimaryHoverShadow: string;
  btnPrimaryHoverScale: string;
  btnSecondaryBg: string;
  btnSecondaryText: string;
  btnSecondaryHoverBg: string;

  // ─── Cards ──────────────────────────────────────
  cardBg: string;
  cardBgHover: string;
  cardBgRaised: string;
  cardBorder: string;
  cardBorderHover: string;
  cardRadius: string;
  cardShadow: string;
  cardHoverTransform: string;
  cardHoverShadow: string;
  cardLeftBorder: string;

  // ─── Secciones ──────────────────────────────────
  sectionBg: string;
  sectionBgMid: string;
  sectionBgAlt: string;

  // ─── Inputs ─────────────────────────────────────
  inputBg: string;
  inputBorder: string;
  inputRadius: string;
  inputText: string;
  inputPlaceholder: string;
  inputFocusBorder: string;
  inputFocusRing: string;

  // ─── Badges ─────────────────────────────────────
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeRadius: string;

  // ─── Navbar ─────────────────────────────────────
  navbarBg: string;
  navbarBorder: string;
  navbarText: string;
  navbarHoverText: string;
  navbarBlur: string;
  navbarShadowColor: string;

  // ─── Selección ──────────────────────────────────
  selectionBg: string;
  selectionText: string;

  // ─── Texto ──────────────────────────────────────
  textMuted: string;
  headingColor: string;
  textLabelColor: string;
  textSecondaryColor: string;

  // ─── Overlays ───────────────────────────────────
  overlayColor: string;
  overlayMidColor: string;
  overlayStrongColor: string;
  overlayFaintColor: string;

  // ─── Estado ─────────────────────────────────────
  successColor: string;
  errorColor: string;

  // ─── Hero ───────────────────────────────────────
  heroBg: string;
  fontWeightHeading: string;
  letterSpacingTag: string;
  letterSpacingCta: string;
  sectionPaddingY: string;
  sectionHeaderGap: string;

  // ─── Hero Title ─────────────────────────────────
  heroTitleSizeTop: string;
  heroTitleSizeMiddle: string;
  heroTitleSizeBottom: string;
  heroTitleSizeFourth: string;
  heroTitleOpacityTop: string;
  heroTitleOpacityMiddle: string;
  heroTitleOpacityBottom: string;
  heroTitleOpacityFourth: string;
  heroTitleTextShadowTop: string;
  heroTitleTextShadowMiddle: string;
  heroTitleTextShadowBottom: string;
  heroTitleTextShadowFourth: string;
  heroTitleDrift: string;

  // ─── Layout Flags ───────────────────────────────
  bioConFotoLayout?: string;            // 'image-left' | 'image-right'
  musicSoundCloudVisual?: boolean;
}

/**
 * Estructura completa de un preset de diseño.
 * Combina colores semánticos, tipografía y tokens de componentes.
 */
export interface DesignPreset {
  colors: ColorsConfig;
  typography: TypographyConfig;
  tokens: DesignTokens;
}
```

### 3.2. `src/features/theme/utils.ts`

```typescript
/**
 * Convierte un color hexadecimal + alpha a formato rgba().
 * Usado por ThemeProvider para el fondo del botón primario con transparencia.
 *
 * @param hex - Color en formato "#RRGGBB" o "#RGB"
 * @param alpha - Opacidad de 0 a 1
 * @returns String en formato "rgba(r,g,b,alpha)"
 */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
```

### 3.3. `src/features/theme/presets/index.ts`

Este es el archivo clave del auto-descubrimiento. Escanea el directorio y registra automáticamente todos los presets.

```typescript
import type { DesignPreset } from '../types';

/**
 * Auto-descubrimiento de presets via require.context (webpack).
 *
 * Escanea todos los archivos .ts en este directorio EXCEPTO:
 * - index.ts (este archivo)
 * - Archivos que empiezan con _ (templates, utilidades)
 * - Archivos ocultos que empiezan con .
 *
 * Cada archivo debe tener un export default que implemente DesignPreset.
 */
const presetContext = (require as any).context(
  './',           // Directorio: el actual (presets/)
  false,          // No buscar en subdirectorios
  /^\.\/(?!index|_|\.).*\.ts$/   // Solo archivos .ts que no sean index, _*, o .*
);

export const DESIGN_PRESETS: Record<string, DesignPreset> = {};

presetContext.keys().forEach((key: string) => {
  // key tiene formato "./gold.ts" → extraer "gold"
  const name = key.replace('./', '').replace('.ts', '');
  const module = presetContext(key);

  if (module.default) {
    DESIGN_PRESETS[name] = module.default;
  }
});

/**
 * Keys válidas de presets disponibles.
 * Usado para validación en schema.ts (z.enum).
 */
export const PRESET_KEYS = Object.keys(DESIGN_PRESETS) as [string, ...string[]];
```

**Explicación de la regex** `/^\.\/(?!index|_|\.).*\.ts$/`:

| Parte | Significado |
|-------|-------------|
| `^\.\/` | Empieza con `./` (formato de `require.context`) |
| `(?!index\|_\|\.)` | Negative lookahead: NO sigue con `index`, `_`, ni `.` |
| `.*\.ts$` | Cualquier cosa que termine en `.ts` |

Archivos excluidos:
- `index.ts` → es el registry mismo
- `_template.ts` → template, no preset real
- `.gitkeep.ts` → archivos ocultos

### 3.4. Ejemplo real: `src/features/theme/presets/gold.ts`

```typescript
import type { DesignPreset } from '../types';

/**
 * Preset Gold — Luxury warm theme.
 * Primary: #d4af37 (gold), Font: Outfit, Dark background.
 */
const gold = {
  colors: {
    primary: '#d4af37',
    secondary: '#f4f4f5',
    accent: '#9a3412',
    background: '#09090b',
    text: '#e4e4e7',
  },
  typography: {
    heading: 'Outfit',
    body: 'Inter',
  },
  tokens: {
    btnPrimaryBg: '#d4af37',
    btnPrimaryBgAlpha: 0.85,
    btnPrimaryText: '#09090b',
    btnPrimaryRadius: '0.75rem',
    btnPrimaryShadow: '0 10px 15px -3px rgba(212,175,55,0.2)',
    btnPrimaryHoverBg: '#c49f2f',
    btnPrimaryHoverShadow: '0 10px 15px -3px rgba(212,175,55,0.4)',
    btnPrimaryHoverScale: '1.03',
    btnSecondaryBg: '#262626',
    btnSecondaryText: '#ffffff',
    btnSecondaryHoverBg: '#404040',
    cardBg: 'rgba(24,24,27,0.45)',
    cardBgHover: 'rgba(24,24,27,0.60)',
    cardBgRaised: 'rgba(24,24,27,0.55)',
    cardBorder: 'rgba(38,38,38,0.80)',
    cardBorderHover: 'rgba(255,255,255,0.12)',
    cardRadius: '1rem',
    cardShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    cardHoverTransform: 'none',
    cardHoverShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    cardLeftBorder: '1px solid rgba(38,38,38,0.80)',
    sectionBg: '#0a0a0a',
    sectionBgMid: 'rgba(10,10,10,0.60)',
    sectionBgAlt: 'rgba(23,23,23,0.10)',
    inputBg: 'rgba(9,9,11,0.70)',
    inputBorder: '#262626',
    inputRadius: '0.75rem',
    inputText: '#ffffff',
    inputPlaceholder: 'rgba(255,255,255,0.25)',
    inputFocusBorder: 'var(--theme-primary)',
    inputFocusRing: 'rgba(212,175,55,0.2)',
    badgeBg: 'rgba(212,175,55,0.10)',
    badgeText: 'var(--theme-primary)',
    badgeBorder: 'rgba(212,175,55,0.25)',
    badgeRadius: '9999px',
    navbarBg: 'rgba(9,9,11,0.90)',
    navbarBorder: 'rgba(38,38,38,0.80)',
    navbarText: '#a1a1aa',
    navbarHoverText: 'var(--theme-primary)',
    selectionBg: 'var(--theme-primary)',
    selectionText: '#09090b',
    textMuted: '#a1a1aa',
    headingColor: '#ffffff',
    textLabelColor: '#d4d4d4',
    textSecondaryColor: '#a1a1aa',
    overlayColor: '#0a0a0a',
    overlayMidColor: 'rgba(10,10,10,0.60)',
    overlayStrongColor: 'rgba(10,10,10,0.80)',
    overlayFaintColor: 'rgba(10,10,10,0.20)',
    navbarShadowColor: 'rgba(0,0,0,0.20)',
    successColor: '#34d399',
    errorColor: '#f87171',
    heroBg: '#000000',
    fontWeightHeading: '900',
    letterSpacingTag: '0.125em',
    letterSpacingCta: '0.1em',
    sectionPaddingY: '5rem',
    sectionHeaderGap: '3rem',
    navbarBlur: '12px',
    heroTitleSizeTop: 'clamp(2rem, 5vw, 4rem)',
    heroTitleSizeMiddle: 'clamp(2rem, 5vw, 4rem)',
    heroTitleSizeBottom: 'clamp(2rem, 5vw, 4rem)',
    heroTitleSizeFourth: 'clamp(2rem, 5vw, 4rem)',
    heroTitleOpacityTop: '1',
    heroTitleOpacityMiddle: '1',
    heroTitleOpacityBottom: '1',
    heroTitleOpacityFourth: '1',
    heroTitleTextShadowTop: '0 0 25px var(--theme-primary)',
    heroTitleTextShadowMiddle: '0 0 25px var(--theme-primary)',
    heroTitleTextShadowBottom: '0 0 25px var(--theme-primary)',
    heroTitleTextShadowFourth: '0 0 25px var(--theme-primary)',
    heroTitleDrift: '0,0,0,0',
    bioConFotoLayout: 'image-left',
    musicSoundCloudVisual: true,
  },
} satisfies DesignPreset;

export default gold;
```

### 3.5. Template vacío: `src/features/theme/presets/_template.ts`

Este archivo está excluido del auto-descubrimiento (empieza con `_`). Se usa como punto de partida para crear presets nuevos.

```typescript
import type { DesignPreset } from '../types';

/**
 * Preset [NOMBRE] — [DESCRIPCIÓN BREVE].
 * Primary: #[COLOR], Font: [FUENTE], [Dark/Light] background.
 */
const [NOMBRE] = {
  colors: {
    primary: '#',
    secondary: '#',
    accent: '#',
    background: '#',
    text: '#',
  },
  typography: {
    heading: '',    // Ver ALLOWED_FONTS en schema.ts
    body: '',       // Ver ALLOWED_FONTS en schema.ts
  },
  tokens: {
    // ─── Botones ────────────────────────────────
    btnPrimaryBg: '',
    btnPrimaryBgAlpha: 1,              // 0-1, omitir si no hay transparencia
    btnPrimaryText: '',
    btnPrimaryRadius: '',
    btnPrimaryShadow: '',
    btnPrimaryHoverBg: '',
    btnPrimaryHoverShadow: '',
    btnPrimaryHoverScale: '',
    btnSecondaryBg: '',
    btnSecondaryText: '',
    btnSecondaryHoverBg: '',

    // ─── Cards ──────────────────────────────────
    cardBg: '',
    cardBgHover: '',
    cardBgRaised: '',
    cardBorder: '',
    cardBorderHover: '',
    cardRadius: '',
    cardShadow: '',
    cardHoverTransform: '',
    cardHoverShadow: '',
    cardLeftBorder: '',

    // ─── Secciones ──────────────────────────────
    sectionBg: '',
    sectionBgMid: '',
    sectionBgAlt: '',

    // ─── Inputs ─────────────────────────────────
    inputBg: '',
    inputBorder: '',
    inputRadius: '',
    inputText: '',
    inputPlaceholder: '',
    inputFocusBorder: '',
    inputFocusRing: '',

    // ─── Badges ─────────────────────────────────
    badgeBg: '',
    badgeText: '',
    badgeBorder: '',
    badgeRadius: '',

    // ─── Navbar ─────────────────────────────────
    navbarBg: '',
    navbarBorder: '',
    navbarText: '',
    navbarHoverText: '',
    navbarBlur: '',
    navbarShadowColor: '',

    // ─── Selección ──────────────────────────────
    selectionBg: '',
    selectionText: '',

    // ─── Texto ──────────────────────────────────
    textMuted: '',
    headingColor: '',
    textLabelColor: '',
    textSecondaryColor: '',

    // ─── Overlays ───────────────────────────────
    overlayColor: '',
    overlayMidColor: '',
    overlayStrongColor: '',
    overlayFaintColor: '',

    // ─── Estado ─────────────────────────────────
    successColor: '',
    errorColor: '',

    // ─── Hero ───────────────────────────────────
    heroBg: '',
    fontWeightHeading: '',
    letterSpacingTag: '',
    letterSpacingCta: '',
    sectionPaddingY: '',
    sectionHeaderGap: '',

    // ─── Hero Title ─────────────────────────────
    heroTitleSizeTop: '',
    heroTitleSizeMiddle: '',
    heroTitleSizeBottom: '',
    heroTitleSizeFourth: '',
    heroTitleOpacityTop: '',
    heroTitleOpacityMiddle: '',
    heroTitleOpacityBottom: '',
    heroTitleOpacityFourth: '',
    heroTitleTextShadowTop: '',
    heroTitleTextShadowMiddle: '',
    heroTitleTextShadowBottom: '',
    heroTitleTextShadowFourth: '',
    heroTitleDrift: '',

    // ─── Layout Flags (opcionales) ──────────────
    // bioConFotoLayout: 'image-left',
    // musicSoundCloudVisual: true,
  },
} satisfies DesignPreset;

export default [NOMBRE];
```

---

## 4. Reglas para Crear Presets Nuevos

### Checklist de creación

```
[ ] 1. Copiar _template.ts → [nombre-del-preset].ts
[ ] 2. Renombrar la constante y el export default
[ ] 3. Llenar colors (5 colores HEX)
[ ] 4. Llenar typography (heading y body de ALLOWED_FONTS)
[ ] 5. Llenar TODOS los tokens (usar un preset existente como referencia)
[ ] 6. Agregar JSDoc descriptivo al inicio del archivo
[ ] 7. Verificar que el archivo tiene export default
[ ] 8. Verificar que usa `satisfies DesignPreset`
[ ] 9. Ejecutar npm run lint (tsc --noEmit)
[ ] 10. Ejecutar npm run build
```

### Convenciones de nombres

| Aspecto | Regla | Ejemplo |
|---------|-------|---------|
| Nombre del archivo | kebab-case, sin espacios ni mayúsculas | `barbie-pink.ts` |
| Nombre de la constante | camelCase | `const barbiePink = ...` |
| Export default | Igual que la constante | `export default barbiePink` |
| Key en config JSON | Igual que el nombre del archivo (sin .ts) | `"designPreset": "barbie-pink"` |

**Excepción:** Presets existentes con nombres legacy (ej. `SalvajeDjPreset`) se mantienen como están. El archivo se nombra `salvaje.ts` y el barrel lo mapea como `'SalvajeDjPreset': salvaje`.

### Fuentes permitidas

Solo se pueden usar fuentes del arreglo `ALLOWED_FONTS` en `schema.ts`:

```
Inter, Space Grotesk, Outfit, Playfair Display, JetBrains Mono,
Fira Code, Montserrat, Plus Jakarta Sans, DM Sans, DM Serif Display
```

### Qué NO hacer

- **NO** crear archivos sin `export default` — el auto-descubrimiento los ignora silenciosamente.
- **NO** olvidar `satisfies DesignPreset` — sin esto, TypeScript no valida la forma del objeto.
- **NO** usar mayúsculas en nombres de archivo — genera inconsistencia con el lookup.
- **NO** crear subdirectorios dentro de `presets/` — `require.context` no busca recursivamente.
- **NO** agregar el preset a un barrel o registro manual — el auto-descubrimiento lo maneja.
- **NO** usar colores que no sean HEX en `colors` — el schema Zod valida `#RRGGBB`.

---

## 5. Consumidores: Archivos que Cambian

Solo **3 archivos** consumen desde `designPresets.ts`. Todos deben actualizar sus imports.

### 5.1. `src/lib/config/loader.ts`

**Antes:**
```typescript
import { DESIGN_PRESETS } from '@/features/theme/designPresets';
```

**Después:**
```typescript
import { DESIGN_PRESETS } from '@/features/theme/presets';
```

El resto del archivo no cambia. `DESIGN_PRESETS` sigue siendo el mismo `Record<string, DesignPreset>`.

### 5.2. `src/lib/config/schema.ts`

**Antes:**
```typescript
import type { DesignTokens } from '@/features/theme/designPresets';
```

**Después:**
```typescript
import type { DesignTokens } from '@/features/theme/types';
```

Opcionalmente, se puede mejorar la validación de `designPreset` usando `PRESET_KEYS`:

**Antes:**
```typescript
designPreset: z.string().min(1, 'Debes seleccionar un designPreset (ej: "gold")'),
```

**Después (opcional):**
```typescript
import { PRESET_KEYS } from '@/features/theme/presets';
// ...
designPreset: z.enum(PRESET_KEYS, {
  errorMap: () => ({
    message: `Preset no válido. Disponibles: ${PRESET_KEYS.join(', ')}`,
  }),
}),
```

### 5.3. `src/features/theme/components/ThemeProvider.tsx`

**Antes:**
```typescript
import { hexToRgba, type DesignTokens } from '../designPresets';
```

**Después:**
```typescript
import { hexToRgba } from '../utils';
import type { DesignTokens } from '../types';
```

---

## 6. Migración desde Archivo Monolítico

Si el proyecto tiene un archivo `designPresets.ts` con todos los presets juntos, seguir este orden exacto:

### Paso 1: Crear archivos nuevos (sin eliminar nada)

```
1. Crear src/features/theme/types.ts      (interfaces)
2. Crear src/features/theme/utils.ts      (hexToRgba)
3. Crear src/features/theme/presets/index.ts  (auto-descubrimiento)
4. Crear src/features/theme/presets/_template.ts  (template)
5. Crear un archivo por cada preset existente en src/features/theme/presets/
```

### Paso 2: Actualizar imports en consumidores

```
1. Actualizar loader.ts
2. Actualizar schema.ts
3. Actualizar ThemeProvider.tsx
```

### Paso 3: Verificar

```bash
npm run lint      # tsc --noEmit — debe compilar sin errores
npm run build     # Build completo — debe completar sin errores
```

### Paso 4: Eliminar el archivo antiguo

```
Eliminar src/features/theme/designPresets.ts
```

### Paso 5: Verificar nuevamente

```bash
npm run lint
npm run build
```

**Regla:** Si en algún paso el build falla, NO eliminar el archivo antiguo hasta que todo compile correctamente.

---

## 7. Validación

### Comandos obligatorios post-implementación

| Comando | Qué valida | Cuándo correrlo |
|---------|------------|-----------------|
| `npm run lint` | Type-check con `tsc --noEmit`. Detecta imports rotos, tipos faltantes, campos inexistentes. | Después de cada cambio |
| `npm run build` | Build completo de Next.js. Detecta problemas de webpack, bundle, renderizado. | Después de migrar o crear preset |

### Errores comunes y cómo resolverlos

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module '@/features/theme/designPresets'` | Import apunta al archivo viejo que fue eliminado | Actualizar ruta a `@/features/theme/presets` o `@/features/theme/types` |
| `Property 'X' is missing in type` | Un preset no tiene todos los campos requeridos de `DesignTokens` | Agregar el campo faltante al preset. Usar `_template.ts` como referencia. |
| `Module not found: Can't resolve './presets'` | El directorio `presets/` no existe o `index.ts` no está ahí | Verificar que `src/features/theme/presets/index.ts` existe |
| `require.context is not defined` | El entorno no soporta `require.context` (no-webpack) | Verificar que se usa webpack/Next.js. Para Vite, usar `import.meta.glob`. |
| `DESIGN_PRESETS is empty` | Ningún preset fue registrado | Verificar que los archivos `.ts` en `presets/` tienen `export default` |
| `Preset "X" no encontrado` | El nombre en el JSON no coincide con el nombre del archivo | El nombre del archivo (sin `.ts`) ES la key. Verificar que coinciden exactamente. |

---

## 8. Referencia Rápida: Flujo de Datos

```
landingdj.config.json
  └─ "designPreset": "barbie-dark"
          ↓
  loader.ts: DESIGN_PRESETS["barbie-dark"]
          ↓
  Retorna { colors, typography, tokens }
          ↓
  ThemeProvider.tsx
          ↓
  CSS Variables: --theme-primary, --btn-primary-bg, etc.
          ↓
  Componentes usan: bg-[var(--btn-primary-bg)], text-[var(--heading-color)]
```

---

## 9. Portabilidad a Otros Bundlers

Si el proyecto migra de webpack a otro bundler, actualizar **solo** `src/features/theme/presets/index.ts`:

### Vite

```typescript
import type { DesignPreset } from '../types';

const presetModules = import.meta.glob<{ default: DesignPreset }>('./*.ts', { eager: true });

export const DESIGN_PRESETS: Record<string, DesignPreset> = {};

for (const [path, mod] of Object.entries(presetModules)) {
  if (path === './index.ts') continue;
  const name = path.replace('./', '').replace('.ts', '');
  DESIGN_PRESETS[name] = mod.default;
}

export const PRESET_KEYS = Object.keys(DESIGN_PRESETS) as [string, ...string[]];
```

### Turbopack (Next.js)

Turbopack soporta `require.context` por compatibilidad con webpack. No se requiere cambios.

---

> **Fin del documento.** Para implementar, seguir el orden de la Sección 6 (Migración) y validar con los comandos de la Sección 7.
