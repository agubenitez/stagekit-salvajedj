import { createEmailProvider } from './factory';
import { type EmailMessage, type EmailResult } from './types';

/**
 * Coordinador central del Servicio de Correos.
 * Inicializa de forma perezosa (lazy load) y delegada el proveedor correcto usando la fábrica,
 * permitiendo transicionar de un ambiente de simulación local (Placeholder) a producción (Resend, SMTP, SES)
 * simplemente modificando la variable de entorno EMAIL_PROVIDER.
 */
class EmailServiceCoordinator {
  private activeProvider = createEmailProvider();

  /**
   * Procesa y envía un correo electrónico utilizando el proveedor activo configurado.
   */
  async sendEmail(message: EmailMessage): Promise<EmailResult> {
    try {
      return await this.activeProvider.send(message);
    } catch (error: any) {
      console.error('🚨 Fallo crítico al intentar procesar el correo de contacto:', error.message);
      return {
        success: false,
        error: error?.message || 'Error inesperado al intentar transmitir el correo.',
      };
    }
  }
}

export const emailService = new EmailServiceCoordinator();
