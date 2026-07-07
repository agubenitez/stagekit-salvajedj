'use client';

import React from 'react';
import { motion } from 'motion/react';
import { type BioTextsConfig } from '@/lib/config/schema';
import { Disc, Award, Calendar } from 'lucide-react';

interface BioProps {
  description: string;
  artisticName: string;
  bioTexts?: BioTextsConfig;
}

export default function Bio({ description, artisticName, bioTexts }: BioProps) {
  if (!description.trim()) return null;

  const bt = bioTexts ?? {};
  const bioDescription = bt.description ?? description;
  const defaultBadges = [
    { title: 'Más de 5 Años de Experiencia', description: 'Festivales Electronica - Clubes - Yates - Eventos privados.' },
    { title: 'Estilo Exclusivo & Personalizado', description: 'Cada set musical se diseña según el ambiente del evento.' },
    { title: 'Audio', description: 'Equipos certificados para asegurar la máxima fidelidad auditiva.' },
  ];
  const badges = bt.badges && bt.badges.length > 0 ? bt.badges : defaultBadges;
  const badgeIcons = [Calendar, Award, Disc];

  return (
    <section id="bio" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)] relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-10" />

      <div className="max-w-[var(--section-max-width)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              {bt.sectionTag ?? 'Trayectoria & Sello'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] font-heading leading-tight">
              {bt.heading ?? `${bt.headingPrefix ?? 'Detrás del Sonido: '}${artisticName}`}
            </h2>
          </div>
          
          <div className="h-[2px] w-20 bg-gradient-to-r from-primary to-secondary" />

          <p className="text-base md:text-lg text-text-muted leading-relaxed whitespace-pre-line">
            {bioDescription}
          </p>
        </div>

        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="card card-raised p-6 md:p-8 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-[var(--heading-color)] font-heading mb-6 flex items-center gap-2">
              <Disc className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
              <span>{bt.cardTitle ?? 'Credenciales Artísticas'}</span>
            </h3>

            <div className="flex flex-col gap-5">
              {badges.map((badge, i) => {
                const IconComponent = badgeIcons[i % badgeIcons.length];
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="badge w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--heading-color)]">{badge.title}</h4>
                      <p className="text-xs text-text-muted mt-1">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


