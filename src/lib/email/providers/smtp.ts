import nodemailer from 'nodemailer';
import { type EmailMessage, type EmailProvider, type EmailResult } from '../types';

export class SmtpEmailProvider implements EmailProvider {
  private transport: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error(
        'Faltan variables de entorno SMTP. Requeridas: SMTP_HOST, SMTP_USER, SMTP_PASS.'
      );
    }

    this.transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    try {
      const htmlBody = this.buildHtml(message);

      const info = await this.transport.sendMail({
        from: process.env.SMTP_USER,
        to: message.recipientEmail,
        replyTo: message.email,
        subject: `Nuevo contacto de ${message.name} — ${message.artisticName}`,
        html: htmlBody,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Error al enviar el correo SMTP.',
      };
    }
  }

  private buildHtml(msg: EmailMessage): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#d4af37;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#09090b;font-size:22px;">Nuevo Lead desde tu Landing</h1>
              <p style="margin:4px 0 0;color:#09090b;font-size:14px;opacity:0.8;">${msg.artisticName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <span style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Nombre</span>
                    <p style="margin:4px 0 0;font-size:16px;color:#18181b;">${msg.name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <span style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Email</span>
                    <p style="margin:4px 0 0;font-size:16px;color:#18181b;">
                      <a href="mailto:${msg.email}" style="color:#d4af37;text-decoration:none;">${msg.email}</a>
                    </p>
                  </td>
                </tr>
                ${msg.message ? `
                <tr>
                  <td style="padding-bottom:16px;">
                    <span style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:1px;">Mensaje</span>
                    <p style="margin:4px 0 0;font-size:16px;color:#18181b;line-height:1.5;">${msg.message}</p>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding-top:16px;border-top:1px solid #e4e4e7;">
                    <p style="margin:0;font-size:12px;color:#a1a1aa;">
                      Este lead fue enviado desde el formulario de contacto de tu landing page.
                      Podés responder directamente a este correo para contactar al cliente.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}
