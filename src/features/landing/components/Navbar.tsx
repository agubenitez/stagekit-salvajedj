'use client';

import React, { useState, useEffect } from 'react';
import { type LandingConfig, SECTION_IDS } from '@/lib/config/schema';
import { Menu, X, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  config: LandingConfig;
}

export default function Navbar({ config }: NavbarProps) {
  const { artisticName, services, equipment, gallery, videos, songs, music, tours, tourTable, faq, contactForm } = config;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nt = config.navbarTexts ?? {};

  const sectionNavMap: Record<string, { label: string | undefined; href: string; active: boolean }> = {
    bio_con_foto: { label: nt.bioConFoto, href: '#bio-con-foto', active: true },
    bio:        { label: nt.bio,        href: '#bio',         active: true },
    services:   { label: nt.services,   href: '#servicios',    active: !!services && services.length > 0 },
    equipment:  { label: nt.equipment,  href: '#equipamiento', active: !!equipment && equipment.length > 0 },
    gallery:    { label: nt.gallery,    href: '#galeria',      active: !!gallery && gallery.length > 0 },
    videos:     { label: nt.videos,     href: '#videos',       active: !!videos && videos.length > 0 },
    songs:      { label: nt.songs,      href: '#canciones',    active: !!songs && songs.length > 0 },
    music:      { label: nt.music,      href: '#music',        active: !!music && music.length > 0 },
    faq:        { label: nt.faq,        href: '#faq',          active: !!faq && faq.length > 0 },
    tours:      { label: nt.tours,      href: '#tours',        active: !!tours && tours.length > 0 },
    tour_table: { label: nt.tourTable,  href: '#tour-table',   active: !!tourTable && tourTable.length > 0 },
    contact:    { label: nt.contact,    href: '#contacto',     active: !!contactForm?.enabled },
  };

  const order = config.sectionOrder ?? [...SECTION_IDS];

  const navLinks = order
    .map((id) => sectionNavMap[id])
    .filter((link) => link && link.active && link.label);

  return (
    <nav
      id="main-nav"
      className={`w-full fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--navbar-bg)] border-b border-[var(--navbar-border)] backdrop-blur-md shadow-lg shadow-[var(--navbar-shadow)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <a href="#hero" className="flex items-center gap-2.5 group cursor-pointer" id="nav-brand">
          <motion.div
            animate={{ rotate: scrolled ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="text-primary"
          >
            <Disc className="w-6 h-6" />
          </motion.div>
          <span className="text-xl font-[var(--font-weight-heading)] tracking-tight font-heading text-[var(--heading-color)] group-hover:text-primary transition-colors">
            {artisticName}
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium" id="nav-desktop-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link transition-colors cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {contactForm?.enabled && nt.ctaButton && nt.ctaButton.trim().length > 0 && (
            <a
              id="cta-nav-button"
              href="#contacto"
              className="btn-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-all"
            >
              {nt.ctaButton}
            </a>
          )}
        </div>

        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[var(--text-label)] hover:text-[var(--heading-color)] p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20"
          aria-label="Abrir menú"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-[var(--navbar-bg)] border-b border-[var(--navbar-border)] absolute top-full left-0 right-0 backdrop-blur-xl overflow-hidden px-6 py-6 flex flex-col gap-5 shadow-2xl"
            id="mobile-dropdown-menu"
          >
            <ul className="flex flex-col gap-4 text-base font-semibold">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="nav-link transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {contactForm?.enabled && nt.ctaButton && nt.ctaButton.trim().length > 0 && (
              <a
                href="#contacto"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center text-sm font-bold uppercase tracking-wider py-3 block mt-2 transition-all"
              >
                {nt.ctaButton}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

