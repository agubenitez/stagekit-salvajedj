'use client';

import React, { useState } from 'react';
import { type FAQConfig, type FAQTextsConfig } from '@/lib/config/schema';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  faq?: FAQConfig[];
  faqTexts?: FAQTextsConfig;
}

export default function FAQ({ faq, faqTexts }: FAQProps) {
  if (!faq || faq.length === 0) return null;

  const ft = faqTexts ?? {};

  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setActiveFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)]">
      <div className="max-w-[var(--section-max-width)] mx-auto flex flex-col gap-12">
        
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
            {ft.sectionTag ?? 'Dudas Comunes'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] mt-2 font-heading leading-tight">
            {ft.heading ?? 'Preguntas Frecuentes'}
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mt-1 leading-relaxed">
            {ft.description ?? '¿Tienes alguna consulta técnica o contractual? Aquí tienes respuestas directas sobre nuestra forma de trabajo.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faq.map((item) => {
            const isOpen = activeFaqId === item.id;

            return (
              <div
                key={item.id}
                className={`transition-all duration-300 ${
                  isOpen
                    ? 'card card-raised border-primary/20 shadow-lg shadow-primary/5'
                    : 'card hover:border-[var(--card-border-hover)]'
                }`}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left px-5 py-5 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-3.5 items-center min-w-0">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-primary' : 'text-neutral-500'}`} />
                    <span className="text-sm md:text-base font-bold text-[var(--heading-color)] font-heading leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`shrink-0 ${isOpen ? 'text-primary' : 'text-text-muted'}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm md:text-base text-text-muted border-t border-[var(--card-border)] leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


