/**
 * Datos requeridos para el envío de un correo electrónico a través del formulario de contacto.
 */
export interface EmailMessage {
  name: string;
  email: string;
  message?: string;
  recipientEmail: string;
  artisticName: string;
}

/**
 * Respuesta unificada para la operación de envío de correos.
 * Permite que el cliente reciba un contrato idéntico sin importar el proveedor real.
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Interfaz/Contrato para los proveedores de correo electrónico.
 * Cualquier nueva integración (Resend, SendGrid, AWS SES) deberá implementar este contrato.
 */
export interface EmailProvider {
  /**
   * Envía un mensaje estructurado y retorna un resultado unificado.
   */
  send(message: EmailMessage): Promise<EmailResult>;
}
