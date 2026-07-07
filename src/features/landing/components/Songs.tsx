'use client';

import React from 'react';
import { type SongConfig, type SongsTextsConfig } from '@/lib/config/schema';
import { motion } from 'motion/react';

interface SongsProps {
  songs?: SongConfig[];
  songsTexts?: SongsTextsConfig;
}

function getEmbedInfo(url: string): { src: string; height: number } {
  if (url.includes('open.spotify.com')) {
    const id = url.split('/track/')[1]?.split('?')[0] ?? '';
    return { src: `https://open.spotify.com/embed/track/${id}`, height: 152 };
  }
  if (url.includes('music.apple.com')) {
    const embedUrl = url.replace('music.apple.com', 'embed.music.apple.com');
    const separator = embedUrl.includes('?') ? '&' : '?';
    return { src: `${embedUrl}${separator}app=music`, height: 150 };
  }
  if (url.includes('soundcloud.com')) {
    return { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&show_artwork=true`, height: 166 };
  }
  return { src: url, height: 152 };
}

export default function Songs({ songs, songsTexts }: SongsProps) {
  if (!songs || songs.length === 0) return null;

  const st = songsTexts ?? {};

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
    <section id="canciones" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {st.sectionTag ?? 'Escenario Musical'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {st.heading ?? 'Escuchá mi Sonido'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {st.description ?? 'Dale play y sentí la música.'}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {songs.map((song) => (
            <motion.div
              key={song.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="card p-4 transition-all duration-300"
            >
              <iframe
                src={getEmbedInfo(song.url).src}
                width="100%"
                height={getEmbedInfo(song.url).height}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-[var(--card-radius)]"
                title={song.title}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


