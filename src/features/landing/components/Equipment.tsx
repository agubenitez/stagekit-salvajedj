'use client';

import React from 'react';
import { type EquipmentConfig, type EquipmentTextsConfig } from '@/lib/config/schema';
import IconMapper from './IconMapper';
import { motion } from 'motion/react';

interface EquipmentProps {
  equipment?: EquipmentConfig[];
  equipmentTexts?: EquipmentTextsConfig;
}

export default function Equipment({ equipment, equipmentTexts }: EquipmentProps) {
  if (!equipment || equipment.length === 0) return null;

  const et = equipmentTexts ?? {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  } as const;

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
    <section id="equipamiento" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-secondary font-bold">
            {et.sectionTag ?? 'Rider Técnico'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {et.heading ?? 'Equipamiento Profesional de Alta Gama'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {et.description ?? 'Utilizamos tecnología líder en la industria para garantizar una fidelidad acústica óptima y un show visual impactante.'}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {equipment.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="card p-5 flex items-center gap-4 transition-all duration-300"
            >
              <div className="badge w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--badge-bg)', color: 'var(--color-secondary)' }}>
                <IconMapper name={item.icon} size={20} />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-secondary uppercase tracking-[var(--letter-spacing-tag)] font-bold">
                  {item.category}
                </span>
                <span className="text-sm md:text-base font-bold text-[var(--heading-color)] mt-0.5 truncate leading-tight">
                  {item.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


