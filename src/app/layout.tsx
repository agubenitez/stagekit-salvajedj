import './globals.css';
import React from 'react';
import { getLandingConfig } from '@/lib/config/loader';

export const metadata = {
  title: 'StageKit Core - LandingDJ',
  description: 'Arquitectura base de LandingDJ con Next.js App Router',
};

/**
 * Layout Principal de la Aplicación.
 * Diseñado en el servidor para cargar optimizadamente SOLO las fuentes requeridas
 * por la configuración de la landing page activa, minimizando la latencia de red.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let fontsUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap';

  try {
    const config = getLandingConfig();
    const headingFont = config.typography.heading.replace(/\s+/g, '+');
    const bodyFont = config.typography.body.replace(/\s+/g, '+');

    // Construimos la URL de Google Fonts de forma selectiva para el encabezado y cuerpo
    if (headingFont === bodyFont) {
      fontsUrl = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;500;600;700&display=swap`;
    } else {
      fontsUrl = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;500;600;700&family=${bodyFont}:wght@400;500;600;700&display=swap`;
    }
  } catch (error) {
    // Si la configuración aún no está lista o es inválida, se utiliza el fallback seguro
    console.warn('⚠️ No se pudo cargar la configuración de fuentes, usando tipografías de respaldo.');
  }

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

