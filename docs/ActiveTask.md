# ActiveTask — Nuevo preset "SalvajeDjPreset"

## Objetivo
Crear un preset temático universo/galaxia con tonos violetas intensos, sin bordes luminosos, minimalista y elegante, diseñado exclusivamente para SalvajeDj.

## Estado actual
- **Completado**: Preset `SalvajeDjPreset` en `designPresets.ts`
  - Paleta renovada: primary `#7c3aed` (violet-600), secondary `#6366f1` (indigo-500), accent `#c026d3` (fuchsia-600), fondo `#050815`
  - Tipografía: Space Grotesk (headings) + Inter (body)
  - Botones con 80% opacity (`btnPrimaryBgAlpha: 0.8`) y sombra con tinte violeta
  - `cardLeftBorder: 'none'` — sin borde izquierdo en cards
  - `navbarText: '#c8c4e0'` — texto de navbar visible
  - `badgeText: '#f0eeff'` + `badgeBg` más opaco — badge del hero visible
  - Secciones sin alternancia marcada, fondos sutiles
  - Navbar transparente con blur 16px

## Archivos modificados
- `src/features/theme/designPresets.ts` — nuevo preset + eliminación de gold duplicado
- `config/landingdj.config.json` — `designPreset` y `validDesignPresets`
- `docs/ActiveTask.md`, `docs/CONFIG_GUIDE.md`, `docs/ROADMAP.md`, `docs/PROJECT_STATE.md`
