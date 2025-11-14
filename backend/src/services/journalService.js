const { prisma } = require("../config/database");

class JournalService {
  async createJournalEntry(userId, journalData) {
    const { title, content, tags, isPublic } = journalData;

    // Basic sentiment analysis (bisa diganti dengan AI service nanti)
    const sentiment = this.analyzeSentiment(content);

    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId,
        title,
        content,
        tags: tags || [],
        sentiment,
        isPublic: isPublic || false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return journalEntry;
  }

  async getJournalEntryById(userId, entryId) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        OR: [
          { userId }, // User's own entries
          { isPublic: true }, // Public entries from other users
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    return journalEntry;
  }

  async getUserJournalEntries(userId, filters = {}) {
    const { page = 1, limit = 10, startDate, endDate, tags, search } = filters;

    const skip = (page - 1) * limit;

    const where = { userId };

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: Array.isArray(tags) ? tags : [tags],
      };
    }

    // Search in title and content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
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

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: Array.isArray(tags) ? tags : [tags],
      };
    }

    // Search in title and content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
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

  async updateJournalEntry(userId, entryId, updateData) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    const allowedUpdates = ["title", "content", "tags", "isPublic"];
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    // Re-analyze sentiment if content changed
    if (filteredData.content) {
      filteredData.sentiment = this.analyzeSentiment(filteredData.content);
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: filteredData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return updatedEntry;
  }

  async deleteJournalEntry(userId, entryId) {
    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });

    if (!journalEntry) {
      throw new Error("Journal entry not found");
    }

    await prisma.journalEntry.delete({
      where: { id: entryId },
    });

    return { message: "Journal entry deleted successfully" };
  }

  async getJournalAnalytics(userId, timeframe = "30d") {
    const startDate = this.calculateStartDate(timeframe);

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Sentiment analysis
    const sentimentStats = this.calculateSentimentStats(entries);

    // Writing frequency
    const writingFrequency = this.calculateWritingFrequency(entries);

    // Common tags
    const commonTags = this.analyzeCommonTags(entries);

    // Word count trends
    const wordCountStats = this.analyzeWordCounts(entries);

    return {
      overview: {
        totalEntries: entries.length,
        averageSentiment: sentimentStats.average,
        writingFrequency,
        averageWordCount: wordCountStats.average,
      },
      sentiment: sentimentStats,
      tags: commonTags,
      wordCount: wordCountStats,
      recentActivity: entries.slice(0, 5),
    };
  }

  // Basic sentiment analysis (bisa diganti dengan TensorFlow.js atau external API)
  analyzeSentiment(content) {
    const positiveWords = [
      "happy",
      "good",
      "great",
      "awesome",
      "amazing",
      "love",
      "excited",
      "wonderful",
      "fantastic",
      "excellent",
    ];
    const negativeWords = [
      "sad",
      "bad",
      "terrible",
      "awful",
      "hate",
      "angry",
      "frustrated",
      "disappointed",
      "worried",
      "anxious",
    ];

    const words = content.toLowerCase().split(/\s+/);
    let score = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });

    // Normalize score between -1 and 1
    const normalizedScore = Math.max(-1, Math.min(1, score / 10));
    return parseFloat(normalizedScore.toFixed(2));
  }

  calculateSentimentStats(entries) {
    const sentiments = entries
      .map((entry) => entry.sentiment)
      .filter((s) => s !== null);

    if (sentiments.length === 0) {
      return {
        average: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
      };
    }

    const average =
      sentiments.reduce((sum, sentiment) => sum + sentiment, 0) /
      sentiments.length;

    const positive = sentiments.filter((s) => s > 0.1).length;
    const negative = sentiments.filter((s) => s < -0.1).length;
    const neutral = sentiments.filter((s) => s >= -0.1 && s <= 0.1).length;

    return {
      average: parseFloat(average.toFixed(2)),
      positive,
      negative,
      neutral,
      total: sentiments.length,
    };
  }

  calculateWritingFrequency(entries) {
    const frequency = {};
    entries.forEach((entry) => {
      const date = entry.createdAt.toISOString().split("T")[0];
      frequency[date] = (frequency[date] || 0) + 1;
    });

    return {
      daily: frequency,
      totalDays: Object.keys(frequency).length,
      entriesPerDay: parseFloat(
        (entries.length / Math.max(1, Object.keys(frequency).length)).toFixed(2)
      ),
    };
  }

  analyzeCommonTags(entries) {
    const tagCounts = {};
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [tag, count]) => {
        obj[tag] = count;
        return obj;
      }, {});

    return sortedTags;
  }

  analyzeWordCounts(entries) {
    const wordCounts = entries.map((entry) => {
      const words = entry.content
        .split(/\s+/)
        .filter((word) => word.length > 0);
      return words.length;
    });

    const average =
      wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
    const max = Math.max(...wordCounts);
    const min = Math.min(...wordCounts);

    return {
      average: parseFloat(average.toFixed(0)),
      max,
      min,
      totalWords: wordCounts.reduce((sum, count) => sum + count, 0),
    };
  }

  calculateStartDate(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "30d":
        return new Date(now.setDate(now.getDate() - 30));
      case "90d":
        return new Date(now.setDate(now.getDate() - 90));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  }
}

module.exports = new JournalService();
