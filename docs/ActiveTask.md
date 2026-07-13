# ActiveTask — Tours Dinámicos vía Google Sheets

## Objetivo
Implementar sistema de tours dinámicos con toggle `toursSource` (`static` | `google-sheets`) controlado desde `landingdj.config.json`, permitiendo al usuario final actualizar shows editando una Google Sheet sin necesidad de deploy.

## Estado actual
- **Completado**: Sistema completo implementado, mejorado y build verificado.

### Archivos del sistema de tours
- `src/lib/tours/cache.ts` — MemoryCache con TTL 30 seg
- `src/lib/tours/sheetParser.ts` — fetch CSV, parseo, validación Zod, filas inválidas descartadas con warning, limpieza BOM, detección HTML
- `src/app/api/tours/route.ts` — GET handler con source switch + caché
- `schema.ts` — `TOURS_SOURCES`, `ToursSource`, `toursSource`, `toursSourceValid`, `toursSheetUrl`
- `config/landingdj.config.json` — campos actualizados, `toursSource: "static"` por defecto
- `src/app/page.tsx` — `export const dynamic = 'force-dynamic'` para SSR en cada request
- `Tours.tsx` — reescrito con skeleton, fetch condicional, ocultamiento en falla, paginación (6 iniciales, +3 por clic)
- `TourTable.tsx` — reescrito con misma lógica (skeleton, fetch, ocultamiento, paginación)
- `LandingContainer.tsx` — pasa `toursSource` prop a ambos componentes

### Mejoras implementadas (Sesión actual)
- **Renderizado dinámico**: `page.tsx` exporta `force-dynamic` para que los cambios en el JSON se reflejen sin reiniciar
- **Caché reducido**: TTL de 30 seg (antes 5 min) para actualizaciones casi inmediatas
- **Parser robustecido**: Limpieza de BOM, detección de respuestas HTML, logging de diagnóstico
- **Paginación de tours**: 6 eventos iniciales, botón "Mostrar más" que expande de a 3

### Archivos modificados
- `src/lib/tours/cache.ts` — TTL 5min → 30s
- `src/lib/tours/sheetParser.ts` — +cleanCsvText, +isHtmlResponse, mejor logging
- `src/app/page.tsx` — +`export const dynamic = 'force-dynamic'`
- `src/features/landing/components/Tours.tsx` — +paginación (INITIAL_VISIBLE, LOAD_MORE_STEP, visibleCount, botón)
- `src/features/landing/components/TourTable.tsx` — +paginación idéntica
- `src/lib/config/schema.ts` — +TOURS_SOURCES, +ToursSource, campos tours
- `config/landingdj.config.json` — +toursSource, toursSourceValid, toursSheetUrl
- `src/features/landing/components/LandingContainer.tsx` — +toursSource prop
- `docs/CONFIG_GUIDE.md` — +sección 2.17 paso a paso Google Sheets, TTL actualizado
- `docs/PROJECT_STATE.md` — +Fase 6 completa
- `docs/DECISIONS.md` — +ADR 08, +ADR 10
- `docs/ROADMAP.md` — +Fase 6
- `docs/AI_HANDOVER.md` — +arquitectura tours, TTL actualizado, paginación
- `docs/ActiveTask.md` — este archivo
- `package.json` — +csv-parse
