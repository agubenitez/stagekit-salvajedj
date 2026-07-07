'use client';

import React, { useState } from 'react';
import { type VideoConfig, type VideosTextsConfig } from '@/lib/config/schema';
import { Play, Tv, Disc } from 'lucide-react';
import { motion } from 'motion/react';

interface VideosProps {
  videos?: VideoConfig[];
  videosTexts?: VideosTextsConfig;
}

export default function Videos({ videos, videosTexts }: VideosProps) {
  if (!videos || videos.length === 0) return null;

  const vt = videosTexts ?? {};

  const [activePlayIds, setActivePlayIds] = useState<Record<string, boolean>>({});

  const handlePlayVideo = (id: string) => {
    setActivePlayIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="videos" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)] relative">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {vt.sectionTag ?? 'Sets & Sesiones'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {vt.heading ?? 'Videos de Presentaciones'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {vt.description ?? 'Siente el ritmo y sintoniza con el espectáculo visual y auditivo de los sets en vivo, transmitidos directamente desde el escenario.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video) => {
            const isPlaying = !!activePlayIds[video.id];

            return (
              <div
                key={video.id}
                className="card p-5 flex flex-col gap-4 transition-all duration-300"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--hero-bg,#000)] flex items-center justify-center border border-[var(--card-border)] shadow-inner group">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <>
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-102 transition-all duration-500"
                          loading="lazy"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-[var(--overlay)]/40 group-hover:bg-[var(--overlay)]/20 transition-colors" />

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayVideo(video.id)}
                        className="relative z-10 w-16 h-16 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center shadow-2xl shadow-[var(--btn-primary-shadow)] transition-all cursor-pointer"
                        aria-label={`${vt.playLabel ?? 'Reproducir video'} ${video.title}`}
                      >
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </motion.button>
                    </>
                  )}
                </div>

                <div className="flex gap-3 items-start px-1 mt-1">
                  <div className="badge w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    {isPlaying ? <Disc className="w-5 h-5 animate-spin" /> : <Tv className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-[var(--heading-color)] font-heading tracking-tight truncate leading-snug">
                      {video.title}
                    </h3>
                    <span className="text-xs text-text-muted mt-0.5">
                      {vt.subtitleLabel ?? 'Presentación Audiovisual Oficial'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


