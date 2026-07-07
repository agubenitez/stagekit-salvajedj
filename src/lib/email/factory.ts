import { type EmailProvider } from './types';
import { PlaceholderEmailProvider } from './providers/placeholder';
import { SmtpEmailProvider } from './providers/smtp';

/**
 * Catálogo de tipos de proveedores de correo soportados oficialmente.
 */
export enum EmailProviderType {
  PLACEHOLDER = 'placeholder',
  RESEND = 'resend',
  SMTP = 'smtp',
  SES = 'ses',
}

/**
 * Fábrica (Factory Pattern) para la instanciación dinámica de proveedores de email.
 * Agregar un nuevo proveedor de correo electrónico en el futuro solo requiere:
 * 1. Crear su clase implementando la interfaz EmailProvider en src/lib/email/providers/
 * 2. Registrar el nuevo caso en este switch-case.
 */
export function createEmailProvider(providerType?: string): EmailProvider {
  const type = (providerType || process.env.EMAIL_PROVIDER || '').toLowerCase();

  switch (type) {
    case EmailProviderType.PLACEHOLDER:
    default:
      // Fallback seguro por defecto o por falta de configuración
      return new PlaceholderEmailProvider();

    case EmailProviderType.SMTP:
      return new SmtpEmailProvider();
  }
}
