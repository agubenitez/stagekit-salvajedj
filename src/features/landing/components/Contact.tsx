'use client';

import React, { useState } from 'react';
import { type ContactFormConfig, type ContactFormTextsConfig, type WhatsAppConfig } from '@/lib/config/schema';
import { User, Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactProps {
  contactForm: ContactFormConfig;
  buttonText: string;
  confirmationPopupText?: string;
  contactFormTexts?: ContactFormTextsConfig;
  whatsappConfig?: WhatsAppConfig;
}

export default function Contact({ contactForm, buttonText, confirmationPopupText, contactFormTexts, whatsappConfig }: ContactProps) {
  if (!contactForm.enabled) return null;

  const cft = contactFormTexts ?? {};
  const bullets = cft.bullets ?? [
    'Soporte técnico y rider incluido',
    'Contrato legal y factura disponible',
    'Respuesta garantizada en 24 horas hábiles',
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setStatus('error');
      setErrorMessage(cft.validationError ?? 'Por favor, ingresa tu nombre y correo electrónico de contacto.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || cft.apiError || 'No se pudo registrar la solicitud de contacto.');
      }

      setStatus('success');
      setSuccessMessage(data.message || confirmationPopupText || 'Tu solicitud ha sido registrada exitosamente. Estaremos en contacto a la brevedad para coordinar los detalles de tu evento.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || cft.networkError || 'Ocurrió un problema de red al intentar transmitir el mensaje.');
    }
  };

  return (
    <section id="contacto" className="w-full py-20 px-6 md:px-12 border-b border-[var(--card-border)] bg-[var(--section-current-bg)] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-[var(--section-max-width)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-[var(--letter-spacing-tag)] text-primary font-bold">
              {cft.sectionTag ?? 'Reservar Fecha'}
            </span>
            {contactForm.title.trim().length > 0 && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-weight-heading)] text-[var(--heading-color)] font-heading leading-tight">
                {contactForm.title}
              </h2>
            )}
          </div>
          {contactForm.description.trim().length > 0 && (
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              {contactForm.description}
            </p>
          )}

          <div className="flex flex-col gap-4 mt-2">
            {bullets.map((bullet, i) => (
              <div key={i} className="flex gap-3 items-center text-sm text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {whatsappConfig?.phoneNumber?.trim() && whatsappConfig?.enabled !== false && (
            <>
              <div className="w-full h-px bg-[var(--card-border)] my-2" />
              <a
                href={`https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(whatsappConfig.message ?? 'Hola! Vi tu landing y quiero consultarte sobre un evento.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full py-3 px-5 rounded-[var(--btn-primary-radius)] font-bold text-xs uppercase tracking-widest transition-all text-white hover:brightness-110"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{whatsappConfig.buttonText || 'Contáctanos por WhatsApp'}</span>
              </a>
            </>
          )}
        </div>

        <div className="lg:col-span-7 w-full">
          <motion.div
            layout
            className="card card-raised p-6 md:p-8 relative backdrop-blur-sm"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-8 px-4 gap-4"
                  key="success-container"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--heading-color)] font-heading">
                    {cft.successTitle ?? '¡Solicitud Enviada!'}
                  </h3>
                  <p className="text-text-muted text-sm max-w-sm leading-relaxed">
                    {successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-secondary mt-6 px-6 py-2.5 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {cft.sendAnotherButton ?? 'Enviar otro mensaje'}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                  key="active-form"
                >
                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label htmlFor="client-name" className="text-xs font-bold text-[var(--text-label)] uppercase tracking-[var(--letter-spacing-cta)]">
                      {cft.nameLabel ?? 'Nombre Completo *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="client-name"
                        type="text"
                        required
                        disabled={status === 'sending'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={cft.namePlaceholder ?? 'Ej. Carlos Mendoza'}
                        className="input w-full text-sm pl-11 pr-4 py-3.5 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="client-email" className="text-xs font-bold text-[var(--text-label)] uppercase tracking-[var(--letter-spacing-cta)]">
                      {cft.emailLabel ?? 'Correo de Contacto *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="client-email"
                        type="email"
                        required
                        disabled={status === 'sending'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={cft.emailPlaceholder ?? 'Ej. carlos@empresa.com'}
                        className="input w-full text-sm pl-11 pr-4 py-3.5 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="client-message" className="text-xs font-bold text-[var(--text-label)] uppercase tracking-[var(--letter-spacing-cta)]">
                      {cft.messageLabel ?? 'Detalles del Evento (Opcional)'}
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-4 pointer-events-none text-neutral-500">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        id="client-message"
                        rows={4}
                        disabled={status === 'sending'}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={cft.messagePlaceholder ?? 'Por favor dinos la fecha aproximada, lugar, cantidad de invitados y cualquier requerimiento musical especial...'}
                        className="input w-full text-sm pl-11 pr-4 py-3.5 transition-all resize-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full py-4 font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-[var(--btn-primary-text)] border-t-transparent animate-spin"></span>
                        <span>{cft.sendingText ?? 'Registrando solicitud...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{buttonText || 'Enviar Solicitud'}</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


