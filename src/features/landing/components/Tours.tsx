'use client';

import React, { useState, useEffect } from 'react';
import { type TourEventConfig, type ToursTextsConfig, type ToursSource } from '@/lib/config/schema';
import { motion } from 'motion/react';
import { MapPin, Ticket, ExternalLink } from 'lucide-react';

function flagEmoji(countryCode?: string): string | null {
  if (!countryCode || countryCode.length !== 2) return null;
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(code.charCodeAt(0) - 65 + 0x1F1E6) +
    String.fromCodePoint(code.charCodeAt(1) - 65 + 0x1F1E6);
}

function formatDate(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: dateStr, month: '' };
  const day = d.getDate().toString();
  const month = d.toLocaleDateString('es', { month: 'short' }).replace(/\.$/, '');
  return { day, month };
}

interface ToursProps {
  tours?: TourEventConfig[];
  toursTexts?: ToursTextsConfig;
  toursSource?: ToursSource;
}

const btnBase = 'inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-[var(--btn-primary-radius)] text-xs font-bold uppercase tracking-wider transition-all';

type StatusResult = {
  label: string;
  disabled: boolean;
  className: string;
};

function getStatusStyle(status: string | undefined, ticketUrl: string | undefined, tt: ToursTextsConfig): StatusResult {
  if (status === 'en_venta' && ticketUrl) {
    return {
      className: 'btn-primary',
      label: tt.enVentaLabel || 'Comprar Entrada',
      disabled: false,
    };
  }

  switch (status) {
    case 'agotado':
      return {
        className: 'bg-transparent border border-red-400/20 text-red-400/60 opacity-70 cursor-not-allowed pointer-events-none',
        label: tt.agotadoLabel || 'Agotado',
        disabled: true,
      };
    case 'finalizado':
      return {
        className: 'bg-transparent border border-neutral-500/20 text-neutral-500/40 line-through opacity-60 cursor-not-allowed pointer-events-none',
        label: tt.finalizadoLabel || 'Finalizado',
        disabled: true,
      };
    default:
      return {
        className: 'bg-transparent border border-primary/20 text-primary/60 cursor-not-allowed pointer-events-none',
        label: tt.proximamenteLabel || 'Próximamente',
        disabled: true,
      };
  }
}

function ToursSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-5 md:p-6 flex flex-col gap-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-neutral-800/50 rounded-xl px-4 py-2.5">
              <div className="h-3 w-10 bg-neutral-700 rounded" />
              <div className="h-7 w-8 bg-neutral-700 rounded mt-1" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-neutral-700 rounded" />
              <div className="h-4 w-1/2 bg-neutral-700 rounded" />
              <div className="h-4 w-1/3 bg-neutral-700 rounded" />
            </div>
          </div>
          <div className="h-10 w-full bg-neutral-700 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP = 3;

export default function Tours({ tours, toursTexts, toursSource = 'static' }: ToursProps) {
  const [dynamicTours, setDynamicTours] = useState<TourEventConfig[] | null>(null);
  const [loading, setLoading] = useState(toursSource === 'google-sheets');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    if (toursSource !== 'google-sheets') return;

    setLoading(true);
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => {
        setDynamicTours(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setDynamicTours([]);
        setLoading(false);
      });
  }, [toursSource]);

  if (toursSource === 'google-sheets') {
    if (loading) {
      return (
        <section className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
          <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-neutral-700 rounded animate-pulse" />
              <div className="h-9 w-64 bg-neutral-700 rounded animate-pulse mt-2" />
              <div className="h-5 w-96 max-w-full bg-neutral-700 rounded animate-pulse mt-1" />
            </div>
            <ToursSkeleton />
          </div>
        </section>
      );
    }
    if (!dynamicTours || dynamicTours.length === 0) return null;
  } else {
    if (!tours || tours.length === 0) return null;
  }

  const displayTours = toursSource === 'google-sheets' ? dynamicTours! : tours!;
  const visibleTours = displayTours.slice(0, visibleCount);
  const hasMore = visibleCount < displayTours.length;
  const tt = toursTexts ?? {};

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  } as const;

  return (
    <section id="tours" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {tt.sectionTag ?? 'Tour & Eventos'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {tt.heading ?? 'Próximos Shows'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {tt.description ?? 'Fechas confirmadas y eventos en vivo.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTours.map((event) => {
            const { day, month } = formatDate(event.date);
            const flag = flagEmoji(event.countryCode);
            const btn = getStatusStyle(event.status, event.ticketUrl, tt);

            const btnContent = (
              <>
                <Ticket className="w-3.5 h-3.5 shrink-0" />
                <span>{btn.label}</span>
                <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
              </>
            );

            return (
              <motion.div
                key={event.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="card p-5 md:p-6 flex flex-col gap-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center bg-[var(--section-bg-alt)] rounded-xl px-4 py-2.5 shrink-0">
                    <span className="text-xs font-mono uppercase text-primary font-bold leading-tight">
                      {month}
                    </span>
                    <span className="text-2xl font-black text-[var(--heading-color)] font-heading leading-tight mt-0.5">
                      {day}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-[var(--heading-color)] font-heading leading-tight truncate">
                      {event.venue}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    {(flag || event.country) && (
                      <div className="flex items-center gap-1.5 mt-0.5 text-sm text-text-muted">
                        {flag && <span className="text-base leading-none">{flag}</span>}
                        <span>{event.country}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {btn.disabled ? (
                    <span className={`${btnBase} ${btn.className}`}>
                      {btnContent}
                    </span>
                  ) : (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${btnBase} ${btn.className}`}
                    >
                      {btnContent}
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
              className="btn-primary px-8 py-3 rounded-[var(--btn-primary-radius)] text-xs font-bold uppercase tracking-wider"
            >
              Mostrar más
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
