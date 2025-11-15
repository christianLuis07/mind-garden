const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");
const { sanitizeUser } = require("../utils/helpers");
const tokenService = require("./tokenService");
const emailService = require("./emailService");

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

    // generate token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  sanitizeUser(user) {
    const {
      password,
      emailVerification,
      passwordResetToken,
      passwordResetExpires,
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

  async updateProfile(userId, updateData) {
    const allowedUpdates = ["name", "avatar"];
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const user = await prisma.user.update({
      where: { id: userId },
      data: filteredData,
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
}

module.exports = new AuthService();
