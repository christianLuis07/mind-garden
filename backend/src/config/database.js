const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  errorFormat: "colorless",
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database berhasil terhubung via prisma");
  } catch (error) {
    console.error("Gagal terhubung ke database:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database connection ditutup");
  process.exit(0);
});

module.exports = { prisma, connectDB };
