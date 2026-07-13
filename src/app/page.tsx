import React from 'react';
import { Metadata } from 'next';
import { getLandingConfig } from '@/lib/config/loader';
import LandingContainer from '@/features/landing/components/LandingContainer';

export const dynamic = 'force-dynamic';

/**
 * Generación Dinámica de Metadatos (SEO) con la API nativa de Next.js.
 * Extrae y mapea la sección SEO configurada en landingdj.config.json.
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = getLandingConfig();
    return {
      title: `${config.artisticName} | ${config.slogan}`,
      description: config.seo.description || undefined,
      keywords: config.seo.keywords,
      icons: config.favicon ? {
        icon: config.favicon,
      } : undefined,
      openGraph: {
        title: config.seo.title || config.artisticName,
        description: config.seo.description || undefined,
        images: config.seo.ogImage ? [{ url: config.seo.ogImage }] : [],
        type: 'website',
      },
    };
  } catch (error) {
    // Metadatos de respaldo en caso de que el archivo JSON esté corrupto o ausente
    return {
      title: 'StageKit Core - LandingDJ',
      description: 'Lector de configuración e inyección de temas dinámicos.',
    };
  }
}

/**
 * Página Principal de la LandingDJ (Server-Side Component).
 * Orquestador principal de la carga y validación de datos. 
 * Delega el renderizado de la UI al LandingContainer bajo un ThemeProvider desacoplado.
 */
export default async function Page() {
  let config = null;
  let errorMsg = '';

  try {
    // Lectura y validación estricta Zod en tiempo de renderizado del servidor
    config = getLandingConfig();
  } catch (error: any) {
    errorMsg = error?.message || 'Error desconocido al procesar la configuración.';
  }

  // Fallback de Error Ultra-Premium y Educativo en caso de JSON Inválido
  if (errorMsg || !config) {
    return (
      <main className="min-h-screen bg-black text-neutral-100 flex flex-col justify-center items-center p-6 md:p-12 font-sans">
        <div className="max-w-xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
              Error de Configuración Crítico
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight leading-tight">
            StageKit Core detectó un problema en <code className="text-red-400 font-mono">landingdj.config.json</code>
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            La landing page no puede renderizarse de manera segura debido a fallas de validación. Por favor, revisa el archivo de configuración en tu entorno local.
          </p>
          <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl font-mono text-xs text-red-300 overflow-x-auto max-h-60 whitespace-pre-line leading-relaxed">
            {errorMsg}
          </div>
          <div className="text-xs text-neutral-500 border-t border-neutral-800 pt-4 leading-relaxed">
            💡 <strong>Sugerencia de Arquitecto:</strong> Asegúrate de que todas las propiedades obligatorias estén configuradas correctamente, que las URLs tengan formatos válidos y que las tipografías correspondan a las permitidas en el catálogo.
          </div>
        </div>
      </main>
    );
  }

  // Renderizamos de forma limpia el contenedor de la landing pasando la configuración tipada
  return <LandingContainer config={config} />;
}
