'use client';

import React, { useRef, useState, useEffect } from 'react';
import { type HeroConfig, type HeroTextsConfig } from '@/lib/config/schema';
import { motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroProps {
  hero: HeroConfig;
  artisticName: string;
  slogan: string;
  heroTexts?: HeroTextsConfig;
}

export default function Hero({ hero, artisticName, slogan, heroTexts }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [driftAmps, setDriftAmps] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (heroRef.current) {
      const raw = getComputedStyle(heroRef.current).getPropertyValue('--hero-title-drift').trim();
      const amps = raw ? raw.split(',').map(Number) : [0, 0, 0];
      setDriftAmps(amps);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  } as const;

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center text-center p-6 md:p-12 overflow-hidden bg-[var(--hero-bg,#000)]"
    >
      <div className="absolute inset-0 z-0">
        {(hero.type ?? 'image') === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35 scale-105"
            src={hero.url}
          />
        ) : (
          <img
            src={hero.url}
            alt="Fondo escénico"
            className="w-full h-full object-cover opacity-70 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[var(--overlay)]/60 to-[var(--overlay)] z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--overlay)] via-[var(--overlay)]/40 via-20% to-transparent to-40% z-0" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative z-10 max-w-4xl mx-auto flex flex-col items-center ${
          hero.layout === 'titles' ? 'pt-4' : 'pt-16'
        } ${
          hero.layout === 'titles' ? 'gap-8 md:gap-12' : 'gap-6 md:gap-8'
        }`}
      >
        {hero.layout === 'titles' && hero.titles ? (
          hero.titles.filter(item => item.text.trim().length > 0).map((item, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={driftAmps[i] > 0 ? { y: [0, -driftAmps[i], driftAmps[i] / 2, -driftAmps[i] * 0.7, 0, driftAmps[i] * 0.4, -driftAmps[i] / 3, 0] } : {}}
              transition={driftAmps[i] > 0 ? { duration: 9 - i * 2, repeat: Infinity, ease: 'easeInOut', delay: 1 + i * 0.15 } : {}}
              className="w-full"
            >
              <motion.h1
                variants={itemVariants}
                className={item.className ?? 'font-black text-[var(--heading-color)] tracking-tight leading-tight font-heading uppercase drop-shadow-2xl break-words max-w-full'}
                style={{
                  fontSize: `var(--hero-title-size-${i + 1})`,
                  color: `color-mix(in srgb, var(--heading-color) calc(var(--hero-title-opacity-${i + 1}) * 100%), transparent)`,
                  textShadow: `var(--hero-title-text-shadow-${i + 1})`,
                }}
              >
                {item.text}
              </motion.h1>
            </motion.div>
          ))
        ) : (
          <>
            <motion.div
              variants={itemVariants}
              className="badge flex items-center gap-2 px-3 py-1"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{heroTexts?.badge ?? 'Live Experience'}</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-[var(--heading-color)] tracking-tight leading-tight font-heading uppercase drop-shadow-2xl break-words max-w-full"
              style={{ textShadow: '0 0 25px var(--theme-primary)' }}
            >
              {artisticName}
            </motion.h1>

            {slogan.trim().length > 0 && (
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-xl md:text-2xl text-neutral-300 font-medium max-w-2xl px-4 tracking-wide"
              >
                {slogan}
              </motion.p>
            )}

            {hero.ctaText.trim().length > 0 && (
              <motion.div variants={itemVariants} className="mt-4 sm:mt-6">
                <a
                  href="#contacto"
                  aria-label={`Reservar fecha para show con ${artisticName}`}
                  className="btn-primary px-8 py-4 font-extrabold uppercase tracking-[var(--letter-spacing-cta)] text-xs flex items-center gap-2 transition-all duration-300"
                >
                  <span>{hero.ctaText}</span>
                </a>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          {heroTexts?.scrollIndicator ?? 'Descubrir'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-primary"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>
    </section>
  );
}

