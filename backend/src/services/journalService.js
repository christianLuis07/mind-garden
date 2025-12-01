const { prisma } = require("../config/database");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Pastikan install: npm install uuid

class JournalService {
  async saveFiles(files) {
    console.log("=== DEBUG UPLOAD START ===");
    console.log("1. Cek CWD (Lokasi Server Berjalan):", process.cwd());

    if (!files || files.length === 0) {
      console.log(
        "2. PERINGATAN: Tidak ada file yang diterima service (files array kosong/null)"
      );
      console.log("=== DEBUG UPLOAD END ===");
      return [];
    }

    console.log(`2. Menerima ${files.length} file untuk disimpan.`);

    // Gunakan path absolute
    const uploadDir = path.join(process.cwd(), "uploads", "journal");
    console.log("3. Target Folder Penyimpanan:", uploadDir);

    // Buat folder jika belum ada
    if (!fs.existsSync(uploadDir)) {
      console.log("4. Folder belum ada. Membuat folder...");
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("   - Folder berhasil dibuat.");
      } catch (err) {
        console.error("   - ERROR Gagal membuat folder:", err);
      }
    } else {
      console.log("4. Folder sudah ada.");
    }

    const savedFilePaths = [];

    for (const file of files) {
      try {
        const safeName = uuidv4() + path.extname(file.originalname);
        const filepath = path.join(uploadDir, safeName);

        console.log(`5. Menyimpan file ke disk: ${filepath}`);
        await fs.promises.writeFile(filepath, file.buffer);
        console.log("   - Sukses tulis ke disk.");

        savedFilePaths.push(`/uploads/journal/${safeName}`);
      } catch (err) {
        console.error("   - ERROR saat menulis file:", err);
      }
    }

    console.log("=== DEBUG UPLOAD END ===");
    return savedFilePaths;
  }

  async createJournalEntry(userId, journalData, files) {
    const { title, content, tags, isPublic } = journalData;

    let imageUrls = [];
    try {
      imageUrls = await this.saveFiles(files);
    } catch (error) {
      console.error("Gagal menyimpan file:", error);
    }

    const sentiment = this.analyzeSentiment(content);

    const isPublicBool = isPublic === "true" || isPublic === true;

    return await prisma.journalEntry.create({
      data: {
        userId,
        title,
        content,
        tags: tags || [],
        sentiment,
        isPublic: isPublicBool,
        images: imageUrls,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async updateJournalEntry(userId, entryId, updateData, files) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!journalEntry) throw new Error("Journal entry not found");

    let newImages = [];
    if (files && files.length > 0) {
      newImages = await this.saveFiles(files);
    }

    const allowedUpdates = ["title", "content", "tags", "isPublic"];
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        if (key === "isPublic") {
          obj[key] = updateData[key] === "true" || updateData[key] === true;
        } else {
          obj[key] = updateData[key];
        }
        return obj;
      }, {});

    if (filteredData.content) {
      filteredData.sentiment = this.analyzeSentiment(filteredData.content);
    }

    // Gabungkan gambar lama (yang belum dihapus) dengan gambar baru
    const currentImages = journalEntry.images || [];
    const updatedImages = [...currentImages, ...newImages];

    return await prisma.journalEntry.update({
      where: { id: entryId },
      data: { ...filteredData, images: updatedImages },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async deleteJournalImage(userId, entryId, imageIndex) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!journalEntry) throw new Error("Journal entry not found");

    const currentImages = journalEntry.images || [];
    if (imageIndex < 0 || imageIndex >= currentImages.length) {
      throw new Error("Image not found");
    }

    const imagePath = currentImages[imageIndex];
    // Hapus dari array database
    const updatedImages = currentImages.filter(
      (_, index) => index !== parseInt(imageIndex)
    );

    await prisma.journalEntry.update({
      where: { id: entryId },
      data: { images: updatedImages },
    });

    // Hapus file fisik dari disk
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;
    const fullPath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (e) {
        console.error("Gagal hapus file fisik:", e);
      }
    }

    return { message: "Image deleted successfully", images: updatedImages };
  }

  async getJournalEntryById(userId, entryId) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, OR: [{ userId }, { isPublic: true }] },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    if (!journalEntry) throw new Error("Journal entry not found");
    return journalEntry;
  }

  async getUserJournalEntries(userId, filters = {}) {
    const { page = 1, limit = 10, startDate, endDate, tags, search } = filters;
    const skip = (page - 1) * limit;
    const where = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      if (tagsArray.length > 0) where.tags = { hasSome: tagsArray };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return {
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicJournalEntries(filters = {}) {
    const { page = 1, limit = 10, tags, search } = filters;
    const skip = (page - 1) * limit;
    const where = { isPublic: true };

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      if (tagsArray.length > 0) where.tags = { hasSome: tagsArray };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return {
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async deleteJournalEntry(userId, entryId) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId },
    });
    if (!journalEntry) throw new Error("Journal entry not found");

    if (journalEntry.images && journalEntry.images.length > 0) {
      journalEntry.images.forEach((imagePath) => {
        const cleanPath = imagePath.startsWith("/")
          ? imagePath.substring(1)
          : imagePath;
        const fullPath = path.join(process.cwd(), cleanPath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            console.error("Error delete file:", e);
          }
        }
      });
    }
    await prisma.journalEntry.delete({ where: { id: entryId } });
    return { message: "Journal entry deleted successfully" };
  }

  analyzeSentiment(content) {
    if (!content) return 0;
    const positiveWords = [
      "happy",
      "good",
      "great",
      "awesome",
      "love",
      "excited",
    ];
    const negativeWords = [
      "sad",
      "bad",
      "terrible",
      "hate",
      "angry",
      "worried",
    ];
    const words = content.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach((word) => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    return parseFloat(Math.max(-1, Math.min(1, score / 10)).toFixed(2));
  }

  async getJournalAnalytics(userId, timeframe = "30d") {
    // Implementasi analytics sederhana
    return {
      overview: {},
      sentiment: {},
      tags: {},
      wordCount: {},
      recentActivity: [],
    };
  }
}

module.exports = new JournalService();
