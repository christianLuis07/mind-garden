const { prisma } = require("../config/database");
const { sanitizeContent } = require("../utils/sanitizer");
const fileUploadService = require("./fileUploadService");
const sentimentService = require("./sentimentService");

class JournalService {
  async createJournalEntry(userId, journalData, files) {
    const title = journalData.title ? sanitizeContent(journalData.title) : "";
    const content = sanitizeContent(journalData.content || "");
    const { tags, isPublic } = journalData;

    // Ambil URL dari Cloudinary yang sudah diproses oleh multer
    const imageUrls = files ? files.map((file) => file.path) : [];

    // Legacy sentiment analysis
    const sentimentScore = this.analyzeSentimentLegacy(content);

    // AI-Driven Sentiment Analysis & Risk Scoring (Lokal)
    const { sentiment: aiSentiment, risk_score: riskScore } = await sentimentService.analyzeJournal(content);

    const isPublicBool = isPublic === "true" || isPublic === true;

    return await prisma.journalEntry.create({
      data: {
        userId,
        title,
        content,
        tags: tags || [],
        sentimentScore,
        aiSentiment,
        riskScore,
        isPublic: isPublicBool,
        images: imageUrls,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async updateJournalEntry(userId, entryId, updateData, files) {
    // 1. Cek exist + ownership sekaligus (aman, tidak leak info)
    const journalEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!journalEntry) {
      const error = new Error("Journal entry not found");
      error.statusCode = 404;
      throw error;
    }

    // 2. Ambil URL gambar baru dari Cloudinary (multer)
    const newImages = files ? files.map((file) => file.path) : [];

    // 3. Filter field yang boleh diupdate
    const allowedUpdates = ["title", "content", "tags", "isPublic"];
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        if (key === "isPublic") {
          obj[key] = updateData[key] === "true" || updateData[key] === true;
        } else if (key === "title" || key === "content") {
          obj[key] = sanitizeContent(updateData[key]);
        } else {
          obj[key] = updateData[key];
        }
        return obj;
      }, {});


    // 4. Analisis sentiment kalau content diupdate
    if (filteredData.content) {
      filteredData.sentimentScore = this.analyzeSentimentLegacy(filteredData.content);
      
      const { sentiment: aiSentiment, risk_score: riskScore } = await sentimentService.analyzeJournal(filteredData.content);
      filteredData.aiSentiment = aiSentiment;
      filteredData.riskScore = riskScore;
    }

    // 5. Gabung gambar lama + baru
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

    // Hapus dari Cloudinary jika URL-nya dari sana
    if (imagePath.includes("cloudinary.com")) {
      try {
        const publicId = fileUploadService.extractPublicId(imagePath);
        if (publicId) {
          await fileUploadService.deleteImage(publicId);
        }
      } catch (e) {
        console.error("Gagal hapus file Cloudinary:", e);
      }
    } else if (imagePath.startsWith("/uploads/journal/")) {
      // Logika aman untuk hapus file lokal legacy
      try {
        const path = require("path");
        const fs = require("fs");
        const fileName = path.basename(imagePath);
        const fullPath = path.join(process.cwd(), "uploads", "journal", fileName);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (e) {
        console.error("Gagal hapus file lokal legacy:", e);
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
      const path = require("path");
      const fs = require("fs");
      for (const imagePath of journalEntry.images) {
        if (imagePath.includes("cloudinary.com")) {
          try {
            const publicId = fileUploadService.extractPublicId(imagePath);
            if (publicId) {
              await fileUploadService.deleteImage(publicId);
            }
          } catch (e) {
            console.error("Error delete Cloudinary file:", e);
          }
        } else if (imagePath.startsWith("/uploads/journal/")) {
          try {
            const fileName = path.basename(imagePath);
            const fullPath = path.join(process.cwd(), "uploads", "journal", fileName);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          } catch (e) {
            console.error("Error delete legacy local file:", e);
          }
        }
      }
    }
    await prisma.journalEntry.delete({ where: { id: entryId } });
    return { message: "Journal entry deleted successfully" };
  }

  analyzeSentimentLegacy(content) {
    if (!content) return 0;
    const positiveWords = [
      "happy", "good", "great", "awesome", "love", "excited",
      "senang", "bahagia", "gembira", "bersyukur", "semangat",
      "lega", "cinta", "sayang", "suka", "bagus", "hebat",
      "keren", "nyaman", "optimis", "bangga", "damai", "indah",
      "asyik", "seru", "baik", "aman", "tenang", "produktif", "puas"
    ];
    const negativeWords = [
      "sad", "bad", "terrible", "hate", "angry", "worried",
      "sedih", "marah", "kecewa", "kesal", "benci", "takut",
      "cemas", "khawatir", "gelisah", "buruk", "jelek", "hancur",
      "gagal", "lelah", "capek", "sakit", "stres", "depresi",
      "pusing", "bingung", "kesepian", "hampa", "putus", "parah",
      "payah", "malas", "bosan", "menangis", "berantakan", "hancur"
    ];

    // Hapus tag HTML
    let cleanContent = content.replace(/<[^>]*>/g, " ");

    // Hapus semua tanda baca, angka, dan karakter selain huruf (hanya sisakan a-z dan spasi)
    cleanContent = cleanContent.toLowerCase().replace(/[^a-z\s]/g, " ");

    const words = cleanContent.split(/\s+/);

    let score = 0;
    words.forEach((word) => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });

    // Normalisasi: 5 kata positif/negatif cukup untuk mencapai skor maksimal (+1.0 atau -1.0)
    return parseFloat(Math.max(-1, Math.min(1, score / 5)).toFixed(2));
  }

  async getJournalAnalytics(userId, timeframe = "30d") {
    let startDate = null;
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    if (timeframe === "7h" || timeframe === "7d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "30h" || timeframe === "30d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "90h" || timeframe === "90d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 90);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "1t" || timeframe === "1y") {
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const whereClause = { userId };
    if (startDate) {
      whereClause.createdAt = { gte: startDate };
    }

    const entries = await prisma.journalEntry.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const analytics = {
      overview: {
        totalEntries: 0,
        averageSentiment: 0,
        totalWords: 0,
        writingFrequency: { daily: {}, totalDays: 0, entriesPerDay: 0 },
      },
      sentiment: { average: 0, positive: 0, negative: 0, neutral: 0, total: 0 },
      tags: {},
      wordCount: { average: 0, max: 0, min: 0, totalWords: 0 },
      recentActivity: entries.slice(0, 5),
    };

    if (entries.length === 0) return analytics;

    analytics.overview.totalEntries = entries.length;
    analytics.sentiment.total = entries.length;

    let totalSentimentScore = 0;
    let maxWords = 0;
    let minWords = Infinity;
    const dailyCounts = {};

    entries.forEach((entry) => {
      const cleanText = entry.content ? entry.content.replace(/<[^>]*>/g, "").trim() : "";
      const words = cleanText.split(/\s+/).filter((w) => w.length > 0).length;

      analytics.wordCount.totalWords += words;
      if (words > maxWords) maxWords = words;
      if (words < minWords) minWords = words;

      const score = entry.sentimentScore || 0;
      totalSentimentScore += score;
      if (score > 0.1) analytics.sentiment.positive++;
      else if (score < -0.1) analytics.sentiment.negative++;
      else analytics.sentiment.neutral++;

      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => {
          analytics.tags[tag] = (analytics.tags[tag] || 0) + 1;
        });
      }

      const dateKey = new Date(entry.createdAt).toISOString().split("T")[0];
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    });

    if (minWords === Infinity) minWords = 0;

    analytics.wordCount.max = maxWords;
    analytics.wordCount.min = minWords;
    analytics.wordCount.average = Math.round(analytics.wordCount.totalWords / entries.length);
    analytics.overview.totalWords = analytics.wordCount.totalWords;

    const avgSentiment = totalSentimentScore / entries.length;
    analytics.sentiment.average = parseFloat(avgSentiment.toFixed(2));
    analytics.overview.averageSentiment = analytics.sentiment.average;

    const activeDays = Object.keys(dailyCounts).length;
    let timeframeDays = activeDays;

    // Estimate timeframe days for entriesPerDay calculation if timeframe is specified
    if (startDate) {
      const timeDiff = now.getTime() - startDate.getTime();
      timeframeDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    analytics.overview.writingFrequency.daily = dailyCounts;
    analytics.overview.writingFrequency.totalDays = activeDays;
    analytics.overview.writingFrequency.entriesPerDay = timeframeDays > 0 ? parseFloat((entries.length / timeframeDays).toFixed(1)) : 0;

    return analytics;
  }
}

module.exports = new JournalService();
