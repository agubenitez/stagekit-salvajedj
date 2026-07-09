import { NextResponse } from 'next/server';
import { getLandingConfig } from '@/lib/config/loader';
import { fetchToursFromSheet } from '@/lib/tours/sheetParser';
import { MemoryCache } from '@/lib/tours/cache';
import type { TourEventConfig } from '@/lib/config/schema';

const toursCache = new MemoryCache<TourEventConfig[]>();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getLandingConfig();

    if (config.toursSource !== 'google-sheets' || !config.toursSheetUrl) {
      return NextResponse.json(config.tours ?? []);
    }

    const cached = toursCache.get();
    if (cached) {
      return NextResponse.json(cached);
    }

    const tours = await fetchToursFromSheet(config.toursSheetUrl);

    toursCache.set(tours);

    return NextResponse.json(tours);
  } catch {
    return NextResponse.json([]);
  }
}
