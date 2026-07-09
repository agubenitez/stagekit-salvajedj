# ActiveTask — Tours Dinámicos vía Google Sheets

## Objetivo
Implementar sistema de tours dinámicos con toggle `toursSource` (`static` | `google-sheets`) controlado desde `landingdj.config.json`, permitiendo al usuario final actualizar shows editando una Google Sheet sin necesidad de deploy.

## Estado actual
- **Completado**: Sistema completo implementado y build verificado.
  - `src/lib/tours/cache.ts` — MemoryCache con TTL 5 min
  - `src/lib/tours/sheetParser.ts` — fetch CSV, parseo, validación Zod, filas inválidas descartadas con warning
  - `src/app/api/tours/route.ts` — GET handler con source switch + caché
  - `schema.ts` — `TOURS_SOURCES`, `ToursSource`, `toursSource`, `toursSourceValid`, `toursSheetUrl`
  - `config/landingdj.config.json` — campos actualizados, `toursSource: "static"` por defecto
  - `Tours.tsx` — reescrito con skeleton, fetch condicional, ocultamiento en falla
  - `TourTable.tsx` — reescrito con misma lógica (skeleton, fetch, ocultamiento)
  - `LandingContainer.tsx` — pasa `toursSource` prop a ambos componentes
  - `toursSheetUrl` validación: `.optional().or(z.literal(''))` para soportar `""` en modo static
  - Documentación actualizada: CONFIG_GUIDE, PROJECT_STATE, DECISIONS, ROADMAP, AI_HANDOVER

## Archivos modificados/creados
- `src/lib/tours/cache.ts` — nuevo
- `src/lib/tours/sheetParser.ts` — nuevo
- `src/app/api/tours/route.ts` — nuevo
- `src/lib/config/schema.ts` — +TOURS_SOURCES, +ToursSource, campos tours
- `config/landingdj.config.json` — +toursSource, toursSourceValid, toursSheetUrl
- `src/features/landing/components/Tours.tsx` — reescrito
- `src/features/landing/components/TourTable.tsx` — reescrito
- `src/features/landing/components/LandingContainer.tsx` — +toursSource prop
- `docs/CONFIG_GUIDE.md` — +sección 2.17 paso a paso Google Sheets
- `docs/PROJECT_STATE.md` — +Fase 6
- `docs/DECISIONS.md` — +ADR 08
- `docs/ROADMAP.md` — +Fase 6
- `docs/AI_HANDOVER.md` — +arquitectura tours
- `docs/ActiveTask.md` — este archivo
- `package.json` — +csv-parse
