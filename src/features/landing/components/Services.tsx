'use client';

import React from 'react';
import { type ServiceConfig, type ServicesTextsConfig } from '@/lib/config/schema';
import IconMapper from './IconMapper';
import { motion } from 'motion/react';

interface ServicesProps {
  services?: ServiceConfig[];
  servicesTexts?: ServicesTextsConfig;
}

export default function Services({ services, servicesTexts }: ServicesProps) {
  if (!services || services.length === 0) return null;

  const st = servicesTexts ?? {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  } as const;

  return (
    <section id="servicios" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)] relative">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {st.sectionTag ?? 'Servicios Exclusivos'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] font-heading leading-tight">
            {st.heading ?? 'Experiencias Musicales a Medida'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {st.description ?? 'Sets profesionales diseñados para sintonizar perfectamente con la energía de cada evento.'}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="card p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />

              <div className="badge w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <IconMapper name={service.icon} size={22} />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[var(--heading-color)] font-heading tracking-tight group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


