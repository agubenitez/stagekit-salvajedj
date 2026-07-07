import { NextRequest, NextResponse } from 'next/server';
import { getLandingConfig } from '@/lib/config/loader';
import { emailService } from '@/lib/email/service';

/**
 * Endpoint de API REST para gestionar el envío de leads del formulario de contacto.
 * 
 * Lógica totalmente desacoplada:
 * 1. El cliente web (frontend) envía solo { name, email, message }.
 * 2. El servidor Next.js lee de forma segura la configuración local (server-side)
 *    para obtener el correo destino y el nombre artístico del DJ, protegiendo
 *    esta información contra manipulaciones del cliente.
 * 3. Se delega al Email Service Coordinator el despacho del lead.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validación básica inicial de los parámetros enviados por el cliente
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'El nombre es obligatorio y debe tener al menos 2 caracteres.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Debe ingresar una dirección de correo electrónico válida.' },
        { status: 400 }
      );
    }

    // Cargamos la configuración segura del servidor para inyectar datos del receptor
    const config = getLandingConfig();

    if (!config.destinationEmail) {
      return NextResponse.json(
        { success: false, error: 'La landing no se encuentra configurada para recibir correos actualmente.' },
        { status: 503 }
      );
    }

    // Despachamos el correo usando el coordinador desacoplado
    const emailResult = await emailService.sendEmail({
      name: name.trim(),
      email: email.trim(),
      message: message ? message.trim() : undefined,
      recipientEmail: config.destinationEmail,
      artisticName: config.artisticName,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'No se pudo procesar tu mensaje.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: config.confirmationPopupText,
      messageId: emailResult.messageId,
    });

  } catch (error: any) {
    console.error('🚨 Error en API Route de Contacto:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Ocurrió un error interno del servidor al procesar el contacto.' },
      { status: 500 }
    );
  }
}
