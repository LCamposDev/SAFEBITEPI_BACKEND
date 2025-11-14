const nodemailer = require('nodemailer');

/**
 * Configuração do transporter de email
 */
const createTransporter = () => {
  // Se não houver configuração de email, retorna null (modo desenvolvimento)
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Envia email de recuperação de senha
 * @param {string} email - Email do destinatário
 * @param {string} token - Token de recuperação
 * @returns {Promise<Object>} Resultado do envio
 */
const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();

  // Se não houver transporter (email não configurado), apenas loga
  if (!transporter) {
    console.log('📧 [DEV MODE] Email de recuperação de senha:');
    console.log(`   Para: ${email}`);
    console.log(`   Token: ${token}`);
    console.log(`   Link: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`);
    return { success: true, devMode: true };
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"SafeBite" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperação de Senha - SafeBite',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .token {
            background-color: #e8e8e8;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperação de Senha</h1>
          </div>
          <div class="content">
            <p>Olá!</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta SafeBite.</p>
            <p>Clique no botão abaixo para redefinir sua senha:</p>
            <a href="${resetUrl}" class="button">Redefinir Senha</a>
            <p>Ou copie e cole o link abaixo no seu navegador:</p>
            <div class="token">${resetUrl}</div>
            <p><strong>Este link expira em 1 hora.</strong></p>
            <p>Se você não solicitou esta recuperação de senha, ignore este email.</p>
            <div class="footer">
              <p>Este é um email automático, por favor não responda.</p>
              <p>SafeBite - Plataforma de Receitas</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Recuperação de Senha - SafeBite

      Olá!

      Recebemos uma solicitação para redefinir a senha da sua conta SafeBite.

      Acesse o link abaixo para redefinir sua senha:
      ${resetUrl}

      Este link expira em 1 hora.

      Se você não solicitou esta recuperação de senha, ignore este email.

      SafeBite - Plataforma de Receitas
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de recuperação de senha');
  }
};

/**
 * Envia email de verificação de conta
 * @param {string} email - Email do destinatário
 * @param {string} token - Token de verificação
 * @returns {Promise<Object>} Resultado do envio
 */
const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 [DEV MODE] Email de verificação:');
    console.log(`   Para: ${email}`);
    console.log(`   Token: ${token}`);
    console.log(`   Link: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`);
    return { success: true, devMode: true };
  }

  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SafeBite" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifique seu email - SafeBite',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2196F3;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Verifique seu Email</h1>
          </div>
          <div class="content">
            <p>Olá!</p>
            <p>Obrigado por se cadastrar no SafeBite!</p>
            <p>Clique no botão abaixo para verificar seu email:</p>
            <a href="${verifyUrl}" class="button">Verificar Email</a>
            <p>Ou copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all;">${verifyUrl}</p>
            <div class="footer">
              <p>Este é um email automático, por favor não responda.</p>
              <p>SafeBite - Plataforma de Receitas</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de verificação');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail
};

