import React from 'react';
import * as Icons from 'lucide-react';

interface IconMapperProps {
  name: string;
  className?: string;
  size?: number;
}

/**
 * Mapeador de Iconos de Lucide.
 * Traduce de forma segura identificadores de strings cargados en landingdj.config.json
 * a componentes SVG de Lucide React altamente optimizados.
 */
export default function IconMapper({ name, className = '', size = 20 }: IconMapperProps) {
  // Convertimos el string a PascalCase aproximado para encajar con las exportaciones de Lucide
  const normalizedKey = name
    .toLowerCase()
    .replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

  // Mapeos explícitos para conveniencia común
  const customMap: Record<string, keyof typeof Icons> = {
    music: 'Music',
    briefcase: 'Briefcase',
    sliders: 'SlidersHorizontal',
    speaker: 'Volume2',
    lightbulb: 'Lightbulb',
    disc: 'Disc',
    headphones: 'Headphones',
    mic: 'Mic',
    sparkles: 'Sparkles',
    star: 'Star',
    calendar: 'Calendar',
    users: 'Users',
    volume: 'Volume2',
    activity: 'Activity',
  };

  const matchedName = customMap[name.toLowerCase()] || (normalizedKey as keyof typeof Icons);
  
  // Obtenemos la referencia al componente Lucide
  const IconComponent = Icons[matchedName] as React.ComponentType<{ className?: string; size?: number }>;

  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  // Fallback elegante en caso de que no exista
  return <Icons.Music className={className} size={size} />;
}
