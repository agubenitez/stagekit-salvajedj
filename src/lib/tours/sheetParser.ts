import { parse } from 'csv-parse/sync';
import { TourEventSchema, type TourEventConfig } from '@/lib/config/schema';

export async function fetchToursFromSheet(sheetUrl: string): Promise<TourEventConfig[]> {
  const response = await fetch(sheetUrl, {
    headers: { Accept: 'text/csv' },
  });

  if (!response.ok) {
    console.error(`[tours/sheetParser] HTTP ${response.status} fetching sheet`);
    return [];
  }

  const csvText = await response.text();

  let records: Record<string, string>[];
  try {
    records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      relax_quotes: true,
    });
  } catch (err) {
    console.error('[tours/sheetParser] CSV parse error:', err);
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

  return tours;
}
