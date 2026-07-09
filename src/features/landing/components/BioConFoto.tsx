'use client';

import { motion } from 'motion/react';
import { type BioConFotoConfig, type BioConFotoTextsConfig } from '@/lib/config/schema';

interface BioConFotoProps {
  bioConFoto: BioConFotoConfig;
  artisticName: string;
  description: string;
  bioConFotoTexts?: BioConFotoTextsConfig;
}

export default function BioConFoto({ bioConFoto, artisticName, description, bioConFotoTexts }: BioConFotoProps) {
  const bt = bioConFotoTexts ?? {};
  const imgSrc = bioConFoto.url;
  const imgAlt = bioConFoto.alt ?? artisticName;

  return (
    <section id="bio-con-foto" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)] relative overflow-hidden">
      <div className="max-w-[var(--section-max-width)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="w-full"
          style={{ order: 'var(--bio-con-foto-order-image, 1)' }}
        >
          <div className="card card-raised overflow-hidden w-full p-2">
            <div className="aspect-[4/3] md:aspect-auto md:h-[500px]">
              <img
                src={imgSrc}
                alt={imgAlt}
                className="w-full h-full object-cover rounded-[calc(var(--card-radius)-4px)]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full flex flex-col gap-6"
          style={{ order: 'var(--bio-con-foto-order-text, 2)' }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            {bt.sectionTag ?? 'Presentación'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] font-heading leading-tight">
            {bt.heading || artisticName}
          </h2>
          <div className="h-[2px] w-20 bg-gradient-to-r from-primary to-secondary" />
          <p className="text-base md:text-lg text-text-muted leading-relaxed whitespace-pre-line">
            {bt.description || description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
