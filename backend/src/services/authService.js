const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { prisma } = require("../config/database");
const { sanitizeUser } = require("../utils/helpers");
const tokenService = require("./tokenService");
const emailService = require("./emailService");
const fileUploadService = require("./fileUploadService");

class AuthService {
  constructor() {
    this.prisma = prisma;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });
  }
  async register(userData) {
    const { email, password, name } = userData;

    // cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = tokenService.generateVerificationToken();
    const verificationExpires = tokenService.getVerificationExpiry();

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    // Generate auth token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
      message:
        "Registrasi berhasil. Silakan cek email Anda untuk verifikasi akun.",
    };
  }

  async verifyEmail(token) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Token verifikasi tidak valid atau telah kedaluwarsa");
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    // Send Welcome Email
    await emailService.sendWelcomeEmail(updatedUser);

    return {
      user: this.sanitizeUser(updatedUser),
      message: "Email berhasil diverifikasi",
    };
  }

  async resendVerificationEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User dengan email tersebut tidak ditemukan");
    }

    if (user.isEmailVerified) {
      throw new Error("Email sudah terverifikasi");
    }

    // Generate new verification token
    const verificationToken = tokenService.generateVerificationToken();
    const verificationExpires = tokenService.getVerificationExpiry();

    // update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    return { message: "Email verifikasi telah dikirim ulang" };
  }

  async forgotPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user not found (for security)
      return {
        message: "Jika email ada, tautan reset password telah dikirim.",
      };
    }

    // Generate reset token
    const resetToken = tokenService.generateResetToken();
    const resetExpires = tokenService.getResetTokenExpiry();

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send password reset email
    await emailService.sendPasswordResetEmail(user, resetToken);

    return {
      message: "Jika email ada, tautan reset password telah dikirim.",
    };
  }

  async resetPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });
    if (!user) {
      throw new Error(
        "Token reset password tidak valid atau telah kedaluwarsa"
      );
    }

    // hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: "Password berhasil direset" };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Email atau kata sandi salah.");
    }

    if (user.isActive === false) {
      throw new Error("Akun user tidak aktif");
    }

    // check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Email atau kata sandi salah.");
    }

    // check if email is verified
    if (!user.isEmailVerified) {
      throw new Error("silakan verifikasi email Anda sebelum login");
    }

    // Admin TOTP flow
    if (user.role === "admin") {
      // If admin, don't return full token. Return a temporary token for 2FA.
      const tempToken = jwt.sign({ id: user.id, isTemp: true }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
      return {
        requireTotp: true,
        isTotpEnabled: user.isTotpEnabled,
        tempToken,
      };
    }

    // Normal user flow
    // generate token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  // TOTP Methods
  async setupTotp(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const secret = speakeasy.generateSecret({
      name: `MindGarden Admin (${user.email})`,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret.base32 },
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCodeUrl };
  }

  async verifyTotpSetup(userId, token) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.totpSecret) throw new Error("TOTP setup not initialized");

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: token,
      window: 2, // toleransi ±1 periode (60 detik) untuk perbedaan jam
    });

    if (!verified) throw new Error("Kode TOTP tidak valid");

    await prisma.user.update({
      where: { id: userId },
      data: { isTotpEnabled: true },
    });

    return { message: "TOTP berhasil diaktifkan" };
  }

  async validateTotpLogin(tempToken, token) {
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (!decoded.isTemp) throw new Error("Invalid token type");
    } catch (err) {
      throw new Error("Token sesi kedaluwarsa atau tidak valid. Silakan login kembali.");
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || !user.totpSecret) throw new Error("User atau TOTP tidak ditemukan");

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: token,
      window: 2, // toleransi ±1 periode (60 detik) untuk perbedaan jam
    });

    if (!verified) throw new Error("Kode TOTP salah");

    const finalToken = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token: finalToken,
    };
  }

  sanitizeUser(user) {
    const {
      password,
      emailVerification,
      passwordResetToken,
      passwordResetExpires,
      totpSecret,
      ...sanitizedUser
    } = user;
    return sanitizedUser;
  }

  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    return user;
  }

  async updateProfile(userId, updateData, file) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User tidak ditemukan");

      let avatarUrl = user.avatar;

      // jika avatar baru berhasil diupload (sudah dihandle oleh multer-storage-cloudinary)
      if (file) {
        // hapus avatar lama dari Cloudinary jika ada
        if (user.avatar && user.avatar.includes("cloudinary.com")) {
          const oldPublicId = fileUploadService.extractPublicId(user.avatar);
          if (oldPublicId) {
            await fileUploadService.deleteImage(oldPublicId);
          }
        }

        // URL avatar baru adalah path dari file yang sudah diupload multer ke Cloudinary
        avatarUrl = file.path;
      }

      const allowedUpdates = ["name"];
      const filteredData = Object.keys(updateData)
        .filter((key) => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      // Update avatar url
      filteredData.avatar = avatarUrl;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: filteredData,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Profile Upload Gagal: ${error.message}`);
    }
  }
  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User tidak ditemukan");

    // check old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new Error("Kata sandi lama salah");
    }

    // hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Kata sandi berhasil diubah" };
  }

  async deleteAccount(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User tidak ditemukan");

    // Hapus avatar dari Cloudinary jika ada
    if (user.avatar && user.avatar.includes("cloudinary.com")) {
      try {
        const publicId = fileUploadService.extractPublicId(user.avatar);
        if (publicId) {
          await fileUploadService.deleteImage(publicId);
        }
      } catch (e) {
        console.error("Gagal hapus avatar saat delete account:", e);
      }
    }

    // Hapus user (Prisma cascade akan menangani relasi jika dikonfigurasi, atau kita hapus manual)
    // Berdasarkan schema.prisma, relasi biasanya di-handle oleh onDelete: Cascade
    await prisma.user.delete({ where: { id: userId } });

    return { message: "Akun berhasil dihapus selamanya" };
  }
}

module.exports = new AuthService();
