import { parse } from 'csv-parse/sync';
import { TourEventSchema, type TourEventConfig } from '@/lib/config/schema';

function cleanCsvText(raw: string): string {
  let text = raw;
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  return text.trim();
}

function isHtmlResponse(text: string): boolean {
  const lower = text.toLowerCase().substring(0, 500);
  return lower.includes('<!doctype') || lower.includes('<html');
}

export async function fetchToursFromSheet(sheetUrl: string): Promise<TourEventConfig[]> {
  const response = await fetch(sheetUrl, {
    headers: { Accept: 'text/csv' },
  });

  if (!response.ok) {
    console.error(`[tours/sheetParser] HTTP ${response.status} fetching sheet`);
    return [];
  }

  const contentType = response.headers.get('content-type') ?? '';
  const csvText = await response.text();

  if (isHtmlResponse(csvText)) {
    console.error('[tours/sheetParser] La respuesta no es CSV — Google devolvió HTML (verifica que la hoja esté publicada como CSV)');
    console.error('[tours/sheetParser] Primeros 200 caracteres:', csvText.substring(0, 200));
    return [];
  }

  const cleaned = cleanCsvText(csvText);
  if (!cleaned) {
    console.error('[tours/sheetParser] CSV vacío después de limpiar');
    return [];
  }

  let records: Record<string, string>[];
  try {
    records = parse(cleaned, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true,
    });
  } catch (err) {
    console.error('[tours/sheetParser] CSV parse error:', err);
    console.error('[tours/sheetParser] Primeros 200 caracteres:', cleaned.substring(0, 200));
    return [];
  }

  const tours: TourEventConfig[] = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const result = TourEventSchema.safeParse({
      id: row.id || `tour_${i + 1}`,
      date: row.date,
      venue: row.venue,
      location: row.location,
      country: row.country,
      countryCode: row.countryCode || undefined,
      ticketUrl: row.ticketUrl || undefined,
      status: row.status || undefined,
    });

    if (result.success) {
      tours.push(result.data);
    } else {
      console.warn(`[tours/sheetParser] Fila ${i + 2} inválida:`, result.error.format());
    }
  }

  const todayMs = new Date().setHours(0, 0, 0, 0);

  tours.forEach((t) => {
    const eventMs = new Date(t.date).setHours(0, 0, 0, 0);
    if (eventMs < todayMs) t.status = 'finalizado';
  });

  tours.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    const aFuture = da >= todayMs;
    const bFuture = db >= todayMs;
    if (aFuture && !bFuture) return -1;
    if (!aFuture && bFuture) return 1;
    return da - db;
  });

  return tours;
}
