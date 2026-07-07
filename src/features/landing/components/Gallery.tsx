'use client';

import React from 'react';
import { type GalleryTextsConfig } from '@/lib/config/schema';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';

interface GalleryProps {
  gallery?: string[];
  galleryTexts?: GalleryTextsConfig;
}

export default function Gallery({ gallery, galleryTexts }: GalleryProps) {
  if (!gallery || gallery.length === 0) return null;

  const gt = galleryTexts ?? {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  } as const;

  return (
    <section id="galeria" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {gt.sectionTag ?? 'Gira & Eventos'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {gt.heading ?? 'Momentos Capturados en Vivo'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {gt.description ?? 'Una mirada de cerca a la atmósfera y energía de los sets en vivo, festivales y fiestas privadas de alto nivel.'}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {gallery.map((imgUrl, index) => (
            <motion.div
              key={index}
              variants={imageVariants}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--theme-background-custom)] group shadow-xl"
            >
              <img
                src={imgUrl}
                alt={`Captura del show del DJ en vivo en el escenario ${index + 1}`}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--overlay)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <div className="flex items-center gap-2">
                  <div className="badge w-8 h-8 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[var(--heading-color)] tracking-wide uppercase">
                    {gt.overlayLabel ?? 'Stage Capture'} #{index + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


