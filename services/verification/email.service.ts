/**
 * Servicio de envío de correos electrónicos
 * 
 * Este servicio proporciona funciones para enviar correos electrónicos
 * a través de diferentes proveedores (Resend, SendGrid, etc.)
 * 
 * Configuración requerida:
 * - EMAIL_PROVIDER: resend, sendgrid, smtp, etc.
 * - EMAIL_FROM: correo desde el cual se enviarán los mensajes
 * - Credenciales específicas del proveedor en variables de entorno
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envía un correo de verificación con el código
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  userName?: string
): Promise<SendEmailResult> {
  try {
    const emailContent = generateVerificationEmailHTML(code, userName);

    return await sendEmail({
      to: email,
      subject: 'Código de Verificación - CRM CROV',
      html: emailContent,
      text: `Tu código de verificación es: ${code}\n\nEste código expira en 10 minutos.`,
    });
  } catch (error: any) {
    console.error('Error al enviar email de verificación:', error);
    return {
      success: false,
      error: 'No se pudo enviar el correo de verificación',
    };
  }
}

/**
 * Envía un correo de bienvenida cuando la cuenta está verificada
 */
export async function sendWelcomeEmail(email: string, userName?: string): Promise<SendEmailResult> {
  try {
    const emailContent = generateWelcomeEmailHTML(userName);

    return await sendEmail({
      to: email,
      subject: '¡Bienvenido a CRM CROV!',
      html: emailContent,
      text: `¡Bienvenido ${userName || 'a CRM CROV'}! Tu cuenta ha sido verificada y ya puedes acceder a todas las funcionalidades.`,
    });
  } catch (error: any) {
    console.error('Error al enviar email de bienvenida:', error);
    return {
      success: false,
      error: 'No se pudo enviar el correo de bienvenida',
    };
  }
}

/**
 * Función principal para enviar correos electrónicos
 * Implementa lógica según el proveedor configurado
 */
async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  // Por ahora, implementamos un servicio de prueba
  // En producción, conectar con un proveedor real (Resend, SendGrid, etc.)

  try {
    // Simulación de envío de correo (reemplazar con lógica real)
    console.log(`📧 Correo enviado a: ${options.to}`);
    console.log(`   Asunto: ${options.subject}`);

    // En un ambiente real, aquí iría el código para:
    // - Resend: await resend.emails.send(...)
    // - SendGrid: await sgMail.send(...)
    // - NodeMailer: await transporter.sendMail(...)

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error: any) {
    console.error('Error al enviar correo:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Genera el HTML del correo de verificación
 */
function generateVerificationEmailHTML(code: string, userName?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Código de Verificación</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background-color: white; padding: 30px; }
        .code-box { background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea; font-family: 'Courier New', monospace; }
        .footer { background-color: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; color: #92400e; }
        .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verificación de Cuenta</h1>
          <p>CRM CROV</p>
        </div>
        <div class="content">
          <p>¡Hola ${userName || 'usuario'}!</p>
          <p>Para completar tu registro y activar tu cuenta, ingresa el siguiente código de verificación:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p style="text-align: center; color: #666; font-size: 14px;">Este código expira en <strong>10 minutos</strong></p>
          <div class="warning">
            <strong>⚠️ Seguridad:</strong> Nunca compartas este código con nadie. Nosotros nunca te pediremos que lo hagas.
          </div>
          <p>Si no solicitaste este código, puedes ignorar este correo.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 CRM CROV. Todos los derechos reservados.</p>
          <p>Si tienes preguntas, contacta a nuestro equipo de soporte.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Genera el HTML del correo de bienvenida
 */
function generateWelcomeEmailHTML(userName?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a CRM CROV</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background-color: white; padding: 30px; }
        .features { margin: 30px 0; }
        .feature { display: flex; margin: 15px 0; padding: 15px; background-color: #f9fafb; border-radius: 4px; }
        .feature-icon { font-size: 24px; margin-right: 15px; }
        .footer { background-color: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Bienvenido!</h1>
          <p>Tu cuenta ha sido verificada exitosamente</p>
        </div>
        <div class="content">
          <p>¡Hola ${userName || 'usuario'}!</p>
          <p>Tu cuenta en CRM CROV ha sido verificada y ahora tienes acceso completo a todas nuestras funcionalidades.</p>
          <div class="features">
            <div class="feature">
              <div class="feature-icon">📊</div>
              <div>
                <strong>Dashboard</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Visualiza tus métricas y estadísticas en tiempo real.</p>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">🏢</div>
              <div>
                <strong>Gestión de Sucursales</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Administra todas tus sucursales desde un solo lugar.</p>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">👥</div>
              <div>
                <strong>Gestión de Usuarios</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Controla los permisos y roles de tu equipo.</p>
              </div>
            </div>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://crm-crov.com'}/dashboard" class="button">Ir al Dashboard</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 CRM CROV. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export { sendEmail };
