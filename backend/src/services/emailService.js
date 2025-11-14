const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent successfully", {
        to,
        subject,
        messageId: info.messageId,
      });
      return true;
    } catch (error) {
      logger.error("Email sending failed", {
        error: error.message,
        to,
        subject,
      });
      return false;
    }
  }

  // Email template untuk verification
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 MindGarden</h1>
            <p>Verifikasi Alamat Email Anda</p>
          </div>
          <div class="content">
            <h2>Halo ${user.name}!</h2>
            <p>Terima kasih telah bergabung dengan MindGarden.
                Silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini untuk menyelesaikan proses pendaftaran dan memulai perjalanan Anda menuju kesehatan mental yang lebih baik.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verifikasi Email</a>
            </div>
            
            <p>Jika tombol tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut ke browser Anda:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            
            <p>Tautan verifikasi ini akan kedaluwarsa dalam 24 jam.</p>
            <p>Jika Anda tidak membuat akun di MindGarden, silakan abaikan email ini.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 MindGarden. All rights reserved.</p>
            <p>Email ini dikirim kepada ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(
      user.email,
      "Verifikasi Akun MindGarden Anda",
      html
    );
  }

  // Email template untuk password reset
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 MindGarden</h1>
            <p>Atur Ulang Kata Sandi Anda</p>
          </div>
          <div class="content">
            <h2>Halo ${user.name}!</h2>
            <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun MindGarden Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Atur Ulang Kata Sandi</a>
            </div>
            
            <p>Jika tombol tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut ke browser Anda:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
            
            <p>Tautan pengaturan ulang kata sandi ini akan kedaluwarsa dalam 1 jam.</p>
            <p>Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini dan kata sandi Anda akan tetap aman.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 MindGarden. All rights reserved.</p>
            <p>Email ini dikirim kepada ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(
      user.email,
      "Atur Ulang Kata Sandi MindGarden",
      html
    );
  }

  // Email template untuk welcome setelah verification
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4facfe; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Selamat Datang di MindGarden!</h1>
            <p>Perjalanan kesehatan mental Anda dimulai sekarang</p>
          </div>
          <div class="content">
            <h2>Halo ${user.name}!</h2>
            <p>Selamat! Email Anda berhasil diverifikasi dan akun MindGarden Anda sekarang aktif.</p>
            
            <p>Berikut hal-hal yang dapat Anda lakukan untuk memulai:</p>
            
            <div class="feature">
              <strong>📊 Lacak Mood Anda</strong>
              <p>Catat suasana hati harian dan temukan pola dalam kesejahteraan emosional Anda.</p>
            </div>
            
            <div class="feature">
              <strong>📝 Tulis Jurnal</strong>
              <p>Tulis pengalaman Anda dengan analisis sentimen bawaan.</p>
            </div>
            
            <div class="feature">
              <strong>🌬️ Latihan Pernapasan</strong>
              <p>Gunakan latihan pernapasan terpandu untuk membantu mengurangi stres dan kecemasan.</p>
            </div>
            
            <div class="feature">
              <strong>👥 Bergabung dengan Grup Dukungan</strong>
              <p>Terhubung dengan pengguna lain dalam komunitas dukungan yang aman dan dimoderasi.</p>
            </div>
            
            <p>Kami senang dapat menemani perjalanan Anda menuju kesehatan mental yang lebih baik!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 MindGarden. Christian Luis.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(
      user.email,
      "Selamat Datang di MindGarden!",
      html
    );
  }
}

module.exports = new EmailService();
