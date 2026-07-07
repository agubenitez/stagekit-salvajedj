'use client';

import React from 'react';
import { type TourEventConfig, type ToursTextsConfig } from '@/lib/config/schema';
import { motion } from 'motion/react';

function flagEmoji(countryCode?: string): string | null {
  if (!countryCode || countryCode.length !== 2) return null;
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(code.charCodeAt(0) - 65 + 0x1F1E6) +
    String.fromCodePoint(code.charCodeAt(1) - 65 + 0x1F1E6);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString();
  const month = d.toLocaleDateString('es', { month: 'short' }).replace(/\.$/, '');
  return `${day} ${month}`;
}

interface TourTableProps {
  tourTable?: TourEventConfig[];
  tourTableTexts?: ToursTextsConfig;
}

type TicketResult = {
  label: string;
  className: string;
  href?: string;
};

function getTicketInfo(status: string | undefined, ticketUrl: string | undefined, tt: ToursTextsConfig): TicketResult {
  if (status === 'en_venta' && ticketUrl) {
    return {
      className: 'text-xs font-bold uppercase tracking-wider text-primary hover:underline transition-all whitespace-nowrap',
      label: tt.enVentaLabel ?? 'tickets',
      href: ticketUrl,
    };
  }

  switch (status) {
    case 'agotado':
      return {
        className: 'text-xs font-bold uppercase tracking-wider text-red-400/70 whitespace-nowrap',
        label: tt.agotadoLabel ?? 'Sold Out',
      };
    case 'finalizado':
      return {
        className: 'text-xs font-bold uppercase tracking-wider text-neutral-500/60 whitespace-nowrap',
        label: tt.finalizadoLabel ?? 'Finalizado',
      };
    default:
      return {
        className: 'text-xs font-bold uppercase tracking-wider text-neutral-500/60 whitespace-nowrap',
        label: status === 'proximamente' ? (tt.proximamenteLabel ?? 'Próximamente') : (tt.proximamenteLabel ?? 'Próximamente'),
      };
  }
}

export default function TourTable({ tourTable, tourTableTexts }: TourTableProps) {
  if (!tourTable || tourTable.length === 0) return null;

  const tt = tourTableTexts ?? {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  } as const;

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  } as const;

  const tdClass = 'px-4 py-3 md:py-4 text-sm text-[var(--heading-color)] border-b border-[var(--card-border)]';

  return (
    <section id="tour-table" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {tt.sectionTag ?? 'Tour & Eventos'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {tt.heading ?? 'Calendario de Shows'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {tt.description ?? 'Todas las fechas confirmadas.'}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px]">
            <tbody>
              {tourTable.map((event) => {
                const flag = flagEmoji(event.countryCode);
                const ticket = getTicketInfo(event.status, event.ticketUrl, tt);

                return (
                  <motion.tr
                    key={event.id}
                    variants={rowVariants}
                    className="transition-colors duration-300 hover:bg-[var(--section-bg)]/50"
                  >
                    <td className={`${tdClass} text-xs font-mono text-text-muted whitespace-nowrap`}>
                      {formatDate(event.date)}
                    </td>
                    <td className={`${tdClass} font-medium`}>
                      {event.venue}
                    </td>
                    <td className={`${tdClass} text-text-muted`}>
                      {event.location}
                    </td>
                    <td className={`${tdClass} text-text-muted`}>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        {flag && <span className="text-base leading-none">{flag}</span>}
                        <span>{event.country}</span>
                      </span>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      {ticket.href ? (
                        <a
                          href={ticket.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={ticket.className}
                        >
                          {ticket.label}
                        </a>
                      ) : (
                        <span className={ticket.className}>
                          {ticket.label}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
