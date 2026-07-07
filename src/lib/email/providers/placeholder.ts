import { type EmailMessage, type EmailProvider, type EmailResult } from '../types';

/**
 * Proveedor de correo electrónico temporal (Placeholder).
 * Simula el envío de correos registrando información detallada en los logs del servidor.
 * Evita el acoplamiento y costos antes de configurar un proveedor en producción.
 */
export class PlaceholderEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<EmailResult> {
    // Simulamos latencia de red típica de un servicio de correos real (700ms - 1.2s)
    const simulatedDelay = Math.floor(Math.random() * 500) + 700;
    await new Promise((resolve) => setTimeout(resolve, simulatedDelay));

    // Validación básica en el proveedor por redundancia de seguridad
    if (!message.email || !message.name || !message.recipientEmail) {
      return {
        success: false,
        error: 'Datos obligatorios ausentes en el cuerpo del correo de contacto.',
      };
    }

    // Registro elegante en logs del servidor (no visible en consola del navegador por ser API route)
    console.log('=====================================================');
    console.log('📧 [SIMULADOR EMAIL - LANDINGDJ] NUEVO LEAD ENTRANTE:');
    console.log(`- Artista Destino : ${message.artisticName}`);
    console.log(`- Enviar Lead A   : ${message.recipientEmail}`);
    console.log(`- Nombre Cliente  : ${message.name}`);
    console.log(`- Email Cliente   : ${message.email}`);
    console.log(`- Mensaje Enviado : ${message.message || '(Ninguno)'}`);
    console.log('=====================================================');

    return {
      success: true,
      messageId: `mock-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
  }
}
