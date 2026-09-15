require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

function validatePassword(password) {
  if (!password || password.length < 12) {
    throw new Error("Password admin harus memiliki panjang minimal 12 karakter!");
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    throw new Error(
      "Password admin harus merupakan kombinasi huruf besar, huruf kecil, angka, dan karakter khusus!"
    );
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Super Admin";

  if (!email || !password) {
    console.error("❌ ERROR: ADMIN_EMAIL dan ADMIN_PASSWORD harus diisi di file .env!");
    process.exit(1);
  }

  try {
    validatePassword(password);
  } catch (err) {
    console.error(`❌ Validasi Password Gagal: ${err.message}`);
    process.exit(1);
  }

  try {
    console.log(`🔒 Menyiapkan akun admin untuk: ${email}...`);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "admin",
          isEmailVerified: true,
          isActive: true,
        },
      });
      console.log(`✅ Akun admin (${email}) berhasil diperbarui dengan role admin dan password baru.`);
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "admin",
          isEmailVerified: true,
          isActive: true,
        },
      });
      console.log(`✅ Akun admin (${email}) berhasil dibuat.`);
    }
  } catch (error) {
    console.error("❌ Gagal membuat akun admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
