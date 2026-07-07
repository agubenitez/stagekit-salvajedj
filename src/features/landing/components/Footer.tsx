'use client';

import React from 'react';
import { type SocialsConfig, type FooterTextsConfig } from '@/lib/config/schema';
import { Instagram, Youtube, Music, Disc, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  artisticName: string;
  socials?: SocialsConfig;
  footerTexts?: FooterTextsConfig;
}

export default function Footer({ artisticName, socials, footerTexts }: FooterProps) {
  const ft = footerTexts ?? {};
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    instagram: Instagram,
    youtube: Youtube,
    soundcloud: Music,
    mixcloud: Disc,
    spotify: Music,
    facebook: Globe,
  };

  const activeSocials = socials
    ? Object.entries(socials)
        .filter(([_, url]) => !!url)
        .map(([platform, url]) => {
          const IconComponent = iconMap[platform.toLowerCase()] || Globe;
          return {
            platform,
            url: url as string,
            Icon: IconComponent,
          };
        })
    : [];

  return (
    <footer className="w-full bg-[var(--theme-background-custom)] py-16 px-6 md:px-12 border-t border-[var(--navbar-border)] text-text-muted text-xs relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 text-[var(--heading-color)]">
            <Disc className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '12s' }} />
            <span className="text-base font-black font-heading uppercase tracking-wider">{artisticName}</span>
          </div>
          <span className="text-[11px] text-text-muted mt-1">
            {(ft.copyrightTemplate ?? '© {{year}} — Todos los derechos reservados.').replace('{{year}}', String(new Date().getFullYear()))}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {ft.tagline ?? 'Diseñado para DJs y Producción de Eventos Premium.'}
          </span>
        </div>

        {activeSocials.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[var(--letter-spacing-tag)] text-[var(--text-secondary)]">{ft.socialLabel ?? 'Sintoniza'}</span>
            <div className="flex gap-4 items-center">
              {activeSocials.map(({ platform, url, Icon }) => (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full badge flex items-center justify-center transition-all"
                  title={platform}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
          <div className="flex gap-1.5 items-center">
            <span>{ft.creditPrefix ?? 'Tecnología por'}</span>
            <span className="text-[var(--heading-color)] font-extrabold font-mono text-[10px] bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--card-border)]">
              {ft.creditBrand ?? 'StageKit Core'}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">
            {ft.creditTagline ?? 'Manejado por Configuración Declarativa'}
          </span>
        </div>

      </div>
    </footer>
  );
}


