import { z } from 'zod';
import type { DesignTokens } from '@/features/theme/designPresets';

export const ALLOWED_FONTS = [
  'Inter',
  'Space Grotesk',
  'Outfit',
  'Playfair Display',
  'JetBrains Mono',
  'Fira Code',
  'Montserrat',
  'Plus Jakarta Sans',
  'DM Sans',
  'DM Serif Display',
] as const;

export type AllowedFont = typeof ALLOWED_FONTS[number];

const PublicAssetPathSchema = z
  .string()
  .min(1)
  .refine(
    (value) => {
      return value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://');
    },
    {
      message: 'Debe ser una URL externa válida o una ruta pública local que empiece con /',
    }
  );

export const HERO_LAYOUTS = ['default', 'titles'] as const;
export type HeroLayout = typeof HERO_LAYOUTS[number];

export const HeroTitleItemSchema = z.object({
  text: z.string().min(1, 'El texto del título es obligatorio'),
  className: z.string().optional(),
});

export const HeroSchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  url: PublicAssetPathSchema,
  ctaText: z.string(),
  layout: z.enum(HERO_LAYOUTS).optional(),
  titles: z.array(HeroTitleItemSchema).length(3).optional(),
  validHeroLayouts: z.array(z.enum(HERO_LAYOUTS)).optional(),
});

export const ColorsSchema = z.object({
  primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código HEX válido'),
  secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código HEX válido'),
  accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código HEX válido'),
  background: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código HEX válido'),
  text: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código HEX válido'),
});

export const TypographySchema = z.object({
  heading: z.enum(ALLOWED_FONTS, {
    errorMap: () => ({ message: `Tipografía de títulos no permitida. Catálogo: ${ALLOWED_FONTS.join(', ')}` }),
  }),
  body: z.enum(ALLOWED_FONTS, {
    errorMap: () => ({ message: `Tipografía de cuerpo no permitida. Catálogo: ${ALLOWED_FONTS.join(', ')}` }),
  }),
});

export const ServiceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'El título del servicio es obligatorio'),
  description: z.string().min(1, 'La descripción del servicio es obligatoria'),
  icon: z.string().min(1, 'El nombre del icono es obligatorio (lucide-react)'),
});

export const EquipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'El nombre del equipo es obligatorio'),
  category: z.string().min(1, 'La categoría del equipo es obligatoria'),
  icon: z.string().min(1, 'El icono del equipo es obligatorio'),
});

export const VideoSchema = z.object({
  id: z.string().min(1),
  youtubeId: z.string().min(1, 'El ID de video de YouTube es obligatorio'),
  title: z.string().min(1, 'El título del video es obligatorio'),
  thumbnail: z.string().url('La miniatura del video debe ser una URL válida').optional(),
});

export const SocialsSchema = z.object({
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  soundcloud: z.string().url().optional(),
  spotify: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  facebook: z.string().url().optional(),
}).partial();

export const FAQSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1, 'La pregunta es obligatoria'),
  answer: z.string().min(1, 'La respuesta es obligatoria'),
});

export const ContactFormSchema = z.object({
  enabled: z.boolean(),
  title: z.string(),
  description: z.string(),
});

export const NavbarTextsSchema = z.object({
  bio: z.string().optional(),
  services: z.string().optional(),
  equipment: z.string().optional(),
  gallery: z.string().optional(),
  videos: z.string().optional(),
  songs: z.string().optional(),
  faq: z.string().optional(),
  tours: z.string().optional(),
  tourTable: z.string().optional(),
  contact: z.string().optional(),
  ctaButton: z.string().optional(),
});

export const ContactFormTextsSchema = z.object({
  sectionTag: z.string().optional(),
  nameLabel: z.string().optional(),
  namePlaceholder: z.string().optional(),
  emailLabel: z.string().optional(),
  emailPlaceholder: z.string().optional(),
  messageLabel: z.string().optional(),
  messagePlaceholder: z.string().optional(),
  successTitle: z.string().optional(),
  sendAnotherButton: z.string().optional(),
  sendingText: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  validationError: z.string().optional(),
  apiError: z.string().optional(),
  networkError: z.string().optional(),
});

export const HeroTextsSchema = z.object({
  badge: z.string().optional(),
  scrollIndicator: z.string().optional(),
});

export const BioTextsBadgeSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const BioTextsSchema = z.object({
  sectionTag: z.string().optional(),
  headingPrefix: z.string().optional(),
  heading: z.string().optional(),
  cardTitle: z.string().optional(),
  description: z.string().optional(),
  badges: z.array(BioTextsBadgeSchema).optional(),
});

export const ServicesTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
});

export const FAQTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
});

export const EquipmentTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
});

export const GalleryTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  overlayLabel: z.string().optional(),
});

export const VideosTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  playLabel: z.string().optional(),
  subtitleLabel: z.string().optional(),
});

export const FooterTextsSchema = z.object({
  copyrightTemplate: z.string().optional(),
  tagline: z.string().optional(),
  socialLabel: z.string().optional(),
  creditPrefix: z.string().optional(),
  creditBrand: z.string().optional(),
  creditTagline: z.string().optional(),
});

export const SongSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'El título de la canción es obligatorio'),
  url: z.string().url('Debe ser una URL válida de Spotify, Apple Music o SoundCloud'),
});

export const SongsTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
});

export const TourEventSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1, 'La fecha del evento es obligatoria'),
  venue: z.string().min(1, 'El nombre del venue es obligatorio'),
  location: z.string().min(1, 'La ubicación es obligatoria'),
  country: z.string().min(1, 'El país es obligatorio'),
  countryCode: z.string().length(2, 'El código de país debe tener 2 caracteres (ISO alpha-2)').optional(),
  ticketUrl: z.string().url('Debe ser una URL válida').optional(),
  status: z.enum(['finalizado', 'en_venta', 'agotado', 'proximamente']).optional(),
});

export const ToursTextsSchema = z.object({
  sectionTag: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  enVentaLabel: z.string().optional(),
  finalizadoLabel: z.string().optional(),
  agotadoLabel: z.string().optional(),
  proximamenteLabel: z.string().optional(),
});

export const WhatsAppSchema = z.object({
  phoneNumber: z.string().optional(),
  buttonText: z.string().optional(),
  message: z.string().optional(),
  enabled: z.boolean().optional(),
});

export const SEOSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  ogImage: z.string().url().optional(),
});

export const SECTION_IDS = [
  'hero',
  'bio',
  'services',
  'equipment',
  'gallery',
  'videos',
  'songs',
  'faq',
  'tours',
  'tour_table',
  'contact',
] as const;

export type SectionId = typeof SECTION_IDS[number];

export const LandingConfigSchema = z.object({
  artisticName: z.string().min(2, 'El nombre artístico debe tener al menos 2 caracteres'),
  slogan: z.string(),
  description: z.string(),
  logo: z.string(),
  hero: HeroSchema,
  designPreset: z.string().min(1, 'Debes seleccionar un designPreset (ej: "gold")'),
  validDesignPresets: z.array(z.string()).optional(),
  services: z.array(ServiceSchema).max(10, 'Límite de servicios alcanzado (máximo 10)').optional(),
  equipment: z.array(EquipmentSchema).max(20, 'Límite de equipamientos alcanzado (máximo 20)').optional(),
  gallery: z.array(PublicAssetPathSchema).max(10).optional(),
  videos: z.array(VideoSchema).max(10, 'Límite de videos alcanzado (máximo 10)').optional(),
  socials: SocialsSchema.optional(),
  faq: z.array(FAQSchema).max(10, 'Límite de FAQs alcanzado (máximo 10 preguntas)').optional(),
  tours: z.array(TourEventSchema).max(20, 'Límite de eventos alcanzado (máximo 20)').optional(),
  toursTexts: ToursTextsSchema.optional(),
  tourTable: z.array(TourEventSchema).max(20, 'Límite de eventos alcanzado (máximo 20)').optional(),
  tourTableTexts: ToursTextsSchema.optional(),
  contactForm: ContactFormSchema,
  navbarTexts: NavbarTextsSchema.optional(),
  contactFormTexts: ContactFormTextsSchema.optional(),
  heroTexts: HeroTextsSchema.optional(),
  bioTexts: BioTextsSchema.optional(),
  servicesTexts: ServicesTextsSchema.optional(),
  faqTexts: FAQTextsSchema.optional(),
  songs: z.array(SongSchema).max(10, 'Límite de canciones alcanzado (máximo 10)').optional(),
  songsTexts: SongsTextsSchema.optional(),
  equipmentTexts: EquipmentTextsSchema.optional(),
  galleryTexts: GalleryTextsSchema.optional(),
  videosTexts: VideosTextsSchema.optional(),
  footerTexts: FooterTextsSchema.optional(),
  whatsapp: WhatsAppSchema.optional(),
  contactButtonText: z.string(),
  confirmationPopupText: z.string().min(1, 'El texto del modal de confirmación es obligatorio'),
  destinationEmail: z.string().email('El correo de destino para leads debe ser una dirección válida').optional(),
  seo: SEOSchema,
  favicon: z.string().optional(),
  sectionOrder: z.array(z.enum(SECTION_IDS)).optional(),
  sectionMaxWidth: z.string().default('1152px'),
  validSectionIds: z.array(z.enum(SECTION_IDS)).optional(),
});

export type LandingConfig = z.infer<typeof LandingConfigSchema> & {
  colors: ColorsConfig;
  typography: TypographyConfig;
  tokens: DesignTokens;
};

export type HeroConfig = z.infer<typeof HeroSchema>;
export type ColorsConfig = z.infer<typeof ColorsSchema>;
export type TypographyConfig = z.infer<typeof TypographySchema>;
export type ServiceConfig = z.infer<typeof ServiceSchema>;
export type EquipmentConfig = z.infer<typeof EquipmentSchema>;
export type VideoConfig = z.infer<typeof VideoSchema>;
export type SocialsConfig = z.infer<typeof SocialsSchema>;
export type FAQConfig = z.infer<typeof FAQSchema>;
export type ContactFormConfig = z.infer<typeof ContactFormSchema>;
export type NavbarTextsConfig = z.infer<typeof NavbarTextsSchema>;
export type ContactFormTextsConfig = z.infer<typeof ContactFormTextsSchema>;
export type HeroTextsConfig = z.infer<typeof HeroTextsSchema>;
export type BioTextsConfig = z.infer<typeof BioTextsSchema>;
export type ServicesTextsConfig = z.infer<typeof ServicesTextsSchema>;
export type FAQTextsConfig = z.infer<typeof FAQTextsSchema>;
export type FooterTextsConfig = z.infer<typeof FooterTextsSchema>;
export type SongConfig = z.infer<typeof SongSchema>;
export type SongsTextsConfig = z.infer<typeof SongsTextsSchema>;
export type TourEventConfig = z.infer<typeof TourEventSchema>;
export type ToursTextsConfig = z.infer<typeof ToursTextsSchema>;
export type EquipmentTextsConfig = z.infer<typeof EquipmentTextsSchema>;
export type GalleryTextsConfig = z.infer<typeof GalleryTextsSchema>;
export type VideosTextsConfig = z.infer<typeof VideosTextsSchema>;
export type WhatsAppConfig = z.infer<typeof WhatsAppSchema>;
export type SEOConfig = z.infer<typeof SEOSchema>;

