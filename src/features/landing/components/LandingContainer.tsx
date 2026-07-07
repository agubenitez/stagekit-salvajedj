import React from 'react';
import { type LandingConfig, type SectionId, SECTION_IDS } from '@/lib/config/schema';
import Navbar from './Navbar';
import Hero from './Hero';
import Bio from './Bio';
import Services from './Services';
import Equipment from './Equipment';
import Gallery from './Gallery';
import Videos from './Videos';
import FAQ from './FAQ';
import Tours from './Tours';
import TourTable from './TourTable';
import Contact from './Contact';
import Songs from './Songs';
import Footer from './Footer';
import ThemeProvider from '@/features/theme/components/ThemeProvider';

interface LandingContainerProps {
  config: LandingConfig;
}

const defaultOrder: SectionId[] = [...SECTION_IDS];

export default function LandingContainer({ config }: LandingContainerProps) {
  const order = config.sectionOrder ?? defaultOrder;

  const sections: Record<SectionId, React.ReactNode> = {
    hero: (
      <Hero
        hero={config.hero}
        artisticName={config.artisticName}
        slogan={config.slogan}
        heroTexts={config.heroTexts}
      />
    ),
    bio: (
      <Bio
        description={config.description}
        artisticName={config.artisticName}
        bioTexts={config.bioTexts}
      />
    ),
    services: <Services services={config.services} servicesTexts={config.servicesTexts} />,
    equipment: <Equipment equipment={config.equipment} equipmentTexts={config.equipmentTexts} />,
    gallery: <Gallery gallery={config.gallery} galleryTexts={config.galleryTexts} />,
    videos: <Videos videos={config.videos} videosTexts={config.videosTexts} />,
    songs: <Songs songs={config.songs} songsTexts={config.songsTexts} />,
    tours: <Tours tours={config.tours} toursTexts={config.toursTexts} />,
    tour_table: <TourTable tourTable={config.tourTable} tourTableTexts={config.tourTableTexts} />,
    faq: <FAQ faq={config.faq} faqTexts={config.faqTexts} />,
    contact: (
      <Contact
        contactForm={config.contactForm}
        buttonText={config.contactButtonText}
        confirmationPopupText={config.confirmationPopupText}
        contactFormTexts={config.contactFormTexts}
        whatsappConfig={config.whatsapp}
      />
    ),
  };

  return (
    <ThemeProvider colors={config.colors} typography={config.typography} tokens={config.tokens} sectionMaxWidth={config.sectionMaxWidth}>
      <div className="relative min-h-screen flex flex-col selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <Navbar config={config} />

        <main className="flex-grow flex flex-col">
          {(() => {
            let sectionIndex = 0;
            return order.map((id) => {
              if (id === 'hero') return <React.Fragment key={id}>{sections[id]}</React.Fragment>;
              const bgVar = sectionIndex % 2 === 0 ? 'var(--section-bg)' : 'var(--section-bg-alt)';
              sectionIndex++;
              return (
                <div key={id} style={{ '--section-current-bg': bgVar } as React.CSSProperties}>
                  {sections[id]}
                </div>
              );
            });
          })()}
        </main>

        <Footer
          artisticName={config.artisticName}
          socials={config.socials}
          footerTexts={config.footerTexts}
        />
      </div>
    </ThemeProvider>
  );
}
